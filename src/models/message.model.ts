import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
    from: Schema.Types.ObjectId,
    to: Schema.Types.ObjectId,
    content: String,
    read: Boolean,
}

export interface IMessageModel extends IMessage, Document { }

const MessageSchema: Schema = new Schema(
    {
        from: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        to: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        read: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    })

export default mongoose.model<IMessageModel>('Message', MessageSchema)