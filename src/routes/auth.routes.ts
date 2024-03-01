import { signUp } from '@auth/controllers.ts/signup';
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/signup', signUp);

export default authRouter;
