///////////////////////////////////
// IMPORT OUR DEPS
///////////////////////////////////
require("dotenv").config(); // load .env variables
const express = require("express"); // our web framework
const morgan = require("morgan"); // our logger
const methodOverride = require("method-override"); // override forms
const fruitController = require("./controllers/fruit")




/////////////////////////////////////////

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
app.use("/fruits", fruitController)

/////////////////////////////////////////////////////
// Routes
/////////////////////////////////////////////////////
app.get("/", (req, res) => {
  res.send("your server is running... better catch it");
});



///////////////////////////////////////////////////////
// Server Listener
////////////////////////////////////////////////////////
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});


