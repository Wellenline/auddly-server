import { getModelForClass, mongoose, pre, prop, Ref, ReturnModelType } from "@typegoose/typegoose";
import { Album } from "./album";
import { Artist } from "./artist";
import { Genre } from "./genre";
import { Track } from "./track";
import { User } from "./user";

export enum ChartType {
	ALBUM,
	ARTIST,
	TRACK,
	GENRE,
}

export class Chart {
	public static async log(this: ReturnModelType<typeof Chart>, options: { created_by: string, artist?: string, album?: string, track?: string, genre?: string }) {
		await this.create({ ...options, created_at: new Date() });
	}


	@prop({ ref: "User" })
	public created_by: Ref<User>;

	@prop({ ref: "Track" })
	public track: Ref<Track, string>;

	@prop({ ref: "Artist" })
	public artist: Ref<Artist, string>;

	@prop({ ref: "Album" })
	public album: Ref<Album, string>;

	@prop({ ref: "Genre" })
	public genre: Ref<Genre, string>;

	@prop()
	public created_at: Date;
}

export const ChartModel = getModelForClass(Chart);
