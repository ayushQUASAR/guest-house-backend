const express = require('express');
const mongoose =require('mongoose');
const app = express();
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require("path");
const Image = require("../models/Image");
const Ref = require("../models/user/ref");
const User = require('../models/user/user');


const storage = multer.diskStorage({
    destination: (req,file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req,file,cb) => {
        cb(null, `${file.filename}-${Date.now()}.png`);
    }
});

const upload = multer({storage:storage});


router.get("/", (req, res)=> {
    res.write("hello from register");
    console.log(process.cwd())
})
router.post("/", upload.single('idProof'),async (req,res)=> {
    
const data = req.body;


const idProof = new Image({
data: fs.readFileSync(path.join(process.cwd()+"/uploads/" + req.file.filename)),
contentType: "image/png",
});

const refType = data.reference;
let refTo = refType === "Student" ? new Student({
    name: data?.studentName,
    roll: data?.studentRoll,
    branch: data?.studentBranch,
    phone: data?.studentPhone,
}) : refType === "Alumni" ? new Alumni({
    name: data?.alumniName,
    batch: data?.alumniBatch,
    branch: data?.alumniBranch,
    currentJob: data?.alumniCurrentJob,
    phone: data?.alumniPhone,
}): refType === "Faculty" ? new Faculty({
    name: data?.facultyName,
    email:data?.facultyEmail,
    dept: data?.facultyDept,
    phone: data?.facultyPhone

}): new Other({
    name: data?.otherName,
    email:data?.otherEmail,
    dept: data?.otherDept,
    phone: data?.otherPhone
});



try {

    let refToFinal = await refTo.save();

if(refToFinal === null) {
    throw new Error("refTo not added");
}

const reference = new Ref({
    refType: data.reference,
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

        const actualData = {
            name: data.name,
            phone: data.phone,
            email: data.email,
            city: data.city,
            address: data.address,
            govtID: data.govtID,
            idProof: proof._id,
            reference: finalRef._id,
        };
    

        const newUser = new User(actualData);

      const x =   await newUser.save();
      
if(x === null) {
    throw new Error("user could not be added to database");
}
        else {
            res.status(201).json({message: "user created successfully"})
        }
        
}
catch(err) {
console.log({message: err.message});
res.status().json({message: err.message});
}

})

module.exports = router;

