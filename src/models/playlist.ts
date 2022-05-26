import { getModelForClass, mongoose, pre, prop, Ref, ReturnModelType } from "@typegoose/typegoose";
import { Track } from "./track";
import { User } from "./user";


export class Playlist {
	@prop()
	public name: string;

	@prop()
	public picture: string;

	@prop({ ref: "User" })
	public created_by: Ref<User>;

	@prop({ ref: "Track", default: [] })
	public tracks: Ref<Track, string>[];

	@prop()
	public updated_at: Date;

	@prop()
	public created_at: Date;
}

export const PlaylistModel = getModelForClass(Playlist);
