import { GassmaClient } from "../../generated/gassma/gassmaClient";

function testFields() {
  const client = new GassmaClient();

  testFieldsEquals(client);
  testFieldsComparison(client);
  testFieldsContains(client);

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

export { testFields };
