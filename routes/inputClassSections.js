const express = require('express');
const {
    School, Session,  Class, Section, Room, Subject, Weekday, Teacher, Class_Section,
    Class_Subject, Teacher_Subject, Schedule, Provisional, User} = require('../models/all.model');

const router = express.Router();

router.get('/in-class-sections', async(req, res)=>{
    const clses = await Class.find({});
    const sections = await Section.find({});


    const class_sections = await Class_Section.find({})
        .populate('classId').populate('sectionId');

    
    
    res.render('ejs/pages/in-class-sections',{
        clses, sections, class_sections
    });
});



router.post('/ajax-class-sections-submit', async(req, res) => {       
    console.log('ajax:'+ JSON.stringify(req.body) );

    const cls_sections = await Class_Section.find({
        classId : req.body.cls_id
    });


    await Class_Section.deleteMany({
        classId : req.body.cls_id            
    }); 
    


    req.body.cls_secns.forEach( async secn => {
        const cls_section = new Class_Section({
            classId : req.body.cls_id,
            sectionId : secn
        }); 
        await cls_section.save();
    });

    

    res.send({
        "response": "submittedxx successffully"
    });
});




module.exports = {
    router: router
}