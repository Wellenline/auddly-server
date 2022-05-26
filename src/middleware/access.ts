import { TokenModel } from "@src/models/token";
import { IContext, HttpException, HttpStatus } from "@wellenline/via";
import cookie from "cookie";

/**
 * Extract access token from request
 * @param context Request context
 */
export const getAccessToken = (context: IContext) => {
	/// console.log(context.req.headers.cookie);

	const cookies = cookie.parse((context.req.headers.cookie as string) || "");
	let token: any;
	if (context.req.headers && context.req.headers.authorization) {
		token = context.req.headers.authorization.replace("Bearer ", "");
	} else if (context.req.query.access_token) {
		token = context.req.query.access_token;
		delete context.req.query.access_token;
	} else if (cookies && cookies.token) {
		token = cookies.token;
		// console.log("using http cookie");
	} else {
		token = false;
	}

	return token;
};

/**
 * Check if user has access to resource
 * @param permission string
 */
export const Can = (permission?: string) => {
	return async (context: IContext) => {
		const token = getAccessToken(context);

		const { payload } = await (TokenModel.verify(token) as any).catch((err: { message: string }) => {
			throw new HttpException(err.message, HttpStatus.UNAUTHORIZED);
		});

		if (typeof payload.scopes === "string") {
			payload.scopes = payload.scopes.split(",");
		}

		if (!payload.id) {
			throw new HttpException("Invalid payload", HttpStatus.BAD_REQUEST);
		}

		context.payload = payload;

		if (context?.payload?.scopes?.includes(permission)) {
			return true;
		}

		if (!permission) {
			return true;
		}

		throw new HttpException("You don't have access to this resource", HttpStatus.FORBIDDEN);

	};

};