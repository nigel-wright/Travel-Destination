const mongoose = require('mongoose');
const ListInfo =  require('./list-info.model');
const Reviews = require('./review.model');


const ListSchema = new mongoose.Schema(
  {
    listName: { type: String, required: true, unique: true },
    owner: { type: String, required: true },
    noOfDestinations : { type: Number, default: 0 },
    rating: { type: Number, min: 0, max:5, default: 0 },
    dLastModified: { type: Date, default: Date.now },
    description: { type: String },
    visibility: { type: Boolean, default: false},
    review: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reviews', default: []}],
    destinations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ListInfo' }]
  }, 
  { collection: "public_lists" }
);

module.exports = mongoose.model('List', ListSchema);