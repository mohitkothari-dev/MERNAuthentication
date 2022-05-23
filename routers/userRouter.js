const router = require('express').Router();  //it is a feature that comes with express
const User = require('../models/userModel.js');
const Otp = require('../models/otp.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//register
router.post("/", async (req,res) => {
    try {
        const {email, password, verifyPassword} = req.body;
        //Validation
        if(!email || !password || ! verifyPassword)
        {
            return res.status(400).json({errorMessage: "Please enter all the required fields"});
        }
        if(password.length < 8)
        {
            return res.status(400).json({errorMessage: "Minimum 8 characters required for password"});
        }
        if(password!==verifyPassword)
        {
            return res.status(400).json({errorMessage: "Passwords do not match"});
        }
        const existingUser = await User.findOne({email});
        if(existingUser)
        {
            return res.status(400).json({errorMessage: "Account already exists"});
        }

        //hash the passwords
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        //save new user account to the database
        const newUser = new User({
            email, passwordHash
        });
        const saveUser = await newUser.save();

        //log the user in
        const token = jwt.sign({
            user: saveUser._id 
        }, process.env.JWT_SECRET_KEY);

        //send the token in a http only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).send();

    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

//login
router.post("/login", async (req,res) => {
    try {
        const {email, password} = req.body;

        //validation
        if(!email || !password)
        {
            return res.status(400).json({errorMessage: "Please enter all the required fields"});
        }
        
        const existingUser = await User.findOne({email});
        if(!existingUser)
        {
            return res.status(401).json({errorMessage: "Email or Password is incorrect"});
        }

        const correctPassword = await bcrypt.compare(password, existingUser.passwordHash);
        if(!correctPassword)
        {
            return res.status(401).json({errorMessage: "Email or Password is incorrect"});
        }

         //log the user in
        const token = jwt.sign({
            user: existingUser._id, 
        }, process.env.JWT_SECRET_KEY);

        //send the token in a http only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).send();

    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});


const mailer = (email, otp) => {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_ID,
        to: 'mrulekothari@gmail.com',
        subject: 'Sending email using node js',
        text: 'Here you will receive a link to reset your old password'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else {
            console.log('mail sent: ' + info.response);
        }
    });

}


router.post("/forgot-password", async (req,res) => {
    const {email} = req.body;
    const data = await User.findOne({email});
    const expireIn = new Date().getTime() + 300*1000;
    if(data){
        const code = Math.floor((Math.random()*1000000)+1);
        //save new user account to the database
        const otpData = new Otp({
            email, code, expireIn
        });
        const otpResponse = await otpData.save();
        mailer(email,code);
        res.status(200).json("OTP for resetting the password has been sent to your registered email id. Please check your email id.");
    }else {
        res.status(401).json("Email id does not exist");
    }
}); //sending an email 

router.post("/reset-password", async (req,res) => {
    const {email, code} = req.body;
    const data = await Otp.find({email, code});
    if(data) {
        const currentTime = new Date().getTime();
        const diff = data.expireIn - currentTime;
        if(diff < 0){
            res.json('Token expires');
        }else {
            const user = await User.findOne({email})
            user.password = req.body.password;
            user.save();
            res.json('Password Changed Successfully');
        }
    }
    else {
        res.json('Invalid OTP');
    }
}); //changing the password

router.get("/logout", (req,res)=> {
    res.cookie("token","", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none"
    }).send()
});

router.get("/userloggedin", (req, res)=> {
    try {
        const reqtoken = req.cookies.token;
        
        if(!reqtoken)
        {
            return res.json(false);
        }
        jwt.verify(reqtoken, process.env.JWT_SECRET_KEY);
        res.send(true);
        
    } catch (error) {
        res.json(false);
    }
});

module.exports = router;