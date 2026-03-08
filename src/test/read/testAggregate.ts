import { GassmaClient } from "../../generated/gassma/testClient";

function testAggregate() {
  const client = new GassmaClient();

  testAggregateCount(client);
  testAggregateAvg(client);
  testAggregateSum(client);
  testAggregateMinMax(client);
  testAggregateWithWhere(client);

  Logger.log("✅ testAggregate: all passed");
}

function testAggregateCount(client: GassmaClient) {
  const result = client.sheets.Product.aggregate({
    _count: { id: true },
  });
  if (typeof result._count?.id !== "number" || result._count.id !== 100) {
    throw new Error(`aggregate _count: expected 100, got ${result._count?.id}`);
  }
}

function testAggregateAvg(client: GassmaClient) {
  const result = client.sheets.Product.aggregate({
    _avg: { price: true },
  });
  if (typeof result._avg?.price !== "number") {
    throw new Error("aggregate _avg: price not number");
  }
}

function testAggregateSum(client: GassmaClient) {
  const result = client.sheets.Product.aggregate({
    _sum: { stock: true },
  });
  if (typeof result._sum?.stock !== "number") {
    throw new Error("aggregate _sum: stock not number");
  }
}

function testAggregateMinMax(client: GassmaClient) {
  const result = client.sheets.Product.aggregate({
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
  const result = client.sheets.Product.aggregate({
    where: { status: "available" },
    _count: { id: true },
  });
  if (typeof result._count?.id !== "number" || result._count.id <= 0) {
    throw new Error("aggregate where: expected count > 0");
  }
}

export { testAggregate };
