import { json } from "body-parser";
import { Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import { nextTick } from "process";
import User from "../model/userModel";
import { registerUserSchema } from "../utilis/utilis";


const jwtsecret = process.env.JWT_SECRET as string;

export async function auth(req:Request | any, res:Response, next:NextFunction){
    try{
        //const authorization = req.headers.authorization;
        // authorization using cookies
        const authorization = req.cookies.token;

        if(!authorization){
            return res.status(401).json({Error:"Kindly sign in as a user"})
        }
            //const token = authorization.slice(7, authorization.length)

            let verified = jwt.verify(authorization, jwtsecret); // for cookies

            //let verified = jwt.verify(token, jwtsecret)

        if(!verified){
                return res.status(401).json({Error:"Token is Invalid; you can't access this route"})
        }

        const { userId} = verified as {[key:string]:string}

        // find user by id

        const user = await User.findOne({where: {_id:userId}})

        if(!registerUserSchema){
            return res.status(401).json({Error:"Kindly sign in as a user"})
        }

        req.user = verified
        res.locals.user = user
        
        next();
    }
    catch(err){
        res.status(401).json({Error:"User not looged in"})
    }
}