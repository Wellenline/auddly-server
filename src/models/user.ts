import { prop, Ref, pre, post, getModelForClass, ReturnModelType, DocumentType } from "@typegoose/typegoose";
import { HttpException, HttpStatus } from "@wellenline/via";
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import { randomBytes } from "crypto";
import moment from "moment";
import { Role, RoleModel } from "./role";
import { TokenModel } from "./token";
import { Types } from "mongoose";

export enum AuthProvider {
	email = "email",
}

export interface IAuthenticate {
	provider: AuthProvider;
	data: { email?: string, password?: string };
}

export interface ISignup {
	email: string;
	password: string;
	first_name?: string;
	last_name?: string;
	activated?: boolean;
	role?: string | Types.ObjectId;
}

@pre<User>("save", function (next) {
	if (this.created_at) {
		this.updated_at = new Date();
	} else {
		this.created_at = new Date();
		this.updated_at = new Date();
	}

	if (this.isModified("password") || this.isNew) {
		this.password = hashSync(this.password as string, genSaltSync());
	}

	next();
})
export class User {
	public static async authenticate(this: ReturnModelType<typeof User>, request: IAuthenticate) {
		const allowed_providers = [AuthProvider.email];

		if (!allowed_providers.includes(request.provider) || !request.data) {
			throw new HttpException("Invalid authentication provider", HttpStatus.BAD_REQUEST);
		}

		if (request.provider === AuthProvider.email) {
			const user = await this.findOne({ email: request.data.email }).select("password role email activated").populate("role");

			if (!user || !user.password) {
				throw new HttpException("Email address or password doesn't match any account!",
					HttpStatus.BAD_REQUEST);
			}

			// compare user password agains the stored hash
			const authorized = compareSync(request.data.password as string, user.password);

			if (!authorized) {
				throw new HttpException("Invalid password", HttpStatus.BAD_REQUEST);
			}

			return await TokenModel.generate({
				id: user._id.toString(),
				scopes: (user?.role as Role).scopes,
				provider: AuthProvider.email,
			});

		} else {
			throw new HttpException("Not implemented");
		}
	}

	public static async signup(this: ReturnModelType<typeof User>, request: ISignup) {
		const exists = await UserModel.findOne({ email: request.email.toLowerCase() }).select("email password");

		if (exists) {
			throw new HttpException("User already exists!", HttpStatus.BAD_REQUEST);
		}

		const role = await RoleModel.findById(request.role);

		if (!role) {
			throw new HttpException("Invalid role", HttpStatus.BAD_REQUEST);
		}

		const user = await UserModel.create({
			email: request.email.toLowerCase(),
			password: request.password,
			// password: hashSync(request.password, genSaltSync()),
			provider: AuthProvider.email,
			first_name: request?.first_name,
			last_name: request?.last_name,
			role: role._id,
			activated: request.activated,
			created_at: new Date(),
			updated_at: new Date(),
		});

		return await TokenModel.generate({
			id: user._id.toString(),
			scopes: role.scopes,
			provider: AuthProvider.email,
		});
	}

	/**
	 * Update user password
	 * @param this Model
	 * @param id user id
	 * @param password new password
	 * @returns Promise<User>
	 */
	public static async password(this: ReturnModelType<typeof User>, id: string, password: string) {

		const user = await UserModel.findById(id);

		if (!user) {
			throw new HttpException("Invalid user", HttpStatus.BAD_REQUEST);
		}

		user.password = password;

		await user.save();

		return {
			success: true,
		};
	}

	@prop({ enum: AuthProvider })
	public provider: AuthProvider;

	@prop({ ref: Role })
	public role: Ref<Role>;

	@prop()
	public first_name: string;

	@prop()
	public last_name: string;

	@prop({ default: false })
	public activated: boolean;

	@prop({ required: true })
	public email: string;

	@prop({ select: false })
	public password?: string;

	@prop()
	public created_at: Date;

	@prop()
	public updated_at: Date;
}

export const UserModel = getModelForClass(User);
