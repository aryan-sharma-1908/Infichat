import mongoose, { Schema } from 'mongoose';

const MessageSchema = new mongoose.Schema({
    senderId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: null
    },
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read', 'failed', 'pending'],
        default: 'sent'
    },
    clientMessageId: {
        type: String,
        required: true
    },
    deletedFor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    deletedAt: {
        type: Date
    }
}, {timestamps: true})

const Message = mongoose.model('Message', MessageSchema);

export default Message;