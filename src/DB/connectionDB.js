import mongoose from "mongoose"
import { DB_URI } from "../../config/config.service.js";

const checkConnectionDB = async () => {


    try {
        await mongoose.connect(DB_URI, { serverSelectionTimeoutMS: 2000 })


        console.log(`successfully to connect with db ${DB_URI}`);


    } catch (error) {
        console.log("server connected failed", error);

    }
}

export default checkConnectionDB