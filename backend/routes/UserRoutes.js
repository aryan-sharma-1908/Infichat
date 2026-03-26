import { Router } from "express";
import { addFriendIfNotExists, deleteFriend, getFriends, getNonFriends, getUserInfo, getUsers } from "../controllers/UserControllers.js";
import { updateProfile } from "../controllers/UserControllers.js";

const router = Router();
//roures
router.get('/', getUsers);
router.post('/profile-setup', updateProfile);
router.get('/non-friends', getNonFriends);
router.post('/add-friend', addFriendIfNotExists);
router.get('/friends', getFriends);
router.get('/info', getUserInfo);
router.delete('/friends/delete/:friendId', deleteFriend);

export default router;