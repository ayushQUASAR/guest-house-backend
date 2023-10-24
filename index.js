const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");
dotenv.config();


//configuring routes 
const registerRoute = require("./routes/userRegistration");
const approveRegistrationRoute = require("./routes/approveRegistration");
const usersRoute = require("./routes/users");
const loginRoute = require("./routes/login");


//configuring packages
const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/guestHouse");
const db = mongoose.connection;
db.once('open', ()=>{
    console.log("Database connected")
});
db.on("error", (err)=> {
   console.log({database_message: err.message})
} );
const port  = process.env.PORT || 3000;


//body parsing
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get("/", (req,res)=> {
    res.send("Hello World");
})

//listening on port 3000
app.use("/register", registerRoute);
app.use("/admin/approveRegistration", approveRegistrationRoute);
app.use("/users", usersRoute);
app.use("/login", loginRoute);

app.listen(port, ()=> {
    console.log(`Server is listening on port ${port}`);
})