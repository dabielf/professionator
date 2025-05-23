import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getBindings() {
	const { env } = await getCloudflareContext({ async: true });
	return env;
}
