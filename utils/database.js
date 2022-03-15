const mongoose = require('mongoose');
const config = require('config');
// mongodbUri = "mongodb+srv://ruhi16:asdf1234@cluster0.yaizg.mongodb.net/digidurgapuja";  //production
// mongodbUri = "mongodb://localhost:27017/digidurgapuja";  //development localhost

mongodbUri = config.get('dbconn.mongodbURI');

console.log("Mongodb URI: "+mongodbUri);

const connectDb = async ()=>{
    try{
        await mongoose.connect(mongodbUri,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }catch(err){
        console.log(err.message);
    }
};

mongoose.connection.on('connected', ()=>{
    console.log('Mongoose connected to db....');
});

mongoose.connection.on('error', (error)=>{
    console.log('Mongoose connection errors....' + error.message);
});

mongoose.connection.on('disconnected', ()=>{
    console.log('Mongoose disconnected from db....');
});

process.on('SIGINT', async()=>{
    await mongoose.connection.close();
    process.exit(0);
});



module.exports = connectDb;
