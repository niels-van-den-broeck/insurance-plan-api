import {
  model, Schema, Document, Model,
} from 'mongoose';
import bcrypt from 'bcrypt';

type UserType = {
  userName: string,
  password: string;
  salt: string;
  validatePassword: (password: string) => Promise<boolean>;
}

export type UserDocument = UserType & Document;

const UserSchema = new Schema<UserDocument>({
  userName: { type: String, unique: true },
  password: String,
});

UserSchema.methods.validatePassword = async function validate(password: string) {
  return bcrypt.compare(password, this.password);
};

type UserModelType = Model<UserDocument>

const UserModel = model<UserDocument, UserModelType>('users', UserSchema);

export default UserModel;
