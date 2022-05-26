
import { _considerFilesForSync, _handleIncomingFile } from "@src/common/remote-sync";
import { Can } from "@src/middleware/access";
import { Resource, Post, Context, IContext, Before, Get } from "@wellenline/via";

@Resource("/sync")
export class Sync {
	@Post("/")
	@Before(Can("create:track"))
	public async sync(@Context() context: IContext) {
		return await _considerFilesForSync(context.body);
	}

	@Post("/upload")
	@Before(Can("create:track"))
	public async upload(@Context() context: IContext) {
		console.log({ ...context.req.body, data: context.req.files.data });
		return await _handleIncomingFile({ ...context.req.body, data: context.req.files.data });
	}
}
