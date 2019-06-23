import { ArtistModel } from "../Models/artist.model";
import { Resource, Get } from "@wellenline/via";
@Resource("/artists")
export class Artists {
	@Get("/")
	public async index() {
		return await ArtistModel.find();
	}

	@Get("/new")
	public async new() {
		return await ArtistModel.find().sort({ created_at: -1 }).limit(15);
	}
}
