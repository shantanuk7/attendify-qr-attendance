import express from 'express';
import { addUser, getUsers, getUser, updateUser, deleteUser } from '../controllers/admin.controller';

const router = express.Router();

router.post('/create-user', addUser);

router.get('/get-users', getUsers);
router.get('/get-user/:userEmail', getUser);

router.put('/update-user/:userEmail', updateUser);

router.delete('/delete-user/:userEmail', deleteUser);

export default router;
