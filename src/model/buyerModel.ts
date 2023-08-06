import mongoose from "mongoose";

export interface BuyerAttributes {
    
    _id:string;
    email:string;
    fullName:string;
    phone:string;
    address:string;
    password:string;
}

const BuyerSchema = new mongoose.Schema(
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
            ret.buyerId = ret._id,
            delete ret._id,
            delete ret.password,
            delete ret.__v
        }
    }
})


const Buyer = mongoose.model<BuyerAttributes>("Buyer", BuyerSchema);

export default Buyer;