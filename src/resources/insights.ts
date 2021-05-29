import { Artist } from "@src/entities/artist";
import { Track } from "@src/entities/track";
import { TrackModel } from "@src/models/track";
import { Resource, Get, Post, Context, IContext } from "@wellenline/via";
import moment from "moment";
import { IsNull, LessThan, MoreThan, Not } from "typeorm";

@Resource("/insights")
export class Insights {
	@Get("/")
	public async index() {
		const tracks = await TrackModel.find({
			last_play: {
				$gte: moment().subtract(7, "days").toDate(),
			},
		}).populate([{
			path: "album",
			populate: [{
				path: "artist",
			}],
		}, {
			path: "genre",
		}, {
			path: "artists",

		}, {
			path: "playlist"
		}]).sort("-plays").limit(10);



		return {
			artists: [],
			tracks,
			albums: [],
		};
	}
}
