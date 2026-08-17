// GAS の V8 が何をサポートしているかを実機で測る。gassma とは無関係の環境調査用。
// 構文は eval 越しに、API は名前引きで判定する。ビルド時の変換や tsconfig の lib に
// 結果が左右されると、素の実行環境の能力を測ったことにならないため。
//
// ⚠️ eval が測るのは実行時パーサで、GAS がファイルを読むときのパーサはこれより古い。
// 実測: eval("1_000") は通るが、ファイルに直接 Logger.log(10_000) と書くと動かない。
// つまり「構文が OK」= 「バンドルに書ける」ではない。esbuild の target を決める根拠に
// この節を使わないこと。

type Probe = { es: string; name: string; check: () => boolean };

const parses = (code: string): boolean => {
  try {
    // biome-ignore lint/security/noGlobalEval: 構文サポートの実機判定に必要
    eval(code);
    return true;
  } catch (error) {
    return !(error instanceof SyntaxError);
  }
};

const has = (holder: unknown, key: string): boolean => {
  if (holder === null || holder === undefined) return false;
  return Reflect.get(Object(holder), key) !== undefined;
};

const hasGlobal = (name: string): boolean => has(globalThis, name);

const errorCauseWorks = (): boolean => {
  const ctor = Reflect.get(globalThis, "Error");
  const error = Reflect.construct(ctor, ["x", { cause: 1 }]);
  return Reflect.get(error, "cause") === 1;
};

const syntaxProbes: Probe[] = [
  { es: "ES2018", name: "object spread", check: () => parses("({ ...{ a: 1 } })") },
  { es: "ES2018", name: "async iteration (for await)", check: () => parses("(async () => { for await (const x of []) x; })") },
  { es: "ES2019", name: "optional catch binding", check: () => parses("(() => { try { null; } catch { return 1; } })") },
  { es: "ES2020", name: "optional chaining (?.)", check: () => parses("({ a: 1 })?.a") },
  { es: "ES2020", name: "nullish coalescing (??)", check: () => parses("null ?? 1") },
  { es: "ES2020", name: "dynamic import()", check: () => parses("(() => import('./nothing'))") },
  { es: "ES2021", name: "logical assignment (??= ||= &&=)", check: () => parses("(() => { let a = null; a ??= 1; a ||= 2; a &&= 3; return a; })()") },
  { es: "ES2021", name: "numeric separators (1_000)", check: () => parses("1_000") },
  { es: "ES2022", name: "class fields", check: () => parses("(class { x = 1; })") },
  { es: "ES2022", name: "static class fields", check: () => parses("(class { static x = 1; })") },
  { es: "ES2022", name: "private class fields (#x)", check: () => parses("(class { #x = 1; get() { return this.#x; } })") },
  { es: "ES2022", name: "static initialization blocks", check: () => parses("(class { static { 1; } })") },
  { es: "ES2024", name: "RegExp v flag", check: () => parses("/[a]/v") },
];

const apiProbes: Probe[] = [
  { es: "ES2017", name: "Object.entries", check: () => has(Object, "entries") },
  { es: "ES2018", name: "Promise.prototype.finally", check: () => has(Promise.prototype, "finally") },
  { es: "ES2019", name: "Array.prototype.flat", check: () => has(Array.prototype, "flat") },
  { es: "ES2019", name: "Object.fromEntries", check: () => has(Object, "fromEntries") },
  { es: "ES2019", name: "String.prototype.trimStart", check: () => has(String.prototype, "trimStart") },
  { es: "ES2020", name: "globalThis", check: () => typeof globalThis !== "undefined" },
  { es: "ES2020", name: "BigInt", check: () => hasGlobal("BigInt") },
  { es: "ES2020", name: "Promise.allSettled", check: () => has(Promise, "allSettled") },
  { es: "ES2020", name: "String.prototype.matchAll", check: () => has(String.prototype, "matchAll") },
  { es: "ES2021", name: "Promise.any", check: () => has(Promise, "any") },
  { es: "ES2021", name: "String.prototype.replaceAll", check: () => has(String.prototype, "replaceAll") },
  { es: "ES2021", name: "WeakRef", check: () => hasGlobal("WeakRef") },
  { es: "ES2022", name: "Object.hasOwn", check: () => has(Object, "hasOwn") },
  { es: "ES2022", name: "Array.prototype.at", check: () => has(Array.prototype, "at") },
  { es: "ES2022", name: "Error cause", check: errorCauseWorks },
  { es: "ES2023", name: "Array.prototype.findLast", check: () => has(Array.prototype, "findLast") },
  { es: "ES2024", name: "Object.groupBy", check: () => has(Object, "groupBy") },
  { es: "-", name: "structuredClone", check: () => hasGlobal("structuredClone") },
  { es: "-", name: "eval そのもの", check: () => parses("1") },
];

const runProbes = (title: string, probes: Probe[]): string[] => {
  const lines = [`--- ${title} ---`];
  probes.forEach((probe) => {
    let supported = false;
    try {
      supported = probe.check();
    } catch (_error) {
      supported = false;
    }
    lines.push(`${supported ? "OK" : "NG"}  ${probe.es}  ${probe.name}`);
  });
  return lines;
};

function probeV8Support() {
  const lines = [
    "GAS V8 サポート状況",
    ...runProbes("構文 (eval = 実行時パーサ。ファイルに直接書けるかは別)", syntaxProbes),
    ...runProbes("API (名前引きで判定)", apiProbes),
  ];
  Logger.log(lines.join("\n"));
}

export { probeV8Support };
