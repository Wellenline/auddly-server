import { Resource, Post, Context, IContext, Before, Get, HttpStatus, HttpException } from "@wellenline/via";

import moment from "moment";
import cookie from "cookie";

import { AuthProvider, UserModel } from "../models/user";
import { Validator } from "../middleware/validator";
import { AuthSchema } from "../middleware/schemas/auth";
import { TokenModel } from "../models/token";


@Resource("/auth")
export class Auth {

	@Get("/flush")
	public async flush(@Context() context: IContext) {
		context.res.setHeader("Set-Cookie", cookie.serialize("token", "", {
			expires: new Date(1),
			secure: false,
			httpOnly: true,
			path: "/",
		}));

		return {
			status: true,
		};
	}

	@Post("/")
	@Before(Validator.validate(AuthSchema.authenticate))
	public async authenticate(@Context() context: IContext) {
		const token = await UserModel.authenticate(context.body);

		context.res.setHeader("Set-Cookie", cookie.serialize("token", token.access_token, {
			expires: moment().add(1, "d").toDate(),
			secure: false,
			httpOnly: true,
			path: "/",
		}));

		return token;

	}

	@Post("/refresh")
	public async refresh(@Context() context: IContext) {
		return await TokenModel.generateNew(context.body.access_token, context.body.refresh_token);
	}

	@Post("/password")
	@Before(Validator.validate(AuthSchema.password))
	public async password(@Context() context: IContext) {
		return await UserModel.password(context.body.code, context.body.password);
	}

	@Get("/connect")
	public async connect(@Context() context: IContext) {
		return {
			connected: true,
		};
	}
}
