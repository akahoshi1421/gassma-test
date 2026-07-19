import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { SPREADSHEET_ID_DB1 } from "../../consts/spreadsheetIds";
import { tagData } from "../../consts/tagData";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";

function testUpdateWhereMissing() {
  testUpdateWithoutWhereThrows();
  testUpdateEmptyWhereUpdatesFirstRow();

  Logger.log("✅ testUpdateWhereMissing: all passed");
}

function captureError(fn: () => void, label: string): unknown {
  try {
    fn();
  } catch (e) {
    return e;
  }
  throw new Error(`${label}: expected to throw but did not`);
}

// where 省略は GassmaUpdateWhereMissingError(where: {} とは区別される)
function testUpdateWithoutWhereThrows() {
  const rawClient = new Gassma.GassmaClient({ id: SPREADSHEET_ID_DB1 });
  const error = captureError(() => {
    // @ts-expect-error where 省略は型レベルで禁止
    rawClient.Tag.update({ data: { name: "NoWhereTag" } });
  }, "update without where");

  assertEquals(
    error instanceof Gassma.GassmaUpdateWhereMissingError,
    true,
    "update without where instanceof Gassma.GassmaUpdateWhereMissingError",
  );
  const message = error instanceof Error ? error.message : String(error);
  assertEquals(
    message.indexOf("Argument `where` is missing") !== -1,
    true,
    `update without where message: "${message}"`,
  );

  // throw 時にシートが変更されていないこと
  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertCount(30);
  snapshot.assertRowEquals({ id: 1 }, { name: "JavaScript" });
  snapshot.assertRowNotExists({ name: "NoWhereTag" });
}

// where: {} は従来どおり先頭行更新
function testUpdateEmptyWhereUpdatesFirstRow() {
  const client = new GassmaClient();
  const updated = client.Tag.update({
    where: {},
    data: { name: "EmptyWhereFirstRow" },
  });

  assertEquals(updated !== null, true, "update empty where returns record");
  if (updated) {
    assertEquals(updated.id, 1, "update empty where updates first row id");
    assertEquals(
      updated.name,
      "EmptyWhereFirstRow",
      "update empty where returned name",
    );
  }

  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertCount(30);
  snapshot.assertRowEquals({ id: 1 }, { name: "EmptyWhereFirstRow" });
  snapshot.assertRowEquals({ id: 2 }, { name: "TypeScript" });

  resetSheet("Tag", tagData);
}

export { testUpdateWhereMissing };
