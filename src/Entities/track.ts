import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToMany, JoinTable, JoinColumn, ManyToOne } from "typeorm";
import { SpotifyService, Types, KeyTypes } from "src/Services/spotify.service";
import { capitalize } from "src/utils/captialize";
import { Artist } from "./artist";
import { Album } from "./album";
import { Genre } from "./genre";
import { Playlist } from "./playlist";


@Entity()
export class Track extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ nullable: false })
	public name: string;

	@ManyToMany(type => Artist)
	@JoinTable()
	public artists: Artist[];

	@ManyToMany(type => Playlist, { cascade: true })
	@JoinTable()
	public playlists: Playlist[];

	/*@ManyToOne(type => Artist, artist => artist.id)
	@JoinTable()
	public artist: Artist;
	*/
	@Column()
	public artist: string;

	@ManyToOne(type => Album)
	@JoinColumn()
	public album: Album;

	@ManyToOne(type => Genre, genre => genre.id)
	@JoinColumn()
	public genre: Genre;

	@Column()
	public path: string;

	@Column({ default: 0 })
	public plays: number;

	@Column({ type: "float" })
	public duration: number;

	@Column({ default: false })
	public liked: boolean;

	@Column({ nullable: true })
	public last_play: Date;

	@Column({ nullable: true })
	public year: number;

	@Column({ default: false })
	public lossless: boolean;

	@CreateDateColumn()
	public created_at: Date;

	@UpdateDateColumn()
	public updated_at: Date;

	public static async findOrCreate(data: Track) {
		// ok
		let track = await this.findOne({ name: data.name, album: data.album });

		if (!track) {
			track = await this.create(data).save();
		}

		return track;
	}

	public static async random(limit: number = 10, min: number = 0) {
		const total = await this.count();

		const data = [];

		for (let i = 0; i < limit; i++) {
			const skip = Math.floor(Math.random() * (total - min + 1)) + min;
			const doc = await this.find({
				join: {
					alias: "track",
					leftJoinAndSelect: {
						artists: "track.artists",
						album: "track.album",
						genre: "track.genre",
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
