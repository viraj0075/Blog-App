import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log("Mongo DB connected Successfully",connect.connection.host);
    } catch (error) {
        console.log(error,"Error in Db Connection");
        process.exit(1);
        throw error;
    }
};
export default connectDB;