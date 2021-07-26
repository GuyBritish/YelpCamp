const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
	type: "string",
	base: joi.string(),
	messages: {
		"string.escapeHTML": "{{#label}} must not include HTML!",
	},
	rules: {
		esccapeHTML: {
			validate(value, helpers) {
				const clean = sanitizeHtml(value, {
					allowedTags: [],
					allowedAttributes: {},
				});

				if (clean != value) return helpers.error("string.escapeHTML", { value });
				return clean;
			},
		},
	},
});

const Joi = BaseJoi.extend(extension);

module.exports.campSchema = Joi.object({
	newCamp: Joi.object({
		title: Joi.string().required().esccapeHTML(),
		price: Joi.number().required().min(0),
		//image: Joi.string().required(),
		location: Joi.string().required().esccapeHTML(),
		description: Joi.string().required().esccapeHTML(),
	}).required(),
	delImg: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
	newReview: Joi.object({
		rating: Joi.number().required().min(1).max(5),
		body: Joi.string().required().esccapeHTML(),
	}).required(),
});
