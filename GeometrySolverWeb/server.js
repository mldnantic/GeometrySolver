const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const moment = require("moment");
moment.locale('sr');

const UserRepository = require("./UserRepository.js")
const UserModel = require("./UserModel.js");
const BodyRepository = require("./BodyRepository.js");


const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = "GeometrySolverBot";
const port = 3000;
var logUserSessions = false;

mongoose.connect("mongodb://localhost:27017/GeometrySolver");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

io.on("connection", socket =>{

  socket.emit("message",`${moment().format('LT')}: Dobrodosli u GeometrySolver`);
  // io.emit("comment",`#${botName}#: "${socket.id} has entered comment section"`);
  if(logUserSessions == true)
  {
    console.log(`"#${socket.id}# has entered comment section"`);
  }

  socket.on("comment",msg=>{
        const user = socket.id;
        io.emit("comment",`${user} `+msg);
    });

  socket.on("disconnect",()=>{
    const user = socket.id;
    if(user){
        io.emit("comment",`#${botName}#: "${user} has left comment section"`);
        if(logUserSessions == true)
        {
          console.log(`"#${socket.id}# has left comment section"`)
        }
    }
  })

});

//user crud
app.get('/getUserByUsername', async (req, res) => {
  try {
    const username = req.query;
    const user = await UserRepository.getUserByUsername(username);
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

//body crud
app.get('/getAllBodies', async (req, res) => {
  try {
    const bodies = await BodyRepository.getAllBodies();
    res.json(bodies);
  } catch (error) {
    console.error('Error fetching bodies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

server.listen(port, () => console.log(`Server running on port ${port}`));