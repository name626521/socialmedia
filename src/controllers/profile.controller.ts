import { Request, Response } from 'express';
import Profile from '../models/profile.model'
import Image from '../models/media.model'
import User from '../models/user.model';


const readAllProfiles = (req: Request, res: Response) => {
    return Profile.find()
        .select(['-__v', '-createdAt', '-updatedAt'])
        .then(profiles => res.status(200).json(profiles))
        .catch(err => res.status(500).json({ err }))
}

const updateProfile = async (req: Request, res: Response) => {
    const profile_id = req.params.id

    try {
        const profile = await Profile.findOneAndUpdate({ _id: profile_id }, req.body, { new: true, rawResult: true })
        const refresh_token = req.cookies.jwt
        const found_user = await User.findOne({ refreshToken: refresh_token })
        const user_owner = await User.findOne({ profile: profile_id })
        console.log('req user ', found_user)
        console.log('owner ', user_owner)

        if (!found_user) return res.status(403).json({ message: 'User not found' })
        if (user_owner && JSON.stringify(user_owner) !== JSON.stringify(profile)) return res.status(403).json({ message: 'Profile private!!' })

        console.log(profile.value)

        return res.status(200).json({ message: 'Profile updated successfully' })
    } catch (err) {
        res.status(500).json(err)
    }
}

const deleteProfile = async (req: Request, res: Response) => {
    const profile_id = req.params.id
    try {
        const refresh_token = req.cookies.jwt
        const found_user = await User.findOne({ refreshToken: refresh_token })
        const user_owner = await User.findOne({ profile: profile_id })
        console.log('req user ', found_user)
        console.log('owner ', user_owner)

        if (!found_user) return res.status(403).json({ message: 'User not found' })
        if (user_owner && JSON.stringify(user_owner) !== JSON.stringify(found_user)) return res.status(403).json({ message: 'Profile private!!' })

        const result = await Profile.findByIdAndDelete(profile_id)
        result ? res.status(201).json({ message: 'Profile deleted!' }) : res.status(404).json({ message: 'Not found!' })

    } catch (err) {
        res.status(500).json({ message: 'Something wrong!' })
    }
}


const readProfile = (req: Request, res: Response) => {
    const profile_id = req.params.id

    return Profile.findById(profile_id)
        .select('-__v')
        .then(profile => res.status(200).json({ profile }))
        .catch(err => res.status(500).json({ err }))
}


const uploadFile = (req: Request, res: Response) => {
    //@ts-ignore
    console.log(req.name)
    Image.create({
        name: req.body.name,
        img: {
            //@ts-ignore
            data: fs.readFileSync(path.resolve('./src/photos/' + req.name)),
            ContentType: req.file?.mimetype
        }
    }).then(image => console.log(image)).catch(err => console.log(err));

    return res.status(200).json({ message: 'Uploaded file successfully' })
}

export default {
    readAllProfiles,
    updateProfile,
    deleteProfile,
    readProfile,
    uploadFile
}