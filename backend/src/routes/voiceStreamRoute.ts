import { WebSocket } from 'ws';
import { whisperService } from '../services/whisperService';
import { commandExecutor } from '../services/commandExecutor';
import path from 'path';
import fs from 'fs';

// WAV header writer for raw PCM streams
function buildWavHeader(pcmByteLength: number, sampleRate: number, channels = 1, bitsPerSample = 16): Buffer {
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcmByteLength, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);           // chunk size
  header.writeUInt16LE(1, 20);            // PCM format
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * channels * (bitsPerSample / 8), 28); // byte rate
  header.writeUInt16LE(channels * (bitsPerSample / 8), 32);  // block align
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcmByteLength, 40);
  return header;
}

function send(ws: WebSocket, msg: object): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
  }
}

export function createVoiceStreamHandler(ws: WebSocket): void {
  const chunks: Buffer[] = [];
  let sampleRate = 16000;
  let language = 'en';
  let originalLanguage = 'English';
  let patientId = 'ravi-demo';
  let contextData: any = {};
  let sessionActive = false;
  let transcriptionInProgress = false;

  console.log('[WS] New voice stream session');

  ws.on('message', async (data: Buffer | string) => {
    // Text messages are control signals (JSON)
    if (typeof data === 'string') {
      try {
        const msg = JSON.parse(data);
        if (msg.type === 'start') {
          chunks.length = 0;
          sessionActive = true;
          transcriptionInProgress = false;
          sampleRate = msg.sampleRate || 16000;
          language = msg.language || 'en';
          originalLanguage = msg.originalLanguage || 'English';
          patientId = msg.patientId || 'ravi-demo';
          contextData = msg.contextData || {};
          console.log(`[WS] Session started - sampleRate=${sampleRate}, lang=${language}, originalLang=${originalLanguage}`);
          send(ws, { type: 'status', status: 'listening' });
        } else if (msg.type === 'stop') {
          if (!sessionActive) return;
          sessionActive = false;
          console.log(`[WS] Session stop - collected ${chunks.length} chunks`);
          await processAndTranscribe();
        } else if (msg.type === 'cancel') {
          sessionActive = false;
          chunks.length = 0;
          console.log('[WS] Session cancelled');
          send(ws, { type: 'status', status: 'cancelled' });
        }
      } catch (e) {
        console.error('[WS] Failed to parse control message:', e);
      }
      return;
    }

    // Binary messages are PCM16 audio chunks
    if (sessionActive && !transcriptionInProgress) {
      chunks.push(Buffer.from(data));

      // Send a heartbeat partial to show mic is active
      const totalBytes = chunks.reduce((s, c) => s + c.length, 0);
      const durationSec = totalBytes / (sampleRate * 2); // 16-bit = 2 bytes per sample
      if (durationSec >= 1.0 && durationSec % 1 < 0.05) {
        // Every ~1s of audio, send a partial "listening" pulse
        send(ws, { type: 'partial', text: '' });
      }
    }
  });

  ws.on('close', () => {
    console.log('[WS] Voice stream client disconnected');
    sessionActive = false;
  });

  ws.on('error', (err: Error) => {
    console.error('[WS] WebSocket error:', err);
  });

  async function processAndTranscribe(): Promise<void> {
    if (chunks.length === 0) {
      send(ws, { type: 'error', error: 'empty-recording' });
      return;
    }

    transcriptionInProgress = true;
    send(ws, { type: 'status', status: 'processing' });

    // Merge all PCM chunks
    const pcmBuffer = Buffer.concat(chunks);
    chunks.length = 0;

    const totalBytes = pcmBuffer.length;
    const durationSec = totalBytes / (sampleRate * 2);
    console.log(`[WS] Processing ${totalBytes} bytes (${durationSec.toFixed(2)}s) at ${sampleRate}Hz`);

    // Build WAV from raw PCM16
    const wavHeader = buildWavHeader(totalBytes, sampleRate);
    const wavBuffer = Buffer.concat([wavHeader, pcmBuffer]);

    try {
      // Transcribe using Whisper (proven working, fully local)
      const transcript = await whisperService.transcribe(wavBuffer, language);

      if (!transcript || transcript.trim().length === 0) {
        send(ws, { type: 'error', error: 'empty-transcript' });
        transcriptionInProgress = false;
        return;
      }

      console.log(`[WS] Transcript: "${transcript}"`);
      send(ws, { type: 'transcript', text: transcript });

      // Parse the command using commandExecutor which uses LLM first
      const parsed = await commandExecutor.execute(transcript, originalLanguage, patientId, contextData);

      console.log(`[WS] Intent: ${parsed.intent}`);
      send(ws, {
        type: 'command',
        transcript,
        intent: parsed.intent,
        path: parsed.action?.target,
        response: parsed.response,
        activityData: parsed.activityData,
        languageValue: parsed.languageValue,
        gameId: parsed.gameId
      });

    } catch (err: any) {
      console.error('[WS] Transcription error:', err);
      send(ws, { type: 'error', error: err.message || 'transcription-failed' });
    }

    transcriptionInProgress = false;
  }
}
