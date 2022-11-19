import { Request, Response } from 'express';
import Post from '../models/post.model'
import User from '../models/user.model'
import post_service from '../services/post.service';


const readAllPosts = (req: Request, res: Response) => {
    return Post.find()
        .select(['-__v', '-createdAt', '-updatedAt'])
        .then(posts => res.status(200).json(posts))
        .catch(err => res.status(500).json({ err }))
}

const updatePost = async (req: Request, res: Response) => {
    const post_id = req.params.id

    try {
        const post = await Post.findOneAndUpdate({ _id: post_id }, req.body, { new: true, rawResult: true })
        const refresh_token = req.cookies.jwt
        const found_user = await User.findOne({ refreshToken: refresh_token })
        const user_owner = await User.findOne({ post: post_id })
        console.log('req user ', found_user)
        console.log('owner ', user_owner)

        if (!found_user) return res.status(403).json({ message: 'User not found' })
        if (user_owner && JSON.stringify(user_owner) !== JSON.stringify(post)) return res.status(403).json({ message: 'Post private!!' })

        console.log(post.value)

        return res.status(200).json({ message: 'Post updated successfully' })
    } catch (err) {
        res.status(500).json(err)
    }
}

const deletePost = async (req: Request, res: Response) => {
    const post_id = req.params.id
    try {
        const refresh_token = req.cookies.jwt
        const found_user = await User.findOne({ refreshToken: refresh_token })
        const user_owner = await User.findOne({ post: post_id })
        console.log('req user ', found_user)
        console.log('owner ', user_owner)

        if (!found_user) return res.status(403).json({ message: 'User not found' })
        if (user_owner && JSON.stringify(user_owner) !== JSON.stringify(found_user)) return res.status(403).json({ message: 'Post private!!' })

        const result = await Post.findByIdAndDelete(post_id)
        result ? res.status(201).json({ message: 'Post deleted!' }) : res.status(404).json({ message: 'Not found!' })

    } catch (err) {
        res.status(500).json({ message: 'Something wrong!' })
    }
}


const readPost = (req: Request, res: Response) => {
    const post_id = req.params.id

    return Post.findById(post_id)
        .select('-__v')
        .then(post => res.status(200).json({ post }))
        .catch(err => res.status(500).json({ err }))
}

const createPost = async (req: Request, res: Response) => {
    const { title, description, author } = req.body

    try {
        const post = await post_service.create_post({ title, description, author })

        return res.status(200).json(post)
    } catch (err) {
        res.status(500).json({ err })
    }
}


export default {
    readAllPosts,
    updatePost,
    deletePost,
    readPost,
    createPost
}