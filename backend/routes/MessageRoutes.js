import {Router} from 'express';
import { deleteAllMessages, deleteMessage, getOldMessages } from '../controllers/MessageControllers.js';

const router = Router();

router.get('/:friendId',getOldMessages);
router.delete('/deleteAll/:friendId',deleteAllMessages);
router.patch('/delete/:messageId',deleteMessage);

export default router;