import express from 'express';
import { addUser, getUsers, getUser, updateUser, deleteUser } from '../controllers/admin.controller';

const router = express.Router();

router.post('/users', addUser);

router.get('/users', getUsers);
router.get('/users/:userEmail', getUser);

router.put('/users/:userId', updateUser);

router.delete('/users/:userId', deleteUser);

export default router;
