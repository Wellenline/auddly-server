import * as os from "os";
import { Resource, Get } from "@wellenline/via";
import { Server } from "../entities/server";

@Resource("/info")
export class Info {
	@Get("/")
	public async info() {
		const info = await Server.findOne({}, {
			order: {
				end: "DESC",
			}
		});
		return {
			version: process.env.npm_package_version,
			arch: os.arch(),
			node_version: process.version,
			num_cpus: os.cpus().length,
			uptime: process.uptime(),
			free_mem: os.freemem(),
			auth: process.env.API_KEY ? true : false,
			...info
		};
	}
}
