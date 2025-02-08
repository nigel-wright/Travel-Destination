const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract the token

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided!" });
    }

    try {
        const verified = jwt.decode(token, "my_private_key"); // Replace with your secret key
        req.user = verified; // Add user info to the request object
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid Token!" });
    }
};

exports.adminCheck = (req, res, next) => {
    console.log("user is: ", req.user)
    if (req.user && req.user.admin) {
      next(); // User is admin, proceed
    } else {
      res.status(403).send({ message: "Access denied: Admins only" });
    }
  };


