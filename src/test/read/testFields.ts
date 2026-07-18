import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testFields() {
  const client = new GassmaClient();

  testFieldsEquals(client);
  testFieldsComparison(client);
  testFieldsContains(client);
  testFieldsCountWhere(client);
  testFieldsInsensitive(client);
  testFieldsLogicalOperators(client);
  testFieldsNonexistentColumn(client);

  Logger.log("✅ testFields: all passed");
}

function testFieldsEquals(client: GassmaClient) {
  // User の id と age が同じ行を検索（FieldRef で列同士比較）
  const users = client.User.findMany({
    where: {
      age: { equals: client.User.fields.id },
    },
  });

  // 結果が正しいか検証: 各ユーザーの age === id
  users.forEach((user) => {
    if (user.age !== user.id) {
      throw new Error(`fields equals: age(${user.age}) !== id(${user.id})`);
    }
  });
}

function testFieldsComparison(client: GassmaClient) {
  // Post で viewCount が id より大きい
  const posts = client.Post.findMany({
    where: {
      viewCount: { gt: client.Post.fields.id },
    },
  });
  posts.forEach((post) => {
    if (post.viewCount === null || post.id === null || post.viewCount <= post.id) {
      throw new Error(`fields gt: viewCount(${post.viewCount}) should be > id(${post.id})`);
    }
  });
  if (posts.length === 0) {
    throw new Error("fields gt: expected results");
  }
}

function testFieldsContains(client: GassmaClient) {
  // OrderItem で orderId と productId が同じ（equals で FieldRef）
  const items = client.OrderItem.findMany({
    where: {
      orderId: { equals: client.OrderItem.fields.productId },
    },
  });

  items.forEach((item) => {
    if (item.orderId !== item.productId) {
      throw new Error(`fields equals orderId/productId: ${item.orderId} !== ${item.productId}`);
    }
  });
}

function testFieldsCountWhere(client: GassmaClient) {
  // orderId === productId の OrderItem は consts 実データで 2 件 (id 335, 366)
  const count = client.OrderItem.count({
    where: {
      orderId: { equals: client.OrderItem.fields.productId },
    },
  });
  assertEquals(count, 2, "fields count where");
}

function testFieldsInsensitive(client: GassmaClient) {
  // 既存 Product に name と status が insensitive 一致する行は無い
  client.Product.create({
    data: {
      id: 976,
      name: "AVAILABLE",
      price: 100,
      stock: 1,
      status: "available",
      createdAt: new Date("2025-01-01T00:00:00"),
      updatedAt: new Date("2025-01-01T00:00:00"),
    },
  });

  const insensitiveCount = client.Product.count({
    where: {
      name: { equals: client.Product.fields.status, mode: "insensitive" },
    },
  });
  assertEquals(insensitiveCount, 1, "fields insensitive equals count");

  const sensitiveCount = client.Product.count({
    where: {
      name: { equals: client.Product.fields.status },
    },
  });
  assertEquals(sensitiveCount, 0, "fields sensitive equals count");

  client.Product.delete({ where: { id: 976 } });
}

function testFieldsLogicalOperators(client: GassmaClient) {
  // consts 実データ: viewCount > id は 198 件 / viewCount < id は 2 件 (id 185, 195) / 一致は 0 件
  const andCount = client.Post.count({
    where: {
      AND: [
        { viewCount: { gt: client.Post.fields.id } },
        { published: true },
      ],
    },
  });
  assertEquals(andCount, 133, "fields AND count");

  const orCount = client.Post.count({
    where: {
      OR: [
        { viewCount: { lt: client.Post.fields.id } },
        { viewCount: { equals: client.Post.fields.id } },
      ],
    },
  });
  assertEquals(orCount, 2, "fields OR count");

  const notCount = client.Post.count({
    where: {
      NOT: {
        viewCount: { gt: client.Post.fields.id },
      },
    },
  });
  assertEquals(notCount, 2, "fields NOT count");
}

function testFieldsNonexistentColumn(client: GassmaClient) {
  // 存在しない列の FieldRef は undefined に解決され、どの行にもマッチしない
  const equalsCount = client.User.count({
    where: {
      age: { equals: client.User.fields.nonexistentColumn },
    },
  });
  assertEquals(equalsCount, 0, "fields nonexistent column equals count");

  const gtCount = client.Post.count({
    where: {
      viewCount: { gt: client.Post.fields.nonexistentColumn },
    },
  });
  assertEquals(gtCount, 0, "fields nonexistent column gt count");
}

export { testFields };
