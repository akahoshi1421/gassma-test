import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { tagData } from "../../consts/tagData";

function testCreateMany() {
  const client = new GassmaClient();

  testCreateManyBasic(client);
  testCreateManyAndReturnBasic(client);

  Logger.log("✅ testCreateMany: all passed");
}

function testCreateManyBasic(client: GassmaClient) {
  const result = client.sheets.Tag.createMany({
    data: [
      { id: 901, name: "TestTag1" },
      { id: 902, name: "TestTag2" },
      { id: 903, name: "TestTag3" },
    ],
  });

  assertEquals(result.count, 3, "createMany count");

  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertRowExists({ id: 901 });
  snapshot.assertRowExists({ id: 902 });
  snapshot.assertRowExists({ id: 903 });
  snapshot.assertCount(33);

  resetSheet("Tag", tagData);
}

function testCreateManyAndReturnBasic(client: GassmaClient) {
  const result = client.sheets.Tag.createManyAndReturn({
    data: [
      { id: 911, name: "ReturnTag1" },
      { id: 912, name: "ReturnTag2" },
    ],
  });

  assertEquals(result.length, 2, "createManyAndReturn length");
  assertEquals(result[0].id, 911, "createManyAndReturn first id");
  assertEquals(result[0].name, "ReturnTag1", "createManyAndReturn first name");
  assertEquals(result[1].id, 912, "createManyAndReturn second id");

  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertCount(32);

  resetSheet("Tag", tagData);
}

export { testCreateMany };
