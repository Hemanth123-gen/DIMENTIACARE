import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'second-brain-local-backend',
    offline: true
  });
});

export default router;
