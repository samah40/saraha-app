import * as de_service from "../../DB/db.service.js";
import userModel from "../../DB/models/user.model.js";
import { verifyToken } from "../utils/token.service.js"

export const authentication = async (req, res, next) => {

    const { authorization } = req.headers
    const [prefix, token] = authorization.split(" ")
    if (prefix !== "bearer") {
        throw new Error("invalid token prefix");

    }
    if (!token) {
        throw new Error("token not exist");

    }
    const decoded = verifyToken({ token, secret_key: "samah" })

    if (!decoded || !decoded?.id) {
        throw new Error("invalid token");

    }

    const user = await de_service.findOne({ model: userModel, filter: { id: decoded.id }, options: { select: "-password" } })
    if (!user) {
        throw new Error("user not exist", { cause: 400 });

    }

    req.user = user
    next()
}