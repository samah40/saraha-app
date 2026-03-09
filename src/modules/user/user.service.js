
import { providerEnum } from "../../common/enum/user.enum.js"
import { successResponse } from "../../common/utils/response.success.js"
import { decrypt, encrypt } from "../../common/utils/security/encrypt.security.js"
import { compare, hashsync } from "../../common/utils/security/hash.security.js"
import { generateToken, verifyToken } from "../../common/utils/token.service.js"
import * as db_service from "../../DB/db.service.js"
import userModel from "../../DB/models/user.model.js"
import { v4 as uuidv4 } from "uuid"
import { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY, SALT_ROUNDS } from "../../../config/config.service.js"
import cloudinary from "../../common/utils/cloudinary.js"
import { model } from "mongoose"


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
        // console.log('====================================');
        // console.log(req.file, "after");
        // console.log('====================================');
        // let arr_path=[]
        //         for (const file of req.files.attachments) {
        //             arr_path.push(file.path)
        //         }
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: "sarahaApp/users",
            // public_id:"ahmed",
            // use_filename: true,
            // unique_filename: false,
            resource_type: "auto"

        })

        const { userName, email, gender, password, cpassword, age, phone } = req.body

        if (password != cpassword) {
            throw new Error("password not match with cpassword", { cause: 500 });

        }
        const emailExist = await db_service.findOne({ model: userModel, filter: { email } })
        if (emailExist) {
            throw new Error("email already  exist", { cause: 409 });


        }
        const user = await db_service.create({
            model: userModel, data: {
                userName, email, gender, password: hashsync({ plaintText: password, salt: SALT_ROUNDS }), cpassword, age,
                phone: encrypt(phone),
                profilePicture: { secure_url, public_id },
                // coverPicture:arr_path

            }
        })

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
        payload: { id: user._id, email: user.email }, secret_key: ACCESS_SECRET_KEY,
        options: {
            expiresIn: "1day",
            issuer: "http://localhost:3000",
            audience: "http://localhost:4000",
            // notBefore: 60 * 60,
            jwtid: uuidv4()

        }
    })
    const refresh_token = generateToken({
        payload: { id: user._id, email: user.email },
        secret_key: REFRESH_SECRET_KEY,
        options: {
            expiresIn: "1y"
        }
    })
    successResponse({ res, data: { access_token, refresh_token }, message: "sign in successfully" })

}

export const refresh_token = async (req, res, next) => {
    const { authorization } = req.headers
    const [prefix, token] = authorization.split(" ")
    if (prefix !== PREFIX) {
        throw new Error("invalid token prefix");

    }
    if (!token) {
        throw new Error("token not exist");

    }
    const decoded = verifyToken({ token, secret_key: REFRESH_SECRET_KEY })

    if (!decoded || !decoded?.id) {
        throw new Error("invalid token");

    }


    const user = await db_service.findOne({ model: userModel, filter: { id: decoded.id }, options: { select: "-password" } })
    if (!user) {
        throw new Error("user not exist", { cause: 400 });

    }
    const refresh_token = generateToken({
        payload: { id: user._id, email: user.email },
        secret_key: REFRESH_SECRET_KEY,
        options: {
            expiresIn: "5m"
        }
    })
    successResponse({
        res,
        data: { refresh_token: refresh_token },
        message: "refresh token generated successfully"
    });

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

export const share_profile = async (req, res, next) => {
    const { id } = req.params
    const user = await db_service.findOne({
        model: userModel,
        filter: { _id: id },
        options: { select: "-password" }
    })
    if (!user) {
        throw new Error("user not exist yet");

    }
    user.phone = decrypt(user.phone)
    successResponse({ res, data: user })
}
export const update_password = async (req, res, next) => {
    let { oldPassword, newPassword } = req.body

    const user = await db_service.findOne({
        model: userModel,
        filter: { _id: req.user.id }
    })

    if (!compare(oldPassword, user.password)) {
        throw new Error("invalid old password")
    }

    const hash = hashsync({ plaintText: newPassword })

    user.password = hash
    await user.save()

    successResponse({ res })
}
export const update_profile = async (req, res, next) => {
    let { firstName, lastName, phone, gender } = req.body
    if (phone) {
        phone = encrypt(phone)
    }
    const user = await db_service.findOneAndUpdate(
        {
            model: userModel,
            filter: { _id: req.user.id },
            update: { firstName, lastName, phone, gender }
        }
    )
    if (!user) {
        throw new Error("user not exist ");

    }

    successResponse({ res, data: user })
}