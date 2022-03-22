const express = require('express');
const {
    School, Session,  Class, Section, Room, Subject, Weekday, Teacher, Class_Section,
    Class_Subject, Teacher_Subject, Schedule, Provisional, User} = require('../models/all.model');

const router = express.Router();

router.get('/in-class-subjects', async(req, res)=>{
    const clses = await Class.find({});
    const subjects = await Subject.find({
       "grade": "Secondary"
    });

    const subjectsHS = await Subject.find({
        "grade": "Higher Secondary"
     });
     console.log(subjectsHS.length);

    const class_subjects = await Class_Subject.find({})
        .populate('class').populate('subjects');
        
    const Weekdays = await Weekday.find({});
    
    res.render('ejs/pages/in-class-subjects',{
        clses, subjects, subjectsHS, class_subjects, Weekdays
    });
});






router.post('/ajax-class-subjects-submit', async(req, res) => {       
    console.log('ajax:'+ JSON.stringify(req.body) );

    const cls_subjects = await Class_Subject.findOne({
        "class": req.body.cls_id
    });

    if(cls_subjects){
        console.log('cls_subj exists'); 

        const data = cls_subjects.subjects;

        Class_Subject.updateOne(
            { "class": req.body.cls_id },
            { $pullAll: {subjects: data}}, 
            function(err, data) {
                if(err){
                    console.log(err);
                }else{
                    console.log('pop:' + JSON.stringify(data) );
                }
        });        

        Class_Subject.updateOne(
            {"class": req.body.cls_id},
            {$addToSet: {subjects: req.body.cls_subjs}}, 
            function(err, data) {
                if(err){
                    console.log(err);
                }else{
                    console.log('update all:' + JSON.stringify(data) );
                }
        });
        
        
    }else{
        // console.log('cls_subj not exists:' + cls_subjects);
        const cls_subjects = new Class_Subject({
            class : req.body.cls_id
        });        
        req.body.cls_subjs.forEach(subj => {
            cls_subjects.subjects.push(subj);
        });
        await cls_subjects.save();
        
    }

    res.send({
        "response": "submitted successffully"
    });
});




module.exports = {
    router: router
}