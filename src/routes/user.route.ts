import express from 'express';
import authController from '../controllers/auth.controller';
import userController from '../controllers/user.controller';
import { validate_schema, Schemas } from '../middleware/validate.schema.middleware';
import { verifyJWT } from '../middleware/verify_jwt.middleware'
import { authorized } from '../middleware/authorize.middleware'
import { uploadSingle } from '../middleware/multer.middleware'
import { roleList } from '../config/roles';

const router = express.Router();

router.get('/get_all', verifyJWT, authorized(roleList.admin), userController.readAllUsers);
router.patch('/update/:id', verifyJWT, userController.updateUser);
router.delete('/delete/:id', verifyJWT, userController.deleteUser);
router.get('/show/:id', userController.readUser);

export default router