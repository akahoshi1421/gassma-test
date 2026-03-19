import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { productData } from "../../consts/productData";
import { userData } from "../../consts/userData";
import { postData } from "../../consts/postData";
import { commentData } from "../../consts/commentData";

function testDefaults() {
  const client = new GassmaClient();

  testCreateStaticDefaults(client);
  testCreateFunctionDefaults(client);
  testCreateDefaultsExplicitOverride(client);
  testCreateManyDefaults(client);
  testCreateManyAndReturnDefaults(client);
  testUpsertCreateDefaults(client);
  testNestedCreateInCreateDefaults(client);
  testNestedCreateInUpdateDefaults(client);
  testNestedCreateArrayInUpdateDefaults(client);

  Logger.log("✅ testDefaults: all passed");
}

function testCreateStaticDefaults(client: GassmaClient) {
  // User.isActive (default: true), Post.published (default: false), Post.viewCount (default: 0)
  client.sheets.User.create({
    data: {
      id: 801,
      email: "defaults-static@test.com",
      name: "DefaultsStaticUser",
      role: "USER",
    },
  });

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowExists({ id: 801 });
  userSnapshot.assertRowEquals({ id: 801 }, { isActive: true });

  client.sheets.Post.create({
    data: {
      id: 801,
      title: "defaults static post",
      authorId: 801,
    },
  });

  const postSnapshot = getSheetSnapshot("Post");
  postSnapshot.assertRowExists({ id: 801 });
  postSnapshot.assertRowEquals({ id: 801 }, { published: false, viewCount: 0 });

  resetSheet("Post", postData);
  resetSheet("User", userData);
}

function testCreateFunctionDefaults(client: GassmaClient) {
  // createdAt (default: () => new Date()) が Date として設定されるかテスト
  client.sheets.Product.create({
    data: {
      id: 802,
      name: "デフォルト日付テスト",
      price: 1000,
      stock: 5,
      status: "available",
    },
  });

  const result = client.sheets.Product.findFirst({ where: { id: 802 } });
  if (!result) throw new Error("defaults function: product 802 not found");
  if (!result.createdAt || typeof result.createdAt.getTime !== "function") {
    throw new Error(
      `defaults function: expected createdAt to be Date, got ${result.createdAt}`,
    );
  }

  resetSheet("Product", productData);
}

function testCreateDefaultsExplicitOverride(client: GassmaClient) {
  // 明示的に値を指定した場合はデフォルト値が上書きされないことを確認
  client.sheets.User.create({
    data: {
      id: 803,
      email: "defaults-override@test.com",
      name: "OverrideUser",
      isActive: false,
      role: "ADMIN",
      createdAt: new Date("2020-01-01T00:00:00"),
    },
  });

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowEquals({ id: 803 }, { isActive: false });

  const result = client.sheets.User.findFirst({ where: { id: 803 } });
  if (!result) throw new Error("defaults override: user 803 not found");
  if (!result.createdAt) throw new Error("defaults override: createdAt is null");
  assertEquals(
    result.createdAt.getTime(),
    new Date("2020-01-01T00:00:00").getTime(),
    "defaults override createdAt",
  );

  resetSheet("User", userData);
}

function testCreateManyDefaults(client: GassmaClient) {
  // createMany でもデフォルト値が適用されるかテスト
  client.sheets.Post.createMany({
    data: [
      { id: 811, title: "many defaults 1", authorId: 1 },
      { id: 812, title: "many defaults 2", authorId: 1 },
    ],
  });

  const snapshot = getSheetSnapshot("Post");
  snapshot.assertRowEquals({ id: 811 }, { published: false, viewCount: 0 });
  snapshot.assertRowEquals({ id: 812 }, { published: false, viewCount: 0 });

  resetSheet("Post", postData);
}

function testCreateManyAndReturnDefaults(client: GassmaClient) {
  // createManyAndReturn の戻り値にデフォルト値が含まれるかテスト
  const results = client.sheets.Post.createManyAndReturn({
    data: [
      { id: 813, title: "return defaults 1", authorId: 1 },
      { id: 814, title: "return defaults 2", authorId: 1 },
    ],
  });

  assertEquals(results[0].published, false, "createManyAndReturn default published");
  assertEquals(results[0].viewCount, 0, "createManyAndReturn default viewCount");
  assertEquals(results[1].published, false, "createManyAndReturn default published 2");

  resetSheet("Post", postData);
}

function testUpsertCreateDefaults(client: GassmaClient) {
  // upsert の create パスでデフォルト値が適用されるかテスト
  const result = client.sheets.User.upsert({
    where: { id: 821 },
    create: {
      id: 821,
      email: "upsert-defaults@test.com",
      name: "UpsertDefaultsUser",
      role: "USER",
    },
    update: { name: "ShouldNotUpdate" },
  });

  assertEquals(result.isActive, true, "upsert create default isActive");
  if (!result.createdAt || typeof result.createdAt.getTime !== "function") {
    throw new Error(
      `upsert create defaults: expected createdAt to be Date, got ${result.createdAt}`,
    );
  }

  const snapshot = getSheetSnapshot("User");
  snapshot.assertRowEquals({ id: 821 }, { isActive: true });

  resetSheet("User", userData);
}

function testNestedCreateInCreateDefaults(client: GassmaClient) {
  // create の nested write でもデフォルト値が適用されるかテスト
  client.sheets.User.create({
    data: {
      id: 831,
      email: "nested-create-defaults@test.com",
      name: "NestedCreateDefaultsUser",
      isActive: true,
      role: "USER",
      createdAt: new Date("2025-01-01T00:00:00"),
      posts: {
        create: {
          id: 831,
          title: "nested create defaults post",
          authorId: 831,
        },
      },
    },
  });

  const postSnapshot = getSheetSnapshot("Post");
  postSnapshot.assertRowExists({ id: 831 });
  postSnapshot.assertRowEquals({ id: 831 }, { published: false, viewCount: 0 });

  const postResult = client.sheets.Post.findFirst({ where: { id: 831 } });
  if (!postResult) throw new Error("nested create defaults: post 831 not found");
  if (!postResult.createdAt || typeof postResult.createdAt.getTime !== "function") {
    throw new Error(
      `nested create defaults: expected createdAt to be Date, got ${postResult.createdAt}`,
    );
  }

  resetSheet("Post", postData);
  resetSheet("User", userData);
}

function testNestedCreateInUpdateDefaults(client: GassmaClient) {
  // update の nested create でもデフォルト値が適用されるかテスト
  client.sheets.User.update({
    where: { id: 1 },
    data: {
      posts: {
        create: {
          id: 841,
          title: "update nested defaults post",
          authorId: 1,
        },
      },
    },
  });

  const postSnapshot = getSheetSnapshot("Post");
  postSnapshot.assertRowExists({ id: 841 });
  postSnapshot.assertRowEquals({ id: 841 }, { published: false, viewCount: 0 });

  const postResult = client.sheets.Post.findFirst({ where: { id: 841 } });
  if (!postResult) throw new Error("update nested defaults: post 841 not found");
  if (!postResult.createdAt || typeof postResult.createdAt.getTime !== "function") {
    throw new Error(
      `update nested defaults: expected createdAt to be Date, got ${postResult.createdAt}`,
    );
  }

  resetSheet("Post", postData);
}

function testNestedCreateArrayInUpdateDefaults(client: GassmaClient) {
  // update の nested create（配列）でもデフォルト値が適用されるかテスト
  client.sheets.Post.update({
    where: { id: 1 },
    data: {
      comments: {
        create: [
          { id: 851, text: "nested array default 1", authorId: 1, postId: 1 },
          { id: 852, text: "nested array default 2", authorId: 2, postId: 1 },
        ],
      },
    },
  });

  const comment1 = client.sheets.Comment.findFirst({ where: { id: 851 } });
  if (!comment1) throw new Error("nested create array defaults: comment 851 not found");
  if (!comment1.createdAt || typeof comment1.createdAt.getTime !== "function") {
    throw new Error(
      `nested create array defaults: expected comment1 createdAt to be Date, got ${comment1.createdAt}`,
    );
  }

  const comment2 = client.sheets.Comment.findFirst({ where: { id: 852 } });
  if (!comment2) throw new Error("nested create array defaults: comment 852 not found");
  if (!comment2.createdAt || typeof comment2.createdAt.getTime !== "function") {
    throw new Error(
      `nested create array defaults: expected comment2 createdAt to be Date, got ${comment2.createdAt}`,
    );
  }

  resetSheet("Comment", commentData);
}

export { testDefaults };
