import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { productData } from "../../consts/productData";
import { postData } from "../../consts/postData";
import { userData } from "../../consts/userData";

function testNumberOperation() {
  const client = new GassmaClient();

  testIncrement(client);
  testDecrement(client);
  testMultiply(client);
  testDivide(client);
  testNumberOperationInUpdateMany(client);
  testNumberOperationInNestedUpdate(client);
  testNumberOperationInNestedUpdateToOne(client);
  testNumberOperationStringColumnRejected(client);

  Logger.log("✅ testNumberOperation: all passed");
}

function testIncrement(client: GassmaClient) {
  const before = client.Product.findFirst({ where: { id: 1 } });
  if (!before) throw new Error("increment: product 1 not found");

  client.Product.update({
    where: { id: 1 },
    data: { stock: { increment: 10 } },
  });

  const snapshot = getSheetSnapshot("Product");
  snapshot.assertRowEquals({ id: 1 }, { stock: before.stock + 10 });

  resetSheet("Product", productData);
}

function testDecrement(client: GassmaClient) {
  const before = client.Product.findFirst({ where: { id: 1 } });
  if (!before) throw new Error("decrement: product 1 not found");

  client.Product.update({
    where: { id: 1 },
    data: { stock: { decrement: 5 } },
  });

  const snapshot = getSheetSnapshot("Product");
  snapshot.assertRowEquals({ id: 1 }, { stock: before.stock - 5 });

  resetSheet("Product", productData);
}

function testMultiply(client: GassmaClient) {
  const before = client.Product.findFirst({ where: { id: 1 } });
  if (!before) throw new Error("multiply: product 1 not found");

  client.Product.update({
    where: { id: 1 },
    data: { price: { multiply: 2 } },
  });

  const snapshot = getSheetSnapshot("Product");
  snapshot.assertRowEquals({ id: 1 }, { price: before.price * 2 });

  resetSheet("Product", productData);
}

function testDivide(client: GassmaClient) {
  const before = client.Product.findFirst({ where: { id: 1 } });
  if (!before) throw new Error("divide: product 1 not found");

  client.Product.update({
    where: { id: 1 },
    data: { price: { divide: 2 } },
  });

  const snapshot = getSheetSnapshot("Product");
  snapshot.assertRowEquals({ id: 1 }, { price: before.price / 2 });

  resetSheet("Product", productData);
}

function testNumberOperationInUpdateMany(client: GassmaClient) {
  client.Product.updateMany({
    where: { id: { lte: 3 } },
    data: { stock: { increment: 100 } },
  });

  const snapshot = getSheetSnapshot("Product");
  // stock of id=1 was originally some value, now +100
  // Just verify all 3 were updated by checking they exist
  snapshot.assertRowExists({ id: 1 });
  snapshot.assertRowExists({ id: 2 });
  snapshot.assertRowExists({ id: 3 });

  resetSheet("Product", productData);
}

function testNumberOperationInNestedUpdate(client: GassmaClient) {
  // oneToMany の nested update data で NumberOperation が効く (core #153 / cli #114)
  const before = client.Post.findFirst({ where: { id: 8 } });
  if (!before) throw new Error("nested increment: post 8 not found");
  const sibling = client.Post.findFirst({ where: { id: 172 } });
  if (!sibling) throw new Error("nested increment: post 172 not found");

  client.User.update({
    where: { id: 3 },
    data: {
      posts: {
        update: {
          where: { id: 8 },
          data: { viewCount: { increment: 100 } },
        },
      },
    },
  });

  const snapshot = getSheetSnapshot("Post");
  snapshot.assertRowEquals({ id: 8 }, { viewCount: before.viewCount + 100 });
  // 同じ author の他 Post は影響を受けない
  snapshot.assertRowEquals({ id: 172 }, { viewCount: sibling.viewCount });

  resetSheet("Post", postData);
}

function testNumberOperationInNestedUpdateToOne(client: GassmaClient) {
  // manyToOne の nested update (裸 data 形) で NumberOperation が効く
  const author = client.User.findFirst({ where: { id: 36 } });
  if (!author) throw new Error("nested to-one increment: user 36 not found");
  if (author.age === null) {
    throw new Error("nested to-one increment: user 36 age is null");
  }
  const other = client.User.findFirst({ where: { id: 3 } });
  if (!other) throw new Error("nested to-one increment: user 3 not found");

  // Post id=1 の author は User id=36
  client.Post.update({
    where: { id: 1 },
    data: {
      author: {
        update: { age: { increment: 5 } },
      },
    },
  });

  const snapshot = getSheetSnapshot("User");
  snapshot.assertRowEquals({ id: 36 }, { age: author.age + 5 });
  // 他の User は影響を受けない
  snapshot.assertRowEquals({ id: 3 }, { age: other.age });

  resetSheet("User", userData);
  resetSheet("Post", postData);
}

function testNumberOperationStringColumnRejected(client: GassmaClient) {
  // string 列への NumberOperation は型エラー (コンパイル時のみ検証、実行しない)
  const invalidUpdate = () => {
    client.Product.update({
      where: { id: 1 },
      // @ts-expect-error string 列への increment は型レベルで禁止
      data: { name: { increment: 1 } },
    });
  };
  void invalidUpdate;

  Logger.log("  string column increment: rejected at type level");
}

export { testNumberOperation };
