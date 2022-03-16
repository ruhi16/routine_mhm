const { required } = require('@hapi/joi/lib/base');
const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
    name: {type:String, required: true},
    dise: {type:String, required: true},

    pin: {type:String},
    ps:  {type:String},
    po: {type:String},
    location: [{type:String}],    
    dist: {type:String},
    state: {type:String},    

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

const School = mongoose.model('School', schoolSchema);




const sessionSchema = new mongoose.Schema({
    name: {type:String, required: true},     
    desc: {type:String},

    status: {type:String},
    index: {type: Number},
    dise_code: {type:String},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

const Session = mongoose.model('Session', sessionSchema);



const classSchema = new mongoose.Schema({
    name: {type:String, required: true},     
    desc: {type:String},

    status: {type:String},
    index: {type: Number},
    dise_code: {type:String},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

const Class = mongoose.model('Class', classSchema);



const sectionSchema = new mongoose.Schema({
    name: {type:String, required: true},     
    desc: {type:String},

    status: {type:String},
    index: {type: Number},
    dise_code: {type:String},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

const Section = mongoose.model('Section', sectionSchema);



const roomSchema = new mongoose.Schema({
    name: {type:String, required: true},  
    floor: {type:String},  
    noofbench: {type:Number},  
    desc: {type:String},

    status: {type:String},
    index: {type: Number},
    dise_code: {type:String},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

const Room = mongoose.model('Room', roomSchema);



const subjectSchema = new mongoose.Schema({
    name: {type:String, required: true},     
    shortName: {type:String, required: true}, 
    status: {type:String},    
    desc: {type:String},

    status: {type:String},
    index: {type: Number},
    dise_code: {type:String},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});
const Subject = mongoose.model('Subject', subjectSchema);



const weekdaySchema = new mongoose.Schema({
    name: {type: String, required: true},     
    shortName: {type: String, required: true}, 
    day_id: {type: Number, required: true},
    periods: {type: Number, required: true},
    tiffin:  {type: Number, required: true},       
    desc: {type: String},

    status: {type:String},
    index: {type: Number},
    dise_code: {type:String},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});
const Weekday = mongoose.model('Weekday', weekdaySchema);


const scheduleSchema = new mongoose.Schema({
    session: {type: mongoose.Schema.Types.ObjectId, ref: 'Session'},
    weekday: {type: mongoose.Schema.Types.ObjectId, ref: 'Weekday'},
    class: {type: mongoose.Schema.Types.ObjectId, ref: 'Class'},
    section: {type: mongoose.Schema.Types.ObjectId, ref: 'Section'},
    period_no: {type: Number, required: true},
    subject: {type: mongoose.Schema.Types.ObjectId, ref: 'Subject'},
    teacher: {type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'},

    status: {type:String},
    index: {type: Number},
    dise_code: {type:String},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});
const Schedule = mongoose.model('Schedule', scheduleSchema);




const teacherSchema = new mongoose.Schema({
    name: {type: String, required: true},
    shortName: {type: String, required: true},
    desig: {type: String},

    section: {type: String },
    teacher_id: {type: String, required: true},
    
    fav_subjects: [{type: mongoose.Schema.Types.ObjectId, ref: 'Subject'}],
    
    status: {type:String},
    index: {type: Number},
    dise_code: {type:String},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});
const Teacher = mongoose.model('Teacher', teacherSchema);


const provisionalSchema = new mongoose.Schema({
    curr_date: { type: Date, default: Date.now },
    weekday: {type: mongoose.Schema.Types.ObjectId, ref: 'Weekday'},
    who_auth: {type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'},
    no_of_periods: {type: Number, required: true},
    absentees: [{
        teacher:  {type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'},
        reason: {type: String, required: true},
        periods: [{
            class: {type: mongoose.Schema.Types.ObjectId, ref: 'Class'},
            section: {type: mongoose.Schema.Types.ObjectId, ref: 'Section'},
            subject: {type: mongoose.Schema.Types.ObjectId, ref: 'Subject'},
            period_no : {type: Number, required: true},
            prov_teacher: {type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'}
        }]
    }]
});
const Provisional = mongoose.model('Provisional', provisionalSchema);


const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},

    status: {type:String},
    index: {type: Number},
    dise_code: {type:String},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});
const User = mongoose.model('User', userSchema);




//=========================================================================
const class_sectionSchema = new mongoose.Schema({
    classId: {type: mongoose.Schema.Types.ObjectId, ref: 'Class'},
    sectionId: {type: mongoose.Schema.Types.ObjectId, ref: 'Section'},
    
    status: {type:String},
    index: {type: Number},
    dise_code: {type:String},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});
const Class_Section = mongoose.model('Class_Section', class_sectionSchema);


const class_subjectSchema = new mongoose.Schema({
    class: {type: mongoose.Schema.Types.ObjectId, ref: 'Class'},
    subjects: [{type: mongoose.Schema.Types.ObjectId, ref: 'Subject'}],
    
    status: {type:String},
    index: {type: Number},
    dise_code: {type:String},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});
const Class_Subject = mongoose.model('Class_Subject', class_subjectSchema);


const teacher_subjectSchema = new mongoose.Schema({
    teacher: {type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'},
    subjects: [{type: mongoose.Schema.Types.ObjectId, ref: 'Subject'}],
    
    status: {type:String},
    index: {type: Number},
    dise_code: {type:String},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});
const Teacher_Subject = mongoose.model('Teacher_Subject', teacher_subjectSchema);


//=========================================================================







//const School = mongoose.model('School', schoolSchema);
module.exports = {
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
    Provisional,
    User
}
