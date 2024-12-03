import { Request, Response } from 'express';
import Attendance from '../models/Attendance.model';
import Session from '../models/Session.model';

export const markAttendance = async (req: Request, res: Response): Promise<void> => {
    const { qrCode, userId } = req.body;

    try {
        const session = await Session.findOne({ qrCode });
        if (!session) {
            res.status(404).json({ error: 'Invalid QR Code' });
            return;
        }

        const attendance = new Attendance({ sessionId: session._id, userId });
        await attendance.save();

        res.status(201).json({ message: 'Attendance marked successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};

export const getAttendance = async (req: Request, res: Response): Promise<void> => {
    const { sessionId } = req.params;

    try {
        const attendance = await Attendance.find({ sessionId }).populate('userId', 'name email');
        res.status(200).json({ data: attendance });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};
