import { prop, Ref, arrayProp, ReturnModelType, getModelForClass } from "@typegoose/typegoose";
import { Artist } from "./artist.model";
import { Album } from "./album.model";
import { Genre } from "./genre.model";

export class Track {
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
