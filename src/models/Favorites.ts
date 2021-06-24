import { Document, Schema, model } from "mongoose";
import { IFavoritesProducts } from "../interfaces/Favorites";

export const FavoritesProductsSchema: Schema = new Schema({
    userId: {
        type: String,
        require: true
    },
    products: {
        type: Array,
        require: true
    }
})

export const FavoritesProducts = model<IFavoritesProducts>("products_favorites", FavoritesProductsSchema);