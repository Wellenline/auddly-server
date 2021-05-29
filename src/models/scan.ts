import { getModelForClass, prop } from "@typegoose/typegoose";
export class Scan {
	@prop()
	public start: Date;

	@prop()
	public end: Date;

	@prop()
	public last_scan: Date;


	@prop()
	public seconds: number;


	@prop()
	public tracks: number;


	@prop()
	public albums: number;


	@prop()
	public artists: number;

	@prop()
	public size: number;

	@prop()
	public mount: string;
}

export const ScanModel = getModelForClass(Scan);
