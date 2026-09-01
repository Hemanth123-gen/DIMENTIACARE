import { Router } from 'express';
import { Reminder } from '../models/types';
import { initialReminders } from '../data/seedData';

const router = Router();

router.get('/reminders', (req, res) => {
  res.json(initialReminders);
});

router.post('/reminders', (req, res) => {
  const reminder: Reminder = {
    id: `rem-${Date.now()}`,
    patientId: req.body.patientId || 'patient-ravi',
    category: req.body.category || 'other',
    title: req.body.title || 'Notification',
    description: req.body.description || '',
    time: req.body.time || '12:00',
    date: req.body.date || '2026-08-28',
    status: 'Upcoming',
    repeat: req.body.repeat || 'Daily',
    enabled: true
  };
  res.json(reminder);
});

router.put('/reminders/:id', (req, res) => {
  const reminder: Reminder = {
    id: req.params.id,
    patientId: req.body.patientId || 'patient-ravi',
    category: req.body.category,
    title: req.body.title,
    description: req.body.description,
    time: req.body.time,
    date: req.body.date,
    status: req.body.status,
    repeat: req.body.repeat,
    enabled: req.body.enabled ?? true
  };
  res.json(reminder);
});

router.delete('/reminders/:id', (req, res) => {
  res.json({ success: true, id: req.params.id });
});

router.post('/reminders/:id/complete', (req, res) => {
  const reminder = { ...req.body, status: 'Completed' };
  // Alert created on caregiver dashboard
  res.json({
    success: true,
    reminder,
    alert: {
      id: `al-${Date.now()}`,
      type: 'success',
      title: `${reminder.title} completed`,
      createdAt: 'Just now'
    }
  });
});

router.post('/reminders/:id/snooze', (req, res) => {
  const timeStr = req.body.time || '12:00';
  const [hours, minutes] = timeStr.split(':').map(Number);
  let newMinutes = minutes + 15;
  let newHours = hours;
  if (newMinutes >= 60) {
    newMinutes -= 60;
    newHours = (newHours + 1) % 24;
  }
  const snoozedTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;

  const reminder = { ...req.body, time: snoozedTime };
  res.json({
    success: true,
    reminder,
    alert: {
      id: `al-${Date.now()}`,
      type: 'info',
      title: `${reminder.title} snoozed for 15m`,
      createdAt: 'Just now'
    }
  });
});

export default router;
