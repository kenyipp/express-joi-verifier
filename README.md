# Express Joi Verifier
An express middleware for validate query, body and params using Joi Schema

## Usage
Use Express Joi Verifier to validate the body, query or params by Joi Schema and convert to the proper type.

validate query
```js
const Joi = require('joi');
const validate = require('express-joi-verifier');

const schema = Joi.object({ 
	foo: Joi.string(), 
	bar: Joi.number() 
});

app.get(
	'/:foo', 
	validate.params(schema),
	validate.query(schema),
	validate.body(schema),
	(req, res) => {
		return res.send({
			params: req.params,
			query: req.query,
			body: req.body,
		});
	}
)
```

## Test
We have provided 3 test cases for validate query, body and params.
```ssh
$ npm run test
```


