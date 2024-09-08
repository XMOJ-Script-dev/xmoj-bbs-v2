import {createDatabase} from "db0";
import cloudflareD1 from "db0/connectors/cloudflare-d1";
// @ts-ignore
import {drizzle} from "db0/integrations/drizzle";
import {sqliteTable, text, numeric} from 'drizzle-orm/sqlite-core';

export const db = createDatabase(
  cloudflareD1({
    bindingName: "DB",
  }),
);
export const drizzleDB = drizzle(db);
export const phpsessid = sqliteTable('phpsessid', {
  token: text('token').primaryKey().notNull(),
  user_id: text('user_id').notNull(),
  create_time: numeric('create_time').notNull()
});