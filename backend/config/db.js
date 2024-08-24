import mongoose from "mongoose";
import { ENV_VARS } from "./envVars.js";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(ENV_VARS.MONGO_URI)
        console.log("MongoDB Connected: " + conn.connection.host);
    } catch (error){
        console.error("Error Connection to Mongoose: "+error.message);
        process.exit(1); //1 mean success 0 mean error
    }
};