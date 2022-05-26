

import { Resource, Get, Context, IContext } from "@wellenline/via";
import * as os from "os";

@Resource("/")
export class Index {

	@Get("/")
	public async index(@Context() context: IContext) {
		const load = () => {
			// Initialise sum of idle and time of cores and fetch CPU info
			let totalIdle = 0;
			let totalTick = 0;
			const cpus = os.cpus();

			// Loop through CPU cores
			for (let i = 0, len = cpus.length; i < len; i++) {

				// Select CPU core
				const cpu: any = cpus[i];

				// Total up the time in the cores tick
				for (const type in cpu.times) {
					if (type) {
						totalTick += cpu.times[type];
					}
				}

				// Total up the idle time of the core
				totalIdle += cpu.times.idle;
			}

			// Return the average Idle and Tick times
			return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
		};
		return {
			load: load(),
			version: process.env.npm_package_version,
			arch: os.arch(),
			node_version: process.version,
			num_cpus: os.cpus().length,
			uptime: process.uptime(),
			free_mem: os.freemem(),

		};
	}


}