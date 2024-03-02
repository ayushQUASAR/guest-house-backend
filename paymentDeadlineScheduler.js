const cron = require('node-cron');
const mongoose = require('mongoose');
const BookingApproval = require('./models/booking/bookingApproval');
const Booking = require('./models/booking/booking');


const cronJobForPaymentDeadline = () => {
cron.schedule('* * * * *', async () => { 
    
    const now = new Date();

    console.log("hello from cron job on ", now);

    async function updateStatus(model, status) {
        const documents = await model.find({
            "roomBooker.isAdmin": {$ne :true},
            status: { $nin: [status, 'paid', 'cancelled', 'checkedOut', 'refunded'] },
            createdAt: { $lt: new Date(now.getTime() - 24 * 60 * 60 * 1000) }
        });
    
        console.log("Documents:" + documents);
    
        documents.forEach(async (doc) => {
            const deadlineHours = 24;
            const deadline = new Date(doc.createdAt.getTime() + deadlineHours * 60 * 60 * 1000);
    
            console.log("Deadline: " + deadline);
    
            if (now >= deadline) {
                doc.status = 'autoReject';
                await doc.save();
            }
        });
    }
    
    // Use the function for both models
    updateStatus(Booking, 'rejected');
    updateStatus(BookingApproval, 'reject');
});
}

module.exports = cronJobForPaymentDeadline;