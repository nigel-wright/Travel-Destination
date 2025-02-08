const mongoose = require('mongoose');

const DCMASchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        destinationId: { type: String, required: true },
        destinationName: { type: String, required: true },
        dateRecRec: { type: Date },
        dateOfNoticeSent: { type: Date }, 
        dateDispRec: { type: Date } 
    },
    { collection: "dmca_policy" }
); 
  
module.exports = mongoose.model('DCMA', DCMASchema);