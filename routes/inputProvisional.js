const express = require('express');
const {
    School, Session,  Class, Section, Room, Subject, Weekday, Teacher, Class_Section,
    Class_Subject, Teacher_Subject, Schedule, Provisional, User} = require('../models/all.model');

const router = express.Router();

//====== pdfmake =================
const pdfMake = require('pdfmake');
const fs = require('fs');
const fonts = require('../utils/pdfMakeFonts');



// ==============================

function buildTableProvisionals(weekday, provisionals) {
    var widths = [];
    widths.push('*');
    for(var i = 1; i <= weekday.periods; i++){
        widths.push('*');
    }
    return {
        table: {
            widths: widths,
            headerRows: 1,
            body: buildTableBody(weekday, provisionals)
        }
    }
}


function buildTableBody(weekday, provisionals){
    var body = [];

    var n = weekday.periods;    
    var pageHeader = [];

    pageHeader.push('Name');
    
    for(var i = 1; i <= n; i++){        
        pageHeader.push( {text: i, alignment: 'center' });
    }

    body.push(pageHeader);
    //==================================================
    provisionals.forEach( provisional =>{
        var dataRow = [];
        
        provisional.absentees.map( absentee => {
            dataRow = [];
            // console.log(absentee.teacher.name);
            var nameRow = [];
            var name = {text: absentee.teacher.name, fontSize: 15, bold: true};
            nameRow.push(name);

            var reason = {text: absentee.reason, fontSize: 12, bold: false};
            nameRow.push(reason);


            dataRow.push(nameRow);
            // dataRow.push(name);

            for(var i=1; i<=n; i++){
                var flag = false;
                absentee.periods.forEach(period => {
                    if( period.period_no === i ){
                        var str = period.class.name + period.section.name + '-' + period.subject.name + '\n';
                        str = str + 'To: ' +(period.teacher ? period.teacher.name : '') 

                        dataRow.push(str);
                        flag = true;
                    }
                })

                if(flag === false){
                    dataRow.push(' ');
                }
            }

            body.push(dataRow);    
        });
        
        

    })



    return body;
}


function provisionalRoutinePDF({weekday, provisionals} = {}){





    let printer = new pdfMake(fonts);
    var pdfData = {
        pageOrientation: 'landscape',
        content: [
            {
                text: 'Manikchak High Mardrasah(H.S.)\n',
                style: 'header',
                alignment: 'center'
            },
            {
                text: 'Provisional Routine for: '+ new Date() +'\n\n',                    
                style: 'sub_header',
                alignment: 'center'
            },

            buildTableProvisionals(weekday, provisionals),

            // {
            //     table:{
            //         widths: pageHeader.map(item =>{ 
            //             return { text: item } 
            //         }),
            //         body:[
            //             tableHeading,
            //             tableData
            //         ]
            //     }
            // },
            

        ],
        styles: {
            header: {
                fontSize: 22,
                bold: true,
                alignment: 'justify'
            },
            sub_header: {
                fontSize: 16,
                bold: true,
                alignment: 'justify'
            },
            text: {
                fontSize: 12,
                bold: true,
                alignment: 'justify'
            }
        }
        
    }
    let pdfDoc = printer.createPdfKitDocument(pdfData);
    pdfDoc.pipe(fs.createWriteStream('assets/pdf/provisional-routine.pdf'));
    pdfDoc.end();

}
// ==============================















// /provisional/
router.get('/routine', async(req,res)=>{
    const session = await Session.findOne({status: "active"});
    // provisionalRoutinePDF();
    // console.log(session);

    // process.env.TZ = 'Asia/Calcutta';

    const curr_date = new Date();    
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = days[curr_date.getDay()];
    
    const curr_date_split = curr_date.toISOString().split('T')[0];    
    curr_date_split_dt = new Date(curr_date_split);

    console.log(curr_date_split_dt);

    const weekday = await Weekday.findOne({
        name: today
    });

    const weekdays = await Weekday.find({}).sort({'day_id':1});
    // console.log('weekday:'+weekday);
    const schedules = await Schedule.find({
        session: session,
        weekday: weekday
    }).sort({ period_no : 1 })
    .populate('session')
    .populate('weekday')
    .populate('class')
    .populate('section')
    .populate('subject')
    .populate('teacher')
    ;
    // console.log('schedule:'+schedules)




    
    
    const provistional = await Provisional.findOne({
        curr_date: curr_date_split_dt.toISOString()
    });

    if(provistional){
        console.log('exists');
        // console.log('provisional:'+provistional);
    }else{
        console.log('not exists');
        const prov = new Provisional({
            session: session,
            curr_date: curr_date_split_dt.toISOString()
        });
        await prov.save();
        // console.log(prov);
    }

    const date = new Date();
    const [withoutTime] = date.toISOString().split('T');
    console.log(withoutTime); // 👉️ 2022-01-18
    // console.log( (new Date(withoutTime)).toISOString() ); // 👉️ 2022-01-18

    
    const teachers = await Teacher.find({});
    const provisionals = await Provisional.find({
        curr_date: (new Date(curr_date_split)).toISOString()
    })
    .populate('session')
    .populate({        
        path: 'absentees',
        populate: {
            path: 'teacher',
            model: 'Teacher',
        }    
    })
    .populate({        
        path: 'absentees',
        populate: {
            path: 'periods',
            populate: {
                path: 'class',
                model: 'Class'
            }            
        }, 
    })
    // .populate({        
    //     path: 'absentees',
    //     populate: {
    //         path: 'periods',
    //         populate: {
    //             path: 'section',
    //             model: 'Section'
    //         }            
    //     }, 
    // })
    .populate({        
        path: 'absentees.periods.section',
        model: 'Section'        
    })
    .populate({        
        path: 'absentees.periods.teacher',
        model: 'Teacher'
    })
    .populate({        
        path: 'absentees',
        populate: {
            path: 'periods',
            populate: {
                path: 'subject',
                model: 'Subject'
            }            
        }, 
    })

    ;
    // console.log('JSON Prov: '+JSON.stringify(provisionals) );

    provisionalRoutinePDF( {weekday, provisionals} );

    res.render('ejs/pages/routine-provitional', {
        session, weekday, weekdays, teachers, provisionals, schedules
    });
});

router.post('/ajax/provisional-teacher-submit', async (req, res) => {
    console.log(req.body);

    const prov_assigned_teacher = await Teacher.findOne({ 
        '_id': req.body.provisional_teacher_id
    });
    console.log(prov_assigned_teacher);

    const prov_class = await Provisional.findOne({
        '_id': req.body.provisional_day_id,
        // 'absentees._id': req.body.absentee_id,
        // 'absentees.periods._id': req.body.period_id,
    });

    prov_class.absentees.map( absentee => {
        // console.log('abs:' + absentee);
        if(absentee._id.equals(req.body.absentee_id)){
            const period = absentee.periods.find( period => {
                return period._id.equals(req.body.period_id);
            });
            period.set({'teacher': prov_assigned_teacher});
        }
    });

    await prov_class.save();




    // console.log( (prov_class) );





    res.send({
        "response":"ajax provisional class wise teacher submit success"
        // "message": JSON.stringify(req.body)
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

        // console.log(schedules);
        periods = [];
        schedules.map( sch => {
            console.log('sch:'+sch);
            periods.push({
                class: sch.class,
                section: sch.section,
                subject: sch.subject,
                period_no : sch.period_no
            });
        });
        // console.log('periods:'+ JSON.stringify(periods) );


        curr_provisional.absentees.push({
            teacher: req.body.teacher,
            reason: req.body.reason,
            periods: periods,
            off_periods: [1,2,3],
            periods: periods

        });

        await curr_provisional.save();
        console.log(curr_provisional);



    }catch(err){
        console.log(err);
    }

    

    res.send({
        "response":"ajax prov teacher submit success"
        // "message": JSON.stringify(req.body)
    });
});




router.post('/ajax/provisional-teacher-delete', async(req,res) => {
    console.log('/ajax/provisional-teacher-delete:'+ JSON.stringify(req.body));

    // const provisional_day_sr = await Provisional.findOne({
    //     // '_id': req.body.prov_day_id,
    //     // 'absentees._id': { $eq: req.body.absentee_id },
    //     absentees: { $elemMatch: {'_id': req.body.absentee_id } }
    // });
    // console.log('find absentee:');
    // console.log(provisional_day_sr);

    const provisional_day = await Provisional.updateOne(
        {'_id': req.body.prov_day_id},
        // 'absentees._id': { $eq: req.body.absentee_id },
        // { '$pull': { 'absentees': { $elemMatch: {'_id': req.body.absentee_id } } } },
        { $pull: { absentees:  {_id: req.body.absentee_id } } } ,
        // {$pull: { absentees: { $elemMatch: {'_id': '6247a42843d7d9e3acaca829' } } } },
        { safe: true }
    );
    
    console.log(provisional_day);


    // Dive.update({ _id: diveId }, { "$pull": { "divers": { "diver._id": new ObjectId(userIdToRemove) } } }, { safe: true }, function(err, obj) {
    //     //do something smart
    // });


    // res.redirect('/provisional/routine');
    res.send({
        "response":"ajax prov teacher deleted successfully",
        "message": provisional_day
    });
});






module.exports = {
    router: router
}