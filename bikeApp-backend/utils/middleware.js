const logger = require("./logger");

const requestLogger = (request, response, next) => {
	logger.info("Request method: ", request.method);
	logger.info("Path: ", request.path);
	logger.info("Body: ", request.body);
	logger.info("---");
	next();
};

const unknownEndpoint = (request, response, next) => {
	response.status(404).send({
		error: "unknown endpoint",
	});
};

const errorHandler = (error, req, res, next) => {
	console.log(error);
	if (error.name === "MongoServerError") {
		return res.status(400).json({
			error: error.message,
		});
	}
	next(error);
};

module.exports = { requestLogger, unknownEndpoint, errorHandler };
