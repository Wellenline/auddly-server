import { getArtistMetadata } from "@src/providers/lastfm";
import { getPicture, KeyType, Type } from "@src/providers/spotify";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToMany, AfterLoad } from "typeorm";

@Entity()
export class Artist extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ nullable: false })
	public name: string;

	@Column({ nullable: true })
	public picture: string;

	@Column("simple-array", { nullable: true })
	public tags: string[];

	@Column("simple-array", { nullable: true })
	public similar: string[];

	@Column("text", { nullable: true })
	public bio: string;

	@CreateDateColumn()
	public created_at: Date;

	@UpdateDateColumn()
	public updated_at: Date;

	public static async findOrCreate(names: string[]) {
		const artists: Artist[] = [];
		for (const name of names.map((n) => n.trim())) {
			let artist = await this.findOne({ name });

			if (!artist) {

				artist = new Artist();
				artist.name = name;
				artist.picture = await getPicture(Type.ARTIST, KeyType.ARTISTS, name);

				const response = await getArtistMetadata(name);
				if (response) {

					if (response.bio) {
						artist.bio = response.bio;
					}

					if (response.tags) {
						artist.tags = response.tags;
					}

					if (response.similar) {
						artist.similar = response.similar;
					}
				}

				await artist.save();
			}

			artists.push(artist);
		}

		return artists;
	}

	public static async random(limit: number = 10, min: number = 0) {
		const total = await this.count();

		const data: Artist[] = [];

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
