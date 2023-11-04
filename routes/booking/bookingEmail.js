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
        <td>${actualData.roomBooker.name}</td>
    </tr>
    <tr>
        <th>Reference Contact Details</th>
        <td>${actualData.roomBooker.phone}</td>
    </tr>
    <tr>
    <th>Reference Email</th>
    <td>${actualData.roomBooker.email}</td>
</tr>
    <tr>
        <th>Booking Date</th>
        <td>${actualData.startDate}</td>
    </tr>
    <tr>
        <th>Booking Duration </th>
        <td>${(new Date(actualData.endDate).getTime() - new Date(actualData.startDate).getTime())/(1000*3600*24)} days</td>
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
        to: "mriduld.cs.21@nitj.ac.in",
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

const userApprovalNotificationTemplate = () => `
<h3>Hi,</h3> 
<p>Your booking has been approved...</p>
<p>Please login to your account for more details.</p>
`;

router.post("/sendApprovalNotification", async (req, res) => {
const bookingDetails = req.body.booking;
  
    //send alerts to user and visitor regarding the booking confirmation
    const mailList = [bookingDetails.booking.email, bookingDetails.booking.roomBooker.email];
    const mailOptions = {
        from: {
            name: "donotreply",
            address: "mrimann96@gmail.com",
        },
        to: mailList, // we need to change here to user email
        subject: "Regarding approval for guest house",
        html: userApprovalNotificationTemplate(),
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "User has been notified about the approval" });
    } catch (err) {
        res.json({ message: err.message });
    }


})

module.exports = router;