//////////////////////////////////////
//Import Dependencies
///////////////////////////////////////
const express = require("express")
const Fruit = require("../models/Fruits")

//////////////////////////////////////
// Create the Router
///////////////////////////////////////
const router = express.Router()


/////////////////////////////////////
// Routes
//////////////////////////////////////
router.get("/seed", async (req, res) => {
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
  router.get("/", async (req, res) => {
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
  router.get("/new", (req,res) => {
      res.render("fruits/new.ejs")
  })
  
  // Create Route (Post to /fruits)
  router.post("/", async (req, res) => {
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
  router.get("/:id/edit", async (req, res) => {
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
  router.put("/:id", async (req,res) => {
      try {
          // get the id 
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
  
  // The Delete Route (delete to /fruits/:id)
  router.delete("/:id", async (req,res) => {
      // get the id
      const id = req.params.id
      // delete the fruit
      await Fruit.findByIdAndDelete(id)
      // redirect to the main page
      res.redirect("/fruits")
  })
  
  // Show Route (Get to /fruits/:id)
  router.get("/:id", async (req, res) => {
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



/////////////////////////////////////
// Export the Router
//////////////////////////////////////
module.exports = router