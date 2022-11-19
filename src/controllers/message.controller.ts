import { Request, Response } from 'express';
import Message from '../models/message.model'
import User from '../models/user.model'


const readAllMessages = (req: Request, res: Response) => {
    return Message.find()
        .select(['-__v', '-createdAt', '-updatedAt'])
        .then(messages => res.status(200).json(messages))
        .catch(err => res.status(500).json({ err }))
}

const updateMessage = async (req: Request, res: Response) => {
    const message_id = req.params.id

    try {
        const message = await Message.findOneAndUpdate({ _id: message_id }, req.body, { new: true, rawResult: true })
        const refresh_token = req.cookies.jwt
        const found_user = await User.findOne({ refreshToken: refresh_token })
        const user_owner = await User.findOne({ message: message_id })
        console.log('req user ', found_user)
        console.log('owner ', user_owner)

        if (!found_user) return res.status(403).json({ message: 'User not found' })
        if (user_owner && JSON.stringify(user_owner) !== JSON.stringify(message)) return res.status(403).json({ message: 'Message private!!' })

        console.log(message.value)

        return res.status(200).json({ message: 'Message updated successfully' })
    } catch (err) {
        res.status(500).json(err)
    }
}

const deleteMessage = async (req: Request, res: Response) => {
    const message_id = req.params.id
    try {
        const refresh_token = req.cookies.jwt
        const found_user = await User.findOne({ refreshToken: refresh_token })
        const user_owner = await User.findOne({ message: message_id })
        console.log('req user ', found_user)
        console.log('owner ', user_owner)

        if (!found_user) return res.status(403).json({ message: 'User not found' })
        if (user_owner && JSON.stringify(user_owner) !== JSON.stringify(found_user)) return res.status(403).json({ message: 'Message private!!' })

        const result = await Message.findByIdAndDelete(message_id)
        result ? res.status(201).json({ message: 'Message deleted!' }) : res.status(404).json({ message: 'Not found!' })

    } catch (err) {
        res.status(500).json({ message: 'Something wrong!' })
    }
}


const readMessage = (req: Request, res: Response) => {
    const message_id = req.params.id

    return Message.findById(message_id)
        .select('-__v')
        .then(message => res.status(200).json({ message }))
        .catch(err => res.status(500).json({ err }))
}

export default {
    readAllMessages,
    updateMessage,
    deleteMessage,
    readMessage,
}