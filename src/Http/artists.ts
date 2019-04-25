import { Resource, Get, httpException, HttpStatus } from "liquid-http";
import { ArtistModel } from "../Models/artist.model";
@Resource("/artists")
export class Artists {
	@Get("/")
	public async index() {
		try {
			return await ArtistModel.find();
		} catch (e) {
			throw httpException(e.toString(), HttpStatus.BAD_REQUEST);

		}

	}

	@Get("/new")
	public async new() {
		try {
			return await ArtistModel.find().sort({ created_at: -1 }).limit(15);

		} catch (e) {
			throw httpException(e.toString(), HttpStatus.BAD_REQUEST);

		}
	}
}
