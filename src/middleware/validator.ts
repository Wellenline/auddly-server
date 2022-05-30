import Joi from "joi";
import { IContext, HttpException, HttpStatus } from "@wellenline/via";

export class Validator {

	/**
	 * Validate Requests
	 * @param  {IRequest} req
	 * @param  {IResponse} res
	 * @param  {Function} next
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
