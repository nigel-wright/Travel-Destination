const mongoose = require('mongoose');

const ListInfoSchema = new mongoose.Schema({
  destination: { 
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  approximateAnnualTourists: { 
    type: String
  },
  currency: {
    type: String
  },
  majorityReligion: {
    type: String
  },
  famousFoods: { 
    type: [String] // Array of famous foods
  },
  language: {
    type: String
  },
  bestTimeToVisit: {
    type: String
  },
  costOfLiving: {
    type: String
  },
  safety: {
    type: String
  },
  culturalSignificance: {
    type: String
  },
  description: { // Changed from 'Descriptio' (assuming it's a typo)
    type: String
  }
});

module.exports = mongoose.model('ListInfo', ListInfoSchema);