import { GassmaClient } from "../../generated/gassma/testClient";
import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";

function testFindMany() {
  const client = new GassmaClient();

  testFindManyBasic(client);
  testFindManyWhere(client);
  testFindManyWhereAnd(client);
  testFindManyWhereOr(client);
  testFindManyWhereNot(client);
  testFindManyWhereFilter(client);
  testFindManyOrderBy(client);
  testFindManyTakeSkip(client);
  testFindManySelect(client);
  testFindManyOmit(client);
  testFindManyDistinct(client);

  Logger.log("✅ testFindMany: all passed");
}

function testFindManyBasic(client: GassmaClient) {
  const users = client.sheets.User.findMany({});
  assertEquals(users.length, 50, "findMany basic count");
}

function testFindManyWhere(client: GassmaClient) {
  const admins = client.sheets.User.findMany({
    where: { role: "ADMIN" },
  });
  admins.forEach((user) => {
    assertEquals(user.role, "ADMIN", "findMany where role");
  });

  const user1 = client.sheets.User.findMany({
    where: { id: 1 },
  });
  assertEquals(user1.length, 1, "findMany where id count");
  assertEquals(user1[0].email, "user1@company.co.jp", "findMany where id email");
}

function testFindManyWhereAnd(client: GassmaClient) {
  const result = client.sheets.User.findMany({
    where: {
      AND: [{ role: "USER" }, { isActive: true }],
    },
  });
  result.forEach((user) => {
    assertEquals(user.role, "USER", "findMany AND role");
    assertEquals(user.isActive, true, "findMany AND isActive");
  });
}

function testFindManyWhereOr(client: GassmaClient) {
  const result = client.sheets.User.findMany({
    where: {
      OR: [{ role: "ADMIN" }, { role: "MODERATOR" }],
    },
  });
  result.forEach((user) => {
    if (user.role !== "ADMIN" && user.role !== "MODERATOR") {
      throw new Error(`findMany OR: unexpected role ${user.role}`);
    }
  });
}

function testFindManyWhereNot(client: GassmaClient) {
  const result = client.sheets.User.findMany({
    where: {
      NOT: { role: "ADMIN" },
    },
  });
  result.forEach((user) => {
    if (user.role === "ADMIN") {
      throw new Error("findMany NOT: found admin");
    }
  });
}

function testFindManyWhereFilter(client: GassmaClient) {
  const result = client.sheets.User.findMany({
    where: {
      age: { gte: 50 },
    },
  });
  result.forEach((user) => {
    if (typeof user.age !== "number" || user.age < 50) {
      throw new Error(`findMany filter gte: unexpected age ${user.age}`);
    }
  });

  const containsResult = client.sheets.User.findMany({
    where: {
      name: { contains: "Smith" },
    },
  });
  containsResult.forEach((user) => {
    if (typeof user.name !== "string" || !user.name.includes("Smith")) {
      throw new Error(`findMany filter contains: unexpected name ${user.name}`);
    }
  });

  const inResult = client.sheets.User.findMany({
    where: {
      role: { in: ["ADMIN", "MODERATOR"] },
    },
  });
  inResult.forEach((user) => {
    if (user.role !== "ADMIN" && user.role !== "MODERATOR") {
      throw new Error(`findMany filter in: unexpected role ${user.role}`);
    }
  });
}

function testFindManyOrderBy(client: GassmaClient) {
  const result = client.sheets.User.findMany({
    orderBy: { id: "asc" },
  });
  assertEquals(result[0].id, 1, "findMany orderBy asc first");
  assertEquals(result[result.length - 1].id, 50, "findMany orderBy asc last");

  const descResult = client.sheets.User.findMany({
    orderBy: { id: "desc" },
  });
  assertEquals(descResult[0].id, 50, "findMany orderBy desc first");
}

function testFindManyTakeSkip(client: GassmaClient) {
  const result = client.sheets.User.findMany({
    take: 5,
    orderBy: { id: "asc" },
  });
  assertEquals(result.length, 5, "findMany take count");
  assertEquals(result[0].id, 1, "findMany take first id");

  const skipResult = client.sheets.User.findMany({
    skip: 45,
    orderBy: { id: "asc" },
  });
  assertEquals(skipResult.length, 5, "findMany skip count");
  assertEquals(skipResult[0].id, 46, "findMany skip first id");

  const takeSkipResult = client.sheets.User.findMany({
    take: 3,
    skip: 10,
    orderBy: { id: "asc" },
  });
  assertEquals(takeSkipResult.length, 3, "findMany take+skip count");
  assertEquals(takeSkipResult[0].id, 11, "findMany take+skip first id");
}

function testFindManySelect(client: GassmaClient) {
  const result = client.sheets.User.findMany({
    where: { id: 1 },
    select: { id: true, name: true },
  });
  assertEquals(result.length, 1, "findMany select count");
  assertDeepEquals(Object.keys(result[0]).sort(), ["id", "name"], "findMany select keys");
}

function testFindManyOmit(client: GassmaClient) {
  const result = client.sheets.User.findMany({
    where: { id: 1 },
    omit: { createdAt: true },
  });
  assertEquals(result.length, 1, "findMany omit count");
  if ("createdAt" in result[0]) {
    throw new Error("findMany omit: createdAt should be omitted");
  }
}

function testFindManyDistinct(client: GassmaClient) {
  const result = client.sheets.User.findMany({
    distinct: "role",
  });
  const roles = result.map((u) => u.role);
  const uniqueRoles = [...new Set(roles)];
  assertEquals(roles.length, uniqueRoles.length, "findMany distinct unique count");
}

export { testFindMany };
