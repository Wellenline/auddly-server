import { createWriteStream, existsSync, mkdirSync, readdirSync, statSync, createReadStream } from "fs";
import { extname } from "path";
import * as mm from "music-metadata";
import * as chokidar from "chokidar";
import * as sox from "sox-stream";

import { ArtistModel } from "../Models/artist.model";
import { GenreModel } from "../Models/genre.model";
import { TrackModel, Track } from "../Models/track.model";
import { AlbumModel } from "../Models/album.model";
import { InfoModel, Info } from "../Models/info.model";
import { capitalize } from "../utils/captialize";

import * as readline from "readline";

export const writeLog = (message: string | Buffer | Uint8Array) => {
	readline.clearLine(process.stdout, 0);
	readline.cursorTo(process.stdout, 0);
	process.stdout.write(message);
};

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
			// ignoreInitial: true,
		}).on("add", this._onFileAdded.bind(this)).on("unlink", this._onFileRemoved.bind(this));
	}

	/**
	 * Transcode audio
	 * @param source track
	 */
	public transcode(track: Track, options: sox.SoxOptions): Promise<string> {
		return new Promise((resolve, reject) => {
			const audioFile = `${process.env.TRANSCODE_PATH}/${(track as any)._id.toString()}.mp3`;

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
		const libraryInfo: Info = {
			start: new Date(),
			mount: process.env.MUSIC_PATH,
			last_scan: new Date(),
			size: this._size,
		};

		let index = 0;
		for (const file of files) {
			// bar.tick();
			index++;
			writeLog(`[${index}/${files.length}] ${file}`);


			const exists = await TrackModel.exists({ path: file });

			if (exists) {
				continue;
			}

			let metadata: any = null;
			try {
				metadata = await mm.parseFile(file);
			} catch (err) {
				console.log("Failed to parse", file, err);
				continue;
			}

			if (!metadata) {
				console.log(`No metadata found for file: ${file}`);
				continue;
			}

			// Find or create new artist(s)
			const artists = await ArtistModel.findOrCreate(metadata.common.artists.length > 1 ?
				metadata.common.artists : metadata.common.artist.split(/[&,]+/));

			// Find or create a new album
			const album = await AlbumModel.findOrCreate({
				album: metadata.common.album,
				artist: {
					name: metadata.common.artist,
					id: artists[0]._id,
				},
				year: metadata.common.year,
				artists,
				picture: metadata.common.picture && metadata.common.picture.length > 0 ? metadata.common.picture[0].data : undefined,
			});

			// Check if metadata contains genre data
			let genre: any;
			if (metadata.common.genre) {
				genre = await GenreModel.findOrCreate(metadata.common.genre[0]);
			}

			await TrackModel.findOrCreate({
				name: capitalize(metadata.common.title),
				artists: artists.map((artist) => artist._id),
				album: album._id,
				artist: metadata.common.artist,
				genre: genre ? genre._id : undefined,
				duration: metadata.format.duration,
				path: file,
				lossless: metadata.format.lossless,
				year: metadata.common.year || 0,
				created_at: new Date(),
			});
		}

		libraryInfo.end = new Date();
		libraryInfo.seconds = (libraryInfo.end.getTime() - libraryInfo.start.getTime()) / 1000;
		libraryInfo.tracks = await TrackModel.estimatedDocumentCount();
		libraryInfo.albums = await AlbumModel.estimatedDocumentCount();
		libraryInfo.artists = await ArtistModel.estimatedDocumentCount();

		writeLog("Library building completed ");
		console.log(libraryInfo);

		return InfoModel.findOneAndUpdate({ last_scan: { $ne: undefined } }, libraryInfo, {
			upsert: true,
			new: true,
		});

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
			this._files.push(path);
		}

		this._timer = setTimeout(() => {
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
