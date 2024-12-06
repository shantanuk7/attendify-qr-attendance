import express from 'express';
import { addUser, getUsers, getUser, updateUser, deleteUser } from '../controllers/admin.controller';

const router = express.Router();

router.post('/users', addUser);

router.get('/users', getUsers);
router.get('/users/:userEmail', getUser);

router.put('/users/:userEmail', updateUser);

router.delete('/users/:userEmail', deleteUser);

export default router;
