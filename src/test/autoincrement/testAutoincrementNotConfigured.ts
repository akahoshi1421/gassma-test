import { SPREADSHEET_ID_DB1 } from "../../consts/spreadsheetIds";
import { assertEquals } from "../../assert/assertEquals";
import { captureError } from "./captureError";

// 生成クライアントの型は field を autoincrement 列だけに絞るため、
// 設定の無いフィールドを渡す経路はライブラリ直呼びでしか作れない。
function testAutoincrementNotConfigured() {
  const rawClient = new Gassma.GassmaClient({
    id: SPREADSHEET_ID_DB1,
    autoincrement: { notifications: "id" },
  });

  testFieldOutsideConfiguredFields(rawClient);
  testSheetWithoutAnyConfiguration(rawClient);

  Logger.log("✅ testAutoincrementNotConfigured: all passed");
}

function testFieldOutsideConfiguredFields(rawClient: Gassma.GassmaClient) {
  const notifications = rawClient.notifications;
  const methods: [string, () => void][] = [
    ["$getAutoincrement", () => notifications.$getAutoincrement("message")],
    ["$setAutoincrement", () => notifications.$setAutoincrement("message", 1)],
    ["$syncAutoincrement", () => notifications.$syncAutoincrement("message")],
  ];

  methods.forEach(([methodName, call]) => {
    const error = captureError(
      call,
      `${methodName} on a non-autoincrement field`,
    );
    assertEquals(
      error instanceof Gassma.GassmaAutoincrementNotConfiguredError,
      true,
      `notConfigured ${methodName}: instanceof GassmaAutoincrementNotConfiguredError`,
    );
    const message = error instanceof Error ? error.message : String(error);
    if (message.indexOf("Autoincrement fields on `notifications`: id") === -1) {
      throw new Error(
        `notConfigured ${methodName}: unexpected message "${message}"`,
      );
    }
  });
}

function testSheetWithoutAnyConfiguration(rawClient: Gassma.GassmaClient) {
  // autoincrement 設定を一切持たないシートも同じエラーで落ちる
  const error = captureError(
    () => rawClient.Post.$getAutoincrement("id"),
    "$getAutoincrement on a sheet without autoincrement",
  );

  assertEquals(
    error instanceof Gassma.GassmaAutoincrementNotConfiguredError,
    true,
    "notConfigured sheet: instanceof GassmaAutoincrementNotConfiguredError",
  );
  const message = error instanceof Error ? error.message : String(error);
  if (message.indexOf("Sheet `Post` has no autoincrement fields") === -1) {
    throw new Error(`notConfigured sheet: unexpected message "${message}"`);
  }
}

export { testAutoincrementNotConfigured };
