const express = require('express');
const {
    School, Session,  Class, Section, Room, Subject, Weekday, Teacher, Class_Section,
    Class_Subject, Teacher_Subject, Schedule, Provisional, User} = require('../models/all.model');

const router = express.Router();

//====== pdfmake setting starts =================
const pdfMake = require('pdfmake');
const fs = require('fs');
const fonts = require('../utils/pdfMakeFonts');
//====== pdfmake setting ends ===================

// ==================================================================
function buildTeachersRoutineTABLE(Weekdays, Teachers, Schedules) {
    var everything = [];

    Weekdays.forEach( weekday => {
        var widths = [];
        widths.push('*');
        for(var i = 1; i <= weekday.periods; i++){
            widths.push('*');
        }


        var obj = { 
            pageBreak: 'after',
            text: weekday.name,
            table: {
                widths: widths,
                headerRows: 1,
                body: buildTeachersRoutineTABLE_BODY(weekday, Teachers, Schedules)    
            }
        
        }

        everything.push(obj);
    })
    
    return everything;  
}


function buildTeachersRoutineTABLE_BODY(weekday, Teachers, Schedules){

    var body = [];

    var n = weekday.periods;    
    var pageHeader = [];

    pageHeader.push('Name');
    
    for(var i = 1; i <= weekday.periods; i++){        
        pageHeader.push( {text: i, alignment: 'center' });
    }

    body.push(pageHeader);

    //==================================================
    // for each teacher
    Teachers.forEach(teacher => {
        var dataRow = [];
        dataRow.push({text: teacher.name, fontSize: 8});
        //for each period
        for(var i = 0; i < weekday.periods; i++){
            // set of schedules
            var data = Schedules.filter( schedule => {
                return  schedule.weekday._id.equals(weekday._id ) && 
                            schedule.teacher._id.equals(teacher._id ) &&
                            schedule.period_no == (i+1) ;

            });

            // console.log(data);
            var str = '';
            if(data !== null){
                data.forEach( d => { 
                    str = str + d.class.name + d.section.name  +'\n'+ d.subject.name
                })
            }
            // console.log(str);

            var obj = { 
                text: str,
                fontSize: 8
            }
            dataRow.push(obj)
        }
        body.push(dataRow);
    });

    return body;
}


function buildTeachersRoutinePDF({Weekdays, Teachers, Schedules} = {}){

    let printer = new pdfMake(fonts);
    var pdfData = {
        pageOrientation: 'portrate', //landscape
        content: [
            {
                text: 'Manikchak High Mardrasah(H.S.)\n',
                style: 'header',
                alignment: 'center'
            },
            {
                text: 'DayWise Teacher\'s Routine \n\n',                    
                style: 'sub_header',
                alignment: 'center'
            },

            buildTeachersRoutineTABLE(Weekdays, Teachers, Schedules),
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
    pdfDoc.pipe(fs.createWriteStream('assets/pdf/teachers-routine.pdf'));
    pdfDoc.end();

}
// ==================================================================


// ==============================================================
// function htmlToPdfmakeDoc(){
//     var pdfMake = require("pdfmake/build/pdfmake");
//     var pdfFonts = require("pdfmake/build/vfs_fonts");
//     pdfMake.vfs = pdfFonts.pdfMake.vfs;
//     var htmlToPdfmake = require("html-to-pdfmake");

    
    
//     var fs = require('fs');
//     var jsdom = require("jsdom");
//     var { JSDOM } = jsdom;
//     var { window } = new JSDOM("");

//     var html = htmlToPdfmake(`
//     <p>
//         This sentence has <strong>a highlighted word</strong>, but not only.
//     </p>
//     `, {window:window});

//     var dd = {
//         content: [html],
        
//       }
//     //   pdfMake.createPdf(dd).download();
    
//     var pdfDocGenerator = pdfMake.createPdf(dd);
//     pdfDocGenerator.getBuffer(function(buffer) {
//       fs.writeFileSync('example.pdf', buffer);
//     }); 
// }
// ==============================================================


router.get('/', async (req, res) => {
    const Weekdays = await Weekday.find({}).sort({ 'day_id': 1});
    const Teachers = await Teacher.find({}).sort({'index' : 1});

    const Schedules = await Schedule.find({})
    .populate('session')
    .populate('weekday')
    .populate('class')
    .populate('section')
    .populate('subject')
    .populate('teacher')
    ;


    // htmlToPdfmakeDoc();

    buildTeachersRoutinePDF({ Weekdays, Teachers, Schedules });

    res.render('ejs/pages/routine-teachers',{
        Weekdays,
        Teachers,
        Schedules        
    });    
});





















module.exports = {
    router: router
}