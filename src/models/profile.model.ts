import mongoose, { Document, Schema } from 'mongoose';

export interface IProfile {

}

export interface IProfileModel extends IProfile, Document { }

const ProfileSchema: Schema = new Schema(
    {
        gender: {
            type: String,
        },
        birthday: {
            type: Date,
        },
        picture: {
            type: Schema.Types.ObjectId,
            ref: 'Media'
        },
        gallery: [{
            type: Schema.Types.ObjectId,
            ref: 'Media'
        }],
        friends: [{
            type: Schema.Types.ObjectId,
            ref: 'user'
        }]
    },
    {
        timestamps: true
    })

export default mongoose.model<IProfileModel>('Profile', ProfileSchema)