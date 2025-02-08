const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true }
    },
    { collection: "policy_info" }
); 
  
module.exports = mongoose.model('Policy', PolicySchema);