import jwt from 'jsonwebtoken';
import { config } from '../config/config'
import { Response, Request, NextFunction } from 'express';

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const auth_header = req.headers.authorization || req.headers.Authorization;

    if (!auth_header) return res.status(401).json({ message: 'Not allowed!' })


    const token = (auth_header as string).split(' ')[1]

    if ((auth_header as string).split(' ')[0] !== 'Bearer') return res.status(401).json({ message: 'Invalid format!' })
    //@ts-ignore

    jwt.verify(token, config.token.refresh, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Forbidden!' })
        //@ts-ignore

        req.user = decoded.username
        //@ts-ignore
        req.roles = decoded.roles

        next()
    })



}