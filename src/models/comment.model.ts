import mongoose, { Document, Schema } from 'mongoose';

export interface IComment {

}

export interface ICommentModel extends IComment, Document { }

const CommentSchema: Schema = new Schema(
    {
        body: {
            type: String,
            required: true
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true
        },
        comments: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }],
        likes: {
            type: Number,
            default: 0
        },
        dislikes: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    })

export default mongoose.model<ICommentModel>('Comment', CommentSchema)