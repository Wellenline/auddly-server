import { Resource, Get, Context, IContext, Before } from "@wellenline/via";

import { Track, TrackModel } from "@src/models/track";
import { Album, AlbumModel } from "@src/models/album";
import { Artist, ArtistModel } from "@src/models/artist";
import { Can } from "@src/middleware/access";
@Resource("/search")
export class Search {
	@Get("/")
	@Before(Can())
	public async index(@Context() context: IContext) {
		const results:
			{ albums: Album[], artists: Artist[], tracks: Track[] } = {
			albums: [],
			artists: [],
			tracks: [],
		};

		results.tracks = await TrackModel.find({
			$or: [{
				name: {
					$regex: context.query.q,
					$options: "i",
				},
			}, {
				artist: {
					$regex: context.query.q,
					$options: "i",
				},
			}],
		}).populate("album genre artists");

		results.albums = await AlbumModel.find({
			name: {
				$regex: context.query.q,
				$options: "i",
			},
		}).populate("artist");

		results.artists = await ArtistModel.find({
			name: {
				$regex: context.query.q,
				$options: "i",
			},
		});

		return results;

	}

}
