import { Can } from "@src/middleware/access";
import { GenreModel } from "@src/models/genre";
import { Resource, Get, Before } from "@wellenline/via";
@Resource("/genres")
export class Genres {
	@Get("/")
	@Before(Can("read:genre"))
	public async index() {
		return {
			data: await GenreModel.find(),
			total: await GenreModel.countDocuments(),
		}
	}
}
