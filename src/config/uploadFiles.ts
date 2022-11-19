import { request, Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';

//Dev types 
type DestinationCallback = (err: Error | null, destination: string) => void
type FilenameCallback = (err: Error | null, destination: string) => void

export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve('./src/photos'))
    },
    filename: (req, file, cb) => {
        const newName = file.fieldname + Date.now() + file.originalname
        //@ts-ignore
        req.name = newName
        cb(null, newName)
    }
})

export const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true)
    }
    else if (file.mimetype === 'video/mp4') {
        cb(null, true)
    }
    else {
        cb(null, false)
    }
}