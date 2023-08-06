import mongoose from "mongoose";


export interface SellerAttributes {
    
    _id:string;
    email:string;
    fullName:string;
    gender:string;
    phone:string;
    address:string;
    password:string;
}

const SellerSchema = new mongoose.Schema(
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
            ret.sellerId = ret._id,
            delete ret._id,
            delete ret.password,
            delete ret.__v
        }
    }
})


const Seller = mongoose.model<SellerAttributes>("Seller", SellerSchema);

export default Seller;