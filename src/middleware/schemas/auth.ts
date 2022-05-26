import Joi from "joi";

export const AuthSchema = {
	authenticate: Joi.object().keys({
		provider: Joi.string().optional(),
		data: Joi.object().keys({
			email: Joi.string().email().optional().error(new Error("Make sure you entered a valid email address")),
			password: Joi.string().optional().error(new Error("Password is required")),
			code: Joi.string().optional().error(new Error("code is required")),
			state: Joi.string().optional().error(new Error("code is required")),
		})
	}),

	password: Joi.object().keys({
		password: Joi.string().required().min(8).alphanum().error(new Error("Please make sure your password is at least 8 characters and includes at least one uppercase/lowercase letter!")),
		id: Joi.string().required(),
	})
};

