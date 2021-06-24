import { Document, Schema, model } from "mongoose";
import { User } from "../interfaces/User";

export interface UserModelInterface extends User, Document { }

export var UserSchema: Schema = new Schema({
    name: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true,
        select: false
    }
});

export default model<UserModelInterface>("Users", UserSchema);