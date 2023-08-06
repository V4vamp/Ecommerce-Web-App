import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { AdminAttributes } from "../model/userModel";
import { registerUserSchema, registerAdminSchema } from "../utilis/utilis";

const jwtsecret = process.env.JWT_SECRET as string;

export type UserType = "buyer" | "seller" | "admin";

interface VerifiedPayload extends JwtPayload {
    userId: string;
    role: UserType;
}

export async function auth(req: Request | any, res: Response, next: NextFunction) {
    try {
        const authorization = req.cookies.token;

        if (!authorization) {
            return res.status(401).json({ Error: "Kindly sign in as a user" });
        }

        let verified = jwt.verify(authorization, jwtsecret);

        if (!verified) {
            return res
                .status(401)
                .json({ Error: "Token is Invalid; you can't access this route" });
        }

        const { userId, role } = verified as { [key: string]: string }; // Assuming role is stored in the JWT payload

        const user = await User.findOne({ where: { _id: userId } });

        if (!user) {
            return res.status(401).json({ Error: "User not found" });
        }

        if (role === "buyer" || role === "seller" || role === "admin") {
            req.user = verified;
            res.locals.user = user;

            // Check for passCode for admin registration
            if (verified.role === "admin" && !(user as unknown as AdminAttributes).passCode) {
                return res
                    .status(401)
                    .json({ Error: "Admin passCode required for registration" });
            }

            next();
        } else {
            return res.status(403).json({ Error: "Unauthorized role" });
        }
    } catch (err) {
        res.status(401).json({ Error: "User not logged in" });
    }
}
