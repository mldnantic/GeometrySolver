const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;
mongoose.connect("mongodb://localhost:27017/GeometrySolver");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const UserSchema = mongoose.Schema({
    username: String,
},{ versionKey: false });

const UserModel = mongoose.model("user", UserSchema);


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