import { Resource, Get } from "@wellenline/via";
import { Genre } from "../Entities/genre";
@Resource("/genres")
export class Genres {
	@Get("/")
	public async index() {
		return await Genre.find();
	}
}
