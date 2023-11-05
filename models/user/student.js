const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    // _id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //      required: true,
    //      unique: true,
    // },
    name: {
        type: String,
        required: true,
    },
    roll : {
        type: Number,
        required: true,
    },
    branch : {
        type: String,
        required: true,
    },
    phone: {
         type: String,
         required: true,
    },
}, { timestamps: true })



const Student = new mongoose.model("student", studentSchema);



module.exports = Student;