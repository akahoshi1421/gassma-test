import "dotenv/config";
import type { GassmaConfig } from "gassma";
import { env } from "gassma/config";

export default {
  schema: "gassma",
  datasource: {
    url: env("SPREADSHEET_URL"),
  },
} satisfies GassmaConfig;
