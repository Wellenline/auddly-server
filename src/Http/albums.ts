import { Resource, Get, Context, IContext } from "@wellenline/via";
import { AlbumModel } from "../Models/album.model";

@Resource("/albums")
export class Albums {
	@Get("/")
	public async index(@Context("query") query: { skip?: number, limit?: number }) {
		const skip = query.skip || 0;
		const limit = query.limit || 20;
		return await AlbumModel.find().populate("artist").skip(skip).limit(limit);
	}

	@Get("/artists/:id")
	public async artist(@Context("params") params: { id: string }) {
		return await AlbumModel.find({ artist: params.id }).populate("artist");
	}

	@Get("/random")
	public async random() {

		const albums = await AlbumModel.find().populate("artist");
		const min = 0;
		const n = [];

		for (let i = 0; i < 10; i++) {
			n.push(Math.floor(Math.random() * (albums.length - min + 1)) + min);
		}

		return n.map((i) => albums[i]);

	}

	@Get("/new")
	public async recent() {
		return await AlbumModel.find().populate("artist").sort({ created_at: -1 }).limit(10);
	}

	@Get("/:id")
	public async album(@Context("params") params: { id: string }) {
		return await AlbumModel.findById(params.id).populate("artist");
	}
}
