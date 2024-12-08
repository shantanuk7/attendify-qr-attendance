import mongoose, { Document, Schema } from "mongoose";

export interface ISession extends Document {
  groupId: mongoose.Types.ObjectId;
  expiryTime: Date;
  createdAt: Date;
  createdBy: mongoose.Types.ObjectId;
  attendees: mongoose.Types.ObjectId[];  // Add attendees field
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
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],  
});

export default mongoose.model<ISession>('Session', SessionSchema);
