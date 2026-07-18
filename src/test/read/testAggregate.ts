import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testAggregate() {
  const client = new GassmaClient();

  testAggregateCount(client);
  testAggregateAvg(client);
  testAggregateSum(client);
  testAggregateMinMax(client);
  testAggregateWithWhere(client);
  testAggregateOrderByTakeSkip(client);

  Logger.log("✅ testAggregate: all passed");
}

function testAggregateCount(client: GassmaClient) {
  const result = client.Product.aggregate({
    _count: { id: true },
  });
  if (typeof result._count?.id !== "number" || result._count.id !== 100) {
    throw new Error(`aggregate _count: expected 100, got ${result._count?.id}`);
  }
}

function testAggregateAvg(client: GassmaClient) {
  const result = client.Product.aggregate({
    _avg: { price: true },
  });
  if (typeof result._avg?.price !== "number") {
    throw new Error("aggregate _avg: price not number");
  }
}

function testAggregateSum(client: GassmaClient) {
  const result = client.Product.aggregate({
    _sum: { stock: true },
  });
  if (typeof result._sum?.stock !== "number") {
    throw new Error("aggregate _sum: stock not number");
  }
}

function testAggregateMinMax(client: GassmaClient) {
  const result = client.Product.aggregate({
    _min: { price: true },
    _max: { price: true },
  });
  if (typeof result._min?.price !== "number") {
    throw new Error("aggregate _min: price not number");
  }
  if (typeof result._max?.price !== "number") {
    throw new Error("aggregate _max: price not number");
  }
  if (result._min.price > result._max.price) {
    throw new Error("aggregate: min > max");
  }
}

function testAggregateWithWhere(client: GassmaClient) {
  const result = client.Product.aggregate({
    where: { status: "available" },
    _count: { id: true },
  });
  if (typeof result._count?.id !== "number" || result._count.id <= 0) {
    throw new Error("aggregate where: expected count > 0");
  }
}

function testAggregateOrderByTakeSkip(client: GassmaClient) {
  // GASsma 固有仕様: take/skip/orderBy は集計前の行絞り込みに適用される

  // id 昇順で先頭 10 行 (id 1〜10) が集計対象
  const takeResult = client.User.aggregate({
    orderBy: { id: "asc" },
    take: 10,
    _count: { id: true },
    _min: { id: true },
    _max: { id: true },
  });
  assertEquals(takeResult._count.id, 10, "aggregate take: count");
  assertEquals(takeResult._min.id, 1, "aggregate take: min");
  assertEquals(takeResult._max.id, 10, "aggregate take: max");

  // id 降順で先頭 3 行 (id 50,49,48) が集計対象
  const descResult = client.User.aggregate({
    orderBy: { id: "desc" },
    take: 3,
    _count: { id: true },
    _min: { id: true },
    _max: { id: true },
  });
  assertEquals(descResult._count.id, 3, "aggregate orderBy desc take: count");
  assertEquals(descResult._min.id, 48, "aggregate orderBy desc take: min");
  assertEquals(descResult._max.id, 50, "aggregate orderBy desc take: max");

  // id 昇順で 45 行スキップ → id 46〜50 が集計対象
  const skipResult = client.User.aggregate({
    orderBy: { id: "asc" },
    skip: 45,
    _count: { id: true },
    _min: { id: true },
    _max: { id: true },
  });
  assertEquals(skipResult._count.id, 5, "aggregate skip: count");
  assertEquals(skipResult._min.id, 46, "aggregate skip: min");
  assertEquals(skipResult._max.id, 50, "aggregate skip: max");
}

export { testAggregate };
