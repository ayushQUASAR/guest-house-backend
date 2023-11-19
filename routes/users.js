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
    try {
        const user = await User.find({ _id: userId }).populate('reference').populate('idProof');


        const ref = await Ref.find({ _id: user[0].reference._id }).populate('refTo');

        //    console.log({user: user[0], referenceDetails: ref[0]});

        res.json({ userDetails: user[0], referenceDetails: ref[0] })

        // const finalUser = {
        //     ...user[0],
        //     reference: ref[0],
        // }
        // console.log(finalUser);
        // console.log(ref);

    }
    catch (err) {
        console.log({ message: err.message })
        res.status(500).json({ message: err.message })
    }
})
module.exports = router;


router.get('/approved/registered', async (req, res) => {
    try {
        const users = await RegisteredUser.find({}).populate('user').populate('bookingHistory');


        // console.log(users);

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
        const response = await axios.get(`http://localhost:3000/users/${userId}`);


        const registeredUsers = await axios.get('http://localhost:3000/users/approved/registered');

        const arr = registeredUsers.data;
        //   console.log(arr);

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

