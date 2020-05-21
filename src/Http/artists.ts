import { ArtistModel } from "../Models/artist.model";
import { Resource, Get, Context } from "@wellenline/via";
import { Artist } from "../Entities/artist";
@Resource("/artists")
export class Artists {
	@Get("/")
	public async index(@Context("query") query: { skip?: number, limit?: number, sort?: number, }) {
		const skip = query.skip || 0;
		const limit = query.limit || 20;
		return {
			artists: await Artist.find({
				order: {
					created_at: query.sort > -1 ? "ASC" : "DESC",
				},
				skip,
				take: limit,
			}),
			total: await Artist.count(),
			query: {
				...query,
				skip,
				limit,
			},
		};
	}

	@Get("/random")
	public async random(@Context("query") query: { total: number }) {
		return await ArtistModel.random(query.total);
	}

	@Get("/:id")
	public async artist(@Context("params") params: { id: string }) {
		return await Artist.findOne(params.id);
	}

}
