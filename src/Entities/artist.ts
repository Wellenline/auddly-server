import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToMany } from "typeorm";
import { SpotifyService, Types, KeyTypes } from "../Services/spotify.service";
import { capitalize } from "../utils/captialize";
import { Track } from "./track";

@Entity()
export class Artist extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ nullable: false })
	public name: string;

	@Column()
	public picture: string;

	@CreateDateColumn()
	public created_at: Date;

	@UpdateDateColumn()
	public updated_at: Date;

	public static async findOrCreate(names: string[]) {
		const artists: Artist[] = [];
		for (const name of names.map((n) => capitalize(n).trim())) {
			let artist = await this.findOne({ name });

			if (!artist) {

				artist = new Artist();
				artist.name = name;
				artist.picture = await SpotifyService.instance.picture(Types.ARTIST, KeyTypes.ARTISTS, name);
				await artist.save();
			}

			artists.push(artist);
		}

		return artists;
	}

	public static async random(limit: number = 10, min: number = 0) {
		const total = await this.count();

		const data = [];

		for (let i = 0; i < limit; i++) {
			const skip = Math.floor(Math.random() * (total - min + 1)) + min;
			const doc = await this.find({
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
