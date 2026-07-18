import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { tagData } from "../../consts/tagData";
import { commentData } from "../../consts/commentData";
import { orderItemData } from "../../consts/orderItemData";

function testDeleteMany() {
  const client = new GassmaClient();

  testDeleteManyBasic(client);
  testDeleteManyWhere(client);
  testDeleteManyLimit(client);
  testDeleteManyRelationFilter(client);
  testDeleteManyFieldsWhere(client);

  Logger.log("✅ testDeleteMany: all passed");
}

function testDeleteManyBasic(client: GassmaClient) {
  const result = client.Tag.deleteMany({
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
  const beforeCount = client.Comment.count({
    where: { authorId: 1 },
  });

  const result = client.Comment.deleteMany({
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
  const result = client.Tag.deleteMany({
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

function testDeleteManyRelationFilter(client: GassmaClient) {
  // postId=28 の Comment は 9 件
  const result = client.Comment.deleteMany({
    where: {
      post: { is: { id: 28 } },
    },
  });

  assertEquals(result.count, 9, "deleteMany relation filter count");

  const snapshot = getSheetSnapshot("Comment");
  snapshot.assertRowNotExists({ postId: 28 });
  snapshot.assertRowExists({ postId: 74 });
  snapshot.assertCount(491);

  resetSheet("Comment", commentData);
}

function testDeleteManyFieldsWhere(client: GassmaClient) {
  // orderId === productId の OrderItem は 2 件 (id 335, 366)
  const result = client.OrderItem.deleteMany({
    where: {
      orderId: { equals: client.OrderItem.fields.productId },
    },
  });

  assertEquals(result.count, 2, "deleteMany fields where count");

  const snapshot = getSheetSnapshot("OrderItem");
  snapshot.assertRowNotExists({ id: 335 });
  snapshot.assertRowNotExists({ id: 366 });
  snapshot.assertCount(798);

  resetSheet("OrderItem", orderItemData);
}

export { testDeleteMany };
