import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertThrows } from "../../assert/assertThrows";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { userData } from "../../consts/userData";
import { profileData } from "../../consts/profileData";

function testNestedOneToOneNonFk() {
  const client = new GassmaClient();

  testNonFkCreateInCreateContext(client);
  testNonFkCreateInUpdateContext(client);
  testNonFkConnectReplace(client);
  testNonFkConnectNotFound(client);
  testNonFkConnectOrCreate(client);
  testNonFkUpdateBareData(client);
  testNonFkUpdateNotFound(client);
  testNonFkDisconnect(client);
  testNonFkDelete(client);
  testNonFkInvalidOperations(client);
  testFkOwningSideBareUpdate(client);

  Logger.log("✅ testNestedOneToOneNonFk: all passed");
}

function createFixtureUser(client: GassmaClient, id: number) {
  client.User.create({
    data: {
      id,
      email: "o2o" + id + "@test.com",
      name: "O2OUser" + id,
      role: "USER",
      createdAt: new Date("2025-01-01T00:00:00"),
    },
  });
}

function assertProfileUserIdIsNull(client: GassmaClient, profileId: number, label: string) {
  const profile = client.Profile.findFirstOrThrow({ where: { id: profileId } });
  const readBackUserId: unknown = profile.userId;
  if (readBackUserId !== null) {
    throw new Error(`${label}: userId should be null but got ${JSON.stringify(readBackUserId)}`);
  }
}

// create 文脈: 子 Profile が userId=親id で作成され、親の id セルは無傷
function testNonFkCreateInCreateContext(client: GassmaClient) {
  client.User.create({
    data: {
      id: 995,
      email: "o2o995@test.com",
      name: "O2OUser995",
      role: "USER",
      createdAt: new Date("2025-01-01T00:00:00"),
      profile: {
        create: { id: 995, bio: "o2o create bio", userId: 995 },
      },
    },
  });

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowEquals({ id: 995 }, { email: "o2o995@test.com" });
  userSnapshot.assertCount(51);

  const profileSnapshot = getSheetSnapshot("Profile");
  profileSnapshot.assertRowEquals({ id: 995 }, { userId: 995, bio: "o2o create bio" });

  // userId に別値を渡しても親 id で強制され、親の id は乗っ取られない
  client.User.create({
    data: {
      id: 996,
      email: "o2o996@test.com",
      name: "O2OUser996",
      role: "USER",
      createdAt: new Date("2025-01-01T00:00:00"),
      profile: {
        create: { id: 996, bio: "o2o forced fk", userId: 997 },
      },
    },
  });

  const userSnapshot2 = getSheetSnapshot("User");
  userSnapshot2.assertRowEquals({ id: 996 }, { email: "o2o996@test.com" });
  userSnapshot2.assertRowNotExists({ id: 997 });
  userSnapshot2.assertCount(52);

  const profileSnapshot2 = getSheetSnapshot("Profile");
  profileSnapshot2.assertRowEquals({ id: 996 }, { userId: 996 });

  resetSheet("User", userData);
  resetSheet("Profile", profileData);
}

// update 文脈の create: スカラー更新と同時でも親の id は無傷
function testNonFkCreateInUpdateContext(client: GassmaClient) {
  createFixtureUser(client, 995);

  client.User.update({
    where: { id: 995 },
    data: {
      name: "O2OUpdated995",
      profile: {
        create: { id: 995, bio: "created via update", userId: 995 },
      },
    },
  });

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowEquals({ id: 995 }, { name: "O2OUpdated995", email: "o2o995@test.com" });
  userSnapshot.assertCount(51);

  const profileSnapshot = getSheetSnapshot("Profile");
  profileSnapshot.assertRowEquals({ id: 995 }, { userId: 995, bio: "created via update" });
  profileSnapshot.assertCount(51);

  resetSheet("User", userData);
  resetSheet("Profile", profileData);
}

// connect: 既接続の Profile を切り離してから対象を親に付け替える（置き換え）
function testNonFkConnectReplace(client: GassmaClient) {
  createFixtureUser(client, 995);
  client.Profile.create({ data: { id: 995, bio: "old profile", userId: 995 } });

  client.User.update({
    where: { id: 995 },
    data: { profile: { connect: { id: 40 } } },
  });

  const profileSnapshot = getSheetSnapshot("Profile");
  profileSnapshot.assertRowEquals({ id: 995 }, { userId: "", bio: "old profile" });
  profileSnapshot.assertRowEquals({ id: 40 }, { userId: 995 });
  profileSnapshot.assertRowEquals({ id: 39 }, { userId: 39 });

  assertProfileUserIdIsNull(client, 995, "o2o connect replace");

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowEquals({ id: 995 }, { email: "o2o995@test.com" });
  userSnapshot.assertCount(51);

  resetSheet("User", userData);
  resetSheet("Profile", profileData);
}

function testNonFkConnectNotFound(client: GassmaClient) {
  createFixtureUser(client, 995);

  assertThrows(
    () => {
      client.User.update({
        where: { id: 995 },
        data: { profile: { connect: { id: 99999 } } },
      });
    },
    'Nested write connect failed: no record found in "Profile"',
    "o2o connect not found",
  );

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowEquals({ id: 995 }, { email: "o2o995@test.com" });

  const profileSnapshot = getSheetSnapshot("Profile");
  profileSnapshot.assertCount(50);

  resetSheet("User", userData);
}

// connectOrCreate: 対象ありは connect（置き換え）、なしは create（userId=親id）
function testNonFkConnectOrCreate(client: GassmaClient) {
  createFixtureUser(client, 995);
  client.Profile.create({ data: { id: 995, bio: "old profile", userId: 995 } });

  client.User.update({
    where: { id: 995 },
    data: {
      profile: {
        connectOrCreate: {
          where: { id: 40 },
          create: { id: 997, bio: "should not be created", userId: 995 },
        },
      },
    },
  });

  const foundSnapshot = getSheetSnapshot("Profile");
  foundSnapshot.assertRowEquals({ id: 40 }, { userId: 995 });
  foundSnapshot.assertRowEquals({ id: 995 }, { userId: "" });
  foundSnapshot.assertRowNotExists({ id: 997 });
  foundSnapshot.assertCount(51);

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowEquals({ id: 995 }, { email: "o2o995@test.com" });

  resetSheet("Profile", profileData);

  client.User.update({
    where: { id: 995 },
    data: {
      profile: {
        connectOrCreate: {
          where: { id: 99997 },
          create: { id: 996, bio: "coc created", userId: 995 },
        },
      },
    },
  });

  const createdSnapshot = getSheetSnapshot("Profile");
  createdSnapshot.assertRowEquals({ id: 996 }, { userId: 995, bio: "coc created" });
  createdSnapshot.assertCount(51);

  const userSnapshot2 = getSheetSnapshot("User");
  userSnapshot2.assertRowEquals({ id: 995 }, { email: "o2o995@test.com" });
  userSnapshot2.assertCount(51);

  resetSheet("User", userData);
  resetSheet("Profile", profileData);
}

// update（裸 data）: 相手 Profile のみ更新され、親 User 行は無変化
function testNonFkUpdateBareData(client: GassmaClient) {
  client.User.update({
    where: { id: 6 },
    data: { profile: { update: { bio: "o2o bare updated" } } },
  });

  const profileSnapshot = getSheetSnapshot("Profile");
  profileSnapshot.assertRowEquals({ id: 6 }, { bio: "o2o bare updated", userId: 6 });
  profileSnapshot.assertRowEquals({ id: 7 }, { bio: "UIデザイナー" });

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowEquals({ id: 6 }, { name: "中村 浩二", email: "user6@company.co.jp" });
  userSnapshot.assertCount(50);

  resetSheet("Profile", profileData);
  resetSheet("User", userData);
}

// update（裸 data）: 相手不在は P2025 相当のエラー（無言 no-op にしない）
function testNonFkUpdateNotFound(client: GassmaClient) {
  createFixtureUser(client, 995);

  assertThrows(
    () => {
      client.User.update({
        where: { id: 995 },
        data: { profile: { update: { bio: "no target" } } },
      });
    },
    'Nested write update failed: no record found in "Profile"',
    "o2o update not found",
  );

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowEquals({ id: 995 }, { email: "o2o995@test.com" });

  const profileSnapshot = getSheetSnapshot("Profile");
  profileSnapshot.assertCount(50);

  resetSheet("User", userData);
}

// disconnect: true → 子 Profile の userId のみ null 化（親の id は無傷）。不在時は no-op
function testNonFkDisconnect(client: GassmaClient) {
  createFixtureUser(client, 995);
  client.Profile.create({ data: { id: 995, bio: "to detach", userId: 995 } });

  client.User.update({
    where: { id: 995 },
    data: { profile: { disconnect: true } },
  });

  const profileSnapshot = getSheetSnapshot("Profile");
  profileSnapshot.assertRowEquals({ id: 995 }, { userId: "", bio: "to detach" });
  profileSnapshot.assertRowEquals({ id: 10 }, { userId: 10 });
  profileSnapshot.assertCount(51);

  assertProfileUserIdIsNull(client, 995, "o2o disconnect");

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowEquals({ id: 995 }, { email: "o2o995@test.com" });
  userSnapshot.assertCount(51);

  resetSheet("Profile", profileData);

  client.User.update({
    where: { id: 995 },
    data: { profile: { disconnect: true } },
  });

  const noopSnapshot = getSheetSnapshot("Profile");
  noopSnapshot.assertCount(50);

  const userSnapshot2 = getSheetSnapshot("User");
  userSnapshot2.assertRowEquals({ id: 995 }, { email: "o2o995@test.com" });

  resetSheet("User", userData);
  resetSheet("Profile", profileData);
}

// delete: true → 子 Profile 行を削除（親の id は無傷）。不在時はエラー
function testNonFkDelete(client: GassmaClient) {
  createFixtureUser(client, 995);
  client.Profile.create({ data: { id: 995, bio: "to delete", userId: 995 } });

  client.User.update({
    where: { id: 995 },
    data: { profile: { delete: true } },
  });

  const profileSnapshot = getSheetSnapshot("Profile");
  profileSnapshot.assertRowNotExists({ id: 995 });
  profileSnapshot.assertRowEquals({ id: 10 }, { userId: 10 });
  profileSnapshot.assertCount(50);

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowEquals({ id: 995 }, { email: "o2o995@test.com" });
  userSnapshot.assertCount(51);

  assertThrows(
    () => {
      client.User.update({
        where: { id: 995 },
        data: { profile: { delete: true } },
      });
    },
    'Nested write delete failed: no record found in "Profile"',
    "o2o delete absent",
  );

  const userSnapshot2 = getSheetSnapshot("User");
  userSnapshot2.assertRowEquals({ id: 995 }, { email: "o2o995@test.com" });

  resetSheet("User", userData);
  resetSheet("Profile", profileData);
}

function testNonFkInvalidOperations(client: GassmaClient) {
  assertThrows(
    () => {
      client.User.update({
        where: { id: 1 },
        // @ts-expect-error oneToOne 非FK側への set は型レベルで禁止
        data: { profile: { set: { id: 2 } } },
      });
    },
    'Nested write: operation "set" is not valid for relation "profile" of type "oneToOne"',
    "o2o invalid set",
  );

  assertThrows(
    () => {
      client.User.update({
        where: { id: 1 },
        // @ts-expect-error disconnect: false は型レベルで禁止
        data: { profile: { disconnect: false } },
      });
    },
    'Nested write: operation "disconnect" is not valid for relation "profile" of type "oneToOne"',
    "o2o invalid disconnect false",
  );

  assertThrows(
    () => {
      client.User.update({
        where: { id: 1 },
        // @ts-expect-error oneToOne 非FK側への deleteMany は型レベルで禁止
        data: { profile: { deleteMany: {} } },
      });
    },
    'Nested write: operation "deleteMany" is not valid for relation "profile" of type "oneToOne"',
    "o2o invalid deleteMany",
  );

  assertThrows(
    () => {
      client.User.update({
        where: { id: 1 },
        // @ts-expect-error oneToOne 非FK側への配列 connect は型レベルで禁止
        data: { profile: { connect: [{ id: 40 }] } },
      });
    },
    'Nested write: operation "connect" is not valid for relation "profile" of type "oneToOne"',
    "o2o invalid connect array",
  );

  assertThrows(
    () => {
      client.User.create({
        data: {
          id: 997,
          email: "o2o997@test.com",
          name: "O2OUser997",
          role: "USER",
          createdAt: new Date("2025-01-01T00:00:00"),
          // @ts-expect-error oneToOne 非FK側への createMany は型レベルで禁止
          profile: { createMany: { data: [{ id: 997, bio: "x", userId: 997 }] } },
        },
      });
    },
    'Nested write: operation "createMany" is not valid for relation "profile" of type "oneToOne"',
    "o2o invalid createMany",
  );
  // create 文脈はトランザクションがなく親行が残るため戻す
  resetSheet("User", userData);

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowEquals({ id: 1 }, { name: "Chris Jackson" });

  const profileSnapshot = getSheetSnapshot("Profile");
  profileSnapshot.assertRowEquals({ id: 1 }, { userId: 1 });
  profileSnapshot.assertCount(50);
}

// 非回帰: FK 保有側 (Profile.user, ownsFk: true) の従来挙動は変わらない
function testFkOwningSideBareUpdate(client: GassmaClient) {
  client.Profile.update({
    where: { id: 3 },
    data: { user: { update: { name: "FkSideUpdatedName" } } },
  });

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowEquals({ id: 3 }, { name: "FkSideUpdatedName" });
  userSnapshot.assertRowEquals({ id: 2 }, { name: "佐藤 浩二" });

  const profileSnapshot = getSheetSnapshot("Profile");
  profileSnapshot.assertRowEquals({ id: 3 }, { userId: 3, bio: "セキュリティエンジニア" });
  profileSnapshot.assertCount(50);

  resetSheet("User", userData);
}

export { testNestedOneToOneNonFk };
