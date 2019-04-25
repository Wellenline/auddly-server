import { Resource, Get, Param, Query, httpException, HttpStatus } from "liquid-http";
import { AlbumModel } from "../Models/album.model";
@Resource("/albums")
export class Albums {
	@Get("/")
	public async index(@Query("skip") skip = "0", @Query("limit") limit = "10") {
		try {
			return await AlbumModel.find().populate("artist").skip(parseInt(skip, 10)).limit(parseInt(limit, 10)).sort({ created_at: -1 });
		} catch (e) {
			throw httpException(e.toString(), HttpStatus.BAD_REQUEST);
		}
	}

	@Get("/artists/:id")
	public async artist(@Param("id") id: string) {
		try {
			return await AlbumModel.find({ artist: id }).populate("artist");
		} catch (e) {
			throw httpException(e.toString(), HttpStatus.BAD_REQUEST);

		}
	}

	@Get("/random")
	public async random() {
		try {
			const albums = await AlbumModel.find().populate("artist");
			const min = 0;
			const n = [];

			for (let i = 0; i < 10; i++) {
				n.push(Math.floor(Math.random() * (albums.length - min + 1)) + min);
			}

			return n.map((i) => albums[i]);

		} catch (e) {
			throw httpException(e.toString(), HttpStatus.BAD_REQUEST);

		}
	}

	@Get("/new")
	public async new() {
		try {
			return await AlbumModel.find().populate("artist").sort({ created_at: -1 }).limit(10);

		} catch (e) {
			throw httpException(e.toString(), HttpStatus.BAD_REQUEST);

		}
	}

	@Get("/:id")
	public async album(@Param("id") id: string) {
		try {
			return await AlbumModel.findById(id).populate("artist");
		} catch (e) {
			throw httpException(e.toString(), HttpStatus.BAD_REQUEST);
		}
	}
}
