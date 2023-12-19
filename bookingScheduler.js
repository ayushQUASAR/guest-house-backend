const cron = require("node-cron");
const Booking = require("./models/booking/booking");
const guestHouse = require("./models/guestHouse");
const axios = require('axios');


const cronJobForBookingCompletion = () => {
    cron.schedule("0 0 * * *", async () => {

        console.log("hello from cron job on ", new Date());
        //1. update the status to Checked Out
        //2. change the guestHouse to default
        const currentDate = new Date();
        try {

            const checkedOutBookings = await Booking.find({ status: "approved", endDate: { $lt: currentDate } });

// console.log("bookingScheduler.js" + checkedOutBookings);

            for (const booking of checkedOutBookings) {
                await Booking.updateOne({
                    _id: booking._id
                }, {
                    status: "checkedOut"
                });

                const guestHouses = booking.guestHouseAllotted;
                const rooms = booking.roomsAllotted;

                for (let i = 0; i < rooms.length; i++) {
                    const setObj = {};
                    setObj[`rooms.${rooms[i] - 1}`] = false;
                    await guestHouse.updateOne({
                        guestHouseId: guestHouses
                    }, {
                        $set: setObj
                    });
                }
            }

            await Promise.all([
                axios.delete("http://localhost:3000/calendar"),
                axios.get("http://localhost:3000/calendar/create"),
            ]);

        }
        catch (err) {
            console.log({ message: err.message });
        }
    })
}


module.exports = cronJobForBookingCompletion;
// schedule every day


