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

    const curr_date = new Date();
    // console.log(curr_date);
    // console.log( curr_date.toISOString() );
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = days[curr_date.getDay()];

    const weekday = await Weekday.findOne({
        name: today
    });
    // console.log('weekday:'+weekday);
    const schedules = await Schedule.find({
        session: session,
        weekday: weekday
       
               
    })
    .populate('session')
    .populate('weekday')
    .populate('class')
    .populate('section')
    .populate('subject')
    .populate('teacher')
    ;
    console.log('schedule:'+schedules)




    
    
    const provistional = await Provisional.findOne({
        curr_date: text
    });

    if(provistional){
        console.log('exists');
        // console.log('provisional:'+provistional);
    }else{
        console.log('not exists');
        const prov = new Provisional({
            session: session,
            curr_date: text
        });
        await prov.save();
        // console.log(prov);
    }

    const date = new Date();
    const [withoutTime] = date.toISOString().split('T');
    console.log(withoutTime); // 👉️ 2022-01-18
    console.log( (new Date(withoutTime)).toISOString() ); // 👉️ 2022-01-18

    
    const teachers = await Teacher.find({});
    const provisionals = await Provisional.find({
        curr_date: (new Date(withoutTime)).toISOString()
    })
    .populate({
        path: 'absentees',
        populate: {
            path: 'teacher',
            model: 'Teacher',
            populate: {
                path: 'periods',
                model: 'Section'                
            }
        }
    });
    console.log(JSON.stringify(provisionals) );

    // provisionals

    // const prov_detals = provisionals.populate({ 
    //     path: 'absentees',
    //     populate: {
    //       path: 'teacher'
          
    //     }
    // });
    // console.log(prov_detals);


    res.render('ejs/pages/routine-provitional',{
        session, weekday, teachers, provisionals, schedules
    });
});


router.post('/ajax/teacher-submit', async (req, res) => {
    console.log(req.body);
    const session = await Session.findOne({ status: 'active'});    

    const curr_date = new Date();    
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = days[curr_date.getDay()];
    
    const curr_date_split = curr_date.toISOString().split('T')[0];    
    curr_date_split_dt = new Date(curr_date_split);

    const curr_provisional = await Provisional.findOne({
        curr_date: curr_date_split_dt.toISOString()
    });

    // console.log('prov:' + curr_provisional);

    try{
        const weekday = await Weekday.findOne({
            name: today
        });
        // console.log('weekday:'+weekday);
        const schedules = await Schedule.find({
            session: session,
            weekday: weekday,
            teacher: req.body.teacher        
        })
        // .populate('session')
        // .populate('weekday')
        // .populate('class')
        // .populate('section')
        // .populate('subject')
        // .populate('teacher')
        ;
        // console.log('schedules:' + schedules);
        // const teacher = Teacher.findById(req.body.teacher);
        // console.log('xxteacher:'+teacher);

        console.log(schedules);
        periods = [];
        schedules.map( sch => {
            console.log('sch:'+sch);
            periods.push({
                class: sch.class,
                section: sch.section,
                subject: sch.section,
                period_no : sch.period_no
            });
        });
        console.log('periods:'+ JSON.stringify(periods) );


        curr_provisional.absentees.push({
            teacher: req.body.teacher,
            reason: req.body.reason,
            periods: periods,
            off_periods: [1,2,3],
            periods: periods

        });





        // await curr_provisional.save();

        console.log(curr_provisional);



    }catch(err){
        console.log(err);
    }

    

    res.send({
        "response":"ajax prov teacher submit success"
        // "message": JSON.stringify(req.body)
    });
});




module.exports = {
    router: router
}