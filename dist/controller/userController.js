"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.Logout = exports.getUser = exports.getUserAndProduct = exports.getUsers = exports.Login = exports.Register = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const utilis_1 = require("../utilis/utilis");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtsecret = process.env.JWT_SECRET;
//Create User Registration
const Register = async (req, res) => {
    try {
        const { fullName, email, password, confirm_password, gender, phone, address, } = req.body;
        //You can validate with Joi or Zod
        //Validate with Joi
        const validationResult = utilis_1.registerUserSchema.validate(req.body, utilis_1.options);
        console.log(validationResult);
        if (validationResult.error) {
            //return res.render("Register", 
            return res.status(400).json({
                error: validationResult.error.details[0].message,
            });
        }
        //Hash Password
        const passwordHash = await bcryptjs_1.default.hash(password, 8);
        // Create user
        // Check if user exist
        const userData = await userModel_1.default.findOne({
            where: { email: email },
        });
        let newUser;
        if (!userData) {
            newUser = await userModel_1.default.create({
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
        const user = await userModel_1.default.findOne({ email });
        if (user) {
            const { _id } = user;
            const token = jsonwebtoken_1.default.sign({ userId: _id }, jwtsecret, { expiresIn: "30mins" });
            res.cookie("token", token, { httpOnly: true, maxAge: 30 * 60 * 1000 });
        }
        else {
            res.status(404).send("User not found");
        }
        return res.render("Register", { error: "Email is already taken" });
        // return res.status(201).json({
        //   msg: "user created successfully",
        //   newUser,
        //   token
        // })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ Error: "Internal Server Error" });
    }
};
exports.Register = Register;
//Create Login for User
const Login = async (req, res) => {
    try {
        const { email, password } = req.body; //You can validate with Joi or Zod
        // Find user in the database
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }
        //Validate with Joi
        const validationResult = utilis_1.loginUserSchema.validate(req.body, utilis_1.options);
        if (validationResult.error) {
            return res.render("Login", {
                error: validationResult.error.details[0].message,
            });
        }
        // Generate Token for User
        //const user = await User.findOne({email}) as unknown as { [key: string]: string };
        if (user) {
            const { _id } = user;
            const token = jsonwebtoken_1.default.sign({ userId: user?._id }, jwtsecret, { expiresIn: "30mins" });
            res.cookie("token", token, { httpOnly: true, maxAge: 30 * 60 * 1000 });
        }
        else {
            res.status(404).send("User not found");
        }
        //Determine if user password is valid
        const validUser = await bcryptjs_1.default.compare(password, user.password);
        if (validUser) {
            return res.redirect("/admin");
        }
        //If not a valid user or with incorrect login details
        res.render("Login", { error: "Invalid email/password" });
    }
    catch (err) {
        console.log(err);
        //res.status(500).json({ Error: "Internal Server Error" });
    }
};
exports.Login = Login;
//Get a list of all users in the database
const getUsers = async (req, res) => {
    try {
        const users = await userModel_1.default.find();
        res.status(200).json(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.getUsers = getUsers;
//Get User With His/Her Products
const getUserAndProduct = async (req, res) => {
    try {
        const getAllUsers = await userModel_1.default.find().populate("products");
        res.status(200).json({
            msg: "You have successfully retrieved all data",
            count: getAllUsers.length,
            users: getAllUsers, //.rows - anytime you wanna target new content
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getUserAndProduct = getUserAndProduct;
const getUser = async (req, res) => {
    try {
        const { _id } = req.params;
        const user = await userModel_1.default.findOne({ where: { id: _id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.getUser = getUser;
//Create Logout for Users
const Logout = async (req, res) => {
    res.clearCookie("token");
    res.redirect("./");
};
exports.Logout = Logout;
const deleteUser = async (req, res) => {
    try {
        const { _id } = req.params;
        const user = await userModel_1.default.findByIdAndDelete(_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.deleteUser = deleteUser;
