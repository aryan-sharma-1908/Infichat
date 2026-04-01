import {Router} from 'express'
import { translateMessageText } from '../controllers/TranslateControllers'
const router = Router()

router.post('/translate', translateMessageText)

export default router
