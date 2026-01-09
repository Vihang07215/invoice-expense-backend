require("dotenv").config(); // make sure this is first
const { defineConfig } = require("prisma/config");

module.exports = defineConfig({
  db: {
    provider: "postgresql",
    url: process.env.DATABASE_URL || "postgresql://postgres:vihang123@localhost:5432/invoice_db?schema=public",
  },
});
