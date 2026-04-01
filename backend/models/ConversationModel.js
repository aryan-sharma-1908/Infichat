import mongoose from "mongoose";

//Conversation Model
const ConversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: false,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Conversation = mongoose.model("Conversation", ConversationSchema);

export default Conversation;
