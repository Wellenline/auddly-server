
import { Resource, Post, Context, IContext } from "@wellenline/via";
import { RemoteSyncService } from "../Services/remotesync.service";

@Resource("/sync")
export class Sync {
	@Post("/")
	public async sync(@Context() context: IContext) {
		return await RemoteSyncService.instance._considerFilesForSync(context.body);
	}

	@Post("/upload")
	public async upload(@Context() context: IContext) {
		return await RemoteSyncService.instance._handleIncomingFile({ ...context.req.body, data: context.req.files.data });
	}
}
