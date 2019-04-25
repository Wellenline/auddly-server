import * as mongoose from "mongoose";
import { prop, Ref, Typegoose } from "typegoose";
import { Artist } from "./artist.model";

export class Album extends Typegoose {
	@prop()
	public name: string;

	@prop({ ref: Artist })
	public artist: Ref<Artist>;

	@prop()
	public art: string;

	@prop()
	public created_at: Date = new Date();

}

export const AlbumModel = new Album().getModelForClass(Album, {
	existingMongoose: mongoose,
});
