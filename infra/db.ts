import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";

export const sqlite = new Database("sqlite.db");
sqlite.run("PRAGMA foreign_keys = ON");
export const db = drizzle(sqlite, { schema });
