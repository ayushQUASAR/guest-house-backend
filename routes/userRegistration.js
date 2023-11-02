const express = require('express');
const mongoose = require('mongoose');
const app = express();
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require("path");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const axios = require("axios");



const Image = require("../models/Image");
const Ref = require("../models/user/ref");
const User = require('../models/user/user');
const Student = require("../models/user/student");
const Alumni = require("../models/user/alumni");
const Faculty = require("../models/user/faculty");
const Other = require("../models/user/other");
const PendingUser = require('../models/pendingUsers');

const storage = multer.diskStorage({
    destination: (req,file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req,file,cb) => {
        const [name, ext] = file.mimetype.split("/");
        cb(null, `${name}-${Date.now()}.${ext}`);
    }
});

const upload = multer({
    storage:storage,
    fileFilter:(req,file,cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'application/pdf') {
            cb(null, true);
          }
          else {
            cb(null, new Error("Invalid file type. Supported types: PNG, JPEG, JPG, PDF."));
          }
    },

    limits: {fileSize: 1000000},
});





router.get("/", (req, res) => {
    res.write("hello from register");
    console.log(process.cwd());
});
router.post("/", upload.single('idProof'),async (req,res)=> {
// router.post("/", async (req, res) => {
    const data = req.body;
    if (!req.file) {
        return res.status(400).json({ error: 'File not provided or does not meet requirements.' });
      }
    console.log("this is file",req.file);
    const idProof = new Image({
    data: fs.readFileSync(path.join(process.cwd()+"/uploads/" + req.file.filename)),
    });

    const refType = data.selectedOption;
    const refName = `${data.RefFirstName} ${data.RefLastName}`;
    const refPhone = data.RefPhoneNumber;

    let refTo = refType === "student" ? new Student({
        name: refName,
        roll: data.StudentRollNumber,
        branch: data.StudentBranch,
        phone: refPhone,
    }) : refType === "alumni" ? new Alumni({
        name: refName,
        batch: data.AlumniBatch,
        branch: data.AlumniBranch,
        currentJob: data.ALumniJobProfile,
        phone: refPhone,
    }): new Faculty({
        name: refName,
        email:data.FacultyEmail,
        dept: data.Department,
        phone: refPhone,
    });


    //: new Other({
    //     name: refName,
    //     email:data?.otherEmail,
    //     dept: data?.otherDept,
    //     phone: refPhone,
    // });



    try {

        let refToFinal = await refTo.save();

        const reference = new Ref({
            refType: data.selectedOption,
            refTo: refToFinal._id,
        });

        const finalRef = await reference.save();

        if(finalRef === null) {
            throw new Error("finalRef not added");
        }


        const proof = await idProof.save();


        if(proof === null) {
            throw new Error("id proof not added");
        }


        const hashedPassword = await bcrypt.hash(data.Password,10);
        if(hashedPassword === null) {
            throw new Error("hash could not be created");
        }

const token = jwt.sign({email: data.Email}, process.env.JWT_SECRET);


        const actualData = {
            name: `${data.Firstname} ${data.Lastname}`,
            phone: data.Phnnumber,
            email: data.Email,
            address: data.Address,
            password: hashedPassword,
            refInfo: data.selectedOption,
            idProof: proof._id,
            reference: finalRef._id,
            verificationToken: token,
        };

         
        const newUser = new User(actualData);

        const x = await newUser.save();

        if (x === null) {
            throw new Error("user could not be added to database");
        }
        else {
             
            const pendingUser = new PendingUser({user: newUser._id});
           const newPendingUser = await pendingUser.save();


           if(newPendingUser === null) {
             throw new Error("Pending user not created");
           }


            const msg = `user with id: ${newUser._id} created successfully`;
            console.log(msg);
            res.json({ message: msg });

            await Promise.all([
                axios.get(`http://localhost:4000/email/adminNotification/${encodeURIComponent(actualData.name)}/${encodeURIComponent(actualData.email)}/${encodeURIComponent(actualData.phone)}/${encodeURIComponent(actualData.address)}/${encodeURIComponent(actualData.refInfo)}/${encodeURIComponent(refName)}/${encodeURIComponent(refPhone)}`),
    
                axios.post(`http://localhost:4000/email/sendVerificationEmail`, { 
                    email: actualData.email,
                    token: token
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }),
    
               ]);
       
        }

    }
    catch (err) {
        console.log({ message: err.message });
        res.json({ message: err.message });
    }
    
    
    

});



module.exports = router;

