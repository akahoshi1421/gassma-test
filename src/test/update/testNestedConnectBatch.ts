import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { assertThrows } from "../../assert/assertThrows";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { postData } from "../../consts/postData";
import { tagData } from "../../consts/tagData";
import { postToTagData } from "../../consts/postToTagData";

function testNestedConnectBatch() {
  const client = new GassmaClient();

  testConnectBatchOneToMany(client);
  testConnectBatchManyToMany(client);
  testConnectBatchOneToManyNotFound(client);
  testConnectBatchManyToManyNotFound(client);
  testConnectOrCreateBatchOneToMany(client);
  testConnectOrCreateBatchManyToMany(client);

  Logger.log("✅ testNestedConnectBatch: all passed");
}

function testConnectBatchOneToMany(client: GassmaClient) {
  // categoryId が null の Post 3件を Category id=2 に一括 connect
  client.Category.update({
    where: { id: 2 },
    data: {
      posts: {
        connect: [{ id: 9 }, { id: 18 }, { id: 27 }],
      },
    },
  });

  const postSnapshot = getSheetSnapshot("Post");
  postSnapshot.assertRowEquals({ id: 9 }, { categoryId: 2 });
  postSnapshot.assertRowEquals({ id: 18 }, { categoryId: 2 });
  postSnapshot.assertRowEquals({ id: 27 }, { categoryId: 2 });

  // connect に渡していない Post は変化しない
  postSnapshot.assertRowEquals({ id: 1 }, { categoryId: 14 });
  const untouched = client.Post.findFirst({ where: { id: 36 } });
  if (!untouched) throw new Error("connect batch 1:M: post 36 not found");
  assertEquals(untouched.categoryId, null, "connect batch 1:M: post 36 untouched");

  resetSheet("Post", postData);
}

function testConnectBatchManyToMany(client: GassmaClient) {
  // Post id=2 (シードの紐付けは tagId=1 のみ) に Tag 3件を一括 connect
  client.Post.update({
    where: { id: 2 },
    data: {
      tags: {
        connect: [{ id: 2 }, { id: 3 }, { id: 4 }],
      },
    },
  });

  const pivotSnapshot = getSheetSnapshot("_PostToTag");
  pivotSnapshot.assertRowExists({ postId: 2, tagId: 2 });
  pivotSnapshot.assertRowExists({ postId: 2, tagId: 3 });
  pivotSnapshot.assertRowExists({ postId: 2, tagId: 4 });
  pivotSnapshot.assertRowExists({ postId: 2, tagId: 1 });

  const post = client.Post.findFirst({
    where: { id: 2 },
    include: { tags: true },
  });
  if (post === null) throw new Error("connect batch M:M: post 2 not found");
  if (!Array.isArray(post.tags)) throw new Error("connect batch M:M: tags not array");
  assertEquals(post.tags.length, 4, "connect batch M:M: tags count");
  const tagIds = post.tags.map((tag) => tag.id);
  [1, 2, 3, 4].forEach((id) => {
    if (tagIds.indexOf(id) === -1) {
      throw new Error(`connect batch M:M: expected tag ${id} in ${JSON.stringify(tagIds)}`);
    }
  });

  resetSheet("Post", postData);
  resetSheet("_PostToTag", postToTagData);
}

function testConnectBatchOneToManyNotFound(client: GassmaClient) {
  // connect 先が1件でも存在しなければ throw し、存在する対象にも FK を書かない
  assertThrows(
    () => {
      client.Category.update({
        where: { id: 3 },
        data: {
          posts: {
            connect: [{ id: 36 }, { id: 45 }, { id: 9999 }],
          },
        },
      });
    },
    'Nested write connect failed: no record found in "Post"',
    "connect batch 1:M not found",
  );

  const post36 = client.Post.findFirst({ where: { id: 36 } });
  const post45 = client.Post.findFirst({ where: { id: 45 } });
  if (!post36 || !post45) throw new Error("connect batch 1:M not found: posts missing");
  assertEquals(post36.categoryId, null, "connect batch 1:M not found: post 36 not connected");
  assertEquals(post45.categoryId, null, "connect batch 1:M not found: post 45 not connected");
}

function testConnectBatchManyToManyNotFound(client: GassmaClient) {
  // 存在しない Tag が混ざると throw し、junction 行を1件も作らない
  assertThrows(
    () => {
      client.Post.update({
        where: { id: 3 },
        data: {
          tags: {
            connect: [{ id: 5 }, { id: 6 }, { id: 999 }],
          },
        },
      });
    },
    'Nested write connect failed: no record found in "Tag"',
    "connect batch M:M not found",
  );

  const pivotSnapshot = getSheetSnapshot("_PostToTag");
  pivotSnapshot.assertRowNotExists({ postId: 3, tagId: 5 });
  pivotSnapshot.assertRowNotExists({ postId: 3, tagId: 6 });
  pivotSnapshot.assertRowExists({ postId: 3, tagId: 9 });

  // 親 Post 行の updatedAt はネスト処理より先に書かれるため戻す
  resetSheet("Post", postData);
}

function testConnectOrCreateBatchOneToMany(client: GassmaClient) {
  // 既存 Post は接続・存在しない Post は categoryId 付きで新規作成
  client.Category.update({
    where: { id: 5 },
    data: {
      posts: {
        connectOrCreate: [
          {
            where: { id: 45 },
            create: { id: 969, title: "should not be created", authorId: 1 },
          },
          {
            where: { id: 961 },
            create: { id: 961, title: "connectOrCreate batch new post", authorId: 1 },
          },
        ],
      },
    },
  });

  const postSnapshot = getSheetSnapshot("Post");
  postSnapshot.assertRowEquals({ id: 45 }, { categoryId: 5, title: "Swift UI Tutorial #45" });
  postSnapshot.assertRowNotExists({ id: 969 });
  postSnapshot.assertRowEquals(
    { id: 961 },
    { categoryId: 5, title: "connectOrCreate batch new post", authorId: 1 },
  );

  resetSheet("Post", postData);
}

function testConnectOrCreateBatchManyToMany(client: GassmaClient) {
  // 既存 Tag は junction 追加のみ・存在しない Tag は作成して junction 追加
  client.Post.update({
    where: { id: 4 },
    data: {
      tags: {
        connectOrCreate: [
          { where: { id: 2 }, create: { id: 969, name: "should not be created" } },
          { where: { id: 962 }, create: { id: 962, name: "connectOrCreate batch new tag" } },
        ],
      },
    },
  });

  const tagSnapshot = getSheetSnapshot("Tag");
  tagSnapshot.assertRowEquals({ id: 962 }, { name: "connectOrCreate batch new tag" });
  tagSnapshot.assertRowNotExists({ id: 969 });

  const pivotSnapshot = getSheetSnapshot("_PostToTag");
  pivotSnapshot.assertRowExists({ postId: 4, tagId: 2 });
  pivotSnapshot.assertRowExists({ postId: 4, tagId: 962 });
  pivotSnapshot.assertRowExists({ postId: 4, tagId: 1 });

  resetSheet("Post", postData);
  resetSheet("Tag", tagData);
  resetSheet("_PostToTag", postToTagData);
}

export { testNestedConnectBatch };
