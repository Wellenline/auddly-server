import { GenreModel } from "../Models/genre.model";
import { Resource, Get } from "@wellenline/via";
import { PlaylistModel } from "../Models/playlist.model";
import { TrackModel } from "../Models/track.model";
@Resource("/playlists")
export class Playlists {
	@Get("/")
	public async index() {
		const playlist = [];
		const favourites = await TrackModel.find({ favourited: true }).populate("album").sort("-updated_at").limit(4);

		const latest = await TrackModel.aggregate([{
			$group: {
				_id: "$album",
				track_id: { $first: "$_id" },

				plays: {
					$first: "$plays",
				},
				favourited: {
					$first: "$favourited",
				},
				title: {
					$first: "$title",
				},
				artists: {
					$first: "$artists",
				},
				album: {
					$first: "$album",
				},
				art: {
					$first: "$art",
				},
				duration: {
					$first: "$duration",
				},
				path: {
					$first: "$path",
				},
			},
		}, {
			$lookup:
			{
				from: "albums",
				localField: "album",
				foreignField: "_id",
				as: "album",
			},
		}, {
			$lookup:
			{
				from: "artists",
				localField: "artists",
				foreignField: "_id",
				as: "artists",
			},
		}, { $unwind: { path: "$album" } },
		{
			$project: {
				_id: "$track_id",
				plays: "$plays",
				favourited: "$favourited",
				title: "$title",
				artists: "$artists",
				album: "$album",
				art: "$art",
				duration: "$duration",
				path: "$path",
			},
		},
		{ $limit: 4 }, { $sort: { created_at: -1 } }]);

		playlist.push({
			name: "Favourites",
			tracks: await TrackModel.countDocuments({ favourited: true }),
			pictures: favourites.map((track: any) => {
				return track.album.picture;
			}),
		});

		playlist.push({
			name: "Latest",
			tracks: await TrackModel.countDocuments({ favourited: true }),
			pictures: latest.map((track: any) => {
				return `${process.env.HOST}${track.album.picture}`;;
			}),
		});
		return playlist;
	}
}
