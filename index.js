const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");


//configurations
const app = express();
dotenv.config();
mongoose.connect("mongodb://127.0.0.1:27017/guestHouse");
const db = mongoose.connection;
db.once('open', ()=>{
    console.log("Database connected")
});
db.on("error", (err)=> {
   console.log({database_message: err.message})
} );
const port  = process.env.PORT || 4000;

//body parsing
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get("/", (req,res)=> {
    res.send("Hello World");
})

//listening on port 3000

app.listen(port, ()=> {
    console.log(`Server is listening on port ${3000}`);
})