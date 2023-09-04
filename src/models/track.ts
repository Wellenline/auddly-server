import { getModelForClass, mongoose, pre, prop, Ref, ReturnModelType } from "@typegoose/typegoose";
import { HttpException, HttpStatus } from "@wellenline/via";
import { Album } from "./album";
import { Artist } from "./artist";
import { Genre } from "./genre";
import { LikeModel } from "./like";
import { Playlist } from "./playlist";

export class Features {

	@prop()
	public danceability: number;

	@prop()
	public energy: number;

	@prop()
	public key: number;

	@prop()
	public loudness: number;

	@prop()
	public mode: number;

	@prop()
	public speechiness: number;

	@prop()
	public acousticness: number;

	@prop()
	public instrumentalness: number;

	@prop()
	public liveness: number;

	@prop()
	public valence: number;

	@prop()
	public tempo: number;

	@prop()
	public type: string;

	@prop()
	public spotify_id: string;

	@prop()
	public uri: string;

	@prop()
	public track_href: string;

	@prop()
	public analysis_url: string;

	@prop()
	public duration_ms: number;

	@prop()
	public time_signature: number;
}
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

	}
	public static async findOrCreate(this: ReturnModelType<typeof Track>, data: any) {
		let track = await this.findOne({ name: data.name, album: data.album });

		if (!track) {

			track = await this.create(data);
		}

		return track;
	}

	public static async like(this: ReturnModelType<typeof Track>, id: string, user: string) {
		const track = await this.findById(id);

		if (!track) {
			throw new HttpException("Track not found", HttpStatus.NOT_FOUND);
		}

		// check if user has already liked post
		const like = await LikeModel.findOne({ created_by: user, track: track._id });

		if (like) {
			await like.deleteOne();
		} else {
			await LikeModel.create({
				track: id,
				created_by: user,
				created_at: new Date()
			});
		}

		return {
			success: true,
		};
	}

	@prop()
	public name: string;

	@prop()
	public artist: string;

	@prop({ ref: "Artist" })
	public artists: Ref<Artist>[];

	@prop({ ref: "Album" })
	public album: Ref<Album>;

	@prop({ ref: "Genre" })
	public genre?: Ref<Genre>;

	@prop()
	public path: string;

	@prop({ default: 0 })
	public plays?: number;

	@prop({ default: 0 })
	public duration: number;

	@prop({ default: false })
	public liked?: boolean;

	@prop()
	public last_play?: Date;

	@prop()
	public year: number;

	@prop()
	public number!: number;

	@prop({ default: false })
	public lossless: boolean;

	@prop()
	public features?: Features

	@prop()
	public updated_at: Date;

	@prop()
	public created_at: Date;

}

export const TrackModel = getModelForClass(Track);
