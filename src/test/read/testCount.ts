import { GassmaClient } from "../../generated/gassma/testClient";
import { assertEquals } from "../../assert/assertEquals";

function testCount() {
  const client = new GassmaClient();

  testCountBasic(client);
  testCountWhere(client);

  Logger.log("✅ testCount: all passed");
}

function testCountBasic(client: GassmaClient) {
  const count = client.sheets.User.count({});
  assertEquals(count, 50, "count basic User");

  const postCount = client.sheets.Post.count({});
  assertEquals(postCount, 200, "count basic Post");

  const commentCount = client.sheets.Comment.count({});
  assertEquals(commentCount, 500, "count basic Comment");
}

function testCountWhere(client: GassmaClient) {
  const adminCount = client.sheets.User.count({
    where: { role: "admin" },
  });
  if (adminCount <= 0) {
    throw new Error("count where: expected admin count > 0");
  }

  const publishedCount = client.sheets.Post.count({
    where: { published: true },
  });
  if (publishedCount <= 0) {
    throw new Error("count where: expected published count > 0");
  }
}

export { testCount };
