const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Create a jwt token for a given user
const createToken = (user) => {
  return jwt.sign({
    userID: user._id, 
    creator: user.username, 
    email: user.emamil, 
    admin: user.isAdmin, 
  }, 
  "private_key", 
  {
    expiresIn: "1h", 
  });
};

// Testing version
exports.test = function(req, res) {
    res.send("Greetings from the Test controller!");
  };

// Used for login modal, and confirming that a user exists
exports.login = async function(req, res) {
  const { email, password } = req.body; 

  try {
    // Find the user in monogo db
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json("This email was not found!")
    }

    // Check to make sure the passwords match
    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      return res.status(400).json("Invalid password");
    }

    // create a token for login
    const token = createToken(user);

    // Send the resulting json back
    res.status(200).json({ token, message: "Login successful", user })

  } catch (err) {
    console.log("There was an error when logging in: ", err)
    res.send(500).json("There was an error with the log in!")
  }
}

// Used for register modal, and confirming that a user does not already exists
exports.register = async function(req, res) {
    try {
      const { username, password, email } = req.body;

      // Check if the email or username is already in use
      const isEmailTaken = await User.findOne({ email });
      if (isEmailTaken) {
        return res.status(409).json("There is already an account with this email address!");
      }

      const isUsernameTaken = await User.findOne({ username });
      if (isUsernameTaken) {
        return res.status(409).json("This username is already taken. Please choose another.");
      }

      // Hash the password as needed
      const hashedPassword = await bcrypt.hash(password,  await bcrypt.genSalt(10))

      // Create a user and assign it a jwt
      const user = await User.create({ username, password:hashedPassword, email }); 
    
      // Send the resulting json back
      res.status(200).json({ message:"User was registered", user, create: true})
    } catch (err) {
      console.log("There was an error when registering: " + err); 
      res.status(500).json("There was an error with the register!")
    }
}

// Used to verify an email for a given user
exports.verify_email = async function (req, res) {
  try {
    const { username, email } = req.body; 

    console.log("username is: ", username);
    console.log("email is: ", email);

    // Check to make sure an emailhas been inputed
    if (!email) {
      return res.status(400).json("Try putting an email!")
    }

    // Check to ensure the user is within the database
    const user = await User.findOne({ username }); 
    if (!user) {
      return res.status(404).json("This email cannot be verified!")
    }

    if (user.email !== email) {
      res.status(400).json("This email could not be verified!")
    }

    user.isVerified = true; 
    await user.save();
    res.status(200).json("The user was found, and email confrimed!")
  } catch (err) {
    console.log("The was an error when verifiying the email!")
    res.status(500).json("Error in email verification!")
  }
}

exports.change_password = async function (req, res) {
  try {
    const { username, password } = req.body;

    if (!password) {
      return res.status(400).json("Try input a password")
    }

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(404).json("This user cannot be found!")
    }

    // Check to make sure the passwords dont match
    const passMatch = await bcrypt.compare(password, user.password);
    if (passMatch) {
      return res.status(400).json("Try input a new password!");
    }


    user.password = await bcrypt.hash(password,  await bcrypt.genSalt(10))
    user.save()

    res.status(200).json("The user has now changed passwords!")

  } catch (err) {
    console.log("There was an error when changing passwords!")
    res.status(500).json("Error with the password change!")
  }
}
