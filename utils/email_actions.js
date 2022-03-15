const nodemailer = require('nodemailer');
const createError = require('http-errors');

const User = require('../models/user.model');

module.exports = { 
    sendEmail: async (u_id) => {

        const currUser = await User.findById(u_id);
        if(!currUser){
            throw createError.Conflict(`This user email '${currUser.email}' not exists.`);
        }
        // console.log('req:'+ currUser);

        var transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
            user: "493833c29fc569",
            pass: "9df19a2f7aefba"
            }
        });

        let mailOptions = {
            from: process.env.BASE_EMAIL_ID,
            to: currUser.email,
            subject: 'Requested OTP for new registered user email validation.',
            html: `<h1>Click Here to verify your email id</h1><Br/><a href='http://localhost:3000/api/users/self/${currUser.verify_url}'>Click to Verify Email</a>`,
            text: `Hello ${currUser.firstname}, This is your otp: ${currUser.verify_otp} requested.
                        Email validation link is: http://localhost:3000/api/users/${currUser.verify_url}`,
        };

        transporter.sendMail(mailOptions, function(err, info){
            if(err){
                console.log('Error occured in email send: '+err);
            }else{
                console.log('Email sent successfully: '+info.response);
            }
        });
    },



    // verifyEmailUrl: async (req, res, next) => {

    //     try{
            
    //         const user = await User.findOne({verify_url: req.params.verify_url});
    //         console.log('verify_email:' + user.email);
    //         if(!user){
    //             throw createError.Conflict(`This user email '${user.email}' not exists.`);
    //         }
    //         console.log('user: '+ currUser.is_url_verified);

    //         if(!currUser.is_url_verified){
    //             next(createError.Conflict(`The email id '${currUser.email}'is not verified.`));
    //         }

    //         next();
            


    //     }catch(err){
    //         next(err);
    //         // next(createError.Unauthorized(`This user email '${currUser.email}' not verified. Goto inbox & click on link.`));
    //     }
    // },


    isVerifiedEmailUrl: async(req, res, next) => {
        try{
            const currUser = await User.findById(req.payload.aud);
            if(!currUser){
                throw createError.Conflict(`This user email not exists.`);
            }

            if(currUser.is_url_verified == true){
                
                next();
            }else{
                next(createError.Unauthorized(`This user email '${currUser.email}' not verified. Goto inbox & click on link.`)); 
            }


        }catch(err){
            next(err);
            // next(createError.Unauthorized(`This user email '${currUser.email}' not verified. Goto inbox & click on link.`));
        }
    }


}