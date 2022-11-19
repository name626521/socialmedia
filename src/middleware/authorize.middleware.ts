import { Request, Response, NextFunction } from "express";

export const authorized = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        //@ts-ignore
        if (!req?.roles) return res.status(401).json({ message: 'Not authorized because no roles inside req!' })

        const rolesArray = [...allowedRoles]
        //@ts-ignore
        const result = Object.values(req.roles).map(role => rolesArray.includes(role)).find((value) => value === true)

        if (!result) return res.status(401).json({ message: 'Unauthorized because role is not granted!' })

        next()
    }

}