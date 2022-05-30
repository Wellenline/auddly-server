import Joi from "joi";

export const UserSchema = {
	update: Joi.object().keys({
		first_name: Joi.string().optional(),
		picture: Joi.string().optional(),
		last_name: Joi.string().optional(),
		email: Joi.string().required(),
		role: Joi.string().optional(),
	}),

	create: Joi.object().keys({
		picture: Joi.string().optional(),
		email: Joi.string().email().required().error(new Error("Make sure you entered a valid email address")),
		password: Joi.string().required().min(8).alphanum().error(new Error("Please make sure your password is at least 8 characters and includes at least one uppercase/lowercase letter!")),
		first_name: Joi.string().optional(),
		last_name: Joi.string().optional(),
		role: Joi.string().required()
			.error(new Error("No role specified")),
	}),

};
