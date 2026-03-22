export namespace Gassma {
  type RelationsConfig = Record<string, Record<string, unknown>>;

  type NumberOperation = {
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  type SortOrderInput = {
    sort: "asc" | "desc";
    nulls?: "first" | "last";
  };

  type TrueKeys<T> = { [K in keyof T]: T[K] extends true ? K : never }[keyof T];
  type FalseKeys<T> = { [K in keyof T]: T[K] extends false ? K : never }[keyof T];
  type ResolveOmitKeys<GO, QO> = Exclude<TrueKeys<GO>, FalseKeys<QO>> | TrueKeys<QO>;

  type ManyReturn = {
    count: number;
  };

  type CreateManyReturn = ManyReturn;
  type UpdateManyReturn = ManyReturn;
  type DeleteManyReturn = ManyReturn;

  interface GassmaClientMap {}

  class GassmaClient<T extends keyof GassmaClientMap> {
    constructor(idOrOptions?: string | GassmaClientMap[T]["options"]);
  }

  class FieldRef {
    readonly modelName: string;
    readonly name: string;
    constructor(modelName: string, name: string);
  }

  class GassmaSkipNegativeError extends Error {
    constructor(value: number);
  }
  class GassmaLimitNegativeError extends Error {
    constructor(value: number);
  }
  class NotFoundError extends Error {
    constructor();
  }
  class GassmaFindSelectOmitConflictError extends Error {
    constructor();
  }
  class GassmaInValidColumnValueError extends Error {
    constructor();
  }
  class GassmaGroupByHavingDontWriteByError extends Error {
    constructor();
  }
  class GassmaAggregateMaxError extends Error {
    constructor();
  }
  class GassmaAggregateMinError extends GassmaAggregateMaxError {
    constructor();
  }
  class GassmaAggregateSumError extends GassmaAggregateMaxError {
    constructor();
  }
  class GassmaAggregateAvgError extends GassmaAggregateMaxError {
    constructor();
  }
  class GassmaAggregateTypeError extends Error {
    constructor();
  }
  class GassmaAggregateSumTypeError extends Error {
    constructor();
  }
  class GassmaAggregateAvgTypeError extends GassmaAggregateSumTypeError {
    constructor();
  }
  class RelationSheetNotFoundError extends Error {
    constructor(sheetName: string);
  }
  class RelationMissingPropertyError extends Error {
    constructor(sheetName: string, relationName: string, property: string);
  }
  class RelationInvalidPropertyTypeError extends Error {
    constructor(sheetName: string, relationName: string, property: string, expectedType: string);
  }
  class RelationInvalidTypeError extends Error {
    constructor(sheetName: string, relationName: string, value: string);
  }
  class RelationColumnNotFoundError extends Error {
    constructor(sheetName: string, columnName: string);
  }
  class IncludeWithoutRelationsError extends Error {
    constructor();
  }
  class IncludeInvalidOptionTypeError extends Error {
    constructor(relationName: string, option: string, expectedType: string);
  }
  class IncludeSelectOmitConflictError extends Error {
    constructor(relationName: string);
  }
  class IncludeSelectIncludeConflictError extends Error {
    constructor(relationName: string);
  }
  class WhereRelationInvalidFilterError extends Error {
    constructor(relationName: string, relationType: string, filterType: string);
  }
  class WhereRelationWithoutContextError extends Error {
    constructor();
  }
  class RelationOnDeleteRestrictError extends Error {
    constructor(relationName: string);
  }
  class RelationInvalidOnDeleteError extends Error {
    constructor(sheetName: string, relationName: string, value: string);
  }
  class RelationOnUpdateRestrictError extends Error {
    constructor(relationName: string);
  }
  class RelationInvalidOnUpdateError extends Error {
    constructor(sheetName: string, relationName: string, value: string);
  }
  class NestedWriteConnectNotFoundError extends Error {
    constructor(sheetName: string);
  }
  class NestedWriteRelationNotFoundError extends Error {
    constructor(fieldName: string);
  }
  class NestedWriteInvalidOperationError extends Error {
    constructor(relationName: string, operation: string, relationType: string);
  }
  class NestedWriteWithoutRelationsError extends Error {
    constructor();
  }
  class RelationOrderByUnsupportedTypeError extends Error {
    constructor(relationName: string, relationType: string);
  }
  class RelationOrderByCountUnsupportedTypeError extends Error {
    constructor(relationName: string, relationType: string);
  }
  class GassmaRelationNotFoundError extends Error {
    constructor(relationName: string, sheetName: string);
  }
  class GassmaTargetSheetNotFoundError extends Error {
    constructor(targetSheetName: string);
  }
  class GassmaThroughRequiredError extends Error {
    constructor(relationName: string);
  }
  class GassmaIncludeSelectConflictError extends Error {
    constructor();
  }
  class GassmaRelationDuplicateError extends Error {
    constructor(sheetName: string, field: string, value: unknown);
  }
}

export namespace Gassma {
  interface GassmaClientMap {
    "Schema": {
      options: GassmaSchemaClientOptions;
      globalOmitConfig: GassmaSchemaGlobalOmitConfig;
    };
  }
}

export type GassmaSchemaGlobalOmitConfig = {
  "Item"?: GassmaSchemaItemOmit;
};

export type GassmaSchemaDefaultsConfig = {};

export type GassmaSchemaUpdatedAtConfig = {};

export type GassmaSchemaIgnoreConfig = {
  "Item"?: "id" | "name" | "price" | ("id" | "name" | "price")[];
};

export type GassmaSchemaIgnoreSheetsConfig = "Item" | ("Item")[];

export type GassmaSchemaMapConfig = {
  "Item"?: {
      "id"?: string;
      "name"?: string;
      "price"?: string;
  };
};

export type GassmaSchemaMapSheetsConfig = {
  "Item"?: string;
};

export type GassmaSchemaAutoincrementConfig = {
  "Item"?: "id" | "name" | "price" | ("id" | "name" | "price")[];
};

export type GassmaSchemaClientOptions<O extends GassmaSchemaGlobalOmitConfig = {}> = {
  id?: string;
  relations?: Gassma.RelationsConfig;
  omit?: O;
  defaults?: GassmaSchemaDefaultsConfig;
  updatedAt?: GassmaSchemaUpdatedAtConfig;
  autoincrement?: GassmaSchemaAutoincrementConfig;
  ignore?: GassmaSchemaIgnoreConfig;
  ignoreSheets?: GassmaSchemaIgnoreSheetsConfig;
  map?: GassmaSchemaMapConfig;
  mapSheets?: GassmaSchemaMapSheetsConfig;
};

export type GassmaSchemaSheet<O extends GassmaSchemaGlobalOmitConfig = {}> = {
  "Item": GassmaSchemaItemController<O extends { "Item": infer UO } ? UO extends GassmaSchemaItemOmit ? UO : {} : {}>;
};

export declare class GassmaSchemaItemController<GO extends GassmaSchemaItemOmit = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnNumber: number,
    endColumnNumber: number
  ): void;
  createMany(createdData: GassmaSchemaItemCreateManyData): CreateManyReturn;
  createManyAndReturn<T extends GassmaSchemaItemCreateManyAndReturnData>(createdData: T): GassmaSchemaItemFindResult<T["select"], T["omit"], GO>[];
  create<T extends GassmaSchemaItemCreateData>(createdData: T): GassmaSchemaItemFindResult<T["select"], T["omit"], GO>;
  findFirst<T extends GassmaSchemaItemFindFirstData>(findData: T): GassmaSchemaItemFindResult<T["select"], T["omit"], GO> | null;
  findFirstOrThrow<T extends GassmaSchemaItemFindFirstData>(findData: T): GassmaSchemaItemFindResult<T["select"], T["omit"], GO>;
  findMany<T extends GassmaSchemaItemFindManyData>(findData: T): GassmaSchemaItemFindResult<T["select"], T["omit"], GO>[];
  update<T extends GassmaSchemaItemUpdateSingleData>(updateData: T): GassmaSchemaItemFindResult<T["select"], T["omit"], GO> | null;
  updateMany(updateData: GassmaSchemaItemUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaSchemaItemUpdateData): GassmaSchemaItemDefaultFindResult[];
  upsert<T extends GassmaSchemaItemUpsertSingleData>(upsertData: T): GassmaSchemaItemFindResult<T["select"], T["omit"], GO>;
  delete<T extends GassmaSchemaItemDeleteSingleData>(deleteData: T): GassmaSchemaItemFindResult<T["select"], T["omit"], GO> | null;
  deleteMany(deleteData: GassmaSchemaItemDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaSchemaItemAggregateData>(aggregateData: T): GassmaSchemaItemAggregateResult<T>;
  count(coutData: GassmaSchemaItemCountData): number;
  groupBy<T extends GassmaSchemaItemGroupByData>(groupByData: T): GassmaSchemaItemGroupByResult<T>[];
}

export type ManyReturn = {
  count: number;
};

export type CreateManyReturn = ManyReturn;
export type UpdateManyReturn = ManyReturn;
export type DeleteManyReturn = ManyReturn;

export type GassmaSchemaItemUse = {
  "id"?: number;
  "name": string;
  "price": number;
};

export type GassmaSchemaItemCreateData = {
  data: GassmaSchemaItemUse;
  include?: GassmaSchemaItemInclude;
} & ({ select?: GassmaSchemaItemSelect; omit?: never } | { select?: never; omit?: GassmaSchemaItemOmit });

export type GassmaSchemaItemCreateManyData = {
  data: GassmaSchemaItemUse[];
};

export type GassmaSchemaItemCreateManyAndReturnData = {
  data: GassmaSchemaItemUse[];
  include?: GassmaSchemaItemInclude;
} & ({ select?: GassmaSchemaItemSelect; omit?: never } | { select?: never; omit?: GassmaSchemaItemOmit });

export type GassmaSchemaItemidFilterConditions = {
  equals?: number | null | Gassma.FieldRef;
  not?: number | null;
  in?: number[];
  notIn?: number[];
  lt?: number | Gassma.FieldRef;
  lte?: number | Gassma.FieldRef;
  gt?: number | Gassma.FieldRef;
  gte?: number | Gassma.FieldRef;
  contains?: string | Gassma.FieldRef;
  startsWith?: string | Gassma.FieldRef;
  endsWith?: string | Gassma.FieldRef;
  mode?: "default" | "insensitive";
};

export type GassmaSchemaItemnameFilterConditions = {
  equals?: string | Gassma.FieldRef;
  not?: string;
  in?: string[];
  notIn?: string[];
  lt?: string | Gassma.FieldRef;
  lte?: string | Gassma.FieldRef;
  gt?: string | Gassma.FieldRef;
  gte?: string | Gassma.FieldRef;
  contains?: string | Gassma.FieldRef;
  startsWith?: string | Gassma.FieldRef;
  endsWith?: string | Gassma.FieldRef;
  mode?: "default" | "insensitive";
};

export type GassmaSchemaItempriceFilterConditions = {
  equals?: number | Gassma.FieldRef;
  not?: number;
  in?: number[];
  notIn?: number[];
  lt?: number | Gassma.FieldRef;
  lte?: number | Gassma.FieldRef;
  gt?: number | Gassma.FieldRef;
  gte?: number | Gassma.FieldRef;
  contains?: string | Gassma.FieldRef;
  startsWith?: string | Gassma.FieldRef;
  endsWith?: string | Gassma.FieldRef;
  mode?: "default" | "insensitive";
};

export type GassmaSchemaItemWhereUse = {
  "id"?: number | null | GassmaSchemaItemidFilterConditions;
  "name"?: string | GassmaSchemaItemnameFilterConditions;
  "price"?: number | GassmaSchemaItempriceFilterConditions;

  AND?: GassmaSchemaItemWhereUse[] | GassmaSchemaItemWhereUse;
  OR?: GassmaSchemaItemWhereUse[];
  NOT?: GassmaSchemaItemWhereUse[] | GassmaSchemaItemWhereUse;
};

export type GassmaSchemaItemidHavingCore = {
  _avg?: GassmaSchemaItemidFilterConditions;
  _count?: GassmaSchemaItemidFilterConditions;
  _max?: GassmaSchemaItemidFilterConditions;
  _min?: GassmaSchemaItemidFilterConditions;
  _sum?: GassmaSchemaItemidFilterConditions;
} & GassmaSchemaItemidFilterConditions;

export type GassmaSchemaItemnameHavingCore = {
  _avg?: GassmaSchemaItemnameFilterConditions;
  _count?: GassmaSchemaItemnameFilterConditions;
  _max?: GassmaSchemaItemnameFilterConditions;
  _min?: GassmaSchemaItemnameFilterConditions;
  _sum?: GassmaSchemaItemnameFilterConditions;
} & GassmaSchemaItemnameFilterConditions;

export type GassmaSchemaItempriceHavingCore = {
  _avg?: GassmaSchemaItempriceFilterConditions;
  _count?: GassmaSchemaItempriceFilterConditions;
  _max?: GassmaSchemaItempriceFilterConditions;
  _min?: GassmaSchemaItempriceFilterConditions;
  _sum?: GassmaSchemaItempriceFilterConditions;
} & GassmaSchemaItempriceFilterConditions;

export type GassmaSchemaItemHavingUse = {
  "id"?: number | null | GassmaSchemaItemidHavingCore;
  "name"?: string | GassmaSchemaItemnameHavingCore;
  "price"?: number | GassmaSchemaItempriceHavingCore;

  AND?: GassmaSchemaItemHavingUse[] | GassmaSchemaItemHavingUse;
  OR?: GassmaSchemaItemHavingUse[];
  NOT?: GassmaSchemaItemHavingUse[] | GassmaSchemaItemHavingUse;
};

export type GassmaSchemaItemFindData = {
  where?: GassmaSchemaItemWhereUse;
  orderBy?: GassmaSchemaItemOrderBy;
  take?: number;
  skip?: number;
  distinct?: "id" | "name" | "price" | ("id" | "name" | "price")[];
  include?: GassmaSchemaItemInclude;
  cursor?: Partial<GassmaSchemaItemUse>;
  _count?: GassmaSchemaItemCountValue;
} & ({ select?: GassmaSchemaItemFindSelect; omit?: never } | { select?: never; omit?: GassmaSchemaItemOmit });

export type GassmaSchemaItemFindFirstData = {
  where?: GassmaSchemaItemWhereUse;
  orderBy?: GassmaSchemaItemOrderBy;
  include?: GassmaSchemaItemInclude;
  cursor?: Partial<GassmaSchemaItemUse>;
  _count?: GassmaSchemaItemCountValue;
} & ({ select?: GassmaSchemaItemFindSelect; omit?: never } | { select?: never; omit?: GassmaSchemaItemOmit });

export type GassmaSchemaItemFindManyData = GassmaSchemaItemFindData;

export type GassmaSchemaItemUpdateData = {
  where?: GassmaSchemaItemWhereUse;
  data: Partial<{ [K in keyof GassmaSchemaItemUse]: GassmaSchemaItemUse[K] | Gassma.NumberOperation }>;
  limit?: number;
};

export type GassmaSchemaItemUpdateSingleData = {
  where: GassmaSchemaItemWhereUse;
  data: Partial<{ [K in keyof GassmaSchemaItemUse]: GassmaSchemaItemUse[K] | Gassma.NumberOperation }>;
  include?: GassmaSchemaItemInclude;
} & ({ select?: GassmaSchemaItemSelect; omit?: never } | { select?: never; omit?: GassmaSchemaItemOmit });

export type GassmaSchemaItemUpsertSingleData = {
  where: GassmaSchemaItemWhereUse;
  create: GassmaSchemaItemUse;
  update: Partial<{ [K in keyof GassmaSchemaItemUse]: GassmaSchemaItemUse[K] | Gassma.NumberOperation }>;
  include?: GassmaSchemaItemInclude;
} & ({ select?: GassmaSchemaItemSelect; omit?: never } | { select?: never; omit?: GassmaSchemaItemOmit });

export type GassmaSchemaItemDeleteData = {
  where: GassmaSchemaItemWhereUse;
  limit?: number;
};

export type GassmaSchemaItemDeleteSingleData = {
  where: GassmaSchemaItemWhereUse;
  include?: GassmaSchemaItemInclude;
} & ({ select?: GassmaSchemaItemSelect; omit?: never } | { select?: never; omit?: GassmaSchemaItemOmit });

export type GassmaSchemaItemAggregateData = {
  where?: GassmaSchemaItemWhereUse;
  orderBy?: GassmaSchemaItemOrderBy;
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaSchemaItemUse>;
  _avg?: GassmaSchemaItemSelect;
  _count?: GassmaSchemaItemSelect;
  _max?: GassmaSchemaItemSelect;
  _min?: GassmaSchemaItemSelect;
  _sum?: GassmaSchemaItemSelect;
};

export type GassmaSchemaItemGroupByData = GassmaSchemaItemAggregateData & {
  by: "id" | "name" | "price" | ("id" | "name" | "price")[];
  having?: GassmaSchemaItemHavingUse;
};

export type GassmaSchemaItemInclude = {};

export type GassmaSchemaItemCountValue = true;

export type GassmaSchemaItemOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "name"?: "asc" | "desc" | Gassma.SortOrderInput;
  "price"?: "asc" | "desc" | Gassma.SortOrderInput;
};

export type GassmaSchemaItemSelect = {
  "id"?: true;
  "name"?: true;
  "price"?: true;
};

export type GassmaSchemaItemFindSelect = {
  "id"?: true;
  "name"?: true;
  "price"?: true;
};

export type GassmaSchemaItemOmit = {
  "id"?: true | false;
  "name"?: true | false;
  "price"?: true | false;
};

export type GassmaSchemaItemCountData = {
  where?: GassmaSchemaItemWhereUse;
  orderBy?: GassmaSchemaItemOrderBy;
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaSchemaItemUse>;
};

export type GassmaSchemaItemCreateReturn = {
 "id": number | null;
 "name": string;
 "price": number;
};

export type GassmaSchemaItemDefaultFindResult = GassmaSchemaItemCreateReturn;

export type GassmaSchemaItemFindResult<S, QO = undefined, GO = {}> = S extends GassmaSchemaItemSelect
  ? {
      [K in keyof S as S[K] extends true
        ? K & keyof GassmaSchemaItemDefaultFindResult
        : never]: GassmaSchemaItemDefaultFindResult[K & keyof GassmaSchemaItemDefaultFindResult];
    }
  : {
      [K in keyof GassmaSchemaItemDefaultFindResult as
        K extends Gassma.ResolveOmitKeys<GO, QO> ? never : K
      ]: GassmaSchemaItemDefaultFindResult[K];
    };

export type GassmaSchemaItemAggregateBaseReturn = {
  "id": number
  "name": string
  "price": number
};

export type GassmaSchemaItemAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : {
        [P in keyof T as T[P] extends true
          ? P & keyof GassmaSchemaItemAggregateBaseReturn
          : never]: GassmaSchemaItemAggregateBaseReturn[P & keyof GassmaSchemaItemAggregateBaseReturn];
      };

export type GassmaSchemaItemAggregateResult<T extends GassmaSchemaItemAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaSchemaItemAggregateField<T[K], K> : never;
};

export type GassmaSchemaItemGroupByBaseReturn = GassmaSchemaItemCreateReturn;

export type GassmaSchemaItemGroupByKeyOfBaseReturn = keyof GassmaSchemaItemGroupByBaseReturn;

export type GassmaSchemaItemByField<T extends GassmaSchemaItemGroupByKeyOfBaseReturn | GassmaSchemaItemGroupByKeyOfBaseReturn[]> =
  T extends GassmaSchemaItemGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaSchemaItemGroupByBaseReturn[K & keyof GassmaSchemaItemGroupByBaseReturn];
      }
    : T extends keyof GassmaSchemaItemGroupByBaseReturn
      ? { [K in T]: GassmaSchemaItemGroupByBaseReturn[K] }
      : never;

export type GassmaSchemaItemGroupByResult<T extends GassmaSchemaItemGroupByData> = GassmaSchemaItemByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaSchemaItemAggregateField<T[K], K> : never;
};

export interface GassmaClient<O extends GassmaSchemaGlobalOmitConfig = {}> extends GassmaSchemaSheet<O> {}
export declare class GassmaClient<O extends GassmaSchemaGlobalOmitConfig = {}> {
  constructor(options?: GassmaSchemaClientOptions<O>);
}
