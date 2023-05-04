"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productsController_1 = require("../controller/productsController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
/* Adding a new product */
router.post('/add', auth_1.auth, productsController_1.addProduct);
// to get products
router.get('/get-products', auth_1.auth, productsController_1.getProducts);
// to update products
router.patch('/upadate-product/:id', auth_1.auth, productsController_1.updateProduct);
// to destroy all data in the database
router.delete('/delete-product/:id', auth_1.auth, productsController_1.deleteProduct);
exports.default = router;
