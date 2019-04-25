import * as mongoose from "mongoose";

import { prop, Typegoose } from "typegoose";

export class Artist extends Typegoose {
	@prop()
	public name: string;

	@prop()
	public picture: string;

	@prop()
	public created_at: Date = new Date();

}

export const ArtistModel = new Artist().getModelForClass(Artist, {
	existingMongoose: mongoose,
});
