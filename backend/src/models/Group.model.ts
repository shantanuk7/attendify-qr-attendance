import mongoose, { Document, Schema } from 'mongoose';

export interface IGroup extends Document {
  name: string; 
  description?: string; 
  createdBy: mongoose.Types.ObjectId; 
  createdAt: Date; 
}

/**
 * Schema definition for Group
 */
const GroupSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true, 
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, 
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
});

/**
 * Group model export
 */
export default mongoose.model<IGroup>('Group', GroupSchema);
