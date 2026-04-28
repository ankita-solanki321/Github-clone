// ACTUAL FUNCTIONALITY
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();
const uri = process.env.MONGODB_URI;

let client;

async function connectClient() {
  if (!client) {
    client = new MongoClient(uri); // ✅ no options needed
    await client.connect();
    console.log("MongoDb Connected!");
  }
}

module.exports = { connectClient, client };

async function signUp(req, res) {
  const { username, password, email } = req.body;
  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); //this  is the hashed password which saved on database

    const newUser = {
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    };

    const result = await usersCollection.insertOne(newUser);

    const token = jwt.sign(
      { id: result.insertId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({ token, userId: result.insertId });
  } catch (err) {
    console.error("Error during signup : ", err.message);
    res.status(500).send("Server error");
  }
}


const getAllUsers = (req,res) =>{
    res.send("all users fetched!!");
}

const login = (req,res) =>{
    res.send("all users fetched!!");
}

const getUserProfile = (req,res) =>{
    res.send("user fetched!!");
}

const updateUserProfile = (req,res) =>{
    res.send("Update Profile");
}

const deleteUserProfile = (req,res) =>{
    res.send("Delete profile");
}

module.exports ={
    getAllUsers,
    signUp ,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
}