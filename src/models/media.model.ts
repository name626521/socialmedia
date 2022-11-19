import mongoose, { Document, Schema } from 'mongoose';

export interface IImage {
    name: string;
    img: {
        data: Buffer,
        contentType: string
    }
}

export interface ImagModel extends IImage, Document { }

const ImageSchema: Schema = new Schema(
    {
        contentType: {
            type: String,
        },
        file: {
            data: Buffer,
            path: String
        }
    },
    {
        timestamps: true
    })

export default mongoose.model<ImagModel>('image', ImageSchema)