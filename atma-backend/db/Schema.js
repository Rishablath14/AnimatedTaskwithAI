import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI,{dbName:"atmadb"}).then(()=>{console.log("Connected to DB")}).catch((error)=>{console.log("Error Connecting...",error)});
const taskSchema = mongoose.Schema({
    title:String,
    desc:String,
    status:String,
    userId:String,
})
const userSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String
})

export const Tasks = mongoose.model("Tasks",taskSchema);
export const Users = mongoose.model("Users",userSchema);
