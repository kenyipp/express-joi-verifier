"use strict";

const express = require('express');
const Joi = require('joi');
const request = require('supertest');
const validate = require('./');

const joiSchema = Joi.object({
	foo: Joi.string().required(),
	bar: Joi.number()
});


/**
 * 
 * initialize express application
 * 
 */
const app = express();

app.use(require('body-parser').json());

app.get(
	'/params/:param',
	validate.params(Joi.object({ param: Joi.number() })),
	(req, res) => res.send(req.params)
);

app.get(
	'/query',
	validate.query(joiSchema),
	(req, res) => res.send(req.query)
);

app.post(
	'/body',
	validate.body(joiSchema),
	(req, res) => res.send(req.body)
);

describe('Validate Schema', () => {
	it('expect to throw error if schema is not supply', function () {
		expect(() => { validate.body() }).toThrow();
	});
	it('expect to throw error if non joi object is given as schema', function () {
		expect(() => { validate.body({ hello: 'world' }) }).toThrow();
	});
});

describe('Validate query', () => {

	it('expect to throw if no query string has passed', async () =>
		await request(app).get('/query').expect(500)
	);

	it('expect to throw if unknown query string has passed', async () =>
		await request(app).get('/query?foo=bar&unknown=foo').expect(500)
	);

	it('expect to throw if required query string hasn\'t pass', async () => {
		await request(app).get('/query?bar=123').expect(500);
	});

	it('expect to throw if wrong query string has given', async () => {
		await request(app).get('/query?foo=bar&bar=foo').expect(500);
	});

	it('expect to pass if optional query string hasn\'t pass', async () => {
		const response = await request(app).get('/query?foo=bar').expect(200);
		expect(typeof response.body.foo).toBe('string');
	});

	it('expect to pass if correct query string given', async () => {
		const response = await request(app).get('/query?foo=bar&bar=123').expect(200);
		expect(typeof response.body.foo).toBe('string');
		expect(typeof response.body.bar).toBe('number');
	});
});

describe('Validate body', () => {

	it('expect to throw if no body has passed', async () =>
		await request(app).post('/body').expect(500)
	);

	it('expect to throw if unknown body attribute has passed', async () =>
		await request(app).post('/body').send({ foo: 'bar', 'hello': 'world' }).expect(500)
	);

	it('expect to throw if required body hasn\'t pass', async () => {
		await request(app).post('/body').send({ bar: 123 }).expect(500);
	});

	it('expect to throw if wrong body has given', async () => {
		await request(app).post('/body').send({ foo: 'bar', bar: 'foo' }).expect(500);
	});

	it('expect to pass if optional body hasn\'t pass', async () => {
		const response = await request(app).post('/body').send({ foo: 'bar' }).expect(200);
		expect(typeof response.body.foo).toBe('string');
	});

	it('expect to pass if correct body json given', async () => {
		const response = await request(app).post('/body').send({ foo: 'bar', bar: 123 }).expect(200);
		expect(typeof response.body.foo).toBe('string');
		expect(typeof response.body.bar).toBe('number');
	});
});


describe('Validate params', () => {

	it('expect to throw if wrong params has given', async () => {
		await request(app).get('/params/hello').expect(500);
	});

	it('expect to pass if correct params has given', async () => {
		await request(app).get('/params/123').expect(200);
	});
});
