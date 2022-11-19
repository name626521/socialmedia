import User, { IUserModel } from '../models/user.model'
import mongoose, { FilterQuery, Mongoose, QueryOptions } from 'mongoose'

const create_user = (payload: { email: String, username: String, password: String, profile: mongoose.Types.ObjectId }) => {
    return User.create(payload)
}

const find_user = (query: FilterQuery<IUserModel>, options: QueryOptions = { lean: true }) => {
    return User.findOne(query, {}, options)
}

const save_user = async (user: mongoose.Document<IUserModel>) => {
    return user.save()
}
export default {
    create_user,
    find_user,
    save_user
}