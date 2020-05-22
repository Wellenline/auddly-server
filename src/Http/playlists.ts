import { GenreModel } from "../Models/genre.model";
import { Resource, Get, Post, Context, IContext, Put, HttpException, HttpStatus, Delete } from "@wellenline/via";
import { PlaylistModel } from "../Models/playlist.model";
import { TrackModel } from "../Models/track.model";
/**
 * This is a mess
 */
@Resource("/playlists")
export class Playlists {
	@Get("/")
	public async index() {
		const playlists = [];
		const favourites = await TrackModel.find({ favourited: true }).populate("album").sort("-updated_at").limit(4);

		playlists.push({
			_id: "FAVOURITES",
			readonly: true,
			name: "Favourites",
			tracks: await TrackModel.countDocuments({ favourited: true }),
			pictures: favourites.map((track: any) => {
				return track.album.picture;
			}),
		});

		const data = await PlaylistModel.find({}).populate([{
			path: "tracks",
			populate: "album artists",
		}]);

		return playlists.concat(data.map((playlist) => {
			return {
				_id: playlist._id,
				name: playlist.name,
				tracks: (playlist.tracks as any).length,
				pictures: (playlist.tracks as any).map((track: any) => {
					return track.album.picture;
				}),
			};
		}));
	}

	@Get("/:id")
	public async playlist(@Context() context: IContext) {
		return await PlaylistModel.findById(context.params.id).populate([{
			path: "tracks",
			populate: "album artists",
		}]);
	}

	@Post("/")
	public async create(@Context() context: IContext) {
		return await PlaylistModel.create({ ...context.body, created_at: new Date(), updated_at: new Date() });
	}

	@Get("/:id/:track")
	public async updatePlaylist(@Context() context: IContext) {
		const playlist = await PlaylistModel.findById(context.params.id);

		if (!playlist) {
			throw new HttpException("Invalid playlist", HttpStatus.NOT_FOUND);
		}

		const index = (playlist.tracks as any).findIndex((track: any) => track.toString() === context.params.track);

		if (index > -1) {
			(playlist.tracks as any[]).splice(index, 1);
		} else {
			(playlist.tracks as any[]).push(context.params.track);
		}

		return await playlist.save();
	}

	@Put("/:id")
	public async update(@Context() context: IContext) {
		return await PlaylistModel.findByIdAndUpdate(context.params.id, { ...context.body, updated_at: new Date() });
	}

	@Delete("/:id")
	public async delete(@Context() context: IContext) {
		return await PlaylistModel.findByIdAndDelete(context.params.id);
	}
}
