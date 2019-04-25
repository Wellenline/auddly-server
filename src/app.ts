import * as cors from "cors";
import * as dotenv from "dotenv";
import { IncomingForm } from "formidable";
import * as ip from "ip";
// import { app, Autoload } from "laf-http";
import * as mongoose from "mongoose";

import { bootstrap, app, Use } from "liquid-http";

// tslint:disable-next-line:no-var-requires
import qr = require("qrcode-terminal");
import { LibraryService } from "./Services/library.service";
import { AuthService } from "./Services/auth.service";
class App {
	constructor() {
		(<any>mongoose).Promise = global.Promise;

		dotenv.config();

		mongoose.connect(process.env.MONGO_URL, {
			useNewUrlParser: true,
		});

		bootstrap({
			port: <any>process.env.PORT || 5002,
			middleware: [cors(), new AuthService().middleware(["art", "play"]), (req: any, res: any, next: any) => {
				const form = new IncomingForm();
				form.maxFields = 500;
				form.maxFieldsSize = 2 * 1024 * 1024;
				form.parse(req, (err, fields, files) => {
					req.files = files;
					req.body = fields;
					next();
				});
			}],
			autoload: __dirname + "/Http",

		});

		new LibraryService().sync(process.env.MUSIC_PATH, [".mp3", ".flac", ".m4a"]);

		const HOST = process.env.HOST || ip.address();
		qr.generate(`http://${HOST}:${process.env.PORT || 5002}?key=${process.env.API_KEY}`);

		console.info(`[DEBUG] Server running: http://${HOST}:${process.env.PORT || 5002}?key=${process.env.API_KEY}`);

	}

}

export default new App();
