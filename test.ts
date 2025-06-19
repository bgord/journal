import { db } from "./infra/db";
import * as schema from "./infra/schema";

const result = await db.select().from(schema.movies);
console.log(result);
