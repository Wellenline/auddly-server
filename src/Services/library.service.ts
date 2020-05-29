import { createWriteStream, existsSync, appendFile, mkdirSync, readdirSync, statSync, createReadStream, writeFileSync } from "fs";
import { extname } from "path";
import * as mm from "music-metadata";
import * as chokidar from "chokidar";
import * as sox from "sox-stream";
import * as ProgressBar from "progress";

import { format } from "util";
import { capitalize } from "../utils/captialize";
import { Artist } from "../Entities/artist";
import { Track } from "../Entities/track";
import { Album } from "../Entities/album";
import { Genre } from "../Entities/genre";
import { Server } from "../Entities/server";

/**
 * Library Service
 */
export class LibraryService {
	private static _instance: LibraryService;

	public static get instance(): LibraryService {
		if (!LibraryService._instance) {
			LibraryService._instance = new LibraryService();
		}

		if (!existsSync(process.env.ART_PATH)) {
			mkdirSync(process.env.ART_PATH);
		}

		if (!existsSync(process.env.TRANSCODE_PATH)) {
			mkdirSync(process.env.TRANSCODE_PATH);
		}

		return LibraryService._instance;
	}

	public ext = [".mp3", ".flac", ".m4a"];

	private _files = [];
	private _timer: NodeJS.Timeout;
	private _size = 0;

	public watch(ext?: string[]) {
		if (ext && ext.length > 0) {
			this.ext = ext;
		}

		chokidar.watch(process.env.MUSIC_PATH, {
			persistent: true,
			//  alwaysStat: true,
			// ignoreInitial: true,
		}).on("add", this._onFileAdded.bind(this)).on("unlink", this._onFileRemoved.bind(this));
	}

	/**
	 * Transcode audio
	 * @param source track
	 */
	public transcode(track: Track, options: sox.SoxOptions): Promise<string> {
		return new Promise((resolve, reject) => {
			const audioFile = `${process.env.TRANSCODE_PATH}/${(track as any).id}.mp3`;

			if (existsSync(audioFile)) {
				return resolve(audioFile);
			}

			const wstream = createWriteStream(audioFile);

			const rstream = createReadStream(track.path, { autoClose: true }).pipe(sox(options)).pipe(wstream);

			rstream.on("finish", () => {
				resolve(audioFile);
			});

			rstream.on("error", (err) => {
				console.log("Failed to transcode audio", err);
				reject(err);
			});

		});
	}

	/**
	 * Build music library
	 * @param files array of file paths
	 */
	private async _build(files: string[]) {
		const libraryInfo: any = {
			start: new Date(),
			mount: process.env.MUSIC_PATH,
			last_scan: new Date(),
			size: this._size,
		};

		const bar = new ProgressBar(":bar :current/:total ", {
			index: 0,
			total: files.length,
		} as ProgressBar.ProgressBarOptions);

		const logStream = createWriteStream("error_log.txt", { flags: "a" });

		console.log("Starting to build your music library");
		for (const file of files) {
			bar.tick();
			try {
				// console.log(metadata.common.track.no);

				const exists = await Track.findOne({ path: file });

				if (exists) {
					continue;
				}

				const metadata = await mm.parseFile(file);

				if (!metadata || metadata.format.tagTypes.length === 0) {
					throw new Error("Not metadata found");
				}

				// Find or create new artist(s)
				const artists = await Artist.findOrCreate(metadata.common
					&& metadata.common.artists
					&& metadata.common.artists.length > 1 ? metadata.common.artists : metadata.common.artist.split(/[&,]+/));

				// Find or create a new album
				const album = await Album.findOrCreate({
					album: metadata.common.album,
					artist: artists[0],
					year: metadata.common.year,
					picture: metadata.common && metadata.common.picture && metadata.common.picture.length > 0 ? metadata.common.picture[0].data : undefined,
				});

				// Check if metadata contains genre data
				let genre: any = null;
				if (metadata.common.genre && metadata.common.genre[0]) {
					genre = await Genre.findOrCreate(metadata.common.genre[0]);
				}

				await Track.findOrCreate({
					name: capitalize(metadata.common.title),
					artists,
					album: album.id,
					artist: metadata.common.artist,
					genre,
					number: metadata.common.track.no,
					duration: metadata.format.duration,
					path: file,
					lossless: metadata.format.lossless,
					year: metadata.common.year || 0,
					created_at: new Date(),
				} as any);

			} catch (err) {
				logStream.write(`${file}\n`);
				logStream.write(`[ERROR]: ${format(err)}\n\n`);
			}
		}

		logStream.end();

		libraryInfo.end = new Date();
		libraryInfo.seconds = (libraryInfo.end.getTime() - libraryInfo.start.getTime()) / 1000;
		libraryInfo.tracks = await Track.count();
		libraryInfo.albums = await Album.count();
		libraryInfo.artists = await Artist.count();

		console.log("Done building library");
		console.log(libraryInfo);

		return Server.create(libraryInfo as Server).save();

	}

	/**
	 * Handle new file events
	 * @param path added file path
	 */
	private _onFileAdded(path: string, stat) {
		clearTimeout(this._timer);
		if (this.ext.includes(extname(path))) {
			if (!stat) {
				stat = statSync(path);
			}

			this._size += stat.size;
			this._files.push({ path, stat });
		}

		this._timer = setTimeout(() => {
			this._files = this._files.sort((a, b) => b.stat.ctime - a.stat.ctime).map((file) => file.path).reverse();
			this._build(this._files);
			this._files = [];

		}, 3000);
	}

	/**
	 * Handle file remove events
	 * @param path path of the file that was deleted
	 */
	private _onFileRemoved(path: string) {
		console.log(`TODO: delete records from db on file delete event`);
		console.log(`File ${path} has been removed`);
	}

}
