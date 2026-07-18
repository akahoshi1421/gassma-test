import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";

function testFilterConditions() {
  const client = new GassmaClient();

  testNot(client);
  testNotIn(client);
  testStartsWith(client);
  testEndsWith(client);
  testModeInsensitive(client);
  testModeInsensitiveContains(client);
  testModeInsensitiveStartsWith(client);
  testModeInsensitiveEndsWith(client);
  testModeInsensitiveNot(client);

  Logger.log("✅ testFilterConditions: all passed");
}

function testNot(client: GassmaClient) {
  const users = client.User.findMany({
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
  const users = client.User.findMany({
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
  const users = client.User.findMany({
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
  const users = client.User.findMany({
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
  const users = client.User.findMany({
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
  const users = client.User.findMany({
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

function testModeInsensitiveStartsWith(client: GassmaClient) {
  // "chris" → "Chris Jackson" (id 1), "Chris Jones" (id 23) の 2 件
  const users = client.User.findMany({
    where: { name: { startsWith: "chris", mode: "insensitive" } },
  });
  assertDeepEquals(users.map((user) => user.id), [1, 23], "insensitive startsWith: ids");

  // 大文字小文字を区別すると "chris" 始まりは 0 件
  const sensitive = client.User.findMany({
    where: { name: { startsWith: "chris" } },
  });
  assertEquals(sensitive.length, 0, "sensitive startsWith: length");
}

function testModeInsensitiveEndsWith(client: GassmaClient) {
  // "SMITH" → "〜Smith" の 6 件 (id 3,9,19,21,35,47)
  const users = client.User.findMany({
    where: { name: { endsWith: "SMITH", mode: "insensitive" } },
  });
  assertDeepEquals(users.map((user) => user.id), [3, 9, 19, 21, 35, 47], "insensitive endsWith: ids");

  const sensitive = client.User.findMany({
    where: { name: { endsWith: "SMITH" } },
  });
  assertEquals(sensitive.length, 0, "sensitive endsWith: length");
}

function testModeInsensitiveNot(client: GassmaClient) {
  // "CHRIS JACKSON" ≒ "Chris Jackson" (id 1) のみ除外され 49 件
  const users = client.User.findMany({
    where: { name: { not: "CHRIS JACKSON", mode: "insensitive" } },
  });
  assertEquals(users.length, 49, "insensitive not: length");
  if (users.some((user) => user.id === 1)) {
    throw new Error("insensitive not: id 1 should be excluded");
  }

  // 大文字小文字を区別すると完全一致行がなく全 50 件
  const sensitive = client.User.findMany({
    where: { name: { not: "CHRIS JACKSON" } },
  });
  assertEquals(sensitive.length, 50, "sensitive not: length");
}

export { testFilterConditions };
