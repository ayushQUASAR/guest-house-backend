const express = require("express");
const nodemailer = require("nodemailer");
const router  = express.Router();


const transportOptions = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "mrimann96@gmail.com",
        pass: "lwidtbnghfrtcgcv",
    }
}

const transporter = nodemailer.createTransport(transportOptions);

// email template
const emailHTMLTemplate = ({email}) =>  `
<p><b>Dear ${email} </b></p>
<p> wassup </p>
 `;



router.get("/", async (req,res) => {
    const mailOptions = {
        from: "donotreply",
        to: "dhimanmridul91@gmail.com",
        subject: "Just checking",
        html : emailHTMLTemplate({email:"dhimanmridul91@gmail.com"})
    };


    try {
         await transporter.sendMail(mailOptions);
         res.json({message:"mail sent successfully"})
    }

    catch(err) {
        res.json({message: err.message})
    }
});

module.exports = router;