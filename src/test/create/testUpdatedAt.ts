import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { productData } from "../../consts/productData";
import { postData } from "../../consts/postData";
import { userData } from "../../consts/userData";
import { commentData } from "../../consts/commentData";

function testUpdatedAt() {
  const client = new GassmaClient();

  testCreateUpdatedAtAutoSet(client);
  testCreateUpdatedAtExplicitOverride(client);
  testUpdateUpdatedAtAutoSet(client);
  testUpdateManyUpdatedAtAutoSet(client);
  testUpsertCreateUpdatedAt(client);
  testUpsertUpdateUpdatedAt(client);
  testNestedCreateInCreateUpdatedAt(client);
  testNestedCreateInUpdateUpdatedAt(client);

  Logger.log("✅ testUpdatedAt: all passed");
}

function testCreateUpdatedAtAutoSet(client: GassmaClient) {
  // create 時に updatedAt が自動的に Date で設定されることを確認
  const before = new Date();

  client.sheets.Product.create({
    data: {
      id: 901,
      name: "updatedAt自動テスト",
      price: 500,
      stock: 10,
      status: "available",
    },
  });

  const result = client.sheets.Product.findFirst({ where: { id: 901 } });
  if (!result) throw new Error("updatedAt auto: product 901 not found");
  if (!result.updatedAt || typeof result.updatedAt.getTime !== "function") {
    throw new Error(
      `updatedAt auto: expected updatedAt to be Date, got ${result.updatedAt}`,
    );
  }
  if (result.updatedAt.getTime() < before.getTime()) {
    throw new Error("updatedAt auto: updatedAt should be >= before");
  }

  resetSheet("Product", productData);
}

function testCreateUpdatedAtExplicitOverride(client: GassmaClient) {
  // 明示的に updatedAt を指定した場合はその値が使われることを確認
  const explicit = new Date("2020-06-15T12:00:00");

  client.sheets.Post.create({
    data: {
      id: 902,
      title: "updatedAt明示テスト",
      authorId: 1,
      updatedAt: explicit,
    },
  });

  const result = client.sheets.Post.findFirst({ where: { id: 902 } });
  if (!result) throw new Error("updatedAt explicit: post 902 not found");
  if (!result.updatedAt || typeof result.updatedAt.getTime !== "function") {
    throw new Error(
      `updatedAt explicit: expected updatedAt to be Date, got ${result.updatedAt}`,
    );
  }
  assertEquals(
    result.updatedAt.getTime(),
    explicit.getTime(),
    "updatedAt explicit value",
  );

  resetSheet("Post", postData);
}

function testUpdateUpdatedAtAutoSet(client: GassmaClient) {
  // update 時に updatedAt が自動更新されることを確認
  const before = new Date();

  client.sheets.Post.update({
    where: { id: 1 },
    data: { title: "updatedAt update test" },
  });

  const result = client.sheets.Post.findFirst({ where: { id: 1 } });
  if (!result) throw new Error("updatedAt update: post 1 not found");
  if (!result.updatedAt || typeof result.updatedAt.getTime !== "function") {
    throw new Error(
      `updatedAt update: expected updatedAt to be Date, got ${result.updatedAt}`,
    );
  }
  if (result.updatedAt.getTime() < before.getTime()) {
    throw new Error("updatedAt update: updatedAt should be >= before");
  }

  resetSheet("Post", postData);
}

function testUpdateManyUpdatedAtAutoSet(client: GassmaClient) {
  // updateMany 時に updatedAt が自動更新されることを確認
  const before = new Date();

  client.sheets.Product.updateMany({
    where: { status: "available" },
    data: { stock: 999 },
  });

  const result = client.sheets.Product.findFirst({
    where: { status: "available" },
  });
  if (!result) throw new Error("updatedAt updateMany: no available product");
  if (!result.updatedAt || typeof result.updatedAt.getTime !== "function") {
    throw new Error(
      `updatedAt updateMany: expected updatedAt to be Date, got ${result.updatedAt}`,
    );
  }
  if (result.updatedAt.getTime() < before.getTime()) {
    throw new Error("updatedAt updateMany: updatedAt should be >= before");
  }

  resetSheet("Product", productData);
}

function testUpsertCreateUpdatedAt(client: GassmaClient) {
  // upsert の create パスで updatedAt が自動設定されることを確認
  const before = new Date();

  const result = client.sheets.Product.upsert({
    where: { id: 911 },
    create: {
      id: 911,
      name: "upsert create updatedAt",
      price: 300,
      stock: 5,
      status: "available",
    },
    update: { name: "should not update" },
  });

  if (!result.updatedAt || typeof result.updatedAt.getTime !== "function") {
    throw new Error(
      `upsert create updatedAt: expected Date, got ${result.updatedAt}`,
    );
  }
  if (result.updatedAt.getTime() < before.getTime()) {
    throw new Error("upsert create updatedAt: should be >= before");
  }

  resetSheet("Product", productData);
}

function testUpsertUpdateUpdatedAt(client: GassmaClient) {
  // upsert の update パスで updatedAt が自動更新されることを確認
  const before = new Date();

  const result = client.sheets.Post.upsert({
    where: { id: 1 },
    create: {
      id: 921,
      title: "should not create",
      authorId: 1,
    },
    update: { title: "upsert update updatedAt test" },
  });

  if (!result.updatedAt || typeof result.updatedAt.getTime !== "function") {
    throw new Error(
      `upsert update updatedAt: expected Date, got ${result.updatedAt}`,
    );
  }
  if (result.updatedAt.getTime() < before.getTime()) {
    throw new Error("upsert update updatedAt: should be >= before");
  }

  resetSheet("Post", postData);
}

function testNestedCreateInCreateUpdatedAt(client: GassmaClient) {
  // create の nested write でも updatedAt が自動設定されることを確認
  const before = new Date();

  client.sheets.User.create({
    data: {
      id: 931,
      email: "nested-updatedAt@test.com",
      name: "NestedUpdatedAtUser",
      isActive: true,
      role: "USER",
      createdAt: new Date("2025-01-01T00:00:00"),
      posts: {
        create: {
          id: 931,
          title: "nested create updatedAt",
          authorId: 931,
        },
      },
    },
  });

  const postResult = client.sheets.Post.findFirst({ where: { id: 931 } });
  if (!postResult) throw new Error("nested create updatedAt: post 931 not found");
  if (
    !postResult.updatedAt ||
    typeof postResult.updatedAt.getTime !== "function"
  ) {
    throw new Error(
      `nested create updatedAt: expected Date, got ${postResult.updatedAt}`,
    );
  }
  if (postResult.updatedAt.getTime() < before.getTime()) {
    throw new Error("nested create updatedAt: should be >= before");
  }

  resetSheet("Post", postData);
  resetSheet("User", userData);
}

function testNestedCreateInUpdateUpdatedAt(client: GassmaClient) {
  // update の nested create でも updatedAt が自動設定されることを確認
  const before = new Date();

  client.sheets.User.update({
    where: { id: 1 },
    data: {
      posts: {
        create: {
          id: 941,
          title: "update nested updatedAt",
          authorId: 1,
        },
      },
    },
  });

  const postResult = client.sheets.Post.findFirst({ where: { id: 941 } });
  if (!postResult) throw new Error("update nested updatedAt: post 941 not found");
  if (
    !postResult.updatedAt ||
    typeof postResult.updatedAt.getTime !== "function"
  ) {
    throw new Error(
      `update nested updatedAt: expected Date, got ${postResult.updatedAt}`,
    );
  }
  if (postResult.updatedAt.getTime() < before.getTime()) {
    throw new Error("update nested updatedAt: should be >= before");
  }

  resetSheet("Post", postData);
}

export { testUpdatedAt };
