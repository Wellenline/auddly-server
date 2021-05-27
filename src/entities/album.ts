import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, ManyToOne, AfterLoad } from "typeorm";
import { createHash } from "crypto";
import { writeFileSync } from "fs";
import { Artist } from "./artist";
import { getPicture, KeyType, Type } from "@src/providers/spotify";

export interface IAlbumData {
	album: string;
	artist: Artist;
	year: number;
	picture: Buffer | boolean | string;
}

@Entity()
export class Album extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ nullable: false })
	public name: string;

	@ManyToOne(type => Artist, artist => artist.id)
	@JoinColumn()
	public artist: Artist;

	@Column({ nullable: true })
	public picture: string;

	@Column({ nullable: true })
	public year: number;

	@CreateDateColumn()
	public created_at: Date;

	@UpdateDateColumn()
	public updated_at: Date;

	@AfterLoad()
	updateAlbumArtEndpoint() {
		if (this.picture && !this.picture.includes("http")) {
			this.picture = `${process.env.HOST}${this.picture}`;
		}
	}

	public static async findOrCreate(data: IAlbumData) {
		let album = await this.findOne({ name: data.album });

		if (!album) {
			if (data.picture && typeof data.picture === "object") {
				const id = createHash("md5").update(`${data.artist.id}-${data.album}`).digest("hex");
				writeFileSync(`${process.env.CACHE_PATH}/album-art/${id}.png`, data.picture);
				data.picture = `/albums/art/${id}.png`;
			} else {
				data.picture = await getPicture(Type.ALBUM, KeyType.ALBUMS, `album:${data.album} artist:${data.artist.name}`) as string;
			}

			album = new Album();
			album.artist = data.artist;
			if (data.picture) {
				album.picture = data.picture;
			}
			album.name = data.album;
			album.year = data.year;

			await album.save();
		}


		return album;

	}
	// this is stupid af
	public static async random(limit: number = 10, min: number = 0) {
		const total = await this.count();

		const data: Album[] = [];

		for (let i = 0; i < limit; i++) {
			const skip = Math.floor(Math.random() * (total - min + 1)) + min;
			const doc = await this.find({
				join: {
					alias: "album",
					leftJoinAndSelect: {
						artist: "album.artist",
					}
				},
				take: 1,
				skip,
			});

			if (doc && doc[0] && !data.includes(doc[0])) {
				data.push(doc[0]);
			}
		}

		return data;

	}
}
