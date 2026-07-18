import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { tagData } from "../../consts/tagData";
import { postData } from "../../consts/postData";
import { orderItemData } from "../../consts/orderItemData";

function testUpdateMany() {
  const client = new GassmaClient();

  testUpdateManyBasic(client);
  testUpdateManyWhere(client);
  testUpdateManyLimit(client);
  testUpdateManyAndReturn(client);
  testUpdateManyRelationFilter(client);
  testUpdateManyFieldsWhere(client);

  Logger.log("✅ testUpdateMany: all passed");
}

function testUpdateManyBasic(client: GassmaClient) {
  const result = client.Tag.updateMany({
    data: { name: "AllUpdated" },
  });

  assertEquals(result.count, 30, "updateMany basic count");

  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertRowEquals({ id: 1 }, { name: "AllUpdated" });
  snapshot.assertRowEquals({ id: 30 }, { name: "AllUpdated" });

  resetSheet("Tag", tagData);
}

function testUpdateManyWhere(client: GassmaClient) {
  const result = client.Tag.updateMany({
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
  const result = client.Tag.updateMany({
    where: { id: { lte: 10 } },
    data: { name: "Limited" },
    limit: 3,
  });

  assertEquals(result.count, 3, "updateMany limit count");

  const snapshot = getSheetSnapshot("Tag");
  // limit外のレコードが影響を受けていないことを確認
  snapshot.assertRowEquals({ id: 10 }, { name: "Kubernetes" });

  resetSheet("Tag", tagData);
}

function testUpdateManyAndReturn(client: GassmaClient) {
  const results = client.Tag.updateManyAndReturn({
    where: { id: { lte: 3 } },
    data: { name: "Returned" },
  });

  assertEquals(results.length, 3, "updateManyAndReturn length");
  assertEquals(results[0].name, "Returned", "updateManyAndReturn name");

  resetSheet("Tag", tagData);
}

function testUpdateManyRelationFilter(client: GassmaClient) {
  // ADMIN (id: 1,4,18,34,35,45) の未公開 Post は 9 件
  const result = client.Post.updateMany({
    where: {
      author: { is: { role: "ADMIN" } },
      published: false,
    },
    data: { published: true },
  });

  assertEquals(result.count, 9, "updateMany relation filter count");

  const snapshot = getSheetSnapshot("Post");
  // id=54 は ADMIN(authorId=1) の未公開 Post → 更新される
  snapshot.assertRowEquals({ id: 54 }, { published: true });
  // id=3 は USER(authorId=9) の未公開 Post → 更新されない
  snapshot.assertRowEquals({ id: 3 }, { published: false });

  resetSheet("Post", postData);
}

function testUpdateManyFieldsWhere(client: GassmaClient) {
  // orderId === productId の OrderItem は 2 件 (id 335, 366)
  const result = client.OrderItem.updateMany({
    where: {
      orderId: { equals: client.OrderItem.fields.productId },
    },
    data: { quantity: 999 },
  });

  assertEquals(result.count, 2, "updateMany fields where count");

  const snapshot = getSheetSnapshot("OrderItem");
  snapshot.assertRowEquals({ id: 335 }, { quantity: 999 });
  snapshot.assertRowEquals({ id: 366 }, { quantity: 999 });
  snapshot.assertRowEquals({ id: 1 }, { quantity: 5 });

  resetSheet("OrderItem", orderItemData);
}

export { testUpdateMany };
