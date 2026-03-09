import { GassmaClient } from "../../generated/gassma/testClient";
import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { tagData } from "../../consts/tagData";

function testDelete() {
  const client = new GassmaClient();

  testDeleteBasic(client);
  testDeleteReturnValue(client);
  testDeleteNotFound(client);
  testDeleteSelect(client);
  testDeleteOmit(client);

  Logger.log("✅ testDelete: all passed");
}

function testDeleteBasic(client: GassmaClient) {
  client.sheets.Tag.delete({ where: { id: 1 } });

  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertRowNotExists({ id: 1 });
  snapshot.assertRowExists({ id: 2 });
  snapshot.assertRowExists({ id: 30 });
  snapshot.assertCount(29);

  resetSheet("Tag", tagData);
}

function testDeleteReturnValue(client: GassmaClient) {
  const result = client.sheets.Tag.delete({ where: { id: 1 } });

  assertEquals(result !== null, true, "delete return not null");
  if (result) {
    assertEquals(result.id, 1, "delete return id");
    assertEquals(result.name, "JavaScript", "delete return name");
  }

  resetSheet("Tag", tagData);
}

function testDeleteNotFound(client: GassmaClient) {
  const result = client.sheets.Tag.delete({ where: { id: 9999 } });
  assertEquals(result, null, "delete not found returns null");
}

function testDeleteSelect(client: GassmaClient) {
  const result = client.sheets.Tag.delete({
    where: { id: 1 },
    select: { id: true, name: true },
  });

  if (!result) throw new Error("delete select: expected result");
  assertDeepEquals(Object.keys(result).sort(), ["id", "name"], "delete select keys");
  assertEquals(result.id, 1, "delete select id");

  resetSheet("Tag", tagData);
}

function testDeleteOmit(client: GassmaClient) {
  client.sheets.Tag.create({ data: { id: 999, name: "OmitTest" } });

  const result = client.sheets.Tag.delete({
    where: { id: 999 },
    omit: { name: true },
  });

  if (!result) throw new Error("delete omit: expected result");
  const keys = Object.keys(result);
  if (keys.indexOf("name") !== -1) {
    throw new Error("delete omit: name should be omitted");
  }
  if (keys.indexOf("id") === -1) {
    throw new Error("delete omit: id should be present");
  }

  resetSheet("Tag", tagData);
}

export { testDelete };
