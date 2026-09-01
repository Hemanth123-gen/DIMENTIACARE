import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Create HTTP server from Express app
const server = http.createServer(app);

// Create WebSocket server attached to the HTTP server on /voice/stream
const wss = new WebSocketServer({ server, path: '/voice/stream' });

// Lazy-load the stream handler to avoid circular deps
import('./routes/voiceStreamRoute').then(({ createVoiceStreamHandler }) => {
  wss.on('connection', (ws: WebSocket) => {
    console.log('[WS] Voice stream client connected');
    createVoiceStreamHandler(ws);
  });

  wss.on('error', (err: Error) => {
    console.error('[WS] WebSocket server error:', err);
  });
}).catch((err: Error) => {
  console.error('[WS] Failed to load voice stream handler:', err);
});

server.listen(Number(PORT), HOST, () => {
  console.log(`[Second Brain] Backend started on http://${HOST}:${PORT}`);
  console.log(`[Second Brain] WebSocket voice stream on ws://${HOST}:${PORT}/voice/stream`);
  console.log(`[Second Brain] Offline mode enabled`);
});
