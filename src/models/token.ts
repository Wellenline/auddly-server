import { getModelForClass, prop, Ref, ReturnModelType } from "@typegoose/typegoose";
import { AuthProvider, User, UserModel } from "./user";
import { sign, verify } from "jsonwebtoken";
import moment from "moment";
import { randomBytes } from "crypto";
import { HttpException, HttpStatus } from "@wellenline/via";

export class Token {
	public static async generate(this: ReturnModelType<typeof Token>, options: {
		id?: string,
		provider?: AuthProvider,
		scopes: string[],
	}) {

		const payload = {};
		const data = Object.assign(payload, options);

		const access_token = sign({ payload: data }, process.env.JWT_SECRET as string, {
			expiresIn: "3460s",
		});

		const token = {
			token_type: "bearer",
			id: options.id,
			access_token,
			expires_at: moment().add(1, "day").unix(),
			refresh_token: randomBytes(64).toString("hex"),
		};

		await TokenModel.create({
			created_by: options.id,
			created_at: new Date(),
			...token,
		});

		return token;
	}

	public static async generateNew(this: ReturnModelType<typeof Token>, access_token: string, refresh_token: string) {
		const exists = await this.findOne({ refresh_token });

		if (!exists) {
			throw new HttpException("Invalid refresh token", HttpStatus.NOT_FOUND);
		}

		const base64Url = exists.access_token.split(".")[1];
		const data = JSON.parse(Buffer.from(base64Url, "base64").toString());

		await exists.remove();
		return await this.generate(data.payload);
	}

	public static async verify(this: ReturnModelType<typeof Token>, access_token: string) {
		const data: any = verify(access_token, process.env.JWT_SECRET as string);

		if (!data) {
			throw new HttpException("Unauthorized");
		}

		const exists = await TokenModel.findOne({ access_token });

		if (!exists) {
			throw new HttpException("Invalid access token");
		}

		return data;
	}

	public static async findAccessToken(this: ReturnModelType<typeof Token>, access_token: string) {
		return this.findOne({ access_token });
	}

	@prop()
	public access_token: string;

	@prop()
	public refresh_token: string;

	@prop({ ref: "User" })
	public created_by: Ref<User>;

	@prop()
	public expires_in: number;

	@prop()
	public created_at: Date;

}

export const TokenModel = getModelForClass(Token);
