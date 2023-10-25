const mongoose = require("mongoose");
const express = require("express");
const app = express();
const router = express.Router();
const User = require('../models/user/user');
const RegisteredUser = require("../models/registeredUsers");
const RejectedUser = require("../models/rejectedUsers");

router.get("/", async (req, res) => {
    try {
         const users =  await User.find({});
         console.log(users);
         if(users === null) {
            res.status(404).json({message: "No Users found"});
         }
         else {
                  res.status(200).json(users);
         }
    }
    catch(err) {
        console.log({message: err.message});
        res.json({message: err.message});
    }
});


router.delete("/", async (req,res) => {
try {
const x = await User.deleteMany({});
if(x!== null) {
    console.log("Users Deleted successfully");
    res.status(200).json({message: "Users deleted successfully"})
}

}
catch(err) {
    res.json({message: err.message});
}
})

router.get("/:id", async (req, res) => {
    const userId = req.params.id;
    try {
         const user = await User.find({_id: userId});
         if(user === null) {
            console.log({message: "user with given id not found"});
            res.status(404).json({message: "user with given id not found"});
         }
         else {
            console.log(user);
            res.status(200).json(user);
         }
    }
    catch(err) {
         console.log({message: err.message})
         res.json({message: err.message})
    }
})
module.exports = router;




router.get('/approved/registered', async (req,res) => {
    console.log("this is registered route");
    try {
        const users =  await RegisteredUser.find({});
        if(users === null) {
            console.log("No registered users found");
           res.status(404).json({message: "No Registered Users found"});
        }
        else {
            console.log(users);
                 res.status(200).json(users);
        }
   }
   catch(err) {
    console.log({message: err.message});
       res.json({message: err.message});
   }
});

router.delete("/approved/registered", async (req,res) => {
    try {
  const users =  await RegisteredUser.deleteMany({});
  if(users !== null) {
    res.status(200).json({message: "Registered users deleted successfully"});
  }
    }
    catch(err) {
res.json({message: err.message});
    }

});
router.get("/approved/rejected", async (req,res) => {
    try {
        const users =  await RejectedUser.find({});
        if(users === null) {
            console.log("No registered users found");
           res.status(404).json({message: "No Rejected Users found"});
        }
        else {
                 console.log(users);
                 res.status(200).json(users);
        }
   }
   catch(err) {
    console.log({message: err.message});
       res.json({message: err.message});
   }
})

router.delete("/approved/rejected", async (req,res) => {
    try {
  const users =  await RejectedUser.deleteMany({});
  if(users !== null) {
    res.status(200).json({message: "Rejected users deleted successfully"});
  }
    }
    catch(err) {
res.json({message: err.message});
    }

});