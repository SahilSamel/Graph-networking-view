import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    let {token} = req.cookies;

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified;
    next(); // Call next() to move to the next middleware/route handler
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default verifyToken