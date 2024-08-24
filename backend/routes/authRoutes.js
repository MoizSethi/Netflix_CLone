import express from 'express';
import { signup, login, logout } from '../controllers/auth.controllers.js'; // Correct path to auth.controllers.js

const router = express.Router();

// Define routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout); // Ensure POST for logout

export default router;
