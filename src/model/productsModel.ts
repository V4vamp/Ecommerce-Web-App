import { emitWarning } from "process";
import mongoose, { Schema } from "mongoose";
import { db } from "../config/database.config";
import UserSchema from "./userModel";

export interface ProductAttributes {
    _id:string;
    name:string;
  image:string;
  brand:string;
  category:string;
  description:string;
  price:number;
  countInStock:number;
  rating:number;
  numReviews:number;
  userId:string;
}

const ProductSchema = new mongoose.Schema(
    {
    name:{
        type:String,
        allowNull: false
    },
    image:{
        type:String,
        allowNull: false
    },
    brand:{
        type:String,
        allowNull: false
    },
    category:{
        type:String,
        allowNull: false
    },
    description:{
        type:String,
        allowNull: false
    },
    price:{
        type:Number,
        allowNull: false
    },
    countInStock:{
        type:Number,
        primaryKey: true,
        allowNull: false
    },
    rating:{
        type:Number,
        allowNull: false
    },
    numReviews:{
        type:Number,
        allowNull: false
    },
    userId:{
        type:Schema.Types.ObjectId
    }

},{
    timestamps: true,
    toJSON:{
        transform(doc, ret){
            (ret.productId = ret._id),
            delete ret.id,
            delete ret.password,
            delete ret.__v;
        }
    }
});

const Product = mongoose.model<ProductAttributes>("Product", ProductSchema);

export default Product;

