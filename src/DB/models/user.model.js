import mongoose from "mongoose";
import { genderEnum, providerEnum, roleEnum } from "../../common/enum/user.enum.js";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 10,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 10,
        trim: true

    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,


    },
    password: {
        type: String,
        required: function () {
            return this.provider == providerEnum.google ? false : true
        },
        minLength: 6,

    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max: 60
    },
    gender: {
        type: String,
        enum: Object.values(genderEnum),
        default: genderEnum.male
    }, phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(roleEnum),
        default: roleEnum.user

    }
    ,
    profilePicture: {
        secure_url: { type: String, required: true }
        , public_id: { type: String, required: true }
    },// to store the picture
    coverPicture: [{
        secure_url: { type: String, required: true }
        , public_id: { type: String, required: true }
    }],
    confirmed: Boolean,
    provider: {
        type: String,
        enum: Object.values(providerEnum),
        default: providerEnum.system
    }
}, {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
userSchema.virtual("userName").get(function () {
    return this.firstName + " " + this.lastName
}).set(function (v) {
    const [firstName, lastName] = v.split(" ")
    this.set({ firstName, lastName })

})

const userModel = mongoose.models.user || mongoose.model("user", userSchema)

export default userModel