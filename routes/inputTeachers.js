const express = require('express');
const {
    School, Session,  Class, Section, Room, Subject, Weekday, Teacher, Class_Section,
    Class_Subject, Teacher_Subject, Schedule, Provisional, User} = require('../models/all.model');

const router = express.Router();



//====== pdfmake =================
const pdfMake = require('pdfmake');
const fs = require('fs');
const fonts = require('../utils/pdfMakeFonts');
let printer = new pdfMake(fonts);
let pdfData = {
    content: [
        "Hello World Students..."
    ],
};
let pdfDoc = printer.createPdfKitDocument(pdfData);
pdfDoc.pipe(fs.createWriteStream('assets/pdf/abc.pdf'));
pdfDoc.end();
//==============================




router.get('/', async (req,res)=>{

    const teachers = await Teacher.find({}).sort({index:1});
    // console.log('xx'+ teachers.length );
    
    //for first time only
    var i = 1;
    teachers.forEach(async teacher => {
        teacher.index = i++;
        teacher.teacher_id = 'na';        
        // await teacher.save();        
    });

    let printer = new pdfMake(fonts);
    let pdfData = {
    content: [
        "Hello World Students... 123 new file"
    ],

}

let pdfDoc = printer.createPdfKitDocument(pdfData);


pdfDoc.pipe(fs.createWriteStream('assets/pdf/abc.pdf'));
pdfDoc.end();



    res.render('ejs/pages/in-teachers', {
        teachers
    });
});

router.get('/up/:ind', async(req, res)=>{
    const ind = Number( req.params['ind'] );
    const nextInd = ind-1;
    // console.log(ind);
    const teachers = await Teacher.find({});
    // const length = teachers.length;
    const length = await Teacher.find({}).count();

    if(ind > 1){

        const teacher = await Teacher.findOne({index: ind});
        const teacher2 = await Teacher.findOne({index: nextInd});

        // console.log(teacher);
        // console.log(teacher2);

        teacher.index = nextInd;
        teacher2.index = ind;

        await teacher.save();
        await teacher2.save();

    }

    res.redirect('/teachers');
});



router.get('/dn/:ind', async(req, res)=>{
    const ind = Number( req.params['ind'] );
    const nextInd = ind+1;
    // console.log(ind);
    const teachers = await Teacher.find({});
    const length = teachers.length;

    if(ind < length){
        const teacher = await Teacher.findOne({index: ind});
        const teacher2 = await Teacher.findOne({index: nextInd});
        
        // console.log(teacher);
        // console.log(teacher2);

        teacher.index = nextInd;
        teacher2.index = ind;

        await teacher.save();
        await teacher2.save();
    }

    res.redirect('/teachers');
});





module.exports = {
    router: router
}