import * as fs from "fs";
import { Resource, Get, Context, IContext } from "@wellenline/via";
@Resource("/art")
export class Art {
	@Get("/:id")

	public async index(@Context() context: IContext) {
		context.headers = {
			"Content-type": "image/png",
		};
		const id = context.params.id;
		const image = fs.existsSync(`${process.env.ART_PATH}/${id}`) ?
			fs.readFileSync(`${process.env.ART_PATH}/${id}`) : fs.readFileSync(`./assets/placeholder.png`);
		return image;

	}
}
