const express = require("express");
const bcrypt = require("bcrypt")
const dotenv = require("dotenv");
const axios = require('axios');
const jwt = require("jsonwebtoken");



dotenv.config();
const app = express();
const router = express.Router();



const Login = require("../models/login");
const User = require("../models/user/user");


router.get("/admin", async (req, res) => {
    try {
        const admin = await Login.find({isAdmin: true});
        if (admin.length === 0) {
            res.status(404).json({ message: "no admin found, matching that id" });
        }

        res.status(200).json(admin);

    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post("/admin", async (req,res) => {
    const data = req.body;
    try {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        if (hashedPassword === null) {
            throw new Error("hash could not be created");
        }

    const adminLogin = new Login({
        email: data.email,
        password: hashedPassword,
        isAdmin: true,
        isMainAdmin: data.isMainAdmin
    });


        const AdminUser = await adminLogin.save();
        if (AdminUser === null) {
            throw new Error("admin not created");
        }

        //created new user
        console.log("admin created successfully");
        res.status(201).json({ message: "admin created successfully" });

    }

    catch (err) {
        res.json({ message: err.message });
    }
})



router.get("/admin/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const admin = await Login.find({ _id: id });
        if (admin.length === 0) {
            res.status(404).json({ message: "no admin found, matching that id" });
        }

        res.status(200).json(admin);

    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete("/admin/:id", async (req, res) => {
    const id = req.params.id;
    try {

        const admin = await Login.findOne({ _id: id });
        if (!admin) {
            return res.status(404).json({ message: "No admin found with that id" });
        }

        await Login.deleteOne({ _id: id });
        res.status(200).json({ message: "Admin deleted successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    } 
});

router.get("/", async (req, res) => {
    try {
        const alllogins = await Login.find({});
        if (alllogins.length === 0) {
            console.log("No logins yet");
        }
        res.status(200).json(alllogins);
    }
    catch (err) {
        res.json({ message: err.message })
    }
});




router.post("/", async (req, res) => {
    const loginData = req.body;
    console.log(loginData);
    try {
        const user = await Login.find({ email: loginData.Email });

        console.log(user);
        if (user.length === 0) {
            console.log("email does not matches");
            // res.status(401).json({ message: "email does not matches" });
            throw new Error("Username or password invalid.");
        }
      
            const result = await bcrypt.compare(loginData.Password, user[0].password);
            // const result = loginData.Password === user.password;

            if (result === false) {
                // console.log(`not valid ${user[0].isAdmin ? "admin" : "user"}`);
                // res.status(403).json({ message: `not valid ${user[0].isAdmin ? "admin" : "user"}` });
                throw new Error("Username or password invalid.");
            }
            else {
                
                let user1 = await User.find({ email: user[0].email });
                console.log(user1);
                console.log(`${user[0].isAdmin ? "Admin" : "User"} login successful`);
                req.session.user = user1;
                req.session.isAdmin = user[0].isAdmin;
               const obj = { message: `${user[0].isAdmin ? "Admin" : "User"} login successful`, isAdmin: user[0].isAdmin, id: user[0].isAdmin ? user[0]._id : user1[0]._id };

                    
               if(user[0].isMainAdmin) {
                        obj["isMainAdmin"] = true;
               }
               else {
                     obj["isMainAdmin"] = false;
               }
                  
                res.status(200).json(obj);
        }
    }
    catch (err) {
        console.log({ message: err.message });
        res.json({ message: err.message });
    }
})


router.delete("/", async (req, res) => {
    try {
        const deletedLogins = await Login.deleteMany({});

        res.status(200).json({ message: "Logins Deleted successfully" });

    }
    catch (err) {
        res.json({ message: err.message })
    }
})


// router.delete("/:email", async (req,res) => {
// const email = req.params.email;
// try{
//     await Login.deleteOne({email});

//     res.json({message: `${email} successfully logged out...`})
// }
// catch(err) {
//     console.log({message: err.message});
//     res.status(500).json({message: err.message})
// }
// })


router.post("/forgot-password", async (req, res) => {
    console.log()
    const email = req.body.email;
    try {
        const user = await Login.find({ email: email });

        if (user.length === 0) {
            res.status(401).json({ message: "email does not matches" });
        }

        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '3h' })

        res.json({ message: "Check Mail to update password..." });
        await axios.get(`http://localhost:3000/email/forgot-password/${encodeURIComponent(email)}/token/${encodeURIComponent(token)}`);

    }

    catch (err) {
        res.json({ message: err.message })
    }

});


router.get("/forgot-password/verify/:token", (req, res) => {
    const token = req.params.token;
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // res.send(`${payload.email} verified successfully...`);
        res.writeHead(302, {
            Location: 'http://localhost:5173/update-password'
        });


        res.end();

    }
    catch (err) {
        res.json({ message: err.message })
    }

});

router.post("/update-password", async (req, res) => {
    const details = req.body;

    try {
        const user = await Login.find({ email: details.email });
        if (user.length === 0) {
            res.json({ message: "email does not matches" });
        }

        const hashedPassword = await bcrypt.hash(details.password, 10);

        await Login.updateOne({
            email: details.email
        }, {
            password: hashedPassword
        });

        res.json({ message: "Password updated successfully" });

        // if (!details.isAdmin) {
        //     await User.update({
        //         email: details.email
        //     }, {
        //         password: hashedPassword
        //     }
        //     );
        // }
    }
    catch (err) {
        res.json({ message: err.message })
    }
})

module.exports = router;