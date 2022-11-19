import express from 'express';
import notificationController from '../controllers/notification.controller';
import { validate_schema, Schemas } from '../middleware/validate.schema.middleware';
import { verifyJWT } from '../middleware/verify_jwt.middleware'
import { authorized } from '../middleware/authorize.middleware'
import { uploadSingle } from '../middleware/multer.middleware'
import { roleList } from '../config/roles';

const router = express.Router();

router.get('/get_all', verifyJWT, authorized(roleList.admin), notificationController.readAllNotifications);
router.patch('/update/:id', verifyJWT, notificationController.updateNotification);
router.delete('/delete/:id', verifyJWT, notificationController.deleteNotification);
router.get('/show/:id', verifyJWT, notificationController.readNotification);


export default router   