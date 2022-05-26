import { Can } from "@src/middleware/access";
import { PlaylistModel } from "@src/models/playlist";
import { TrackModel } from "@src/models/track";
import { Resource, Get, Post, Context, IContext, Put, HttpException, HttpStatus, Delete, Before } from "@wellenline/via";
@Resource("/playlists")
export class Playlists {

	@Get("/")
	@Before(Can("read:playlist"))
	public async index(@Context() context: IContext) {
		const skip = context.query.skip || 0;
		const limit = context.query.limit || 20;

		const query = {
			created_by: context.payload.id
		}
		return {
			data: await PlaylistModel.find(query).skip(skip).limit(limit),
			total: await PlaylistModel.countDocuments(query),
			metadata: {
				...context.query,
				skip,
				limit,
			},
		};
	}

	@Get("/:id")
	@Before(Can("read:playlist"))
	public async view(@Context() context: IContext) {
		return await PlaylistModel.findById(context.params.id).populate([{
			path: "tracks",
			populate: [{
				path: "album",
				populate: [{
					path: "artist",
				}],
			}, {
				path: "genre",
			}, {
				path: "artists",

			}]
		}, {
			path: "created_by",
		}]);
	}

	@Post("/")
	@Before(Can("create:playlist"))
	public async create(@Context() context: IContext) {
		return await PlaylistModel.create({ ...context.body, created_by: context.payload.id, created_at: new Date(), updated_at: new Date() });
	}

	@Post("/:id")
	@Before(Can("update:playlist"))
	public async add(@Context() context: IContext) {

		const playlist = await PlaylistModel.findOne({ created_by: context.payload.id, _id: context.params.id });

		if (!playlist) {
			throw new HttpException("Playlist not found", HttpStatus.NOT_FOUND);
		}

		if (playlist.tracks.map((track) => track.toString()).includes(context.body.track)) {
			throw new HttpException("Track already in playlist", HttpStatus.BAD_REQUEST);
		}

		playlist.tracks = (playlist.tracks || []).concat([context.body.track]);

		return await playlist.save();

	}

	@Put("/:id")
	@Before(Can("update:playlist"))
	public async update(@Context() context: IContext) {
		const { name, picture } = context.body;
		return await PlaylistModel.findOneAndUpdate({ _id: context.params.id, created_by: context.payload.id }, {
			name,
			picture,
		});
	}


	@Delete("/:id")
	@Before(Can("delete:playlist"))
	public async delete(@Context() context: IContext) {
		return await PlaylistModel.findOneAndRemove({ _id: context.params.id, created_by: context.payload.id });
	}


	@Delete("/:id/:track")
	@Before(Can("update:playlist"))
	public async removeFromPlaylist(@Context() context: IContext) {
		const playlist = await PlaylistModel.findById(context.params.id);

		if (!playlist) {
			throw new HttpException("Invalid playlist", HttpStatus.NOT_FOUND);
		}
		if (playlist.tracks) {
			playlist.tracks = playlist.tracks.filter((track) => context.params.track !== track.toString());

			return await playlist.save();
		}
	}
}
