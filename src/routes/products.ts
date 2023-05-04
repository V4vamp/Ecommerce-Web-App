import express,{Request,Response,NextFunction} from 'express';
import { addProduct, deleteProduct, getProducts, updateProduct, } from '../controller/productsController';
import { auth } from '../middlewares/auth';

const router = express.Router();

/* Adding a new product */
router.post('/add', auth, addProduct)
// to get products
router.get('/get-products', auth, getProducts);
// to update products
router.patch('/upadate-product/:id', auth, updateProduct);
// to destroy all data in the database
router.delete('/delete-product/:id', auth, deleteProduct)

export default router;