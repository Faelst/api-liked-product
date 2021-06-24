import { Document, Schema, model } from "mongoose";
import { Products } from "../interfaces/Products";


export const ProductSchema: Schema = new Schema({
    description: {
        type: String,
        require: true
    },
    imgUrl: {
        type: String,
        require: true
    },
    afterPrice: {
        type: Number,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    isFavorited: {
        type: Boolean
    }
})

interface IProductDocument extends Products, Document {}
export const ProductModel = model<IProductDocument>("Products", ProductSchema);