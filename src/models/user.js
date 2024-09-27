import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number.'],
    },
    password: {
        type: String,
        required: true,
    },
    notes: [{ type: Schema.Types.ObjectId, ref: 'Notes' }]
}, { timestamps: true });


// Check if the model already exists
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
