import Joi from "joi";
import { IContext, HttpException, HttpStatus } from "@wellenline/via";
export class Validator {

	/**
	 * It takes a Joi schema, validates the request body against it, and if it passes, it assigns the
	 * validated result to the request body
	 * @param schema - Joi.ObjectSchema - This is the Joi schema that you want to validate the request
	 * body against.
	 * @returns A function that takes a context and returns a boolean.
	 */
	public static validate(schema: Joi.ObjectSchema) {
		return async (context: IContext) => {
			try {
				// asign validated result to body
				const values = await schema.validateAsync(context.req.body, { stripUnknown: true, });

				const keys = Object.keys(values);
				const payload: any = {};

				keys.filter((key) => {
					return values[key] !== undefined && values[key] !== null && values[key] !== null && values[key].length !== 0;
				}).map((key) => {
					payload[key] = values[key];
				});

				context.body = payload;


				return true;
			} catch (err: any) {
				throw new HttpException(err.toString(), HttpStatus.BAD_REQUEST);
			}
		};
	}
}
