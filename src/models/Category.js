import mongoose from 'mongoose';

// In your Category model (models/Category.js)
const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'], // Add your possible status values
    default: 'active'  // Default value set in schema
  }
}, {
  timestamps: true
});

export default mongoose.model('Category', categorySchema);