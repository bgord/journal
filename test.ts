import { db } from "./infra/db";
import * as schema from "./infra/schema";

async function main() {
  const result = await db.select().from(schema.events);
  console.log(result);
}

main();
