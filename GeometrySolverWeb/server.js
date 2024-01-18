const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// import {FigureRepository} from "./FigureRepository.js"
const UserRepository = require("./UserRepository.js")
const UserModel = require("./UserModel.js");


const app = express();
const port = 3000;
mongoose.connect("mongodb://localhost:27017/GeometrySolver");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// const UserSchema = mongoose.Schema({
//     username: String,
// },{ versionKey: false });

// const UserModel = mongoose.model("user", UserSchema);


app.get("/getUser", async (req, res) => {
    try {
        const {username}=req.query;

        const user = await UserModel.findOne({username});

        if (!user)
        {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

  // Get user by ID
  app.get('/getUserByUsername', async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await UserRepository.getUserById(userId);
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



app.post("/addUser", async (req, res) => {
    try {
        const { username } = req.body;

        // Create a new figure instance using the Mongoose model
        const newUser = new UserModel({ username });

        // Save the figure to the database
        const savedUser = await newUser.save();

        // Respond with the saved figure
        res.json(savedUser);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

// Create user
app.post('/createUser', async (req, res) => {
    try {
      const userData = req.body;
      const newUser = await UserRepository.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Get user by ID
app.get('/getUserById/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await UserRepository.getUserById(userId);
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



app.listen(3000);