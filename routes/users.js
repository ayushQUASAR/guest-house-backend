const mongoose = require("mongoose");
const express = require("express");
const app = express();
const router = express.Router();
const User = require('../models/user/user');

router.get("/", async (req, res) => {
    try {
         const users =  await User.find({});
         if(users === null) {
            res.status(404).json({message: "No Users found"});
         }
         else {
                  res.status(200).json(users);
         }
    }
    catch(err) {
        res.json({message: err.message});
    }
});


router.get("/:id", async (req, res) => {
    const userId = req.params.id;
    try {
         const user = await User.find({_id: userId});
         if(user === null) {
            res.status(404).json({message: "user with given id not found"});
         }
         else {
            res.status(200).json(user);
         }
    }
    catch(err) {
         console.log({message: err.message})
    }
})
module.exports = router;
