import express from 'express';
import messageController from '../controllers/message.controller';
import { validate_schema, Schemas } from '../middleware/validate.schema.middleware';
import { verifyJWT } from '../middleware/verify_jwt.middleware'
import { authorized } from '../middleware/authorize.middleware'
import { uploadSingle } from '../middleware/multer.middleware'
import { roleList } from '../config/roles';

const router = express.Router();

router.get('/get_all', verifyJWT, authorized(roleList.admin), messageController.readAllMessages);
router.patch('/update/:id', verifyJWT, messageController.updateMessage);
router.delete('/delete/:id', verifyJWT, messageController.deleteMessage);
router.get('/show/:id', verifyJWT, messageController.readMessage);


export default router   