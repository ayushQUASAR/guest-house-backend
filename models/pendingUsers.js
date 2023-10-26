const mongoose = require('mongoose');
const User = require("./user/user");


const pendingSchema = new mongoose.Schema({
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
}
});



const PendingUser = new mongoose.model('PendingUser', pendingSchema);

module.exports = PendingUser;

