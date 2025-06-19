import { sql } from "drizzle-orm";
import * as infra from "./infra";

const query = sql`select "hello world" as text`;
const result = infra.db.get<{ text: string }>(query);
console.log(result);
