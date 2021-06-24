import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export default function auth(req: Request, res: Response, next: NextFunction) {
    
    const authHeader = req.headers.authorization

    if (!authHeader)
        return res.status(401).json({
            status: false,
            data: "Token Invalido."
        })

    const headerParts = authHeader.split(' ')

    if (!(headerParts.length === 2))
        return res.status(401).json({
            status: false,
            data: "Token Invalido."
        })

    const [sheme, token] = headerParts

    if (!/^Bearer$/i.test(sheme))
        return res.status(401).json({
            status: false,
            data: "Token Invalido."
        })

    jwt.verify(token, process.env.JWT_HASH_CODE, (err, decoded) => {
        if (err)
            return res.status(401).json({
                status: false,
                data: "Token Invalido."
            })

        req['name'] = decoded.name
        return next()
    })
}