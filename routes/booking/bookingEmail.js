//email related to bookings will be handled here...
const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');



const transportOptions = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "mrimann96@gmail.com",
        pass: "lwidtbnghfrtcgcv",
    }
}


const transporter = nodemailer.createTransport(transportOptions);




router.post("/adminNotification", (req,res) => {
    const actualData = req.body.actualData;

    // send alerts to admin regarding the data being send 

});


router.post("/sendApprovalNotification", (req,res) => {
    const bookingDetails = req.body.booking;

    //send alerts to user and visitor regarding the booking confirmation
})

module.exports = router;