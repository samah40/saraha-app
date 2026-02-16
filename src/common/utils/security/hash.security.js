import { compareSync, hashSync } from "bcrypt"

export const hashsync=({plaintText,salt=12}={})=>{
    return hashSync(plaintText,salt)
}

export const compare=(plaintText,hashedText)=>{
    return compareSync(plaintText,hashedText)
}