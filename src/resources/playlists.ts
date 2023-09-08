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
		};
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

	@Get("/suggest")
	@Before(Can("read:playlist"))
	public async suggest(@Context() context: IContext) {
		const DEFAULT_PLAYLIST_SIZE = 150;
		const DEFAULT_AGGREGATION = [
			{ $sample: { size: DEFAULT_PLAYLIST_SIZE } },
			{
				$lookup: {
					from: "albums",
					localField: "album",
					foreignField: "_id",
					as: "album",
				},
			},
			{
				$lookup: {
					from: "artists",
					localField: "artists",
					foreignField: "_id",
					as: "artists",
				},
			},
			{ $unwind: { path: "$album" } },
			{
				$lookup: {
					from: "artists",
					localField: "album.artist",
					foreignField: "_id",
					as: "album.artist",
				},
			},
			{ $unwind: { path: "$album.artist" } },
		];

		const getTracksByFeatures = async (features: any) => {
			const name = features.name;
			delete features.name;
			const tracks = await TrackModel.aggregate([
				{ $match: features },
				...DEFAULT_AGGREGATION,
			]);
			return {
				tracks,
				playlistName: `${name} Tracks`,
			};
		};

		const playlists = await Promise.all([
			getTracksByFeatures({
				name: "Danceable",
				"features.danceability": { $gt: 0.5 },
			}),
			getTracksByFeatures({
				name: "Energetic",
				"features.energy": { $gt: 0.8 },
			}),
			getTracksByFeatures({
				name: "Happy",
				"features.valence": { $gt: 0.8 },
			}),
			getTracksByFeatures({
				name: "Sad",
				valence: { $lt: 0.3 },
				energy: { $lt: 0.5 },
			}),
			getTracksByFeatures({
				name: "Emotional",
				valence: { $lt: 0.5 },
				energy: { $lt: 0.7 },
			}),
			getTracksByFeatures({
				name: "Chill",
				"features.energy": { $lt: 0.3 },
			}),
			getTracksByFeatures({
				name: "Instrumental",
				"features.instrumentalness": { $gt: 0.8 },
			}),
			getTracksByFeatures({
				name: "Upbeat",
				"features.valence": { $gt: 0.7 },
				"features.energy": { $gt: 0.7 },
			}),
			getTracksByFeatures({
				name: "Mellow",
				"features.valence": { $lt: 0.5 },
				"features.energy": { $lt: 0.5 },
			}),
			getTracksByFeatures({
				name: "Fast",
				"features.tempo": { $gt: 120 },
			}),
			{
				tracks: await TrackModel.aggregate([
					{ $sort: { plays: -1 } },
					{ $limit: DEFAULT_PLAYLIST_SIZE },
					...DEFAULT_AGGREGATION,
				]),
				playlistName: "Popular Tracks",
			},
			{
				tracks: await TrackModel.aggregate([
					...DEFAULT_AGGREGATION,
					{ $limit: DEFAULT_PLAYLIST_SIZE },
					{ $sort: { created_at: -1 } },
				]),
				playlistName: "Recently Added Tracks",
			},
		]);

		playlists.forEach((playlist: any) => {
			playlist.tracks.forEach((track: any) => {
				if (track.album.picture && !track.album.picture.includes("http")) {
					track.album.picture = `${process.env.HOST}${track.album.picture}`;
				}
			});

			playlist.name = playlist.playlistName;
			delete playlist.playlistName;
		});

		return playlists;


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
