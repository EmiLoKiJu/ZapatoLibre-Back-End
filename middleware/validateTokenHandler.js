const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const validateToken = asyncHandler( async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(" ")[1];
    console.log('token not verified yet: ', token);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error('User is not authorized');
      }
    req.user = decoded.user;
    console.log(req.user);
    next();
    });
    if (!token) {
      res.status(401);
      throw new Error('User is not authorized or token is missing');
    }
  } else {
    res.status(401);
    throw new Error('token is missing');
  }
});

module.exports = validateToken;
