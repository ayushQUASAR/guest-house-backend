const mongoose = require("mongoose");
const express = require("express");
const axios = require('axios');


const app = express();
const router = express.Router();
const User = require('../models/user/user');
const RegisteredUser = require("../models/registeredUsers");
const RejectedUser = require("../models/rejectedUsers");
const PendingUser = require("../models/pendingUsers");
const Ref = require("../models/user/ref");

router.get("/", async (req, res) => {
    try {
        const users = await User.find({});
        console.log(users);
        res.status(200).json(users);

    }
    catch (err) {
        console.log({ message: err.message });
        res.status(500).json({ message: err.message });
    }
});


router.delete("/", async (req, res) => {
    try {
        const x = await User.deleteMany({});
        if (x !== null) {
            console.log("Users Deleted successfully");
            res.status(200).json({ message: "Users deleted successfully" })
        }

    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.get("/:id", async (req, res) => {
    const userId = req.params.id;
    console.log("id: ", userId);
    try {   
        
        const [user] = await User.find({ _id: userId }).populate('idProof').populate('reference');
        if(user.registerOption === 1) {
            user.reference = null;
              return res.json({ userDetails: user });
        }
        
     
            const [ref] = await Ref.find({ _id: user.reference._id }).populate('refTo');
           return res.json({  userDetails: user, referenceDetails: ref })
        

    }
    catch (err) {
        console.log({ message: err.message });
        res.status(500).json({ message: err.message });
    }
})


router.delete("/:id", async (req, res) => {
    const userId = req.params.id;
    try {

        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "No user found with that id" });
        }

        await User.deleteOne({ _id: userId });
        res.status(200).json({ message: "User deleted successfully" });

    } catch (err) {
        console.log({ message: err.message })
        res.status(500).json({ message: err.message })
    }
});


router.get('/approved/registered', async (req, res) => {
    try {
        const users = await RegisteredUser.find({}).populate('user').populate('bookingHistory');
        res.status(200).json(users);

    }
    catch (err) {
        console.log({ message: err.message });
        res.status(500).json({ message: err.message });
    }
});


//get booking history
router.get("/:id/bookingHistory", async (req, res) => {
    const userId = req.params.id;
    try {
        const response = await axios.get(`${process.env.REMOTE_URL}/users/${userId}`);
        const registeredUsers = await axios.get(`${process.env.REMOTE_URL}/users/approved/registered`);

        const arr = registeredUsers.data;
        const a = arr.filter((user) => user.user._id === userId);
        const finalArr = {
            ...response.data,
            bookingHistory: a[0].bookingHistory,
        }


        res.json(finalArr);
    }
    catch (err) {
        console.log(err.message);
    }
})

router.delete("/approved/registered", async (req, res) => {
    try {
        const users = await RegisteredUser.deleteMany({});
        if (users !== null) {
            res.status(200).json({ message: "Registered users deleted successfully" });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }

});

router.delete("/approved/registered/:id", async (req,res) => {
    const id = req.params.id;
    try {
        await RegisteredUser.deleteOne({_id: id});
        res.json(`registered user with id ${id} deleted successfully.`)
    } catch (error) {
        res.json({registered_user_error: error.message})
    }
})



router.get("/approved/rejected", async (req, res) => {
    try {
        const users = await RejectedUser.find({}).populate("user");
        console.log(users);
        res.status(200).json(users);

    }
    catch (err) {
        console.log({ message: err.message });
        res.status(500).json({ message: err.message });
    }
})

router.delete("/approved/rejected", async (req, res) => {
    try {
        const users = await RejectedUser.deleteMany({});
        if (users !== null) {
            res.status(200).json({ message: "Rejected users deleted successfully" });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }

});


router.get('/approved/pending', async (req, res) => {
    try {
        const users = await PendingUser.find({}).populate('user');
        console.log(users);
        res.status(200).json(users);
    }
    catch (err) {
        console.log({ message: err.message });
        res.status(500).json({ message: err.message });
    }
});

router.get("/approved/pending/length", async (req, res) => {
    try {
        let count = await PendingUser.count({});
        res.status(200).json(count);
    }
    catch (err) {
        console.log({ message: err.message });
        res.status(500).json({ message: err.message });
    }
})


router.delete("/approved/pending", async (req, res) => {
    try {
        const users = await PendingUser.deleteMany({});
        if (users !== null) {
            res.status(200).json({ message: "Pending users deleted successfully" });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }

});

module.exports = router;