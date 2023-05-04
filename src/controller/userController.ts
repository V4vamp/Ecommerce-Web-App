import express, {Request, Response} from "express"
import { createUnparsedSourceFile } from "typescript";
import  User from "../model/userModel";
import {v4 as uuidv4} from "uuid";
import { registerUserSchema, options, loginUserSchema } from "../utilis/utilis";
import bcrypt, { genSalt } from "bcryptjs";
import { string } from "joi";
import jwt from "jsonwebtoken";
import ProductSchema from "../model/productsModel";
import { token } from "morgan";

const jwtsecret = process.env.JWT_SECRET as string;

//Create User Registration
export const Register = async (req: Request, res: Response) => {
   
    try {
      const {
        fullName,
        email,
        password,
        confirm_password,
        gender,
        phone,
        address,
      } = req.body; 
      
      //You can validate with Joi or Zod
  
      //Validate with Joi
      const validationResult = registerUserSchema.validate(req.body, options);
  
      console.log(validationResult);
  
      if (validationResult.error) {
        //return res.render("Register", 
        return res.status(400).json(
        {
          error: validationResult.error.details[0].message,
        });
      }
  
      //Hash Password
      const passwordHash = await bcrypt.hash(password, 8);
  
      // Create user
      // Check if user exist
      const userData = await User.findOne({
        where: { email: email },
      });
  
     let newUser;
      if (!userData) {
         newUser = await User.create({
          fullName,
          email,
          password: passwordHash,
          gender,
          phone,
          address,
        });
  
        //otp, email
       return res.redirect("/login");
      }

      // //Generate Token for User
      const user = await User.findOne({email}) as unknown as { [key: string]: string };
        if(user){
          const { _id } = user;
    
      const token = jwt.sign({ userId:_id } , jwtsecret, { expiresIn: "30mins" });
      res.cookie("token", token, { httpOnly: true, maxAge: 30 * 60 * 1000 });
        }else{
          res.status(404).send("User not found");
        }
  
      return res.render("Register", { error: "Email is already taken" });
        // return res.status(201).json({
        //   msg: "user created successfully",
        //   newUser,
        //   token
        // })
    } catch (err) {
      console.log(err);
      res.status(500).json({ Error: "Internal Server Error" });
    }
  };
  
  //Create Login for User
  export const Login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body; //You can validate with Joi or Zod
  
      // Find user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }
      
      //Validate with Joi
      const validationResult = loginUserSchema.validate(req.body, options);
  
      if (validationResult.error) {
        return res.render("Login", {
          error: validationResult.error.details[0].message,
        });
      }
  
      // Generate Token for User
      //const user = await User.findOne({email}) as unknown as { [key: string]: string };
        if(user){
          const { _id } = user;
    
      const token = jwt.sign({ userId: user?._id }, jwtsecret, { expiresIn: "30mins" });
      res.cookie("token", token, { httpOnly: true, maxAge: 30 * 60 * 1000 });
        }else{
          res.status(404).send("User not found");
        }
  
      //Determine if user password is valid
      const validUser = await bcrypt.compare(password, user.password);
  
      if (validUser) {
        return res.redirect("/admin");
      }
      //If not a valid user or with incorrect login details
      res.render("Login", { error: "Invalid email/password" });
    } catch (err) {
      console.log(err);
      //res.status(500).json({ Error: "Internal Server Error" });
    }
  };
  
  //Get a list of all users in the database
  export const getUsers = async (req: Request, res: Response) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  //Get User With His/Her Products
  export const getUserAndProduct = async (req: Request, res: Response) => {
    try {
      const getAllUsers = await User.find().populate("products");
  
      res.status(200).json({
        msg: "You have successfully retrieved all data",
        count: getAllUsers.length,
        users: getAllUsers, //.rows - anytime you wanna target new content
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  export const getUser = async (req:Request, res:Response)=>{
    try{
      const { _id } = req.params;
      const user = await User.findOne({where:{id:_id}})
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
    
  }
  
  //Create Logout for Users
  export const Logout = async (req: Request, res: Response) => {
    res.clearCookie("token");
    res.redirect("./");
  };

  export const deleteUser = async (req: Request, res: Response) => {
    try {
      const { _id } = req.params;
      const user = await User.findByIdAndDelete(_id);
      
    if (!user) {
      return res.status(404).json({ message: 'User not found' });      
    }
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
    }
  };