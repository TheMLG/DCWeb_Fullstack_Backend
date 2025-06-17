import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
    count: { type: Number, default: 0 },
});

const Visitor = mongoose.model('Visitor', visitorSchema);

const initializeVisitorCount = async () => {
    const visitor = await Visitor.findOne({});
    if (!visitor) {
        const newVisitor = new Visitor();
        await newVisitor.save();
    }
};
initializeVisitorCount();

export default Visitor;