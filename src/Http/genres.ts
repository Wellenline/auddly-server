import { GenreModel } from "../Models/genre.model";
import { Resource, Get } from "@wellenline/via";
@Resource("/genres")
export class Genres {
	@Get("/")
	public async index() {
		return await GenreModel.find({ name: { $ne: "" } });
	}
}
