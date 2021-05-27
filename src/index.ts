import * as dotenv from "dotenv";
import * as ip from "ip";
import { bootstrap } from "@wellenline/via";
import { cors, bodyParser, auth } from "./middleware/global";
import { Albums } from "./resources/albums";
import { createConnection, DatabaseType } from "typeorm";
import { Album } from "@src/entities/album";
import { Artist } from "@src/entities/artist";
import { Genre } from "@src/entities/genre";
import { Playlist } from "@src/entities/playlist";
import { Server } from "@src/entities/server";
import { Track } from "@src/entities/track";
import { Genres } from "@src/resources/genres";
import { Artists } from "@src/resources/artists";
import { Playlists } from "@src/resources/playlists";
import { Search } from "@src/resources/search";
import { Sync } from "@src/resources/sync";
import { Info } from "@src/resources/info";
import { Tracks } from "@src/resources/tracks";
import { watch } from "./common/library";
import { Connect } from "./resources/connect";

export class App {
	constructor() {
		dotenv.config();
	}

	public async run() {

		const REQUIRED_ENV_VARS = ["MUSIC_PATH", "CACHE_PATH", "DB_DRIVER", "DB_NAME", "PORT", "HOST"];

		for (const key of REQUIRED_ENV_VARS) {
			if (!process.env[key]) {
				console.error(`${key} env variable missing`);
				process.exit(0);
			}
		}

		bootstrap({
			port: (process.env.PORT as number | string),
			middleware: [cors, bodyParser, auth(["/albums/art", "/tracks/play", "/connect"])],
			resources: [Albums, Connect, Artists, Genres, Playlists, Search, Info, Tracks, Sync],
		});


		console.log("[DEBUG] Establishing connection with database\n");
		createConnection({
			type: process.env.DB_DRIVER as any,
			host: process.env.DB_HOST,
			port: parseInt(process.env.DB_PORT as string, 10),
			database: process.env.DB_NAME,
			password: process.env.DB_PASSWORD,
			username: process.env.DB_USERNAME,
			synchronize: true,
			logging: false,
			entities: [Album, Artist, Genre, Playlist, Server, Track],
		}).catch((err) => {
			console.log(err);
			process.exit(0);

		});

		const HOST = `${process.env.HOST || ip.address()}${process.env.API_KEY
			&& process.env.API_KEY.length > 0 ? "?key=" + process.env.API_KEY : ""}`;


		console.info(`[DEBUG] Server running: ${HOST}\n`);

		watch();
		// LibraryService.instance.sync(process.env.MUSIC_PATH, [".mp3", ".flac", ".m4a"]);
	}
}

export default new App().run();
