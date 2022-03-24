const express = require('express');
const {
    School, Session,  Class, Section, Room, Subject, Weekday, Teacher, Class_Section,
    Class_Subject, Teacher_Subject, Schedule, Provisional, User} = require('../models/all.model');

const router = express.Router();

router.get('/order/class-sections', async(req,res) => {

    const class_sections = await Class_Section.find({})
        .populate('classId').populate('sectionId').sort({index: 1});

    // console.log(class_sections);
    // for first time only

    // var i = 1;
    // class_sections.forEach(async cls_sec => {
    //     cls_sec.index = i++;
    //     cls_sec.status = 'active';
    //     cls_sec.dise_code = '19071515802';
    //     await cls_sec.save();        
    // });

    res.render('ejs/pages/order-class-sections', {
        class_sections
    });
});


router.get('/order/class-sections/up/:ind', async (req, res) => {
    const ind = Number(req.params['ind']);
    const nextInd = ind-1;

    console.log("ind:"+ind);

    const length = (await Class_Section.find({})).length;


    if(ind > 1){
        const cls_sec = await Class_Section.findOne({index: ind});
        const cls_sec2 = await Class_Section.findOne({index: nextInd});

        cls_sec.index = nextInd;
        cls_sec2.index = ind;

        // console.log(cls_sec);
        // console.log(cls_sec2);

        await cls_sec.save();
        await cls_sec2.save();
    }

    // const class_sections = await Class_Section.find({})
    //     .populate('classId').populate('sectionId');

    res.redirect('/input/order/class-sections');
});


router.get('/order/class-sections/dn/:ind', async (req, res) => {
    const ind = Number(req.params['ind']);
    const nextInd = ind + 1;

    console.log('dn'+ind);

    const length = (await Class_Section.find({})).length;

    if(ind < length){
        const cls_sec = await Class_Section.findOne({index: ind});
        const cls_sec2 = await Class_Section.findOne({index: nextInd});

        cls_sec.index = nextInd;
        cls_sec2.index = ind;

        // console.log(cls_sec);
        // console.log(cls_sec2);

        await cls_sec.save();
        await cls_sec2.save();
    }



    res.redirect('/input/order/class-sections');
});




//===============================================================
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