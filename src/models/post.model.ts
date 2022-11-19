import mongoose, { Document, Schema } from 'mongoose';

export interface IPost {
    title: String,
    description: String,
    author: Schema.Types.ObjectId,
}

export interface IPostModel extends IPost, Document { }

const PostSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        media: [{
            type: Schema.Types.ObjectId,
            ref: 'Media'
        }],
        comments: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment',
            default: []
        }]
    },
    {
        timestamps: true
    })

export default mongoose.model<IPostModel>('Post', PostSchema)