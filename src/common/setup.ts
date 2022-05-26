import { RoleModel } from "@src/models/role";
import { UserModel } from "@src/models/user";

const roles = [{
	name: "admin",
	scopes: [
		"create:user",
		"read:user",
		"update:user",
		"delete:user",

		"read:playlist",
		"create:playlist",
		"update:playlist",
		"delete:playlist",

		"read:artist",
		"create:artist",
		"update:artist",
		"delete:artist",

		"read:album",
		"create:album",
		"update:album",
		"delete:album",

		"read:genre",
		"create:genre",
		"update:genre",
		"delete:genre",

		"read:track",
		"create:track",
		"update:track",
		"delete:track",

		"read:role",

		"read:settings",
		"update:settings"
	],
}, {
	name: "user",
	scopes: [
		"read:user",
		"update:user",

		"read:playlist",
		"create:playlist",
		"update:playlist",
		"delete:playlist",

		"read:artist",
		"read:album",
		"read:genre",
		"read:track",
	],
}];

export async function init() {
	console.log("[DEBUG] Starting setup");

	const _roles = await RoleModel.find({});
	if (_roles.length === 0) {
		console.log("[DEBUG] No roles found, creating default roles");
		await RoleModel.create(roles);
	}

	const _users = await UserModel.find({});

	if (_users.length === 0) {
		console.log("[DEBUG] No users found, creating default root user");
		const admin = await RoleModel.findOne({ name: "admin" });
		await UserModel.signup({
			email: process.env.ADMIN_EMAIL as string,
			password: process.env.ADMIN_PASSWORD as string,
			role: admin?._id,
			activated: true,
		});

	}


}