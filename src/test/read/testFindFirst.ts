import { GassmaClient } from "../../generated/gassma/testClient";
import { assertEquals } from "../../assert/assertEquals";

function testFindFirst() {
  const client = new GassmaClient();

  testFindFirstBasic(client);
  testFindFirstWhere(client);
  testFindFirstNull(client);
  testFindFirstOrThrowFound(client);
  testFindFirstOrThrowNotFound(client);

  Logger.log("✅ testFindFirst: all passed");
}

function testFindFirstBasic(client: GassmaClient) {
  const user = client.sheets.User.findFirst({});
  if (user === null) {
    throw new Error("findFirst basic: expected a user but got null");
  }
}

function testFindFirstWhere(client: GassmaClient) {
  const user = client.sheets.User.findFirst({
    where: { id: 1 },
  });
  if (user === null) throw new Error("findFirst where: got null");
  assertEquals(user.id, 1, "findFirst where id");
  assertEquals(user.email, "user1@company.co.jp", "findFirst where email");
  assertEquals(user.name, "Chris Jackson", "findFirst where name");
}

function testFindFirstNull(client: GassmaClient) {
  const user = client.sheets.User.findFirst({
    where: { id: 99999 },
  });
  assertEquals(user, null, "findFirst not found");
}

function testFindFirstOrThrowFound(client: GassmaClient) {
  const user = client.sheets.User.findFirstOrThrow({
    where: { id: 1 },
  });
  assertEquals(user.id, 1, "findFirstOrThrow found id");
}

function testFindFirstOrThrowNotFound(client: GassmaClient) {
  let threw = false;
  try {
    client.sheets.User.findFirstOrThrow({
      where: { id: 99999 },
    });
  } catch (_e) {
    threw = true;
  }
  if (!threw) {
    throw new Error("findFirstOrThrow: expected to throw but did not");
  }
}

export { testFindFirst };
