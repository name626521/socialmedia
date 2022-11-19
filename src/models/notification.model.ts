import mongoose, { Document, Schema } from 'mongoose';

export interface INotification {

}

export interface INotificationModel extends INotification, Document { }

const NotificationSchema: Schema = new Schema(
    {
        status: {
            enum: ['read', 'undread']
        }
    },
    {
        timestamps: true
    })

export default mongoose.model<INotificationModel>('Notification', NotificationSchema)