import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin'],
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    verifyOtp: {
        type: String,
        default:''
    },
    verifyOtpExpireAt: {
        type: Number,
        default:0
    },
    isAccountVerified: {
        type: Boolean,
        default:false
    },
    resetOtp: {
        type: String,
        default:''
    },
    resetOtpExpireAt: {
        type: Number,
        default:0
    },
    date_join:{
        type:Date,
        default: Date.now
    },
    failedLoginAttempts:{
        type:Number,
        default:0
    },
    lockUntil:{ 
        type: Date, 
        default: null 
    },
    warningEmailSent:{
        type: Boolean, 
        default: false
    },
})

// A helper method to check if the user's account is locked
userSchema.methods.isLocked = function () {
    return this.lockUntil && this.lockUntil > Date.now();
  };

const User = mongoose.model('User', userSchema, 'users')
export default User 