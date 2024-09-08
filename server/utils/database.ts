import { createDatabase } from "db0";
import cloudflareD1 from "db0/connectors/cloudflare-d1";
// @ts-ignore
import { drizzle } from "db0/integrations/drizzle";

export const db = createDatabase(
  cloudflareD1({
    bindingName: "DB",
  }),
);
export const drizzleDB = drizzle(db);