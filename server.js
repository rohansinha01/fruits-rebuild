///////////////////////////////////
// IMPORT OUR DEPS
///////////////////////////////////
require("dotenv").config(); // load .env variables
const express = require("express"); // our web framework
const morgan = require("morgan"); // our logger
const methodOverride = require("method-override"); // override forms
const mongoose = require("mongoose"); // connect to our mongodb

////////////////////////////////////
// DATABASE CONNECTION
////////////////////////////////////
// our database connection string
const DATABASE_URL = process.env.DATABASE_URL;

// establish our connection
mongoose.connect(DATABASE_URL);

// Events for when the connection changes
mongoose.connection
  .on("open", () => {
    console.log("connected to Mongo");
  })
  .on("close", () => {
    console.log("Disconnected from Mongo");
  })
  .on("error", (error) => {
    console.log(error);
  });

/////////////////////////////////////////
// Create Our Fruits Model
/////////////////////////////////////////
// destructure Schema and model into their own variables
const { Schema, model } = mongoose;
// const Schema = mongoose.Schema
// const model = mongoose.model

// Schema - Shape of the Data
const fruitSchema = new Schema({
  name: String,
  color: String,
  readyToEat: Boolean,
});

// Model - object for interacting with the db
const Fruit = model("Fruit", fruitSchema);

//////////////////////////////////////////////////
// Express App Object
/////////////////////////////////////////////////
const app = express();

////////////////////////////////////////////////////
// Register our Middleware
////////////////////////////////////////////////////
app.use(morgan("dev")); //logger
app.use(methodOverride("_method")); // override form submissions
app.use(express.urlencoded({ extended: true })); // parse urlencoded bodies
app.use(express.static("public")); // serve files from public folder

/////////////////////////////////////////////////////
// Routes
/////////////////////////////////////////////////////
app.get("/", (req, res) => {
  res.send("your server is running... better catch it");
});

app.get("/fruits/seed", async (req, res) => {
  try {
    // array of starter fruits
    const startFruits = [
      { name: "Orange", color: "orange", readyToEat: false },
      { name: "Grape", color: "purple", readyToEat: false },
      { name: "Banana", color: "orange", readyToEat: false },
      { name: "Strawberry", color: "red", readyToEat: false },
      { name: "Coconut", color: "brown", readyToEat: false },
    ];

    // Delete All Fruits
    await Fruit.deleteMany({});

    // Seed my starter fruits
    const fruits = await Fruit.create(startFruits);

    // send fruits as response
    res.json(fruits);
  } catch (error) {
    console.log(error.message);
    res.send("There was error, read logs for error details");
  }
});

// Index Route Get -> /fruits
app.get("/fruits", async (req, res) => {
  try {
    // get all fruits
    const fruits = await Fruit.find({});
    // render a template
    // fruits/index.ejs = ./views/fruits/index.ejs
    res.render("fruits/index.ejs", {fruits})
  } catch (error) {
    console.log("-----", error.message, "------");
    res.status(400).send("error, read logs for details");
  }
});

// New Route
app.get("/fruits/new", (req,res) => {
    res.render("fruits/new.ejs")
})

// Create Route (Post to /fruits)
app.post("/fruits", async (req, res) => {
    try {
        // check if readyToEat should be true
        // expression ? true : false (ternary operator)
        req.body.readyToEat = req.body.readyToEat === "on" ? true : false
        //create the fruit
        await Fruit.create(req.body)
        // redirect back to main page
        res.redirect("/fruits")
    } catch (error) {
    console.log("-----", error.message, "------");
    res.status(400).send("error, read logs for details");
    }
})

// Edit Route (Get to /fruits/:id/edit)
app.get("/fruits/:id/edit", async (req, res) => {
    try {
      // get the id from params
      const id = req.params.id;
      // get the fruit from the db
      const fruit = await Fruit.findById(id);
      //render the template
      res.render("fruits/edit.ejs", { fruit });
    } catch (error) {
      console.log("-----", error.message, "------");
      res.status(400).send("error, read logs for details");
    }
  });

// Update Route (Put to /fruits/:id)
app.put("/fruits/:id", async (req,res) => {
    try {
        // get teh id 
        const id = req.params.id
        // update to ready to eat in req.body
        req.body.readyToEat = req.body.readyToEat === "on" ? true : false
        // update the fruit in the database
        await Fruit.findByIdAndUpdate(id, req.body)
        // res.redirect back to show page
        res.redirect(`/fruits/${id}`)
    } catch (error) {
    console.log("-----", error.message, "------");
    res.status(400).send("error, read logs for details");
    }
})


// Show Route (Get to /fruits/:id)
app.get("/fruits/:id", async (req, res) => {
    try {
        //get the id from params
        const id = req.params.id

        // find the particular fruit from the database
        const fruit = await Fruit.findById(id)

        // render the template with the fruit
        res.render("fruits/show.ejs", {fruit})
    } catch (error) {
    console.log("-----", error.message, "------");
    res.status(400).send("error, read logs for details");
    }
})

///////////////////////////////////////////////////////
// Server Listener
////////////////////////////////////////////////////////
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});


