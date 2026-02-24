
import { log } from "node:console"
import { providerEnum } from "../../common/enum/user.enum.js"
import { successResponse } from "../../common/utils/response.success.js"
import { decrypt, encrypt } from "../../common/utils/security/encrypt.security.js"
import { compare, hashsync } from "../../common/utils/security/hash.security.js"
import { generateToken, verifyToken } from "../../common/utils/token.service.js"
import * as db_service from "../../DB/db.service.js"
import userModel from "../../DB/models/user.model.js"
import { v4 as uuidv4 } from "uuid"
import { SALT_ROUNDS, SECRET_KEY } from "../../../config/config.service.js"

// version 4
// const asyncHandler = (fn) => {
//     return (req, res, next) => {
//         fn(req, res, next).catch((error)=>{
//             next(error)
//         })

//     }
// }

export const signUp =
    async (req, res, next) => {

        const { userName, email, gender, password, cpassword, age, phone } = req.body
        if (password != cpassword) {
            throw new Error("password not match with cpassword", { cause: 500 });

        }
        const emailExist = await db_service.findOne({ model: userModel, filter: { email } })
        if (emailExist) {
            throw new Error("email already  exist", { cause: 409 });


        }
        const user = await db_service.create({ model: userModel, data: { userName, email, gender, password: hashsync({ plaintText: password, salt: SALT_ROUNDS }), cpassword, age, phone: encrypt(phone) } })

        successResponse({ res, status: 201, message: "create user successfully", data: user })



    }


export const signIn = async (req, res, next) => {
    const { email, password } = req.body

    const user = await db_service.findOne({ model: userModel, filter: { email, provider: providerEnum.system } })
    if (!user) {
        throw new Error("user not exist", { cause: 409 });
    }
    const match = compare(password, user.password)
    if (!match) {
        throw new Error("invalid password", { cause: 400 });
    }
    const access_token = generateToken({
        payload: { id: user._id, email: user.email }, secret_key: SECRET_KEY, options: {
            expiresIn: "1day",
            issuer: "http://localhost:3000",
            audience: "http://localhost:4000",
            // notBefore: 60 * 60,
            jwtid: uuidv4()

        }
    })
    successResponse({ res, data: { access_token }, message: "sign in successfully" })

}

export const getProfile = async (req, res, next) => {
    // const { id } = req.params;
    // const { authorization } = req.headers;
    // const decoded = verifyToken({ token: authorization, secret_key: "samah" })


    successResponse({ res, data: req.user, message: "success signin" })

}

export const signUpWithgoogle = (req, res, next) => {
    const { idToken } = req.body;
    console.log('====================================');
    console.log(idToken);
    console.log('====================================');
}