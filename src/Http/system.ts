import { LibraryService } from "../Services/library.service";
import { InfoModel } from "../Models/info.model";
import { Resource, Get, HttpStatus } from "@wellenline/via";

@Resource("/system")
export class System {
	@Get("/sync")
	public async sync() {
		try {
			return await LibraryService.instance.sync(process.env.MUSIC_PATH, [".mp3", ".flac", ".m4a"]);

		} catch (e) {
			console.error(e);
			return {
				success: false,
				error: e.toString(),
			};
		}
	}

	@Get("/info")
	public async info() {
		return await InfoModel.findOne();
	}
}
