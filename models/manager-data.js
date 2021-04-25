import mongoose from "mongoose";

const managerSchema = mongoose.Schema({
    id : { type : String },
    accountType : { type : String },
    firstName : { type : String, required : true },
    lastName : { type : String, required : true },
    experience : { type : String },
    email : { type : String, required : true },
    password : { type : String, required : true },
    joinedOn : { type : Date },
    imageUrl : { type : String },
    interests : { type : Array },
    phoneNumber : { type : Number },
    address : { type : String },
    clients : { type : Array }
});

export default mongoose.model('managerData', managerSchema);