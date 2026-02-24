import { compareSync, hashSync } from "bcrypt"

export const hashsync=({plaintText,salt=process.env.SALT_ROUNDS}={})=>{
    return hashSync(plaintText,Number(salt))
}

export const compare=(plaintText,hashedText)=>{
    return compareSync(plaintText,hashedText)
}