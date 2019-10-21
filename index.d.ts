import Joi from 'joi';
import Express from 'express';
import { userInfo } from 'os';

declare function body(schema: Joi.Schema): Express.RequestHandler;

declare function query(schema: Joi.Schema): Express.RequestHandler;

declare function params(schema: Joi.Schema): Express.RequestHandler;
