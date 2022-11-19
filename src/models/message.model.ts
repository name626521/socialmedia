import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {

}

export interface IMessageModel extends IMessage, Document { }

const MessageSchema: Schema = new Schema(
    {
        body: {
            type: String,
            required: true
        },
        recepient: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    })

export default mongoose.model<IMessageModel>('Message', MessageSchema)