import { Track } from "@src/entities/track";
import { HttpException, HttpStatus } from "@wellenline/via";
import { existsSync, mkdirSync, createReadStream, createWriteStream } from "fs";
import { getManager } from "typeorm";

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

export async function _considerFilesForSync(payload: IFilesForSync) {
	console.log("consider files for syn");
	const { files, separator, root } = payload;
	console.log(files);
	const syncFiles = (await Promise.all(files.map(async (file: any) => {

		const parts: string[] = file.split(separator);
		const name = parts[parts.length - 1]; /*.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");*/

		console.log(name);
		/*const track = await Track.findOne({
			where: {
				name,
			}
		});*/
		const track = await getManager().createQueryBuilder(Track, "track")
			.select()
			.where("LOWER(track.path) LIKE :path", { path: `%${name.toString().toLowerCase()}%` }).getOne();


		return !track ? file : false;

	}))).filter((file) => file);

	console.log(syncFiles.length, "Files found that need to be synced");

	return syncFiles;
}


export async function _handleIncomingFile(payload: IFileIncoming) {

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