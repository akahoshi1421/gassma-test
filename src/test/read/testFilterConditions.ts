import { GassmaClient } from "../../generated/gassma/testClient";
import { assertEquals } from "../../assert/assertEquals";

function testFilterConditions() {
  const client = new GassmaClient();

  testNot(client);
  testNotIn(client);
  testStartsWith(client);
  testEndsWith(client);
  testModeInsensitive(client);
  testModeInsensitiveContains(client);

  Logger.log("✅ testFilterConditions: all passed");
}

function testNot(client: GassmaClient) {
  const users = client.sheets.User.findMany({
    where: { role: { not: "ADMIN" } },
  });
  users.forEach((user) => {
    if (user.role === "ADMIN") {
      throw new Error("not filter: found admin");
    }
  });
  if (users.length === 0) {
    throw new Error("not filter: expected results");
  }
}

function testNotIn(client: GassmaClient) {
  const users = client.sheets.User.findMany({
    where: { role: { notIn: ["ADMIN", "MODERATOR"] } },
  });
  users.forEach((user) => {
    if (user.role === "ADMIN" || user.role === "MODERATOR") {
      throw new Error(`notIn filter: unexpected role ${user.role}`);
    }
  });
  if (users.length === 0) {
    throw new Error("notIn filter: expected results");
  }
}

function testStartsWith(client: GassmaClient) {
  const users = client.sheets.User.findMany({
    where: { email: { startsWith: "user1" } },
  });
  users.forEach((user) => {
    if (!user.email.startsWith("user1")) {
      throw new Error(`startsWith filter: ${user.email} does not start with user1`);
    }
  });
  if (users.length === 0) {
    throw new Error("startsWith filter: expected results");
  }
}

function testEndsWith(client: GassmaClient) {
  const users = client.sheets.User.findMany({
    where: { email: { endsWith: "@gmail.com" } },
  });
  users.forEach((user) => {
    if (!user.email.endsWith("@gmail.com")) {
      throw new Error(`endsWith filter: ${user.email} does not end with @gmail.com`);
    }
  });
  if (users.length === 0) {
    throw new Error("endsWith filter: expected results");
  }
}

function testModeInsensitive(client: GassmaClient) {
  // "chris jackson" で検索 → "Chris Jackson" がヒットするはず
  const users = client.sheets.User.findMany({
    where: {
      name: { equals: "chris jackson", mode: "insensitive" },
    },
  });
  if (users.length === 0) {
    throw new Error("mode insensitive equals: expected results");
  }
  users.forEach((user) => {
    if (user.name.toLowerCase() !== "chris jackson") {
      throw new Error(`mode insensitive equals: unexpected name ${user.name}`);
    }
  });
}

function testModeInsensitiveContains(client: GassmaClient) {
  const users = client.sheets.User.findMany({
    where: {
      name: { contains: "smith", mode: "insensitive" },
    },
  });
  users.forEach((user) => {
    if (!user.name.toLowerCase().includes("smith")) {
      throw new Error(`mode insensitive contains: unexpected name ${user.name}`);
    }
  });
  if (users.length === 0) {
    throw new Error("mode insensitive contains: expected results");
  }
}

export { testFilterConditions };
