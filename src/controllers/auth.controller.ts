import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie-parser'
import { config } from '../config/config'
import User from '../models/user.model'
import Profile from '../models/profile.model'
import userService from '../services/user.service'

const handleNewUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) return res.status(400).json({ message: 'Invalid username or password!' })

    const userExists = await User.findOne({ email }).exec()

    if (userExists) return res.status(409).json({ message: 'Email already used!' })

    try {
        //Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10)

        const profile = await Profile.create({})
        userService.create_user({
            username,
            email,
            password: hashedPassword,
            profile: profile._id
        })


        res.status(201).json({ success: 'New user created succesfully!' })

    } catch (err) {
        res.status(500).json({ err })
    }
}

const handleLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) return res.status(400).json({ err: 'Invalid email or password!' })

    const found_user = await userService.find_user({ email })

    if (!found_user) return res.status(401).json({ err: 'User not found!' })

    //Evaluate password
    const match = await bcrypt.compare(password, found_user.password)

    if (match) {
        //create jwt token
        const access_token = jwt.sign(
            {
                'username': found_user.username,
                'roles': found_user.role
            },
            config.token.access,
            { expiresIn: '60s' }
        )

        const refresh_token = jwt.sign(
            { 'username': found_user.username, 'roles': found_user.role },
            config.token.refresh,
            { expiresIn: '1d' }
        )

        //Save refresh token
        found_user.refreshToken = refresh_token

        await userService.save_user(found_user)

        res.cookie('jwt', refresh_token, {
            httpOnly: true,
            sameSite: 'none',
            // secure: true,
            maxAge: 60 * 60 * 24 * 1000
        })

        res.json({ access_token })

    } else {
        res.status(401).json({ message: 'Unauthorized' })
    }

}

const handleRefreshToken = async (req: Request, res: Response) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized!' })

    const refresh_token = cookies.jwt

    const found_user = await User.findOne({ refreshToken: refresh_token })

    if (!found_user) return res.status(403).json({ message: 'Forbidden!' })

    //@ts-ignore
    jwt.verify(refresh_token, config.token.refresh, (err, decoded) => {
        if (err || found_user.username !== decoded.username) return res.status(403).json({ message: 'Forbidden!' })

        const access_token = jwt.sign({
            "username": decoded.username,
            "roles": decoded.roles
        }, config.token.access, {
            expiresIn: '3600s'
        })
        res.json(access_token).status(200)
    })

}

const handleLogout = async (req: Request, res: Response) => {
    const cookie = req.cookies

    if (!cookie?.jwt) {
        return res.status(204).json({ message: 'DGUugduwdugawd' })
    }

    const refresh_token = cookie.jwt
    const found_user = await User.findOne({ refreshToken: refresh_token })

    if (!found_user) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none' })

        return res.status(403).json({ message: 'Forbidden' })
    }

    await User.updateOne({ refreshToken: refresh_token }, { $set: { refreshToken: '' } })

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none' })

    return res.status(200).json({ message: 'Logged Out!' })
}

export default {
    handleNewUser,
    handleLogin,
    handleRefreshToken,
    handleLogout
}