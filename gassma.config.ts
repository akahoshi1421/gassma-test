import { defineConfig } from "gassma/config";

export default defineConfig({
  schema: "gassma/test.prisma",
  datasource: {
    url: "https://docs.google.com/spreadsheets/d/14yKHbIKdclxxYKkpvB9V04Ovpe8V7I_nHBnfbPmOqyU",
  },
});
