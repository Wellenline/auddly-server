import { SpotifyService, KeyTypes, Types } from "../Services/spotify.service";
import { prop, Typegoose, ReturnModelType, getModelForClass } from "@typegoose/typegoose";
import { capitalize } from "../utils/captialize";

export class Artist {
	public static async random(this: ReturnModelType<typeof Artist>, limit: number = 10, min: number = 0) {
		const total = await this.estimatedDocumentCount();

		const data = [];

		for (let i = 0; i < limit; i++) {
			const skip = Math.floor(Math.random() * (total - min + 1)) + min;
			const doc = await this.findOne().skip(skip).limit(1);

			if (doc) {
				data.push(doc);
			}
		}

		return data;
	}

	public static async findOrCreate(this: ReturnModelType<typeof Artist>, names: string[]) {
		const artists: any[] = [];
		for (const name of names.map((n) => capitalize(n).trim())) {
			let artist = await this.findOne({ name });

			if (!artist) {
				artist = await this.create({
					name,
					created_at: new Date(),
					picture: await SpotifyService.instance.picture(Types.ARTIST, KeyTypes.ARTISTS, name),
				});
			}

			artists.push(artist);
		}

		return artists;
	}
	@prop()
	public name: string;

	@prop()
	public picture: string;

	@prop()
	public created_at: Date = new Date();

}

export const ArtistModel = getModelForClass(Artist);
