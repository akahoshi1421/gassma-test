import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testCount() {
  const client = new GassmaClient();

  testCountBasic(client);
  testCountWhere(client);

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

export { testCount };
