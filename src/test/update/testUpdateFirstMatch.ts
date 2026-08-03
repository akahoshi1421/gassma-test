import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { assertThrows } from "../../assert/assertThrows";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { tagData } from "../../consts/tagData";
import { SPREADSHEET_ID_DB1 } from "../../consts/spreadsheetIds";

function testUpdateFirstMatch() {
  const client = new GassmaClient();

  testUpdateEmptyWhereThrows(client);
  testUpdateWhereEmptiedBySkipThrows();
  testUpdateWhereEmptiedByUndefinedThrows(client);
  testUpdateMultipleMatch(client);

  Logger.log("✅ testUpdateFirstMatch: all passed");
}

// 空 where は単一行操作では条件ゼロとみなされエラー。シートは一切変更されない
function testUpdateEmptyWhereThrows(client: GassmaClient) {
  assertThrows(
    () => {
      client.Tag.update({
        where: {},
        data: { name: "FirstRowUpdated" },
      });
    },
    "Invalid value for argument `where`. Expected at least one condition.",
    "update empty where",
  );

  assertSheetUntouched("update empty where");
}

// Gassma.skip だけで where が空になった場合も同じ。先頭行が書き換わらないこと。
// Gassma.skip は生成型の scalar where には現れないため、疎な型のライブラリ製クライアントを使う
function testUpdateWhereEmptiedBySkipThrows() {
  const rawClient = new Gassma.GassmaClient({ id: SPREADSHEET_ID_DB1 });
  assertThrows(
    () => {
      rawClient.Tag.update({
        where: { name: Gassma.skip },
        data: { name: "SkipEmptiedWhere" },
      });
    },
    "Invalid value for argument `where`. Expected at least one condition.",
    "update where emptied by Gassma.skip",
  );

  assertSheetUntouched("update where emptied by Gassma.skip");
}

// undefined だけで where が空になった場合も同じ
function testUpdateWhereEmptiedByUndefinedThrows(client: GassmaClient) {
  assertThrows(
    () => {
      client.Tag.update({
        where: { name: undefined },
        data: { name: "UndefinedEmptiedWhere" },
      });
    },
    "Invalid value for argument `where`. Expected at least one condition.",
    "update where emptied by undefined",
  );

  assertSheetUntouched("update where emptied by undefined");
}

function assertSheetUntouched(label: string) {
  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertCount(30);
  snapshot.assertRowEquals({ id: 1 }, { name: "JavaScript" });
  snapshot.assertRowEquals({ id: 2 }, { name: "TypeScript" });
  snapshot.assertRowEquals({ id: 30 }, { name: "クラウド" });
  snapshot.assertRowNotExists({ name: "FirstRowUpdated" });
  snapshot.assertRowNotExists({ name: "SkipEmptiedWhere" });
  snapshot.assertRowNotExists({ name: "UndefinedEmptiedWhere" });
  assertEquals(true, true, `${label}: sheet untouched`);
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
