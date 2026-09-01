import { Router } from 'express';
import { analyticsService } from '../services/analyticsService';
import { patientProfile } from '../data/seedData';

const router = Router();

const parseJson = (param: any, defaultValue: any) => {
  try {
    return param ? JSON.parse(param as string) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const CAREGIVER_REGISTRY: Record<string, { password: string; assignedPatients: string[] }> = {
  caregiver: {
    password: 'caregiver123',
    assignedPatients: ['ramesh_1', 'ravi-demo']
  }
};

router.get('/caregiver/dashboard/:patientId', (req, res) => {
  const patientId = req.params.patientId;
  const caregiverId = req.headers['x-caregiver-id'] as string;
  const caregiverToken = req.headers['x-caregiver-token'] as string;

  // 1. Verify authenticated caregiver headers are present
  if (!caregiverId || !caregiverToken) {
    return res.status(401).json({ error: 'Caregiver authentication required' });
  }

  // 2. Verify caregiver identity/credentials
  const caregiver = CAREGIVER_REGISTRY[caregiverId];
  if (!caregiver || caregiver.password !== caregiverToken) {
    return res.status(401).json({ error: 'Invalid caregiver credentials' });
  }

  // 3 & 4. Verify caregiver-patient assignment authorization
  if (!caregiver.assignedPatients.includes(patientId)) {
    return res.status(403).json({ error: 'Access denied: Patient is not assigned to this caregiver' });
  }

  const reminders = parseJson(req.query.reminders, []);
  const schedule = parseJson(req.query.schedule, []);
  const records = parseJson(req.query.records, []);
  const alerts = parseJson(req.query.alerts, []);
  const mood = (req.query.mood as string) || 'Good';

  // Calculate statistics dynamically
  const gamesTotal = 5;
  const gamesCompleted = records.filter((r: any) => r.completedToday ?? true).length;

  const tasksTotal = schedule.length;
  const tasksCompleted = schedule.filter((s: any) => s.completed).length;

  const remindersTotal = reminders.length;
  const remindersTaken = reminders.filter((r: any) => r.status === 'Completed').length;

  const performance = analyticsService.calculateCognitiveAreas(records);
  const activityOverview = analyticsService.generateTrends(records);

  res.json({
    patient: patientProfile,
    summary: {
      gamesCompleted,
      gamesTotal,
      tasksCompleted,
      tasksTotal,
      remindersTaken,
      remindersTotal,
      mood
    },
    performance,
    activityOverview,
    schedule,
    alerts
  });
});

export default router;
