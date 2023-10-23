const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
         required: true,
    },
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
})



const Student = new mongoose.model("Student", studentSchema);



module.exports = Student;