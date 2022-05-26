import * as dotenv from "dotenv";
import * as ip from "ip";
import mongoose from "mongoose";

import { bootstrap } from "@wellenline/via";
import { cors, bodyParser } from "./middleware/global";
import { Albums } from "./resources/albums";
import { Genres } from "./resources/genres";
import { Artists } from "./resources/artists";
import { Playlists } from "./resources/playlists";
import { Search } from "./resources/search";
import { Sync } from "./resources/sync";
import { Info } from "./resources/info";
import { Tracks } from "./resources/tracks";
import { watch } from "./common/library";
import { Insights } from "./resources/insights";
import { Roles } from "./resources/roles";
import { Auth } from "./resources/auth";
import { init } from "./common/setup";
import { Index } from "./resources";
import { Users } from "./resources/users";

export class App {
	constructor() {
		dotenv.config();
	}

	public async run() {

		const REQUIRED_ENV_VARS = ["MUSIC_PATH", "CACHE_PATH", "MONGO_URL", "PORT", "HOST", "ADMIN_EMAIL", "ADMIN_PASSWORD"];

		for (const key of REQUIRED_ENV_VARS) {
			if (!process.env[key]) {
				console.error(`${key} env variable missing`);
				process.exit(0);
			}
		}

		bootstrap({
			port: (process.env.PORT as number | string),
			middleware: [cors, bodyParser],
			resources: [Albums, Artists, Genres, Playlists, Search, Info, Tracks, Sync, Roles, Auth, Insights, Index, Users],
		});


		console.log("[DEBUG] Establishing connection with database\n");

		mongoose.connect(process.env.MONGO_URL as string).then(() => {

			const HOST = `${process.env.HOST || ip.address()}${process.env.API_KEY
				&& process.env.API_KEY.length > 0 ? "?key=" + process.env.API_KEY : ""}`;

			init();

			console.info(`[DEBUG] Server running: ${HOST}\n`);

			watch();

		}).catch((err) => {
			console.log(err);
			process.exit(0);
		});
	}
}

export default new App().run();
