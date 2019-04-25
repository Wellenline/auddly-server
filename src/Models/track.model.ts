import * as mongoose from "mongoose";
import { prop, Ref, Typegoose } from "typegoose";
import { Artist } from "./artist.model";
import { Album } from "./album.model";
import { Genre } from "./genre.model";

export class Track extends Typegoose {
	@prop()
	public title: string;

	@prop({ ref: Artist })
	public artist: Ref<Artist>;

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

	@prop()
	public art: string;

	@prop({ default: false })
	public favourited: boolean;

	@prop()
	public last_play: Date;

	@prop()
	public created_at: Date = new Date();

}

export const TrackModel = new Track().getModelForClass(Track, {
	existingMongoose: mongoose,
});
