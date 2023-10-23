const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
         required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    deptt: {
        type: String,
        required:true,
    },
    phone: {
        type: String,
        required: true,
    }
})

const Faculty = new mongoose.model("Faculty", facultySchema);