import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const env = getCloudflareContext().env as Cloudflare.Env;
