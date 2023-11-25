const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    dept: {
        type: String,
        required:false,
    },
    phone: {
        type: String,
        required: false,
    }
}, { timestamps: true })

const Faculty = new mongoose.model("faculty", facultySchema);

module.exports = Faculty;