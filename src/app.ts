import * as dotenv from "dotenv";
import * as ip from "ip";
import * as qrcode from "qrcode";
import * as mongoose from "mongoose";
import { bootstrap, app } from "@wellenline/via";
import { cors, bodyParser, auth } from "./Middleware/global";
import { LibraryService } from "./Services/library.service";
import { Albums } from "./Http/albums";
import { Artists } from "./Http/artists";
import { Genres } from "./Http/genres";
import { Playlists } from "./Http/playlists";
import { Search } from "./Http/search";
import { System } from "./Http/system";
import { Tracks } from "./Http/tracks";

export class App {
	constructor() {
		dotenv.config();
		(<any>mongoose).Promise = global.Promise;
		mongoose.set("useFindAndModify", false);

		bootstrap({
			port: (process.env.PORT as number | string),
			middleware: [cors, bodyParser, auth(["art", "play"])],
			resources: [Albums, Artists, Genres, Playlists, Search, System, Tracks],
		});

		mongoose.connect(process.env.MONGO_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}).then(() => {
			LibraryService.instance.sync(process.env.MUSIC_PATH, [".mp3", ".flac", ".m4a"]);
		});

		const HOST = process.env.HOST || ip.address();
		qrcode.toString(`${HOST}?key=${process.env.API_KEY}`, { type: "terminal" }).then((code) => {
			console.log(code);
		}).catch((err) => {
			console.error("Failed to generate QR code");
		});

		console.info(`[DEBUG] Server running: ${HOST}?key=${process.env.API_KEY}`);
	}
}

export default new App();
