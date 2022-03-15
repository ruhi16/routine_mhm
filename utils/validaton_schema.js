const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi)

const registerSchema = Joi.object({
    firstname: Joi.string().min(3).max(30).required(),
    lastname: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).required(),
});

const updateSchema = Joi.object({
    _id: Joi.objectId(),
    firstname: Joi.string().min(3).max(30).required(),
    lastname: Joi.string().min(3).max(30).required(),    
});

const deleteSchema = Joi.object({
    _id: Joi.objectId(),    
});



const loginSchema = Joi.object({    
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).required(),
});


const ambulanceSchema = Joi.object({    
    inst_name: Joi.string().required(), 
    car_type: Joi.string().required(),
    car_model: Joi.string().required(),
    car_no: Joi.string().required(),
    base_addr_id: Joi.string(),
    dest_addr_id: Joi.array().items(Joi.string()),
    services: Joi.array().items(Joi.string()),
});


const addressSchema = Joi.object({ 
    pin: Joi.string().required(), 
    ps: Joi.string().required(), 
    po: Joi.string().required(), 
    dist: Joi.string().required(), 
    state: Joi.string().required(), 
});






module.exports = { registerSchema, updateSchema, deleteSchema, loginSchema, ambulanceSchema, addressSchema };