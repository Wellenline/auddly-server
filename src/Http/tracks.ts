import { getType } from "mime";
import { Context, IContext, Resource, Get } from "@wellenline/via";
import { statSync, createReadStream, } from "fs";
import { LibraryService } from "../Services/library";
import { Track } from "../Entities/track";
import { getManager } from "typeorm";
@Resource("/tracks")
export class Tracks {
	@Get("/")
	public async tracks(@Context("query") query: {
		skip?: number,
		limit?: number,
		genre?: number,
		liked?: boolean,
		artist?: number,
		album?: number,
		playlist?: number,
		popular?: boolean,
	}) {

		const skip = query.skip || 0;
		const limit = query.limit || 20;

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
			queryBuilder.where("track.genre = :genre", {
				genre: query.genre,
			});
		}

		if (query.liked) {
			queryBuilder.where("track.liked = :liked", {
				liked: true,
			});
		}

		if (query.album) {
			queryBuilder.where("track.album = :album", {
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
			queryBuilder.where("track.plays >= :plays", { plays: 1 });
		} else {
			// queryBuilder.orderBy("track.created_at", "ASC");

		}
		queryBuilder.offset(skip);
		queryBuilder.limit(limit);

		const total = await queryBuilder.getCount();
		const tracks = await queryBuilder.getMany();
		/*const tracks = await Track.find({
			join: {
				alias: "track",
				leftJoinAndSelect: {
					artists: "track.artists",
					album: "track.album",
					genre: "track.genre",
				}
			},
			where,
			skip,
			take: limit,
		});*/
		return {
			tracks,
			query: {
				...query,
				skip,
				limit,
			},
			total,
		};
	}


	@Get("/play/:id")
	public async stream(@Context() context: IContext) {
		const track = await Track.findOne(context.params.id);
		if (!track) {
			throw new Error("Failed to load track metadata");
		}
		track.plays = parseInt(track.plays as any, 10) + 1;
		track.last_play = new Date();

		await track.save();
		// wait until audio has finished transcodig... probably not the best way of doing it
		if (track.path.toString().endsWith(".flac") && context.query.transcode) {
			track.path = await LibraryService.instance.transcode(track as any, {
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
		const track = await Track.findOne(params.id);
		track.liked = !track.liked;
		track.updated_at = new Date();
		return await track.save();

	}

	@Get("/random")
	public async random(@Context("query") query: { total: number }) {
		return await Track.random(query.total);
	}

	@Get("/waveform/:id")
	public async waveform(@Context() context: IContext) {
		context.headers = {
			"Content-type": "image/png",
		};
		const track = await Track.findOne(context.params.id);

		return createReadStream(track.waveform);
	}

}
