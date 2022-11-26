const jwt = require("jsonwebtoken");
const logger = require("./logger");
const User = require("../models/user");

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  switch (error.name) {
    case "CastError":
      return response.status(400).send({ error: "malformatted id" });
    case "ValidationError":
      return response.status(400).json({ error: error.message });
    case "JsonWebTokenError":
      return response
        .status(401)
        .json({ error: "Invalid token: " + error.message });
    default:
      break;
  }
  next(error);
};

const userExtractor = async (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    const decodedToken = jwt.verify(
      authorization.substring(7),
      process.env.SECRET
    );
    if (decodedToken) {
      request.user = await User.findById(decodedToken.id);
    }
  }
  next();
};

module.exports = { errorHandler, userExtractor };
