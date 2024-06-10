import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI,{dbName:"igttask"}).then(()=>{console.log("Connected to DB")}).catch((error)=>{console.log("Error Connecting...",error)});
const noteSchema = mongoose.Schema({
    title:String,
    desc:String,
    status:String,
    userId:String,
})
const custSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String
})

export const Note = mongoose.model("Note",noteSchema);
export const Cust = mongoose.model("Cust",custSchema);
