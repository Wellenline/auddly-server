import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToMany, JoinTable, JoinColumn, ManyToOne } from "typeorm";
import { Track } from "./track";
import { getLyrics } from "@src/providers/genius";


@Entity()
export class Lyric extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@ManyToOne(type => Track, track => track.id)
	@JoinColumn()
	public track: Track;

	@Column({ type: "text", nullable: true })
	public lyrics: string;

	@CreateDateColumn()
	public created_at: Date;

	@UpdateDateColumn()
	public updated_at: Date;

	public static async findOrCreate(data: { track?: any, name: string, artist: string }) {
		// ok

		console.log("Find lyrics", data);
		let exists = await this.findOne({ track: data.track });

		if (!exists) {
			const lyrics = await getLyrics(data.name, data.artist);

			if (lyrics) {
				exists = await this.create({
					track: data.track,
					lyrics,
				}).save();
			}

		}

		return exists;
	}
}
