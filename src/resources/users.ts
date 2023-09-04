import { Resource, Context, IContext, Get, Before, Put, HttpException, HttpStatus, Post, Delete } from "@wellenline/via";
import { UserModel } from "../models/user";
import { Can } from "../middleware/access";
import { Validator } from "@src/middleware/validator";
import { UserSchema } from "@src/middleware/schemas/user";
import { PlaylistModel } from "@src/models/playlist";
import { LikeModel } from "@src/models/like";
import { ChartModel } from "@src/models/chart";
import { TokenModel } from "@src/models/token";

@Resource("/users")
export class Users {

	@Get("/")
	@Before(Can("read:user"))
	public async index(@Context() context: IContext) {
		const DEFAULT_LIMIT = context.query.limit || 20;
		const DEFAULT_SKIP = context.query.skip || 0;
		const users = await UserModel.find().populate([{
			path: "role",
			select: "name permissions"
		}]).sort("order").skip(DEFAULT_SKIP).limit(DEFAULT_LIMIT).lean();
		return {
			total: await UserModel.countDocuments(),

			metadata: {
				payload: context.payload,
				pagination: {
					skip: DEFAULT_SKIP,
					limit: DEFAULT_LIMIT,
				},
			},

			data: users,
		};
	}

	@Get("/me")
	@Before(Can()) //
	public async me(@Context() context: IContext) {
		const user: any = await UserModel.findById(context.payload.id).select("-role -provider").lean();
		return user;
	}


	@Get("/:id")
	@Before(Can("read:user"))
	public async get(@Context() context: IContext) {
		return await UserModel.findOne({
			_id: context.params.id
		});
	}


	@Put("/:id")
	@Before(Can("update:user"), Validator.validate(UserSchema.update))
	public async update(@Context() context: IContext) {
		const { role, first_name, last_name, email, password } = context.body;

		if (!context.payload.scopes.includes("create:user") && context.payload.id !== context.params.id) {
			throw new HttpException("You don't have permission to update this user", HttpStatus.FORBIDDEN);
		}

		const user = await UserModel.findOne({
			_id: context.params.id,
		});

		if (!user) {
			throw new HttpException("User not found", HttpStatus.NOT_FOUND);
		}

		if (first_name) {
			user.first_name = first_name;
		}

		if (last_name) {
			user.last_name = last_name;
		}

		user.updated_at = new Date();

		if (role && (user.role as any).toString() !== role) {
			user.role = role;
		}

		if (password) {
			user.password = password;
		}

		if (email) {
			user.email = email;
		}

		return await user.save();

	}

	@Post("/")
	@Before(Can("create:user"), Validator.validate(UserSchema.create))
	public async create(@Context() context: IContext) {
		const { role, first_name, last_name, email, password } = context.body;
		return await UserModel.signup({
			first_name,
			last_name,
			email,
			role,
			password
		});
	}

	@Delete("/:id")
	@Before(Can("delete:user"))
	public async delete(@Context() context: IContext) {
		const user = await UserModel.findOne({
			_id: context.params.id
		});

		if (!user) {
			throw new HttpException("User not found", HttpStatus.NOT_FOUND);
		}

		await PlaylistModel.deleteMany({
			created_by: user._id
		});

		await LikeModel.deleteMany({
			created_by: user._id
		});

		await ChartModel.deleteMany({
			created_by: user._id
		});

		await TokenModel.deleteMany({
			created_by: user._id
		});

		return await user.deleteOne();
	}
}
