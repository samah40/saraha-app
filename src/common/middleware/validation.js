

export const validation = (schema) => {
    return (req, res, next) => {
        // console.log('====================================');
        // console.log(Object.keys(schema));
        // console.log('====================================');
        let errorResult = []
        for (const key of Object.keys(schema)) {
            const { error } = schema[key].validate(req[key], { abortEarly: false })
            // console.log('====================================');
            // console.log(error?.details);
            // console.log('====================================');
            if (error) {
                errorResult.push(error.details)

            }
        }
        if (errorResult.length > 0) {
            return res.status(400).json({ msg: "validation error", error: errorResult })

        }
        next()
    }
}

// export const refresh_token = async (req, res, next) => {
//     const { authorization } = req.headers
//     const [prefix, token] = authorization.split(" ")
//     if (prefix !== PREFIX) {
//         throw new Error("invalid token prefix");

//     }
//     if (!token) {
//         throw new Error("token not exist");

//     }
//     const decoded = verifyToken({ token, secret_key: REFRESH_SECRET_KEY })

//     if (!decoded || !decoded?.id) {
//         throw new Error("invalid token");

//     }


//     const user = await db_service.findOne({ model: userModel, filter: { id: decoded.id }, options: { select: "-password" } })
//     if (!user) {
//         throw new Error("user not exist", { cause: 400 });

//     }
//     const refresh_token = generateToken({
//         payload: { id: user._id, email: user.email },
//         secret_key: REFRESH_SECRET_KEY,
//         options: {
//             expiresIn: "5m"
//         }
//     })
//       successResponse({ 
//         res, 
//         data: { refresh_token: refresh_token }, 
//         message: "refresh token generated successfully" 
//     });

// }
