import { findAuthUserById, findAuthUserByVerificationToken, updateVerifyEmailField } from '@auth/services/auth.service';
import { BadRequestError, IAuthDocument } from '@dtlee2k1/jobber-shared';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export async function updateVerifyToken(req: Request, res: Response, _next: NextFunction) {
  const { token } = req.body;

  const existingUser: IAuthDocument | undefined = await findAuthUserByVerificationToken(token);
  if (!existingUser) {
    throw new BadRequestError('Verification token is either invalid or is already used', 'VerifyEmail updateVerifyToken() method error');
  }
  // Verify user
  await updateVerifyEmailField(existingUser.id!, 1, '');

  const updatedUser: IAuthDocument = await findAuthUserById(existingUser.id!);
  res.status(StatusCodes.OK).json({
    message: 'Email verified successfully',
    user: updatedUser
  });
}
