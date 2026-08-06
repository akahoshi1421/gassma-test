const WIDE_COLUMN_COUNT = 30;

const CREATE_MODEL: Gassma.MigrateModel = {
  name: "MigrateCreate",
  columns: ["id", "name", "email"],
};

const APPEND_MODEL: Gassma.MigrateModel = {
  name: "MigrateAppend",
  columns: ["id", "name", "email"],
};

// schema と違う並びの既存ヘッダー。migrateSheets は並べ替えず末尾追記のみを行う
const APPEND_INITIAL_HEADERS = ["email", "id"];
const APPEND_INITIAL_ROWS: unknown[][] = [
  ["alpha@example.com", 1],
  ["beta@example.com", 2],
];
const APPEND_EXPECTED_HEADERS = ["email", "id", "name"];

// 既定26列を超えるモデル。新規シート作成時のグリッド自動拡張を突く
const WIDE_MODEL: Gassma.MigrateModel = {
  name: "MigrateWide",
  columns: Array.from(
    { length: WIDE_COLUMN_COUNT },
    (_, index) => `col${index + 1}`,
  ),
};

// deleteColumns で 3 列まで詰めた既存シートに対する拡張を突く
const NARROW_MODEL: Gassma.MigrateModel = {
  name: "MigrateNarrow",
  columns: ["a", "b", "c", "d", "e"],
};
const NARROW_MAX_COLUMNS = 3;
const NARROW_INITIAL_HEADERS = ["a", "b"];
const NARROW_INITIAL_ROWS: unknown[][] = [["keep-1", "keep-2"]];

// schema に無い列 "legacy" を持つシート。削除されないこと
const KEEP_MODEL: Gassma.MigrateModel = {
  name: "MigrateKeep",
  columns: ["id", "title"],
};
const KEEP_INITIAL_HEADERS = ["id", "title", "legacy"];
const KEEP_INITIAL_ROWS: unknown[][] = [
  [1, "first", "legacy-1"],
  [2, "second", "legacy-2"],
];

// どのモデルにも含まれないシート。削除されないこと
const UNMANAGED_SHEET_NAME = "MigrateUnmanaged";
const UNMANAGED_HEADERS = ["kept", "columns"];
const UNMANAGED_ROWS: unknown[][] = [["stays", "here"]];

// 新規スプレッドシートの空の既定シートが消えることを見る専用モデル。
// 「最低1枚は残す」ガードと区別するため 2 枚以上にしている
const PRISTINE_MODELS: Gassma.MigrateModel[] = [
  { name: "MigratePristineA", columns: ["id", "name"] },
  { name: "MigratePristineB", columns: ["id", "label"] },
];

const ALL_MODELS: Gassma.MigrateModel[] = [
  CREATE_MODEL,
  APPEND_MODEL,
  WIDE_MODEL,
  NARROW_MODEL,
  KEEP_MODEL,
];

export {
  WIDE_COLUMN_COUNT,
  CREATE_MODEL,
  APPEND_MODEL,
  APPEND_INITIAL_HEADERS,
  APPEND_INITIAL_ROWS,
  APPEND_EXPECTED_HEADERS,
  WIDE_MODEL,
  NARROW_MODEL,
  NARROW_MAX_COLUMNS,
  NARROW_INITIAL_HEADERS,
  NARROW_INITIAL_ROWS,
  KEEP_MODEL,
  KEEP_INITIAL_HEADERS,
  KEEP_INITIAL_ROWS,
  UNMANAGED_SHEET_NAME,
  UNMANAGED_HEADERS,
  UNMANAGED_ROWS,
  PRISTINE_MODELS,
  ALL_MODELS,
};
