import express from 'express';
const router = express.Router();
import { body } from 'express-validator'; // Import 'body' from 'express-validator'
import authController from '../controllers/AuthRoutes.mjs';
import LOGIN from '../controllers/AuthRoutes.mjs';

router.post(
  '/login',
  [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
  ],
  LOGIN.login
);

router.post(
  '/signup',
  [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password is too short').isLength({ min: 4 }),
  ],
  LOGIN.signup
);

router.post('/google', LOGIN.signup);



export default router;