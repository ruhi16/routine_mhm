const express = require('express');
const {
    School, Session,  Class, Section, Room, Subject, Weekday, Teacher, Class_Section,
    Class_Subject, Teacher_Subject, Schedule, Provisional, User} = require('../models/all.model');

const router = express.Router();

router.get('/in-class-subjects', async(req, res)=>{
    const clses = await Class.find({});
    const subjects = await Subject.find({});

    const cls_sub = await Class_Subject.find({})
        .populate('class').populate('subjects');
        
    const Weekdays = await Weekday.find({});

    // (await classes).forEach(cls =>{
    //     console.log(cls.name)
    // });
    
    
    
    res.render('ejs/pages/in-class-subjects',{
        clses, subjects, Weekdays
    });
});




module.exports = {
    router: router
}