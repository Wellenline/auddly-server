import * as dotenv from "dotenv";
import * as ip from "ip";
import mongoose from "mongoose";

import { bootstrap } from "@wellenline/via";
import { cors, bodyParser, auth } from "./middleware/global";
import { Albums } from "./resources/albums";
import { Genres } from "./resources/genres";
import { Artists } from "./resources/artists";
import { Playlists } from "./resources/playlists";
import { Search } from "./resources/search";
import { Sync } from "./resources/sync";
import { Info } from "./resources/info";
import { Tracks } from "./resources/tracks";
import { watch } from "./common/library";
import { Connect } from "./resources/connect";
import { Insights } from "./resources/insights";

export class App {
	constructor() {
		dotenv.config();
	}

	public async run() {

		const REQUIRED_ENV_VARS = ["MUSIC_PATH", "CACHE_PATH", "MONGO_URL", "PORT", "HOST"];

		for (const key of REQUIRED_ENV_VARS) {
			if (!process.env[key]) {
				console.error(`${key} env variable missing`);
				process.exit(0);
			}
		}

		bootstrap({
			port: (process.env.PORT as number | string),
			middleware: [cors, bodyParser, auth(["/albums/art", "/tracks/play", "/connect"])],
			resources: [Albums, Connect, Artists, Genres, Playlists, Search, Info, Tracks, Sync, Insights],
		});


		console.log("[DEBUG] Establishing connection with database\n");

		mongoose.set("useFindAndModify", false);
		mongoose.connect(process.env.MONGO_URL as string, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}).then(() => {

			const HOST = `${process.env.HOST || ip.address()}${process.env.API_KEY
				&& process.env.API_KEY.length > 0 ? "?key=" + process.env.API_KEY : ""}`;


			console.info(`[DEBUG] Server running: ${HOST}\n`);

			watch();

		}).catch((err) => {
			console.log(err);
			process.exit(0);
		});
	}
}

export default new App().run();
