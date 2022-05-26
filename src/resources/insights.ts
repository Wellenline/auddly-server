import { Can } from "@src/middleware/access";
import { TrackModel } from "@src/models/track";
import { Resource, Get, Before } from "@wellenline/via";
import moment from "moment";

@Resource("/insights")
export class Insights {
	@Get("/")
	@Before(Can())
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


		// const artists = await ArtistModel.aggregate([])

		return {
			artists: [],
			tracks,
			albums: [],
		};
	}
}
