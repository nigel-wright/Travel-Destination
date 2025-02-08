const User = require("../models/user.model");
const Review = require("../models/review.model");

// Testing version
exports.test = function(req, res) {
  res.send("Greetings from the Test controller!");
};

// Used to find all users in the DB and their admin privilages
exports.get_privileges = async function(req, res) {
  try {
    const users = await User.find({}, { username: 1, isAdmin: 1, _id: 1 }); 

    console.log("HI")
    if (!users) {
      return res.status(404).json("There are no current users")
    }

    res.status(200).json(users); 
  } catch (error) {
    console.error("Error fetching usernames:", error);
    res.status(500).json({ message: "Error fetching usernames", error });
  }
}

// Used to set new admin privileges\
exports.set_privileges = async function(req, res) {
  try {
    const { id } = req.body;

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json("this user cannot be found!")
    }

    user.isAdmin = !user.isAdmin
    await user.save()
    res.status(200).json("The users privilages have been changed!")
  } catch (err) {
    console.log("there was an error when setting privileges")
    res.status(500).json("Error when setting admin privilages")
  }
}

// Used to set the reviews visibility
exports.set_review = async function(req, res) {
  try {
    const { id } = req.body; 

    const review = await Review.findById(id);

    if (!review) {
      res.status(404).json("cannot find the review!"); 
    }

    review.hidden = !review.hidden
    await review.save();
    res.status(200).json({review, message: "The review change has been success!"})
  } catch (err) {
    console.log("Error changing the review"); 
    res.status(500).json("Error when changing the visibility of a review!")
  }
}

// Used for mark a user as “disabled” or clear
exports.get_disabled = async function(req, res) {
  try {
    const users = await User.find({}, { username: 1, isDisabled: 1, _id: 1 }); 

    if (!users) {
      return res.status(404).json("There are no current users")
    }

    res.status(200).json(users); 
  } catch (error) {
    console.error("Error fetching usernames:", error);
    res.status(500).json({ message: "Error fetching usernames", error });
  }
}

exports.set_disabled = async function(req, res) {
  try {
    const { id } = req.body;

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json("this user cannot be found!")
    }

    console.log("user b4 is: ", user)

    user.isDisabled = !user.isDisabled
    await user.save()

    console.log("user after is: ",user)
    res.status(200).json("The users has been disabled!")
  } catch (err) {
    console.log("there was an error when setting users disablility")
    res.status(500).json("Error when disableing/enabling a user!")
  } 
}


