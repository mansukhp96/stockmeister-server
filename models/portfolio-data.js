import mongoose from "mongoose";

const porfolioSchema = mongoose.Schema({
    id : { type : String },
    traderId : { type : String },
    currentValue : { type : Number },
    updatedOn : { type : Date },
    stocks : [{
        ref : "stocksData"
    }]
});

export default mongoose.model('portfolioData', portfolioSchema);