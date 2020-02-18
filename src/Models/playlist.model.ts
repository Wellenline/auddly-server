import { arrayProp, prop, Ref, Typegoose } from "typegoose";
import { Track } from "./track.model";

export class Playlist extends Typegoose {
	@prop()
	public name: string;

	@arrayProp({ itemsRef: Track })
	public tracks: Ref<Track[]>;

	@prop()
	public updated_at: Date;

	@prop()
	public created_at: Date;
}

export const PlaylistModel = new Playlist().getModelForClass(Playlist);
