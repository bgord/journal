import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Env } from "./env";

const sqlite = new Database(Env.SQLITE_DATABASE_FILE_PATH);
export const db = drizzle(sqlite);
