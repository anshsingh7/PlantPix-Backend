import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();

const url = process.env.dbConnectionUrl

const connectDB = async ()=>{
    try{
        mongoose.set('strictQuery', false);
        const conn =await  mongoose.connect(url);
        console.log("database connected successfully");
        console.log(`host Name => ${conn.connection.host}`);
    }catch(error){
        console.log(`database connection error: ${error}`);
    }
}

export default connectDB;