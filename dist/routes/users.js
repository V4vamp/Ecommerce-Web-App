"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const router = express_1.default.Router();
/* Post new users */
router.post('/register', userController_1.Register);
router.post('/signin', userController_1.Login);
router.get('/get-all', userController_1.getUserAndProduct);
router.get('/get-users', userController_1.getUsers);
router.get('/logout', userController_1.Logout);
router.get('/get-user/:id', userController_1.getUser);
router.delete('/delete-user/:id', userController_1.deleteUser);
exports.default = router;
