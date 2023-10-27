const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");
dotenv.config();
const cors = require("cors");


//configuring routes 
const registerRoute = require("./routes/userRegistration");
const approveRegistrationRoute = require("./routes/approveRegistration");
const usersRoute = require("./routes/users");
const loginRoute = require("./routes/login");
const referenceRoutes = require("./routes/references");
const emailRoute = require("./routes/email")


//configuring packages
const app = express();
// mongoose.connect("mongodb+srv://user:user@cluster0.5rmy7ke.mongodb.net/guest-house");
mongoose.connect('mongodb://127.0.0.1:27017/guestHouse1');
const db = mongoose.connection;
db.once('open', ()=>{
    console.log("Database connected")
});
db.on("error", (err)=> {
   console.log({database_message: err.message})
} );
const port  = process.env.PORT || 3000;

app.use(cors());
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
app.use("/references", referenceRoutes);
app.use("/email", emailRoute);



app.listen(port, ()=> {
    console.log(`Server is listening on port ${port}`);
});