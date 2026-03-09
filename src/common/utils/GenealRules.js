import Joi from "joi"
import { Types } from "mongoose"

export const general_rules = {
    email: Joi.string().required().email({ tlds: { allow: true }, minDomainSegments: 2, maxDomainSegments: 2 }),
    password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),// at least any digit number ,at least any small char ,at least any capital char, any char  
    cpassword: Joi.string().valid(Joi.ref("password")),
    file: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().required(),
    }).required().messages({ "any.required": "file is required" }),
    id: Joi.string().custom((value,helper)=> {
    const isValid = Types.ObjectId.isValid(value)
    return isValid ? value : helper.message("invalid id")
}
)
}