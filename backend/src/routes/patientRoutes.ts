import { Router } from 'express';
import { patientProfile } from '../data/seedData';

const router = Router();

router.get('/patient', (req, res) => {
  res.json(patientProfile);
});

export default router;
