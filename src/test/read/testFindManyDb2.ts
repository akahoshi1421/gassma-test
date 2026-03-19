import { GassmaClient } from "../../generated/gassma2/schemaClient";
import { assertEquals } from "../../assert/assertEquals";

function testFindManyDb2() {
  const client = new GassmaClient();

  testFindManyDb2Basic(client);
  testFindManyDb2Where(client);
  testFindManyDb2Select(client);

  Logger.log("✅ testFindManyDb2: all passed");
}

function testFindManyDb2Basic(client: GassmaClient) {
  const items = client.sheets.Item.findMany({});
  assertEquals(items.length, 3, "db2 findMany basic count");
}

function testFindManyDb2Where(client: GassmaClient) {
  const expensive = client.sheets.Item.findMany({
    where: { price: { gte: 100 } },
  });
  assertEquals(expensive.length, 2, "db2 findMany where gte count");
  expensive.forEach((item) => {
    if (typeof item.price !== "number" || item.price < 100) {
      throw new Error(`db2 findMany where: unexpected price ${item.price}`);
    }
  });
}

function testFindManyDb2Select(client: GassmaClient) {
  const items = client.sheets.Item.findMany({
    where: { id: 1 },
    select: { name: true },
  });
  assertEquals(items.length, 1, "db2 findMany select count");
  assertEquals(items[0].name, "Apple", "db2 findMany select name");
}

export { testFindManyDb2 };
