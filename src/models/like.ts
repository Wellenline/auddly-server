import { getModelForClass, prop, Ref, ReturnModelType, setGlobalOptions, Severity } from "@typegoose/typegoose";
import { Track } from "./track";
import { User } from "./user";

export class Like {
	@prop({ ref: "Track" })
	public track: Ref<Track>;

	@prop({ ref: "User" })
	public created_by: Ref<User>;

	@prop({ default: new Date() })
	public created_at: Date;

}

export const LikeModel = getModelForClass(Like);
