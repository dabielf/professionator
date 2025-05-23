import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const messages = sqliteTable("messages", {
	id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	content: text().notNull(),
	translation: text().notNull(),
	createdAt: text().notNull().default(sql`CURRENT_TIMESTAMP`),
});
