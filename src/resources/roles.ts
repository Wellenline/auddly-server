import { Resource, Context, IContext, Get, Before } from "@wellenline/via";
import { RoleModel } from "@src/models/role";
import { Can } from "@src/middleware/access";

@Resource("/roles")
export class Roles {

	@Get("/")
	@Before(Can("read:role"))
	public async index(@Context() context: IContext) {
		return {
			data: await RoleModel.find({ readonly: { $ne: true } }).select("-permissions"),
		}
	}

}
