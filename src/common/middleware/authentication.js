import { ACCESS_SECRET_KEY, PREFIX } from "../../../config/config.service.js";
import * as db_service from "../../DB/db.service.js"
import userModel from "../../DB/models/user.model.js";
import { verifyToken } from "../utils/token.service.js"

export const authentication = async (req, res, next) => {

    const { authorization } = req.headers
    const [prefix, token] = authorization.split(" ")
    if (prefix !== PREFIX) {
        throw new Error("invalid token prefix");

    }
    if (!token) {
        throw new Error("token not exist");

    }
    const decoded = verifyToken({ token, secret_key: ACCESS_SECRET_KEY})

    if (!decoded || !decoded?.id) {
        throw new Error("invalid token");

    }
    

    const user = await db_service.findOne({ model: userModel, filter: { id: decoded.id }, options: { select: "-password" } })
    if (!user) {
        throw new Error("user not exist", { cause: 400 });

    }

    req.user = user
    next()
}