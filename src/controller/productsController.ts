import express, {Request, Response} from "express"
import { createUnparsedSourceFile } from "typescript";
import ProductSchema, { ProductAttributes } from "../model/productsModel";
import {v4 as uuidv4} from "uuid"
import { addProductSchema, options, updateProductSchema } from "../utilis/utilis";
import { string } from "joi";
import Product from "../model/productsModel";



        export const addProduct =async (req:Request | any, res:Response) => {
           const productId = "";
            try{
                const verified = req.user;
                const validationResult = addProductSchema.validate(req.body, options)

                if(validationResult.error){
                    return res.status(400).json({
                      Error: validationResult.error.details[0].message
                    })
                }

                const productRecord = await Product.create({
                    productId,
                    ...req.body,
                    userId: verified.id
                })

                return res.status(201).json({
                    msg:"You have successfully added a product",
                    productRecord
                })
            }
            catch(error){
                console.log(error)
            }
        };
        


        export const getProducts = async (req:Request, res:Response)=>{
            try{
              const limit = parseInt(req.query.limit as string, 10);
              const offset = parseInt(req.query.offset as string, 10);

              const getAllProducts: ProductAttributes[] = await Product.find()
              .skip(offset)
              .limit(limit)
              .lean()
              .exec();

              const count: number = await Product.countDocuments();

                res.render("Products", {
                msg: "Successfully collected all products",
                count,
                product: getAllProducts,
            })

        }catch(error) {
        console.log(error);
        res.status(500).render("error", { message: "Internal Server Error"})
    }
  };


export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const {price, countInStock, rating, numReviews } = req.body;

    const validationResult = updateProductSchema.validate(req.body, options);

    if(validationResult.error){
        return res.status(400).json({Error:validationResult.error.details[0].message});
    }

    const productRecord = await Product.findOne({where: { productId }});

    if (!productRecord) {
      return res.status(404).json({ 
    msg: `Product with id ${ productId } not found` 
});
    }

    productRecord.price = price;
    productRecord.countInStock = countInStock;
    productRecord.rating = rating;
    productRecord.numReviews = numReviews;

    await productRecord.save();

    return res.status(200).json({
      msg: `Product with id ${ productId } has been updated`,
      productRecord,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
      const { productId } = req.params;
  
      const productRecord = await Product.findByIdAndDelete({_id:productId});
  
      return res.redirect("/products");
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };


