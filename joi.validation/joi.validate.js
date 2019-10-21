"use strict";

const Joi = require("joi");

function validate(path) {
	return function (schema) {
		if (schema == null)
			throw "Schema should not be empty";
		// if ( schema instanceof Joi.object )

		
		return function (req, res, next) {
			const body = req[path];
			const response = Joi.validate(body, schema, { abortEarly: false });
			if (response.error)
				return next(response.error)
			req[path] = response.value;
			return next();
		};
	};
}

module.exports = validate;

module.exports.body = validate("body");

module.exports.query = validate("query");

module.exports.params = validate("params");
