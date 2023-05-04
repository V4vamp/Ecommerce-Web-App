"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProducts = exports.addProduct = void 0;
const utilis_1 = require("../utilis/utilis");
const productsModel_1 = __importDefault(require("../model/productsModel"));
const addProduct = async (req, res) => {
    const productId = "";
    try {
        const verified = req.user;
        const validationResult = utilis_1.addProductSchema.validate(req.body, utilis_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message
            });
        }
        const productRecord = await productsModel_1.default.create({
            productId,
            ...req.body,
            userId: verified.id
        });
        return res.status(201).json({
            msg: "You have successfully added a product",
            productRecord
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.addProduct = addProduct;
const getProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10);
        const offset = parseInt(req.query.offset, 10);
        const getAllProducts = await productsModel_1.default.find()
            .skip(offset)
            .limit(limit)
            .lean()
            .exec();
        const count = await productsModel_1.default.countDocuments();
        res.render("Products", {
            msg: "Successfully collected all products",
            count,
            product: getAllProducts,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).render("error", { message: "Internal Server Error" });
    }
};
exports.getProducts = getProducts;
const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { price, countInStock, rating, numReviews } = req.body;
        const validationResult = utilis_1.updateProductSchema.validate(req.body, utilis_1.options);
        if (validationResult.error) {
            return res.status(400).json({ Error: validationResult.error.details[0].message });
        }
        const productRecord = await productsModel_1.default.findOne({ where: { productId } });
        if (!productRecord) {
            return res.status(404).json({
                msg: `Product with id ${productId} not found`
            });
        }
        productRecord.price = price;
        productRecord.countInStock = countInStock;
        productRecord.rating = rating;
        productRecord.numReviews = numReviews;
        await productRecord.save();
        return res.status(200).json({
            msg: `Product with id ${productId} has been updated`,
            productRecord,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const productRecord = await productsModel_1.default.findByIdAndDelete({ _id: productId });
        return res.redirect("/products");
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
exports.deleteProduct = deleteProduct;
