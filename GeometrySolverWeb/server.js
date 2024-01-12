const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;
mongoose.connect("mongodb://localhost:27017/GeometrySolver");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UserSchema = mongoose.Schema({
    username: String,
},{ versionKey: false });

const UserModel = mongoose.model("user", UserSchema);

app.get("/getUsers", async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
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



app.listen(3000);