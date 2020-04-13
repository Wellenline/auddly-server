import axios from "axios";
import { PathLike, createWriteStream, existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { extname, join } from "path";
import * as mm from "music-metadata";
import * as ProgressBar from "progress";
import { ArtistModel } from "../Models/artist.model";
import { GenreModel, Genre } from "../Models/genre.model";
import { TrackModel } from "../Models/track.model";
import { AlbumModel } from "../Models/album.model";
import { InfoModel } from "../Models/info.model";
import { capitalize } from "../utils/captialize";

/**
 * Library Service
 */
export class LibraryService {
	private static _instance: LibraryService;

	public static get instance(): LibraryService {
		if (!LibraryService._instance) {
			LibraryService._instance = new LibraryService();
		}

		return LibraryService._instance;
	}
	private bytes = 0;

	public async extractMetadata(files: string[]) {
		const tracks = [];
		const bar = new ProgressBar(":bar :current/:total ", {
			index: 0,
			total: files.length,
		} as ProgressBar.ProgressBarOptions);

		for (const file of files) {
			bar.tick();
			let genre: Genre | any;
			const exists = await TrackModel.exists({ path: file });
			if (!exists) {
				const metadata: any = await mm.parseFile(file).catch((err) => {
					console.log("Failed to parse", file, err);
				});

				if (metadata) {
					// console.log(metadata);
					const artists = await ArtistModel.findOrCreate(metadata.common.artists.length > 1 ? metadata.common.artists : metadata.common.artist.split(/[&,]+/));

					const album = await AlbumModel.findOrCreate({
						album: metadata.common.album,
						artist: {
							name: metadata.common.artist,
							id: artists[0]._id,
						},
						year: metadata.common.year,
						artists,
						picture: metadata.common.picture && metadata.common.picture.length > 0 ? metadata.common.picture[0].data : false,
					});

					if (metadata.common.genre) {
						genre = await GenreModel.findOne({ name: metadata.common.genre[0] });
						if (!genre) {
							genre = await GenreModel.create({ name: metadata.common.genre[0] });
						}
					}

					const track = await TrackModel.findOrCreate({
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

					tracks.push(track);

				}
			}
		}

		return tracks;

	}

	public download(url: any, file: PathLike) {
		axios({
			url,
			responseType: "stream",
		}).then(
			(response) =>
				new Promise((resolve, reject) => {
					response.data
						.pipe(createWriteStream(file))
						.on("finish", () => resolve())
						.on("error", (e: any) => reject(e));
				}),
		);
	}

	/**
	 * Sync music library
	 * @param path music directory
	 * @param ext extensions to look for
	 */
	public async sync(path: string, ext: string[]) {
		console.log("Starting new sync, this may take a while");
		if (!existsSync(process.env.ART_PATH || "art")) {
			mkdirSync(process.env.ART_PATH || "art");
		}

		const files = this.get_files(path).filter((file) => ext.includes(extname(file)));

		const start = new Date();
		await this.extractMetadata(files);

		const end = new Date();
		const data = {
			start,
			end,
			seconds: (end.getTime() - start.getTime()) / 1000,
			tracks: await TrackModel.estimatedDocumentCount(),
			albums: await AlbumModel.estimatedDocumentCount(),
			artists: await ArtistModel.estimatedDocumentCount(),
			size: this.bytes,
			mount: path,
			last_scan: new Date(),
		};

		console.log("Sync completed");
		console.log(data);
		return await InfoModel.findOneAndUpdate({ last_scan: { $ne: undefined } }, data, {
			upsert: true,
			new: true,
		});

	}

	/**
	 * Get all files in folder
	 * @param dir path to walk
	 */
	private get_files(dir: PathLike): string[] {
		return readdirSync(dir).reduce((list, file) => {
			const name = join(dir as string, file);
			const stats = statSync(name);
			if (stats.isDirectory()) {
				return list.concat(this.get_files(name));
			}

			if (stats.isFile()) {
				this.bytes += stats.size;
			}
			return list.concat([name]);
		}, []);
	}

}
