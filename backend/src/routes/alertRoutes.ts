import { Router } from 'express';
import { initialAlerts } from '../data/seedData';

const router = Router();

router.get('/alerts', (req, res) => {
  res.json(initialAlerts);
});

router.post('/alerts', (req, res) => {
  const alert = {
    id: `al-${Date.now()}`,
    type: req.body.type || 'info',
    title: req.body.title || 'New Alert',
    message: req.body.message || '',
    createdAt: 'Just now'
  };
  res.json(alert);
});

export default router;
