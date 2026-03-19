import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { tagData } from "../../consts/tagData";
import { userData } from "../../consts/userData";
import { profileData } from "../../consts/profileData";
import { postData } from "../../consts/postData";
import { commentData } from "../../consts/commentData";

function testUpsert() {
  const client = new GassmaClient();

  testUpsertCreate(client);
  testUpsertUpdate(client);
  testUpsertReturnValue(client);
  testUpsertSelect(client);
  testUpsertOmit(client);
  testUpsertNumberOperation(client);
  testUpsertNestedCreate(client);
  testUpsertNestedUpdate(client);

  Logger.log("✅ testUpsert: all passed");
}

function testUpsertCreate(client: GassmaClient) {
  // 存在しない id → create が実行される
  const result = client.sheets.Tag.upsert({
    where: { id: 999 },
    create: { id: 999, name: "UpsertNew" },
    update: { name: "UpsertExisting" },
  });

  assertEquals(result.id, 999, "upsert create id");
  assertEquals(result.name, "UpsertNew", "upsert create name");

  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertRowExists({ id: 999 });
  snapshot.assertRowEquals({ id: 999 }, { name: "UpsertNew" });

  resetSheet("Tag", tagData);
}

function testUpsertUpdate(client: GassmaClient) {
  // 存在する id → update が実行される
  const result = client.sheets.Tag.upsert({
    where: { id: 1 },
    create: { id: 1, name: "ShouldNotCreate" },
    update: { name: "UpsertUpdated" },
  });

  assertEquals(result.id, 1, "upsert update id");
  assertEquals(result.name, "UpsertUpdated", "upsert update name");

  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertRowEquals({ id: 1 }, { name: "UpsertUpdated" });

  resetSheet("Tag", tagData);
}

function testUpsertReturnValue(client: GassmaClient) {
  // create パス
  const createResult = client.sheets.Tag.upsert({
    where: { id: 998 },
    create: { id: 998, name: "ReturnCreate" },
    update: { name: "ReturnUpdate" },
  });
  assertEquals(createResult.name, "ReturnCreate", "upsert return create name");

  resetSheet("Tag", tagData);

  // update パス
  const updateResult = client.sheets.Tag.upsert({
    where: { id: 1 },
    create: { id: 1, name: "ShouldNotCreate" },
    update: { name: "ReturnUpdate" },
  });
  assertEquals(updateResult.name, "ReturnUpdate", "upsert return update name");

  resetSheet("Tag", tagData);
}

function testUpsertSelect(client: GassmaClient) {
  const result = client.sheets.Tag.upsert({
    where: { id: 1 },
    create: { id: 1, name: "SelectCreate" },
    update: { name: "SelectUpdate" },
    select: { id: true, name: true },
  });

  assertDeepEquals(Object.keys(result).sort(), ["id", "name"], "upsert select keys");
  assertEquals(result.id, 1, "upsert select id");
  assertEquals(result.name, "SelectUpdate", "upsert select name");

  resetSheet("Tag", tagData);
}

function testUpsertOmit(client: GassmaClient) {
  const result = client.sheets.Tag.upsert({
    where: { id: 1 },
    create: { id: 1, name: "OmitCreate" },
    update: { name: "OmitUpdate" },
    omit: { name: true },
  });

  const keys = Object.keys(result);
  if (keys.indexOf("name") !== -1) {
    throw new Error("upsert omit: name should be omitted");
  }
  if (keys.indexOf("id") === -1) {
    throw new Error("upsert omit: id should be present");
  }

  resetSheet("Tag", tagData);
}

function testUpsertNumberOperation(client: GassmaClient) {
  // update パスで NumberOperation が使える
  const before = client.sheets.Tag.findFirst({ where: { id: 1 } });
  if (!before) throw new Error("upsert number: tag 1 not found");

  client.sheets.Tag.upsert({
    where: { id: 1 },
    create: { id: 1, name: "ShouldNotCreate" },
    update: { id: { increment: 1000 } },
  });

  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertRowEquals({ id: 1001 }, { name: "JavaScript" });

  resetSheet("Tag", tagData);
}

function testUpsertNestedCreate(client: GassmaClient) {
  // create パスで nested write（User + Profile）
  client.sheets.User.upsert({
    where: { id: 951 },
    create: {
      id: 951,
      email: "upsert-new@test.com",
      name: "UpsertNewUser",
      isActive: true,
      role: "USER",
      createdAt: new Date("2025-01-01T00:00:00"),
      profile: {
        create: { id: 951, bio: "upsert profile", userId: 951 },
      },
    },
    update: { name: "ShouldNotUpdate" },
  });

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowExists({ id: 951 });
  userSnapshot.assertRowEquals({ id: 951 }, { name: "UpsertNewUser" });

  const profileSnapshot = getSheetSnapshot("Profile");
  profileSnapshot.assertRowExists({ userId: 951 });

  resetSheet("User", userData);
  resetSheet("Profile", profileData);
}

function testUpsertNestedUpdate(client: GassmaClient) {
  // update パスで nested write（User の posts を nested create）
  client.sheets.User.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      email: "should-not@test.com",
      name: "ShouldNotCreate",
      isActive: true,
      role: "USER",
      createdAt: new Date("2025-01-01T00:00:00"),
    },
    update: {
      name: "UpsertUpdatedUser",
      posts: {
        create: {
          id: 951,
          title: "upsert nested post",
          published: true,
          viewCount: 0,
          authorId: 1,
          createdAt: new Date("2025-01-01T00:00:00"),
        },
      },
    },
  });

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowEquals({ id: 1 }, { name: "UpsertUpdatedUser" });

  const postSnapshot = getSheetSnapshot("Post");
  postSnapshot.assertRowExists({ id: 951 });
  postSnapshot.assertRowEquals({ id: 951 }, { authorId: 1 });

  resetSheet("User", userData);
  resetSheet("Post", postData);
}

export { testUpsert };
