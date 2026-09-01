import { Router } from 'express';
import { Activity } from '../models/types';
import { initialSchedule } from '../data/seedData';

const router = Router();

router.get('/schedule', (req, res) => {
  res.json(initialSchedule);
});

router.post('/schedule', (req, res) => {
  const item: Activity = {
    id: `sch-${Date.now()}`,
    time: req.body.time || '12:00 PM',
    title: req.body.title || 'Activity',
    completed: false
  };
  res.json(item);
});

router.put('/schedule/:id', (req, res) => {
  const item: Activity = {
    id: req.params.id,
    time: req.body.time,
    title: req.body.title,
    completed: req.body.completed ?? false,
    isCurrent: req.body.isCurrent
  };
  res.json(item);
});

router.delete('/schedule/:id', (req, res) => {
  res.json({ success: true, id: req.params.id });
});

router.post('/schedule/:id/complete', (req, res) => {
  const item = { ...req.body, completed: !req.body.completed };
  res.json({
    success: true,
    activity: item,
    alert: {
      id: `al-${Date.now()}`,
      type: 'success',
      title: `Task completed: ${item.title}`,
      createdAt: 'Just now'
    }
  });
});

export default router;
