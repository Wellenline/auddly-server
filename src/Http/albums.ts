import { Resource, Get, Context, IContext } from "@wellenline/via";
import { existsSync, readFileSync } from "fs";
import { Album } from "../Entities";

@Resource("/albums")
export class Albums {

	@Get("/art/:id")
	public async art(@Context() context: IContext) {
		context.headers = {
			"Content-type": "image/png",
		};

		return existsSync(`${process.env.ART_PATH}/${context.params.id}`) ?
			readFileSync(`${process.env.ART_PATH}/${context.params.id}`) : readFileSync(`./assets/placeholder.png`);
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
					created_at: query.sort > -1 ? "ASC" : "DESC",
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
	public async random(@Context("query") query: { total: number }) {
		return await Album.random(query.total);
	}

	@Get("/:id")
	public async album(@Context("params") params: { id: string }) {
		return await Album.findOne({
			join: {
				alias: "album",
				leftJoinAndSelect: {
					artist: "album.artist",
				}
			},
			where: { id: params.id },
		});
	}

}
