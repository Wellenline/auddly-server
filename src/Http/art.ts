import * as fs from "fs";
import { Resource, HttpHeaders, Get, Param, httpException, HttpStatus } from "liquid-http";
@Resource("/art")
export class Art {
	@Get("/:id")
	@HttpHeaders({
		"Content-Type": "image/png",
	})
	public async index(@Param("id") id: string) {
		try {
			const image = fs.existsSync(`${process.env.ART_PATH}/${id}`) ?
				fs.readFileSync(`${process.env.ART_PATH}/${id}`) : fs.readFileSync(`./assets/placeholder.png`);
			return image;
		} catch (e) {
			throw httpException(e.toString(), HttpStatus.BAD_REQUEST);

		}
	}
}
