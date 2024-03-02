import { login } from '@auth/controllers.ts/signin';
import { signUp } from '@auth/controllers.ts/signup';
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/signup', signUp);

authRouter.post('/signin', login);

export default authRouter;
