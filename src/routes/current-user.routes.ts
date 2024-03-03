import { getCurrentUser, resendEmail } from '@auth/controllers/current-user';
import { Router } from 'express';

const currentUserRouter = Router();

currentUserRouter.get('/current-user', getCurrentUser);

currentUserRouter.post('/resend-email', resendEmail);

export default currentUserRouter;
