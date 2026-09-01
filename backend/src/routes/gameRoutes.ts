import { Router } from 'express';
import { gameService } from '../services/gameService';
import { adaptiveEngine } from '../services/adaptiveEngine';
import { validateGameSubmission } from '../utils/validation';

const router = Router();
const activeSessions = new Map<string, any>();

router.post('/games/sequence-order/start', (req, res) => {
  const level = Number(req.body.level || 1);
  const patientId = req.body.patientId || 'patient-ravi';
  const sessionId = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const config = gameService.generateConfig('game-2', level);
  const session = {
    sessionId,
    patientId,
    gameId: 'game-2',
    level,
    startedAt: new Date().toISOString(),
    config
  };
  activeSessions.set(sessionId, session);
  res.json({
    sessionId,
    gameId: 'sequence-order',
    level,
    config
  });
});

router.post('/games/sequence-order/submit', (req, res) => {
  const validated = validateGameSubmission({ ...req.body, gameId: 'game-2' });
  const calculation = gameService.calculateResult('game-2', validated.level, req.body);
  const previousSessions = req.body.previousSessions || [];
  const adaptiveOutput = adaptiveEngine.processPerformance({
    score: calculation.score,
    accuracy: calculation.accuracy,
    mistakes: calculation.mistakes,
    duration: calculation.duration,
    level: validated.level,
    gameId: 'game-2',
    previousSessions
  });
  let scoreNoticeableDrop = false;
  if (previousSessions.length > 0) {
    const historicalAvg = previousSessions.reduce((a: number, b: any) => a + b.score, 0) / previousSessions.length;
    if (calculation.score < historicalAvg - 20) {
      scoreNoticeableDrop = true;
    }
  }
  if (req.body.sessionId) {
    activeSessions.delete(req.body.sessionId);
  }
  res.json({
    success: true,
    score: calculation.score,
    accuracy: calculation.accuracy,
    mistakes: calculation.mistakes,
    duration: calculation.duration,
    classification: adaptiveOutput.classification,
    recommendation: adaptiveOutput.recommendation,
    adaptiveResult: adaptiveOutput.adaptiveResult,
    scoreNoticeableDrop
  });
});

router.post('/games/:gameId/start', (req, res) => {
  const { gameId } = req.params;
  const level = Number(req.body.level || 1);
  const patientId = req.body.patientId || 'patient-ravi';

  const sessionId = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const config = gameService.generateConfig(gameId, level);

  const session = {
    sessionId,
    patientId,
    gameId,
    level,
    startedAt: new Date().toISOString(),
    config
  };

  activeSessions.set(sessionId, session);
  console.log(`[Second Brain] Game session started: ${sessionId} for game ${gameId}`);

  res.json({
    sessionId,
    gameId,
    level,
    config
  });
});

router.post('/games/:gameId/submit', (req, res) => {
  const { gameId } = req.params;
  const validated = validateGameSubmission({ ...req.body, gameId });

  // Try to find the active session
  const session = activeSessions.get(req.body.sessionId);
  
  // Calculate scoring
  const calculation = gameService.calculateResult(gameId, validated.level, req.body);

  // Compute adaptive response
  const previousSessions = req.body.previousSessions || [];
  const adaptiveOutput = adaptiveEngine.processPerformance({
    score: calculation.score,
    accuracy: calculation.accuracy,
    mistakes: calculation.mistakes,
    duration: calculation.duration,
    level: validated.level,
    gameId,
    previousSessions
  });

  // Calculate caregiver warning if score dropped compared to history
  let scoreNoticeableDrop = false;
  if (previousSessions.length > 0) {
    const historicalAvg = previousSessions.reduce((a: number, b: any) => a + b.score, 0) / previousSessions.length;
    if (calculation.score < historicalAvg - 20) {
      scoreNoticeableDrop = true;
    }
  }

  // Remove session
  if (req.body.sessionId) {
    activeSessions.delete(req.body.sessionId);
  }

  console.log(`[Second Brain] Performance processed: ${gameId} score=${calculation.score}`);

  res.json({
    success: true,
    score: calculation.score,
    accuracy: calculation.accuracy,
    mistakes: calculation.mistakes,
    duration: calculation.duration,
    classification: adaptiveOutput.classification,
    recommendation: adaptiveOutput.recommendation,
    adaptiveResult: adaptiveOutput.adaptiveResult,
    scoreNoticeableDrop
  });
});

export default router;
