import { AlbumModel } from "../Models/album.model";
import { Resource, Get } from "@wellenline/via";
@Resource("/radio")
export class Radio {
	@Get("/albums")
	public async albums() {
		const albums = await AlbumModel.find().populate("artist");
		const min = 0;
		const n = [];

		for (let i = 0; i < 10; i++) {
			n.push(Math.floor(Math.random() * (albums.length - min + 1)) + min);
		}

		return n.map((i) => albums[i]);
	}
}
