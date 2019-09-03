import { prop, Ref, Typegoose, ModelType, staticMethod } from "typegoose";
import { Artist } from "./artist.model";
import { capitalize } from "../utils/captialize";
import { SpotifyService, KeyTypes, Types } from "../Services/spotify.service";

export class Album extends Typegoose {
	@staticMethod
	public static async findOrCreate(this: ModelType<Album> & typeof Album, name: string, artist: { name: string, id: any }) {

		let album = await this.findOne({ name: capitalize(name) });
		if (!album) {
			album = await this.create({
				name,
				artist: artist.id,
				created_at: new Date(),
				art: await SpotifyService.instance.picture(Types.ALBUM, KeyTypes.ALBUMS, `album:${name} artist:${artist.name}`),
			});
		}

		return album;
	}

	@prop()
	public name: string;

	@prop({ ref: Artist })
	public artist: Ref<Artist>;

	@prop()
	public art: string;

	@prop()
	public created_at: Date = new Date();

}

export const AlbumModel = new Album().getModelForClass(Album);
