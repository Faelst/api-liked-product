import express, { Request, Response } from 'express';
import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dontenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'

import { ProductModel } from './models/Prodocts';
import UserSchema from './models/User'
import auth from './middleware/auth';
import { connect } from './database';
import { User } from './interfaces/User';
import { FavoritesProducts } from './models/Favorites';

const app = express()
app.use(cors())
app.use(express.json())
dontenv.config()
connect()

app.get('/', async (req: Request, res: Response) => {
    return res.status(200).send("API Running")
})

app.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body

    const user: User = await UserSchema.findOne({ username }).select('+password')

    if (!user)
        return res.status(400).send({ status: false, data: 'Usuario nao localizado' })

    // if (!await bycrypt.compare(password, user.password))
    if (!(password == user.password)) // Como a senha nao esta sendo criptografada, a verificação esta comparando somente os textos
        return res.status(400).send({ status: false, data: 'Login incorreto' })

    delete user.password

    const token = jwt.sign({ name: user.name }, process.env.JWT_HASH_CODE, {
        expiresIn: 7200
    })

    res.send({ user, token })
})

app.get('/Products', async (req: Request, res: Response) => {
    const {userId}: any = req.query
    let products: any = await ProductModel.find()
    const favorites: any = await FavoritesProducts.findOne({ userId })

    products = products.map((element, index, array) => {
        array[index].isFavorited = favorites.products.includes(element['_id'])
        return array[index]
    });

    return res.status(200).send({ products })
})

app.post('/favoriteProduct', auth, async (req: Request, res: Response) => {
    const { productId, userId, isFavorited } = req.body

    const favorites = await FavoritesProducts.findOne({ userId: userId })

    if (!favorites) {
        await FavoritesProducts.create({
            userId: userId,
            products: [productId]
        })
        return res.status(200).json("favoritando produto")
    }

    if (isFavorited) {
        await FavoritesProducts.updateOne(
            { userId: userId },
            { $push: { products: productId } }
        )
        return res.status(200).json("favoritando produto")
    }

    await FavoritesProducts.updateOne(
        { userId: userId },
        { $pullAll: { products: [productId] } }
    )
    return res.status(200).json("Produto removido dos favoritos")
})

app.listen(8080, () => console.log('API listen on http://localhost:8080'))