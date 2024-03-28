
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();



const app = require('./app');
// const sessionRoute = require('./routes/session');



//importing cron job 
const cronJobForBookingCompletion = require("./bookingScheduler");
cronJobForBookingCompletion();

const cronJobForPaymentDeadline = require("./paymentDeadlineScheduler");
cronJobForPaymentDeadline();

//configuring packages
// const app = express();
// mongoose.connect("mongodb+srv://user:user@cluster0.5rmy7ke.mongodb.net/guest-house");
mongoose.connect('mongodb+srv://user:user@cluster0.uunf6ts.mongodb.net/guestHouse?retryWrites=true&w=majority');    
// mongoose.connect("mongodb://127.0.0.1:27017/guestHouse");

// new clean database
// mongoose.connect('mongodb+srv://user:user@cluster0.uunf6ts.mongodb.net/guest-house');

const db = mongoose.connection;
db.once('open', () => {
    console.log("Database connected")
});
db.on("error", (err) => {
    console.log({ database_message: err.message });
});
const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);

});
