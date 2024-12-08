import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  groupId?: mongoose.Types.ObjectId[]; 
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const userSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    required: true,
  },
  groupId: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Group',
    },
  ], 
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IUser>('User', userSchema);