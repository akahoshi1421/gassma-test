import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { userData } from "../../consts/userData";
import { profileData } from "../../consts/profileData";
import { postData } from "../../consts/postData";
import { commentData } from "../../consts/commentData";
import { postToTagData } from "../../consts/postToTagData";
import { categoryData } from "../../consts/categoryData";

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
  testNestedUpdateToOneBareData(client);
  testNestedUpdateToOneDelete(client);
  testNestedUpdateToOneDisconnect(client);
  testNestedUpdateOneToManyDisconnect(client);

  Logger.log("✅ testNestedUpdate: all passed");
}

function testNestedCreate(client: GassmaClient) {
  // User update で新しい Post を nested create
  client.User.update({
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
  client.User.update({
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
  const posts = client.Post.findMany({
    where: { authorId: 3 },
    select: { id: true, title: true },
  });
  posts.forEach((post) => {
    postSnapshot.assertRowEquals({ id: post.id }, { title: "nested updated title" });
  });

  // authorId != 3 のPostが影響を受けていないことを確認
  const otherPost = client.Post.findFirst({
    where: { authorId: 1 },
    select: { id: true, title: true },
  });
  if (otherPost) {
    postSnapshot.assertRowEquals({ id: otherPost.id }, { title: otherPost.title });
  }

  Logger.log(`  Nested update: ${posts.length} posts updated`);

  resetSheet("Post", postData);
}

function testNestedDelete(client: GassmaClient) {
  // テスト用にコメントを作成
  client.Comment.create({
    data: {
      id: 951,
      text: "to be deleted",
      authorId: 3,
      postId: 1,
      createdAt: new Date("2025-01-01T00:00:00"),
    },
  });

  // Post update で Comment を nested delete
  client.Post.update({
    where: { id: 1 },
    data: {
      comments: {
        delete: { id: 951 },
      },
    },
  });

  const commentSnapshot = getSheetSnapshot("Comment");
  commentSnapshot.assertRowNotExists({ id: 951 });
  // 既存のコメントが影響を受けていないことを確認
  commentSnapshot.assertRowExists({ postId: 1 });

  resetSheet("Comment", commentData);
}

function testNestedDeleteMany(client: GassmaClient) {
  // テスト用にコメントを複数作成
  client.Comment.create({
    data: { id: 951, text: "bulk delete 1", authorId: 3, postId: 1, createdAt: new Date("2025-01-01T00:00:00") },
  });
  client.Comment.create({
    data: { id: 952, text: "bulk delete 2", authorId: 3, postId: 1, createdAt: new Date("2025-01-01T00:00:00") },
  });

  client.Post.update({
    where: { id: 1 },
    data: {
      comments: {
        deleteMany: { id: { in: [951, 952] } },
      },
    },
  });

  const commentSnapshot = getSheetSnapshot("Comment");
  commentSnapshot.assertRowNotExists({ id: 951 });
  commentSnapshot.assertRowNotExists({ id: 952 });
  // 既存のコメントが影響を受けていないことを確認
  commentSnapshot.assertRowExists({ postId: 1 });
  commentSnapshot.assertRowExists({ authorId: 1 });

  resetSheet("Comment", commentData);
}

function testNestedConnect(client: GassmaClient) {
  // Tag を Post に connect（manyToMany）
  // Post id=1 に Tag id=30 を connect
  client.Post.update({
    where: { id: 1 },
    data: {
      tags: {
        connect: { id: 30 },
      },
    },
  });

  const pivotSnapshot = getSheetSnapshot("_PostToTag");
  pivotSnapshot.assertRowExists({ postId: 1, tagId: 30 });
  // 既存の紐付けが影響を受けていないことを確認
  pivotSnapshot.assertRowExists({ postId: 2 });

  // 元に戻す: pivot テーブルから削除
  client.Post.update({
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
  client.Post.update({
    where: { id: 1 },
    data: {
      tags: {
        connect: { id: 29 },
      },
    },
  });

  const pivotBefore = getSheetSnapshot("_PostToTag");
  pivotBefore.assertRowExists({ postId: 1, tagId: 29 });

  client.Post.update({
    where: { id: 1 },
    data: {
      tags: {
        disconnect: { id: 29 },
      },
    },
  });

  const pivotAfter = getSheetSnapshot("_PostToTag");
  pivotAfter.assertRowNotExists({ postId: 1, tagId: 29 });
  // 他の紐付けが影響を受けていないことを確認
  pivotAfter.assertRowExists({ postId: 2 });
}

function testNestedConnectOrCreate(client: GassmaClient) {
  // Comment を connectOrCreate（存在しない → create）
  client.Post.update({
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
  const beforeComments = client.Comment.findMany({
    where: { authorId: 3 },
  });

  // Comment id=1,2 を User id=3 に set（既存を切り離して新しく紐付け）
  client.User.update({
    where: { id: 3 },
    data: {
      comments: {
        set: [{ id: 1 }, { id: 2 }],
      },
    },
  });

  // set したレコードが紐付いているか確認
  const afterComments = client.Comment.findMany({
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
      const updated = client.Comment.findFirst({ where: { id: c.id } });
      if (updated && updated.authorId === 3) {
        throw new Error(`nested set oneToMany: comment ${c.id} should be disconnected`);
      }
    }
  });

  resetSheet("Comment", commentData);
}

function testNestedSetManyToMany(client: GassmaClient) {
  // Post id=1 の tags を set で入替え（Tag id=1, id=2 のみに）
  client.Post.update({
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
  // 他のPostの紐付けが影響を受けていないことを確認
  afterPivot.assertRowExists({ postId: 2 });

  // 元に戻す
  resetSheet("_PostToTag", postToTagData);
}

function testNestedUpdateToOneBareData(client: GassmaClient) {
  // manyToOne: Post id=1 (authorId=36) の author を裸 data 形で update
  client.Post.update({
    where: { id: 1 },
    data: {
      author: {
        update: { name: "NestedAuthorUpdated" },
      },
    },
  });

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowEquals({ id: 36 }, { name: "NestedAuthorUpdated" });
  // 他の User は影響を受けない
  userSnapshot.assertRowEquals({ id: 2 }, { name: "佐藤 浩二" });

  resetSheet("User", userData);
  resetSheet("Post", postData);

  // oneToOne: User id=5 の profile (Profile id=5) を裸 data 形で update
  client.User.update({
    where: { id: 5 },
    data: {
      profile: {
        update: { bio: "NestedBioUpdated" },
      },
    },
  });

  const profileSnapshot = getSheetSnapshot("Profile");
  profileSnapshot.assertRowEquals({ id: 5 }, { bio: "NestedBioUpdated", userId: 5 });
  profileSnapshot.assertRowEquals({ id: 4 }, { bio: "Full-stack developer" });

  resetSheet("Profile", profileData);
  resetSheet("User", userData);
}

function testNestedUpdateToOneDelete(client: GassmaClient) {
  // FK 保有側 (Post.category) で delete: true → 相手行が削除され FK が null になる
  client.Category.create({ data: { id: 975, name: "NestedDeleteCat" } });
  client.Post.create({
    data: {
      id: 975,
      title: "NestedDeleteTarget",
      authorId: 1,
      categoryId: 975,
      createdAt: new Date("2025-01-01T00:00:00"),
      updatedAt: new Date("2025-01-01T00:00:00"),
    },
  });

  client.Post.update({
    where: { id: 975 },
    data: {
      category: { delete: true },
    },
  });

  const categorySnapshot = getSheetSnapshot("Category");
  categorySnapshot.assertRowNotExists({ id: 975 });
  categorySnapshot.assertRowEquals({ id: 1 }, { name: "テクノロジー" });

  const post = client.Post.findFirst({ where: { id: 975 } });
  if (!post) throw new Error("nested to-one delete: post 975 not found");
  assertEquals(post.categoryId, null, "nested to-one delete: categoryId should be null");

  resetSheet("Post", postData);
  resetSheet("Category", categoryData);
}

function testNestedUpdateToOneDisconnect(client: GassmaClient) {
  // FK 保有側 (Post.category) で disconnect: true → FK のみ null、相手行は残る
  client.Post.update({
    where: { id: 1 },
    data: {
      category: { disconnect: true },
    },
  });

  const post = client.Post.findFirst({ where: { id: 1 } });
  if (!post) throw new Error("nested to-one disconnect: post 1 not found");
  assertEquals(post.categoryId, null, "nested to-one disconnect: categoryId should be null");

  // 相手行 (Category id=14) は削除されない
  const categorySnapshot = getSheetSnapshot("Category");
  categorySnapshot.assertRowEquals({ id: 14 }, { name: "映画" });

  resetSheet("Post", postData);
}

function testNestedUpdateOneToManyDisconnect(client: GassmaClient) {
  // oneToMany の disconnect (where 形): Post id=8 (authorId=3) の FK が null になる
  client.User.update({
    where: { id: 3 },
    data: {
      posts: {
        disconnect: { id: 8 },
      },
    },
  });

  const disconnected = client.Post.findFirst({ where: { id: 8 } });
  if (!disconnected) throw new Error("nested oneToMany disconnect: post 8 not found");
  const disconnectedAuthorId: unknown = disconnected.authorId;
  if (disconnectedAuthorId !== null) {
    throw new Error(
      `nested oneToMany disconnect: authorId should be null but got ${JSON.stringify(disconnectedAuthorId)}`,
    );
  }

  // 同じ author の他 Post (id=172) は影響を受けない
  const other = client.Post.findFirst({ where: { id: 172 } });
  if (!other) throw new Error("nested oneToMany disconnect: post 172 not found");
  assertEquals(other.authorId, 3, "nested oneToMany disconnect: other post untouched");

  resetSheet("Post", postData);
}

export { testNestedUpdate };
