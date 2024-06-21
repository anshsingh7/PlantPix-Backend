import mongoose from 'mongoose';

const familySchema = new mongoose.Schema({
    name:{
        type: String,
        // required: true,
        // unique: true
    },
    slug:{
        type: String,
        lowercase: true
    },
    
},{timestamps: true})

export default mongoose.model('Family', familySchema);