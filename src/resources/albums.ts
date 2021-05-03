import { Album } from "@src/Entities/album";
import { Resource, Get, Context, IContext } from "@wellenline/via";
import { existsSync, readFileSync } from "fs";

@Resource("/albums")
export class Albums {

	@Get("/art/:id")
	public async art(@Context() context: IContext) {
		context.headers = {
			"Content-type": "image/png",
		};
		const id = context.params.id;
		const image = existsSync(`${process.env.ART_PATH}/${id}`) ?
			readFileSync(`${process.env.ART_PATH}/${id}`) : readFileSync(`./assets/placeholder.png`);
		return image;
	}

	@Get("/")
	public async index(@Context("query") query: { skip?: number, limit?: number, artist?: number, sort?: number }) {
		const skip = query.skip || 0;
		const limit = query.limit || 20;
		const where = query.artist ? {
			artist: query.artist
		} : {};
		return {
			albums: await Album.find({
				join: {
					alias: "album",
					leftJoinAndSelect: {
						artist: "album.artist",
					}
				},
				where,
				order: {
					created_at: query.sort && query.sort > -1 ? "ASC" : "DESC",
				},
				skip,
				take: limit,
			}),
			total: await Album.count({
				where,
			}),
			query: {
				...query,
				skip,
				limit,
			},
		};
	}

	@Get("/random")
	public async random(@Context() context: IContext) {
		return await Album.random(context.query.total);
	}

	@Get("/:id")
	public async album(@Context() context: IContext) {
		return await Album.findOne({
			join: {
				alias: "album",
				leftJoinAndSelect: {
					artist: "album.artist",
				}
			},
			where: { id: context.params.id },
		});
	}

}
