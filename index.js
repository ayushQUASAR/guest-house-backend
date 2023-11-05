const express = require("express");
const session = require('express-session');
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
const bookingRoute = require("./routes/booking/booking");
const bookingApprovalRoute = require("./routes/booking/bookingApproval");
const guestHouseRoute = require("./routes/guestHouse")




//configuring packages
const app = express();
// mongoose.connect("mongodb+srv://user:user@cluster0.5rmy7ke.mongodb.net/guest-house");
mongoose.connect('mongodb+srv://user:user@cluster0.uunf6ts.mongodb.net/?retryWrites=true&w=majority');
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

app.use(session({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

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
//booking routes
app.use("/booking", bookingRoute);
app.use("/admin/bookingApproval", bookingApprovalRoute);
app.use("/guestHouse", guestHouseRoute);


app.listen(port, ()=> {
    console.log(`Server is listening on port ${port}`);
});