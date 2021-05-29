import { getType } from "mime";
import { Context, IContext, Resource, Get, HttpException, Put } from "@wellenline/via";
import { statSync, createReadStream } from "fs";
import { Track } from "../entities/track";
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
			path: "playlist"
		}]).skip(skip || 0).limit(limit || 20);

		const total = await TrackModel.countDocuments({});


		/*const query: {
			skip?: number,
			limit?: number,
			genre?: number,
			liked?: boolean,
			sort?: boolean,
			sort_by?: string,
			artist?: number,
			album?: number,
			playlist?: number,
			popular?: boolean,
		} = context.query;

		const skip = context.query.skip || 0;
		const limit = context.query.limit || 20;

		const sort = "";

		const tracks = await TrackModel.find().populate("playlist genre album artists").skip(skip).limit(limit);

		const total = await TrackModel.countDocuments({});
*/
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
		/*
		// have to use querybuilder cuz im too dumb to figure out how to make it work with typeorm find-options
		// for reference https://github.com/typeorm/typeorm/issues/6036
		// https://stackoverflow.com/questions/52246722/how-to-query-a-many-to-many-relation-with-typeorm
		const queryBuilder = getManager().createQueryBuilder(Track, "track");

		if (query.artist) {
			queryBuilder.innerJoinAndSelect("track.artists", "artist", "artist.id = :id", { id: query.artist });
		}

		if (query.playlist) {
			queryBuilder.innerJoinAndSelect("track.playlists", "playlist", "playlist.id = :id", { id: query.playlist });
		}

		if (query.genre) {
			queryBuilder.andWhere("track.genre = :genre", {
				genre: query.genre,
			});
		}

		if (query.liked) {
			queryBuilder.andWhere("track.liked = :liked", {
				liked: true,
			});
		}

		if (query.album) {
			queryBuilder.andWhere("track.album = :album", {
				album: query.album,
			});
			queryBuilder.orderBy("track.number", "ASC");

		}

		queryBuilder.leftJoinAndSelect("track.artists", "artists");
		queryBuilder.leftJoinAndSelect("track.playlists", "playlists");
		queryBuilder.leftJoinAndSelect("track.album", "album");

		queryBuilder.leftJoinAndSelect("album.artist", "albumArtist");

		queryBuilder.leftJoinAndSelect("track.genre", "genre");
		if (query.popular) {
			queryBuilder.orderBy("plays", "DESC");
			queryBuilder.andWhere("track.plays >= :plays", { plays: 10 });
		} else {
			// queryBuilder.orderBy("track.created_at", "ASC");

		}

		if (query.sort) {
			queryBuilder.orderBy("track.created_at", "DESC");
		} else {
			queryBuilder.orderBy("track.created_at", "ASC");

		}
		queryBuilder.skip(skip);
		queryBuilder.take(limit);

		const total = await queryBuilder.getCount();
		const tracks = await queryBuilder.getMany();

		return {
			tracks,
			query: {
				...query,
				skip,
				limit,
			},
			total,
		};*/
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
