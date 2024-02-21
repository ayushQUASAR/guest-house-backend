const cron = require('node-cron');
const mongoose = require('mongoose');
const BookingApproval = require('./models/booking/bookingApproval');


const cronJobForPaymentDeadline = () => {
cron.schedule('0 * * * *', async () => { // this will run at 00:30
    
    const now = new Date();

    console.log("hello from cron job on ", now);

    const bookings = await BookingApproval.find({
        status: { $ne: 'reject' }, // status is not 'reject'
        createdAt: { $lt: new Date(now.getTime() - 24 * 60 * 60 * 1000) } // createdAt is more than 24 hours ago
    });

    bookings.forEach(async (booking) => {
        const deadlineHours = 24;
        const deadline = new Date(booking.createdAt.getTime() + deadlineHours * 60 * 60 * 1000);

        if (now >= deadline) {
            booking.status = 'reject';
            await booking.save();
        }
    });
});
}

module.exports = cronJobForPaymentDeadline;