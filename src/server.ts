import http from 'http'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { config } from './config/config'
import logger from './library/Logger'
import createServer from './utils/server'

// import multer from 'multer'
// import path from 'path'



/** Connect to mnogodb */
mongoose.connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        logger.info('Connected to mnogodb')
        startServer()
    }).catch(err => {
        logger.error('Error connecting to mnogodb')
        logger.error(err)
    })


/** If mongodb connects */
const startServer = () => {

    const router = createServer()

    // const storage = multer.diskStorage({
    //     destination: (req, file, cb) => {
    //         cb(null, path.resolve('./src/photos'))
    //     },
    //     filename: (req, file, cb) => {
    //         cb(null, Date.now() + path.extname(file.originalname))
    //         console.log('File: ', file)
    //         console.log(path.resolve('./src/photos'))
    //     }
    // })

    // const upload = multer({ storage })

    // router.post('/upload', upload.single('avatar'), (req, res) => {
    //     res.status(200).json({ message: 'img uploaded!' })
    // })



    http.createServer(router).listen(config.server.port, () => logger.info(`Server listening on ${config.server.port}`))
}