import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";

function testZeroMatch() {
  const client = new GassmaClient();

  testUpdateManyZero(client);
  testDeleteManyZero(client);
  testFindManyZero(client);
  testAggregateZero(client);

  Logger.log("✅ testZeroMatch: all passed");
}

function testUpdateManyZero(client: GassmaClient) {
  const result = client.Tag.updateMany({
    where: { id: 9999 },
    data: { name: "Ghost" },
  });
  assertEquals(result.count, 0, "zero updateMany: count");

  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertCount(30);
  snapshot.assertRowNotExists({ name: "Ghost" });
}

function testDeleteManyZero(client: GassmaClient) {
  const result = client.Tag.deleteMany({ where: { id: 9999 } });
  assertEquals(result.count, 0, "zero deleteMany: count");

  getSheetSnapshot("Tag").assertCount(30);
}

function testFindManyZero(client: GassmaClient) {
  assertEquals(client.User.findMany({ where: { id: 9999 } }).length, 0, "zero findMany: length");
  assertEquals(
    client.User.findMany({ cursor: { id: 9999 }, orderBy: { id: "asc" } }).length,
    0,
    "zero cursor: length",
  );
  assertEquals(client.User.findMany({ take: 0 }).length, 0, "zero take: length");
}

function testAggregateZero(client: GassmaClient) {
  // 0 件ヒット時は _count が 0、_avg/_sum/_min/_max が null
  const result = client.User.aggregate({
    where: { id: 9999 },
    _count: { id: true },
    _avg: { age: true },
    _sum: { age: true },
    _min: { age: true },
    _max: { age: true },
  });
  assertEquals(result._count.id, 0, "zero aggregate: _count");
  assertEquals(result._avg.age, null, "zero aggregate: _avg");
  assertEquals(result._sum.age, null, "zero aggregate: _sum");
  assertEquals(result._min.age, null, "zero aggregate: _min");
  assertEquals(result._max.age, null, "zero aggregate: _max");
}

export { testZeroMatch };
