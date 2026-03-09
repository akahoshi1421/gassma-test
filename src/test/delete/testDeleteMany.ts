import { GassmaClient } from "../../generated/gassma/testClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { tagData } from "../../consts/tagData";
import { commentData } from "../../consts/commentData";

function testDeleteMany() {
  const client = new GassmaClient();

  testDeleteManyBasic(client);
  testDeleteManyWhere(client);
  testDeleteManyLimit(client);

  Logger.log("✅ testDeleteMany: all passed");
}

function testDeleteManyBasic(client: GassmaClient) {
  const result = client.sheets.Tag.deleteMany({
    where: { id: { in: [1, 2, 3] } },
  });

  assertEquals(result.count, 3, "deleteMany count");

  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertRowNotExists({ id: 1 });
  snapshot.assertRowNotExists({ id: 2 });
  snapshot.assertRowNotExists({ id: 3 });
  snapshot.assertRowExists({ id: 4 });
  snapshot.assertRowExists({ id: 30 });
  snapshot.assertCount(27);

  resetSheet("Tag", tagData);
}

function testDeleteManyWhere(client: GassmaClient) {
  const beforeCount = client.sheets.Comment.count({
    where: { authorId: 1 },
  });

  const result = client.sheets.Comment.deleteMany({
    where: { authorId: 1 },
  });

  assertEquals(result.count, beforeCount, "deleteMany where count matches");

  const snapshot = getSheetSnapshot("Comment");
  snapshot.assertRowNotExists({ authorId: 1 });
  snapshot.assertRowExists({ authorId: 2 });
  snapshot.assertRowExists({ authorId: 3 });

  resetSheet("Comment", commentData);
}

function testDeleteManyLimit(client: GassmaClient) {
  const result = client.sheets.Tag.deleteMany({
    where: { id: { gte: 1 } },
    limit: 5,
  });

  assertEquals(result.count, 5, "deleteMany limit count");

  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertRowExists({ id: 6 });
  snapshot.assertRowExists({ id: 30 });
  snapshot.assertCount(25);

  resetSheet("Tag", tagData);
}

export { testDeleteMany };
