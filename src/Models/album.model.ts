import { prop, Ref, Typegoose, ModelType, staticMethod, arrayProp, pre, post } from "typegoose";
import { Artist } from "./artist.model";
import { capitalize } from "../utils/captialize";
import { SpotifyService, KeyTypes, Types } from "../Services/spotify.service";
import { createHash } from "crypto";
import { writeFileSync } from "fs";
// tslint:disable-next-line:only-arrow-functions
@post<Album>("init", function (data) { // or @pre(this: Car, 'save', ...
	if (this.picture && !this.picture.includes("http")) {
		this.picture = `${process.env.HOST}${this.picture}`;
	}

	console.dir(data.picture);
	// next();
})
export class Album extends Typegoose {
	@staticMethod
	public static async findOrCreate(this: ModelType<Album> & typeof Album, data: {
		album: string, artist: { name: string, id: any }, artists: any[], year: number, picture: Buffer | false | string,
	}) {
		let album = await this.findOne({ name: capitalize(data.album) });
		if (!album) {

			if (data.picture) {
				const id = createHash("md5").update(`${data.artist.id}-${data.album}`).digest("hex");
				writeFileSync(`${process.env.ART_PATH}/${id}`, data.picture);
				data.picture = `/albums/art/${id}`;
			} else {
				data.picture = await SpotifyService.instance.picture(Types.ALBUM, KeyTypes.ALBUMS, `album:${data.album} artist:${data.artist.name}`);
			}

			album = await this.create({
				name: data.album,
				year: data.year,
				artist: data.artist.id,
				artists: data.artists,
				created_at: new Date(),
				picture: data.picture,
			});
		}

		return album;
	}

	@prop()
	public name: string;

	@prop({ ref: Artist })
	public artist: Ref<Artist>;

	@arrayProp({ itemsRef: Artist })
	public artists: Ref<Artist[]>;

	@prop()
	public picture: string;

	@prop()
	public year: number;

	@prop()
	public created_at: Date = new Date();

}

export const AlbumModel = new Album().getModelForClass(Album);
