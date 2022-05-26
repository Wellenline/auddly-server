import * as os from "os";
import { Resource, Get, Before } from "@wellenline/via";
import { ScanModel } from "@src/models/scan";
import { Can } from "@src/middleware/access";

@Resource("/info")
export class Info {
	@Get("/")
	@Before(Can())
	public async info() {
		const info = await ScanModel.findOne().sort("-end").lean();
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
