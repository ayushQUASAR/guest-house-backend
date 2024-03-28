//email related to bookings will be handled here...
require("dotenv").config();
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Booking = require("../../models/booking/booking");
const { default: axios } = require("axios");
const User = require("../../models/user/user");
const { formatDate } = require("../../utils");
const { ADMIN_EMAIL, REMOTE_URL } = require("../../config/env.config");


const transportOptions = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "mrimann96@gmail.com",
    pass: "lwidtbnghfrtcgcv",
  },
};

const transporter = nodemailer.createTransport(transportOptions);

const adminNotificationTemplate = ({ actualData }) => `
<h3>Hi,</h3> 
<p>A new user has filled the booking form:</p>
<br/>
<p>Here are the details:</p>
<table>
    <tr>
        <th>Name</th>
        <td>${actualData?.name}</td>
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
    <th>Reference Email</th>
    <td>${actualData.roomBooker.email}</td>
</tr>
    <tr>
        <th>Booking Date</th>
        <td>${actualData.startDate}</td>
    </tr>
    <tr>
        <th>Booking Duration </th>
        <td>${
          (new Date(actualData.endDate).getTime() -
            new Date(actualData.startDate).getTime()) /
          (1000 * 3600 * 24)
        } days</td>
    </tr> 
</table>
<br/>
<a href="#">Click here to approve this booking</a>
`;

router.post("/adminNotification", async (req, res) => {
  // console.log("this is request body: ", req.body);
  console.log(req.body);
  const actualData = req.body.actualData;
  console.log(actualData);
  // send alerts to admin regarding the data being send
  // const { kind, purpose, name, designation, address, phone, email, companions, startDate, startTime, endDate, endTime, bookingFor } = req.params;

  const mailOptions = {
    from: {
      name: "donotreply",
      address: "mrimann96@gmail.com",
    },
    to: `${ADMIN_EMAIL}`,
    subject: "New booking form filled for guest house",
    html: adminNotificationTemplate({ actualData }),
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Admin has been notified about the booking" });
  } catch (err) {
    res.json({ message: err.message });
  }
});

const userApprovalNotificationTemplate = ({
  guestHouseDetails,
  roomsDetails
}) => `
<h3>Dear Guest,</h3> 
<p>Your booking request has been approved.<br/>
Please login to Guest House Booking System for more details.</p>

<p>Best regards,<br/>
NITJ Guest House </p>
`;

const userRejectionNotificationTemplate = () => `
<h3>Dear Guest, </h3>
<p> Your Booking Request has been rejected by Guest House Admin.<br/>
 Please login to Guest House Booking System for more details. </p>

<p>Best Regards,<br/>
NITJ Guest House </p>
`;

router.post("/sendApprovalNotification", async (req, res) => {
  const bookingDetails = req.body.booking;

  try {
    const existingBooking = await Booking.findById(bookingDetails.booking);
    if (!existingBooking) {
      throw new Error("Booking does not exist");
    }

    const mailList = [existingBooking.email, existingBooking.roomBooker.email];

    const guestHouseDetails = existingBooking.guestHouseAllotted;
    const roomsDetails = existingBooking.roomsAllotted;
    const mailOptions = {
      from: {
        name: "donotreply",
        address: "mrimann96@gmail.com",
      },
      to: mailList, // we need to change here to user email
      subject: "Regarding approval for guest house",
      html: userApprovalNotificationTemplate({
        guestHouseDetails,
        roomsDetails,
      }),
    };
    await transporter.sendMail(mailOptions);
    res.json({ message: "User has been notified about the approval" });
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.post("/sendRejectionNotification", async (req, res) => {
  const bookingDetails = req.body.booking;

  try {
    const existingBooking = await Booking.findById(bookingDetails.booking);
    if (!existingBooking) {
      throw new Error("Booking does not exist");
    }

    const mailList = [existingBooking.email, existingBooking.roomBooker.email];
    await transporter.sendMail({
      from: {
        name: "donotreply",
        address: "mrimann96@gmail.com",
      },
      to: mailList, // we need to change here to user email
      subject: "Regarding approval for guest house",
      html: userRejectionNotificationTemplate(),
    });

    res.json({ message: "booking rejection notification sent to emails " });
  } catch (error) {
    res.json({ message: error.message });
  }
});

const hodBookingRequestTemplate = ({
  dept,
  email,
  bookingId,
  name,
  studRoll,
  startDate,
  endDate
}) => `
<h3>Dear Sir/Mam, </h3>
<p>This is an autogenerated email, generated after a student of your department has requested a room in one of the Institute's guest house. We would request you to please verify that the student has booked a room for his/her parents/siblings only. </p>

<div>
<p> Below are the details of the student:  </p>
<table>
<tr>
   <th>Name: </th>
   <td>${name} </td>
</tr>
<tr>
   <th>Roll No: </th>
   <td>${studRoll} </td>
</tr>
<tr>
   <th>Department: </th>
   <td>${dept} </td>
</tr>
<tr>
   <th>Duration of Stay: </th>
   <td>${startDate} to ${endDate}  </td>
</tr>
<tr>
   <th>Contact Information: </th>
   <td>${email}</td>
</tr>
</table>

</div>

<div>
<p> Please click on Yes to approve the student's request and click on No to reject the student's request. </p>
<button style="padding:0.5rem 1rem;cursor:pointer;border-radius:4px;border:none;outline:none;background:blueviolet;">
<a style="cursor:pointer;text-decoration:none;color:white;"
 href="${REMOTE_URL}/email/booking/hod?status=accepted&bookingId=${bookingId}">Yes</a>
</button>
<button style="padding:0.5rem 1rem;cursor:pointer;border-radius:4px;border:none;outline:none;background:red;">
<a style="cursor:pointer;text-decoration:none;color:white;" 
href="${REMOTE_URL}/email/booking/hod?status=rejected&bookingId=${bookingId}">No</a>
</button>
</div>
<p>
Best Regards, <br/>
NITJ Guest House
</p>
`;

router.post("/hod", async (req, res) => {
  //   console.log(req.body);
  const { bookingId } = req.body;

  try {
    const existingBooking = await Booking.findById(bookingId);
    if (!existingBooking) {
      throw new Error("Booking not found");
    }
    // booking by name, roll

    const {
      roomBooker: { dept, email },
      startDate,
      endDate,
    } = existingBooking;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new Error("User not found");
    }

    const { name, studRoll } = existingUser;
     startDate = formatDate(new Date(startDate));
     endDate = formatDate(new Date(endDate));

    const mailOptions = {
      from: {
        name: "donotreply",
        address: "mrimann96@gmail.com",
      },
      to: `${ADMIN_EMAIL}`,
      subject: "Request for Approval: Guest House Room Allottment",
      html: hodBookingRequestTemplate({
        dept,
        email,
        bookingId,
        name,
        studRoll,
        startDate,
        endDate
      }),
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "mail sent to hod..." });
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.get("/hod/verification/:userEmail", async (req, res) => {
  const { userEmail } = req.params;
  const { status } = req.query;

  try {
    if (!userEmail) {
      throw new Error("user email not found");
    }

    if (!status) {
      throw new Error("Status not found");
    }

    const mailOptions = {
      from: {
        name: "donotreply",
        address: "mrimann96@gmail.com",
      },
      to: userEmail,
      subject: `Booking Request ${
        status === "accepted" ? "Confirmation" : "Rejection"
      }`,
      html: `
            <h3>Dear Sir/Madam,</h3>
           ${
             status === "accepted"
               ? "<p>Your request has been accepted by HOD. Please wait for the room alottment by Guest House Manager.</p>"
               : "<p>Your request has been rejected by HOD. Contact the HOD of your dept. for more details.</p>"
           } 
            Best Regards, <br/>
            NITJ Guest House.
            `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "hod verification working properly" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// hod verification

router.get("/hod", async (req, res) => {
  let { status, bookingId } = req.query;

  try {
    if (!status || !bookingId) {
      throw new Error("Status or booking id not found");
    }
    const existingBooking = await Booking.findById(bookingId);
    if (!existingBooking) {
      throw new Error("Booking with this id not found...");
    }

    if (status) {
      if (status === "accepted") {
        existingBooking.status = "pending";
        await existingBooking.save();
        res.json(
          "Notification sent to corresponding user and admin regarding booking status..."
        );

        await Promise.all([
          axios.post(
            `${REMOTE_URL}/email/booking/adminNotification`,
            {
              actualData: existingBooking,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          ),
          axios.get(
            `${REMOTE_URL}/email/booking/hod/verification/${existingBooking.roomBooker.email}?status=accepted`
          ),
        ]);
      }
      if (status === "rejected") {
        existingBooking.status = "rejected";
        await existingBooking.save();
        res.json(
          "Notification sent to corresponding user regarding the booking status..."
        );
        await axios.get(
          `${REMOTE_URL}/email/booking/hod/verification/${existingBooking.roomBooker.email}?status=rejected`
        );
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
