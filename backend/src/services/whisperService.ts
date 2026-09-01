import { execFile } from 'child_process';
import path from 'path';
import fs from 'fs';

const getWhisperDir = (): string => {
  let dir = path.resolve(process.cwd(), 'models', 'whisper');
  if (
    fs.existsSync(path.join(dir, 'whisper-cli.exe')) ||
    fs.existsSync(path.join(dir, 'whisper-cli')) ||
    fs.existsSync(path.join(dir, 'main.exe')) ||
    fs.existsSync(path.join(dir, 'main'))
  ) {
    return dir;
  }
  dir = path.resolve(process.cwd(), 'backend', 'models', 'whisper');
  if (
    fs.existsSync(path.join(dir, 'whisper-cli.exe')) ||
    fs.existsSync(path.join(dir, 'whisper-cli')) ||
    fs.existsSync(path.join(dir, 'main.exe')) ||
    fs.existsSync(path.join(dir, 'main'))
  ) {
    return dir;
  }
  dir = path.resolve(__dirname, '..', '..', 'models', 'whisper');
  if (
    fs.existsSync(path.join(dir, 'whisper-cli.exe')) ||
    fs.existsSync(path.join(dir, 'whisper-cli')) ||
    fs.existsSync(path.join(dir, 'main.exe')) ||
    fs.existsSync(path.join(dir, 'main'))
  ) {
    return dir;
  }
  return path.resolve(process.cwd(), 'backend', 'models', 'whisper');
};

function cleanWhisperOutput(rawOutput: string): string {
  if (!rawOutput) return '';

  const lines = rawOutput.split(/\r?\n/);
  const speechLines: string[] = [];

  for (const line of lines) {
    let trimmed = line.trim();
    if (!trimmed) continue;

    // Skip metadata / system log lines from whisper-cli
    if (
      trimmed.startsWith('load_backend:') ||
      trimmed.startsWith('whisper_') ||
      trimmed.startsWith('read_audio_data:') ||
      trimmed.startsWith('system_info:') ||
      trimmed.startsWith('main:') ||
      trimmed.startsWith('ggml_') ||
      trimmed.startsWith('llama_')
    ) {
      continue;
    }

    // Strip timestamp brackets like [00:00:00.000 --> 00:00:03.000] or [00:00.000 --> 00:03.000]
    trimmed = trimmed.replace(/\[\d{2}:?\d{2}:\d{2}\.\d{3}\s*-->\s*\d{2}:?\d{2}:\d{2}\.\d{3}\]/g, '').trim();
    trimmed = trimmed.replace(/\[\d{2}:\d{2}\.\d{3}\s*-->\s*\d{2}:\d{2}\.\d{3}\]/g, '').trim();

    if (trimmed.length > 0) {
      speechLines.push(trimmed);
    }
  }

  return speechLines.join(' ').trim();
}

export const whisperService = {
  getExecutablePath(): string | null {
    const envPath = process.env.WHISPER_PATH;
    if (envPath && fs.existsSync(envPath)) {
      return envPath;
    }
    const dir = getWhisperDir();
    const defaultExe = path.join(dir, 'whisper-cli.exe');
    const alternativeExe = path.join(dir, 'main.exe');

    if (fs.existsSync(defaultExe)) {
      return defaultExe;
    }
    if (fs.existsSync(alternativeExe)) {
      return alternativeExe;
    }
    return null;
  },

  getModelPath(): string | null {
    const envModel = process.env.WHISPER_MODEL;
    if (envModel && fs.existsSync(envModel)) {
      return envModel;
    }
    const dir = getWhisperDir();
    const tinyModel = path.join(dir, 'ggml-tiny.bin');
    if (fs.existsSync(tinyModel)) {
      return tinyModel;
    }
    const defaultModel = path.join(dir, 'ggml-tiny.en.bin');
    if (fs.existsSync(defaultModel)) {
      return defaultModel;
    }
    // Search for any ggml *.bin model in WHISPER_DIR
    if (fs.existsSync(dir)) {
      try {
        const files = fs.readdirSync(dir);
        const modelFile = files.find(f => f.startsWith('ggml') && f.endsWith('.bin'));
        if (modelFile) {
          return path.join(dir, modelFile);
        }
      } catch (e) {
        console.error('[STT] Failed to read whisper directory', e);
      }
    }
    return null;
  },

  ensureDirExists() {
    const dir = getWhisperDir();
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  },

  async transcribe(audioBuffer: Buffer, language?: string): Promise<string> {
    this.ensureDirExists();
    const exePath = this.getExecutablePath();
    const modelPath = this.getModelPath();

    console.log('[STT] Transcription request received');
    console.log(`[STT] WAV size: ${audioBuffer.length} bytes`);
    console.log('[STT] WAV format: PCM16 mono 16000Hz');

    if (!exePath || !modelPath) {
      console.error(`[STT] Error: Whisper executable or model not found. EXE: ${exePath}, Model: ${modelPath}`);
      throw new Error(`Whisper model or executable not found. Configured EXE: ${exePath || 'Not found'}, Model: ${modelPath || 'Not found'}`);
    }

    console.log(`[STT] Model: ${modelPath}`);

    const tempDir = path.resolve(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempAudioPath = path.join(tempDir, `audio_${Date.now()}.wav`);
    fs.writeFileSync(tempAudioPath, audioBuffer);

    // Determine ISO-639-1 language code: default to 'en'
    const langCode = (language && language.trim().length > 0) ? language.trim() : 'en';

    return new Promise((resolve, reject) => {
      // -nt strips timestamps, -l sets language code
      const args = ['-m', modelPath, '-f', tempAudioPath, '-nt', '-l', langCode];
      console.log('[STT] Whisper process started');

      execFile(exePath, args, { encoding: 'utf8' }, (error, stdout, stderr) => {
        const exitCode = error ? (error.code || 1) : 0;
        console.log(`[STT] Whisper exit code: ${exitCode}`);
        if (stdout) console.log(`[STT] Raw output received`);
        if (stderr && exitCode !== 0) console.log(`[STT] Whisper stderr: ${stderr.slice(0, 300)}`);

        // Cleanup temporary audio file
        try {
          if (fs.existsSync(tempAudioPath)) {
            fs.unlinkSync(tempAudioPath);
          }
        } catch (e) {
          console.error('[STT] Failed to delete temp audio file', e);
        }

        if (error) {
          console.error('[STT] Whisper execution error:', error);
          return reject(new Error(`Whisper execution failed with exit code ${exitCode}`));
        }

        const cleanTranscript = cleanWhisperOutput(stdout);
        if (!cleanTranscript) {
          console.warn('[STT] Empty speech output after cleaning metadata');
          return reject(new Error('Could not understand the speech. Please try again.'));
        }

        console.log(`[STT] Clean transcript: "${cleanTranscript}"`);
        resolve(cleanTranscript);
      });
    });
  }
};

