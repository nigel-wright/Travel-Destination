const Policy = require("../models/policy.model");
const AUPPolicy = require("../models/aup.model");
const DCMAPolicy = require("../models/dcma.model");
const List =  require('../models/list.model');
const ListInfo = require('../models/list-info.model');
const Fuse = require('fuse.js');
const Joi = require("joi");

// Testing version
exports.test = async function(req, res) {
    res.send("Greetings from the Test controller!");
  };

// Joi schema for validating input
const searchSchema = Joi.object({
  name: Joi.string()
    .trim()
    .optional()
    .allow("") // Allow empty strings
    .regex(/^[\p{L}\p{N}\s.,!?'-]+$/u)
    .messages({
      "string.pattern.base": "List name can only contain letters, numbers, spaces, and basic punctuation.",
      "string.empty": "Name cannot be empty.",
    }), 
  region: Joi.string()
    .trim()
    .optional()
    .allow("") // Allow empty strings
    .regex(/^[\p{L}\p{N}\s.,!?'-]+$/u)
    .messages({
      "string.pattern.base": "Region can only contain letters, numbers, spaces, and basic punctuation.",
      "string.empty": "Region cannot be empty.",
    }),
  country: Joi.string()
    .trim()
    .optional()
    .allow("") // Allow empty strings
    .regex(/^[\p{L}\p{N}\s.,!?'-]+$/u)
    .messages({
      "string.pattern.base": "Country can only contain letters, numbers, spaces, and basic punctuation.",
      "string.empty": "Country cannot be empty.",
    })
})

// Search functionality
exports.search = async function (req, res) {
  const { name, region, country } = req.query;
  const destinations = req.destinations; 

  const { error } = searchSchema.validate({ name, region, country });

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (!name && !region && !country) {
    return res.status(200).send(destinations)
  }

  try {
    // Build the search query based on available parameters
    let results = [];
    if (name) {
      console.log("name is: ", name);
      const fuse = new Fuse(destinations, {
        keys: ['Destination'],
        threshold: 0.3,
      });
      results = results.concat(fuse.search(name).map(result => result.item));
    }

    // Further filter by region if provided
    if (region) {
      console.log("region is: ", region);
      const fuse = new Fuse(destinations, {
        keys: ['Region'],
        threshold: 0.3,
      });
      results = results.concat(fuse.search(region).map(result => result.item));
    }

    // Further filter by country if provided
    if (country) {
      console.log("country is: ", country);
      const fuse = new Fuse(destinations, {
        keys: ['Country'],
        threshold: 0.3,
      });
      results = results.concat(fuse.search(country).map(result => result.item));
    }


    // Remove duplicates if multiple parameters match the same destination
    const uniqueResults = Array.from(new Set(results.map(item => JSON.stringify(item))))
                               .map(item => JSON.parse(item));

    if (uniqueResults.length === 0) {
      return res.status(404).send("There was no results for this search!")
    }
    res.status(200).json(uniqueResults);

  } catch (err) {
    res.status(500).send({"message":"There was an error: " + err})
  }
}

exports.available_list = async function (req, res) {
  try {
    const lists = await List.find({})
      .sort({ dLastModified: -1 });
    if (lists.length === 0) {
      return res.status(400).json("There are currently no lists!")
    }
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving public lists", error });
  }
}

exports.list_details = async function (req, res) {
  try {
    const list = await ListInfo.findById(req.params.id);

    if (!list) {
      return res.status(404).json("List not found" );
    }
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving list details " +  error });
  }
}

exports.policy_info = async function (req, res) {
  try {
     const policies = await Policy.find({});
     const policy_array = policies.map(policy => policy.toObject());
     return res.status(200).json(policy_array);
  } catch (err) {
    res.status(500).send({"message":"There was an error: " + err})
  }
}

exports.aup_polify = async function (req, res) {
  try {
    const aup = await AUPPolicy.find({});
    const aup_array = aup.map(aups => aups.toObject());
    return res.status(200).json(aup_array);

 } catch (err) {
  res.status(500).send({"message":"There was an error: " + err})
 }
}

exports.dcma_policy = async function (req, res) {
  try {
     const dcma = await DCMAPolicy.find({});
     const dcma_array = dcma.map(dcmas => dcmas.toObject());
     return res.staus(200).json(dcma_array);
     
  } catch (err) {
    res.status(500).send({"message":"There was an error: " + err})
  }
}