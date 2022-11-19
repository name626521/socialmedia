import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose';
import User from '../models/user.model'
import Image from '../models/media.model'
import Profile from '../models/profile.model'
import path from 'path';
import fs from 'fs';
import userService from '../services/user.service'


const readUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const found_user = await userService.find_user({ _id: userId })

        if (!found_user) return res.status(404).json({ message: 'user not found!' })

        res.status(200).json(found_user)
    } catch (err) {
        res.status(500).json({ message: 'something wrong' })
    }
}

const readAllUsers = (req: Request, res: Response, next: NextFunction) => {
    return User.find()
        .populate({ path: 'profile', select: ['gender', 'birthday'] })
        .then((users) => res.status(200)
            .json(users))
        .catch((err) => {
            return res.status(500).json(err)
        })
}
const updateUser = (req: Request, res: Response, next: NextFunction) => {

}
const deleteUser = (req: Request, res: Response, next: NextFunction) => {

}

const CreateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    const { birthday, gender } = req.body


    const userExists = await User.findById(userId)

    if (userExists) {
        const profile = new Profile({
            birthday,
            gender
        })
    }
}

export default {
    readUser,
    readAllUsers,
    updateUser,
    deleteUser,
    CreateUserProfile
}