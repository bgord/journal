import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "+infra/schema";

const defaultPath = process.env["NODE_ENV"] === "test" ? ":memory:" : "sqlite.db";

export const sqlite = new Database(process.env["DATABASE_PATH"] ?? defaultPath);
sqlite.run("PRAGMA foreign_keys = ON");
sqlite.run("PRAGMA journal_mode = WAL");
export const db = drizzle(sqlite, { schema });
