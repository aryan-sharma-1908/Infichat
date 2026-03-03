import Conversation from "../models/ConversationModel.js";
import Message from "../models/MessageModel.js";
import { getOrCreateConversation } from "../service/ConversationService.js";

export const getOldMessages = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findOne({
      members: { $all: [userId, friendId] },
    });

    if (!conversation) {
      return res.status(200).json({
        success: true,
        conversationId: null,
        messages: [],
      });
    }
    const messages = await Message.find({
      conversationId: conversation._id,
      deletedFor: { $ne: userId },
      deletedAt: { $exists: false },
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      conversationId: conversation._id,
      messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

export const deleteAllMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.params;

    const conversation = await Conversation.findOne({
      members: { $all: [userId, friendId] },
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "conversation not found.",
      });
    }

    await Message.updateMany(
      {
        conversationId: conversation._id,
        deletedFor: { $ne: userId },
      },
      { $addToSet: { deletedFor: userId } },
    );

    await Message.deleteMany({
      conversationId: conversation._id,
      deletedFor: { $all: conversation.members },
    });

    req.io.to(userId.toString()).emit("delete_all_messages", {
      conversationId: conversation._id,
      deletedBy: userId,
    });

    res.status(200).json({
      success: true,
      conversationId: conversation._id,
      message: "Chat messages deleted successfully.",
      messages: [],
    });
  } catch (error) {
    console.error("Error in deleteAllMessages: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { messageId } = req.params;
    const { deleteForMe, friendId } = req.body;

    const conversation = await Conversation.findOne({
      members: { $all: [userId, friendId] },
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "conversation not found.",
      });
    }
    if (deleteForMe) {
      await Message.updateOne(
        {
          conversationId: conversation._id,
          _id: messageId,
          deletedFor: {
            $ne: userId,
          },
          deletedAt: { $exists: false },
        },
        { $addToSet: { deletedFor: userId } },
      );

      req.io.to(userId.toString()).emit("message_deleted", {
        conversationId: conversation._id,
        messageId,
        type: 'delete_for_me'
      })

      return res.status(200).json({
        success: true,
        message: "Message deleted for you.",
      });
    }

    const message = await Message.findOne({
      conversationId: conversation._id,
      _id: messageId,
    })

    if(!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found."
      })
    }

    if(message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this message for everyone.'
      })
    }

    await Message.updateOne(
      {
        conversationId: conversation._id,
        _id: messageId,
      },
      {
        $set: {
          deletedFor: conversation.members,
          deletedAt: new Date()
        },
      },
    );

    req.io.to(conversation._id.toString()).emit("message_deleted", {
      conversationId: conversation._id,
      messageId,
      type: 'delete_for_everyone'
    })

    res.status(200).json({
      success: true,
      message: 'Message deleted for everyone.'
    })
  } catch (error) {
    console.error("Error in deleteMessage: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
