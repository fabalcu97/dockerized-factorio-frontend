export type ModsList = { mods: { name: string, version: string, enabled: boolean }[] }
export type Saves = { saves: string[] };
export type Configs = {
	admins: string[],
	bans: string[],
	whitelist: string[],
	settings: Record<string, string | boolean | number>
};
