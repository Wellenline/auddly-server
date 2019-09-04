import { SpotifyService, KeyTypes, Types } from "../services/spotify.service";
import { prop, Typegoose, staticMethod, ModelType } from "typegoose";
import { capitalize } from "../utils/captialize";

export class Artist extends Typegoose {
	@staticMethod
	public static async findOrCreate(this: ModelType<Artist> & typeof Artist, names: string[]) {
		const artists: any[] = [];
		for (let name of names.map((n) => capitalize(n).trim())) {
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

export const ArtistModel = new Artist().getModelForClass(Artist);
