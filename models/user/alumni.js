const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema({
    name: {
       type: String,
       required: true,
    },
    batch : {
        type: Number,
        required: true,
    },
    branch: {
        type: String,
        required: true,
    },

    currentJob: {
      type: String, 
      required: true
    },

    phone: {
        type: String,
        required: true,
    }
});

const Alumni = new mongoose.model("Alumni", alumniSchema);

module.exports = Alumni;