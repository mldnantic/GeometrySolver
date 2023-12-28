const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;
mongoose.connect("mongodb://localhost:27017/GeometrySolver");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const FigureSchema = mongoose.Schema({
    a: Number,
    b: Number,
    h: Number,
    figura: String,
    username: String,
},{ versionKey: false });

const FigureModel = mongoose.model("figure", FigureSchema);

app.get("/getFigures", async (req, res) => {
    try {
        const figures = await FigureModel.find({});
        res.json(figures);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/addFigure", async (req, res) => {
    try {
        const { a, b, h, figura, username } = req.body;

        // Create a new figure instance using the Mongoose model
        const newFigure = new FigureModel({ a, b, h, figura, username });

        // Save the figure to the database
        const savedFigure = await newFigure.save();

        // Respond with the saved figure
        res.json(savedFigure);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});



app.listen(3000);