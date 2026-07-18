import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { tagData } from "../../consts/tagData";

function testUpdateFirstMatch() {
  const client = new GassmaClient();

  testUpdateEmptyWhere(client);
  testUpdateMultipleMatch(client);

  Logger.log("✅ testUpdateFirstMatch: all passed");
}

function testUpdateEmptyWhere(client: GassmaClient) {
  // 空 where は全行にマッチし、最初の行のみ更新される
  const result = client.Tag.update({
    where: {},
    data: { name: "FirstRowUpdated" },
  });
  if (!result) throw new Error("update empty where: expected result");
  assertEquals(result.id, 1, "update empty where: id");
  assertEquals(result.name, "FirstRowUpdated", "update empty where: name");

  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertRowEquals({ id: 1 }, { name: "FirstRowUpdated" });
  snapshot.assertRowEquals({ id: 2 }, { name: "TypeScript" });
  snapshot.assertRowEquals({ id: 30 }, { name: "クラウド" });
  snapshot.assertCount(30);

  resetSheet("Tag", tagData);
}

function testUpdateMultipleMatch(client: GassmaClient) {
  // "JavaScript" と "TypeScript" の 2 件にマッチ → 最初の 1 行 (id 1) のみ更新
  const result = client.Tag.update({
    where: { name: { endsWith: "Script" } },
    data: { name: "ScriptUpdated" },
  });
  if (!result) throw new Error("update multiple match: expected result");
  assertEquals(result.id, 1, "update multiple match: id");

  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertRowEquals({ id: 1 }, { name: "ScriptUpdated" });
  snapshot.assertRowEquals({ id: 2 }, { name: "TypeScript" });
  snapshot.assertCount(30);

  resetSheet("Tag", tagData);
}

export { testUpdateFirstMatch };
