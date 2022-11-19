import express from 'express';
import postController from '../controllers/post.controller';
import { validate_schema, Schemas } from '../middleware/validate.schema.middleware';
import { verifyJWT } from '../middleware/verify_jwt.middleware'
import { authorized } from '../middleware/authorize.middleware'
import { uploadSingle } from '../middleware/multer.middleware'
import { roleList } from '../config/roles';

const router = express.Router();

router.get('/get_all', verifyJWT, postController.readAllPosts);
router.patch('/update/:id', verifyJWT, authorized(roleList.editor), postController.updatePost);
router.delete('/delete/:id', verifyJWT, postController.deletePost);
router.get('/show/:id', verifyJWT, postController.readPost);
router.post('/new_post', verifyJWT, postController.createPost);


export default router