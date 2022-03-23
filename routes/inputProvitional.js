const express = require('express');
const {
    School, Session,  Class, Section, Room, Subject, Weekday, Teacher, Class_Section,
    Class_Subject, Teacher_Subject, Schedule, Provisional, User} = require('../models/all.model');

const router = express.Router();


router.get('/routine', async(req,res)=>{

    const session = await Session.findOne({status: "active"});
    // console.log(session);

    res.render('ejs/pages/routine-provitional',{
        session
    });
});





module.exports = {
    router: router
}