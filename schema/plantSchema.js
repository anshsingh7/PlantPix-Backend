import mongoose from 'mongoose';

const PlantsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    scientificName:{
        type: String,
        required: true
    },
    native:{
        type: Boolean,
    },
    Region:{
        type : [String],
    },
    slug:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount:{
        type: Number,
    },
    category:[{
        type: mongoose.ObjectId,
        ref: 'Category'
    }],
    photo:{
        data:Buffer,
        contentType: String
    },
},{timestamps: true})

export default mongoose.model('Plants', PlantsSchema)