import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    id : { type : String },
    accountType : { type : String },
    firstName : { type : String, required : true },
    lastName : { type : String, required : true },
    gender : { type : String },
    email : { type : String, required : true },
    password : { type : String, required : true },
    joinedOn : { type : Date },
    imageUrl : { type : String },
    interests : { type : Array },
    phoneNumber : { type : Number },
    address : { type : String },
    bankAccount : { type : String },
    followers : { type : Array },
    following : { type : Array },
    manager : {type : String}
});

export default mongoose.model('userData', userSchema);