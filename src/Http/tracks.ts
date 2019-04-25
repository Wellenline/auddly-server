import * as fs from "fs";
import { Get, Param, Query, Resource, httpException, HttpStatus, Res, IResponse } from "liquid-http";
import { TrackModel } from "../Models/track.model";
import mime = require("mime");
@Resource("/tracks")
export class Tracks {
	@Get("/")
	// tslint:disable-next-line:max-line-length
	public async tracks(@Query("skip") skip = "0", @Query("limit") limit = "20", @Query("genre") genre: string, @Query("favourites") favourites: boolean, @Query("artist") artist: string, @Query("album") album: string) {
		try {
			const query: { genre?: string, favourited?: boolean, artist?: string, album?: string } = {};
			if (genre) {
				query.genre = genre;
			}

			if (artist) {
				query.artist = artist;
			}

			if (favourites) {
				query.favourited = true;
			}

			if (album) {
				query.album = album;
			}

			const tracks = TrackModel.find(query).populate("album genre artist").sort("-created_at");

			if (skip) {
				tracks.skip(parseInt(skip, 10));
			}

			if (limit) {
				tracks.limit(parseInt(limit, 10));
			}

			return {
				tracks: await tracks,
				query,
				total: await TrackModel.countDocuments(query),
			};
		} catch (e) {
			throw httpException(e.toString(), HttpStatus.BAD_REQUEST);

		}
	}

	@Get("/play/:id")
	public async stream(@Res() res: IResponse, @Param("id") id) {
		try {
			const track = await TrackModel.findById(id);
			if (!track) {
				throw new Error("Failed to load track metadata");
			}
			track.plays = track.plays + 1;
			track.last_play = new Date();
			await track.save();
			const audio = fs.readFileSync(track.path);
			const stat = fs.statSync(track.path);
			res.writeHead(200, {

				"Content-Type": mime.getType(track.path),
				"Accept-Ranges": "bytes",
				"Content-Length": stat.size,

			});
			res.write(audio);
			res.end();

		} catch (e) {
			throw httpException(e.toString(), HttpStatus.BAD_REQUEST);

		}
	}

	@Get("/like/:id")
	public async like(@Param("id") id: string) {
		try {
			const track = await TrackModel.findById(id);
			track.favourited = !track.favourited;

			return await track.save();
		} catch (e) {
			throw httpException(e.toString(), HttpStatus.BAD_REQUEST);

		}
	}

	@Get("/favourites")
	public async favourites() {
		try {
			return await TrackModel.find({ favourited: true }).populate("album genre artist");
		} catch (e) {
			throw httpException(e.toString(), HttpStatus.BAD_REQUEST);

		}
	}

	@Get("/new")
	public async recent() {
		try {

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

		} catch (e) {
			throw httpException(e.toString(), HttpStatus.BAD_REQUEST);
		}
	}

}
