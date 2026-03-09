import { Router } from "express";
import * as US from "./user.service.js"
import { authentication } from "../../common/middleware/authentication.js";
import { validation } from "../../common/middleware/validation.js";
import * as UV from "./user.validation.js"
import { multer_host, multer_local } from "../../common/middleware/multer.js";
import { multer_enum } from "../../common/enum/multer.enum.js";
const userRouter = Router()

// userRouter.post("/signUp", multer_local({custom_types:[...multer_enum.images, ...multer_enum.pdf]}).single("attachment"),validation(UV.signUpSchema), US.signUp)
userRouter.post("/signUp", multer_host( [...multer_enum.images, ...multer_enum.pdf] ).single("attachment"), US.signUp)
// userRouter.post("/signUp",
//     multer_local({ custom_path: "admin", custom_types: [...multer_enum.images, ...multer_enum.pdf] }).fields([
//         { name: "attachment", maxCount: 1 },
//         { name: "attachments", maxCount: 2 }
//     ]),
//     validation(UV.signUpSchema),
//     US.signUp)
// userRouter.post("/signUp", multer_local({ custom_path: "admin", custom_types: [...multer_enum.images, ...multer_enum.pdf] }).array("attachments", 2), US.signUp)
userRouter.post("/signUp/gmail", US.signUpWithgoogle)
userRouter.post("/signin", validation(UV.signInSchema), US.signIn)
userRouter.get("/profile", authentication, US.getProfile)
userRouter.patch("/update-profile", validation(UV.updateProfileScema), authentication, US.update_profile)
userRouter.patch("/update-password", validation(UV.updatePasswordeScema), authentication, US.update_password)
userRouter.get("/refreshToken", US.refresh_token)
userRouter.get("/share-profile/:id", validation(UV.shareprofileSchema), US.share_profile)
export default userRouter