import { IContext, HttpStatus, app, HttpException } from "@wellenline/via";
import { IncomingForm } from "formidable";

/**
 * Basic cors module
 * @param context request
 */
export const cors = async (context: IContext) => {
	app.headers = {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "OPTIONS, DELETE, PUT, PATCH, POST, GET",
		"Access-Control-Max-Age": 2592000,
		"Access-Control-Allow-Headers": "*",
	};

	if (context.req.method === "OPTIONS") {
		context.res.writeHead(204, app.headers);
		return context.res.end();
	}

	return true;

};

/**
 * Simple body parser
 * @param context request
 */
export const bodyParser = async (context: IContext) => {
	return await new Promise((resolve, reject) => {
		const form = new IncomingForm();
		form.maxFields = 500;
		form.maxFieldsSize = 2 * 1024 * 1024;
		form.parse(context.req, (err, fields, files) => {
			context.req.files = files;
			context.req.body = fields;

			context.files = files;
			context.body = fields;

			resolve(true);
		});
	});

};

export const auth = (whitelist: string[]) => {
	return (context: IContext) => {
		if (process.env.API_KEY && process.env.API_KEY.length > 0) {
			if (whitelist.some((v) => context.req.parsed.path.indexOf(v) > -1)) {
				return true;
			}

			const api_key = context.req.headers["x-api-key"] || context.req.query.key;
			if (!api_key) {
				throw new HttpException("API key missing", HttpStatus.UNAUTHORIZED);
			}

			if (process.env.API_KEY !== api_key.toString()) {
				throw new HttpException("Invalid API key", HttpStatus.UNAUTHORIZED);
			}

			return true;
		}

		return true;

	};

};
