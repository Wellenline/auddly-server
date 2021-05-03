
import { _considerFilesForSync, _handleIncomingFile } from "@src/common/remote-sync";
import { Resource, Post, Context, IContext } from "@wellenline/via";

@Resource("/sync")
export class Sync {
	@Post("/")
	public async sync(@Context() context: IContext) {
		return await _considerFilesForSync(context.body);
	}

	@Post("/upload")
	public async upload(@Context() context: IContext) {
		return await _handleIncomingFile({ ...context.req.body, data: context.req.files.data });
	}
}
