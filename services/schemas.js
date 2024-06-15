const Joi = require('joi');

const passwordPattern = Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).required();

const userCreateRequestSchema = Joi.object({
  email: Joi.string().email().required(),
  password: passwordPattern,
  name: Joi.string().required(),
  googleId: Joi.string().optional(),
  isVerified: Joi.boolean().optional(),
  verificationToken: Joi.string().optional()
});

const userPatchRequestSchema = Joi.object({
  email: Joi.string().email().optional(),
  password: passwordPattern.optional(),
  name: Joi.string().optional(),
  googleId: Joi.string().optional(),
  isVerified: Joi.boolean().optional(),
  verificationToken: Joi.string().optional()
});

const userResponseSchema = Joi.object({
  _id: Joi.string().required(),
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  googleId: Joi.string().optional(),
  isVerified: Joi.boolean().optional(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional()
});

const koiCreateRequestSchema = Joi.object({
  name: Joi.string().required(),
  platform: Joi.string().required(),
  sex: Joi.string().valid('Male', 'Female', 'Other').required(),
  categories: Joi.array().items(Joi.string()).required(),
  tel: Joi.string().required(),
  link: Joi.string().uri().required(),
  followers: Joi.number().required(),
  photoCost: Joi.number().required(),
  videoCost: Joi.number().required(),
  er: Joi.string().required(),
  createdBy: Joi.string().required(),
  updatedBy: Joi.string().required() // New field
});

const koiPatchRequestSchema = Joi.object({
  name: Joi.string().optional(),
  platform: Joi.string().optional(),
  sex: Joi.string().valid('Male', 'Female', 'Other').optional(),
  categories: Joi.array().items(Joi.string()).optional(),
  tel: Joi.string().optional(),
  link: Joi.string().uri().optional(),
  followers: Joi.number().optional(),
  photoCost: Joi.number().optional(),
  videoCost: Joi.number().optional(),
  er: Joi.string().optional(),
  createdBy: Joi.string().optional(),
  updatedBy: Joi.string().required() // New field
});

const koiResponseSchema = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().required(),
  platform: Joi.string().required(),
  sex: Joi.string().valid('Male', 'Female', 'Other').required(),
  categories: Joi.array().items(Joi.string()).required(),
  tel: Joi.string().required(),
  link: Joi.string().uri().required(),
  followers: Joi.number().required(),
  photoCost: Joi.number().required(),
  videoCost: Joi.number().required(),
  er: Joi.string().required(),
  createdBy: Joi.string().required(),
  updatedBy: Joi.string().required(), // New field
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional()
});

module.exports = {
  userCreateRequestSchema,
  userPatchRequestSchema,
  userResponseSchema,
  koiCreateRequestSchema,
  koiPatchRequestSchema,
  koiResponseSchema
};
