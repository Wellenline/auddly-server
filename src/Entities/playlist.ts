import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";

@Entity()
export class Playlist extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ nullable: false })
	public name: string;

	@Column({ nullable: true })
	public picture: string;

	@CreateDateColumn()
	public created_at: Date;

	@UpdateDateColumn()
	public updated_at: Date;

}
