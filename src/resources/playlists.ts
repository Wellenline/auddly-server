import { PlaylistModel } from "@src/models/playlist";
import { TrackModel } from "@src/models/track";
import { Resource, Get, Post, Context, IContext, Put, HttpException, HttpStatus, Delete } from "@wellenline/via";
@Resource("/playlists")
export class Playlists {

	@Get("/")
	public async index(@Context() context: IContext) {
		const skip = context.query.skip || 0;
		const limit = context.query.limit || 20;
		return {
			playlists: await PlaylistModel.find().skip(skip).limit(limit),
			total: await PlaylistModel.countDocuments(),
			query: {
				...context.query,
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
	 * @apiParam {id} playlist id
	 * @apiVersion 3.0.0
	 * @returns Playlist
	 */
	@Get("/:id")
	public async view(@Context() context: IContext) {
		return await PlaylistModel.findById(context.params.id);
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
		return await PlaylistModel.create({ ...context.body, created_at: new Date(), updated_at: new Date() });
	}

	/**
	 * @api {post} /playlists/:playlistId Add track to playlist
	 * @apiDescription Add track to playlist
	 * @apiGroup Playlists
	 * @apiName playlists.upload
	 * @apiParam {playlistId} playlist id
	 * @apiParam {string[]} tracks track ids to add to playlist
	 * @apiVersion 3.0.0
	 * @returns Track
	 */
	@Post("/:id")
	public async add(@Context() context: IContext) {

		const playlist = await PlaylistModel.findById(context.params.id);

		if (!playlist) {
			throw new HttpException("Playlist not found", HttpStatus.NOT_FOUND);
		}

		const track = await TrackModel.findByIdAndUpdate(context.body.track);

		if (!track) {
			throw new HttpException("Track not found", HttpStatus.NOT_FOUND);
		}

		track.playlists = (track.playlists || []).concat([playlist._id]);

		return await track.save();

	}

	/**
	 * @api {put} /playlists/:playlistId/ Update playlist
	 * @apiDescription Update playlist
	 * @apiGroup Playlists
	 * @apiName playlists.update
	 * @apiParam {playlistId} playlist id
	 * @apiParam {name} playlist name
	 * @apiParam {picture} playlist picture (optional)
	 * @apiVersion 3.0.0
	 * @returns Playlist<Result>
	 */
	@Put("/:id")
	public async update(@Context() context: IContext) {
		const { name, picture } = context.body;
		return await PlaylistModel.findByIdAndUpdate(context.params.id, {
			name,
			picture,
		});
	}

	/**
	 * @api {delete} /playlists/:playlistId/ Delete playlist
	 * @apiDescription Delete playlist
	 * @apiGroup Playlists
	 * @apiName playlists.delete
	 * @apiParam {id} playlist id
	 * @apiVersion 3.0.0
	 * @returns DeleteResult
	 */
	@Delete("/:id")
	public async delete(@Context() context: IContext) {
		return await PlaylistModel.findByIdAndRemove(context.params.id);
	}

	/**
	 * @api {delete} /playlists/:playlistId/:trackId Remove track from playlist
	 * @apiDescription Remove track from playlist
	 * @apiGroup Playlists
	 * @apiName playlists.removeFromPlaylist
	 * @apiParam {playlistId} playlist id
	 * @apiParam {trackId} track id
	 * @apiVersion 3.0.0
	 * @returns Track
	 */
	@Delete("/:id/:track")
	public async removeFromPlaylist(@Context() context: IContext) {
		const track = await TrackModel.findByIdAndRemove(context.params.track);

		if (!track) {
			throw new HttpException("Invalid track", HttpStatus.NOT_FOUND);
		}

		track.playlists = track.playlists.filter((playlist) => context.params.id !== playlist.toString());

		return await track.save();
	}
}
