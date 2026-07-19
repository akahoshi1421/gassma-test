import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { SPREADSHEET_ID_DB1 } from "../../consts/spreadsheetIds";
import { assertEquals } from "../../assert/assertEquals";

function testLibrarySurface() {
  const client = new GassmaClient();

  testPublicGlobalsExposed();
  testErrorInstanceof(client);
  testStrictClientSkipAndUndefined();
  testControllerInstanceof(client);

  Logger.log("✅ testLibrarySurface: all passed");
}

function captureError(fn: () => void, label: string): unknown {
  try {
    fn();
  } catch (e) {
    return e;
  }
  throw new Error(`${label}: expected to throw but did not`);
}

function testPublicGlobalsExposed() {
  // 公開32実体(クラス31 + symbol 1)がライブラリメンバーとして実機参照できること
  const publicClasses: (readonly [string, unknown])[] = [
    ["GassmaClient", Gassma.GassmaClient],
    ["GassmaController", Gassma.GassmaController],
    ["FieldRef", Gassma.FieldRef],
    ["GassmaSkipNegativeError", Gassma.GassmaSkipNegativeError],
    ["GassmaFindFirstTakeError", Gassma.GassmaFindFirstTakeError],
    ["GassmaLimitNegativeError", Gassma.GassmaLimitNegativeError],
    ["NotFoundError", Gassma.NotFoundError],
    [
      "RelationOrderByUnsupportedTypeError",
      Gassma.RelationOrderByUnsupportedTypeError,
    ],
    [
      "RelationOrderByCountUnsupportedTypeError",
      Gassma.RelationOrderByCountUnsupportedTypeError,
    ],
    ["RelationSheetNotFoundError", Gassma.RelationSheetNotFoundError],
    ["RelationMissingPropertyError", Gassma.RelationMissingPropertyError],
    [
      "RelationInvalidPropertyTypeError",
      Gassma.RelationInvalidPropertyTypeError,
    ],
    ["RelationInvalidTypeError", Gassma.RelationInvalidTypeError],
    ["RelationColumnNotFoundError", Gassma.RelationColumnNotFoundError],
    ["IncludeWithoutRelationsError", Gassma.IncludeWithoutRelationsError],
    ["IncludeInvalidOptionTypeError", Gassma.IncludeInvalidOptionTypeError],
    ["IncludeSelectOmitConflictError", Gassma.IncludeSelectOmitConflictError],
    [
      "IncludeSelectIncludeConflictError",
      Gassma.IncludeSelectIncludeConflictError,
    ],
    ["WhereRelationInvalidFilterError", Gassma.WhereRelationInvalidFilterError],
    [
      "WhereRelationWithoutContextError",
      Gassma.WhereRelationWithoutContextError,
    ],
    ["RelationOnDeleteRestrictError", Gassma.RelationOnDeleteRestrictError],
    ["RelationInvalidOnDeleteError", Gassma.RelationInvalidOnDeleteError],
    ["RelationOnUpdateRestrictError", Gassma.RelationOnUpdateRestrictError],
    ["RelationInvalidOnUpdateError", Gassma.RelationInvalidOnUpdateError],
    [
      "NestedWriteConnectNotFoundError",
      Gassma.NestedWriteConnectNotFoundError,
    ],
    [
      "NestedWriteRelationNotFoundError",
      Gassma.NestedWriteRelationNotFoundError,
    ],
    [
      "NestedWriteInvalidOperationError",
      Gassma.NestedWriteInvalidOperationError,
    ],
    [
      "NestedWriteWithoutRelationsError",
      Gassma.NestedWriteWithoutRelationsError,
    ],
    ["NestedWriteTargetNotFoundError", Gassma.NestedWriteTargetNotFoundError],
    ["GassmaUndefinedValueError", Gassma.GassmaUndefinedValueError],
    ["GassmaSkipInArrayError", Gassma.GassmaSkipInArrayError],
  ];
  publicClasses.forEach((entry) => {
    assertEquals(typeof entry[1], "function", `typeof Gassma.${entry[0]}`);
  });

  // 非関数値(symbol)もライブラリメンバーとして参照できること
  assertEquals(typeof Gassma.skip, "symbol", "typeof Gassma.skip");
}

function testErrorInstanceof(client: GassmaClient) {
  // ライブラリ境界(別 realm)越しでも、ライブラリ global 経由の同一コンストラクタ参照なら instanceof が成立する
  const notFound = captureError(() => {
    client.User.findFirstOrThrow({ where: { id: 99999 } });
  }, "findFirstOrThrow missing id");
  assertEquals(
    notFound instanceof Gassma.NotFoundError,
    true,
    "notFound instanceof Gassma.NotFoundError",
  );

  const skipNegative = captureError(() => {
    client.User.findMany({ skip: -1 });
  }, "findMany skip: -1");
  assertEquals(
    skipNegative instanceof Gassma.GassmaSkipNegativeError,
    true,
    "skipNegative instanceof Gassma.GassmaSkipNegativeError",
  );

  const findFirstTake = captureError(() => {
    client.User.findFirst({ take: 2 });
  }, "findFirst take: 2");
  assertEquals(
    findFirstTake instanceof Gassma.GassmaFindFirstTakeError,
    true,
    "findFirstTake instanceof Gassma.GassmaFindFirstTakeError",
  );
}

function testStrictClientSkipAndUndefined() {
  const strictClient = new Gassma.GassmaClient({
    id: SPREADSHEET_ID_DB1,
    strictUndefinedChecks: true,
  });

  // strict でも Gassma.skip は「条件なし」扱いで throw しない
  const skipResult = strictClient.User.findMany({
    where: { name: Gassma.skip },
  });
  assertEquals(skipResult.length, 50, "strict skip where returns all users");

  const undefinedError = captureError(() => {
    strictClient.User.findMany({ where: { name: undefined } });
  }, "strict findMany where name: undefined");
  assertEquals(
    undefinedError instanceof Gassma.GassmaUndefinedValueError,
    true,
    "undefinedError instanceof Gassma.GassmaUndefinedValueError",
  );
}

function testControllerInstanceof(client: GassmaClient) {
  // 生成クライアントはライブラリ製コントローラをそのまま保持している
  assertEquals(
    client.User instanceof Gassma.GassmaController,
    true,
    "client.User instanceof Gassma.GassmaController",
  );
}

export { testLibrarySurface };
