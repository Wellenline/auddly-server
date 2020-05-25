import { existsSync, mkdirSync, createReadStream, createWriteStream } from "fs";
import { HttpException, HttpStatus } from "@wellenline/via";
import { Track } from "../Entities/track";
import { getManager } from "typeorm";
export enum Events {
	FILE = "file",
	CONSIDER_FILES = "sync:consider",
	START_SYNC = "sync:start",
	INCOMING_FILE = "sync:incoming",


}

export interface IFilesForSync {
	files: string[];
	root: string[];
	separator: string;
}

export interface IFileIncoming {
	name: string;
	file: string;
	root: string[];
	separator: string;
	dir: string;
	data: any;
}

export class RemoteSyncService {
	private static _instance: RemoteSyncService;

	public static get instance(): RemoteSyncService {
		if (!RemoteSyncService._instance) {
			RemoteSyncService._instance = new RemoteSyncService();
		}

		return RemoteSyncService._instance;
	}

	public async _considerFilesForSync(payload: IFilesForSync) {
		const { files, separator, root } = payload;

		const syncFiles = (await Promise.all(files.map(async (file: any) => {

			const parts: string[] = file.split(separator);
			const name = parts[parts.length - 1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

			/*const track = await Track.findOne({
				where: {
					name,
				}
			});*/

			const track = await getManager().createQueryBuilder(Track, "track")
				.select()
				.where("LOWER(track.path) LIKE :path", { q: `%${name.toString().toLowerCase()}%` }).getOne();

			return !track ? file : false;

		}))).filter((file) => file);

		console.log(syncFiles.length, "Files found that need to be synced");

		return syncFiles;
	}

	public async _handleIncomingFile(payload: IFileIncoming) {

		console.log(payload);

		const { dir, data, name } = payload;

		if (!data) {
			throw new HttpException("No data", HttpStatus.BAD_REQUEST);
		}

		if (!existsSync(`${process.env.MUSIC_PATH}/${dir}`)) {
			mkdirSync(`${process.env.MUSIC_PATH}/${dir}`, { recursive: true });
		}

		const source = createReadStream(data.path);
		const dest = createWriteStream(`${process.env.MUSIC_PATH}/${dir}/${name}`);


		return new Promise((resolve, reject) => {
			source.pipe(dest);
			source.on("end", () => resolve({
				code: 200,
				message: "Success"
			}));
			source.on("error", (err) => reject(err));
		});



	}
}
