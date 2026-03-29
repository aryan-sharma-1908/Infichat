import {Router} from 'express'
import { signup, login, logout } from '../controllers/AuthControllers.js'
const router = Router()

//Auth routes updated
router.post('/signup', signup)
router.post('/login', login)
router.post('/logout',logout);

export default router