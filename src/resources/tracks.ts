import { getType } from "mime";
import { Context, IContext, Resource, Get, HttpException, Put } from "@wellenline/via";
import { statSync, createReadStream } from "fs";
import { transcode } from "@src/common/library";
import { TrackModel } from "@src/models/track";
export interface ITrackQueryOptions {
	skip?: number;
	limit?: number;
	genre?: string;
	liked?: boolean;
	sort?: string;
	artist?: string;
	album?: string;
	playlist?: string;
	popular?: boolean;
	artists?: string;

}
@Resource("/tracks")
export class Tracks {
	@Get("/")
	public async tracks(@Context() context: IContext) {
		const { skip, limit, genre, liked, sort, artist, album, playlist, popular }: ITrackQueryOptions = context.query;


		const query: any = {};
		const sort_by: { field?: string } = {
			field: sort || "-created_at",
		};

		if (genre) {
			query.genre = genre;
		}

		if (liked) {
			query.liked = liked;
		}

		if (artist) {
			query.artists = artist;
		}

		if (album) {
			query.album = album;
			sort_by.field = "number";
		}

		if (playlist) {
			query.playlists = playlist;
		}

		if (popular) {
			query.plays = {
				$gte: 10,
			};
		}


		const tracks = await TrackModel.find(query).sort(sort_by.field).populate([{
			path: "album",
			populate: [{
				path: "artist",
			}],
		}, {
			path: "genre",
		}, {
			path: "artists",

		}, {
			path: "playlists"
		}]).skip(skip || 0).limit(limit || 20);

		const total = await TrackModel.countDocuments(query);

		return {
			tracks,
			query: {
				...query,
				skip,
				limit,
				sort
			},
			total,
		};
	}


	@Get("/play/:id")
	public async stream(@Context() context: IContext) {
		const track = await TrackModel.findById(context.params.id);
		if (!track) {
			throw new Error("Failed to load track metadata");
		}
		/*track.plays = parseInt(track.plays as any, 10) + 1;
		track.last_play = new Date();

		await track.save();*/
		// wait until audio has finished transcodig... probably not the best way of doing it
		if (track.path.toString().endsWith(".flac") && context.query.transcode) {
			track.path = await transcode(track as any, {
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
				"Content-Type": getType(track.path) || "audio/mp3",
			};

			return createReadStream(track.path, { start, end });
		} else {

			context.headers = {
				"Content-Type": getType(track.path) || "audio/mp3",
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
	public async like(@Context() context: IContext) {
		const track = await TrackModel.findById(context.params.id);

		if (!track) {
			throw new HttpException("Invalid track");
		}

		track.liked = !track.liked;
		track.updated_at = new Date();
		return await track.save();

	}

	@Get("/random")
	public async random(@Context() context: IContext) {
		return await TrackModel.random(context.query.total);
	}


	@Put(`/plays/:id`)
	public async create(@Context() context: IContext) {
		const track = await TrackModel.findById(context.params.id);
		if (!track) {
			throw new Error("Failed to load track metadata");
		}
		track.plays = parseInt(track.plays as any, 10) + 1;
		track.last_play = new Date();

		await track.save();

		return {
			success: true,
		}
	}
}
