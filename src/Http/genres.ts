import { Resource, Get, httpException, HttpStatus } from "liquid-http";
import { GenreModel } from "../Models/genre.model";
@Resource("/genres")
export class Genres {
	@Get("/")
	public async index() {
		try {
			return await GenreModel.find({ name: { $ne: "" } });

		} catch (e) {
			throw httpException(e.toString(), HttpStatus.BAD_REQUEST);

		}
	}
}
