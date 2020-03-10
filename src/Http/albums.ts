import { Resource, Get, Context, IContext } from "@wellenline/via";
import { AlbumModel } from "../Models/album.model";
import { existsSync, readFileSync } from "fs";

@Resource("/albums")
export class Albums {

	@Get("/art/:id")
	public async art(@Context() context: IContext) {
		context.headers = {
			"Content-type": "image/png",
		};
		const id = context.params.id;
		const image = existsSync(`${process.env.ART_PATH}/${id}`) ?
			readFileSync(`${process.env.ART_PATH}/${id}`) : readFileSync(`./assets/placeholder.png`);
		return image;
	}

	@Get("/")
	public async index(@Context("query") query: { skip?: number, limit?: number }) {
		const skip = query.skip || 0;
		const limit = query.limit || 20;
		return {
			albums: await AlbumModel.find().populate("artist").skip(skip).limit(limit).sort({ created_at: -1 }),
			total: await AlbumModel.countDocuments(),
			query: {
				skip,
				limit,
			},
		};
	}

	@Get("/artists/:id")
	public async artist(@Context("params") params: { id: string }) {
		return await AlbumModel.find({ artist: params.id }).populate("artist");
	}

	@Get("/random")
	public async random(@Context("query") query: { total: number }) {
		return await AlbumModel.random(query.total);
	}

	@Get("/new")
	public async recent(@Context("query") query: { limit: number }) {
		return await AlbumModel.find().sort({ created_at: -1 }).populate("artist").limit(query.limit || 10);
	}

	@Get("/:id")
	public async album(@Context("params") params: { id: string }) {
		return await AlbumModel.findById(params.id).populate("artist");
	}

}
