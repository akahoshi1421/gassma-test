declare namespace Gassma {
  type RelationsConfig = Record<string, Record<string, unknown>>;

  type IncludeData = {
    [relationName: string]: unknown;
  };

  type CountSelectItem = true | { where?: Record<string, unknown> };
  type CountSelect = { select: { [relationName: string]: CountSelectItem } };
  type CountValue = true | CountSelect;

  type NumberOperation = {
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  type NestedWriteOperation = {
    create?: unknown;
    connect?: unknown;
    connectOrCreate?: unknown;
    update?: unknown;
    delete?: unknown;
    deleteMany?: unknown;
    disconnect?: unknown;
    set?: unknown;
  };

  type SortOrderInput = {
    sort: "asc" | "desc";
    nulls?: "first" | "last";
  };

  type RelationOrderBy = {
    [key: string]: "asc" | "desc";
  };

  type RelationListFilter = {
    some?: Record<string, unknown>;
    every?: Record<string, unknown>;
    none?: Record<string, unknown>;
  };

  type RelationSingleFilter = {
    is?: Record<string, unknown>;
    isNot?: Record<string, unknown>;
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
  type UpsertManyReturn = ManyReturn;

  interface GassmaClientMap {}

  class GassmaClient<T extends keyof GassmaClientMap> {
    constructor(idOrOptions?: string | GassmaClientMap[T]["options"]);
    readonly sheets: GassmaClientMap[T]["sheets"];
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

declare namespace Gassma {
  interface GassmaClientMap {
    "Test": {
      sheets: GassmaTestSheet;
      options: GassmaTestClientOptions;
      globalOmitConfig: GassmaTestGlobalOmitConfig;
    };
  }
}

declare type GassmaTestGlobalOmitConfig = {
  "User"?: GassmaTestUserOmit;
  "Profile"?: GassmaTestProfileOmit;
  "Post"?: GassmaTestPostOmit;
  "Comment"?: GassmaTestCommentOmit;
  "Category"?: GassmaTestCategoryOmit;
  "Tag"?: GassmaTestTagOmit;
  "Product"?: GassmaTestProductOmit;
  "Order"?: GassmaTestOrderOmit;
  "OrderItem"?: GassmaTestOrderItemOmit;
};
declare type GassmaTestClientOptions<O extends GassmaTestGlobalOmitConfig = {}> = {
  id?: string;
  relations?: Gassma.RelationsConfig;
  omit?: O;
};
declare type GassmaTestSheet<O extends GassmaTestGlobalOmitConfig = {}> = {
  "User": GassmaTestUserController<O extends { "User": infer UO } ? UO extends GassmaTestUserOmit ? UO : {} : {}>;
  "Profile": GassmaTestProfileController<O extends { "Profile": infer UO } ? UO extends GassmaTestProfileOmit ? UO : {} : {}>;
  "Post": GassmaTestPostController<O extends { "Post": infer UO } ? UO extends GassmaTestPostOmit ? UO : {} : {}>;
  "Comment": GassmaTestCommentController<O extends { "Comment": infer UO } ? UO extends GassmaTestCommentOmit ? UO : {} : {}>;
  "Category": GassmaTestCategoryController<O extends { "Category": infer UO } ? UO extends GassmaTestCategoryOmit ? UO : {} : {}>;
  "Tag": GassmaTestTagController<O extends { "Tag": infer UO } ? UO extends GassmaTestTagOmit ? UO : {} : {}>;
  "Product": GassmaTestProductController<O extends { "Product": infer UO } ? UO extends GassmaTestProductOmit ? UO : {} : {}>;
  "Order": GassmaTestOrderController<O extends { "Order": infer UO } ? UO extends GassmaTestOrderOmit ? UO : {} : {}>;
  "OrderItem": GassmaTestOrderItemController<O extends { "OrderItem": infer UO } ? UO extends GassmaTestOrderItemOmit ? UO : {} : {}>;
};

declare class GassmaTestUserController<GO extends GassmaTestUserOmit = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnNumber: number,
    endColumnNumber: number
  ): void;
  createMany(createdData: GassmaTestUserCreateManyData): CreateManyReturn;
  createManyAndReturn(createdData: GassmaTestUserCreateManyData): Record<string, unknown>[];
  create<T extends GassmaTestUserCreateData>(createdData: T): GassmaTestUserFindResult<T["select"], T["omit"], GO>;
  findFirst<T extends GassmaTestUserFindData>(findData: T): GassmaTestUserFindResult<T["select"], T["omit"], GO> | null;
  findFirstOrThrow<T extends GassmaTestUserFindData>(findData: T): GassmaTestUserFindResult<T["select"], T["omit"], GO>;
  findMany<T extends GassmaTestUserFindManyData>(findData: T): GassmaTestUserFindResult<T["select"], T["omit"], GO>[];
  update<T extends GassmaTestUserUpdateSingleData>(updateData: T): GassmaTestUserFindResult<T["select"], T["omit"], GO> | null;
  updateMany(updateData: GassmaTestUserUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaTestUserUpdateData): Record<string, unknown>[];
  upsert<T extends GassmaTestUserUpsertSingleData>(upsertData: T): GassmaTestUserFindResult<T["select"], T["omit"], GO>;
  upsertMany(upsertData: GassmaTestUserUpsertData): UpsertManyReturn;
  delete<T extends GassmaTestUserDeleteSingleData>(deleteData: T): GassmaTestUserFindResult<T["select"], T["omit"], GO> | null;
  deleteMany(deleteData: GassmaTestUserDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaTestUserAggregateData>(aggregateData: T): GassmaTestUserAggregateResult<T>;
  count(coutData: GassmaTestUserCountData): number;
  groupBy<T extends GassmaTestUserGroupByData>(groupByData: T): GassmaTestUserGroupByResult<T>[];
}

declare class GassmaTestProfileController<GO extends GassmaTestProfileOmit = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnNumber: number,
    endColumnNumber: number
  ): void;
  createMany(createdData: GassmaTestProfileCreateManyData): CreateManyReturn;
  createManyAndReturn(createdData: GassmaTestProfileCreateManyData): Record<string, unknown>[];
  create<T extends GassmaTestProfileCreateData>(createdData: T): GassmaTestProfileFindResult<T["select"], T["omit"], GO>;
  findFirst<T extends GassmaTestProfileFindData>(findData: T): GassmaTestProfileFindResult<T["select"], T["omit"], GO> | null;
  findFirstOrThrow<T extends GassmaTestProfileFindData>(findData: T): GassmaTestProfileFindResult<T["select"], T["omit"], GO>;
  findMany<T extends GassmaTestProfileFindManyData>(findData: T): GassmaTestProfileFindResult<T["select"], T["omit"], GO>[];
  update<T extends GassmaTestProfileUpdateSingleData>(updateData: T): GassmaTestProfileFindResult<T["select"], T["omit"], GO> | null;
  updateMany(updateData: GassmaTestProfileUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaTestProfileUpdateData): Record<string, unknown>[];
  upsert<T extends GassmaTestProfileUpsertSingleData>(upsertData: T): GassmaTestProfileFindResult<T["select"], T["omit"], GO>;
  upsertMany(upsertData: GassmaTestProfileUpsertData): UpsertManyReturn;
  delete<T extends GassmaTestProfileDeleteSingleData>(deleteData: T): GassmaTestProfileFindResult<T["select"], T["omit"], GO> | null;
  deleteMany(deleteData: GassmaTestProfileDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaTestProfileAggregateData>(aggregateData: T): GassmaTestProfileAggregateResult<T>;
  count(coutData: GassmaTestProfileCountData): number;
  groupBy<T extends GassmaTestProfileGroupByData>(groupByData: T): GassmaTestProfileGroupByResult<T>[];
}

declare class GassmaTestPostController<GO extends GassmaTestPostOmit = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnNumber: number,
    endColumnNumber: number
  ): void;
  createMany(createdData: GassmaTestPostCreateManyData): CreateManyReturn;
  createManyAndReturn(createdData: GassmaTestPostCreateManyData): Record<string, unknown>[];
  create<T extends GassmaTestPostCreateData>(createdData: T): GassmaTestPostFindResult<T["select"], T["omit"], GO>;
  findFirst<T extends GassmaTestPostFindData>(findData: T): GassmaTestPostFindResult<T["select"], T["omit"], GO> | null;
  findFirstOrThrow<T extends GassmaTestPostFindData>(findData: T): GassmaTestPostFindResult<T["select"], T["omit"], GO>;
  findMany<T extends GassmaTestPostFindManyData>(findData: T): GassmaTestPostFindResult<T["select"], T["omit"], GO>[];
  update<T extends GassmaTestPostUpdateSingleData>(updateData: T): GassmaTestPostFindResult<T["select"], T["omit"], GO> | null;
  updateMany(updateData: GassmaTestPostUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaTestPostUpdateData): Record<string, unknown>[];
  upsert<T extends GassmaTestPostUpsertSingleData>(upsertData: T): GassmaTestPostFindResult<T["select"], T["omit"], GO>;
  upsertMany(upsertData: GassmaTestPostUpsertData): UpsertManyReturn;
  delete<T extends GassmaTestPostDeleteSingleData>(deleteData: T): GassmaTestPostFindResult<T["select"], T["omit"], GO> | null;
  deleteMany(deleteData: GassmaTestPostDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaTestPostAggregateData>(aggregateData: T): GassmaTestPostAggregateResult<T>;
  count(coutData: GassmaTestPostCountData): number;
  groupBy<T extends GassmaTestPostGroupByData>(groupByData: T): GassmaTestPostGroupByResult<T>[];
}

declare class GassmaTestCommentController<GO extends GassmaTestCommentOmit = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnNumber: number,
    endColumnNumber: number
  ): void;
  createMany(createdData: GassmaTestCommentCreateManyData): CreateManyReturn;
  createManyAndReturn(createdData: GassmaTestCommentCreateManyData): Record<string, unknown>[];
  create<T extends GassmaTestCommentCreateData>(createdData: T): GassmaTestCommentFindResult<T["select"], T["omit"], GO>;
  findFirst<T extends GassmaTestCommentFindData>(findData: T): GassmaTestCommentFindResult<T["select"], T["omit"], GO> | null;
  findFirstOrThrow<T extends GassmaTestCommentFindData>(findData: T): GassmaTestCommentFindResult<T["select"], T["omit"], GO>;
  findMany<T extends GassmaTestCommentFindManyData>(findData: T): GassmaTestCommentFindResult<T["select"], T["omit"], GO>[];
  update<T extends GassmaTestCommentUpdateSingleData>(updateData: T): GassmaTestCommentFindResult<T["select"], T["omit"], GO> | null;
  updateMany(updateData: GassmaTestCommentUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaTestCommentUpdateData): Record<string, unknown>[];
  upsert<T extends GassmaTestCommentUpsertSingleData>(upsertData: T): GassmaTestCommentFindResult<T["select"], T["omit"], GO>;
  upsertMany(upsertData: GassmaTestCommentUpsertData): UpsertManyReturn;
  delete<T extends GassmaTestCommentDeleteSingleData>(deleteData: T): GassmaTestCommentFindResult<T["select"], T["omit"], GO> | null;
  deleteMany(deleteData: GassmaTestCommentDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaTestCommentAggregateData>(aggregateData: T): GassmaTestCommentAggregateResult<T>;
  count(coutData: GassmaTestCommentCountData): number;
  groupBy<T extends GassmaTestCommentGroupByData>(groupByData: T): GassmaTestCommentGroupByResult<T>[];
}

declare class GassmaTestCategoryController<GO extends GassmaTestCategoryOmit = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnNumber: number,
    endColumnNumber: number
  ): void;
  createMany(createdData: GassmaTestCategoryCreateManyData): CreateManyReturn;
  createManyAndReturn(createdData: GassmaTestCategoryCreateManyData): Record<string, unknown>[];
  create<T extends GassmaTestCategoryCreateData>(createdData: T): GassmaTestCategoryFindResult<T["select"], T["omit"], GO>;
  findFirst<T extends GassmaTestCategoryFindData>(findData: T): GassmaTestCategoryFindResult<T["select"], T["omit"], GO> | null;
  findFirstOrThrow<T extends GassmaTestCategoryFindData>(findData: T): GassmaTestCategoryFindResult<T["select"], T["omit"], GO>;
  findMany<T extends GassmaTestCategoryFindManyData>(findData: T): GassmaTestCategoryFindResult<T["select"], T["omit"], GO>[];
  update<T extends GassmaTestCategoryUpdateSingleData>(updateData: T): GassmaTestCategoryFindResult<T["select"], T["omit"], GO> | null;
  updateMany(updateData: GassmaTestCategoryUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaTestCategoryUpdateData): Record<string, unknown>[];
  upsert<T extends GassmaTestCategoryUpsertSingleData>(upsertData: T): GassmaTestCategoryFindResult<T["select"], T["omit"], GO>;
  upsertMany(upsertData: GassmaTestCategoryUpsertData): UpsertManyReturn;
  delete<T extends GassmaTestCategoryDeleteSingleData>(deleteData: T): GassmaTestCategoryFindResult<T["select"], T["omit"], GO> | null;
  deleteMany(deleteData: GassmaTestCategoryDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaTestCategoryAggregateData>(aggregateData: T): GassmaTestCategoryAggregateResult<T>;
  count(coutData: GassmaTestCategoryCountData): number;
  groupBy<T extends GassmaTestCategoryGroupByData>(groupByData: T): GassmaTestCategoryGroupByResult<T>[];
}

declare class GassmaTestTagController<GO extends GassmaTestTagOmit = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnNumber: number,
    endColumnNumber: number
  ): void;
  createMany(createdData: GassmaTestTagCreateManyData): CreateManyReturn;
  createManyAndReturn(createdData: GassmaTestTagCreateManyData): Record<string, unknown>[];
  create<T extends GassmaTestTagCreateData>(createdData: T): GassmaTestTagFindResult<T["select"], T["omit"], GO>;
  findFirst<T extends GassmaTestTagFindData>(findData: T): GassmaTestTagFindResult<T["select"], T["omit"], GO> | null;
  findFirstOrThrow<T extends GassmaTestTagFindData>(findData: T): GassmaTestTagFindResult<T["select"], T["omit"], GO>;
  findMany<T extends GassmaTestTagFindManyData>(findData: T): GassmaTestTagFindResult<T["select"], T["omit"], GO>[];
  update<T extends GassmaTestTagUpdateSingleData>(updateData: T): GassmaTestTagFindResult<T["select"], T["omit"], GO> | null;
  updateMany(updateData: GassmaTestTagUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaTestTagUpdateData): Record<string, unknown>[];
  upsert<T extends GassmaTestTagUpsertSingleData>(upsertData: T): GassmaTestTagFindResult<T["select"], T["omit"], GO>;
  upsertMany(upsertData: GassmaTestTagUpsertData): UpsertManyReturn;
  delete<T extends GassmaTestTagDeleteSingleData>(deleteData: T): GassmaTestTagFindResult<T["select"], T["omit"], GO> | null;
  deleteMany(deleteData: GassmaTestTagDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaTestTagAggregateData>(aggregateData: T): GassmaTestTagAggregateResult<T>;
  count(coutData: GassmaTestTagCountData): number;
  groupBy<T extends GassmaTestTagGroupByData>(groupByData: T): GassmaTestTagGroupByResult<T>[];
}

declare class GassmaTestProductController<GO extends GassmaTestProductOmit = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnNumber: number,
    endColumnNumber: number
  ): void;
  createMany(createdData: GassmaTestProductCreateManyData): CreateManyReturn;
  createManyAndReturn(createdData: GassmaTestProductCreateManyData): Record<string, unknown>[];
  create<T extends GassmaTestProductCreateData>(createdData: T): GassmaTestProductFindResult<T["select"], T["omit"], GO>;
  findFirst<T extends GassmaTestProductFindData>(findData: T): GassmaTestProductFindResult<T["select"], T["omit"], GO> | null;
  findFirstOrThrow<T extends GassmaTestProductFindData>(findData: T): GassmaTestProductFindResult<T["select"], T["omit"], GO>;
  findMany<T extends GassmaTestProductFindManyData>(findData: T): GassmaTestProductFindResult<T["select"], T["omit"], GO>[];
  update<T extends GassmaTestProductUpdateSingleData>(updateData: T): GassmaTestProductFindResult<T["select"], T["omit"], GO> | null;
  updateMany(updateData: GassmaTestProductUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaTestProductUpdateData): Record<string, unknown>[];
  upsert<T extends GassmaTestProductUpsertSingleData>(upsertData: T): GassmaTestProductFindResult<T["select"], T["omit"], GO>;
  upsertMany(upsertData: GassmaTestProductUpsertData): UpsertManyReturn;
  delete<T extends GassmaTestProductDeleteSingleData>(deleteData: T): GassmaTestProductFindResult<T["select"], T["omit"], GO> | null;
  deleteMany(deleteData: GassmaTestProductDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaTestProductAggregateData>(aggregateData: T): GassmaTestProductAggregateResult<T>;
  count(coutData: GassmaTestProductCountData): number;
  groupBy<T extends GassmaTestProductGroupByData>(groupByData: T): GassmaTestProductGroupByResult<T>[];
}

declare class GassmaTestOrderController<GO extends GassmaTestOrderOmit = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnNumber: number,
    endColumnNumber: number
  ): void;
  createMany(createdData: GassmaTestOrderCreateManyData): CreateManyReturn;
  createManyAndReturn(createdData: GassmaTestOrderCreateManyData): Record<string, unknown>[];
  create<T extends GassmaTestOrderCreateData>(createdData: T): GassmaTestOrderFindResult<T["select"], T["omit"], GO>;
  findFirst<T extends GassmaTestOrderFindData>(findData: T): GassmaTestOrderFindResult<T["select"], T["omit"], GO> | null;
  findFirstOrThrow<T extends GassmaTestOrderFindData>(findData: T): GassmaTestOrderFindResult<T["select"], T["omit"], GO>;
  findMany<T extends GassmaTestOrderFindManyData>(findData: T): GassmaTestOrderFindResult<T["select"], T["omit"], GO>[];
  update<T extends GassmaTestOrderUpdateSingleData>(updateData: T): GassmaTestOrderFindResult<T["select"], T["omit"], GO> | null;
  updateMany(updateData: GassmaTestOrderUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaTestOrderUpdateData): Record<string, unknown>[];
  upsert<T extends GassmaTestOrderUpsertSingleData>(upsertData: T): GassmaTestOrderFindResult<T["select"], T["omit"], GO>;
  upsertMany(upsertData: GassmaTestOrderUpsertData): UpsertManyReturn;
  delete<T extends GassmaTestOrderDeleteSingleData>(deleteData: T): GassmaTestOrderFindResult<T["select"], T["omit"], GO> | null;
  deleteMany(deleteData: GassmaTestOrderDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaTestOrderAggregateData>(aggregateData: T): GassmaTestOrderAggregateResult<T>;
  count(coutData: GassmaTestOrderCountData): number;
  groupBy<T extends GassmaTestOrderGroupByData>(groupByData: T): GassmaTestOrderGroupByResult<T>[];
}

declare class GassmaTestOrderItemController<GO extends GassmaTestOrderItemOmit = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnNumber: number,
    endColumnNumber: number
  ): void;
  createMany(createdData: GassmaTestOrderItemCreateManyData): CreateManyReturn;
  createManyAndReturn(createdData: GassmaTestOrderItemCreateManyData): Record<string, unknown>[];
  create<T extends GassmaTestOrderItemCreateData>(createdData: T): GassmaTestOrderItemFindResult<T["select"], T["omit"], GO>;
  findFirst<T extends GassmaTestOrderItemFindData>(findData: T): GassmaTestOrderItemFindResult<T["select"], T["omit"], GO> | null;
  findFirstOrThrow<T extends GassmaTestOrderItemFindData>(findData: T): GassmaTestOrderItemFindResult<T["select"], T["omit"], GO>;
  findMany<T extends GassmaTestOrderItemFindManyData>(findData: T): GassmaTestOrderItemFindResult<T["select"], T["omit"], GO>[];
  update<T extends GassmaTestOrderItemUpdateSingleData>(updateData: T): GassmaTestOrderItemFindResult<T["select"], T["omit"], GO> | null;
  updateMany(updateData: GassmaTestOrderItemUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaTestOrderItemUpdateData): Record<string, unknown>[];
  upsert<T extends GassmaTestOrderItemUpsertSingleData>(upsertData: T): GassmaTestOrderItemFindResult<T["select"], T["omit"], GO>;
  upsertMany(upsertData: GassmaTestOrderItemUpsertData): UpsertManyReturn;
  delete<T extends GassmaTestOrderItemDeleteSingleData>(deleteData: T): GassmaTestOrderItemFindResult<T["select"], T["omit"], GO> | null;
  deleteMany(deleteData: GassmaTestOrderItemDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaTestOrderItemAggregateData>(aggregateData: T): GassmaTestOrderItemAggregateResult<T>;
  count(coutData: GassmaTestOrderItemCountData): number;
  groupBy<T extends GassmaTestOrderItemGroupByData>(groupByData: T): GassmaTestOrderItemGroupByResult<T>[];
}

declare type ManyReturn = {
  count: number;
};

declare type CreateManyReturn = ManyReturn;
declare type UpdateManyReturn = ManyReturn;
declare type DeleteManyReturn = ManyReturn;
declare type UpsertManyReturn = ManyReturn;

declare type GassmaTestUserUse = {
  "id": number;
  "email": string;
  "name": string;
  "age"?: number;
  "isActive": boolean;
  "role": string | "admin" | "user" | "moderator";
  "createdAt": Date;
};

declare type GassmaTestProfileUse = {
  "id": number;
  "bio"?: string;
  "website"?: string;
  "userId": number;
};

declare type GassmaTestPostUse = {
  "id": number;
  "title": string;
  "content"?: string | number;
  "published": boolean;
  "viewCount": number;
  "rating"?: number | boolean;
  "authorId": number;
  "categoryId"?: number;
  "createdAt": Date;
};

declare type GassmaTestCommentUse = {
  "id": number;
  "text": string;
  "authorId": number;
  "postId": number;
  "createdAt": Date;
};

declare type GassmaTestCategoryUse = {
  "id": number;
  "name": string;
  "parentId"?: number;
};

declare type GassmaTestTagUse = {
  "id": number;
  "name": string;
};

declare type GassmaTestProductUse = {
  "id": number;
  "name": string;
  "price": number;
  "stock": number;
  "status": string | "available" | "soldout" | "discontinued";
  "createdAt": Date;
};

declare type GassmaTestOrderUse = {
  "id": number;
  "userId": number;
  "totalAmount": number;
  "quantity": number;
  "status": string | "pending" | "shipped" | "delivered" | "cancelled";
  "createdAt": Date;
};

declare type GassmaTestOrderItemUse = {
  "id": number;
  "orderId": number;
  "productId": number;
  "quantity": number;
  "unitPrice": number;
};

declare type GassmaTestUserCreateData = {
  data: GassmaTestUserUse & {
    "profile"?: Gassma.NestedWriteOperation;
    "posts"?: Gassma.NestedWriteOperation;
    "comments"?: Gassma.NestedWriteOperation;
    "orders"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestUserSelect;
  omit?: GassmaTestUserOmit;
};

declare type GassmaTestProfileCreateData = {
  data: GassmaTestProfileUse & {
    "user"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestProfileSelect;
  omit?: GassmaTestProfileOmit;
};

declare type GassmaTestPostCreateData = {
  data: GassmaTestPostUse & {
    "author"?: Gassma.NestedWriteOperation;
    "category"?: Gassma.NestedWriteOperation;
    "comments"?: Gassma.NestedWriteOperation;
    "tags"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestPostSelect;
  omit?: GassmaTestPostOmit;
};

declare type GassmaTestCommentCreateData = {
  data: GassmaTestCommentUse & {
    "author"?: Gassma.NestedWriteOperation;
    "post"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestCommentSelect;
  omit?: GassmaTestCommentOmit;
};

declare type GassmaTestCategoryCreateData = {
  data: GassmaTestCategoryUse & {
    "posts"?: Gassma.NestedWriteOperation;
    "parent"?: Gassma.NestedWriteOperation;
    "children"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestCategorySelect;
  omit?: GassmaTestCategoryOmit;
};

declare type GassmaTestTagCreateData = {
  data: GassmaTestTagUse & {
    "posts"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestTagSelect;
  omit?: GassmaTestTagOmit;
};

declare type GassmaTestProductCreateData = {
  data: GassmaTestProductUse & {
    "orderItems"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestProductSelect;
  omit?: GassmaTestProductOmit;
};

declare type GassmaTestOrderCreateData = {
  data: GassmaTestOrderUse & {
    "user"?: Gassma.NestedWriteOperation;
    "items"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestOrderSelect;
  omit?: GassmaTestOrderOmit;
};

declare type GassmaTestOrderItemCreateData = {
  data: GassmaTestOrderItemUse & {
    "order"?: Gassma.NestedWriteOperation;
    "product"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestOrderItemSelect;
  omit?: GassmaTestOrderItemOmit;
};

declare type GassmaTestUserCreateManyData = {
  data: GassmaTestUserUse[];
};

declare type GassmaTestProfileCreateManyData = {
  data: GassmaTestProfileUse[];
};

declare type GassmaTestPostCreateManyData = {
  data: GassmaTestPostUse[];
};

declare type GassmaTestCommentCreateManyData = {
  data: GassmaTestCommentUse[];
};

declare type GassmaTestCategoryCreateManyData = {
  data: GassmaTestCategoryUse[];
};

declare type GassmaTestTagCreateManyData = {
  data: GassmaTestTagUse[];
};

declare type GassmaTestProductCreateManyData = {
  data: GassmaTestProductUse[];
};

declare type GassmaTestOrderCreateManyData = {
  data: GassmaTestOrderUse[];
};

declare type GassmaTestOrderItemCreateManyData = {
  data: GassmaTestOrderItemUse[];
};

declare type GassmaTestUseridFilterConditions = {
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

declare type GassmaTestUseremailFilterConditions = {
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

declare type GassmaTestUsernameFilterConditions = {
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

declare type GassmaTestUserageFilterConditions = {
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

declare type GassmaTestUserisActiveFilterConditions = {
  equals?: boolean | Gassma.FieldRef;
  not?: boolean;
  in?: boolean[];
  notIn?: boolean[];
  lt?: boolean | Gassma.FieldRef;
  lte?: boolean | Gassma.FieldRef;
  gt?: boolean | Gassma.FieldRef;
  gte?: boolean | Gassma.FieldRef;
  contains?: string | Gassma.FieldRef;
  startsWith?: string | Gassma.FieldRef;
  endsWith?: string | Gassma.FieldRef;
  mode?: "default" | "insensitive";
};

declare type GassmaTestUserroleFilterConditions = {
  equals?: string | "admin" | "user" | "moderator" | Gassma.FieldRef;
  not?: string | "admin" | "user" | "moderator";
  in?: (string | "admin" | "user" | "moderator")[];
  notIn?: (string | "admin" | "user" | "moderator")[];
  lt?: string | "admin" | "user" | "moderator" | Gassma.FieldRef;
  lte?: string | "admin" | "user" | "moderator" | Gassma.FieldRef;
  gt?: string | "admin" | "user" | "moderator" | Gassma.FieldRef;
  gte?: string | "admin" | "user" | "moderator" | Gassma.FieldRef;
  contains?: string | Gassma.FieldRef;
  startsWith?: string | Gassma.FieldRef;
  endsWith?: string | Gassma.FieldRef;
  mode?: "default" | "insensitive";
};

declare type GassmaTestUsercreatedAtFilterConditions = {
  equals?: Date | Gassma.FieldRef;
  not?: Date;
  in?: Date[];
  notIn?: Date[];
  lt?: Date | Gassma.FieldRef;
  lte?: Date | Gassma.FieldRef;
  gt?: Date | Gassma.FieldRef;
  gte?: Date | Gassma.FieldRef;
  contains?: string | Gassma.FieldRef;
  startsWith?: string | Gassma.FieldRef;
  endsWith?: string | Gassma.FieldRef;
  mode?: "default" | "insensitive";
};

declare type GassmaTestProfileidFilterConditions = {
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

declare type GassmaTestProfilebioFilterConditions = {
  equals?: string | null | Gassma.FieldRef;
  not?: string | null;
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

declare type GassmaTestProfilewebsiteFilterConditions = {
  equals?: string | null | Gassma.FieldRef;
  not?: string | null;
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

declare type GassmaTestProfileuserIdFilterConditions = {
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

declare type GassmaTestPostidFilterConditions = {
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

declare type GassmaTestPosttitleFilterConditions = {
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

declare type GassmaTestPostcontentFilterConditions = {
  equals?: string | number | null | Gassma.FieldRef;
  not?: string | number | null;
  in?: (string | number)[];
  notIn?: (string | number)[];
  lt?: string | number | Gassma.FieldRef;
  lte?: string | number | Gassma.FieldRef;
  gt?: string | number | Gassma.FieldRef;
  gte?: string | number | Gassma.FieldRef;
  contains?: string | Gassma.FieldRef;
  startsWith?: string | Gassma.FieldRef;
  endsWith?: string | Gassma.FieldRef;
  mode?: "default" | "insensitive";
};

declare type GassmaTestPostpublishedFilterConditions = {
  equals?: boolean | Gassma.FieldRef;
  not?: boolean;
  in?: boolean[];
  notIn?: boolean[];
  lt?: boolean | Gassma.FieldRef;
  lte?: boolean | Gassma.FieldRef;
  gt?: boolean | Gassma.FieldRef;
  gte?: boolean | Gassma.FieldRef;
  contains?: string | Gassma.FieldRef;
  startsWith?: string | Gassma.FieldRef;
  endsWith?: string | Gassma.FieldRef;
  mode?: "default" | "insensitive";
};

declare type GassmaTestPostviewCountFilterConditions = {
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

declare type GassmaTestPostratingFilterConditions = {
  equals?: number | boolean | null | Gassma.FieldRef;
  not?: number | boolean | null;
  in?: (number | boolean)[];
  notIn?: (number | boolean)[];
  lt?: number | boolean | Gassma.FieldRef;
  lte?: number | boolean | Gassma.FieldRef;
  gt?: number | boolean | Gassma.FieldRef;
  gte?: number | boolean | Gassma.FieldRef;
  contains?: string | Gassma.FieldRef;
  startsWith?: string | Gassma.FieldRef;
  endsWith?: string | Gassma.FieldRef;
  mode?: "default" | "insensitive";
};

declare type GassmaTestPostauthorIdFilterConditions = {
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

declare type GassmaTestPostcategoryIdFilterConditions = {
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

declare type GassmaTestPostcreatedAtFilterConditions = {
  equals?: Date | Gassma.FieldRef;
  not?: Date;
  in?: Date[];
  notIn?: Date[];
  lt?: Date | Gassma.FieldRef;
  lte?: Date | Gassma.FieldRef;
  gt?: Date | Gassma.FieldRef;
  gte?: Date | Gassma.FieldRef;
  contains?: string | Gassma.FieldRef;
  startsWith?: string | Gassma.FieldRef;
  endsWith?: string | Gassma.FieldRef;
  mode?: "default" | "insensitive";
};

declare type GassmaTestCommentidFilterConditions = {
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

declare type GassmaTestCommenttextFilterConditions = {
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

declare type GassmaTestCommentauthorIdFilterConditions = {
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

declare type GassmaTestCommentpostIdFilterConditions = {
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

declare type GassmaTestCommentcreatedAtFilterConditions = {
  equals?: Date | Gassma.FieldRef;
  not?: Date;
  in?: Date[];
  notIn?: Date[];
  lt?: Date | Gassma.FieldRef;
  lte?: Date | Gassma.FieldRef;
  gt?: Date | Gassma.FieldRef;
  gte?: Date | Gassma.FieldRef;
  contains?: string | Gassma.FieldRef;
  startsWith?: string | Gassma.FieldRef;
  endsWith?: string | Gassma.FieldRef;
  mode?: "default" | "insensitive";
};

declare type GassmaTestCategoryidFilterConditions = {
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

declare type GassmaTestCategorynameFilterConditions = {
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

declare type GassmaTestCategoryparentIdFilterConditions = {
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

declare type GassmaTestTagidFilterConditions = {
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

declare type GassmaTestTagnameFilterConditions = {
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

declare type GassmaTestProductidFilterConditions = {
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

declare type GassmaTestProductnameFilterConditions = {
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

declare type GassmaTestProductpriceFilterConditions = {
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

declare type GassmaTestProductstockFilterConditions = {
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

declare type GassmaTestProductstatusFilterConditions = {
  equals?: string | "available" | "soldout" | "discontinued" | Gassma.FieldRef;
  not?: string | "available" | "soldout" | "discontinued";
  in?: (string | "available" | "soldout" | "discontinued")[];
  notIn?: (string | "available" | "soldout" | "discontinued")[];
  lt?: string | "available" | "soldout" | "discontinued" | Gassma.FieldRef;
  lte?: string | "available" | "soldout" | "discontinued" | Gassma.FieldRef;
  gt?: string | "available" | "soldout" | "discontinued" | Gassma.FieldRef;
  gte?: string | "available" | "soldout" | "discontinued" | Gassma.FieldRef;
  contains?: string | Gassma.FieldRef;
  startsWith?: string | Gassma.FieldRef;
  endsWith?: string | Gassma.FieldRef;
  mode?: "default" | "insensitive";
};

declare type GassmaTestProductcreatedAtFilterConditions = {
  equals?: Date | Gassma.FieldRef;
  not?: Date;
  in?: Date[];
  notIn?: Date[];
  lt?: Date | Gassma.FieldRef;
  lte?: Date | Gassma.FieldRef;
  gt?: Date | Gassma.FieldRef;
  gte?: Date | Gassma.FieldRef;
  contains?: string | Gassma.FieldRef;
  startsWith?: string | Gassma.FieldRef;
  endsWith?: string | Gassma.FieldRef;
  mode?: "default" | "insensitive";
};

declare type GassmaTestOrderidFilterConditions = {
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

declare type GassmaTestOrderuserIdFilterConditions = {
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

declare type GassmaTestOrdertotalAmountFilterConditions = {
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

declare type GassmaTestOrderquantityFilterConditions = {
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

declare type GassmaTestOrderstatusFilterConditions = {
  equals?: string | "pending" | "shipped" | "delivered" | "cancelled" | Gassma.FieldRef;
  not?: string | "pending" | "shipped" | "delivered" | "cancelled";
  in?: (string | "pending" | "shipped" | "delivered" | "cancelled")[];
  notIn?: (string | "pending" | "shipped" | "delivered" | "cancelled")[];
  lt?: string | "pending" | "shipped" | "delivered" | "cancelled" | Gassma.FieldRef;
  lte?: string | "pending" | "shipped" | "delivered" | "cancelled" | Gassma.FieldRef;
  gt?: string | "pending" | "shipped" | "delivered" | "cancelled" | Gassma.FieldRef;
  gte?: string | "pending" | "shipped" | "delivered" | "cancelled" | Gassma.FieldRef;
  contains?: string | Gassma.FieldRef;
  startsWith?: string | Gassma.FieldRef;
  endsWith?: string | Gassma.FieldRef;
  mode?: "default" | "insensitive";
};

declare type GassmaTestOrdercreatedAtFilterConditions = {
  equals?: Date | Gassma.FieldRef;
  not?: Date;
  in?: Date[];
  notIn?: Date[];
  lt?: Date | Gassma.FieldRef;
  lte?: Date | Gassma.FieldRef;
  gt?: Date | Gassma.FieldRef;
  gte?: Date | Gassma.FieldRef;
  contains?: string | Gassma.FieldRef;
  startsWith?: string | Gassma.FieldRef;
  endsWith?: string | Gassma.FieldRef;
  mode?: "default" | "insensitive";
};

declare type GassmaTestOrderItemidFilterConditions = {
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

declare type GassmaTestOrderItemorderIdFilterConditions = {
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

declare type GassmaTestOrderItemproductIdFilterConditions = {
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

declare type GassmaTestOrderItemquantityFilterConditions = {
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

declare type GassmaTestOrderItemunitPriceFilterConditions = {
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

declare type GassmaTestUserWhereUse = {
  "id"?: number | GassmaTestUseridFilterConditions;
  "email"?: string | GassmaTestUseremailFilterConditions;
  "name"?: string | GassmaTestUsernameFilterConditions;
  "age"?: number | null | GassmaTestUserageFilterConditions;
  "isActive"?: boolean | GassmaTestUserisActiveFilterConditions;
  "role"?: string | "admin" | "user" | "moderator" | GassmaTestUserroleFilterConditions;
  "createdAt"?: Date | GassmaTestUsercreatedAtFilterConditions;
  "profile"?: Gassma.RelationSingleFilter;
  "posts"?: Gassma.RelationListFilter;
  "comments"?: Gassma.RelationListFilter;
  "orders"?: Gassma.RelationListFilter;

  AND?: GassmaTestUserWhereUse[] | GassmaTestUserWhereUse;
  OR?: GassmaTestUserWhereUse[];
  NOT?: GassmaTestUserWhereUse[] | GassmaTestUserWhereUse;
};

declare type GassmaTestProfileWhereUse = {
  "id"?: number | GassmaTestProfileidFilterConditions;
  "bio"?: string | null | GassmaTestProfilebioFilterConditions;
  "website"?: string | null | GassmaTestProfilewebsiteFilterConditions;
  "userId"?: number | GassmaTestProfileuserIdFilterConditions;
  "user"?: Gassma.RelationSingleFilter;

  AND?: GassmaTestProfileWhereUse[] | GassmaTestProfileWhereUse;
  OR?: GassmaTestProfileWhereUse[];
  NOT?: GassmaTestProfileWhereUse[] | GassmaTestProfileWhereUse;
};

declare type GassmaTestPostWhereUse = {
  "id"?: number | GassmaTestPostidFilterConditions;
  "title"?: string | GassmaTestPosttitleFilterConditions;
  "content"?: string | number | null | GassmaTestPostcontentFilterConditions;
  "published"?: boolean | GassmaTestPostpublishedFilterConditions;
  "viewCount"?: number | GassmaTestPostviewCountFilterConditions;
  "rating"?: number | boolean | null | GassmaTestPostratingFilterConditions;
  "authorId"?: number | GassmaTestPostauthorIdFilterConditions;
  "categoryId"?: number | null | GassmaTestPostcategoryIdFilterConditions;
  "createdAt"?: Date | GassmaTestPostcreatedAtFilterConditions;
  "author"?: Gassma.RelationSingleFilter;
  "category"?: Gassma.RelationSingleFilter;
  "comments"?: Gassma.RelationListFilter;
  "tags"?: Gassma.RelationListFilter;

  AND?: GassmaTestPostWhereUse[] | GassmaTestPostWhereUse;
  OR?: GassmaTestPostWhereUse[];
  NOT?: GassmaTestPostWhereUse[] | GassmaTestPostWhereUse;
};

declare type GassmaTestCommentWhereUse = {
  "id"?: number | GassmaTestCommentidFilterConditions;
  "text"?: string | GassmaTestCommenttextFilterConditions;
  "authorId"?: number | GassmaTestCommentauthorIdFilterConditions;
  "postId"?: number | GassmaTestCommentpostIdFilterConditions;
  "createdAt"?: Date | GassmaTestCommentcreatedAtFilterConditions;
  "author"?: Gassma.RelationSingleFilter;
  "post"?: Gassma.RelationSingleFilter;

  AND?: GassmaTestCommentWhereUse[] | GassmaTestCommentWhereUse;
  OR?: GassmaTestCommentWhereUse[];
  NOT?: GassmaTestCommentWhereUse[] | GassmaTestCommentWhereUse;
};

declare type GassmaTestCategoryWhereUse = {
  "id"?: number | GassmaTestCategoryidFilterConditions;
  "name"?: string | GassmaTestCategorynameFilterConditions;
  "parentId"?: number | null | GassmaTestCategoryparentIdFilterConditions;
  "posts"?: Gassma.RelationListFilter;
  "parent"?: Gassma.RelationSingleFilter;
  "children"?: Gassma.RelationListFilter;

  AND?: GassmaTestCategoryWhereUse[] | GassmaTestCategoryWhereUse;
  OR?: GassmaTestCategoryWhereUse[];
  NOT?: GassmaTestCategoryWhereUse[] | GassmaTestCategoryWhereUse;
};

declare type GassmaTestTagWhereUse = {
  "id"?: number | GassmaTestTagidFilterConditions;
  "name"?: string | GassmaTestTagnameFilterConditions;
  "posts"?: Gassma.RelationListFilter;

  AND?: GassmaTestTagWhereUse[] | GassmaTestTagWhereUse;
  OR?: GassmaTestTagWhereUse[];
  NOT?: GassmaTestTagWhereUse[] | GassmaTestTagWhereUse;
};

declare type GassmaTestProductWhereUse = {
  "id"?: number | GassmaTestProductidFilterConditions;
  "name"?: string | GassmaTestProductnameFilterConditions;
  "price"?: number | GassmaTestProductpriceFilterConditions;
  "stock"?: number | GassmaTestProductstockFilterConditions;
  "status"?: string | "available" | "soldout" | "discontinued" | GassmaTestProductstatusFilterConditions;
  "createdAt"?: Date | GassmaTestProductcreatedAtFilterConditions;
  "orderItems"?: Gassma.RelationListFilter;

  AND?: GassmaTestProductWhereUse[] | GassmaTestProductWhereUse;
  OR?: GassmaTestProductWhereUse[];
  NOT?: GassmaTestProductWhereUse[] | GassmaTestProductWhereUse;
};

declare type GassmaTestOrderWhereUse = {
  "id"?: number | GassmaTestOrderidFilterConditions;
  "userId"?: number | GassmaTestOrderuserIdFilterConditions;
  "totalAmount"?: number | GassmaTestOrdertotalAmountFilterConditions;
  "quantity"?: number | GassmaTestOrderquantityFilterConditions;
  "status"?: string | "pending" | "shipped" | "delivered" | "cancelled" | GassmaTestOrderstatusFilterConditions;
  "createdAt"?: Date | GassmaTestOrdercreatedAtFilterConditions;
  "user"?: Gassma.RelationSingleFilter;
  "items"?: Gassma.RelationListFilter;

  AND?: GassmaTestOrderWhereUse[] | GassmaTestOrderWhereUse;
  OR?: GassmaTestOrderWhereUse[];
  NOT?: GassmaTestOrderWhereUse[] | GassmaTestOrderWhereUse;
};

declare type GassmaTestOrderItemWhereUse = {
  "id"?: number | GassmaTestOrderItemidFilterConditions;
  "orderId"?: number | GassmaTestOrderItemorderIdFilterConditions;
  "productId"?: number | GassmaTestOrderItemproductIdFilterConditions;
  "quantity"?: number | GassmaTestOrderItemquantityFilterConditions;
  "unitPrice"?: number | GassmaTestOrderItemunitPriceFilterConditions;
  "order"?: Gassma.RelationSingleFilter;
  "product"?: Gassma.RelationSingleFilter;

  AND?: GassmaTestOrderItemWhereUse[] | GassmaTestOrderItemWhereUse;
  OR?: GassmaTestOrderItemWhereUse[];
  NOT?: GassmaTestOrderItemWhereUse[] | GassmaTestOrderItemWhereUse;
};

declare type GassmaTestUseridHavingCore = {
  _avg?: GassmaTestUseridFilterConditions;
  _count?: GassmaTestUseridFilterConditions;
  _max?: GassmaTestUseridFilterConditions;
  _min?: GassmaTestUseridFilterConditions;
  _sum?: GassmaTestUseridFilterConditions;
} & GassmaTestUseridFilterConditions;

declare type GassmaTestUseremailHavingCore = {
  _avg?: GassmaTestUseremailFilterConditions;
  _count?: GassmaTestUseremailFilterConditions;
  _max?: GassmaTestUseremailFilterConditions;
  _min?: GassmaTestUseremailFilterConditions;
  _sum?: GassmaTestUseremailFilterConditions;
} & GassmaTestUseremailFilterConditions;

declare type GassmaTestUsernameHavingCore = {
  _avg?: GassmaTestUsernameFilterConditions;
  _count?: GassmaTestUsernameFilterConditions;
  _max?: GassmaTestUsernameFilterConditions;
  _min?: GassmaTestUsernameFilterConditions;
  _sum?: GassmaTestUsernameFilterConditions;
} & GassmaTestUsernameFilterConditions;

declare type GassmaTestUserageHavingCore = {
  _avg?: GassmaTestUserageFilterConditions;
  _count?: GassmaTestUserageFilterConditions;
  _max?: GassmaTestUserageFilterConditions;
  _min?: GassmaTestUserageFilterConditions;
  _sum?: GassmaTestUserageFilterConditions;
} & GassmaTestUserageFilterConditions;

declare type GassmaTestUserisActiveHavingCore = {
  _avg?: GassmaTestUserisActiveFilterConditions;
  _count?: GassmaTestUserisActiveFilterConditions;
  _max?: GassmaTestUserisActiveFilterConditions;
  _min?: GassmaTestUserisActiveFilterConditions;
  _sum?: GassmaTestUserisActiveFilterConditions;
} & GassmaTestUserisActiveFilterConditions;

declare type GassmaTestUserroleHavingCore = {
  _avg?: GassmaTestUserroleFilterConditions;
  _count?: GassmaTestUserroleFilterConditions;
  _max?: GassmaTestUserroleFilterConditions;
  _min?: GassmaTestUserroleFilterConditions;
  _sum?: GassmaTestUserroleFilterConditions;
} & GassmaTestUserroleFilterConditions;

declare type GassmaTestUsercreatedAtHavingCore = {
  _avg?: GassmaTestUsercreatedAtFilterConditions;
  _count?: GassmaTestUsercreatedAtFilterConditions;
  _max?: GassmaTestUsercreatedAtFilterConditions;
  _min?: GassmaTestUsercreatedAtFilterConditions;
  _sum?: GassmaTestUsercreatedAtFilterConditions;
} & GassmaTestUsercreatedAtFilterConditions;

declare type GassmaTestProfileidHavingCore = {
  _avg?: GassmaTestProfileidFilterConditions;
  _count?: GassmaTestProfileidFilterConditions;
  _max?: GassmaTestProfileidFilterConditions;
  _min?: GassmaTestProfileidFilterConditions;
  _sum?: GassmaTestProfileidFilterConditions;
} & GassmaTestProfileidFilterConditions;

declare type GassmaTestProfilebioHavingCore = {
  _avg?: GassmaTestProfilebioFilterConditions;
  _count?: GassmaTestProfilebioFilterConditions;
  _max?: GassmaTestProfilebioFilterConditions;
  _min?: GassmaTestProfilebioFilterConditions;
  _sum?: GassmaTestProfilebioFilterConditions;
} & GassmaTestProfilebioFilterConditions;

declare type GassmaTestProfilewebsiteHavingCore = {
  _avg?: GassmaTestProfilewebsiteFilterConditions;
  _count?: GassmaTestProfilewebsiteFilterConditions;
  _max?: GassmaTestProfilewebsiteFilterConditions;
  _min?: GassmaTestProfilewebsiteFilterConditions;
  _sum?: GassmaTestProfilewebsiteFilterConditions;
} & GassmaTestProfilewebsiteFilterConditions;

declare type GassmaTestProfileuserIdHavingCore = {
  _avg?: GassmaTestProfileuserIdFilterConditions;
  _count?: GassmaTestProfileuserIdFilterConditions;
  _max?: GassmaTestProfileuserIdFilterConditions;
  _min?: GassmaTestProfileuserIdFilterConditions;
  _sum?: GassmaTestProfileuserIdFilterConditions;
} & GassmaTestProfileuserIdFilterConditions;

declare type GassmaTestPostidHavingCore = {
  _avg?: GassmaTestPostidFilterConditions;
  _count?: GassmaTestPostidFilterConditions;
  _max?: GassmaTestPostidFilterConditions;
  _min?: GassmaTestPostidFilterConditions;
  _sum?: GassmaTestPostidFilterConditions;
} & GassmaTestPostidFilterConditions;

declare type GassmaTestPosttitleHavingCore = {
  _avg?: GassmaTestPosttitleFilterConditions;
  _count?: GassmaTestPosttitleFilterConditions;
  _max?: GassmaTestPosttitleFilterConditions;
  _min?: GassmaTestPosttitleFilterConditions;
  _sum?: GassmaTestPosttitleFilterConditions;
} & GassmaTestPosttitleFilterConditions;

declare type GassmaTestPostcontentHavingCore = {
  _avg?: GassmaTestPostcontentFilterConditions;
  _count?: GassmaTestPostcontentFilterConditions;
  _max?: GassmaTestPostcontentFilterConditions;
  _min?: GassmaTestPostcontentFilterConditions;
  _sum?: GassmaTestPostcontentFilterConditions;
} & GassmaTestPostcontentFilterConditions;

declare type GassmaTestPostpublishedHavingCore = {
  _avg?: GassmaTestPostpublishedFilterConditions;
  _count?: GassmaTestPostpublishedFilterConditions;
  _max?: GassmaTestPostpublishedFilterConditions;
  _min?: GassmaTestPostpublishedFilterConditions;
  _sum?: GassmaTestPostpublishedFilterConditions;
} & GassmaTestPostpublishedFilterConditions;

declare type GassmaTestPostviewCountHavingCore = {
  _avg?: GassmaTestPostviewCountFilterConditions;
  _count?: GassmaTestPostviewCountFilterConditions;
  _max?: GassmaTestPostviewCountFilterConditions;
  _min?: GassmaTestPostviewCountFilterConditions;
  _sum?: GassmaTestPostviewCountFilterConditions;
} & GassmaTestPostviewCountFilterConditions;

declare type GassmaTestPostratingHavingCore = {
  _avg?: GassmaTestPostratingFilterConditions;
  _count?: GassmaTestPostratingFilterConditions;
  _max?: GassmaTestPostratingFilterConditions;
  _min?: GassmaTestPostratingFilterConditions;
  _sum?: GassmaTestPostratingFilterConditions;
} & GassmaTestPostratingFilterConditions;

declare type GassmaTestPostauthorIdHavingCore = {
  _avg?: GassmaTestPostauthorIdFilterConditions;
  _count?: GassmaTestPostauthorIdFilterConditions;
  _max?: GassmaTestPostauthorIdFilterConditions;
  _min?: GassmaTestPostauthorIdFilterConditions;
  _sum?: GassmaTestPostauthorIdFilterConditions;
} & GassmaTestPostauthorIdFilterConditions;

declare type GassmaTestPostcategoryIdHavingCore = {
  _avg?: GassmaTestPostcategoryIdFilterConditions;
  _count?: GassmaTestPostcategoryIdFilterConditions;
  _max?: GassmaTestPostcategoryIdFilterConditions;
  _min?: GassmaTestPostcategoryIdFilterConditions;
  _sum?: GassmaTestPostcategoryIdFilterConditions;
} & GassmaTestPostcategoryIdFilterConditions;

declare type GassmaTestPostcreatedAtHavingCore = {
  _avg?: GassmaTestPostcreatedAtFilterConditions;
  _count?: GassmaTestPostcreatedAtFilterConditions;
  _max?: GassmaTestPostcreatedAtFilterConditions;
  _min?: GassmaTestPostcreatedAtFilterConditions;
  _sum?: GassmaTestPostcreatedAtFilterConditions;
} & GassmaTestPostcreatedAtFilterConditions;

declare type GassmaTestCommentidHavingCore = {
  _avg?: GassmaTestCommentidFilterConditions;
  _count?: GassmaTestCommentidFilterConditions;
  _max?: GassmaTestCommentidFilterConditions;
  _min?: GassmaTestCommentidFilterConditions;
  _sum?: GassmaTestCommentidFilterConditions;
} & GassmaTestCommentidFilterConditions;

declare type GassmaTestCommenttextHavingCore = {
  _avg?: GassmaTestCommenttextFilterConditions;
  _count?: GassmaTestCommenttextFilterConditions;
  _max?: GassmaTestCommenttextFilterConditions;
  _min?: GassmaTestCommenttextFilterConditions;
  _sum?: GassmaTestCommenttextFilterConditions;
} & GassmaTestCommenttextFilterConditions;

declare type GassmaTestCommentauthorIdHavingCore = {
  _avg?: GassmaTestCommentauthorIdFilterConditions;
  _count?: GassmaTestCommentauthorIdFilterConditions;
  _max?: GassmaTestCommentauthorIdFilterConditions;
  _min?: GassmaTestCommentauthorIdFilterConditions;
  _sum?: GassmaTestCommentauthorIdFilterConditions;
} & GassmaTestCommentauthorIdFilterConditions;

declare type GassmaTestCommentpostIdHavingCore = {
  _avg?: GassmaTestCommentpostIdFilterConditions;
  _count?: GassmaTestCommentpostIdFilterConditions;
  _max?: GassmaTestCommentpostIdFilterConditions;
  _min?: GassmaTestCommentpostIdFilterConditions;
  _sum?: GassmaTestCommentpostIdFilterConditions;
} & GassmaTestCommentpostIdFilterConditions;

declare type GassmaTestCommentcreatedAtHavingCore = {
  _avg?: GassmaTestCommentcreatedAtFilterConditions;
  _count?: GassmaTestCommentcreatedAtFilterConditions;
  _max?: GassmaTestCommentcreatedAtFilterConditions;
  _min?: GassmaTestCommentcreatedAtFilterConditions;
  _sum?: GassmaTestCommentcreatedAtFilterConditions;
} & GassmaTestCommentcreatedAtFilterConditions;

declare type GassmaTestCategoryidHavingCore = {
  _avg?: GassmaTestCategoryidFilterConditions;
  _count?: GassmaTestCategoryidFilterConditions;
  _max?: GassmaTestCategoryidFilterConditions;
  _min?: GassmaTestCategoryidFilterConditions;
  _sum?: GassmaTestCategoryidFilterConditions;
} & GassmaTestCategoryidFilterConditions;

declare type GassmaTestCategorynameHavingCore = {
  _avg?: GassmaTestCategorynameFilterConditions;
  _count?: GassmaTestCategorynameFilterConditions;
  _max?: GassmaTestCategorynameFilterConditions;
  _min?: GassmaTestCategorynameFilterConditions;
  _sum?: GassmaTestCategorynameFilterConditions;
} & GassmaTestCategorynameFilterConditions;

declare type GassmaTestCategoryparentIdHavingCore = {
  _avg?: GassmaTestCategoryparentIdFilterConditions;
  _count?: GassmaTestCategoryparentIdFilterConditions;
  _max?: GassmaTestCategoryparentIdFilterConditions;
  _min?: GassmaTestCategoryparentIdFilterConditions;
  _sum?: GassmaTestCategoryparentIdFilterConditions;
} & GassmaTestCategoryparentIdFilterConditions;

declare type GassmaTestTagidHavingCore = {
  _avg?: GassmaTestTagidFilterConditions;
  _count?: GassmaTestTagidFilterConditions;
  _max?: GassmaTestTagidFilterConditions;
  _min?: GassmaTestTagidFilterConditions;
  _sum?: GassmaTestTagidFilterConditions;
} & GassmaTestTagidFilterConditions;

declare type GassmaTestTagnameHavingCore = {
  _avg?: GassmaTestTagnameFilterConditions;
  _count?: GassmaTestTagnameFilterConditions;
  _max?: GassmaTestTagnameFilterConditions;
  _min?: GassmaTestTagnameFilterConditions;
  _sum?: GassmaTestTagnameFilterConditions;
} & GassmaTestTagnameFilterConditions;

declare type GassmaTestProductidHavingCore = {
  _avg?: GassmaTestProductidFilterConditions;
  _count?: GassmaTestProductidFilterConditions;
  _max?: GassmaTestProductidFilterConditions;
  _min?: GassmaTestProductidFilterConditions;
  _sum?: GassmaTestProductidFilterConditions;
} & GassmaTestProductidFilterConditions;

declare type GassmaTestProductnameHavingCore = {
  _avg?: GassmaTestProductnameFilterConditions;
  _count?: GassmaTestProductnameFilterConditions;
  _max?: GassmaTestProductnameFilterConditions;
  _min?: GassmaTestProductnameFilterConditions;
  _sum?: GassmaTestProductnameFilterConditions;
} & GassmaTestProductnameFilterConditions;

declare type GassmaTestProductpriceHavingCore = {
  _avg?: GassmaTestProductpriceFilterConditions;
  _count?: GassmaTestProductpriceFilterConditions;
  _max?: GassmaTestProductpriceFilterConditions;
  _min?: GassmaTestProductpriceFilterConditions;
  _sum?: GassmaTestProductpriceFilterConditions;
} & GassmaTestProductpriceFilterConditions;

declare type GassmaTestProductstockHavingCore = {
  _avg?: GassmaTestProductstockFilterConditions;
  _count?: GassmaTestProductstockFilterConditions;
  _max?: GassmaTestProductstockFilterConditions;
  _min?: GassmaTestProductstockFilterConditions;
  _sum?: GassmaTestProductstockFilterConditions;
} & GassmaTestProductstockFilterConditions;

declare type GassmaTestProductstatusHavingCore = {
  _avg?: GassmaTestProductstatusFilterConditions;
  _count?: GassmaTestProductstatusFilterConditions;
  _max?: GassmaTestProductstatusFilterConditions;
  _min?: GassmaTestProductstatusFilterConditions;
  _sum?: GassmaTestProductstatusFilterConditions;
} & GassmaTestProductstatusFilterConditions;

declare type GassmaTestProductcreatedAtHavingCore = {
  _avg?: GassmaTestProductcreatedAtFilterConditions;
  _count?: GassmaTestProductcreatedAtFilterConditions;
  _max?: GassmaTestProductcreatedAtFilterConditions;
  _min?: GassmaTestProductcreatedAtFilterConditions;
  _sum?: GassmaTestProductcreatedAtFilterConditions;
} & GassmaTestProductcreatedAtFilterConditions;

declare type GassmaTestOrderidHavingCore = {
  _avg?: GassmaTestOrderidFilterConditions;
  _count?: GassmaTestOrderidFilterConditions;
  _max?: GassmaTestOrderidFilterConditions;
  _min?: GassmaTestOrderidFilterConditions;
  _sum?: GassmaTestOrderidFilterConditions;
} & GassmaTestOrderidFilterConditions;

declare type GassmaTestOrderuserIdHavingCore = {
  _avg?: GassmaTestOrderuserIdFilterConditions;
  _count?: GassmaTestOrderuserIdFilterConditions;
  _max?: GassmaTestOrderuserIdFilterConditions;
  _min?: GassmaTestOrderuserIdFilterConditions;
  _sum?: GassmaTestOrderuserIdFilterConditions;
} & GassmaTestOrderuserIdFilterConditions;

declare type GassmaTestOrdertotalAmountHavingCore = {
  _avg?: GassmaTestOrdertotalAmountFilterConditions;
  _count?: GassmaTestOrdertotalAmountFilterConditions;
  _max?: GassmaTestOrdertotalAmountFilterConditions;
  _min?: GassmaTestOrdertotalAmountFilterConditions;
  _sum?: GassmaTestOrdertotalAmountFilterConditions;
} & GassmaTestOrdertotalAmountFilterConditions;

declare type GassmaTestOrderquantityHavingCore = {
  _avg?: GassmaTestOrderquantityFilterConditions;
  _count?: GassmaTestOrderquantityFilterConditions;
  _max?: GassmaTestOrderquantityFilterConditions;
  _min?: GassmaTestOrderquantityFilterConditions;
  _sum?: GassmaTestOrderquantityFilterConditions;
} & GassmaTestOrderquantityFilterConditions;

declare type GassmaTestOrderstatusHavingCore = {
  _avg?: GassmaTestOrderstatusFilterConditions;
  _count?: GassmaTestOrderstatusFilterConditions;
  _max?: GassmaTestOrderstatusFilterConditions;
  _min?: GassmaTestOrderstatusFilterConditions;
  _sum?: GassmaTestOrderstatusFilterConditions;
} & GassmaTestOrderstatusFilterConditions;

declare type GassmaTestOrdercreatedAtHavingCore = {
  _avg?: GassmaTestOrdercreatedAtFilterConditions;
  _count?: GassmaTestOrdercreatedAtFilterConditions;
  _max?: GassmaTestOrdercreatedAtFilterConditions;
  _min?: GassmaTestOrdercreatedAtFilterConditions;
  _sum?: GassmaTestOrdercreatedAtFilterConditions;
} & GassmaTestOrdercreatedAtFilterConditions;

declare type GassmaTestOrderItemidHavingCore = {
  _avg?: GassmaTestOrderItemidFilterConditions;
  _count?: GassmaTestOrderItemidFilterConditions;
  _max?: GassmaTestOrderItemidFilterConditions;
  _min?: GassmaTestOrderItemidFilterConditions;
  _sum?: GassmaTestOrderItemidFilterConditions;
} & GassmaTestOrderItemidFilterConditions;

declare type GassmaTestOrderItemorderIdHavingCore = {
  _avg?: GassmaTestOrderItemorderIdFilterConditions;
  _count?: GassmaTestOrderItemorderIdFilterConditions;
  _max?: GassmaTestOrderItemorderIdFilterConditions;
  _min?: GassmaTestOrderItemorderIdFilterConditions;
  _sum?: GassmaTestOrderItemorderIdFilterConditions;
} & GassmaTestOrderItemorderIdFilterConditions;

declare type GassmaTestOrderItemproductIdHavingCore = {
  _avg?: GassmaTestOrderItemproductIdFilterConditions;
  _count?: GassmaTestOrderItemproductIdFilterConditions;
  _max?: GassmaTestOrderItemproductIdFilterConditions;
  _min?: GassmaTestOrderItemproductIdFilterConditions;
  _sum?: GassmaTestOrderItemproductIdFilterConditions;
} & GassmaTestOrderItemproductIdFilterConditions;

declare type GassmaTestOrderItemquantityHavingCore = {
  _avg?: GassmaTestOrderItemquantityFilterConditions;
  _count?: GassmaTestOrderItemquantityFilterConditions;
  _max?: GassmaTestOrderItemquantityFilterConditions;
  _min?: GassmaTestOrderItemquantityFilterConditions;
  _sum?: GassmaTestOrderItemquantityFilterConditions;
} & GassmaTestOrderItemquantityFilterConditions;

declare type GassmaTestOrderItemunitPriceHavingCore = {
  _avg?: GassmaTestOrderItemunitPriceFilterConditions;
  _count?: GassmaTestOrderItemunitPriceFilterConditions;
  _max?: GassmaTestOrderItemunitPriceFilterConditions;
  _min?: GassmaTestOrderItemunitPriceFilterConditions;
  _sum?: GassmaTestOrderItemunitPriceFilterConditions;
} & GassmaTestOrderItemunitPriceFilterConditions;

declare type GassmaTestUserHavingUse = {
  "id"?: number | GassmaTestUseridHavingCore;
  "email"?: string | GassmaTestUseremailHavingCore;
  "name"?: string | GassmaTestUsernameHavingCore;
  "age"?: number | null | GassmaTestUserageHavingCore;
  "isActive"?: boolean | GassmaTestUserisActiveHavingCore;
  "role"?: string | "admin" | "user" | "moderator" | GassmaTestUserroleHavingCore;
  "createdAt"?: Date | GassmaTestUsercreatedAtHavingCore;

  AND?: GassmaTestUserHavingUse[] | GassmaTestUserHavingUse;
  OR?: GassmaTestUserHavingUse[];
  NOT?: GassmaTestUserHavingUse[] | GassmaTestUserHavingUse;
};

declare type GassmaTestProfileHavingUse = {
  "id"?: number | GassmaTestProfileidHavingCore;
  "bio"?: string | null | GassmaTestProfilebioHavingCore;
  "website"?: string | null | GassmaTestProfilewebsiteHavingCore;
  "userId"?: number | GassmaTestProfileuserIdHavingCore;

  AND?: GassmaTestProfileHavingUse[] | GassmaTestProfileHavingUse;
  OR?: GassmaTestProfileHavingUse[];
  NOT?: GassmaTestProfileHavingUse[] | GassmaTestProfileHavingUse;
};

declare type GassmaTestPostHavingUse = {
  "id"?: number | GassmaTestPostidHavingCore;
  "title"?: string | GassmaTestPosttitleHavingCore;
  "content"?: string | number | null | GassmaTestPostcontentHavingCore;
  "published"?: boolean | GassmaTestPostpublishedHavingCore;
  "viewCount"?: number | GassmaTestPostviewCountHavingCore;
  "rating"?: number | boolean | null | GassmaTestPostratingHavingCore;
  "authorId"?: number | GassmaTestPostauthorIdHavingCore;
  "categoryId"?: number | null | GassmaTestPostcategoryIdHavingCore;
  "createdAt"?: Date | GassmaTestPostcreatedAtHavingCore;

  AND?: GassmaTestPostHavingUse[] | GassmaTestPostHavingUse;
  OR?: GassmaTestPostHavingUse[];
  NOT?: GassmaTestPostHavingUse[] | GassmaTestPostHavingUse;
};

declare type GassmaTestCommentHavingUse = {
  "id"?: number | GassmaTestCommentidHavingCore;
  "text"?: string | GassmaTestCommenttextHavingCore;
  "authorId"?: number | GassmaTestCommentauthorIdHavingCore;
  "postId"?: number | GassmaTestCommentpostIdHavingCore;
  "createdAt"?: Date | GassmaTestCommentcreatedAtHavingCore;

  AND?: GassmaTestCommentHavingUse[] | GassmaTestCommentHavingUse;
  OR?: GassmaTestCommentHavingUse[];
  NOT?: GassmaTestCommentHavingUse[] | GassmaTestCommentHavingUse;
};

declare type GassmaTestCategoryHavingUse = {
  "id"?: number | GassmaTestCategoryidHavingCore;
  "name"?: string | GassmaTestCategorynameHavingCore;
  "parentId"?: number | null | GassmaTestCategoryparentIdHavingCore;

  AND?: GassmaTestCategoryHavingUse[] | GassmaTestCategoryHavingUse;
  OR?: GassmaTestCategoryHavingUse[];
  NOT?: GassmaTestCategoryHavingUse[] | GassmaTestCategoryHavingUse;
};

declare type GassmaTestTagHavingUse = {
  "id"?: number | GassmaTestTagidHavingCore;
  "name"?: string | GassmaTestTagnameHavingCore;

  AND?: GassmaTestTagHavingUse[] | GassmaTestTagHavingUse;
  OR?: GassmaTestTagHavingUse[];
  NOT?: GassmaTestTagHavingUse[] | GassmaTestTagHavingUse;
};

declare type GassmaTestProductHavingUse = {
  "id"?: number | GassmaTestProductidHavingCore;
  "name"?: string | GassmaTestProductnameHavingCore;
  "price"?: number | GassmaTestProductpriceHavingCore;
  "stock"?: number | GassmaTestProductstockHavingCore;
  "status"?: string | "available" | "soldout" | "discontinued" | GassmaTestProductstatusHavingCore;
  "createdAt"?: Date | GassmaTestProductcreatedAtHavingCore;

  AND?: GassmaTestProductHavingUse[] | GassmaTestProductHavingUse;
  OR?: GassmaTestProductHavingUse[];
  NOT?: GassmaTestProductHavingUse[] | GassmaTestProductHavingUse;
};

declare type GassmaTestOrderHavingUse = {
  "id"?: number | GassmaTestOrderidHavingCore;
  "userId"?: number | GassmaTestOrderuserIdHavingCore;
  "totalAmount"?: number | GassmaTestOrdertotalAmountHavingCore;
  "quantity"?: number | GassmaTestOrderquantityHavingCore;
  "status"?: string | "pending" | "shipped" | "delivered" | "cancelled" | GassmaTestOrderstatusHavingCore;
  "createdAt"?: Date | GassmaTestOrdercreatedAtHavingCore;

  AND?: GassmaTestOrderHavingUse[] | GassmaTestOrderHavingUse;
  OR?: GassmaTestOrderHavingUse[];
  NOT?: GassmaTestOrderHavingUse[] | GassmaTestOrderHavingUse;
};

declare type GassmaTestOrderItemHavingUse = {
  "id"?: number | GassmaTestOrderItemidHavingCore;
  "orderId"?: number | GassmaTestOrderItemorderIdHavingCore;
  "productId"?: number | GassmaTestOrderItemproductIdHavingCore;
  "quantity"?: number | GassmaTestOrderItemquantityHavingCore;
  "unitPrice"?: number | GassmaTestOrderItemunitPriceHavingCore;

  AND?: GassmaTestOrderItemHavingUse[] | GassmaTestOrderItemHavingUse;
  OR?: GassmaTestOrderItemHavingUse[];
  NOT?: GassmaTestOrderItemHavingUse[] | GassmaTestOrderItemHavingUse;
};

declare type GassmaTestUserFindData = {
  where?: GassmaTestUserWhereUse;
  select?: GassmaTestUserSelect;
  omit?: GassmaTestUserOmit;
  orderBy?: GassmaTestUserOrderBy;
  take?: number;
  skip?: number;
  distinct?: "id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt" | ("id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt")[];
  include?: Gassma.IncludeData;
  cursor?: Partial<GassmaTestUserUse>;
  _count?: Gassma.CountValue;
};

declare type GassmaTestProfileFindData = {
  where?: GassmaTestProfileWhereUse;
  select?: GassmaTestProfileSelect;
  omit?: GassmaTestProfileOmit;
  orderBy?: GassmaTestProfileOrderBy;
  take?: number;
  skip?: number;
  distinct?: "id" | "bio" | "website" | "userId" | ("id" | "bio" | "website" | "userId")[];
  include?: Gassma.IncludeData;
  cursor?: Partial<GassmaTestProfileUse>;
  _count?: Gassma.CountValue;
};

declare type GassmaTestPostFindData = {
  where?: GassmaTestPostWhereUse;
  select?: GassmaTestPostSelect;
  omit?: GassmaTestPostOmit;
  orderBy?: GassmaTestPostOrderBy;
  take?: number;
  skip?: number;
  distinct?: "id" | "title" | "content" | "published" | "viewCount" | "rating" | "authorId" | "categoryId" | "createdAt" | ("id" | "title" | "content" | "published" | "viewCount" | "rating" | "authorId" | "categoryId" | "createdAt")[];
  include?: Gassma.IncludeData;
  cursor?: Partial<GassmaTestPostUse>;
  _count?: Gassma.CountValue;
};

declare type GassmaTestCommentFindData = {
  where?: GassmaTestCommentWhereUse;
  select?: GassmaTestCommentSelect;
  omit?: GassmaTestCommentOmit;
  orderBy?: GassmaTestCommentOrderBy;
  take?: number;
  skip?: number;
  distinct?: "id" | "text" | "authorId" | "postId" | "createdAt" | ("id" | "text" | "authorId" | "postId" | "createdAt")[];
  include?: Gassma.IncludeData;
  cursor?: Partial<GassmaTestCommentUse>;
  _count?: Gassma.CountValue;
};

declare type GassmaTestCategoryFindData = {
  where?: GassmaTestCategoryWhereUse;
  select?: GassmaTestCategorySelect;
  omit?: GassmaTestCategoryOmit;
  orderBy?: GassmaTestCategoryOrderBy;
  take?: number;
  skip?: number;
  distinct?: "id" | "name" | "parentId" | ("id" | "name" | "parentId")[];
  include?: Gassma.IncludeData;
  cursor?: Partial<GassmaTestCategoryUse>;
  _count?: Gassma.CountValue;
};

declare type GassmaTestTagFindData = {
  where?: GassmaTestTagWhereUse;
  select?: GassmaTestTagSelect;
  omit?: GassmaTestTagOmit;
  orderBy?: GassmaTestTagOrderBy;
  take?: number;
  skip?: number;
  distinct?: "id" | "name" | ("id" | "name")[];
  include?: Gassma.IncludeData;
  cursor?: Partial<GassmaTestTagUse>;
  _count?: Gassma.CountValue;
};

declare type GassmaTestProductFindData = {
  where?: GassmaTestProductWhereUse;
  select?: GassmaTestProductSelect;
  omit?: GassmaTestProductOmit;
  orderBy?: GassmaTestProductOrderBy;
  take?: number;
  skip?: number;
  distinct?: "id" | "name" | "price" | "stock" | "status" | "createdAt" | ("id" | "name" | "price" | "stock" | "status" | "createdAt")[];
  include?: Gassma.IncludeData;
  cursor?: Partial<GassmaTestProductUse>;
  _count?: Gassma.CountValue;
};

declare type GassmaTestOrderFindData = {
  where?: GassmaTestOrderWhereUse;
  select?: GassmaTestOrderSelect;
  omit?: GassmaTestOrderOmit;
  orderBy?: GassmaTestOrderOrderBy;
  take?: number;
  skip?: number;
  distinct?: "id" | "userId" | "totalAmount" | "quantity" | "status" | "createdAt" | ("id" | "userId" | "totalAmount" | "quantity" | "status" | "createdAt")[];
  include?: Gassma.IncludeData;
  cursor?: Partial<GassmaTestOrderUse>;
  _count?: Gassma.CountValue;
};

declare type GassmaTestOrderItemFindData = {
  where?: GassmaTestOrderItemWhereUse;
  select?: GassmaTestOrderItemSelect;
  omit?: GassmaTestOrderItemOmit;
  orderBy?: GassmaTestOrderItemOrderBy;
  take?: number;
  skip?: number;
  distinct?: "id" | "orderId" | "productId" | "quantity" | "unitPrice" | ("id" | "orderId" | "productId" | "quantity" | "unitPrice")[];
  include?: Gassma.IncludeData;
  cursor?: Partial<GassmaTestOrderItemUse>;
  _count?: Gassma.CountValue;
};

declare type GassmaTestUserFindManyData = GassmaTestUserFindData;

declare type GassmaTestProfileFindManyData = GassmaTestProfileFindData;

declare type GassmaTestPostFindManyData = GassmaTestPostFindData;

declare type GassmaTestCommentFindManyData = GassmaTestCommentFindData;

declare type GassmaTestCategoryFindManyData = GassmaTestCategoryFindData;

declare type GassmaTestTagFindManyData = GassmaTestTagFindData;

declare type GassmaTestProductFindManyData = GassmaTestProductFindData;

declare type GassmaTestOrderFindManyData = GassmaTestOrderFindData;

declare type GassmaTestOrderItemFindManyData = GassmaTestOrderItemFindData;

declare type GassmaTestUserUpdateData = {
  where?: GassmaTestUserWhereUse;
  data: Partial<{ [K in keyof GassmaTestUserUse]: GassmaTestUserUse[K] | Gassma.NumberOperation }> & {
    "profile"?: Gassma.NestedWriteOperation;
    "posts"?: Gassma.NestedWriteOperation;
    "comments"?: Gassma.NestedWriteOperation;
    "orders"?: Gassma.NestedWriteOperation;
  };
  limit?: number;
};

declare type GassmaTestProfileUpdateData = {
  where?: GassmaTestProfileWhereUse;
  data: Partial<{ [K in keyof GassmaTestProfileUse]: GassmaTestProfileUse[K] | Gassma.NumberOperation }> & {
    "user"?: Gassma.NestedWriteOperation;
  };
  limit?: number;
};

declare type GassmaTestPostUpdateData = {
  where?: GassmaTestPostWhereUse;
  data: Partial<{ [K in keyof GassmaTestPostUse]: GassmaTestPostUse[K] | Gassma.NumberOperation }> & {
    "author"?: Gassma.NestedWriteOperation;
    "category"?: Gassma.NestedWriteOperation;
    "comments"?: Gassma.NestedWriteOperation;
    "tags"?: Gassma.NestedWriteOperation;
  };
  limit?: number;
};

declare type GassmaTestCommentUpdateData = {
  where?: GassmaTestCommentWhereUse;
  data: Partial<{ [K in keyof GassmaTestCommentUse]: GassmaTestCommentUse[K] | Gassma.NumberOperation }> & {
    "author"?: Gassma.NestedWriteOperation;
    "post"?: Gassma.NestedWriteOperation;
  };
  limit?: number;
};

declare type GassmaTestCategoryUpdateData = {
  where?: GassmaTestCategoryWhereUse;
  data: Partial<{ [K in keyof GassmaTestCategoryUse]: GassmaTestCategoryUse[K] | Gassma.NumberOperation }> & {
    "posts"?: Gassma.NestedWriteOperation;
    "parent"?: Gassma.NestedWriteOperation;
    "children"?: Gassma.NestedWriteOperation;
  };
  limit?: number;
};

declare type GassmaTestTagUpdateData = {
  where?: GassmaTestTagWhereUse;
  data: Partial<{ [K in keyof GassmaTestTagUse]: GassmaTestTagUse[K] | Gassma.NumberOperation }> & {
    "posts"?: Gassma.NestedWriteOperation;
  };
  limit?: number;
};

declare type GassmaTestProductUpdateData = {
  where?: GassmaTestProductWhereUse;
  data: Partial<{ [K in keyof GassmaTestProductUse]: GassmaTestProductUse[K] | Gassma.NumberOperation }> & {
    "orderItems"?: Gassma.NestedWriteOperation;
  };
  limit?: number;
};

declare type GassmaTestOrderUpdateData = {
  where?: GassmaTestOrderWhereUse;
  data: Partial<{ [K in keyof GassmaTestOrderUse]: GassmaTestOrderUse[K] | Gassma.NumberOperation }> & {
    "user"?: Gassma.NestedWriteOperation;
    "items"?: Gassma.NestedWriteOperation;
  };
  limit?: number;
};

declare type GassmaTestOrderItemUpdateData = {
  where?: GassmaTestOrderItemWhereUse;
  data: Partial<{ [K in keyof GassmaTestOrderItemUse]: GassmaTestOrderItemUse[K] | Gassma.NumberOperation }> & {
    "order"?: Gassma.NestedWriteOperation;
    "product"?: Gassma.NestedWriteOperation;
  };
  limit?: number;
};

declare type GassmaTestUserUpdateSingleData = {
  where: GassmaTestUserWhereUse;
  data: Partial<{ [K in keyof GassmaTestUserUse]: GassmaTestUserUse[K] | Gassma.NumberOperation }> & {
    "profile"?: Gassma.NestedWriteOperation;
    "posts"?: Gassma.NestedWriteOperation;
    "comments"?: Gassma.NestedWriteOperation;
    "orders"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestUserSelect;
  omit?: GassmaTestUserOmit;
};

declare type GassmaTestProfileUpdateSingleData = {
  where: GassmaTestProfileWhereUse;
  data: Partial<{ [K in keyof GassmaTestProfileUse]: GassmaTestProfileUse[K] | Gassma.NumberOperation }> & {
    "user"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestProfileSelect;
  omit?: GassmaTestProfileOmit;
};

declare type GassmaTestPostUpdateSingleData = {
  where: GassmaTestPostWhereUse;
  data: Partial<{ [K in keyof GassmaTestPostUse]: GassmaTestPostUse[K] | Gassma.NumberOperation }> & {
    "author"?: Gassma.NestedWriteOperation;
    "category"?: Gassma.NestedWriteOperation;
    "comments"?: Gassma.NestedWriteOperation;
    "tags"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestPostSelect;
  omit?: GassmaTestPostOmit;
};

declare type GassmaTestCommentUpdateSingleData = {
  where: GassmaTestCommentWhereUse;
  data: Partial<{ [K in keyof GassmaTestCommentUse]: GassmaTestCommentUse[K] | Gassma.NumberOperation }> & {
    "author"?: Gassma.NestedWriteOperation;
    "post"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestCommentSelect;
  omit?: GassmaTestCommentOmit;
};

declare type GassmaTestCategoryUpdateSingleData = {
  where: GassmaTestCategoryWhereUse;
  data: Partial<{ [K in keyof GassmaTestCategoryUse]: GassmaTestCategoryUse[K] | Gassma.NumberOperation }> & {
    "posts"?: Gassma.NestedWriteOperation;
    "parent"?: Gassma.NestedWriteOperation;
    "children"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestCategorySelect;
  omit?: GassmaTestCategoryOmit;
};

declare type GassmaTestTagUpdateSingleData = {
  where: GassmaTestTagWhereUse;
  data: Partial<{ [K in keyof GassmaTestTagUse]: GassmaTestTagUse[K] | Gassma.NumberOperation }> & {
    "posts"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestTagSelect;
  omit?: GassmaTestTagOmit;
};

declare type GassmaTestProductUpdateSingleData = {
  where: GassmaTestProductWhereUse;
  data: Partial<{ [K in keyof GassmaTestProductUse]: GassmaTestProductUse[K] | Gassma.NumberOperation }> & {
    "orderItems"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestProductSelect;
  omit?: GassmaTestProductOmit;
};

declare type GassmaTestOrderUpdateSingleData = {
  where: GassmaTestOrderWhereUse;
  data: Partial<{ [K in keyof GassmaTestOrderUse]: GassmaTestOrderUse[K] | Gassma.NumberOperation }> & {
    "user"?: Gassma.NestedWriteOperation;
    "items"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestOrderSelect;
  omit?: GassmaTestOrderOmit;
};

declare type GassmaTestOrderItemUpdateSingleData = {
  where: GassmaTestOrderItemWhereUse;
  data: Partial<{ [K in keyof GassmaTestOrderItemUse]: GassmaTestOrderItemUse[K] | Gassma.NumberOperation }> & {
    "order"?: Gassma.NestedWriteOperation;
    "product"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestOrderItemSelect;
  omit?: GassmaTestOrderItemOmit;
};

declare type GassmaTestUserUpsertData = {
  where: GassmaTestUserWhereUse;
  update: Partial<{ [K in keyof GassmaTestUserUse]: GassmaTestUserUse[K] | Gassma.NumberOperation }>;
  data: GassmaTestUserUse;
};

declare type GassmaTestProfileUpsertData = {
  where: GassmaTestProfileWhereUse;
  update: Partial<{ [K in keyof GassmaTestProfileUse]: GassmaTestProfileUse[K] | Gassma.NumberOperation }>;
  data: GassmaTestProfileUse;
};

declare type GassmaTestPostUpsertData = {
  where: GassmaTestPostWhereUse;
  update: Partial<{ [K in keyof GassmaTestPostUse]: GassmaTestPostUse[K] | Gassma.NumberOperation }>;
  data: GassmaTestPostUse;
};

declare type GassmaTestCommentUpsertData = {
  where: GassmaTestCommentWhereUse;
  update: Partial<{ [K in keyof GassmaTestCommentUse]: GassmaTestCommentUse[K] | Gassma.NumberOperation }>;
  data: GassmaTestCommentUse;
};

declare type GassmaTestCategoryUpsertData = {
  where: GassmaTestCategoryWhereUse;
  update: Partial<{ [K in keyof GassmaTestCategoryUse]: GassmaTestCategoryUse[K] | Gassma.NumberOperation }>;
  data: GassmaTestCategoryUse;
};

declare type GassmaTestTagUpsertData = {
  where: GassmaTestTagWhereUse;
  update: Partial<{ [K in keyof GassmaTestTagUse]: GassmaTestTagUse[K] | Gassma.NumberOperation }>;
  data: GassmaTestTagUse;
};

declare type GassmaTestProductUpsertData = {
  where: GassmaTestProductWhereUse;
  update: Partial<{ [K in keyof GassmaTestProductUse]: GassmaTestProductUse[K] | Gassma.NumberOperation }>;
  data: GassmaTestProductUse;
};

declare type GassmaTestOrderUpsertData = {
  where: GassmaTestOrderWhereUse;
  update: Partial<{ [K in keyof GassmaTestOrderUse]: GassmaTestOrderUse[K] | Gassma.NumberOperation }>;
  data: GassmaTestOrderUse;
};

declare type GassmaTestOrderItemUpsertData = {
  where: GassmaTestOrderItemWhereUse;
  update: Partial<{ [K in keyof GassmaTestOrderItemUse]: GassmaTestOrderItemUse[K] | Gassma.NumberOperation }>;
  data: GassmaTestOrderItemUse;
};

declare type GassmaTestUserUpsertSingleData = {
  where: GassmaTestUserWhereUse;
  create: GassmaTestUserUse & {
    "profile"?: Gassma.NestedWriteOperation;
    "posts"?: Gassma.NestedWriteOperation;
    "comments"?: Gassma.NestedWriteOperation;
    "orders"?: Gassma.NestedWriteOperation;
  };
  update: Partial<{ [K in keyof GassmaTestUserUse]: GassmaTestUserUse[K] | Gassma.NumberOperation }> & {
    "profile"?: Gassma.NestedWriteOperation;
    "posts"?: Gassma.NestedWriteOperation;
    "comments"?: Gassma.NestedWriteOperation;
    "orders"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestUserSelect;
  include?: Gassma.IncludeData;
  omit?: GassmaTestUserOmit;
};

declare type GassmaTestProfileUpsertSingleData = {
  where: GassmaTestProfileWhereUse;
  create: GassmaTestProfileUse & {
    "user"?: Gassma.NestedWriteOperation;
  };
  update: Partial<{ [K in keyof GassmaTestProfileUse]: GassmaTestProfileUse[K] | Gassma.NumberOperation }> & {
    "user"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestProfileSelect;
  include?: Gassma.IncludeData;
  omit?: GassmaTestProfileOmit;
};

declare type GassmaTestPostUpsertSingleData = {
  where: GassmaTestPostWhereUse;
  create: GassmaTestPostUse & {
    "author"?: Gassma.NestedWriteOperation;
    "category"?: Gassma.NestedWriteOperation;
    "comments"?: Gassma.NestedWriteOperation;
    "tags"?: Gassma.NestedWriteOperation;
  };
  update: Partial<{ [K in keyof GassmaTestPostUse]: GassmaTestPostUse[K] | Gassma.NumberOperation }> & {
    "author"?: Gassma.NestedWriteOperation;
    "category"?: Gassma.NestedWriteOperation;
    "comments"?: Gassma.NestedWriteOperation;
    "tags"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestPostSelect;
  include?: Gassma.IncludeData;
  omit?: GassmaTestPostOmit;
};

declare type GassmaTestCommentUpsertSingleData = {
  where: GassmaTestCommentWhereUse;
  create: GassmaTestCommentUse & {
    "author"?: Gassma.NestedWriteOperation;
    "post"?: Gassma.NestedWriteOperation;
  };
  update: Partial<{ [K in keyof GassmaTestCommentUse]: GassmaTestCommentUse[K] | Gassma.NumberOperation }> & {
    "author"?: Gassma.NestedWriteOperation;
    "post"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestCommentSelect;
  include?: Gassma.IncludeData;
  omit?: GassmaTestCommentOmit;
};

declare type GassmaTestCategoryUpsertSingleData = {
  where: GassmaTestCategoryWhereUse;
  create: GassmaTestCategoryUse & {
    "posts"?: Gassma.NestedWriteOperation;
    "parent"?: Gassma.NestedWriteOperation;
    "children"?: Gassma.NestedWriteOperation;
  };
  update: Partial<{ [K in keyof GassmaTestCategoryUse]: GassmaTestCategoryUse[K] | Gassma.NumberOperation }> & {
    "posts"?: Gassma.NestedWriteOperation;
    "parent"?: Gassma.NestedWriteOperation;
    "children"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestCategorySelect;
  include?: Gassma.IncludeData;
  omit?: GassmaTestCategoryOmit;
};

declare type GassmaTestTagUpsertSingleData = {
  where: GassmaTestTagWhereUse;
  create: GassmaTestTagUse & {
    "posts"?: Gassma.NestedWriteOperation;
  };
  update: Partial<{ [K in keyof GassmaTestTagUse]: GassmaTestTagUse[K] | Gassma.NumberOperation }> & {
    "posts"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestTagSelect;
  include?: Gassma.IncludeData;
  omit?: GassmaTestTagOmit;
};

declare type GassmaTestProductUpsertSingleData = {
  where: GassmaTestProductWhereUse;
  create: GassmaTestProductUse & {
    "orderItems"?: Gassma.NestedWriteOperation;
  };
  update: Partial<{ [K in keyof GassmaTestProductUse]: GassmaTestProductUse[K] | Gassma.NumberOperation }> & {
    "orderItems"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestProductSelect;
  include?: Gassma.IncludeData;
  omit?: GassmaTestProductOmit;
};

declare type GassmaTestOrderUpsertSingleData = {
  where: GassmaTestOrderWhereUse;
  create: GassmaTestOrderUse & {
    "user"?: Gassma.NestedWriteOperation;
    "items"?: Gassma.NestedWriteOperation;
  };
  update: Partial<{ [K in keyof GassmaTestOrderUse]: GassmaTestOrderUse[K] | Gassma.NumberOperation }> & {
    "user"?: Gassma.NestedWriteOperation;
    "items"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestOrderSelect;
  include?: Gassma.IncludeData;
  omit?: GassmaTestOrderOmit;
};

declare type GassmaTestOrderItemUpsertSingleData = {
  where: GassmaTestOrderItemWhereUse;
  create: GassmaTestOrderItemUse & {
    "order"?: Gassma.NestedWriteOperation;
    "product"?: Gassma.NestedWriteOperation;
  };
  update: Partial<{ [K in keyof GassmaTestOrderItemUse]: GassmaTestOrderItemUse[K] | Gassma.NumberOperation }> & {
    "order"?: Gassma.NestedWriteOperation;
    "product"?: Gassma.NestedWriteOperation;
  };
  select?: GassmaTestOrderItemSelect;
  include?: Gassma.IncludeData;
  omit?: GassmaTestOrderItemOmit;
};

declare type GassmaTestUserDeleteData = {
  where: GassmaTestUserWhereUse;
  limit?: number;
};

declare type GassmaTestProfileDeleteData = {
  where: GassmaTestProfileWhereUse;
  limit?: number;
};

declare type GassmaTestPostDeleteData = {
  where: GassmaTestPostWhereUse;
  limit?: number;
};

declare type GassmaTestCommentDeleteData = {
  where: GassmaTestCommentWhereUse;
  limit?: number;
};

declare type GassmaTestCategoryDeleteData = {
  where: GassmaTestCategoryWhereUse;
  limit?: number;
};

declare type GassmaTestTagDeleteData = {
  where: GassmaTestTagWhereUse;
  limit?: number;
};

declare type GassmaTestProductDeleteData = {
  where: GassmaTestProductWhereUse;
  limit?: number;
};

declare type GassmaTestOrderDeleteData = {
  where: GassmaTestOrderWhereUse;
  limit?: number;
};

declare type GassmaTestOrderItemDeleteData = {
  where: GassmaTestOrderItemWhereUse;
  limit?: number;
};

declare type GassmaTestUserDeleteSingleData = {
  where: GassmaTestUserWhereUse;
  select?: GassmaTestUserSelect;
  include?: Gassma.IncludeData;
  omit?: GassmaTestUserOmit;
};

declare type GassmaTestProfileDeleteSingleData = {
  where: GassmaTestProfileWhereUse;
  select?: GassmaTestProfileSelect;
  include?: Gassma.IncludeData;
  omit?: GassmaTestProfileOmit;
};

declare type GassmaTestPostDeleteSingleData = {
  where: GassmaTestPostWhereUse;
  select?: GassmaTestPostSelect;
  include?: Gassma.IncludeData;
  omit?: GassmaTestPostOmit;
};

declare type GassmaTestCommentDeleteSingleData = {
  where: GassmaTestCommentWhereUse;
  select?: GassmaTestCommentSelect;
  include?: Gassma.IncludeData;
  omit?: GassmaTestCommentOmit;
};

declare type GassmaTestCategoryDeleteSingleData = {
  where: GassmaTestCategoryWhereUse;
  select?: GassmaTestCategorySelect;
  include?: Gassma.IncludeData;
  omit?: GassmaTestCategoryOmit;
};

declare type GassmaTestTagDeleteSingleData = {
  where: GassmaTestTagWhereUse;
  select?: GassmaTestTagSelect;
  include?: Gassma.IncludeData;
  omit?: GassmaTestTagOmit;
};

declare type GassmaTestProductDeleteSingleData = {
  where: GassmaTestProductWhereUse;
  select?: GassmaTestProductSelect;
  include?: Gassma.IncludeData;
  omit?: GassmaTestProductOmit;
};

declare type GassmaTestOrderDeleteSingleData = {
  where: GassmaTestOrderWhereUse;
  select?: GassmaTestOrderSelect;
  include?: Gassma.IncludeData;
  omit?: GassmaTestOrderOmit;
};

declare type GassmaTestOrderItemDeleteSingleData = {
  where: GassmaTestOrderItemWhereUse;
  select?: GassmaTestOrderItemSelect;
  include?: Gassma.IncludeData;
  omit?: GassmaTestOrderItemOmit;
};

declare type GassmaTestUserAggregateData = {
  where?: GassmaTestUserWhereUse;
  orderBy?: GassmaTestUserOrderBy;
  take?: number;
  skip?: number;
  _avg?: GassmaTestUserSelect;
  _count?: GassmaTestUserSelect;
  _max?: GassmaTestUserSelect;
  _min?: GassmaTestUserSelect;
  _sum?: GassmaTestUserSelect;
};

declare type GassmaTestProfileAggregateData = {
  where?: GassmaTestProfileWhereUse;
  orderBy?: GassmaTestProfileOrderBy;
  take?: number;
  skip?: number;
  _avg?: GassmaTestProfileSelect;
  _count?: GassmaTestProfileSelect;
  _max?: GassmaTestProfileSelect;
  _min?: GassmaTestProfileSelect;
  _sum?: GassmaTestProfileSelect;
};

declare type GassmaTestPostAggregateData = {
  where?: GassmaTestPostWhereUse;
  orderBy?: GassmaTestPostOrderBy;
  take?: number;
  skip?: number;
  _avg?: GassmaTestPostSelect;
  _count?: GassmaTestPostSelect;
  _max?: GassmaTestPostSelect;
  _min?: GassmaTestPostSelect;
  _sum?: GassmaTestPostSelect;
};

declare type GassmaTestCommentAggregateData = {
  where?: GassmaTestCommentWhereUse;
  orderBy?: GassmaTestCommentOrderBy;
  take?: number;
  skip?: number;
  _avg?: GassmaTestCommentSelect;
  _count?: GassmaTestCommentSelect;
  _max?: GassmaTestCommentSelect;
  _min?: GassmaTestCommentSelect;
  _sum?: GassmaTestCommentSelect;
};

declare type GassmaTestCategoryAggregateData = {
  where?: GassmaTestCategoryWhereUse;
  orderBy?: GassmaTestCategoryOrderBy;
  take?: number;
  skip?: number;
  _avg?: GassmaTestCategorySelect;
  _count?: GassmaTestCategorySelect;
  _max?: GassmaTestCategorySelect;
  _min?: GassmaTestCategorySelect;
  _sum?: GassmaTestCategorySelect;
};

declare type GassmaTestTagAggregateData = {
  where?: GassmaTestTagWhereUse;
  orderBy?: GassmaTestTagOrderBy;
  take?: number;
  skip?: number;
  _avg?: GassmaTestTagSelect;
  _count?: GassmaTestTagSelect;
  _max?: GassmaTestTagSelect;
  _min?: GassmaTestTagSelect;
  _sum?: GassmaTestTagSelect;
};

declare type GassmaTestProductAggregateData = {
  where?: GassmaTestProductWhereUse;
  orderBy?: GassmaTestProductOrderBy;
  take?: number;
  skip?: number;
  _avg?: GassmaTestProductSelect;
  _count?: GassmaTestProductSelect;
  _max?: GassmaTestProductSelect;
  _min?: GassmaTestProductSelect;
  _sum?: GassmaTestProductSelect;
};

declare type GassmaTestOrderAggregateData = {
  where?: GassmaTestOrderWhereUse;
  orderBy?: GassmaTestOrderOrderBy;
  take?: number;
  skip?: number;
  _avg?: GassmaTestOrderSelect;
  _count?: GassmaTestOrderSelect;
  _max?: GassmaTestOrderSelect;
  _min?: GassmaTestOrderSelect;
  _sum?: GassmaTestOrderSelect;
};

declare type GassmaTestOrderItemAggregateData = {
  where?: GassmaTestOrderItemWhereUse;
  orderBy?: GassmaTestOrderItemOrderBy;
  take?: number;
  skip?: number;
  _avg?: GassmaTestOrderItemSelect;
  _count?: GassmaTestOrderItemSelect;
  _max?: GassmaTestOrderItemSelect;
  _min?: GassmaTestOrderItemSelect;
  _sum?: GassmaTestOrderItemSelect;
};

declare type GassmaTestUserGroupByData = GassmaTestUserAggregateData & {
  by: "id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt" | ("id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt")[];
  having?: GassmaTestUserHavingUse;
};

declare type GassmaTestProfileGroupByData = GassmaTestProfileAggregateData & {
  by: "id" | "bio" | "website" | "userId" | ("id" | "bio" | "website" | "userId")[];
  having?: GassmaTestProfileHavingUse;
};

declare type GassmaTestPostGroupByData = GassmaTestPostAggregateData & {
  by: "id" | "title" | "content" | "published" | "viewCount" | "rating" | "authorId" | "categoryId" | "createdAt" | ("id" | "title" | "content" | "published" | "viewCount" | "rating" | "authorId" | "categoryId" | "createdAt")[];
  having?: GassmaTestPostHavingUse;
};

declare type GassmaTestCommentGroupByData = GassmaTestCommentAggregateData & {
  by: "id" | "text" | "authorId" | "postId" | "createdAt" | ("id" | "text" | "authorId" | "postId" | "createdAt")[];
  having?: GassmaTestCommentHavingUse;
};

declare type GassmaTestCategoryGroupByData = GassmaTestCategoryAggregateData & {
  by: "id" | "name" | "parentId" | ("id" | "name" | "parentId")[];
  having?: GassmaTestCategoryHavingUse;
};

declare type GassmaTestTagGroupByData = GassmaTestTagAggregateData & {
  by: "id" | "name" | ("id" | "name")[];
  having?: GassmaTestTagHavingUse;
};

declare type GassmaTestProductGroupByData = GassmaTestProductAggregateData & {
  by: "id" | "name" | "price" | "stock" | "status" | "createdAt" | ("id" | "name" | "price" | "stock" | "status" | "createdAt")[];
  having?: GassmaTestProductHavingUse;
};

declare type GassmaTestOrderGroupByData = GassmaTestOrderAggregateData & {
  by: "id" | "userId" | "totalAmount" | "quantity" | "status" | "createdAt" | ("id" | "userId" | "totalAmount" | "quantity" | "status" | "createdAt")[];
  having?: GassmaTestOrderHavingUse;
};

declare type GassmaTestOrderItemGroupByData = GassmaTestOrderItemAggregateData & {
  by: "id" | "orderId" | "productId" | "quantity" | "unitPrice" | ("id" | "orderId" | "productId" | "quantity" | "unitPrice")[];
  having?: GassmaTestOrderItemHavingUse;
};

declare type GassmaTestUserOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "email"?: "asc" | "desc" | Gassma.SortOrderInput;
  "name"?: "asc" | "desc" | Gassma.SortOrderInput;
  "age"?: "asc" | "desc" | Gassma.SortOrderInput;
  "isActive"?: "asc" | "desc" | Gassma.SortOrderInput;
  "role"?: "asc" | "desc" | Gassma.SortOrderInput;
  "createdAt"?: "asc" | "desc" | Gassma.SortOrderInput;
  "profile"?: Gassma.RelationOrderBy;
  "posts"?: Gassma.RelationOrderBy;
  "comments"?: Gassma.RelationOrderBy;
  "orders"?: Gassma.RelationOrderBy;
  "_count"?: Gassma.RelationOrderBy;
};

declare type GassmaTestProfileOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "bio"?: "asc" | "desc" | Gassma.SortOrderInput;
  "website"?: "asc" | "desc" | Gassma.SortOrderInput;
  "userId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "user"?: Gassma.RelationOrderBy;
  "_count"?: Gassma.RelationOrderBy;
};

declare type GassmaTestPostOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "title"?: "asc" | "desc" | Gassma.SortOrderInput;
  "content"?: "asc" | "desc" | Gassma.SortOrderInput;
  "published"?: "asc" | "desc" | Gassma.SortOrderInput;
  "viewCount"?: "asc" | "desc" | Gassma.SortOrderInput;
  "rating"?: "asc" | "desc" | Gassma.SortOrderInput;
  "authorId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "categoryId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "createdAt"?: "asc" | "desc" | Gassma.SortOrderInput;
  "author"?: Gassma.RelationOrderBy;
  "category"?: Gassma.RelationOrderBy;
  "comments"?: Gassma.RelationOrderBy;
  "tags"?: Gassma.RelationOrderBy;
  "_count"?: Gassma.RelationOrderBy;
};

declare type GassmaTestCommentOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "text"?: "asc" | "desc" | Gassma.SortOrderInput;
  "authorId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "postId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "createdAt"?: "asc" | "desc" | Gassma.SortOrderInput;
  "author"?: Gassma.RelationOrderBy;
  "post"?: Gassma.RelationOrderBy;
  "_count"?: Gassma.RelationOrderBy;
};

declare type GassmaTestCategoryOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "name"?: "asc" | "desc" | Gassma.SortOrderInput;
  "parentId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "posts"?: Gassma.RelationOrderBy;
  "parent"?: Gassma.RelationOrderBy;
  "children"?: Gassma.RelationOrderBy;
  "_count"?: Gassma.RelationOrderBy;
};

declare type GassmaTestTagOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "name"?: "asc" | "desc" | Gassma.SortOrderInput;
  "posts"?: Gassma.RelationOrderBy;
  "_count"?: Gassma.RelationOrderBy;
};

declare type GassmaTestProductOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "name"?: "asc" | "desc" | Gassma.SortOrderInput;
  "price"?: "asc" | "desc" | Gassma.SortOrderInput;
  "stock"?: "asc" | "desc" | Gassma.SortOrderInput;
  "status"?: "asc" | "desc" | Gassma.SortOrderInput;
  "createdAt"?: "asc" | "desc" | Gassma.SortOrderInput;
  "orderItems"?: Gassma.RelationOrderBy;
  "_count"?: Gassma.RelationOrderBy;
};

declare type GassmaTestOrderOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "userId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "totalAmount"?: "asc" | "desc" | Gassma.SortOrderInput;
  "quantity"?: "asc" | "desc" | Gassma.SortOrderInput;
  "status"?: "asc" | "desc" | Gassma.SortOrderInput;
  "createdAt"?: "asc" | "desc" | Gassma.SortOrderInput;
  "user"?: Gassma.RelationOrderBy;
  "items"?: Gassma.RelationOrderBy;
  "_count"?: Gassma.RelationOrderBy;
};

declare type GassmaTestOrderItemOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "orderId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "productId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "quantity"?: "asc" | "desc" | Gassma.SortOrderInput;
  "unitPrice"?: "asc" | "desc" | Gassma.SortOrderInput;
  "order"?: Gassma.RelationOrderBy;
  "product"?: Gassma.RelationOrderBy;
  "_count"?: Gassma.RelationOrderBy;
};

declare type GassmaTestUserSelect = {
  "id"?: true;
  "email"?: true;
  "name"?: true;
  "age"?: true;
  "isActive"?: true;
  "role"?: true;
  "createdAt"?: true;
};

declare type GassmaTestProfileSelect = {
  "id"?: true;
  "bio"?: true;
  "website"?: true;
  "userId"?: true;
};

declare type GassmaTestPostSelect = {
  "id"?: true;
  "title"?: true;
  "content"?: true;
  "published"?: true;
  "viewCount"?: true;
  "rating"?: true;
  "authorId"?: true;
  "categoryId"?: true;
  "createdAt"?: true;
};

declare type GassmaTestCommentSelect = {
  "id"?: true;
  "text"?: true;
  "authorId"?: true;
  "postId"?: true;
  "createdAt"?: true;
};

declare type GassmaTestCategorySelect = {
  "id"?: true;
  "name"?: true;
  "parentId"?: true;
};

declare type GassmaTestTagSelect = {
  "id"?: true;
  "name"?: true;
};

declare type GassmaTestProductSelect = {
  "id"?: true;
  "name"?: true;
  "price"?: true;
  "stock"?: true;
  "status"?: true;
  "createdAt"?: true;
};

declare type GassmaTestOrderSelect = {
  "id"?: true;
  "userId"?: true;
  "totalAmount"?: true;
  "quantity"?: true;
  "status"?: true;
  "createdAt"?: true;
};

declare type GassmaTestOrderItemSelect = {
  "id"?: true;
  "orderId"?: true;
  "productId"?: true;
  "quantity"?: true;
  "unitPrice"?: true;
};

declare type GassmaTestUserOmit = {
  "id"?: true | false;
  "email"?: true | false;
  "name"?: true | false;
  "age"?: true | false;
  "isActive"?: true | false;
  "role"?: true | false;
  "createdAt"?: true | false;
};

declare type GassmaTestProfileOmit = {
  "id"?: true | false;
  "bio"?: true | false;
  "website"?: true | false;
  "userId"?: true | false;
};

declare type GassmaTestPostOmit = {
  "id"?: true | false;
  "title"?: true | false;
  "content"?: true | false;
  "published"?: true | false;
  "viewCount"?: true | false;
  "rating"?: true | false;
  "authorId"?: true | false;
  "categoryId"?: true | false;
  "createdAt"?: true | false;
};

declare type GassmaTestCommentOmit = {
  "id"?: true | false;
  "text"?: true | false;
  "authorId"?: true | false;
  "postId"?: true | false;
  "createdAt"?: true | false;
};

declare type GassmaTestCategoryOmit = {
  "id"?: true | false;
  "name"?: true | false;
  "parentId"?: true | false;
};

declare type GassmaTestTagOmit = {
  "id"?: true | false;
  "name"?: true | false;
};

declare type GassmaTestProductOmit = {
  "id"?: true | false;
  "name"?: true | false;
  "price"?: true | false;
  "stock"?: true | false;
  "status"?: true | false;
  "createdAt"?: true | false;
};

declare type GassmaTestOrderOmit = {
  "id"?: true | false;
  "userId"?: true | false;
  "totalAmount"?: true | false;
  "quantity"?: true | false;
  "status"?: true | false;
  "createdAt"?: true | false;
};

declare type GassmaTestOrderItemOmit = {
  "id"?: true | false;
  "orderId"?: true | false;
  "productId"?: true | false;
  "quantity"?: true | false;
  "unitPrice"?: true | false;
};

declare type GassmaTestUserCountData = {
  where?: GassmaTestUserWhereUse;
  orderBy?: GassmaTestUserOrderBy;
  take?: number;
  skip?: number;
};

declare type GassmaTestProfileCountData = {
  where?: GassmaTestProfileWhereUse;
  orderBy?: GassmaTestProfileOrderBy;
  take?: number;
  skip?: number;
};

declare type GassmaTestPostCountData = {
  where?: GassmaTestPostWhereUse;
  orderBy?: GassmaTestPostOrderBy;
  take?: number;
  skip?: number;
};

declare type GassmaTestCommentCountData = {
  where?: GassmaTestCommentWhereUse;
  orderBy?: GassmaTestCommentOrderBy;
  take?: number;
  skip?: number;
};

declare type GassmaTestCategoryCountData = {
  where?: GassmaTestCategoryWhereUse;
  orderBy?: GassmaTestCategoryOrderBy;
  take?: number;
  skip?: number;
};

declare type GassmaTestTagCountData = {
  where?: GassmaTestTagWhereUse;
  orderBy?: GassmaTestTagOrderBy;
  take?: number;
  skip?: number;
};

declare type GassmaTestProductCountData = {
  where?: GassmaTestProductWhereUse;
  orderBy?: GassmaTestProductOrderBy;
  take?: number;
  skip?: number;
};

declare type GassmaTestOrderCountData = {
  where?: GassmaTestOrderWhereUse;
  orderBy?: GassmaTestOrderOrderBy;
  take?: number;
  skip?: number;
};

declare type GassmaTestOrderItemCountData = {
  where?: GassmaTestOrderItemWhereUse;
  orderBy?: GassmaTestOrderItemOrderBy;
  take?: number;
  skip?: number;
};

declare type GassmaTestUserCreateReturn = {
 "id": number;
 "email": string;
 "name": string;
 "age": number | null;
 "isActive": boolean;
 "role": string | "admin" | "user" | "moderator";
 "createdAt": Date;
};

declare type GassmaTestProfileCreateReturn = {
 "id": number;
 "bio": string | null;
 "website": string | null;
 "userId": number;
};

declare type GassmaTestPostCreateReturn = {
 "id": number;
 "title": string;
 "content": string | number | null;
 "published": boolean;
 "viewCount": number;
 "rating": number | boolean | null;
 "authorId": number;
 "categoryId": number | null;
 "createdAt": Date;
};

declare type GassmaTestCommentCreateReturn = {
 "id": number;
 "text": string;
 "authorId": number;
 "postId": number;
 "createdAt": Date;
};

declare type GassmaTestCategoryCreateReturn = {
 "id": number;
 "name": string;
 "parentId": number | null;
};

declare type GassmaTestTagCreateReturn = {
 "id": number;
 "name": string;
};

declare type GassmaTestProductCreateReturn = {
 "id": number;
 "name": string;
 "price": number;
 "stock": number;
 "status": string | "available" | "soldout" | "discontinued";
 "createdAt": Date;
};

declare type GassmaTestOrderCreateReturn = {
 "id": number;
 "userId": number;
 "totalAmount": number;
 "quantity": number;
 "status": string | "pending" | "shipped" | "delivered" | "cancelled";
 "createdAt": Date;
};

declare type GassmaTestOrderItemCreateReturn = {
 "id": number;
 "orderId": number;
 "productId": number;
 "quantity": number;
 "unitPrice": number;
};

declare type GassmaTestUserDefaultFindResult = GassmaTestUserCreateReturn;

declare type GassmaTestProfileDefaultFindResult = GassmaTestProfileCreateReturn;

declare type GassmaTestPostDefaultFindResult = GassmaTestPostCreateReturn;

declare type GassmaTestCommentDefaultFindResult = GassmaTestCommentCreateReturn;

declare type GassmaTestCategoryDefaultFindResult = GassmaTestCategoryCreateReturn;

declare type GassmaTestTagDefaultFindResult = GassmaTestTagCreateReturn;

declare type GassmaTestProductDefaultFindResult = GassmaTestProductCreateReturn;

declare type GassmaTestOrderDefaultFindResult = GassmaTestOrderCreateReturn;

declare type GassmaTestOrderItemDefaultFindResult = GassmaTestOrderItemCreateReturn;

declare type GassmaTestUserFindResult<S, QO = undefined, GO = {}> = S extends GassmaTestUserSelect
  ? {
      [K in keyof S as S[K] extends true
        ? K & keyof GassmaTestUserDefaultFindResult
        : never]: GassmaTestUserDefaultFindResult[K & keyof GassmaTestUserDefaultFindResult];
    }
  : {
      [K in keyof GassmaTestUserDefaultFindResult as
        K extends Gassma.ResolveOmitKeys<GO, QO> ? never : K
      ]: GassmaTestUserDefaultFindResult[K];
    };

declare type GassmaTestProfileFindResult<S, QO = undefined, GO = {}> = S extends GassmaTestProfileSelect
  ? {
      [K in keyof S as S[K] extends true
        ? K & keyof GassmaTestProfileDefaultFindResult
        : never]: GassmaTestProfileDefaultFindResult[K & keyof GassmaTestProfileDefaultFindResult];
    }
  : {
      [K in keyof GassmaTestProfileDefaultFindResult as
        K extends Gassma.ResolveOmitKeys<GO, QO> ? never : K
      ]: GassmaTestProfileDefaultFindResult[K];
    };

declare type GassmaTestPostFindResult<S, QO = undefined, GO = {}> = S extends GassmaTestPostSelect
  ? {
      [K in keyof S as S[K] extends true
        ? K & keyof GassmaTestPostDefaultFindResult
        : never]: GassmaTestPostDefaultFindResult[K & keyof GassmaTestPostDefaultFindResult];
    }
  : {
      [K in keyof GassmaTestPostDefaultFindResult as
        K extends Gassma.ResolveOmitKeys<GO, QO> ? never : K
      ]: GassmaTestPostDefaultFindResult[K];
    };

declare type GassmaTestCommentFindResult<S, QO = undefined, GO = {}> = S extends GassmaTestCommentSelect
  ? {
      [K in keyof S as S[K] extends true
        ? K & keyof GassmaTestCommentDefaultFindResult
        : never]: GassmaTestCommentDefaultFindResult[K & keyof GassmaTestCommentDefaultFindResult];
    }
  : {
      [K in keyof GassmaTestCommentDefaultFindResult as
        K extends Gassma.ResolveOmitKeys<GO, QO> ? never : K
      ]: GassmaTestCommentDefaultFindResult[K];
    };

declare type GassmaTestCategoryFindResult<S, QO = undefined, GO = {}> = S extends GassmaTestCategorySelect
  ? {
      [K in keyof S as S[K] extends true
        ? K & keyof GassmaTestCategoryDefaultFindResult
        : never]: GassmaTestCategoryDefaultFindResult[K & keyof GassmaTestCategoryDefaultFindResult];
    }
  : {
      [K in keyof GassmaTestCategoryDefaultFindResult as
        K extends Gassma.ResolveOmitKeys<GO, QO> ? never : K
      ]: GassmaTestCategoryDefaultFindResult[K];
    };

declare type GassmaTestTagFindResult<S, QO = undefined, GO = {}> = S extends GassmaTestTagSelect
  ? {
      [K in keyof S as S[K] extends true
        ? K & keyof GassmaTestTagDefaultFindResult
        : never]: GassmaTestTagDefaultFindResult[K & keyof GassmaTestTagDefaultFindResult];
    }
  : {
      [K in keyof GassmaTestTagDefaultFindResult as
        K extends Gassma.ResolveOmitKeys<GO, QO> ? never : K
      ]: GassmaTestTagDefaultFindResult[K];
    };

declare type GassmaTestProductFindResult<S, QO = undefined, GO = {}> = S extends GassmaTestProductSelect
  ? {
      [K in keyof S as S[K] extends true
        ? K & keyof GassmaTestProductDefaultFindResult
        : never]: GassmaTestProductDefaultFindResult[K & keyof GassmaTestProductDefaultFindResult];
    }
  : {
      [K in keyof GassmaTestProductDefaultFindResult as
        K extends Gassma.ResolveOmitKeys<GO, QO> ? never : K
      ]: GassmaTestProductDefaultFindResult[K];
    };

declare type GassmaTestOrderFindResult<S, QO = undefined, GO = {}> = S extends GassmaTestOrderSelect
  ? {
      [K in keyof S as S[K] extends true
        ? K & keyof GassmaTestOrderDefaultFindResult
        : never]: GassmaTestOrderDefaultFindResult[K & keyof GassmaTestOrderDefaultFindResult];
    }
  : {
      [K in keyof GassmaTestOrderDefaultFindResult as
        K extends Gassma.ResolveOmitKeys<GO, QO> ? never : K
      ]: GassmaTestOrderDefaultFindResult[K];
    };

declare type GassmaTestOrderItemFindResult<S, QO = undefined, GO = {}> = S extends GassmaTestOrderItemSelect
  ? {
      [K in keyof S as S[K] extends true
        ? K & keyof GassmaTestOrderItemDefaultFindResult
        : never]: GassmaTestOrderItemDefaultFindResult[K & keyof GassmaTestOrderItemDefaultFindResult];
    }
  : {
      [K in keyof GassmaTestOrderItemDefaultFindResult as
        K extends Gassma.ResolveOmitKeys<GO, QO> ? never : K
      ]: GassmaTestOrderItemDefaultFindResult[K];
    };

declare type GassmaTestUserAggregateBaseReturn = {
  "id": number
  "email": string
  "name": string
  "age": number
  "isActive": boolean
  "role": string
  "createdAt": Date
};

declare type GassmaTestProfileAggregateBaseReturn = {
  "id": number
  "bio": string
  "website": string
  "userId": number
};

declare type GassmaTestPostAggregateBaseReturn = {
  "id": number
  "title": string
  "content": string
  "published": boolean
  "viewCount": number
  "rating": number
  "authorId": number
  "categoryId": number
  "createdAt": Date
};

declare type GassmaTestCommentAggregateBaseReturn = {
  "id": number
  "text": string
  "authorId": number
  "postId": number
  "createdAt": Date
};

declare type GassmaTestCategoryAggregateBaseReturn = {
  "id": number
  "name": string
  "parentId": number
};

declare type GassmaTestTagAggregateBaseReturn = {
  "id": number
  "name": string
};

declare type GassmaTestProductAggregateBaseReturn = {
  "id": number
  "name": string
  "price": number
  "stock": number
  "status": string
  "createdAt": Date
};

declare type GassmaTestOrderAggregateBaseReturn = {
  "id": number
  "userId": number
  "totalAmount": number
  "quantity": number
  "status": string
  "createdAt": Date
};

declare type GassmaTestOrderItemAggregateBaseReturn = {
  "id": number
  "orderId": number
  "productId": number
  "quantity": number
  "unitPrice": number
};

declare type GassmaTestUserAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : {
        [P in keyof T as T[P] extends true
          ? P & keyof GassmaTestUserAggregateBaseReturn
          : never]: GassmaTestUserAggregateBaseReturn[P & keyof GassmaTestUserAggregateBaseReturn];
      };

declare type GassmaTestProfileAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : {
        [P in keyof T as T[P] extends true
          ? P & keyof GassmaTestProfileAggregateBaseReturn
          : never]: GassmaTestProfileAggregateBaseReturn[P & keyof GassmaTestProfileAggregateBaseReturn];
      };

declare type GassmaTestPostAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : {
        [P in keyof T as T[P] extends true
          ? P & keyof GassmaTestPostAggregateBaseReturn
          : never]: GassmaTestPostAggregateBaseReturn[P & keyof GassmaTestPostAggregateBaseReturn];
      };

declare type GassmaTestCommentAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : {
        [P in keyof T as T[P] extends true
          ? P & keyof GassmaTestCommentAggregateBaseReturn
          : never]: GassmaTestCommentAggregateBaseReturn[P & keyof GassmaTestCommentAggregateBaseReturn];
      };

declare type GassmaTestCategoryAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : {
        [P in keyof T as T[P] extends true
          ? P & keyof GassmaTestCategoryAggregateBaseReturn
          : never]: GassmaTestCategoryAggregateBaseReturn[P & keyof GassmaTestCategoryAggregateBaseReturn];
      };

declare type GassmaTestTagAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : {
        [P in keyof T as T[P] extends true
          ? P & keyof GassmaTestTagAggregateBaseReturn
          : never]: GassmaTestTagAggregateBaseReturn[P & keyof GassmaTestTagAggregateBaseReturn];
      };

declare type GassmaTestProductAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : {
        [P in keyof T as T[P] extends true
          ? P & keyof GassmaTestProductAggregateBaseReturn
          : never]: GassmaTestProductAggregateBaseReturn[P & keyof GassmaTestProductAggregateBaseReturn];
      };

declare type GassmaTestOrderAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : {
        [P in keyof T as T[P] extends true
          ? P & keyof GassmaTestOrderAggregateBaseReturn
          : never]: GassmaTestOrderAggregateBaseReturn[P & keyof GassmaTestOrderAggregateBaseReturn];
      };

declare type GassmaTestOrderItemAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : {
        [P in keyof T as T[P] extends true
          ? P & keyof GassmaTestOrderItemAggregateBaseReturn
          : never]: GassmaTestOrderItemAggregateBaseReturn[P & keyof GassmaTestOrderItemAggregateBaseReturn];
      };

declare type GassmaTestUserAggregateResult<T extends GassmaTestUserAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaTestUserAggregateField<T[K], K> : never;
};

declare type GassmaTestProfileAggregateResult<T extends GassmaTestProfileAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaTestProfileAggregateField<T[K], K> : never;
};

declare type GassmaTestPostAggregateResult<T extends GassmaTestPostAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaTestPostAggregateField<T[K], K> : never;
};

declare type GassmaTestCommentAggregateResult<T extends GassmaTestCommentAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaTestCommentAggregateField<T[K], K> : never;
};

declare type GassmaTestCategoryAggregateResult<T extends GassmaTestCategoryAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaTestCategoryAggregateField<T[K], K> : never;
};

declare type GassmaTestTagAggregateResult<T extends GassmaTestTagAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaTestTagAggregateField<T[K], K> : never;
};

declare type GassmaTestProductAggregateResult<T extends GassmaTestProductAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaTestProductAggregateField<T[K], K> : never;
};

declare type GassmaTestOrderAggregateResult<T extends GassmaTestOrderAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaTestOrderAggregateField<T[K], K> : never;
};

declare type GassmaTestOrderItemAggregateResult<T extends GassmaTestOrderItemAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaTestOrderItemAggregateField<T[K], K> : never;
};

declare type GassmaTestUserGroupByBaseReturn = GassmaTestUserCreateReturn;

declare type GassmaTestProfileGroupByBaseReturn = GassmaTestProfileCreateReturn;

declare type GassmaTestPostGroupByBaseReturn = GassmaTestPostCreateReturn;

declare type GassmaTestCommentGroupByBaseReturn = GassmaTestCommentCreateReturn;

declare type GassmaTestCategoryGroupByBaseReturn = GassmaTestCategoryCreateReturn;

declare type GassmaTestTagGroupByBaseReturn = GassmaTestTagCreateReturn;

declare type GassmaTestProductGroupByBaseReturn = GassmaTestProductCreateReturn;

declare type GassmaTestOrderGroupByBaseReturn = GassmaTestOrderCreateReturn;

declare type GassmaTestOrderItemGroupByBaseReturn = GassmaTestOrderItemCreateReturn;

declare type GassmaTestUserGroupByKeyOfBaseReturn = keyof GassmaTestUserGroupByBaseReturn;

declare type GassmaTestProfileGroupByKeyOfBaseReturn = keyof GassmaTestProfileGroupByBaseReturn;

declare type GassmaTestPostGroupByKeyOfBaseReturn = keyof GassmaTestPostGroupByBaseReturn;

declare type GassmaTestCommentGroupByKeyOfBaseReturn = keyof GassmaTestCommentGroupByBaseReturn;

declare type GassmaTestCategoryGroupByKeyOfBaseReturn = keyof GassmaTestCategoryGroupByBaseReturn;

declare type GassmaTestTagGroupByKeyOfBaseReturn = keyof GassmaTestTagGroupByBaseReturn;

declare type GassmaTestProductGroupByKeyOfBaseReturn = keyof GassmaTestProductGroupByBaseReturn;

declare type GassmaTestOrderGroupByKeyOfBaseReturn = keyof GassmaTestOrderGroupByBaseReturn;

declare type GassmaTestOrderItemGroupByKeyOfBaseReturn = keyof GassmaTestOrderItemGroupByBaseReturn;

declare type GassmaTestUserByField<T extends GassmaTestUserGroupByKeyOfBaseReturn | GassmaTestUserGroupByKeyOfBaseReturn[]> =
  T extends GassmaTestUserGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaTestUserGroupByBaseReturn[K & keyof GassmaTestUserGroupByBaseReturn];
      }
    : T extends keyof GassmaTestUserGroupByBaseReturn
      ? { [K in T]: GassmaTestUserGroupByBaseReturn[K] }
      : never;

declare type GassmaTestProfileByField<T extends GassmaTestProfileGroupByKeyOfBaseReturn | GassmaTestProfileGroupByKeyOfBaseReturn[]> =
  T extends GassmaTestProfileGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaTestProfileGroupByBaseReturn[K & keyof GassmaTestProfileGroupByBaseReturn];
      }
    : T extends keyof GassmaTestProfileGroupByBaseReturn
      ? { [K in T]: GassmaTestProfileGroupByBaseReturn[K] }
      : never;

declare type GassmaTestPostByField<T extends GassmaTestPostGroupByKeyOfBaseReturn | GassmaTestPostGroupByKeyOfBaseReturn[]> =
  T extends GassmaTestPostGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaTestPostGroupByBaseReturn[K & keyof GassmaTestPostGroupByBaseReturn];
      }
    : T extends keyof GassmaTestPostGroupByBaseReturn
      ? { [K in T]: GassmaTestPostGroupByBaseReturn[K] }
      : never;

declare type GassmaTestCommentByField<T extends GassmaTestCommentGroupByKeyOfBaseReturn | GassmaTestCommentGroupByKeyOfBaseReturn[]> =
  T extends GassmaTestCommentGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaTestCommentGroupByBaseReturn[K & keyof GassmaTestCommentGroupByBaseReturn];
      }
    : T extends keyof GassmaTestCommentGroupByBaseReturn
      ? { [K in T]: GassmaTestCommentGroupByBaseReturn[K] }
      : never;

declare type GassmaTestCategoryByField<T extends GassmaTestCategoryGroupByKeyOfBaseReturn | GassmaTestCategoryGroupByKeyOfBaseReturn[]> =
  T extends GassmaTestCategoryGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaTestCategoryGroupByBaseReturn[K & keyof GassmaTestCategoryGroupByBaseReturn];
      }
    : T extends keyof GassmaTestCategoryGroupByBaseReturn
      ? { [K in T]: GassmaTestCategoryGroupByBaseReturn[K] }
      : never;

declare type GassmaTestTagByField<T extends GassmaTestTagGroupByKeyOfBaseReturn | GassmaTestTagGroupByKeyOfBaseReturn[]> =
  T extends GassmaTestTagGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaTestTagGroupByBaseReturn[K & keyof GassmaTestTagGroupByBaseReturn];
      }
    : T extends keyof GassmaTestTagGroupByBaseReturn
      ? { [K in T]: GassmaTestTagGroupByBaseReturn[K] }
      : never;

declare type GassmaTestProductByField<T extends GassmaTestProductGroupByKeyOfBaseReturn | GassmaTestProductGroupByKeyOfBaseReturn[]> =
  T extends GassmaTestProductGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaTestProductGroupByBaseReturn[K & keyof GassmaTestProductGroupByBaseReturn];
      }
    : T extends keyof GassmaTestProductGroupByBaseReturn
      ? { [K in T]: GassmaTestProductGroupByBaseReturn[K] }
      : never;

declare type GassmaTestOrderByField<T extends GassmaTestOrderGroupByKeyOfBaseReturn | GassmaTestOrderGroupByKeyOfBaseReturn[]> =
  T extends GassmaTestOrderGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaTestOrderGroupByBaseReturn[K & keyof GassmaTestOrderGroupByBaseReturn];
      }
    : T extends keyof GassmaTestOrderGroupByBaseReturn
      ? { [K in T]: GassmaTestOrderGroupByBaseReturn[K] }
      : never;

declare type GassmaTestOrderItemByField<T extends GassmaTestOrderItemGroupByKeyOfBaseReturn | GassmaTestOrderItemGroupByKeyOfBaseReturn[]> =
  T extends GassmaTestOrderItemGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaTestOrderItemGroupByBaseReturn[K & keyof GassmaTestOrderItemGroupByBaseReturn];
      }
    : T extends keyof GassmaTestOrderItemGroupByBaseReturn
      ? { [K in T]: GassmaTestOrderItemGroupByBaseReturn[K] }
      : never;

declare type GassmaTestUserGroupByResult<T extends GassmaTestUserGroupByData> = GassmaTestUserByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaTestUserAggregateField<T[K], K> : never;
};

declare type GassmaTestProfileGroupByResult<T extends GassmaTestProfileGroupByData> = GassmaTestProfileByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaTestProfileAggregateField<T[K], K> : never;
};

declare type GassmaTestPostGroupByResult<T extends GassmaTestPostGroupByData> = GassmaTestPostByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaTestPostAggregateField<T[K], K> : never;
};

declare type GassmaTestCommentGroupByResult<T extends GassmaTestCommentGroupByData> = GassmaTestCommentByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaTestCommentAggregateField<T[K], K> : never;
};

declare type GassmaTestCategoryGroupByResult<T extends GassmaTestCategoryGroupByData> = GassmaTestCategoryByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaTestCategoryAggregateField<T[K], K> : never;
};

declare type GassmaTestTagGroupByResult<T extends GassmaTestTagGroupByData> = GassmaTestTagByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaTestTagAggregateField<T[K], K> : never;
};

declare type GassmaTestProductGroupByResult<T extends GassmaTestProductGroupByData> = GassmaTestProductByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaTestProductAggregateField<T[K], K> : never;
};

declare type GassmaTestOrderGroupByResult<T extends GassmaTestOrderGroupByData> = GassmaTestOrderByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaTestOrderAggregateField<T[K], K> : never;
};

declare type GassmaTestOrderItemGroupByResult<T extends GassmaTestOrderItemGroupByData> = GassmaTestOrderItemByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaTestOrderItemAggregateField<T[K], K> : never;
};
