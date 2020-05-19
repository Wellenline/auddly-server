import { getType } from "mime";
import { TrackModel } from "../Models/track.model";
import { Context, IContext, Resource, Get } from "@wellenline/via";
import { readFileSync, statSync, createReadStream } from "fs";
import { LibraryService } from "../Services/library.service";
import { PlaylistModel } from "../Models/playlist.model";
@Resource("/tracks")
export class Tracks {
	@Get("/")
	public async tracks(@Context("query") query: {
		skip?: number,
		limit?: number,
		shuffle?: boolean,
		genre?: string,
		favourites?: boolean,
		artist?: string,
		album?: string,
		playlist?: string,
	}) {
		const lookup: { genre?: string, favourited?: boolean, artists?: string, album?: string, _id?: any, } = {};
		query.skip = query.skip || 0;
		query.limit = query.limit || 20;

		if (query.genre) {
			lookup.genre = query.genre;
		}

		if (query.artist) {
			lookup.artists = query.artist;
		}

		if (query.favourites) {
			lookup.favourited = true;
		}

		if (query.album) {
			lookup.album = query.album;
		}

		if (query.playlist) {
			const data: any = await PlaylistModel.findById(query.playlist).select("tracks");

			if (data && data.tracks && data.tracks.length > 0) {
				lookup._id = {
					$in: data.tracks.map((track) => track._id),
				};
			} else {
				lookup._id = {
					$in: [null],
				};
			}
		}

		const model = TrackModel.find(lookup).populate([{
			path: "album",
			populate: [{
				path: "artist",
			}],
		}, {
			path: "genre",
		}, {
			path: "artists",

		}]).sort("-created_at");

		const total = await TrackModel.countDocuments(lookup);

		if (query.skip && !query.shuffle) {
			model.skip(query.skip);
		}

		if (query.limit && !query.shuffle) {
			model.limit(query.limit);
		}

		let tracks = await model;

		if (query.shuffle) {
			const min = 0;
			const n = [];

			for (let i = 0; i < query.limit; i++) {
				n.push(Math.floor(Math.random() * (tracks.length - min + 1)) + min);
			}

			tracks = n.map((i) => tracks[i]).filter((s) => s !== null);
		}
		return {
			tracks,
			query,
			total,
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
		// wait until audio has finished transcodig... probably not the best way of doing it
		if (track.path.toString().endsWith(".flac") && process.env.TRANSCODING === "true") {
			track.path = await LibraryService.instance.transcode(track, {
				output: { type: "mp3" }
			});
		}

		const stat = statSync(track.path);

		const total = stat.size;

		if (context.req.headers.range) {
			const range = context.req.headers.range;
			const parts = range.replace(/bytes=/, "").split("-");
			const partialstart = parseInt(parts[0], 10);
			const partialend = parseInt(parts[1], 10);

			const start = partialstart;
			const end = partialend ? partialend : total - 1;
			const chunksize = (end - start) + 1;


			context.status = 206;
			context.headers = {
				"Content-Range": "bytes " + start + "-" + end + "/" + total,
				"Accept-Ranges": "bytes", "Content-Length": chunksize,
				"Content-Type": getType(track.path),
			};

			return createReadStream(track.path, { start, end });
		} else {

			context.headers = {
				"Content-Type": getType(track.path),
				"Accept-Ranges": "bytes",
				"Content-Length": stat.size,
			};

			return createReadStream(track.path);
		}


		/*const audio = readFileSync(track.path);
		const stat = statSync(track.path);

		context.headers = {
			"Content-Type": getType(track.path),
			"Accept-Ranges": "bytes",
			"Content-Length": stat.size,
		};

		return audio;*/
	}

	@Get("/like/:id")
	public async like(@Context("params") params: { id: string }) {
		const track = await TrackModel.findById(params.id);
		track.favourited = !track.favourited;
		track.updated_at = new Date();
		return await track.save();

	}

	@Get("/popular")
	public async poplar(@Context("query") query: { artist?: string, skip?: number, limit?: number, genre?: string, album?: string }) {
		const lookup: { genre?: string, favourited?: boolean, artists?: string, album?: string, plays: any } = { plays: { $gt: 0 } };
		query.skip = query.skip || 0;
		query.limit = query.limit || 20;

		if (query.genre) {
			lookup.genre = query.genre;
		}

		if (query.artist) {
			lookup.artists = query.artist;
		}

		if (query.album) {
			lookup.album = query.album;
		}

		const model = TrackModel.find(lookup).populate([{
			path: "album",
			populate: [{
				path: "artist",
			}],
		}, {
			path: "genre",
		}, {
			path: "artists",

		}]).sort("-plays");

		const total = await TrackModel.countDocuments(lookup);

		if (query.skip) {
			model.skip(query.skip);
		}

		if (query.limit) {
			model.limit(query.limit);
		}

		const tracks = await model.find();

		return {
			tracks,
			query: lookup,
			total,
		};
	}

	@Get("/favourites")
	public async favourites() {
		return await TrackModel.find({ favourited: true }).populate("album genre artists");

	}

	@Get("/new")
	public async recent(@Context("query") query: { limit: number }) {
		return await TrackModel.find().sort({ created_at: -1 }).populate([{
			path: "album",
			populate: [{
				path: "artist",
			}],
		}, {
			path: "genre",
		}, {
			path: "artists",

		}]).limit(query.limit || 10);
	}

	@Get("/random")
	public async random(@Context("query") query: { total: number }) {
		return await TrackModel.random(query.total);
	}

}
