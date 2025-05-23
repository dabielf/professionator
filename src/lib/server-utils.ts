import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const getEnv = async () =>
	(await getCloudflareContext({ async: true })).env as Cloudflare.Env;
