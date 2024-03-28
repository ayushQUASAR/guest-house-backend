require("dotenv").config();
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
const {initializeApp} = require('firebase/app');
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage")
const Image = require("../models/Image");
const Ref = require("../models/user/ref");
const User = require('../models/user/user');
const Student = require("../models/user/student");
const Alumni = require("../models/user/alumni");
const Faculty = require("../models/user/faculty");
const Other = require("../models/user/other");
const PendingUser = require('../models/pendingUsers');
const RegisteredUser = require('../models/registeredUsers');
const firebaseConfig = require("../config/firebase.config");
const { JWT_SECRET, REMOTE_URL } = require("../config/env.config");



// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads');
//     },
//     filename: (req, file, cb) => {
//         const [name, ext] = file.mimetype.split("/");
//         cb(null, `${name}-${Date.now()}.${ext}`);
//     }
// });




initializeApp(firebaseConfig);

const storage = getStorage();

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(null, new Error("Invalid file type. Supported types: PNG, JPEG, JPG, PDF."));
        }
    },

    limits: { fileSize: 1000000 },
});





router.get("/", (req, res) => {
    res.write("hello from register");
    console.log(process.cwd());
});

router.post("/", upload.single('idProof'), async (req, res) => {
    // router.post("/", async (req, res) => {
    const data = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'File not provided or does not meet requirements.' });
    }
    // console.log("this is file",req.file);
    
    const storageRef = ref(storage, `/id/${req.file.originalname}-${Date.now()}`);
    const metaData = {
        contentType : req.file.mimetype
    }

    console.log(metaData);
// upload file to firebase
const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metaData);

if (!snapshot) {
    return res.status(500).json({ message: 'File could not be uploaded on the firebase.' });
}

let url = await getDownloadURL(snapshot.ref);

if (!url) {
    return res.status(500).json({ message: 'Could not find download url of snapshot on the firebase.' });
}

// return res.json({url}).end();

    const idProof = new Image({
        data: url,
        contentType: metaData.contentType
    });

    



    try {

        //check if user is already registered or not....
        const email = data.Email.toLowerCase();


        const isNitUser = Number(data.registerOption) === 1 || Number(data.registerOption) === 2;
        console.log("isNitUser: ",isNitUser);

        if(isNitUser && !email.endsWith("@nitj.ac.in")) {
            return res.status(400).json({message: "Student/Faculty must have official email."});
        }

        const alreadyAUser = await User.find({ email: email });

        if (alreadyAUser.length != 0) {
            // find in pending user
            const pendingUsers = await PendingUser.find({}).populate("user");
            console.log(pendingUsers);
            const filteredPendingUser = pendingUsers.filter((x) => x.user.email === email);

            if (filteredPendingUser.length != 0) {
                return res.json({ message: `Verify User using the email verification link...`, status: "pending" });
            }

            const registeredUsers = await RegisteredUser.find({}).populate("user");
            const filteredRegisteredUsers = registeredUsers.filter((x) => x.user.email === email);
            if (filteredRegisteredUsers != 0) {
                return res.json({ message: "Email ID Already registered. Try Login with same email. ", status: "accepted" });
            }


        }


        
        const refName = `${data.RefFirstName} ${data.RefLastName}`;
        let finalRef = null;
        
        if(Number(data.registerOption) === 3)  {   
    const refType = data.selectedOption;

    const refPhone = data.RefPhoneNumber;
            let refTo = refType === "student" ? new Student({
            name: refName,
            roll: data.StudentRollNumber,
            branch: data.Department,
            // phone: refPhone,
        }) : refType === "alumni" ? new Alumni({
            name: refName,
            batch: data.AlumniBatch,
            branch: data.Department,
            currentJob: data.ALumniJobProfile,
            phone: refPhone,
        }) : new Faculty({
            name: refName,
            email: data.FacultyEmail.toLowerCase(),
            dept: data.Department,
            phone: refPhone,
        });
    
    
                let refToFinal = await refTo.save();
                const reference = new Ref({
                    refType: data.selectedOption,
                    refTo: refToFinal._id,
                });
        
                finalRef = await reference.save();
        
                if (finalRef === null) {
                    throw new Error("finalRef not added");
                }
            }
            
        
       


        const proof = await idProof.save();


        if (proof === null) {
            throw new Error("id proof not added");
        }


        const hashedPassword = await bcrypt.hash(data.Password, 10);
        if (hashedPassword === null) {
            throw new Error("hash could not be created");
        }

        const token = jwt.sign({ email: data.Email.toLowerCase() }, JWT_SECRET);

        const nonCollegeUserData = {
            address: data.Address,
            refInfo: data.selectedOption,
            reference: finalRef?._id,
            isNitUser: false
        }
        
        // console.log("reference id: ", finalRef._id);

        const studentUserData = {};
        if(Number(data.registerOption) === 2) {
         studentUserData['studRoll'] = data.StudentRollNumber
        }
        
        const collegeUserData = {
            nitUserDept: data.Department,
            isNitUser: true,
           ...studentUserData
        }

        
         
        
        const commonUserData = {
            name: `${data.Firstname} ${data.Lastname}`,
            phone: data.Phnnumber,
            email: data.Email.toLowerCase(),
            password: hashedPassword,
            idProof: proof._id,
            verificationToken: token,
            registerOption: data.registerOption, 
        }   

        const actualData = (Number(data.registerOption) === 1 || Number(data.registerOption) === 2) ?  {
           ...commonUserData,
           ...collegeUserData
        } : {
            ...commonUserData,
            ...nonCollegeUserData
        }


        // save user to database
        const newUser = new User(actualData);
        const x = await newUser.save();

        if (x === null) {
            throw new Error("user could not be added to database");
        }
        else {

            const pendingUser = new PendingUser({ user: newUser._id });
            const newPendingUser = await pendingUser.save();


            if (newPendingUser === null) {
                throw new Error("Pending user not created");
            }


            const msg = `user with id: ${newUser._id} created successfully`;
            console.log(msg);

          

            res.json({ message: msg, status: "success"});

            // console.log(data.registerOption);
            if (isNitUser && email.endsWith("@nitj.ac.in")) {
                console.log("this is working");
                  await  axios.post(`${REMOTE_URL}/email/sendVerificationEmail`, {
                        name: actualData.name,
                        email: actualData.email,
                        token: token
                    },
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                      return;
            }

            else if(Number(data.registerOption) === 3) {
                await Promise.all([
                    axios.get(`${REMOTE_URL}/email/adminNotification/${encodeURIComponent(actualData.name)}/${encodeURIComponent(actualData.email)}/${encodeURIComponent(actualData.phone)}/${encodeURIComponent(actualData.address)}/${encodeURIComponent(actualData.refInfo)}/${encodeURIComponent(refName)}}`),

                    axios.post(`${REMOTE_URL}/email/sendVerificationEmail`, {
                        name: actualData.name,
                        email: actualData.email,
                        token: token
                    },
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }),

                ]);
                return;
            }

            
        }

    }
    catch (err) {
        console.log({ message: err.message });
        res.json({ message: err.message });
    }




});



module.exports = router;

