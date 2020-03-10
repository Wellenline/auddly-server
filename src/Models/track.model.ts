import { prop, Ref, arrayProp, ReturnModelType, getModelForClass } from "@typegoose/typegoose";
import { Artist } from "./artist.model";
import { Album } from "./album.model";
import { Genre } from "./genre.model";

export class Track {
	public static async random(this: ReturnModelType<typeof Track>, limit: number = 10, min: number = 0) {
		const total = await this.estimatedDocumentCount();

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

			}]).skip(skip).limit(1);

			if (doc) {
				data.push(doc);
			}
		}

		return data;
	}

	public static async findOrCreate(this: ReturnModelType<typeof Track>, data: Track | any) {
		let track = await TrackModel.findOne({ name: data.name, album: data.album });

		if (!track) {
			track = await TrackModel.create(data);
		}

		return track;
	}

	@prop()
	public name: string;

	@arrayProp({ itemsRef: Artist })
	public artists: Ref<Artist[]>;

	@prop()
	public artist: string;

	@prop({ ref: Album })
	public album: Ref<Album>;

	@prop({ ref: Genre })
	public genre: Ref<Genre>;

	@prop()
	public duration: number;

	@prop({ default: 0 })
	public plays: number;

	@prop()
	public path: string;

	@prop({ default: false })
	public favourited: boolean;

	@prop()
	public last_play: Date;

	@prop()
	public year: number;

	@prop()
	public lossless: boolean;

	@prop()
	public created_at: Date = new Date();

	@prop()
	public updated_at: Date = new Date();

}

export const TrackModel = getModelForClass(Track);
