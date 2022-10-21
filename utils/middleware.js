const jwt = require("jsonwebtoken");
const logger = require("./logger");
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  switch (error.name) {
    case "CastError":
      return response.status(400).send({ error: "malformatted id" });
    case "ValidationError":
      return response.status(400).json({ error: error.message });
    case "JsonWebTokenError":
      return response
        .status(400)
        .json({ error: "Invalid token: " + error.message });
    default:
      break;
  }
  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("Authorization");

  if (!authorization || !authorization.startsWith("Bearer "))
    return response
      .status(401)
      .json({ error: "Unauthorized:missing authorization token in Header" });

  request.token = authorization.substring(7);
  next();
};

const userExtractor = (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  if (!(request.token && decodedToken.id))
    return response.status(401).json({ error: "token missing or invalid" });

  request.user = { ...decodedToken };
  next();
};

module.exports = { errorHandler, tokenExtractor, userExtractor };
