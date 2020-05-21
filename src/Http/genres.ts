import { GenreModel } from "../Models/genre.model";
import { Resource, Get } from "@wellenline/via";
import { Genre } from "../Entities/genre";
import { IsNull, Not } from "typeorm";
@Resource("/genres")
export class Genres {
	@Get("/")
	public async index() {
		return await Genre.find();
	}
}
