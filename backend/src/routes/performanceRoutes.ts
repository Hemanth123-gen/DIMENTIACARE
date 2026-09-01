import { Router } from 'express';
import { analyticsService } from '../services/analyticsService';
import { initialGames } from '../data/seedData';

const router = Router();

// Retrieve analytics computed from records passed in query
router.get('/performance/:patientId', (req, res) => {
  let records: any[] = [];
  try {
    if (req.query.records) {
      records = JSON.parse(req.query.records as string);
    }
  } catch (e) {
    records = [];
  }

  const stats = analyticsService.calculateCognitiveAreas(records);
  res.json({
    patientId: req.params.patientId,
    stats,
    gamesSummary: initialGames
  });
});

router.get('/performance/:patientId/:gameId', (req, res) => {
  let records: any[] = [];
  try {
    if (req.query.records) {
      records = JSON.parse(req.query.records as string);
    }
  } catch (e) {
    records = [];
  }

  const gameRecords = records.filter(r => r.gameId === req.params.gameId);
  const total = gameRecords.length;
  const completed = gameRecords.filter(r => r.completed ?? true).length;
  const avgScore = total ? Math.round(gameRecords.reduce((a, b) => a + b.score, 0) / total) : 0;
  const avgAccuracy = total ? Math.round(gameRecords.reduce((a, b) => a + b.accuracy, 0) / total) : 0;

  res.json({
    gameId: req.params.gameId,
    totalSessions: total,
    completedSessions: completed,
    averageScore: avgScore,
    averageAccuracy: avgAccuracy,
    bestScore: total ? Math.max(...gameRecords.map(r => r.score)) : 0
  });
});

export default router;
