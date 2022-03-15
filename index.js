const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

const ejs = require("ejs");
const pdf = require("html-pdf");
let students = [
    {name: "Joy",
     email: "joy@example.com",
     city: "New York",
     country: "USA"},
    {name: "John",
     email: "John@example.com",
     city: "San Francisco",
     country: "USA"},
    {name: "Clark",
     email: "Clark@example.com",
     city: "Seattle",
     country: "USA"},
    {name: "Watson",
     email: "Watson@example.com",
     city: "Boston",
     country: "USA"},
    {name: "Tony",
     email: "Tony@example.com",
     city: "Los Angels",
     country: "USA"
 }];



const {
    School,
    Session,
    Class, 
    Section, 
    Room,
    Subject,
    Weekday,
    Teacher,
    Class_Section,
    Class_Subject,
    Teacher_Subject,    
    Schedule,
    Provisional
} = require('./models/all.model');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./utils/database');
connectDB();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


//Log message at console
app.use(morgan('tiny'));    //tiny, combined, dev

// Root of the Page of Web Site
app.get('/', (req, res)=>{
    //console.log(req.body);
    res.send({status: 200, message: "This is Root Page."});
});

app.post('/user', (req,res)=>{
    // console.log(req.body);
    
    res.send({status: 200, message: "The form submitted."})
});



//set view engine
app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "/views/"));
// app.set("views", path.resolve(__dirname, "/views/ejs/"));


//load assets
app.use('/css', express.static(path.resolve(__dirname, "assets/css")));
app.use('/img', express.static(path.resolve(__dirname, "assets/img")));
app.use('/js' , express.static(path.resolve(__dirname, "assets/js")));

app.get('/routine-teachers', async (req,res) => {
    const Weekdays = await Weekday.find({}).sort({ 'day_id': 1});
    const Teachers = await Teacher.find({});

    const Schedules = await Schedule.find({})
    .populate('session')
    .populate('weekday')
    .populate('class')
    .populate('section')
    .populate('subject')
    .populate('teacher')
    ;;

    res.render('ejs/pages/routine-teachers',{
        Weekdays,
        Teachers,
        Schedules        
    });    
});

app.get('/routine-teachers-pdf', async (req,res) => {
    const Weekdays = await Weekday.find({}).sort({ 'day_id': 1});
    const Teachers = await Teacher.find({});

    const Schedules = await Schedule.find({})
    .populate('session')
    .populate('weekday')
    .populate('class')
    .populate('section')
    .populate('subject')
    .populate('teacher')
    ;;

    ejs.renderFile(path.join(__dirname, './views/ejs/pages/', "routine-teachers.ejs"), 
        { Weekdays, Teachers, Schedules }, 
        (err, data) => {
        if (err) {
              res.send(err);
        } else {
            let options = {
                "height": "11.25in",
                "width": "8.5in",
                "header": {
                    "height": "20mm"
                },
                "footer": {
                    "height": "20mm",
                },
            };
            pdf.create(data, options).toFile("report.pdf", function (err, data) {
                if (err) {
                    res.send(err);
                } else {
                    res.send("File created successfully");
                }
            });
        }
    });
    
    
});

app.get('/routine-students', async (req,res) => {
    const ClsSecns = await Class_Section.find({})
        .populate('sectionId').populate('classId');
    const Weekdays = await Weekday.find({}).sort({ 'day_id': 1});
    const Teachers = await Teacher.find({});

    const Schedules = await Schedule.find({})
        .populate('session')
        .populate('weekday')
        .populate('class')
        .populate('section')
        .populate('subject')
        .populate('teacher')
        ;

    res.render('ejs/pages/routine-students',{
        Weekdays,
        ClsSecns,
        Teachers,
        Schedules        
    });


});


app.get('/test', async (req,res) => {
  
    const classes = await Class.find({});

    classes.forEach(async (cls)=>{
        // console.log("class: "+cls.name);
        const subject = await Subject.findOne({"_id": "6218d7798d90f0425ed41b3f"});
        
        const cls_sub = await Class_Subject.findOne({
            "class": cls._id
        }).populate('class').populate('subjects');

        try{
            cls_sub.subjects.push(subject._id);
            //await cls_sub.save();
        }catch(e){
            console.log(e);
        }
        // await cls_sub.save();

        // console.log("class: "+ cls_sub );
        // console.log("subject: "+ subject );
    });

    //const cls_subs = await Class_Subject.find({});

    const cls_subs = await Class_Subject.find({})
            .populate('class')
            .populate({path: 'subjects', model: Subject});

            // .populate('subjects');
            // .populate({path:'class', populate: {path:'subjects', model: 'Subject'}});
            // .populate({path:'subjects', model: 'Subject'});
            // console.log(cls_subs);
    

    const sections = await Section.find({});

    const cls_secs = await Class_Section.find({}).populate('sectionId').populate('classId');
    // const cls_subs = await Class_Subject.find({}).populate('subjects').populate('class');
    // console.log("Class-Sections:" + cls_secs   );
    // console.log("Class-Subjects: "+ cls_subs);

    const weekdays = await Weekday.find({}).sort({ 'day_id': 1});
    const Subjects = await Subject.find({});
    const Teachers = await Teacher.find({});

    const schedules = await Schedule.find({})
        .populate('session')
        .populate('weekday')
        .populate('class')
        .populate('section')
        .populate('subject')
        .populate('teacher')
        ;

    // console.log(JSON.stringify(schedules) );
    // console.log(schedules );

    res.render('ejs/pages/index', {
        weekdays,
        Subjects,
        Teachers,
        schedules,
        "cls_sections": cls_secs,
        "cls_subjects": cls_subs
    });

    // res.sendFile('./views/ejs/test.html', {root: __dirname});

});

app.post('/ajax', async (req,res)=>{
    // console.log("ajax submit:"+ JSON.stringify(req.body) );
    // console.log("ajax submit:"+ req.body.subject_id);
    console.log("ajax submit: "+ req.body.id);

    const session = await Session.findOne({name: 2022});
    // console.log("Session: "+session);

    
    if(req.body.id != ''){
        console.log('Not Null');

        const schedule = await Schedule.findOne({
            _id: req.body.id
        });
        if(req.body.subject_id == '' && req.body.teacher_id == ''){
            await schedule.remove();
        }else{
            schedule.weekday = req.body.wkday_id;
            schedule.class = req.body.class_id;
            schedule.section = req.body.section_id;
            schedule.period_no = req.body.period_id;
            schedule.subject = req.body.subject_id;
            schedule.teacher = req.body.teacher_id;
            await schedule.save();
        }        
        // console.log("update: "+schedule);

    }else{
        console.log('Null');
        const schedule = new Schedule({
            "session": session._id
        });

        schedule.weekday = req.body.wkday_id;
        schedule.class = req.body.class_id;
        schedule.section = req.body.section_id;
        schedule.period_no = req.body.period_id;
        schedule.subject = req.body.subject_id;
        schedule.teacher = req.body.teacher_id;
        await schedule.save();
        // console.log("created:"+schedule);
    }
    // const schedule = new Schedule({
    //     "session": session._id
    // });
    // console.log("Schedule: "+schedule);    
    // schedule.session = session._id
    // schedule.weekday = req.body.wkday_id;
    // schedule.class = req.body.class_id;
    // schedule.section = req.body.section_id;
    // schedule.period_no = req.body.period_id;
    // schedule.subject = req.body.subject_id;
    // schedule.teacher = req.body.teacher_id;

    

    // console.log(schedule);



    res.send({
        "response":"submit ajax success",
        "message": JSON.stringify(req.body)
    });
});










// Any root, not matched.
app.use((req, res, next)=>{
    next(createError.NotFound('Page not found!'));
});

// It will be Hitted, whenever next() arrive with an 'error' object
app.use((err, req, res, next)=>{
    res.status(err.status || 500);
    res.send({error: {
        status: err.status || 500,
        message: err.message
    }});
});


// Listening port at server end
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`I am listening from port no ${PORT} on http://localhost:${PORT}/test`);
});