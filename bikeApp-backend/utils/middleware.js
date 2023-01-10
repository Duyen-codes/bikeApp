const errorHandler = (error, req, res, next) => {
	console.log(error);
	if (error.name === "MongoServerError") {
		return res.status(400).json({
			error: error.message,
		});
	}
	next(error);
};

module.exports = { errorHandler };
