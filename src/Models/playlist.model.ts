import * as mongoose from "mongoose";
import { arrayProp, prop, Ref, Typegoose } from "typegoose";
import { Track } from "./track.model";

export class Playlist extends Typegoose {
	@prop()
	public name: string;

	@arrayProp({ items: Track })
	public tracks: Ref<Track[]>;

}

export const PlaylistModel = new Playlist().getModelForClass(Playlist);
