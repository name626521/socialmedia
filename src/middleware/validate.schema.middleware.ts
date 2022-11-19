import Joi, { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";
import Logger from '../library/Logger'
import { IUser } from "../models/user.model";

export const validate_schema = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body)

            next()

        } catch (err) {
            Logger.error(err)
            return res.status(422).json({ err })
        }
    }
}

export const Schemas = {
    user: {
        create: Joi.object<IUser>({
            username: Joi.string().required().regex(/^[0-9a-zA-Z]+$/).max(24),
            email: Joi.string().required().email(),
            password: Joi.string().required().min(8),
        }),
        update: Joi.object<IUser>({
            username: Joi.string().required().regex(/^[0-9a-zA-Z]+$/).max(24)
        })
    }
}