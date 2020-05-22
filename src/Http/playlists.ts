import { Resource, Get, Post, Context, IContext, Put, HttpException, HttpStatus, Delete } from "@wellenline/via";
import { Playlist } from "../Entities/playlist";
import { Track } from "../Entities/track";
@Resource("/playlists")
export class Playlists {

	/**
	 * @api {get} /playlists List all playlists
	 * @apiDescription List all playlists
	 * @apiGroup Playlists
	 * @apiName playlists.index
	 * @apiVersion 3.0.0
	 * @returns Playlist[]
	 */
	@Get("/")
	public async index(@Context("query") query: { skip?: number, limit?: number }) {
		const skip = query.skip || 0;
		const limit = query.limit || 20;
		return {
			playlists: await Playlist.find({
				skip,
				take: limit,
			}),
			total: await Playlist.count(),
			query: {
				...query,
				skip,
				limit,
			},
		};
	}

	/**
	 * @api {get} /playlists/:id Get playlist
	 * @apiDescription Get playlist
	 * @apiGroup Playlists
	 * @apiName playlists.view
	 * @apiVersion 3.0.0
	 * @returns Playlist
	 */
	@Get("/:id")
	public async view(@Context() context: IContext) {
		return await Playlist.findOne(context.params.id);
	}

	/**
	 * @api {post} /playlists Create a new playlist
	 * @apiDescription Create a new playlist
	 * @apiGroup Playlists
	 * @apiName playlists.create
	 * @apiParam {string} name playlist name
	 * @apiParam {string} picture Optional playlist picture
	 * @apiVersion 3.0.0
	 * @returns Track
	 */
	@Post("/")
	public async create(@Context() context: IContext) {
		return await Playlist.insert(context.body);
	}

	/**
	 * @api {post} /playlists/:playlistId Add track to playlist
	 * @apiDescription Add track to playlist
	 * @apiGroup Playlists
	 * @apiName playlists.upload
	 * @apiParam {string} track track id to add to playlist
	 * @apiVersion 3.0.0
	 * @returns Track
	 */
	@Post("/:id")
	public async add(@Context() context: IContext) {
		const playlist = await Playlist.findOne(context.params.id);

		if (!playlist) {
			throw new HttpException("Playlist not found", HttpStatus.NOT_FOUND);
		}

		const track = await Track.findOne(context.body.track, {
			join: {
				alias: "track",
				leftJoinAndSelect: {
					playlists: "track.playlists",
				}
			}
		});

		if (!track) {
			throw new HttpException("Track not found", HttpStatus.NOT_FOUND);
		}

		track.playlists = (track.playlists || []).concat([playlist]);

		return await track.save();
	}

	/**
	 * @api {put} /playlists/:playlistId/ Update playlist
	 * @apiDescription Update playlist
	 * @apiGroup Playlists
	 * @apiName playlists.update
	 * @apiVersion 3.0.0
	 * @returns Playlist<Result>
	 */
	@Put("/:id")
	public async update(@Context() context: IContext) {
		return await Playlist.update(context.params.id, {
			name: context.body.name,
			picture: context.body.picture,
		});
	}

	/**
	 * @api {delete} /playlists/:playlistId/ Delete playlist
	 * @apiDescription Delete playlist
	 * @apiGroup Playlists
	 * @apiName playlists.delete
	 * @apiVersion 3.0.0
	 * @returns DeleteResult
	 */
	@Delete("/:id")
	public async delete(@Context() context: IContext) {
		return await Playlist.delete(context.params.id);
	}

	/**
	 * @api {delete} /playlists/:playlistId/:trackId Remove track from playlist
	 * @apiDescription Remove track from playlist
	 * @apiGroup Playlists
	 * @apiName playlists.removeFromPlaylist
	 * @apiVersion 3.0.0
	 * @returns Track
	 */
	@Delete("/:id/:track")
	public async removeFromPlaylist(@Context() context: IContext) {
		const track = await Track.findOne(context.params.track, {
			join: {
				alias: "track",
				leftJoinAndSelect: {
					playlists: "track.playlists",
				}
			}
		});
		track.playlists = track.playlists.filter((playlist) => context.params.id !== playlist.id);

		return await track.save();
	}
}
