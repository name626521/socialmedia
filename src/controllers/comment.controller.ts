import { Request, Response } from 'express';
import Comment from '../models/comment.model'
import User from '../models/user.model'


const readAllComments = (req: Request, res: Response) => {
    return Comment.find()
        .select(['-__v', '-createdAt', '-updatedAt'])
        .then(comments => res.status(200).json(comments))
        .catch(err => res.status(500).json({ err }))
}

const updateComment = async (req: Request, res: Response) => {
    const comment_id = req.params.id

    try {
        const comment = await Comment.findOneAndUpdate({ _id: comment_id }, req.body, { new: true, rawResult: true })
        const refresh_token = req.cookies.jwt
        const found_user = await User.findOne({ refreshToken: refresh_token })
        const user_owner = await User.findOne({ comment: comment_id })
        console.log('req user ', found_user)
        console.log('owner ', user_owner)

        if (!found_user) return res.status(403).json({ message: 'User not found' })
        if (user_owner && JSON.stringify(user_owner) !== JSON.stringify(comment)) return res.status(403).json({ message: 'Comment private!!' })

        console.log(comment.value)

        return res.status(200).json({ message: 'Comment updated successfully' })
    } catch (err) {
        res.status(500).json(err)
    }
}

const deleteComment = async (req: Request, res: Response) => {
    const comment_id = req.params.id
    try {
        const refresh_token = req.cookies.jwt
        const found_user = await User.findOne({ refreshToken: refresh_token })
        const user_owner = await User.findOne({ comment: comment_id })
        console.log('req user ', found_user)
        console.log('owner ', user_owner)

        if (!found_user) return res.status(403).json({ message: 'User not found' })
        if (user_owner && JSON.stringify(user_owner) !== JSON.stringify(found_user)) return res.status(403).json({ message: 'Comment private!!' })

        const result = await Comment.findByIdAndDelete(comment_id)
        result ? res.status(201).json({ message: 'Comment deleted!' }) : res.status(404).json({ message: 'Not found!' })

    } catch (err) {
        res.status(500).json({ message: 'Something wrong!' })
    }
}


const readComment = (req: Request, res: Response) => {
    const comment_id = req.params.id

    return Comment.findById(comment_id)
        .select('-__v')
        .then(comment => res.status(200).json({ comment }))
        .catch(err => res.status(500).json({ err }))
}

export default {
    readAllComments,
    updateComment,
    deleteComment,
    readComment
}