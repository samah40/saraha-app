import mongoose from "mongoose"

const checkConnectionDB=async()=>{
    try {
await mongoose.connect("mongodb://localhost:27017/sarahaaApp",{serverSelectionTimeoutMS:2000})
console.log("server connected successfully");


} catch (error) {
        console.log("server connected failed",error);
        
    }
}

export default checkConnectionDB