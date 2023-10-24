const express =  require("express");
const bcrypt = require("bcrypt")
const dotenv = require("dotenv");


dotenv.config();
const app = express();
const router = express.Router();



const Login = require("../models/login");


router.get("/", async (req, res) => {
try {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, 10);
    const adminLogin = new Login({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
    });

    

    const AdminUser = await adminLogin.save();
       if(AdminUser === null) {
        throw new Error("admin not created");
       }
      
        //created new user
        res.status(201);
       
}
  
catch(err) {
    res.json({message: err.message});
}
});


router.post("/", async (req,res) => {
    const loginData = req.body;
    try {
          const admin = await Login.find({email: loginData.email});
          if(admin === null) {
            res.status(401).json({message:  "email does not matches"});
          }
          else {

           const result =  await  bcrypt.compare(loginData.password, admin.password);

           if(result === false) {
                  res.status(403).json({message: "not valid admin"});
           }
           else{
            res.status(200).json({message: "Admin login successful"});
           }
          }
    }
    catch(err) {
        console.log({message: err.message});
             res.json({message: err.message});
    }
})



module.exports = router;