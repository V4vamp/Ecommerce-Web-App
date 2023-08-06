import mongoose from "mongoose";

export interface AdminAttributes {
    
    _id:string;
    email:string;
    fullName:string;
    gender:string;
    phone:string;
    address:string;
    password:string;
    passCode: string;
}

const AdminSchema = new mongoose.Schema(
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
    },
    passCode:{
        type:String,
        primaryKey: true,
        allowNull: false
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


const Admin = mongoose.model<AdminAttributes>("Admin", AdminSchema);

export default Admin;