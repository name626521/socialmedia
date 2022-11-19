import multer from "multer"
import { storage, fileFilter } from "../config/uploadFiles"

export const uploadSingle = multer({ storage, fileFilter }).single('avatar')

