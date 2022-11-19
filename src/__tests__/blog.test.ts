
const { MongoClient } = require('mongodb')
import { config } from '../config/config'
import Request from 'supertest'
import router from '../utils/server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
const app = router()


describe('Blog Module', () => {
    const client = new MongoClient(config.mongo.testUrl)
    const start = async () => {
        try {
            await client.connect()
            console.log('db test connected')

        } catch (err) {
            console.log(err)
        }
    }
    beforeAll(async () => {
        start()
    })
    afterAll(async () => {
        client.close()
    })
    describe('Operate on one post ts_blog_001', () => {
        const post_payload = {
            title: 'test title',
            description: 'loremIpsum djawjd kwaj dkajw dkjawk jd',
            author: new mongoose.Types.ObjectId()
        }
        const user_payload = {
            username: 'aleks',
            role: {
                user: 'user'
            }
        }
        const refresh_token = jwt.sign({
            username: user_payload.username,
            role: user_payload.role
        }, config.token.refresh, {
            expiresIn: '1d'
        })
        describe('Given the user is logged in tc_post_001', () => {
            it('should return status 200 and return a post', async () => {
                const { body, statusCode } = await Request(app).post('/api/posts/new_post').set('Authorization', `Bearer ${refresh_token}`).send(post_payload)

                expect(statusCode).toBe(200)
            })
        })
    })
})