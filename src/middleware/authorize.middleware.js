"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorized = void 0;
const authorized = (...allowedRoles) => {
    return (req, res, next) => {
        //@ts-ignore
        if (!(req === null || req === void 0 ? void 0 : req.roles))
            return res.status(401).json({ message: 'Not authorized because no roles inside req!' });
        const rolesArray = [...allowedRoles];
        //@ts-ignore
        const result = Object.values(req.roles).map(role => rolesArray.includes(role)).find((value) => value === true);
        if (!result)
            return res.status(401).json({ message: 'Unauthorized because role is not granted!' });
        next();
    };
};
exports.authorized = authorized;
