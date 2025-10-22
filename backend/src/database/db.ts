import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

const DB_URI = process.env.DB_URI

const connectToDatabase = async() => {

    if (!DB_URI) {
        throw new Error(`Please define the DB_URI environment variable inside env file`);   
    }
    try {

        await mongoose.connect(DB_URI)
        console.log(`Connected to the database`)
        
    } catch (error) {
        console.error("Error connecting database", {error: error})
        process.exit(1)
    }
}

export default connectToDatabase