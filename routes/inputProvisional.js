const express = require('express');
const {
    School, Session,  Class, Section, Room, Subject, Weekday, Teacher, Class_Section,
    Class_Subject, Teacher_Subject, Schedule, Provisional, User} = require('../models/all.model');

const router = express.Router();

// /provisional/
router.get('/routine', async(req,res)=>{
    const session = await Session.findOne({status: "active"});
    // console.log(session);

    

    // const curr_date = new Date(); //.toDateString();
    // console.log('before:'+ curr_date);
    
    process.env.TZ = 'Asia/Calcutta';

    const d = (new Date());    
    console.log('full date :' + d);
    console.log('date iso string:' + d.toISOString());

    let text = d.toISOString().split('T')[0];
    console.log('date splited text:'+ text);
    console.log('date splited full date:'+ Date(text) );
    // console.log('date splited full date:'+ Date(text).toISOString() );


    console.log('time default:'+d.getTime());
    console.log('time local string:'+d.toLocaleTimeString());

    
    
    const provistional = await Provisional.findOne({
        curr_date: text
    });

    if(provistional){
        console.log('exists');
        console.log('provisional:'+provistional);
    }else{
        console.log('not exists');
        const prov = new Provisional({
            curr_date: text
        });
        // await prov.save();
        console.log(prov);
    }


    const teachers = await Teacher.find({});

    res.render('ejs/pages/routine-provitional',{
        session, teachers
    });
});





module.exports = {
    router: router
}