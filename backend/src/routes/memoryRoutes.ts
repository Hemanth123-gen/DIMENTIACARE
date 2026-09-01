import { Router } from 'express';
import { Memory } from '../models/types';
import { initialMemories } from '../data/seedData';

const router = Router();

router.get('/memories', (req, res) => {
  res.json(initialMemories);
});

router.post('/memories', (req, res) => {
  const memory: Memory = {
    id: `mem-${Date.now()}`,
    patientId: req.body.patientId || 'patient-ravi',
    title: req.body.title || 'New Memory',
    description: req.body.description || '',
    date: req.body.date || '2026-08-28',
    category: req.body.category || 'other',
    people: req.body.people || '',
    image: req.body.image || null
  };

  res.json(memory);
});

router.put('/memories/:id', (req, res) => {
  const memory: Memory = {
    id: req.params.id,
    patientId: req.body.patientId || 'patient-ravi',
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    category: req.body.category,
    people: req.body.people,
    image: req.body.image
  };

  res.json(memory);
});

router.delete('/memories/:id', (req, res) => {
  res.json({ success: true, id: req.params.id });
});

export default router;
