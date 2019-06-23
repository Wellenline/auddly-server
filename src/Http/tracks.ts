import * as fs from "fs";
import { TrackModel } from "../Models/track.model";
import mime = require("mime");
import { Context, IContext, Resource, Get, HttpStatus } from "@wellenline/via";
@Resource("/tracks")
export class Tracks {
	@Get("/")
	// tslint:disable-next-line:max-line-length
	public async tracks(@Context("query") query: {
		skip?: number,
		limit?: number,
		genre?: string,
		favourites?: boolean,
		artist?: string,
		album?: string,
	}) {
		const lookup: { genre?: string, favourited?: boolean, artist?: string, album?: string } = {};
		query.skip = query.skip || 0;
		query.limit = query.limit || 20;

		if (query.genre) {
			lookup.genre = query.genre;
		}

		if (query.artist) {
			lookup.artist = query.artist;
		}

		if (query.favourites) {
			lookup.favourited = true;
		}

		if (query.album) {
			lookup.album = query.album;
		}

		const tracks = TrackModel.find(lookup).populate("album genre artist").sort("-created_at");

		if (query.skip) {
			tracks.skip(query.skip);
		}

		if (query.limit) {
			tracks.limit(query.limit);
		}

		return {
			tracks: await tracks,
			query,
			total: await TrackModel.countDocuments(query),
		};

	}

	@Get("/play/:id")
	public async stream(@Context() context: IContext) {
		const track = await TrackModel.findById(context.params.id);
		if (!track) {
			throw new Error("Failed to load track metadata");
		}
		track.plays = track.plays + 1;
		track.last_play = new Date();
		await track.save();
		const audio = fs.readFileSync(track.path);
		const stat = fs.statSync(track.path);

		context.headers = {
			"Content-Type": mime.getType(track.path),
			"Accept-Ranges": "bytes",
			"Content-Length": stat.size,
		};

		return audio;
		/*res.writeHead(200, {

			"Content-Type": mime.getType(track.path),
			"Accept-Ranges": "bytes",
			"Content-Length": stat.size,

		});
		res.write(audio);
		res.end();*/

	}

	@Get("/like/:id")
	public async like(@Context("params") params: { id: string }) {
		const track = await TrackModel.findById(params.id);
		track.favourited = !track.favourited;

		return await track.save();

	}

	@Get("/favourites")
	public async favourites() {
		return await TrackModel.find({ favourited: true }).populate("album genre artist");

	}

	@Get("/new")
	public async recent() {

		return await TrackModel.aggregate([{
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
				artist: {
					$first: "$artist",
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
				localField: "artist",
				foreignField: "_id",
				as: "artist",
			},
		}, { $unwind: { path: "$album" } }, { $unwind: { path: "$artist" } },
		{
			$project: {
				_id: "$track_id",
				plays: "$plays",
				favourited: "$favourited",
				title: "$title",
				artist: "$artist",
				album: "$album",
				art: "$art",
				duration: "$duration",
				path: "$path",
			},
		},
		{ $limit: 15 }, { $sort: { created_at: -1 } }]);

	}

}
