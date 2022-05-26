import { prop, getModelForClass } from "@typegoose/typegoose";

export class Role {

	@prop()
	public name: string;

	@prop({ type: String })
	public scopes: string[];

}

export const RoleModel = getModelForClass(Role);
