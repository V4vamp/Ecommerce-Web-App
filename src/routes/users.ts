import express,{Request, Response, NextFunction} from 'express';
import {getUsers, getUserAndProduct, Login, Logout, Register, getUser, deleteUser} from "../controller/userController";
const router = express.Router();

/* Post new users */

router.post('/register', Register);
router.post('/signin', Login);
router.get('/get-all', getUserAndProduct);
router.get('/get-users', getUsers)
router.get('/logout', Logout)
router.get('/get-user/:id', getUser)
router.delete('/delete-user/:id', deleteUser)

export default router;
