const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    rating: { type: Number, required: true, min: 0, max: 5 },
    comment: { type: String },
    dLastModified: { type: Date, default: Date.now },
    hidden: { type: Boolean, default: false}, 
  }
);

module.exports = mongoose.model('Reviews', ReviewSchema);