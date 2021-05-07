import * as os from "os";
import { Resource, Get, Post, Context, IContext, HttpException } from "@wellenline/via";

@Resource("/connect")
export class Connect {
	@Post("/")
	public async connect(@Context() context: IContext) {
		const { endpoint, key } = context.body;

		if (process.env.API_KEY) {
			// check if key was provided
			if (!key) {
				return {
					connected: false,
					error: "Api key required but not provided"
				};
			}

			if (key !== process.env.API_KEY) {
				return {
					connected: false,
					error: "Invalid api key!"
				};
			}

			return {
				connected: true,
			};
		}

		return {
			connected: endpoint ? true : false,
		};
	}
}
