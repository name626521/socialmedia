import express from "express"
import logger from '../library/Logger'
import userRoute from '../routes/user.route'
import authRoute from '../routes/auth.route'
import cookieParser from 'cookie-parser'
import profileRoute from '../routes/profile.route'
import postRoute from "../routes/post.route"

const createServer = () => {
    const router = express()

    router.use((req, res, next) => {
        /**Log req */
        logger.info(`INCOMING >> METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`)
        res.on('finish', () => {
            //Log RES
            logger.info(`OUTCOMING >> METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`)
        })
        next()
    })

    router.use(express.urlencoded({
        extended: true
    }))

    router.use(cookieParser())

    router.use(express.json())

    /** Rules to our API */
    router.use((req, res, next) => {
        res.header('Access-control-Allow-Origin', '*')
        res.header('Access-control-Allow-credentials', 'true')
        res.header('Access-control-Allow-Headers', 'X-Requested-With, Content-Type, Origin, Authorization, Accept')

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
        }

        next()
    })

    /** Routes */
    router.use('/api/users', userRoute)
    router.use('/api/auth', authRoute)
    router.use('/api/profile', profileRoute)
    router.use('/api/posts', postRoute)

    /** Health Check */
    router.get('/ping', (req, res) => {
        return res.status(200).json({
            message: 'Pong'
        })
    })

    /** Error Handling */
    router.use((req, res, next) => {
        const error = new Error('Not Found')

        logger.error(error)

        return res.status(404).json({
            message: error.message
        })
    })

    return router
}

export default createServer