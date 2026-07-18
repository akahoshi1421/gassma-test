import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertThrows } from "../../assert/assertThrows";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";

function testErrorClasses() {
  const client = new GassmaClient();

  testTopLevelIncludeSelectConflict(client);
  testIncludeOptionConflicts(client);
  testRelationNotFound(client);
  testHavingOutsideBy(client);
  testWhereRelationInvalidFilter(client);
  testConnectNotFound(client);
  testInvalidNestedOperation(client);

  Logger.log("✅ testErrorClasses: all passed");
}

function testTopLevelIncludeSelectConflict(client: GassmaClient) {
  // トップレベルで include と select を同時指定するとエラー
  assertThrows(
    () => {
      client.User.findMany({
        select: { id: true },
        include: { posts: true },
      });
    },
    "Cannot use both include and select in the same query",
    "includeSelectConflict findMany",
  );

  assertThrows(
    () => {
      client.User.findFirst({
        select: { id: true },
        include: { posts: true },
      });
    },
    "Cannot use both include and select in the same query",
    "includeSelectConflict findFirst",
  );
}

function testIncludeOptionConflicts(client: GassmaClient) {
  // include 内の select と omit の同時指定はエラー
  assertThrows(
    () => {
      client.User.findFirst({
        where: { id: 1 },
        include: {
          posts: { select: { id: true }, omit: { title: true } },
        },
      });
    },
    'Include "posts": cannot use both select and omit at the same time',
    "includeOption selectOmit",
  );

  // include 内の select と include の同時指定はエラー
  assertThrows(
    () => {
      client.User.findFirst({
        where: { id: 1 },
        include: {
          posts: { select: { id: true }, include: { category: true } },
        },
      });
    },
    'Include "posts": cannot use both select and include at the same time',
    "includeOption selectInclude",
  );
}

function testRelationNotFound(client: GassmaClient) {
  // 存在しない relation キーを include するとエラー
  assertThrows(
    () => {
      client.User.findFirst({
        where: { id: 1 },
        // @ts-expect-error 存在しない relation キーは型レベルで禁止
        include: { nonexistent: true },
      });
    },
    'Relation "nonexistent" is not defined',
    "relationNotFound findFirst",
  );
}

function testHavingOutsideBy(client: GassmaClient) {
  // having に by 外のカラムの非集計条件を書くとエラー
  assertThrows(
    () => {
      client.User.groupBy({
        by: "role",
        _count: { id: true },
        having: { age: { gte: 30 } },
      });
    },
    'written in the "by" field',
    "having outside by",
  );
}

function testWhereRelationInvalidFilter(client: GassmaClient) {
  // oneToMany リレーションに is フィルタは使えない
  assertThrows(
    () => {
      client.User.count({
        // @ts-expect-error oneToMany への is は型レベルで禁止
        where: { posts: { is: { published: true } } },
      });
    },
    'Filter "is" cannot be used on relation "posts" of type "oneToMany"',
    "whereRelation is on oneToMany",
  );

  // manyToOne リレーションに every フィルタは使えない
  assertThrows(
    () => {
      client.Post.count({
        // @ts-expect-error manyToOne への every は型レベルで禁止
        where: { author: { every: { role: "ADMIN" } } },
      });
    },
    'Filter "every" cannot be used on relation "author" of type "manyToOne"',
    "whereRelation every on manyToOne",
  );
}

function testConnectNotFound(client: GassmaClient) {
  // connect 先のレコードが存在しないとエラー (親行の書き込み前に throw)
  assertThrows(
    () => {
      client.Post.create({
        data: {
          id: 984,
          title: "connect fail post",
          categoryId: 1,
          createdAt: new Date("2025-01-01T00:00:00"),
          author: { connect: { id: 99999 } },
        },
      });
    },
    'Nested write connect failed: no record found in "User"',
    "connect not found",
  );

  const snapshot = getSheetSnapshot("Post");
  snapshot.assertRowNotExists({ id: 984 });
  snapshot.assertCount(200);
}

function testInvalidNestedOperation(client: GassmaClient) {
  // oneToMany リレーションに disconnect: true は使えない (update 文脈)
  assertThrows(
    () => {
      client.User.update({
        where: { id: 1 },
        // @ts-expect-error oneToMany への disconnect: true は型レベルで禁止
        data: { posts: { disconnect: true } },
      });
    },
    'Nested write: operation "disconnect" is not valid for relation "posts" of type "oneToMany"',
    "disconnect true on oneToMany",
  );

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowEquals({ id: 1 }, { name: "Chris Jackson" });
  userSnapshot.assertCount(50);

  const postSnapshot = getSheetSnapshot("Post");
  postSnapshot.assertRowEquals({ id: 94 }, { authorId: 1 });
  postSnapshot.assertCount(200);
}

export { testErrorClasses };
