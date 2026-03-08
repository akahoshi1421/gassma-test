import { GassmaClient } from "../../generated/gassma/testClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { tagData } from "../../consts/tagData";

function testUpdateMany() {
  const client = new GassmaClient();

  testUpdateManyBasic(client);
  testUpdateManyWhere(client);
  testUpdateManyLimit(client);
  testUpdateManyAndReturn(client);

  Logger.log("✅ testUpdateMany: all passed");
}

function testUpdateManyBasic(client: GassmaClient) {
  const result = client.sheets.Tag.updateMany({
    data: { name: "AllUpdated" },
  });

  assertEquals(result.count, 30, "updateMany basic count");

  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertRowEquals({ id: 1 }, { name: "AllUpdated" });
  snapshot.assertRowEquals({ id: 30 }, { name: "AllUpdated" });

  resetSheet("Tag", tagData);
}

function testUpdateManyWhere(client: GassmaClient) {
  const result = client.sheets.Tag.updateMany({
    where: { id: { lte: 5 } },
    data: { name: "First5" },
  });

  assertEquals(result.count, 5, "updateMany where count");

  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertRowEquals({ id: 1 }, { name: "First5" });
  snapshot.assertRowEquals({ id: 5 }, { name: "First5" });
  snapshot.assertRowEquals({ id: 6 }, { name: "Python" });

  resetSheet("Tag", tagData);
}

function testUpdateManyLimit(client: GassmaClient) {
  const result = client.sheets.Tag.updateMany({
    where: { id: { lte: 10 } },
    data: { name: "Limited" },
    limit: 3,
  });

  assertEquals(result.count, 3, "updateMany limit count");

  resetSheet("Tag", tagData);
}

function testUpdateManyAndReturn(client: GassmaClient) {
  const results = client.sheets.Tag.updateManyAndReturn({
    where: { id: { lte: 3 } },
    data: { name: "Returned" },
  });

  assertEquals(results.length, 3, "updateManyAndReturn length");
  assertEquals((results[0] as { name: string }).name, "Returned", "updateManyAndReturn name");

  resetSheet("Tag", tagData);
}

export { testUpdateMany };
