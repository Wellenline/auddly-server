import { Artist } from "@src/entities/artist";
import { Track } from "@src/entities/track";
import { Resource, Get, Post, Context, IContext } from "@wellenline/via";
import moment from "moment";
import { IsNull, LessThan, MoreThan, Not } from "typeorm";

@Resource("/insights")
export class Insights {
	@Get("/")
	public async index() {
		const tracks = await Track.find({
			order: {
				// last_play: "DESC",
				plays: "DESC",
			},
			where: [{
				last_play: Not(IsNull()),
			}, {
				last_play: LessThan(moment().subtract(1, "days").toDate()),
			}],
			take: 10,
		});

		return {
			mv: moment().add(7, "days").toDate(),
			artists: [],
			tracks,
			albums: [],
		};
	}
}
