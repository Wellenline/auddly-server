import { Track } from "./track.model";
import { getModelForClass, prop, arrayProp, Ref } from "@typegoose/typegoose";

export class Playlist {
	@prop()
	public name: string;

	@arrayProp({ itemsRef: Track })
	public tracks: Ref<Track[]>;

	@prop()
	public updated_at: Date;

	@prop()
	public created_at: Date;
}

export const PlaylistModel = getModelForClass(Playlist);
