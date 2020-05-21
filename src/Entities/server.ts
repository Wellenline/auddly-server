import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Server extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public start: Date;

	@Column()
	public end: Date;

	@Column()
	public last_scan: Date;

	@Column({ type: "float" })
	public seconds: number;

	@Column()
	public tracks: number;

	@Column()
	public albums: number;

	@Column()
	public artists: number;

	@Column()
	public size: number;

	@Column()
	public mount: string;

}
