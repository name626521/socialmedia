import Request from 'supertest'
import router from '../utils/server'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
const { MongoClient } = require('mongodb')
import { config } from '../config/config'
import userService from '../services/user.service'
import bcrypt from 'bcrypt'

const app = router()
describe('Account Module', () => {
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
    describe('login ts_account_001', () => {
        describe('tc_login_001', () => {
            it('Should return 404, route not found', async () => {
                const res = await Request(app).post('/api/auth/logins')
                expect(res.statusCode).toBe(404)
            })
        })
        describe('tc_login_002', () => {
            it('Given an empty email or password should return 400', async () => {
                const user_payload_1 = { email: '', password: '12345678' }
                const user_payload_2 = { email: 'exist@test.com', password: '' }
                const res1 = await Request(app).post('/api/auth/login').send(user_payload_1)
                const res2 = await Request(app).post('/api/auth/login').send(user_payload_2)
                expect(res1.statusCode).toBe(400)
                expect(res2.statusCode).toBe(400)
            })
        })
        describe('tc_login_003', () => {
            it('Given a valid email and password should return status 200 and access token', async () => {
                //We want a valid user to authenticate
                const user_payload = { username: 'John', email: 'newuser@site.com', password: 'password', profile: new mongoose.Types.ObjectId() }
                //@ts-ignore
                const findUserServiceMock = jest.spyOn(userService, 'find_user').mockReturnValue({ email: user_payload.email })
                const bcryptCompare = jest.fn().mockReturnValue(true);
                (bcrypt.compare as jest.Mock) = bcryptCompare
                //@ts-ignore
                const saveUserServiceMock = jest.spyOn(userService, 'save_user').mockReturnValue(user_payload);
                const { body, statusCode, headers } = await Request(app).post('/api/auth/login').send({ email: user_payload.email, password: user_payload.password })
                expect(bcryptCompare).toHaveBeenCalled()
                expect(findUserServiceMock).toHaveBeenCalledWith({ email: user_payload.email })
                expect(saveUserServiceMock).toHaveBeenCalledTimes(1)
                expect(statusCode).toBe(200)
                expect(body).toEqual({
                    access_token: expect.any(String)
                })
                expect(headers['set-cookie']).toBeTruthy()
            })
        })

    })
    describe('Operate on one user ts_account_003', () => {
        describe('Show 1 user route does not exist', () => {
            it('Should return 404', async () => {
                const user_id = new mongoose.Types.ObjectId
                const response = await Request(app).get(`/api/users/show/${user_id}`)
                expect(response.statusCode).toEqual(404)
            })
        })
        describe('Show one user route exist', () => {
            //create the user


            //test if this created user route exist
            it('should return 200 status code', async () => {
                const res = await Request(app).get('/api/users/show')
            })
        })
    })
})