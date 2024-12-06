import {Router} from 'express';
import {
  addUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/admin.controller';
import { createGroup, getGroups } from '../controllers/group.controller';
import { createSession, getSessions } from '../controllers/session.controller';

const router = Router();

/**
 * User Management Routes for Admin
 *
 * These routes allow an admin to perform CRUD operations on users.
 */

// Create a new user
// @route   POST /api/admin/create-user
// @desc    Add a new user to the system
// @access  Admin Only
router.post('/create-user', addUser);

// Get a list of all users
// @route   GET /api/admin/get-users
// @desc    Retrieve all users in the system
// @access  Admin Only
router.get('/get-users', getUsers);

// Get a single user by email
// @route   GET /api/admin/get-user/:userEmail
// @desc    Fetch details of a specific user by their email
// @access  Admin Only
router.get('/get-user/:userEmail', getUser);

// Update a user's details
// @route   PUT /api/admin/update-user/:userEmail
// @desc    Modify user information by their email
// @access  Admin Only
router.put('/update-user/:userEmail', updateUser);

// Delete a user
// @route   DELETE /api/admin/delete-user/:userEmail
// @desc    Remove a user from the system by their email
// @access  Admin Only
router.delete('/delete-user/:userEmail', deleteUser);

/**
 * Group Management Routes for Admin
 *
 * These routes enable an admin to manage groups within the system.
 */

// Create a new group
// @route   POST /api/admin/create-group
// @desc    Add a new group to the system
// @access  Admin Only
router.post('/create-group', createGroup);

// Get a list of all groups
// @route   GET /api/admin/get-groups
// @desc    Retrieve all groups created by the admin
// @access  Admin Only
router.get('/get-groups', getGroups);


export default router;
