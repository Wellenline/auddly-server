import { ArtistModel } from "@src/models/artist";
import { Resource, Get, Context, IContext } from "@wellenline/via";
import { Artist } from "../entities/artist";
@Resource("/artists")
export class Artists {
	@Get("/")
	public async index(@Context() context: IContext) {
		const skip = context.query.skip || 0;
		const limit = context.query.limit || 20;

		return {
			artists: await ArtistModel.find().sort(context.query.sort || "-created_at").skip(skip).limit(limit),
			total: await ArtistModel.countDocuments(),
			query: {
				skip,
				limit,
			},
		};
	}

	@Get("/random")
	public async random(@Context() context: IContext) {
		return await ArtistModel.random(context.query.total);
	}

	@Get("/:id")
	public async artist(@Context() context: IContext) {
		return await ArtistModel.findById(context.params.id);
	}

}
