import express from 'express'
import { GoogleLogin, isAuthenticated, Login, Logout, Register, resetPassword, sendResetOtp, sendVerifyOtp, veryEmail } from '../controllers/Auth.controller.js'
import { authenticate } from '../middleware/authenticate.js'
import userauth from '../middleware/userauth.js'

const AuthRoute = express.Router()

AuthRoute.post('/register', Register)
AuthRoute.post('/login', Login)
AuthRoute.post('/google-login', GoogleLogin)
AuthRoute.get('/logout', userauth, Logout)
AuthRoute.post('/send-verify-otp', userauth, sendVerifyOtp)
AuthRoute.post('/verify-account', userauth, veryEmail)
AuthRoute.get('/is-auth', userauth, isAuthenticated)
AuthRoute.post('/send-reset-otp', sendResetOtp)
AuthRoute.post('/reset-password', resetPassword)


export default AuthRoute