import * as mongoose from "mongoose";
import { prop, Typegoose } from "typegoose";

export class Genre extends Typegoose {
	@prop()
	public name: string;

}

export const GenreModel = new Genre().getModelForClass(Genre, {
	existingMongoose: mongoose,
});
