import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    name: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    profileSetup: {
        type: Boolean,
        default: false
    }
})

userSchema.pre('save', async function(next){
    const user = this;
    if(!user.isModified('password')) return next();

    const passwordHash = await bcrypt.hash(user.password, 10);
    user.password = passwordHash;
    next();
})

const User = mongoose.model('User', userSchema);

export default User;