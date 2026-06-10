import { Router } from 'express';
import { getProfile, completeOnboarding } from '../controllers/profileController.js';

const router = Router();

router.get('/', getProfile);
router.patch('/onboarding', completeOnboarding);

export default router;
