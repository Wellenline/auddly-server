import { Get, Query, Resource, httpException, HttpStatus } from "liquid-http";
import { AlbumModel } from "../Models/album.model";
import { TrackModel } from "../Models/track.model";
import { ArtistModel } from "../Models/artist.model";
@Resource("/search")
export class Search {
	@Get("/")
	public async index(@Query("q") q: string) {
		try {
			const results = {
				albums: [],
				artists: [],
				tracks: [],
			};

			// Find tracks
			results.tracks = await TrackModel.find({
				title: {
					$regex: q,
					$options: "i",
				},
			}).populate("album genre artist");

			// Find albums
			results.albums = await AlbumModel.find({
				name: {
					$regex: q,
					$options: "i",
				},
			}).populate("artist");

			// Find albums
			results.artists = await ArtistModel.find({
				name: {
					$regex: q,
					$options: "i",
				},
			});

			return results;

		} catch (e) {
			throw httpException(e.toString(), HttpStatus.BAD_REQUEST);

		}
	}
}
