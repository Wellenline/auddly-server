import { getModelForClass, mongoose, pre, prop, Ref, ReturnModelType } from "@typegoose/typegoose";
import { Album } from "./album";
import { Artist } from "./artist";
import { Genre } from "./genre";
import { Playlist } from "./playlist";


export class Track {
	public static async random(this: ReturnModelType<typeof Track>, size: number = 5, min = 0) {

		const results = await this.aggregate([
			{ $sample: { size } },
			{
				$lookup:
				{
					from: "artists",
					localField: "artists",
					foreignField: "_id",
					as: "artists",
				},
			},
			{
				$lookup:
				{
					from: "albums",
					localField: "album",
					foreignField: "_id",
					as: "album",
				},
			},

			{
				$lookup:
				{
					from: "playlists",
					localField: "playlists",
					foreignField: "_id",
					as: "playlists",
				},
			},

			{ $unwind: { path: "$album" } },


			{
				$lookup:
				{
					from: "artists",
					localField: "album.artist",
					foreignField: "_id",
					as: "album.artist",
				},
			},

			{ $unwind: { path: "$album.artist" } },


		]);

		return results.map((track) => {
			if (track.album.picture && !track.album.picture.includes("http")) {
				track.album.picture = `${process.env.HOST}${track.album.picture}`;
			}

			return track;
		});
		/*const total = await this.estimatedDocumentCount();

		const data = [];

		for (let i = 0; i < limit; i++) {
			const skip = Math.floor(Math.random() * (total - min + 1)) + min;
			const doc = await this.findOne().populate([{
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
			}]).skip(skip).limit(1);

			if (doc) {
				data.push(doc);
			}
		}

		return data;*/
	}
	public static async findOrCreate(this: ReturnModelType<typeof Track>, data: Track) {
		let track = await this.findOne({ name: data.name, album: data.album });

		if (!track) {
			track = await this.create(data);
		}

		return track;
	}

	@prop()
	public name: string;

	@prop()
	public artist: string;

	@prop({ ref: "Artist" })
	public artists: Ref<Artist>[];

	@prop({ ref: "Playlist" })
	public playlists: Ref<Playlist, string>[];

	@prop({ ref: "Album" })
	public album: Ref<Album>;

	@prop({ ref: "Genre" })
	public genre: Ref<Genre>;

	@prop()
	public path: string;

	@prop({ default: 0 })
	public plays: number;

	@prop({ default: 0 })
	public duration: number;

	@prop({ default: false })
	public liked: boolean;

	@prop()
	public last_play: Date;

	@prop()
	public year: number;

	@prop()
	public number: number;

	@prop({ default: false })
	public lossless: boolean;

	@prop()
	public updated_at: Date;

	@prop()
	public created_at: Date;

}

export const TrackModel = getModelForClass(Track);
