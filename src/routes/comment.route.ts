import express from 'express';
import commentController from '../controllers/comment.controller';
import { validate_schema, Schemas } from '../middleware/validate.schema.middleware';
import { verifyJWT } from '../middleware/verify_jwt.middleware'
import { authorized } from '../middleware/authorize.middleware'
import { uploadSingle } from '../middleware/multer.middleware'
import { roleList } from '../config/roles';

const router = express.Router();

router.get('/get_all', verifyJWT, authorized(roleList.admin), commentController.readAllComments);
router.patch('/update/:id', verifyJWT, commentController.updateComment);
router.delete('/delete/:id', verifyJWT, commentController.deleteComment);
router.get('/show/:id', verifyJWT, commentController.readComment);


export default router   