import { emitWarning } from "process";
import Model from "mongoose";
import { db } from "../config/database.config";
import ProductSchema from "./productsModel";
import mongoose from "mongoose";
import { transform } from "typescript";

export interface UserAttributes {
    
    _id:string;
    email:string;
    fullName:string;
    gender:string;
    phone:string;
    address:string;
    password:string;
}

const UserSchema = new mongoose.Schema(
    {

    email:{
        type:String,
        allowNull: false,
        unique: true
    },
    fullName:{
        type:String,
        primaryKey: true,
        allowNull: false
    },
    phone:{
        type:String,
        allowNull: false,
        unique:true
    },
    gender:{
        type:String,
        allowNull: false
    },
    address:{
        type:String,
        allowNull: false,
    },
    password:{
        type:String,
        allowNull:false
    }

}, {
    timestamps: true,
    toJSON:{
        transform(doc, ret){
            ret.userId = ret._id,
            delete ret._id,
            delete ret.password,
            delete ret.__v
        }
    }
})


const User = mongoose.model<UserAttributes>("User", UserSchema);

export default User;