import mongoose from 'mongoose';

const ParticipantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name.'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    college: {
        type: String,
        required: [true, 'Please provide a college name.'],
    },
    academicYear: {
        type: String,
        required: [true, 'Please provide an academic year.'],
    },
    foodItem: {
        type: String,
        required: [true, 'Please specify food preference.'],
    },
    whatsapp: {
        type: String,
        required: [true, 'Please provide a WhatsApp number.'],
    },
    token: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lunch: {
        type: Boolean,
        default: false,
    },
    dinner: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.models.Participant || mongoose.model('Participant', ParticipantSchema);
