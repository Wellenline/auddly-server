import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToMany, JoinTable, JoinColumn, ManyToOne } from "typeorm";
import { Track } from "./track";
import { getLyrics } from "@src/providers/genius";


@Entity()
export class Lyric extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;


	@Column({ type: "text", nullable: true })
	public text: string;

	@CreateDateColumn()
	public created_at: Date;

	@UpdateDateColumn()
	public updated_at: Date;

	public static async findOrCreate(data: { track?: any, name: string, artist: string }) {
		// ok

		const track = await Track.findOne(data.track);

		if (!track) {
			return false;
		}

		console.log("Find lyrics", data);
		const lyrics = await getLyrics(data.name, data.artist);

		if (lyrics) {
			const lyric = await this.create({
				text: lyrics,
			}).save();
			track.lyrics = lyric;
			return await track.save();
		}

	}
}
