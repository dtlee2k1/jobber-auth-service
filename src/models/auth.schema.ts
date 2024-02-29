import { sequelize } from '@auth/database';
import { IAuthDocument } from '@dtlee2k1/jobber-shared';
import { compare, hash } from 'bcrypt';
import { DataTypes, Model, ModelDefined, Optional } from 'sequelize';

const SALT_ROUNDS = 10;

type UserCreationAttributes = Optional<IAuthDocument, 'id' | 'createdAt' | 'passwordResetToken' | 'passwordResetExpires'>;

const AuthModel: ModelDefined<IAuthDocument, UserCreationAttributes> = sequelize.define(
  'Auth',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profilePublicId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: false
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date()
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Date.now()
    }
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['username']
      },
      {
        unique: true,
        fields: ['email']
      }
    ]
  }
);

AuthModel.beforeCreate(async (auth: Model<IAuthDocument, UserCreationAttributes>) => {
  const hashedPassword = await hash(auth.dataValues.password as string, SALT_ROUNDS);
  auth.dataValues.password = hashedPassword;
});

AuthModel.prototype.comparePassword = async function (password: string) {
  return await compare(password, this.password);
};

export default AuthModel;
