import { Router } from 'express';
import { confirmForgotPassword } from '../controllers/confirmForgotPassword';
import { forgotPassword } from '../controllers/forgotPassword';
import { login } from '../controllers/login';

const oauth = Router();

oauth.post('/login', login);
oauth.post('/forgot-password', forgotPassword);
oauth.post('/confirm-forgot-password', confirmForgotPassword);

export { oauth };
