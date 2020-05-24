import * as dotenv from "dotenv";
import * as ip from "ip";
import * as qrcode from "qrcode";
import * as mongoose from "mongoose";
import { bootstrap } from "@wellenline/via";
import { cors, bodyParser, auth } from "./Middleware/global";
import { LibraryService } from "./Services/library.service";
import { Albums } from "./Http/albums";
import { Artists } from "./Http/artists";
import { Genres } from "./Http/genres";
import { Playlists } from "./Http/playlists";
import { Search } from "./Http/search";
import { System } from "./Http/system";
import { Tracks } from "./Http/tracks";
import { Sync } from "./Http/sync";
import { createConnection } from "typeorm";
import { Album } from "./Entities/album";
import { Artist } from "./Entities/artist";
import { Genre } from "./Entities/genre";
import { Playlist } from "./Entities/playlist";
import { Server } from "./Entities/server";
import { Track } from "./Entities/track";

export class App {
	constructor() {
		dotenv.config();
	}

	public async run() {

		const REQUIRED_ENV_VARS = ["MUSIC_PATH", "ART_PATH", "TRANSCODE_PATH", "MONGO_URL", "PORT", "HOST"];

		for (const key of REQUIRED_ENV_VARS) {
			if (!process.env[key]) {
				console.error(`${key} env variable missing`);
				process.exit(0);
			}
		}

		bootstrap({
			port: (process.env.PORT as number | string),
			middleware: [cors, bodyParser, auth(["art", "play"])],
			resources: [Albums, Artists, Genres, Playlists, Search, System, Tracks, Sync],
		});


		console.log("[DEBUG] Establishing connection with database\n");

		createConnection({
			type: "postgres",
			// type: "sqlite",
			database: "waveline-large",
			synchronize: true,
			logging: false,
			entities: [Album, Artist, Genre, Playlist, Server, Track],
		}).catch((err) => {
			console.log(err);
		});

		await mongoose.connect(process.env.MONGO_URL, {
			useNewUrlParser: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		}).catch((err) => {
			console.log(err);
			process.exit(0);
		});

		const HOST = process.env.HOST || ip.address();
		const code = await qrcode.toString(`${HOST}?key=${process.env.API_KEY}`, { type: "terminal" }).catch((err) => {
			console.error(err, "Failed to generate QR code");
		});

		// Show QR code
		console.log(code);

		console.info(`[DEBUG] Server running: ${HOST}?key=${process.env.API_KEY}\n`);
		LibraryService.instance.watch();
		// LibraryService.instance.sync(process.env.MUSIC_PATH, [".mp3", ".flac", ".m4a"]);
	}
}

export default new App().run();
