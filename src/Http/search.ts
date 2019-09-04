import { AlbumModel } from "../Models/album.model";
import { TrackModel } from "../Models/track.model";
import { ArtistModel } from "../Models/artist.model";
import { Resource, Get, Context } from "@wellenline/via";
@Resource("/search")
export class Search {
	@Get("/")
	public async index(@Context("query") query: { q: string }) {
		const results = {
			albums: [],
			artists: [],
			tracks: [],
		};
		// Find tracks
		results.tracks = await TrackModel.find({
			$or: [{
				name: {
					$regex: query.q,
					$options: "i",
				},
			}, {
				artist: {
					$regex: query.q,
					$options: "i",
				},
			}],
		}).populate("album genre artists");

		// Find albums
		results.albums = await AlbumModel.find({
			name: {
				$regex: query.q,
				$options: "i",
			},
		}).populate("artist");

		// Find albums
		results.artists = await ArtistModel.find({
			name: {
				$regex: query.q,
				$options: "i",
			},
		});

		return results;
	}

}
