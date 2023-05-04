import Joi from "joi";



export const registerUserSchema = Joi.object().keys({
    email:Joi.string().trim().lowercase().required(),
    fullName:Joi.string().required(),
    gender:Joi.string().required(),
    phone:Joi.string().required(),
    address:Joi.string().required(),
    password:Joi.string().regex(/^[a-zA-Z0-9]{8,30}$/).required(),
    confirm_password:Joi.any().equal(Joi.ref("password")).required().label("Comfirm password").messages({"any.only":"{{#label}} does not match"})
})

export const options = {
    abortEarly: false,
    errors:{
        wrap:{
            label:""
        }
    }
}

export const loginUserSchema = Joi.object().keys({
    email:Joi.string().trim().lowercase().required(),
    password:Joi.string().regex(/^[a-zA-Z0-9]{8,30}$/).required()
})


export const addProductSchema = Joi.object().keys({
    name:Joi.string().required(),
    image:Joi.string().required(),
    brand:Joi.string().required(),
    category:Joi.string().required(),
    description:Joi.string().required(),
    price:Joi.number().required(),
    countInStock:Joi.number().required(),
    rating:Joi.number().required(),
    numReviews:Joi.number().required()

})

export const updateProductSchema = Joi.object().keys({
    price:Joi.number(),
    countInStock:Joi.number(),
    rating:Joi.number(),
    numReviews:Joi.number()
})