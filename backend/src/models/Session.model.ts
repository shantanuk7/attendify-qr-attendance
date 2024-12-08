import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
    qrCode: string;
    groupId: mongoose.Types.ObjectId; 
    date: Date;
  }
  
  const SessionSchema: Schema = new Schema({
    qrCode: {
      type: String,
      required: true,
      unique: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    }, // Added groupId
    date: {
      type: Date,
      default: Date.now,
    },
  });
  
  export default mongoose.model<ISession>('Session', SessionSchema);
