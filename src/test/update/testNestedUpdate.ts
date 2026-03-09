import { GassmaClient } from "../../generated/gassma/testClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { userData } from "../../consts/userData";
import { profileData } from "../../consts/profileData";
import { postData } from "../../consts/postData";
import { commentData } from "../../consts/commentData";
import { postToTagData } from "../../consts/postToTagData";

function testNestedUpdate() {
  const client = new GassmaClient();

  testNestedCreate(client);
  testNestedUpdate_(client);
  testNestedDelete(client);
  testNestedDeleteMany(client);
  testNestedConnect(client);
  testNestedDisconnect(client);
  testNestedConnectOrCreate(client);
  testNestedSetOneToMany(client);
  testNestedSetManyToMany(client);

  Logger.log("✅ testNestedUpdate: all passed");
}

function testNestedCreate(client: GassmaClient) {
  // User update で新しい Post を nested create
  client.sheets.User.update({
    where: { id: 3 },
    data: {
      name: "NestedCreateUser",
      posts: {
        create: {
          id: 951,
          title: "nested create post",
          published: true,
          viewCount: 0,
          authorId: 3,
          createdAt: new Date("2025-01-01T00:00:00"),
        },
      },
    },
  });

  const postSnapshot = getSheetSnapshot("Post");
  postSnapshot.assertRowExists({ id: 951 });
  postSnapshot.assertRowEquals({ id: 951 }, { authorId: 3 });

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowEquals({ id: 3 }, { name: "NestedCreateUser" });

  resetSheet("User", userData);
  resetSheet("Post", postData);
}

function testNestedUpdate_(client: GassmaClient) {
  // User update で Post を nested update
  client.sheets.User.update({
    where: { id: 3 },
    data: {
      posts: {
        update: {
          where: { authorId: 3 },
          data: { title: "nested updated title" },
        },
      },
    },
  });

  const postSnapshot = getSheetSnapshot("Post");
  const posts = client.sheets.Post.findMany({
    where: { authorId: 3 },
    select: { id: true, title: true },
  });
  posts.forEach((post) => {
    postSnapshot.assertRowEquals({ id: post.id }, { title: "nested updated title" });
  });

  Logger.log(`  Nested update: ${posts.length} posts updated`);

  resetSheet("Post", postData);
}

function testNestedDelete(client: GassmaClient) {
  // テスト用にコメントを作成
  client.sheets.Comment.create({
    data: {
      id: 951,
      text: "to be deleted",
      authorId: 3,
      postId: 1,
      createdAt: new Date("2025-01-01T00:00:00"),
    },
  });

  // Post update で Comment を nested delete
  client.sheets.Post.update({
    where: { id: 1 },
    data: {
      comments: {
        delete: { where: { id: 951 } },
      },
    },
  });

  const commentSnapshot = getSheetSnapshot("Comment");
  commentSnapshot.assertRowNotExists({ id: 951 });

  resetSheet("Comment", commentData);
}

function testNestedDeleteMany(client: GassmaClient) {
  // テスト用にコメントを複数作成
  client.sheets.Comment.create({
    data: { id: 951, text: "bulk delete 1", authorId: 3, postId: 1, createdAt: new Date("2025-01-01T00:00:00") },
  });
  client.sheets.Comment.create({
    data: { id: 952, text: "bulk delete 2", authorId: 3, postId: 1, createdAt: new Date("2025-01-01T00:00:00") },
  });

  client.sheets.Post.update({
    where: { id: 1 },
    data: {
      comments: {
        deleteMany: { where: { id: { in: [951, 952] } } },
      },
    },
  });

  const commentSnapshot = getSheetSnapshot("Comment");
  commentSnapshot.assertRowNotExists({ id: 951 });
  commentSnapshot.assertRowNotExists({ id: 952 });

  resetSheet("Comment", commentData);
}

function testNestedConnect(client: GassmaClient) {
  // Tag を Post に connect（manyToMany）
  // Post id=1 に Tag id=30 を connect
  client.sheets.Post.update({
    where: { id: 1 },
    data: {
      tags: {
        connect: { id: 30 },
      },
    },
  });

  const pivotSnapshot = getSheetSnapshot("_PostToTag");
  pivotSnapshot.assertRowExists({ postId: 1, tagId: 30 });

  // 元に戻す: pivot テーブルから削除
  client.sheets.Post.update({
    where: { id: 1 },
    data: {
      tags: {
        disconnect: { id: 30 },
      },
    },
  });
}

function testNestedDisconnect(client: GassmaClient) {
  // まず connect してから disconnect
  client.sheets.Post.update({
    where: { id: 1 },
    data: {
      tags: {
        connect: { id: 29 },
      },
    },
  });

  const pivotBefore = getSheetSnapshot("_PostToTag");
  pivotBefore.assertRowExists({ postId: 1, tagId: 29 });

  client.sheets.Post.update({
    where: { id: 1 },
    data: {
      tags: {
        disconnect: { id: 29 },
      },
    },
  });

  const pivotAfter = getSheetSnapshot("_PostToTag");
  pivotAfter.assertRowNotExists({ postId: 1, tagId: 29 });
}

function testNestedConnectOrCreate(client: GassmaClient) {
  // Comment を connectOrCreate（存在しない → create）
  client.sheets.Post.update({
    where: { id: 1 },
    data: {
      comments: {
        connectOrCreate: {
          where: { id: 951 },
          create: {
            id: 951,
            text: "connectOrCreate new",
            authorId: 3,
            postId: 1,
            createdAt: new Date("2025-01-01T00:00:00"),
          },
        },
      },
    },
  });

  const commentSnapshot = getSheetSnapshot("Comment");
  commentSnapshot.assertRowExists({ id: 951 });
  commentSnapshot.assertRowEquals({ id: 951 }, { text: "connectOrCreate new" });

  resetSheet("Comment", commentData);
}

function testNestedSetOneToMany(client: GassmaClient) {
  // User id=3 の comments を set で入替え
  // まず現在の comments を確認
  const beforeComments = client.sheets.Comment.findMany({
    where: { authorId: 3 },
  });

  // Comment id=1,2 を User id=3 に set（既存を切り離して新しく紐付け）
  client.sheets.User.update({
    where: { id: 3 },
    data: {
      comments: {
        set: [{ id: 1 }, { id: 2 }],
      },
    },
  });

  // set したレコードが紐付いているか確認
  const afterComments = client.sheets.Comment.findMany({
    where: { authorId: 3 },
  });
  assertEquals(afterComments.length, 2, "nested set oneToMany count");

  const afterIds = afterComments.map((c) => c.id);
  if (afterIds.indexOf(1) === -1 || afterIds.indexOf(2) === -1) {
    throw new Error(`nested set oneToMany: expected ids [1,2] but got ${JSON.stringify(afterIds)}`);
  }

  // 元の comments は authorId が null になっているはず
  beforeComments.forEach((c) => {
    if (c.id !== 1 && c.id !== 2) {
      const updated = client.sheets.Comment.findFirst({ where: { id: c.id } });
      if (updated && updated.authorId === 3) {
        throw new Error(`nested set oneToMany: comment ${c.id} should be disconnected`);
      }
    }
  });

  resetSheet("Comment", commentData);
}

function testNestedSetManyToMany(client: GassmaClient) {
  // Post id=1 の tags を set で入替え（Tag id=1, id=2 のみに）
  client.sheets.Post.update({
    where: { id: 1 },
    data: {
      tags: {
        set: [{ id: 1 }, { id: 2 }],
      },
    },
  });

  // pivot テーブルで確認
  const afterPivot = getSheetSnapshot("_PostToTag");
  afterPivot.assertRowExists({ postId: 1, tagId: 1 });
  afterPivot.assertRowExists({ postId: 1, tagId: 2 });
  // 他のtagは紐付かない
  afterPivot.assertRowNotExists({ postId: 1, tagId: 3 });

  // 元に戻す
  resetSheet("_PostToTag", postToTagData);
}

export { testNestedUpdate };
