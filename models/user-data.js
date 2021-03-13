import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    firstName : { type : String, required : true },
    lastName : { type : String, required : true },
    email : { type : String, required : true },
    password : { type : String, required : true },
    id : { type : String },

    followers : Number,
    following : Number,
    stockInterests : [String],

    createdAt : {
        type : Date,
        default : new Date()
    }
});

export default mongoose.model('userData', userSchema);