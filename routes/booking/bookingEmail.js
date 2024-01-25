//email related to bookings will be handled here...
require("dotenv").config();
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Booking = require("../../models/booking/booking");
const { default: axios } = require("axios");

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
  const actualData = req.body._doc;
  console.log(actualData);
  // send alerts to admin regarding the data being send
  // const { kind, purpose, name, designation, address, phone, email, companions, startDate, startTime, endDate, endTime, bookingFor } = req.params;

  const mailOptions = {
    from: {
      name: "donotreply",
      address: "mrimann96@gmail.com",
    },
    to: "avirals.cs.22@nitj.ac.in",
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
  roomsDetails,
}) => `
<h3>Hi,</h3> 
<p>Your booking has been approved...</p>
<p>${roomsDetails.length} rooms are allotted to you in Guest House ${guestHouseDetails}</p>
<p>Please login to your account for more details.</p>
`;

router.post("/sendApprovalNotification", async (req, res) => {
  const bookingDetails = req.body.booking;
  const guestHouseDetails = bookingDetails.booking.guestHouseAllotted;
  const roomsDetails = bookingDetails.booking.roomsAllotted;
  //send alerts to user and visitor regarding the booking confirmation
  const mailList = [
    bookingDetails.booking.email,
    bookingDetails.booking.roomBooker.email,
  ];
  const mailOptions = {
    from: {
      name: "donotreply",
      address: "mrimann96@gmail.com",
    },
    to: mailList, // we need to change here to user email
    cc: "avirals.cs.22@nitj.ac.in", // replace with the admin's email
    subject: "Regarding approval for guest house",
    html: userApprovalNotificationTemplate({ guestHouseDetails, roomsDetails }),
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "User has been notified about the approval" });
  } catch (err) {
    res.json({ message: err.message });
  }
});



const hodBookingRequestTemplate = ({ dept, email, bookingId }) => `
<h3>Dear Sir/Madam, </h3>
<p>A NITJ Student with email ID: <u>${email}</u> of ${dept.toUpperCase()} dept. is trying to book room(s) in one of the Guesthouses of NITJ.
<br/>Click below, to accept or reject the booking request: </p>
<div>
<button style="padding:0.5rem 1rem;cursor:pointer;border-radius:4px;border:none;outline:none;background:blueviolet;">
<a style="cursor:pointer;text-decoration:none;color:white;"
 href="${process.env.REMOTE_URL}/email/booking/hod?status=accepted&bookingId=${bookingId}">Accept</a>
</button>
<button style="padding:0.5rem 1rem;cursor:pointer;border-radius:4px;border:none;outline:none;background:red;">
<a style="cursor:pointer;text-decoration:none;color:white;" 
href="${process.env.REMOTE_URL}/email/booking/hod?status=rejected&bookingId=${bookingId}">Reject</a>
</button>
</div>
<br/>
Best Regards,
Online Guest House Room Alottment Team.
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
    } = existingBooking;

    const mailOptions = {
      from: {
        name: "donotreply",
        address: "mrimann96@gmail.com",
      },
      to: "avirals.cs.22@nitj.ac.in",
      subject: "Booking request approval",
      html: hodBookingRequestTemplate({ dept, email, bookingId }),
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
            Best Regards,
            Online Guest House Room Alottment Team.
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

        res.json("Notification sent to corresponding user and admin regarding booking status...");
        await Promise.all([
          axios.post(
            `${process.env.REMOTE_URL}/email/booking/adminNotification`,
            {
              ...existingBooking,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          ),
          axios.get(
            `${process.env.REMOTE_URL}/email/booking/hod/verification/${existingBooking.roomBooker.email}?status=accepted`
          ),
        ]);
      }
      if (status === "rejected") {
        res.json("Notification sent to corresponding user regarding the booking status...")
        await axios.get(
          `${process.env.REMOTE_URL}/email/booking/hod/verification/${existingBooking.roomBooker.email}?status=rejected`
        );
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
