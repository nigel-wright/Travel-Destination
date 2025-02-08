const List =  require('../models/list.model');
const ListInfo = require('../models/list-info.model');
const Review = require('../models/review.model');
const reviewModel = require('../models/review.model');
const listInfoModel = require('../models/list-info.model');
const Joi = require("joi");

// Testing version
exports.test = function(req, res) {
    res.send("Greetings from the Test controller!");
  };

// Joi validation for `listName` and `description`
const listSchema = Joi.object({
  listName: Joi.string()
    .trim()
    .pattern(/^[\p{L}\p{N}\s.,!?'-]+$/u)
    .messages({
      "string.pattern.base": "List name can only contain letters, numbers, spaces, and basic punctuation.",
      "string.empty": "List name cannot be empty.",
    })
    .required(),
  description: Joi.string()
    .trim()
    .allow("") // Allow empty strings
    .pattern(/^[\p{L}\p{N}\s.,!?'-]+$/u)
    .messages({
      "string.pattern.base": "Description can only contain letters, numbers, spaces, and basic punctuation.",
      "string.empty": "Description cannot be empty.",
    })
    .optional(), // or .required() if you want it mandatory
});

// Used to post (create a list)
exports.create_list = async function(req, res) {
  try {
    const { listName, owner, description, destinations, visibility } = req.body;

    const { error } = listSchema.validate({ listName, description });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if the list already exists
    if (await List.findOne({ listName: listName })) {
      return res.status(409).json({ message: "There is already a list with this name!" });
    }

    if (await List.findOne({ listName: listName })) {
      return res.status(409).json({ message: "There is already a list with this name!" });
    }

    // Create ListInfo documents for each destination
    const destinationDocs = await Promise.all(
      destinations.map(async (dest) => {
        const newDestination = new ListInfo({
          destination: dest.Destination,
          region: dest.Region,
          country: dest.Country,
          category: dest.Category,
          latitude: Number(dest.Latitude),
          longitude: Number(dest.Longitude),
          approximateAnnualTourists: dest['Approximate Annual Tourists'],
          currency: dest.Currency,
          majorityReligion: dest['Majority Religion'],
          famousFoods: dest['Famous Foods']?.split(',').map(food => food.trim()), // Split foods into an array
          language: dest.Language,
          bestTimeToVisit: dest['Best Time to Visit'],
          costOfLiving: dest['Cost of Living'],
          safety: dest.Safety,
          culturalSignificance: dest['Cultural Significance'],
          description: dest.Description, 
      });
      return await newDestination.save(); // Save each destination
    })
  );

    // Create the List document with references to each destination's ID
    const newList = new List({
      listName,
      owner,
      noOfDestinations: destinationDocs.length,
      rating: 0,
      dLastModified: Date.now(),
      description: description || "",
      visibility: visibility,
      destinations: destinationDocs.map((dest) => dest._id)
    });

    const savedList = await newList.save(); // Save the main list

    // Return the newly created list with populated destinations
    const populatedList = await List.findById(savedList._id).populate('destinations');
    res.status(200).json("created list!");
  } catch (error) {
    console.error("Error creating list:", error);
    res.status(500).json({ message: "Error creating list", error });
  }
};

// Used to get a list
exports.get_list = async function(req, res) {
  try {
    const { id } = req.params.id; 

    const list = List.findById(id); 
    if (!list) {
      res.status(404).json("Could not find this list!")
    }

    res.status(200).json(list)
  } catch (err) {
    console.log("There was an error when getting this list: ", err); 
    res.status(500).json("There was an issue getting this list!")
  }
}

// Used when deleting a list
exports.delete_list = async function(req, res) {
  try {
    const { id, owner } = req.body; 

    const list = await List.findById(id);
    if (!list) {
      return res.status(404).json("Could not find the list.")
    }

    if (list.owner !== owner) {
      return res.status(401).json("You got here, but this is not your list to delete!")
    }


    // Delete the list
    await List.findByIdAndDelete(id);
    res.status(200).json("List deleted successfully" );
  } catch (err) {
    console.log("There was an error when deleting lists: ", err);
    res.status(500).json("Something went wrong when deleting this list. Try again later.")
  }
}

// Used to update a list that has been edited
exports.update_list = async function(req, res) {
  try {
    const { _id, listName, description, visibility } = req.body;

    const { error } = listSchema.validate({ listName, description });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Validate the list exists
    const list = await List.findById(_id);
    if (!list) {
      return res.status(404).json({ error: 'List not found.' });
    }

    // Update fields
    list.listName = listName || list.listName;
    list.description = description || list.description;
    list.visibility = visibility !== undefined ? visibility : list.visibility;
    list.dLastModified = Date.now();

    // Save updated list
    await list.save();

    res.status(200).json({ message: 'List updated successfully.' });
  } catch (err) {
    console.log("There was an error updating the list: ", err)
    res.status(500).json("There was an error updating the list.")
  }
}

// Used to add a destination to an already made list
exports.add_destination = async function (req, res) {
  try {
    const { id, workingList } = req.body;

    // Find the target list by ID
    const list = await List.findById(id).populate('destinations'); // Populate to get full destination objects
    if (!list) {
      res.status(404).json("Could not find the intended list!");
      return;
    }

    // Extract the names of existing destinations
    const existingDestNames = new Set(
      list.destinations.map((dest) => dest.destination.toLowerCase()) // Normalize to lowercase for comparison
    );

    // Filter workingList to exclude duplicates based on 'Destination' name
    const filteredWorkingList = workingList.filter(
      (dest) => !existingDestNames.has(dest.Destination.toLowerCase())
    );

    if (filteredWorkingList.length === 0) {
      res.status(400).json("No new destinations were added as they are already in the list.");
      return;
    }

    // Create ListInfo documents for filtered destinations
    const destinationDocs = await Promise.all(
      filteredWorkingList.map(async (dest) => {
        const newDestination = new ListInfo({
          destination: dest.Destination,
          region: dest.Region,
          country: dest.Country,
          category: dest.Category,
          latitude: Number(dest.Latitude),
          longitude: Number(dest.Longitude),
          approximateAnnualTourists: dest['Approximate Annual Tourists'],
          currency: dest.Currency,
          majorityReligion: dest['Majority Religion'],
          famousFoods: dest['Famous Foods']?.split(',').map((food) => food.trim()), // Split foods into an array
          language: dest.Language,
          bestTimeToVisit: dest['Best Time to Visit'],
          costOfLiving: dest['Cost of Living'],
          safety: dest.Safety,
          culturalSignificance: dest['Cultural Significance'],
          description: dest.Description,
        });
        return await newDestination.save(); // Save each new destination
      })
    );

    // Update the list with the combined destinations and new destination count
    list.destinations = [...list.destinations, ...destinationDocs.map((doc) => doc._id)];
    list.noOfDestinations = list.destinations.length;
    list.dLastModified = Date.now(); // Update the time of last modification

    await list.save(); // Save the updated list

    res.status(200).json("The list has been updated!");
  } catch (err) {
    console.log("There was an error when updating a list:", err);
    res.status(500).json(`Ran into an error when updating your list: ${err}`);
  }
};

// Used to remove a destination from an list
exports.remove_destination = async function (req, res) {
  try { 
    const { listID, destinationID } = req.body; 

    const listInfo = await ListInfo.findById(destinationID);
    if (!listInfo) {
      res.status(404).json("Could not find the desired list.")
      return; 
    }

    await ListInfo.findByIdAndDelete(destinationID)
    console.log("The list has been deleted!")

    const list = await List.findById(listID)
    if (!list) {
      res.status(404).json("Could not find the parent list.")
    }

     // Remove the reference from the destinations array
    list.destinations = list.destinations.filter(
      (dest) => dest.toString() !== destinationID
    );

    console.log("The dest list are: ", list.destinations)
    console.log("The ref. list has been updated!")

    list.noOfDestinations = list.destinations.length;
    console.log("Length is: ", list.noOfDestinations); 
    await list.save()

    res.status(200).json("This destination was delete from this list!")
  } catch (err) {
    console.log("There was an error when removing the destination: ", err)
    res.status(500).json("There was an errer when trying to remoce this destination!")
  }
}

// Used to add a review to a specific destination
exports.add_review = async function (req, res) {
  try {
    
    const { listName, rating, comment } = req.body; 
    const { error } = Joi.string().trim().regex(/^[\p{L}\p{N}\s.,!?'-]+$/u).messages({
      "string.pattern.base": "Comment can only contain letters, numbers, spaces, and basic punctuation.",
      "string.empty": "Comment cannot be empty.",
    }).validate(comment);

    if (error) {
      return res.status(400).json(error.details[0].message);
    }

    const list = await List.findOne({ listName: listName });
    
    if (!list) {
      return res.status(404).json("Could not find a list with that name.")
    }

    const review = new Review({
      rating: rating, 
      comment: comment, 
    })

    await review.save(); 

    // Push the new review's ID to the list's review array
    list.review.push(review._id);
    await list.save()

    // Calculate new average rating
    const populatedList = await List.findById(list._id).populate('review');

    const totalRatings = populatedList.review.reduce((sum, reviewItem) => sum + Number(reviewItem.rating), 0);
    list.rating = (totalRatings / populatedList.review.length).toFixed(2);
    await list.save()

    res.status(200).json("A review has been added successfully!")
  } catch (err) {
    res.status(500).json("There was an error when making a review on a list. " + err)
  }
}

// Used to get the review details!
exports.get_review = async function (req, res) {
  try {
    const review = await Review.findById(req.params.id); 

    if (!review) {
      return res.status(404).json("Cannot find this review");
    }

    res.status(200).json(review)
    console.log("Got the review!")
  } catch (err) {
    console.log("There was an error when getting the review!")
    res.status(500).json("Incurred an error when getting this review!")
  }
}