import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testCount() {
  const client = new GassmaClient();

  testCountBasic(client);
  testCountWhere(client);
  testCountTakeSkip(client);

  Logger.log("✅ testCount: all passed");
}

function testCountBasic(client: GassmaClient) {
  const count = client.User.count({});
  assertEquals(count, 50, "count basic User");

  const postCount = client.Post.count({});
  assertEquals(postCount, 200, "count basic Post");

  const commentCount = client.Comment.count({});
  assertEquals(commentCount, 500, "count basic Comment");
}

function testCountWhere(client: GassmaClient) {
  const adminCount = client.User.count({
    where: { role: "ADMIN" },
  });
  if (adminCount <= 0) {
    throw new Error("count where: expected admin count > 0");
  }

  const publishedCount = client.Post.count({
    where: { published: true },
  });
  if (publishedCount <= 0) {
    throw new Error("count where: expected published count > 0");
  }
}

function testCountTakeSkip(client: GassmaClient) {
  // GASsma 固有仕様: take/skip はカウント前の行絞り込みに適用される
  const takeCount = client.User.count({ take: 10 });
  assertEquals(takeCount, 10, "count take");

  const skipCount = client.User.count({ skip: 45 });
  assertEquals(skipCount, 5, "count skip");

  // skip 45 → 残 5 行なので take 10 でも 5
  const skipTakeCount = client.User.count({ skip: 45, take: 10 });
  assertEquals(skipTakeCount, 5, "count skip + take");
}

export { testCount };
