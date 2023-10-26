const mongoose = require('mongoose');
const express = require("express");
const User = require('../models/user/user');
const Student = require('../models/user/student');

const Ref = require('../models/user/ref');
const Faculty = require('../models/user/faculty');
const Alumni = require('../models/user/alumni');
const router = express.Router();

router.get("/", async (req, res) => {

    try {
        const references = await Ref.find({});
        if(references.length === 0) {
            console.log({message: "No reference are in the database"});
        }
          res.status(200).json(references);
    }

    catch(err) {
        console.log({message: err.message});
        res.status(500).json({message: err.message});
    }


})


router.get("/type/:id", async (req, res) => {
    const type = req.params.id;

    try {
        let ref = type === 'student' ? await Student.find({})
        : type === 'faculty' ? await Faculty.find({})
        : await Alumni.find({});

        if(ref.length === 0) {
            console.log({message: `${type} has no data in database`});
        }

        res.status(200).send(ref);
     }

    catch(err) {
        console.log({message: err.message});
        res.status(500).json({message: err.message});
    }


})


module.exports = router;