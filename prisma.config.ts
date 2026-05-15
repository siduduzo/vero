import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env.local", override: true });
config({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node -P tsconfig.seed.json prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"] ?? "",
  },
});
