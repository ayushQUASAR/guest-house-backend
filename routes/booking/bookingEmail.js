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


const adminNotificationTemplate = ({actualData}) => `
<h3>Hi,</h3> 
<p>A new user has filled the booking form:</p>
<br/>
<p>Here are the details:</p>
<table>
    <tr>
        <th>Name</th>
        <td>${actualData.name}</td>
    </tr>
    <tr>
        <th>Phone</th>
        <td>${actualData.phone}</td>
    </tr>
    <tr>
        <th>Email</th>
        <td>${actualData.email}</td>
    </tr>
    <tr>
        <th>Address</th>
        <td>${actualData.address}</td>
    </tr>
    <tr>
        <th>Reference Info</th>
        <td>${actualData.refInfo}</td>
    </tr>
    <tr>
        <th>Reference ID</th>
        <td>${actualData.reference}</td>
    </tr>
    <tr>
        <th>Booking Date</th>
        <td>${actualData.bookingDate}</td>
    </tr>
    <tr>
        <th>Booking Time</th>
        <td>${actualData.bookingTime}</td>
    </tr>
    <tr>
        <th>Booking Duration</th>
        <td>${actualData.bookingDuration} hours</td>
    </tr>
</table>
<br/>
<a href="#">Click here to approve this booking</a>
`;

router.post("/adminNotification/", async (req, res) => {
    const actualData = req.body.actualData;

    // send alerts to admin regarding the data being send 
    // const { kind, purpose, name, designation, address, phone, email, companions, startDate, startTime, endDate, endTime, bookingFor } = req.params;

    const mailOptions = {
        from: {
            name: "donotreply",
            address: "mrimann96@gmail.com",
        },
        to: "anshdeeps.cs.21@nitj.ac.in",
        subject: "New booking form filled for guest house",
        html: adminNotificationTemplate({actualData}),
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "Admin has been notified about the booking" });
    } catch (err) {
        res.json({ message: err.message });
    }

});

const userApprovalNotificationTemplate = ({bookingDetails}) => `
<h3>Hi,</h3> 
<p>Your account has been ${bookingDetails.status}.</p>
<p>Please login to your account for more details.</p>
`;

router.post("/sendApprovalNotification", async (req, res) => {
    const bookingDetails = req.body.booking;

    //send alerts to user and visitor regarding the booking confirmation
    const mailOptions = {
        from: {
            name: "donotreply",
            address: "mrimann96@gmail.com",
        },
        to: "anshdeeps.cs.21@nitj.ac.in", // we need to change here to user email
        subject: "Regarding approval for guest house",
        html: userApprovalNotificationTemplate({bookingDetails}),
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "User has been notified about the approval" });
    } catch (err) {
        res.json({ message: err.message });
    }


})

module.exports = router;