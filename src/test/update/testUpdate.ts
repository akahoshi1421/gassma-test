import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { tagData } from "../../consts/tagData";

function testUpdate() {
  const client = new GassmaClient();

  testUpdateBasic(client);
  testUpdateReturnValue(client);
  testUpdateNotFound(client);
  testUpdateSelect(client);
  testUpdateOmit(client);

  Logger.log("✅ testUpdate: all passed");
}

function testUpdateBasic(client: GassmaClient) {
  client.Tag.update({
    where: { id: 1 },
    data: { name: "UpdatedJS" },
  });

  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertRowEquals({ id: 1 }, { name: "UpdatedJS" });

  resetSheet("Tag", tagData);
}

function testUpdateReturnValue(client: GassmaClient) {
  const result = client.Tag.update({
    where: { id: 1 },
    data: { name: "ReturnTest" },
  });

  assertEquals(result !== null, true, "update return not null");
  if (result) {
    assertEquals(result.id, 1, "update return id");
    assertEquals(result.name, "ReturnTest", "update return name");
  }

  resetSheet("Tag", tagData);
}

function testUpdateNotFound(client: GassmaClient) {
  const result = client.Tag.update({
    where: { id: 9999 },
    data: { name: "Ghost" },
  });
  assertEquals(result, null, "update not found returns null");
}

function testUpdateSelect(client: GassmaClient) {
  const result = client.Tag.update({
    where: { id: 1 },
    data: { name: "SelectTest" },
    select: { id: true, name: true },
  });

  if (!result) throw new Error("update select: expected result");
  assertDeepEquals(Object.keys(result).sort(), ["id", "name"], "update select keys");
  assertEquals(result.id, 1, "update select id");
  assertEquals(result.name, "SelectTest", "update select name");

  resetSheet("Tag", tagData);
}

function testUpdateOmit(client: GassmaClient) {
  const result = client.Tag.update({
    where: { id: 1 },
    data: { name: "OmitTest" },
    omit: { name: true },
  });

  if (!result) throw new Error("update omit: expected result");
  const keys = Object.keys(result);
  if (keys.indexOf("name") !== -1) {
    throw new Error("update omit: name should be omitted");
  }
  if (keys.indexOf("id") === -1) {
    throw new Error("update omit: id should be present");
  }

  resetSheet("Tag", tagData);
}

export { testUpdate };
