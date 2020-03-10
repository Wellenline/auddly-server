import { ArtistModel } from "../Models/artist.model";
import { Resource, Get, Context } from "@wellenline/via";
@Resource("/artists")
export class Artists {
	@Get("/")
	public async index(@Context("query") query: { skip?: number, limit?: number }) {
		const skip = query.skip || 0;
		const limit = query.limit || 20;
		return {
			artists: await ArtistModel.find().sort({ created_at: -1 }).skip(skip).limit(limit),
			total: await ArtistModel.countDocuments(),
			query: {
				skip,
				limit,
			},
		};
	}

	@Get("/random")
	public async random(@Context("query") query: { total: number }) {
		return await ArtistModel.random(query.total);
	}

	@Get("/new")
	public async recent(@Context("query") query: { limit: number }) {
		return await ArtistModel.find().sort({ created_at: -1 }).limit(query.limit || 10);
	}

	@Get("/:id")
	public async artist(@Context("params") params: { id: string }) {
		return await ArtistModel.findById(params.id);
	}

}
