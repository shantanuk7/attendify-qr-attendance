import mongoose, { Document, Schema } from "mongoose";

export interface ISession extends Document {
  groupId: mongoose.Types.ObjectId;
  expiryTime: Date;
  createdAt: Date;
  createdBy: mongoose.Types.ObjectId;
  attendances: mongoose.Types.ObjectId[];
  qrCode: string | null;  // Add qrCode field
}

const SessionSchema: Schema = new Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  expiryTime: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  attendances: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  qrCode: {
    type: String,
    default: null,  
  },
});

export default mongoose.model<ISession>('Session', SessionSchema);
