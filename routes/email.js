const express = require("express");
const nodemailer = require("nodemailer");
const User = require("../models/user/user");
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

 const emailVerificationHTMLTemplate = ({email,token}) =>  {
    const verificationLink = `http://localhost:4000/email/${email}/verify/${token}`;

  return  `<h3> Hi ${email},</h3> <br/>
    <p>We just need to verify your email address before you can access the <u>ONLINE BOOKING</u>.</p>
    
    <p>Verify your email address: ${verificationLink}</p>
    <br/>
    
    <p>Thanks! - The NITJ Guest House Online Booking team </p>`;
 }

 

router.get("/", async (req,res) => {
    const mailOptions = {
        from: {
           name:"donotreply",
           address:"chakshud21@gmail.com",
        },
        to: "dhimanmridul91@gmail.com",
        subject: "Just checking",
        html : emailHTMLTemplate({email:"dhimanmridul91@gmail.com"})
    };


    try {
         await transporter.sendMail(mailOptions);
         res.json({message:"mail sent successfully"});
    }

    catch(err) {
        res.json({message: err.message})
    }
});




router.get("/verificationSuccess/:id",  (req, res)=> {
res.send(`<h1>${req.params.id} successfully verified</h1>`);
});





router.get("/:id/sendVerificationEmail/:token", async (req,res) => {
   const email= req.params.id;
const token = req.params.token;

   const mailOptions = {
    from: {
       name:"donotreply",
       address:"mrimann96@gmail.com",
    },
    to: email,
    subject: "Confirm Your Email Address",
    html : emailVerificationHTMLTemplate({email, token})
};

try {
await transporter.sendMail(mailOptions);

res.redirect(`http://localhost:4000/email/verificationSuccess/${email}`);

}
catch(err) {
res.json({message: err.message})
}
})

router.get("/:id/verify/:token", async (req,res) => {
    const {id, token} = req.params;

try {
  const user = await User.find({verificationToken: token});

  if(user === null) {   
    throw new Error(`Email:  ${id} can't be verified`);
  }
const output = await User.updateOne({email: id}, {emailVerified: true});
if(output=== null )
 {
    throw new Error("user could not be updated");
 }  
res.redirect(`http://localhost:4000/email/verificationSuccess/${id}`);
}
catch(err) {
    res.status(500).json({message: err.message})
}
})


module.exports = router;