import mongoose, { Document, Schema } from "mongoose";

export interface IAttendance extends Document {
  sessionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  timestamp: Date;
}

const AttendanceSchema: Schema = new Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

AttendanceSchema.index({ sessionId: 1, userId: 1 }, { unique: true });

export default mongoose.model<IAttendance>("Attendance", AttendanceSchema);

