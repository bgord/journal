import { z } from "zod/v4";

export const HistorySubject = z.string().min(1).max(128).trim();
