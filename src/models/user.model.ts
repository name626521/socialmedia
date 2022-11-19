import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
    username: string,
    email: string,
    password: string,
    refreshToken?: string,
    role?: object
}

export interface IUserModel extends IUser, Document { }

const UserSchema: Schema = new Schema(
    {
        isActive: Boolean,

        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,

        },
        password: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String
        },
        profile: {
            type: Schema.Types.ObjectId,
            ref: 'Profile'
        },
        role: {
            user: {
                type: String,
                default: 'user',
            },
            editor: {
                type: String,
            },
            admin: {
                type: String
            }
        },
        messages: [{
            type: Schema.Types.ObjectId,
            ref: 'Message'
        }],
        notifications: [{
            type: Schema.Types.ObjectId,
            ref: 'Notification'
        }]
    },
    {
        timestamps: true
    })

export default mongoose.model<IUserModel>('User', UserSchema)