import Conversation from "../models/ConversationModel.js";
import Message from "../models/MessageModel.js";
import User from "../models/UserModel.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
    }).select("name avatar description");
    res.status(200).json({
      success: true,
      users,
      message: "Users fetched successfully",
    });
  } catch (error) {
    console.error("Error in getUsers: ", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, avatar, description } = req.body;
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        avatar,
        description,
        profileSetup: true,
      },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        profileSetup: user.profileSetup,
        avatar: user.avatar,
        description: user.description,
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error fetching profile: ", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
};

export const getNonFriends = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("friends");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const nonFriends = await User.find({
      _id: { $nin: [...user.friends, userId] },
    }).select("name avatar description");

    if (nonFriends.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No non-friends found",
        nonFriends: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Non-friends fetched successfully",
      nonFriends,
    });
  } catch (error) {
    console.error("Error in getNonFriends: ", error);
    res.status(500).json({
      success: false,
      message: "Server error while getting non-friends",
    });
  }
};

export const addFriendIfNotExists = async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.body;

    if (userId.toString() === friendId) {
      return res.status(400).json({
        success: false,
        message: "Cannot add yourself as a friend",
      });
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({
        success: false,
        message: "User or Friend not found",
      });
    }

    if (user.friends.includes(friendId)) {
      return res.status(400).json({
        success: false,
        message: "User is already a friend",
      });
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: { friends: friendId },
    });
    await User.findByIdAndUpdate(friendId, {
      $addToSet: { friends: userId },
    });

    // Fetch the newly added friend's public info to return to the client
    const newFriend = await User.findById(friendId).select(
      "name avatar description",
    );

    res.status(200).json({
      success: true,
      message: "Friend added successfully",
      newFriend,
    });
  } catch (error) {
    console.error("Error in addFriendIfNotExists: ", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding friend",
    });
  }
};

export const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .select("friends")
      .populate("friends", "name avatar description");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Friends fetched successfully",
      friends: user.friends,
    });
  } catch (error) {
    console.error("Error in getFriends: ", error);
    res.status(500).json({
      success: false,
      message: "Server error while getting friends",
    });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
        name: user.name,
        avatar: user.avatar,
        friends: user.friends,
      },
      message: "User found.",
    });
  } catch (error) {
    console.error("Error in getUserInfo: ", error);
    res.status(500).json({
      success: false,
      message: "Error in getting user info",
    });
  }
};

export const deleteFriend = async (req, res) => {
  try {
    console.log("Delete friend called with params: ", req.params);
    const userId = req.user._id;
    const { friendId } = req.params;

    const user = await User.findOne({
      _id: userId,
      friends: friendId,
    });
    const friend = await User.findById(friendId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User is not a friend or User not found",
      });
    }

    if (!friend) {
      return res.status(404).json({
        success: false,
        message: "Friend not found",
      });
    }
    const conversation = await Conversation.findOne({
      members: { $all: [userId, friendId] },
    });

    if (conversation) {
      await Conversation.deleteOne({
        members: { $all: [userId, friendId] },
      });

      await Message.deleteMany({
        conversationId: conversation._id,
      });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { friends: friendId },
    });

    await User.findByIdAndUpdate(friendId, {
      $pull: { friends: userId },
    });

    res.status(200).json({
      success: true,
      message: "Friend deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in deleting friend",
    });
  }
};
