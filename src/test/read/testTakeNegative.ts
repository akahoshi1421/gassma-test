import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testTakeNegative() {
  const client = new GassmaClient();

  testTakeNegativeBasic(client);
  testTakeNegativeWithSkip(client);
  testTakeNegativeWithCursor(client);

  Logger.log("✅ testTakeNegative: all passed");
}

function testTakeNegativeBasic(client: GassmaClient) {
  // take: -5 → 末尾から5件取得
  const result = client.User.findMany({
    take: -5,
    orderBy: { id: "asc" },
  });
  assertEquals(result.length, 5, "take negative count");
  assertEquals(result[0].id, 46, "take negative first id");
  assertEquals(result[4].id, 50, "take negative last id");
}

function testTakeNegativeWithSkip(client: GassmaClient) {
  // take: -5, skip: 5 → 末尾から5件スキップして、そこから5件
  const result = client.User.findMany({
    take: -5,
    skip: 5,
    orderBy: { id: "asc" },
  });
  assertEquals(result.length, 5, "take negative skip count");
  assertEquals(result[0].id, 41, "take negative skip first id");
  assertEquals(result[4].id, 45, "take negative skip last id");
}

function testTakeNegativeWithCursor(client: GassmaClient) {
  // cursor + take 負数 → cursor から逆方向に取得
  const result = client.User.findMany({
    cursor: { id: 10 },
    take: -3,
    orderBy: { id: "asc" },
  });
  assertEquals(result.length, 3, "take negative cursor count");
  // id=10 から逆方向 → id=8, 9, 10
  assertEquals(result[0].id, 8, "take negative cursor first id");
  assertEquals(result[2].id, 10, "take negative cursor last id");
}

export { testTakeNegative };
