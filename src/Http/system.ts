import { Get, Resource, httpException, HttpStatus } from "liquid-http";
import { LibraryService } from "../Services/library.service";
import { InfoModel } from "../Models/info.model";

@Resource("/system")
export class System {
	@Get("/sync")
	public async sync() {
		try {
			const data = await new LibraryService().sync(process.env.MUSIC_PATH, [".mp3", ".flac", ".m4a"]);
			return await InfoModel.findOneAndUpdate({ last_scan: { $ne: undefined } }, data, {
				upsert: true,
				new: true,
			});
		} catch (e) {
			throw httpException(e.toString(), HttpStatus.BAD_REQUEST);

		}
	}

	@Get("/info")
	public async info() {
		try {
			return await InfoModel.findOne();
		} catch (e) {
			throw httpException(e.toString(), HttpStatus.BAD_REQUEST);

		}
	}
}
