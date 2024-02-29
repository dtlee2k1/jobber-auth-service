import AuthModel from '@auth/models/auth.schema';
import { publishDirectMessage } from '@auth/queues/auth.producer';
import { authChannel } from '@auth/server';
import { IAuthBuyerMessageDetails, IAuthDocument, firstLetterUppercase } from '@dtlee2k1/jobber-shared';
import { omit } from 'lodash';
import { Model, Op } from 'sequelize';

export async function createAuthUser(data: IAuthDocument) {
  const result: Model<IAuthDocument> = await AuthModel.create(data);
  const messageDetails: IAuthBuyerMessageDetails = {
    username: result.dataValues.username!,
    profilePicture: result.dataValues.profilePicture!,
    email: result.dataValues.email!,
    country: result.dataValues.country!,
    createdAt: result.dataValues.createdAt!,
    type: 'auth'
  };

  await publishDirectMessage(
    authChannel,
    'jobber-buyer-update',
    'user-buyer',
    JSON.stringify(messageDetails),
    'Buyer details sent to buyer service'
  );

  const userData: IAuthDocument = omit(result.dataValues, ['password']);
  return userData;
}

export async function findUserById(authId: string) {
  const user: Model<IAuthDocument> = (await AuthModel.findOne({
    where: { id: authId },
    attributes: {
      exclude: ['password']
    }
  })) as Model<IAuthDocument>;

  return user.dataValues;
}

export async function findUserByUsernameOrEmail(username: string, email: string) {
  const user: Model<IAuthDocument> = (await AuthModel.findOne({
    where: { [Op.or]: [{ username: firstLetterUppercase(username) }, { email: email.toLowerCase() }] }
  })) as Model<IAuthDocument>;

  return user.dataValues;
}

export async function findUserByUsername(username: string) {
  const user: Model<IAuthDocument> = (await AuthModel.findOne({
    where: { username: firstLetterUppercase(username) }
  })) as Model<IAuthDocument>;

  return user.dataValues;
}

export async function findUserByEmail(email: string) {
  const user: Model<IAuthDocument> = (await AuthModel.findOne({
    where: { email: email.toLowerCase() }
  })) as Model<IAuthDocument>;

  return user.dataValues;
}

export async function findAuthUserByVerificationToken(token: string) {
  const user: Model<IAuthDocument> = (await AuthModel.findOne({
    where: { emailVerificationToken: token },
    attributes: {
      exclude: ['password']
    }
  })) as Model<IAuthDocument>;

  return user.dataValues;
}

export async function findAuthUserByPasswordToken(token: string) {
  const user: Model<IAuthDocument> = (await AuthModel.findOne({
    where: { [Op.and]: [{ passwordResetToken: token }, { passwordResetExpires: { [Op.gt]: new Date() } }] }
  })) as Model<IAuthDocument>;

  return user.dataValues;
}