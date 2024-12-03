import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
    qrCode: string;
    date: Date;
}

const SessionSchema: Schema = new Schema({
    qrCode: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
});

export default mongoose.model<ISession>('Session', SessionSchema);
