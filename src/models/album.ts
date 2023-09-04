import { createHash } from "crypto";
import { writeFileSync } from "fs";
import { getPicture, KeyType, Type } from "@src/providers/spotify";
import { getModelForClass, mongoose, post, pre, prop, Ref, ReturnModelType } from "@typegoose/typegoose";
import { Artist } from "./artist";

export interface IAlbumData {
	album: string;
	artists: Artist[] | Ref<Artist>[];
	artist: Artist | Ref<Artist>;
	year: number;
	picture: Buffer | boolean | string;
}
@post<Album>("init", (album) => {
	if (album.picture && !album.picture.includes("http")) {
		album.picture = `${process.env.HOST}${album.picture}`;
	}
})
export class Album {
	public static async random(this: ReturnModelType<typeof Album>, size: number = 5) {
		const results = await this.aggregate([
			{ $sample: { size } },
			{
				$lookup:
				{
					from: "artists",
					localField: "artist",
					foreignField: "_id",
					as: "artist",
				},
			},
			{ $unwind: { path: "$artist" } },

		]);

		return results.map((album) => {
			if (album.picture && !album.picture.includes("http")) {
				album.picture = `${process.env.HOST}${album.picture}`;
			}

			return album;
		});
	}
	public static async findOrCreate(this: ReturnModelType<typeof Album>, data: IAlbumData) {
		let album = await this.findOne({ name: data.album });

		if (!album) {
			if (data.picture && typeof data.picture === "object") {
				const id = createHash("md5").update(`${data.artist}-${data.album}`).digest("hex");
				writeFileSync(`${process.env.CACHE_PATH}/album-art/${id}.png`, data.picture);
				data.picture = `/albums/art/${id}.png`;
			} else {
				data.picture = await getPicture(Type.ALBUM, KeyType.ALBUMS, `album:${data.album} artist:${data.artist}`) as string;
			}

			album = await this.create({
				artists: data.artists,
				picture: data.picture,
				artist: data.artist,
				name: data.album,
				year: data.year,
				created_at: new Date(),
				updated_at: new Date(),
			});
		}

		return album;
	}


	@prop()
	public name: string;

	@prop()
	public album: string;

	@prop({ ref: () => Artist })
	public artist: Ref<Artist>;

	@prop({ ref: () => Artist })
	public artists: Ref<Artist>[];

	@prop()
	public picture: string;

	@prop()
	public year?: number;

	@prop()
	public updated_at: Date;

	@prop()
	public created_at: Date;
}

export const AlbumModel = getModelForClass(Album);
