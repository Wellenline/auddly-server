import { Album } from "@src/entities/album";
import { AlbumModel } from "@src/models/album";
import { Resource, Get, Context, IContext } from "@wellenline/via";
import { existsSync, readFileSync } from "fs";

@Resource("/albums")
export class Albums {

	@Get("/art/:id")
	public async art(@Context() context: IContext) {
		context.headers = {
			"Content-Type": "image/png",
		};
		const id = context.params.id;
		const image = existsSync(`${process.env.CACHE_PATH}/album-art/${id}`) ?
			readFileSync(`${process.env.CACHE_PATH}/album-art/${id}`) : readFileSync(`./assets/placeholder.png`);
		return image;
	}

	@Get("/")
	public async index(@Context() context: IContext) {
		const skip = context.query.skip || 0;
		const limit = context.query.limit || 20;

		const query: { artist?: string } = {};

		if (context.query.artist) {
			query.artist = context.query.artist;
		}

		const albums = await AlbumModel.find(query).populate("artist").sort(context.query.sort || "-created_at").skip(skip).limit(limit);

		return {
			albums,
			total: await AlbumModel.countDocuments(query),
			query: {
				...query,
				skip,
				limit,
			},
		};
	}

	@Get("/random")
	public async random(@Context() context: IContext) {
		return await AlbumModel.random(context.query.total);
	}

	@Get("/:id")
	public async album(@Context() context: IContext) {
		return await AlbumModel.findById(context.params.id).populate("artist");
	}

}
