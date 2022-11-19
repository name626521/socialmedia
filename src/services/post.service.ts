import mongoose from 'mongoose'
import Post from '../models/post.model'

const create_post = async (payload: { title: string, description: string, author: mongoose.Types.ObjectId }) => {
    const post = await Post.create(payload)
    console.log(post)
    return post
}
export default {
    create_post
}