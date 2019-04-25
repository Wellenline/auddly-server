import { Resource, Get, httpException, HttpStatus } from "liquid-http";
import { AlbumModel } from "../Models/album.model";
@Resource("/radio")
export class Radio {
	@Get("/albums")
	public async albums() {
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
}
