import { getModelForClass, mongoose, pre, prop, Ref, ReturnModelType } from "@typegoose/typegoose";


export class Playlist {
	@prop()
	public name: string;

	@prop()
	public picture: string;

	@prop()
	public updated_at: Date;

	@prop()
	public created_at: Date;
}

export const PlaylistModel = getModelForClass(Playlist);
