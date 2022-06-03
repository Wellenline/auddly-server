import { TrackModel } from "@src/models/track";
import { HttpException, HttpStatus } from "@wellenline/via";
import { existsSync, mkdirSync, createReadStream, createWriteStream } from "fs";

/* Defining the interface for the payload that is passed to the _handleIncomingFile function. */
export interface IFilesForSync {
	files: string[];
	root: string[];
	separator: string;
}

/* Defining the interface for the payload that is passed to the _handleIncomingFile function. */
export interface IFileIncoming {
	name: string;
	file: string;
	root: string[];
	separator: string;
	dir: string;
	data: any;
}

/**
 * It takes an array of file paths, and returns an array of file paths that are not in the database
 * @param {IFilesForSync} payload - IFilesForSync
 * @returns An array of files that need to be synced
 */
export async function _considerFilesForSync(payload: IFilesForSync) {
	console.log("consider files for sync");
	const { files, separator, root } = payload;
	console.log(files);
	const syncFiles = (await Promise.all(files.map(async (file: any) => {

		const parts: string[] = file.split(separator);
		const name = parts[parts.length - 1];

		const track = await TrackModel.findOne({
			path: {
				$regex: name.toString(),
				$options: "i",
			}
		});
		return !track ? file : false;

	}))).filter((file) => file);

	console.log(syncFiles.length, "Files found that need to be synced");

	return syncFiles;
}

/**
 * It takes a file, and saves it to the server
 * @param {IFileIncoming} payload - IFileIncoming
 * @returns A promise that resolves to an object with a code and message property.
 */
export async function _handleIncomingFile(payload: IFileIncoming) {

	const { dir, data, name } = payload;

	if (!data) {
		throw new HttpException("No data", HttpStatus.BAD_REQUEST);
	}

	if (!existsSync(`${process.env.MUSIC_PATH}/${dir}`)) {
		mkdirSync(`${process.env.MUSIC_PATH}/${dir}`, { recursive: true });
	}

	const source = createReadStream(data.filepath);
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