import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { Cust, Note } from "./db/Schema.js";
import { generate } from "./utils/ai.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not Authenticated" });
  jwt.verify(token, process.env.JWTSECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Not Authenticated" });
    next();
  });
};
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Animated Notes API" });
});

app.get("/generatewithai", async (req, res) => {
  const data = await generate();
  res.json(data);
});

app.post("/notes", async function (req, res) {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "Not Authenticated" });
  }
  const user = jwt.verify(token, process.env.JWTSECRET);
  if (!user) {
    return res.status(400).json({ message: "Not Authenticated" });
  }
  const data = await Note.find({ userId: user.id });
  res.status(201).json(data);
});
app.post("/add", async (req, res) => {
  const { title, desc, status, token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "Not Authenticated" });
  }
  const user = jwt.verify(token, process.env.JWTSECRET);
  if (!user) {
    return res.status(400).json({ message: "Not Authenticated" });
  }
  const addReview = new Note({ title, desc, status, userId: user.id });
  const saved = await addReview.save();
  res.status(201).json(saved);
});
app.put("/update/:id", async (req, res) => {
  const update = await Note.findByIdAndUpdate(req.params.id, req.body);
  res.status(201).json({ message: "Note Updated Successfully" });
});
app.delete("/delete/:id", async (req, res) => {
  const update = await Note.findByIdAndDelete(req.params.id);
  res.status(201).json({ message: "Deleted Successfully" });
});
app.post("/register", async function (req, res) {
  try {
    const { name, email, password } = req.body;
    const find = await Cust.findOne({ email });
    if (find) {
      return res
        .status(400)
        .json({ message: "User Already Registered", success: false });
    }
    const hashpass = await bcrypt.hash(password, 10);
    const user = new Cust({
      name,
      email,
      password: hashpass,
    });
    await user.save();
    return res
      .status(201)
      .json({ message: "User Created Successfully", success: true });
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async function (req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const user = await Cust.findOne({ email });
  if (user) {
    const check = await bcrypt.compare(password, user.password);
    if (check) {
      const token = jwt.sign({ id: user._id }, process.env.JWTSECRET, {
        expiresIn: "1d",
      });
      res.cookie("token", token, { httpOnly: true });
      return res
        .status(201)
        .json({ message: "Login Successfully", token, name: user.name });
    } else {
      return res.status(400).json({ message: "Incorrect Credentials" });
    }
  } else {
    return res.status(400).json({ message: "User Not Registered" });
  }
});
app.get("/logout", async function (req, res) {
  res.cookie("token", "");
  return res.status(201).json({ message: "Logout Successfully" });
});
app.listen(5000);
