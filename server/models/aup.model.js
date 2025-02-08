const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true }
    },
    { collection: "aup_policy" }
); 
  
module.exports = mongoose.model('AUPPolicy', PolicySchema);