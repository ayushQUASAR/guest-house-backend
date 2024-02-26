require("dotenv").config();
const express = require("express");
const cors = require('cors');
const session = require("express-session")
const MongoStore = require('connect-mongo');
const app = express();


//configuring routes 
const registerRoute = require("./routes/userRegistration");
const approveRegistrationRoute = require("./routes/approveRegistration");
const usersRoute = require("./routes/users");
const loginRoute = require("./routes/login");
const referenceRoutes = require("./routes/references");
const emailRoute = require("./routes/email")
const bookingRoute = require("./routes/booking/booking");
const bookingApprovalRoute = require("./routes/booking/bookingApproval");
const guestHouseRoute = require("./routes/guestHouse")
const refundRoute = require("./routes/refund/refund");
const paymentRoute = require("./routes/payment/payment");

app.enable('trust proxy');
// const origins = ['http://localhost:5173',"https://guest-house-system-eight.vercel.app/"];
app.use(cors({
    origin: ["http://localhost:5173", "https://guest-house-frontend.onrender.com"],
    // default: "http://localhost:5173",
    credentials: true,
}));
//body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: "mongodb+srv://user:user@cluster0.uunf6ts.mongodb.net/guestHouse?retryWrites=true&w=majority" }),
    cookie: {
        secure: true,
        httpOnly: false,
        sameSite: 'none'
    }
}));

app.get("/", (req, res) => {
    res.send("Hello World");
})

// for session checking
app.get('/check-session', (req, res) => {
    // console.log(req.session);
    if (req.session.user) {
        res.send({ loggedIn: true, user: req.session.user, isAdmin: req.session.isAdmin });
        console.log("loggedIn is true");
    } else {
        res.send({ loggedIn: false });
        console.log("loggedIn is false");
    }
});

// for logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.send({ message: 'Error logging out' });
        } else {
            res.send({ message: 'Logged out successfully' });
        }
    });
});

//listening on port 3000
app.use("/register", registerRoute);
app.use("/admin/approveRegistration", approveRegistrationRoute);
app.use("/users", usersRoute);
app.use("/login", loginRoute);
app.use("/references", referenceRoutes);
app.use("/email", emailRoute);
//booking routes
app.use("/booking", bookingRoute);
app.use("/admin/bookingApproval", bookingApprovalRoute);
app.use("/guestHouse", guestHouseRoute);
app.use("/refund", refundRoute);
app.use("/payments", paymentRoute);
// app.use("/check-session", sessionRoute);

app.use("/images", require("./routes/images"));
app.use("/calendar", require("./routes/calendar"));

module.exports = app;
