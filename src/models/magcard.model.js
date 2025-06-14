import mongoose from "mongoose";

const magcardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    pdfurl: {
        type: String,
        required: true
    },
    imgurl: {
        type: String,
        required: true
    },
    likes:{
        type:Number,
        default:0
    },
    views:{
        type:Number,
        default:0
    }

});

export default mongoose.model('magcarddata', magcardSchema);
