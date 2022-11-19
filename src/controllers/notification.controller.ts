import { Request, Response } from 'express';
import Notification from '../models/notification.model'
import User from '../models/user.model'


const readAllNotifications = (req: Request, res: Response) => {
    return Notification.find()
        .select(['-__v', '-createdAt', '-updatedAt'])
        .then(notifications => res.status(200).json(notifications))
        .catch(err => res.status(500).json({ err }))
}

const updateNotification = async (req: Request, res: Response) => {
    const notification_id = req.params.id

    try {
        const notification = await Notification.findOneAndUpdate({ _id: notification_id }, req.body, { new: true, rawResult: true })
        const refresh_token = req.cookies.jwt
        const found_user = await User.findOne({ refreshToken: refresh_token })
        const user_owner = await User.findOne({ notification: notification_id })
        console.log('req user ', found_user)
        console.log('owner ', user_owner)

        if (!found_user) return res.status(403).json({ message: 'User not found' })
        if (user_owner && JSON.stringify(user_owner) !== JSON.stringify(notification)) return res.status(403).json({ message: 'Notification private!!' })

        console.log(notification.value)

        return res.status(200).json({ message: 'Notification updated successfully' })
    } catch (err) {
        res.status(500).json(err)
    }
}

const deleteNotification = async (req: Request, res: Response) => {
    const notification_id = req.params.id
    try {
        const refresh_token = req.cookies.jwt
        const found_user = await User.findOne({ refreshToken: refresh_token })
        const user_owner = await User.findOne({ notification: notification_id })
        console.log('req user ', found_user)
        console.log('owner ', user_owner)

        if (!found_user) return res.status(403).json({ message: 'User not found' })
        if (user_owner && JSON.stringify(user_owner) !== JSON.stringify(found_user)) return res.status(403).json({ message: 'Notification private!!' })

        const result = await Notification.findByIdAndDelete(notification_id)
        result ? res.status(201).json({ message: 'Notification deleted!' }) : res.status(404).json({ message: 'Not found!' })

    } catch (err) {
        res.status(500).json({ message: 'Something wrong!' })
    }
}


const readNotification = (req: Request, res: Response) => {
    const notification_id = req.params.id

    return Notification.findById(notification_id)
        .select('-__v')
        .then(notification => res.status(200).json({ notification }))
        .catch(err => res.status(500).json({ err }))
}

export default {
    readAllNotifications,
    updateNotification,
    deleteNotification,
    readNotification,
}