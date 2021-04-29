import mongoose from "mongoose";

const stocksSchema = mongoose.Schema({
    id : { type : String },
    name : { type : String },
    quantity : { type : Number },
    currentValue : { type : Number },
    updatedOn : { type : Date }
});

export default mongoose.model('stocksData', stocksSchema);