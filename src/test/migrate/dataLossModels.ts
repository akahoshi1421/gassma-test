// acceptDataLoss ケース専用のモデル群。既存ケースの ALL_MODELS には混ぜない
// (混ぜると testMigrateIdempotent の対象が変わってしまうため)。

// schema に無い列を持たせたまま、フラグ無しで流しても何も消えないことを見る
const GUARD_MODEL: Gassma.MigrateModel = {
  name: "MigrateDropGuard",
  columns: ["id"],
};
const GUARD_INITIAL_HEADERS = ["id", "extra"];
const GUARD_INITIAL_ROWS: unknown[][] = [
  [1, "keep-1"],
  [2, "keep-2"],
];

// 真ん中の列 "memo" を落としつつ、同じ実行で不足列 "email" を末尾に足す
// (追記 → 削除の順で処理されても最終形が崩れないことを見る)
const DROP_COLUMN_MODEL: Gassma.MigrateModel = {
  name: "MigrateDropColumn",
  columns: ["id", "name", "email"],
};
const DROP_COLUMN_INITIAL_HEADERS = ["id", "memo", "name"];
const DROP_COLUMN_INITIAL_ROWS: unknown[][] = [
  [1, "memo-1", "alice"],
  [2, "memo-2", "bob"],
];
const DROP_COLUMN_EXPECTED_ROWS: unknown[][] = [
  [1, "alice", ""],
  [2, "bob", ""],
];

// 先頭・中間・末尾に余分な列を挟み、右から左への削除で位置ずれしないことを突く
const MULTI_MODEL: Gassma.MigrateModel = {
  name: "MigrateDropMulti",
  columns: ["id", "name", "email"],
};
const MULTI_INITIAL_HEADERS = [
  "legacy1",
  "id",
  "legacy2",
  "name",
  "legacy3",
  "email",
  "legacy4",
];
const MULTI_INITIAL_ROWS: unknown[][] = [
  ["x1", 1, "x2", "alice", "x3", "alice@example.com", "x4"],
  ["y1", 2, "y2", "bob", "y3", "bob@example.com", "y4"],
];
const MULTI_EXPECTED_ROWS: unknown[][] = [
  [1, "alice", "alice@example.com"],
  [2, "bob", "bob@example.com"],
];

// 0 / false / Date だけを持つ列。実機のセルは文字列でなく型付きの値を返すので、
// これらが「空」と誤判定されずデータ入りの列として扱われる経路を実機で通す
const TYPED_MODEL: Gassma.MigrateModel = {
  name: "MigrateDropTyped",
  columns: ["id"],
};
const TYPED_INITIAL_HEADERS = ["id", "flags"];
const TYPED_INITIAL_ROWS: unknown[][] = [
  [1, 0],
  [2, false],
  [3, new Date(2026, 0, 15, 12, 30, 0)],
];

// データの無い列と、ヘッダーだけでデータ行の無いシート(空なら警告なしで削除される側)
const EMPTY_COLUMN_MODEL: Gassma.MigrateModel = {
  name: "MigrateDropEmpty",
  columns: ["id"],
};
const EMPTY_COLUMN_INITIAL_HEADERS = ["id", "blank"];
const EMPTY_COLUMN_INITIAL_ROWS: unknown[][] = [[1], [2]];
const EMPTY_SHEET_NAME = "MigrateDropEmptySheet";
const EMPTY_SHEET_HEADERS = ["ghost"];

// columns: [] のモデル。列を1つも管理しないので acceptDataLoss でも何も消えない
const EMPTY_MODEL: Gassma.MigrateModel = {
  name: "MigrateEmptyModel",
  columns: [],
};
const EMPTY_MODEL_INITIAL_HEADERS = ["id", "name", "memo"];
const EMPTY_MODEL_INITIAL_ROWS: unknown[][] = [
  [1, "alice", "memo-1"],
  [2, "bob", "memo-2"],
];

// データ入りのままシートごと落とす
const DROP_SHEET_NAME = "MigrateDropSheet";
const DROP_SHEET_HEADERS = ["id", "note"];
const DROP_SHEET_ROWS: unknown[][] = [
  [1, "bye-1"],
  [2, "bye-2"],
];

export {
  GUARD_MODEL,
  GUARD_INITIAL_HEADERS,
  GUARD_INITIAL_ROWS,
  TYPED_MODEL,
  TYPED_INITIAL_HEADERS,
  TYPED_INITIAL_ROWS,
  EMPTY_COLUMN_MODEL,
  EMPTY_COLUMN_INITIAL_HEADERS,
  EMPTY_COLUMN_INITIAL_ROWS,
  EMPTY_SHEET_NAME,
  EMPTY_SHEET_HEADERS,
  EMPTY_MODEL,
  EMPTY_MODEL_INITIAL_HEADERS,
  EMPTY_MODEL_INITIAL_ROWS,
  DROP_SHEET_NAME,
  DROP_SHEET_HEADERS,
  DROP_SHEET_ROWS,
  DROP_COLUMN_MODEL,
  DROP_COLUMN_INITIAL_HEADERS,
  DROP_COLUMN_INITIAL_ROWS,
  DROP_COLUMN_EXPECTED_ROWS,
  MULTI_MODEL,
  MULTI_INITIAL_HEADERS,
  MULTI_INITIAL_ROWS,
  MULTI_EXPECTED_ROWS,
};
