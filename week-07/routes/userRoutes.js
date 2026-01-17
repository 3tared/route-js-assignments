import express from 'express';
import { signup, upsertUser, findByEmail, getUserById } from '../controllers/userController.js';

const router = express.Router();

// User routes
router.post('/signup', signup);
router.put('/:id', upsertUser);
router.get('/by-email', findByEmail);
router.get('/:id', getUserById);

export default router;
