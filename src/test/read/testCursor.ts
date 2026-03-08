import { GassmaClient } from "../../generated/gassma/testClient";
import { assertEquals } from "../../assert/assertEquals";

function testCursor() {
  const client = new GassmaClient();

  testCursorBasic(client);
  testCursorWithTake(client);

  Logger.log("✅ testCursor: all passed");
}

function testCursorBasic(client: GassmaClient) {
  const result = client.sheets.User.findMany({
    cursor: { id: 10 },
    orderBy: { id: "asc" },
  });
  if (result.length === 0) throw new Error("cursor basic: expected results");
  assertEquals(result[0].id, 10, "cursor basic first id");
}

function testCursorWithTake(client: GassmaClient) {
  const result = client.sheets.User.findMany({
    cursor: { id: 10 },
    take: 5,
    orderBy: { id: "asc" },
  });
  assertEquals(result.length, 5, "cursor take count");
  assertEquals(result[0].id, 10, "cursor take first id");
  assertEquals(result[4].id, 14, "cursor take last id");
}

export { testCursor };
