import Joi from "joi"
import { genderEnum } from "../../common/enum/user.enum.js"
import { general_rules } from "../../common/utils/GenealRules.js"

export const signUpSchema = {
    body: Joi.object({
        userName: Joi.string().trim().min(5).max(40).required(),
        email: general_rules.email.required(),
        password: general_rules.password.required(),// at least any digit number ,at least any small char ,at least any capital char, any char  
        cpassword: general_rules.cpassword.required(),
        gender: Joi.string().valid(...Object.values(genderEnum)).required(),
        phone: Joi.string().required(),
        age: Joi.number()
    }).required(),
    // query: Joi.object({
    //     x: Joi.number().required()
    // }).required()
    // file: general_rules.file.required(),

    // files:Joi.array().max(2).items( general_rules.file.required()).required().messages({ "any.required": "file is required" }),

    files: Joi.object(
        {
            attachment: Joi.array().max(1).items(general_rules.file.required()).required().messages({
                "any.required": "attachment is required"
            }),
            attachments: Joi.array().max(2).items(general_rules.file.required()).required().messages({
                "any.required": "attachments is required"
            })
        }
    ).required()
}

export const signInSchema = {
    body: Joi.object({

        userName: Joi.string().trim().min(5).max(40),
        email: general_rules.email.required(),
        password: general_rules.password.required(),
    }).required(),

}

export const shareprofileSchema = {
    params: Joi.object({
        id: general_rules.id.required()
    })
}

export const updateProfileScema = {
    body: Joi.object({
        firstName: Joi.string().trim().min(5).max(40),
        lastName: Joi.string().trim().min(5).max(40),
        gender: Joi.string().valid(...Object.values(genderEnum)),
        phone: Joi.string(),
    }).required()
}
export const updatePasswordeScema = {
    body: Joi.object({
        cpassword: Joi.string().valid(Joi.ref("newPassword")),
        oldPassword: general_rules.password.required(),
        newPassword: general_rules.password.required(),
    }).required()
}