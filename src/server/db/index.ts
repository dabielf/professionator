import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import { getBindings } from "@/server/utils";
import * as schema from "./schema"; // Import your schema
import type { AnyD1Database } from "drizzle-orm/d1";

// Define a type for your Drizzle instance with the schema
export type DB = DrizzleD1Database<typeof schema>;

let dbInstance: DB;

export async function getDB(): Promise<DB> {
	// Accept CloudflareEnv as an argument
	const bindings = await getBindings();
	if (!dbInstance) {
		if (!bindings.DB) {
			// Check if the DB binding exists on the passed env
			throw new Error(
				"D1_DATABASE binding ('DB') not found in Cloudflare environment.",
			);
		}
		dbInstance = drizzle(bindings.DB as AnyD1Database, { schema }); // Use the schema during initialization
	}
	return dbInstance;
}
