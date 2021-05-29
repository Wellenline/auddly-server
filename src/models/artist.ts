import { getArtistMetadata } from "@src/providers/lastfm";
import { getPicture, Type, KeyType } from "@src/providers/spotify";
import { getModelForClass, pre, prop, Ref, ReturnModelType } from "@typegoose/typegoose";
import { createHash } from "crypto";


export class Artist {
	public static async random(this: ReturnModelType<typeof Artist>, size: number = 5) {
		return this.aggregate([
			{ $sample: { size } },

		]);
	}
	public static async findOrCreate(this: ReturnModelType<typeof Artist>, names: string[]) {
		const artists = [];
		for (const name of names) {

			const hash = createHash("md5").update(name.toLowerCase().replace(/ /g, "_").trim()).digest("hex");

			let artist = await this.findOne({ hash });

			if (!artist) {
				const picture = await getPicture(Type.ARTIST, KeyType.ARTISTS, name);
				const metadata = await getArtistMetadata(name);

				artist = await this.create({
					name,
					hash,
					picture,
					tags: metadata?.tags || [],
					similar: metadata?.similar || [],
					bio: metadata?.bio || "",
					created_at: new Date(),
					updated_at: new Date(),
				});
			}

			artists.push(artist._id);
		}

		return artists;
	}

	@prop()
	public name: string;

	@prop()
	public hash: string;

	@prop()
	public picture: string;

	@prop({ type: [String] })
	public tags: string[];

	@prop({ type: [String] })
	public similar: string[];

	@prop()
	public bio: string;

	@prop()
	public updated_at: Date;

	@prop()
	public created_at: Date;
}

export const ArtistModel = getModelForClass(Artist);
