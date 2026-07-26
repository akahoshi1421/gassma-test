import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { postData } from "../../consts/postData";

function testTransactionClientOptions() {
  testTransactionGlobalOmit();
  testTransactionDefaultsAndUpdatedAt();

  Logger.log("✅ testTransactionClientOptions: all passed");
}

function testTransactionGlobalOmit() {
  // 生成 client の omit オプション(globalOmit)が tx 内の読み取りにも効く
  const omitClient = new GassmaClient({ omit: { Post: { content: true } } });

  const keys = omitClient.$transaction((tx) => {
    const post = tx.Post.findFirstOrThrow({ where: { id: 1 } });
    return Object.keys(post);
  });

  if (keys.indexOf("content") !== -1) {
    throw new Error("tx globalOmit: content should be omitted");
  }
  if (keys.indexOf("title") === -1) {
    throw new Error("tx globalOmit: title should remain");
  }
}

function testTransactionDefaultsAndUpdatedAt() {
  const client = new GassmaClient();

  const created = client.$transaction((tx) =>
    tx.Post.create({
      data: { title: "TxDefaultsPost", authorId: 1, categoryId: 1 },
    }),
  );

  // defaults(published/viewCount/createdAt)と updatedAt が tx 内 create でも効く
  assertEquals(created.published, false, "tx defaults: published");
  assertEquals(created.viewCount, 0, "tx defaults: viewCount");
  if (!created.createdAt || typeof created.createdAt.getTime !== "function") {
    throw new Error("tx defaults: createdAt should be a Date");
  }
  if (!created.updatedAt || typeof created.updatedAt.getTime !== "function") {
    throw new Error("tx updatedAt: updatedAt should be a Date");
  }

  const snapshot = getSheetSnapshot("Post");
  snapshot.assertCount(201);
  snapshot.assertRowEquals(
    { title: "TxDefaultsPost" },
    { published: false, viewCount: 0 },
  );

  resetSheet("Post", postData);
}

export { testTransactionClientOptions };
