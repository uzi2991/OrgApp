import { Router } from 'express';
import { checkAuth, signIn, signUp } from '../controllers/AuthController.js';
import AuthMiddleware from '../middlewares/Auth.js';

const router = Router();

router.route('/signup').post(signUp);
router.route('/signin').post(signIn);
router.route('/').get(AuthMiddleware, checkAuth);

export default router;