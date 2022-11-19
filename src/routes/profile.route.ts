import express from 'express';
import profileController from '../controllers/profile.controller';
import userController from '../controllers/user.controller';
import { validate_schema, Schemas } from '../middleware/validate.schema.middleware';
import { verifyJWT } from '../middleware/verify_jwt.middleware'
import { authorized } from '../middleware/authorize.middleware'
import { uploadSingle } from '../middleware/multer.middleware'
import { roleList } from '../config/roles';

const router = express.Router();

router.get('/get_all', verifyJWT, authorized(roleList.admin), profileController.readAllProfiles);
router.patch('/update/:id', verifyJWT, profileController.updateProfile);
router.delete('/delete/:id', verifyJWT, profileController.deleteProfile);
router.get('/show/:id', verifyJWT, profileController.readProfile);
router.post('/upload_profile', verifyJWT, uploadSingle, profileController.uploadFile)


export default router   