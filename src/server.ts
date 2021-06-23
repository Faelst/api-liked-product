import express, { Request, Response } from 'express';
import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dontenv from 'dotenv'

import { User } from './interfaces/User';
import UserSchema from './models/user'
import auth from './middleware/auth';

dontenv.config()
const app = express()

app.get('/', (req: Request, res: Response) => {
    return res.status(200).send("API Running")
})

app.post('/login', async (req: Request, res: Response) => {

    const { username, password } = req.body

    const user: User = await UserSchema.findOne({ username }).select('+password')

    if(!user)
        return res.status(400).send({ status: false, data: 'Usuario nao localizado'})

    if(!await bycrypt.compare(password, user.password))
        return res.status(400).send({ status: false , data: 'Login incorreto'})

    delete user.password

    const token = jwt.sign({ name: user.name }, process.env.JWT_HASH_CODE, {
        expiresIn: 7200
    })

    res.send({ user, token })
})

app.post('/favoriteProduct', auth, async (req: Request, res: Response) => {
    res.status(200).json("favoritando produto")
})

app.listen(8080, () => console.log('API listen on http://localhost:8080'))