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
    "Gassma": {
      options: GassmaGassmaClientOptions;
      globalOmitConfig: GassmaGassmaGlobalOmitConfig;
    };
  }
}

export type GassmaGassmaGlobalOmitConfig = {
  "Post"?: GassmaGassmaPostOmit;
  "Comment"?: GassmaGassmaCommentOmit;
  "Category"?: GassmaGassmaCategoryOmit;
  "Tag"?: GassmaGassmaTagOmit;
  "Product"?: GassmaGassmaProductOmit;
  "Order"?: GassmaGassmaOrderOmit;
  "OrderItem"?: GassmaGassmaOrderItemOmit;
  "Notification"?: GassmaGassmaNotificationOmit;
  "User"?: GassmaGassmaUserOmit;
  "Profile"?: GassmaGassmaProfileOmit;
};

export type GassmaGassmaDefaultsConfig = {
  "Post"?: {
    "published"?: boolean | (() => boolean);
    "viewCount"?: number | (() => number);
    "createdAt"?: Date | (() => Date);
  };
  "Comment"?: {
    "createdAt"?: Date | (() => Date);
  };
  "Product"?: {
    "createdAt"?: Date | (() => Date);
  };
  "Order"?: {
    "createdAt"?: Date | (() => Date);
  };
  "Notification"?: {
    "isRead"?: boolean | (() => boolean);
  };
  "User"?: {
    "isActive"?: boolean | (() => boolean);
    "createdAt"?: Date | (() => Date);
  };
};

export type GassmaGassmaUpdatedAtConfig = {
  "Post"?: "id" | "title" | "content" | "published" | "viewCount" | "rating" | "authorId" | "categoryId" | "createdAt" | "updatedAt" | ("id" | "title" | "content" | "published" | "viewCount" | "rating" | "authorId" | "categoryId" | "createdAt" | "updatedAt")[];
  "Product"?: "id" | "name" | "price" | "stock" | "status" | "createdAt" | "updatedAt" | ("id" | "name" | "price" | "stock" | "status" | "createdAt" | "updatedAt")[];
};

export type GassmaGassmaIgnoreConfig = {
  "Post"?: "id" | "title" | "content" | "published" | "viewCount" | "rating" | "authorId" | "categoryId" | "createdAt" | "updatedAt" | ("id" | "title" | "content" | "published" | "viewCount" | "rating" | "authorId" | "categoryId" | "createdAt" | "updatedAt")[];
  "Comment"?: "id" | "text" | "authorId" | "postId" | "createdAt" | ("id" | "text" | "authorId" | "postId" | "createdAt")[];
  "Category"?: "id" | "name" | "parentId" | ("id" | "name" | "parentId")[];
  "Tag"?: "id" | "name" | ("id" | "name")[];
  "Product"?: "id" | "name" | "price" | "stock" | "status" | "createdAt" | "updatedAt" | ("id" | "name" | "price" | "stock" | "status" | "createdAt" | "updatedAt")[];
  "Order"?: "id" | "userId" | "totalAmount" | "quantity" | "status" | "createdAt" | ("id" | "userId" | "totalAmount" | "quantity" | "status" | "createdAt")[];
  "OrderItem"?: "id" | "orderId" | "productId" | "quantity" | "unitPrice" | ("id" | "orderId" | "productId" | "quantity" | "unitPrice")[];
  "Notification"?: "id" | "userId" | "message" | "isRead" | ("id" | "userId" | "message" | "isRead")[];
  "User"?: "id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt" | ("id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt")[];
  "Profile"?: "id" | "bio" | "website" | "userId" | ("id" | "bio" | "website" | "userId")[];
};

export type GassmaGassmaIgnoreSheetsConfig = "Post" | "Comment" | "Category" | "Tag" | "Product" | "Order" | "OrderItem" | "Notification" | "User" | "Profile" | ("Post" | "Comment" | "Category" | "Tag" | "Product" | "Order" | "OrderItem" | "Notification" | "User" | "Profile")[];

export type GassmaGassmaMapConfig = {
  "Post"?: {
      "id"?: string;
      "title"?: string;
      "content"?: string;
      "published"?: string;
      "viewCount"?: string;
      "rating"?: string;
      "authorId"?: string;
      "categoryId"?: string;
      "createdAt"?: string;
      "updatedAt"?: string;
  };
  "Comment"?: {
      "id"?: string;
      "text"?: string;
      "authorId"?: string;
      "postId"?: string;
      "createdAt"?: string;
  };
  "Category"?: {
      "id"?: string;
      "name"?: string;
      "parentId"?: string;
  };
  "Tag"?: {
      "id"?: string;
      "name"?: string;
  };
  "Product"?: {
      "id"?: string;
      "name"?: string;
      "price"?: string;
      "stock"?: string;
      "status"?: string;
      "createdAt"?: string;
      "updatedAt"?: string;
  };
  "Order"?: {
      "id"?: string;
      "userId"?: string;
      "totalAmount"?: string;
      "quantity"?: string;
      "status"?: string;
      "createdAt"?: string;
  };
  "OrderItem"?: {
      "id"?: string;
      "orderId"?: string;
      "productId"?: string;
      "quantity"?: string;
      "unitPrice"?: string;
  };
  "Notification"?: {
      "id"?: string;
      "userId"?: string;
      "message"?: string;
      "isRead"?: string;
  };
  "User"?: {
      "id"?: string;
      "email"?: string;
      "name"?: string;
      "age"?: string;
      "isActive"?: string;
      "role"?: string;
      "createdAt"?: string;
  };
  "Profile"?: {
      "id"?: string;
      "bio"?: string;
      "website"?: string;
      "userId"?: string;
  };
};

export type GassmaGassmaMapSheetsConfig = {
  "Post"?: string;
  "Comment"?: string;
  "Category"?: string;
  "Tag"?: string;
  "Product"?: string;
  "Order"?: string;
  "OrderItem"?: string;
  "Notification"?: string;
  "User"?: string;
  "Profile"?: string;
};

export type GassmaGassmaAutoincrementConfig = {
  "Post"?: "id" | "title" | "content" | "published" | "viewCount" | "rating" | "authorId" | "categoryId" | "createdAt" | "updatedAt" | ("id" | "title" | "content" | "published" | "viewCount" | "rating" | "authorId" | "categoryId" | "createdAt" | "updatedAt")[];
  "Comment"?: "id" | "text" | "authorId" | "postId" | "createdAt" | ("id" | "text" | "authorId" | "postId" | "createdAt")[];
  "Category"?: "id" | "name" | "parentId" | ("id" | "name" | "parentId")[];
  "Tag"?: "id" | "name" | ("id" | "name")[];
  "Product"?: "id" | "name" | "price" | "stock" | "status" | "createdAt" | "updatedAt" | ("id" | "name" | "price" | "stock" | "status" | "createdAt" | "updatedAt")[];
  "Order"?: "id" | "userId" | "totalAmount" | "quantity" | "status" | "createdAt" | ("id" | "userId" | "totalAmount" | "quantity" | "status" | "createdAt")[];
  "OrderItem"?: "id" | "orderId" | "productId" | "quantity" | "unitPrice" | ("id" | "orderId" | "productId" | "quantity" | "unitPrice")[];
  "Notification"?: "id" | "userId" | "message" | "isRead" | ("id" | "userId" | "message" | "isRead")[];
  "User"?: "id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt" | ("id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt")[];
  "Profile"?: "id" | "bio" | "website" | "userId" | ("id" | "bio" | "website" | "userId")[];
};

export type GassmaGassmaClientOptions<O extends GassmaGassmaGlobalOmitConfig = {}> = {
  id?: string;
  relations?: Gassma.RelationsConfig;
  omit?: O;
  defaults?: GassmaGassmaDefaultsConfig;
  updatedAt?: GassmaGassmaUpdatedAtConfig;
  autoincrement?: GassmaGassmaAutoincrementConfig;
  ignore?: GassmaGassmaIgnoreConfig;
  ignoreSheets?: GassmaGassmaIgnoreSheetsConfig;
  map?: GassmaGassmaMapConfig;
  mapSheets?: GassmaGassmaMapSheetsConfig;
};

export type GassmaGassmaSheet<O extends GassmaGassmaGlobalOmitConfig = {}> = {
  "Post": GassmaGassmaPostController<O extends { "Post": infer UO } ? UO extends GassmaGassmaPostOmit ? UO : {} : {}>;
  "Comment": GassmaGassmaCommentController<O extends { "Comment": infer UO } ? UO extends GassmaGassmaCommentOmit ? UO : {} : {}>;
  "Category": GassmaGassmaCategoryController<O extends { "Category": infer UO } ? UO extends GassmaGassmaCategoryOmit ? UO : {} : {}>;
  "Tag": GassmaGassmaTagController<O extends { "Tag": infer UO } ? UO extends GassmaGassmaTagOmit ? UO : {} : {}>;
  "Product": GassmaGassmaProductController<O extends { "Product": infer UO } ? UO extends GassmaGassmaProductOmit ? UO : {} : {}>;
  "Order": GassmaGassmaOrderController<O extends { "Order": infer UO } ? UO extends GassmaGassmaOrderOmit ? UO : {} : {}>;
  "OrderItem": GassmaGassmaOrderItemController<O extends { "OrderItem": infer UO } ? UO extends GassmaGassmaOrderItemOmit ? UO : {} : {}>;
  "Notification": GassmaGassmaNotificationController<O extends { "Notification": infer UO } ? UO extends GassmaGassmaNotificationOmit ? UO : {} : {}>;
  "User": GassmaGassmaUserController<O extends { "User": infer UO } ? UO extends GassmaGassmaUserOmit ? UO : {} : {}>;
  "Profile": GassmaGassmaProfileController<O extends { "Profile": infer UO } ? UO extends GassmaGassmaProfileOmit ? UO : {} : {}>;
};

export declare class GassmaGassmaPostController<GO extends GassmaGassmaPostOmit = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnNumber: number,
    endColumnNumber: number
  ): void;
  createMany(createdData: GassmaGassmaPostCreateManyData): CreateManyReturn;
  createManyAndReturn<T extends GassmaGassmaPostCreateManyAndReturnData>(createdData: T): GassmaGassmaPostFindResult<T["select"], T["omit"], GO>[];
  create<T extends GassmaGassmaPostCreateData>(createdData: T): GassmaGassmaPostFindResult<T["select"], T["omit"], GO>;
  findFirst<T extends GassmaGassmaPostFindFirstData>(findData: T): GassmaGassmaPostFindResult<T["select"], T["omit"], GO> | null;
  findFirstOrThrow<T extends GassmaGassmaPostFindFirstData>(findData: T): GassmaGassmaPostFindResult<T["select"], T["omit"], GO>;
  findMany<T extends GassmaGassmaPostFindManyData>(findData: T): GassmaGassmaPostFindResult<T["select"], T["omit"], GO>[];
  update<T extends GassmaGassmaPostUpdateSingleData>(updateData: T): GassmaGassmaPostFindResult<T["select"], T["omit"], GO> | null;
  updateMany(updateData: GassmaGassmaPostUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaGassmaPostUpdateData): GassmaGassmaPostDefaultFindResult[];
  upsert<T extends GassmaGassmaPostUpsertSingleData>(upsertData: T): GassmaGassmaPostFindResult<T["select"], T["omit"], GO>;
  delete<T extends GassmaGassmaPostDeleteSingleData>(deleteData: T): GassmaGassmaPostFindResult<T["select"], T["omit"], GO> | null;
  deleteMany(deleteData: GassmaGassmaPostDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaGassmaPostAggregateData>(aggregateData: T): GassmaGassmaPostAggregateResult<T>;
  count(coutData: GassmaGassmaPostCountData): number;
  groupBy<T extends GassmaGassmaPostGroupByData>(groupByData: T): GassmaGassmaPostGroupByResult<T>[];
}

export declare class GassmaGassmaCommentController<GO extends GassmaGassmaCommentOmit = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnNumber: number,
    endColumnNumber: number
  ): void;
  createMany(createdData: GassmaGassmaCommentCreateManyData): CreateManyReturn;
  createManyAndReturn<T extends GassmaGassmaCommentCreateManyAndReturnData>(createdData: T): GassmaGassmaCommentFindResult<T["select"], T["omit"], GO>[];
  create<T extends GassmaGassmaCommentCreateData>(createdData: T): GassmaGassmaCommentFindResult<T["select"], T["omit"], GO>;
  findFirst<T extends GassmaGassmaCommentFindFirstData>(findData: T): GassmaGassmaCommentFindResult<T["select"], T["omit"], GO> | null;
  findFirstOrThrow<T extends GassmaGassmaCommentFindFirstData>(findData: T): GassmaGassmaCommentFindResult<T["select"], T["omit"], GO>;
  findMany<T extends GassmaGassmaCommentFindManyData>(findData: T): GassmaGassmaCommentFindResult<T["select"], T["omit"], GO>[];
  update<T extends GassmaGassmaCommentUpdateSingleData>(updateData: T): GassmaGassmaCommentFindResult<T["select"], T["omit"], GO> | null;
  updateMany(updateData: GassmaGassmaCommentUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaGassmaCommentUpdateData): GassmaGassmaCommentDefaultFindResult[];
  upsert<T extends GassmaGassmaCommentUpsertSingleData>(upsertData: T): GassmaGassmaCommentFindResult<T["select"], T["omit"], GO>;
  delete<T extends GassmaGassmaCommentDeleteSingleData>(deleteData: T): GassmaGassmaCommentFindResult<T["select"], T["omit"], GO> | null;
  deleteMany(deleteData: GassmaGassmaCommentDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaGassmaCommentAggregateData>(aggregateData: T): GassmaGassmaCommentAggregateResult<T>;
  count(coutData: GassmaGassmaCommentCountData): number;
  groupBy<T extends GassmaGassmaCommentGroupByData>(groupByData: T): GassmaGassmaCommentGroupByResult<T>[];
}

export declare class GassmaGassmaCategoryController<GO extends GassmaGassmaCategoryOmit = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnNumber: number,
    endColumnNumber: number
  ): void;
  createMany(createdData: GassmaGassmaCategoryCreateManyData): CreateManyReturn;
  createManyAndReturn<T extends GassmaGassmaCategoryCreateManyAndReturnData>(createdData: T): GassmaGassmaCategoryFindResult<T["select"], T["omit"], GO>[];
  create<T extends GassmaGassmaCategoryCreateData>(createdData: T): GassmaGassmaCategoryFindResult<T["select"], T["omit"], GO>;
  findFirst<T extends GassmaGassmaCategoryFindFirstData>(findData: T): GassmaGassmaCategoryFindResult<T["select"], T["omit"], GO> | null;
  findFirstOrThrow<T extends GassmaGassmaCategoryFindFirstData>(findData: T): GassmaGassmaCategoryFindResult<T["select"], T["omit"], GO>;
  findMany<T extends GassmaGassmaCategoryFindManyData>(findData: T): GassmaGassmaCategoryFindResult<T["select"], T["omit"], GO>[];
  update<T extends GassmaGassmaCategoryUpdateSingleData>(updateData: T): GassmaGassmaCategoryFindResult<T["select"], T["omit"], GO> | null;
  updateMany(updateData: GassmaGassmaCategoryUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaGassmaCategoryUpdateData): GassmaGassmaCategoryDefaultFindResult[];
  upsert<T extends GassmaGassmaCategoryUpsertSingleData>(upsertData: T): GassmaGassmaCategoryFindResult<T["select"], T["omit"], GO>;
  delete<T extends GassmaGassmaCategoryDeleteSingleData>(deleteData: T): GassmaGassmaCategoryFindResult<T["select"], T["omit"], GO> | null;
  deleteMany(deleteData: GassmaGassmaCategoryDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaGassmaCategoryAggregateData>(aggregateData: T): GassmaGassmaCategoryAggregateResult<T>;
  count(coutData: GassmaGassmaCategoryCountData): number;
  groupBy<T extends GassmaGassmaCategoryGroupByData>(groupByData: T): GassmaGassmaCategoryGroupByResult<T>[];
}

export declare class GassmaGassmaTagController<GO extends GassmaGassmaTagOmit = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnNumber: number,
    endColumnNumber: number
  ): void;
  createMany(createdData: GassmaGassmaTagCreateManyData): CreateManyReturn;
  createManyAndReturn<T extends GassmaGassmaTagCreateManyAndReturnData>(createdData: T): GassmaGassmaTagFindResult<T["select"], T["omit"], GO>[];
  create<T extends GassmaGassmaTagCreateData>(createdData: T): GassmaGassmaTagFindResult<T["select"], T["omit"], GO>;
  findFirst<T extends GassmaGassmaTagFindFirstData>(findData: T): GassmaGassmaTagFindResult<T["select"], T["omit"], GO> | null;
  findFirstOrThrow<T extends GassmaGassmaTagFindFirstData>(findData: T): GassmaGassmaTagFindResult<T["select"], T["omit"], GO>;
  findMany<T extends GassmaGassmaTagFindManyData>(findData: T): GassmaGassmaTagFindResult<T["select"], T["omit"], GO>[];
  update<T extends GassmaGassmaTagUpdateSingleData>(updateData: T): GassmaGassmaTagFindResult<T["select"], T["omit"], GO> | null;
  updateMany(updateData: GassmaGassmaTagUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaGassmaTagUpdateData): GassmaGassmaTagDefaultFindResult[];
  upsert<T extends GassmaGassmaTagUpsertSingleData>(upsertData: T): GassmaGassmaTagFindResult<T["select"], T["omit"], GO>;
  delete<T extends GassmaGassmaTagDeleteSingleData>(deleteData: T): GassmaGassmaTagFindResult<T["select"], T["omit"], GO> | null;
  deleteMany(deleteData: GassmaGassmaTagDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaGassmaTagAggregateData>(aggregateData: T): GassmaGassmaTagAggregateResult<T>;
  count(coutData: GassmaGassmaTagCountData): number;
  groupBy<T extends GassmaGassmaTagGroupByData>(groupByData: T): GassmaGassmaTagGroupByResult<T>[];
}

export declare class GassmaGassmaProductController<GO extends GassmaGassmaProductOmit = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnNumber: number,
    endColumnNumber: number
  ): void;
  createMany(createdData: GassmaGassmaProductCreateManyData): CreateManyReturn;
  createManyAndReturn<T extends GassmaGassmaProductCreateManyAndReturnData>(createdData: T): GassmaGassmaProductFindResult<T["select"], T["omit"], GO>[];
  create<T extends GassmaGassmaProductCreateData>(createdData: T): GassmaGassmaProductFindResult<T["select"], T["omit"], GO>;
  findFirst<T extends GassmaGassmaProductFindFirstData>(findData: T): GassmaGassmaProductFindResult<T["select"], T["omit"], GO> | null;
  findFirstOrThrow<T extends GassmaGassmaProductFindFirstData>(findData: T): GassmaGassmaProductFindResult<T["select"], T["omit"], GO>;
  findMany<T extends GassmaGassmaProductFindManyData>(findData: T): GassmaGassmaProductFindResult<T["select"], T["omit"], GO>[];
  update<T extends GassmaGassmaProductUpdateSingleData>(updateData: T): GassmaGassmaProductFindResult<T["select"], T["omit"], GO> | null;
  updateMany(updateData: GassmaGassmaProductUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaGassmaProductUpdateData): GassmaGassmaProductDefaultFindResult[];
  upsert<T extends GassmaGassmaProductUpsertSingleData>(upsertData: T): GassmaGassmaProductFindResult<T["select"], T["omit"], GO>;
  delete<T extends GassmaGassmaProductDeleteSingleData>(deleteData: T): GassmaGassmaProductFindResult<T["select"], T["omit"], GO> | null;
  deleteMany(deleteData: GassmaGassmaProductDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaGassmaProductAggregateData>(aggregateData: T): GassmaGassmaProductAggregateResult<T>;
  count(coutData: GassmaGassmaProductCountData): number;
  groupBy<T extends GassmaGassmaProductGroupByData>(groupByData: T): GassmaGassmaProductGroupByResult<T>[];
}

export declare class GassmaGassmaOrderController<GO extends GassmaGassmaOrderOmit = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnNumber: number,
    endColumnNumber: number
  ): void;
  createMany(createdData: GassmaGassmaOrderCreateManyData): CreateManyReturn;
  createManyAndReturn<T extends GassmaGassmaOrderCreateManyAndReturnData>(createdData: T): GassmaGassmaOrderFindResult<T["select"], T["omit"], GO>[];
  create<T extends GassmaGassmaOrderCreateData>(createdData: T): GassmaGassmaOrderFindResult<T["select"], T["omit"], GO>;
  findFirst<T extends GassmaGassmaOrderFindFirstData>(findData: T): GassmaGassmaOrderFindResult<T["select"], T["omit"], GO> | null;
  findFirstOrThrow<T extends GassmaGassmaOrderFindFirstData>(findData: T): GassmaGassmaOrderFindResult<T["select"], T["omit"], GO>;
  findMany<T extends GassmaGassmaOrderFindManyData>(findData: T): GassmaGassmaOrderFindResult<T["select"], T["omit"], GO>[];
  update<T extends GassmaGassmaOrderUpdateSingleData>(updateData: T): GassmaGassmaOrderFindResult<T["select"], T["omit"], GO> | null;
  updateMany(updateData: GassmaGassmaOrderUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaGassmaOrderUpdateData): GassmaGassmaOrderDefaultFindResult[];
  upsert<T extends GassmaGassmaOrderUpsertSingleData>(upsertData: T): GassmaGassmaOrderFindResult<T["select"], T["omit"], GO>;
  delete<T extends GassmaGassmaOrderDeleteSingleData>(deleteData: T): GassmaGassmaOrderFindResult<T["select"], T["omit"], GO> | null;
  deleteMany(deleteData: GassmaGassmaOrderDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaGassmaOrderAggregateData>(aggregateData: T): GassmaGassmaOrderAggregateResult<T>;
  count(coutData: GassmaGassmaOrderCountData): number;
  groupBy<T extends GassmaGassmaOrderGroupByData>(groupByData: T): GassmaGassmaOrderGroupByResult<T>[];
}

export declare class GassmaGassmaOrderItemController<GO extends GassmaGassmaOrderItemOmit = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnNumber: number,
    endColumnNumber: number
  ): void;
  createMany(createdData: GassmaGassmaOrderItemCreateManyData): CreateManyReturn;
  createManyAndReturn<T extends GassmaGassmaOrderItemCreateManyAndReturnData>(createdData: T): GassmaGassmaOrderItemFindResult<T["select"], T["omit"], GO>[];
  create<T extends GassmaGassmaOrderItemCreateData>(createdData: T): GassmaGassmaOrderItemFindResult<T["select"], T["omit"], GO>;
  findFirst<T extends GassmaGassmaOrderItemFindFirstData>(findData: T): GassmaGassmaOrderItemFindResult<T["select"], T["omit"], GO> | null;
  findFirstOrThrow<T extends GassmaGassmaOrderItemFindFirstData>(findData: T): GassmaGassmaOrderItemFindResult<T["select"], T["omit"], GO>;
  findMany<T extends GassmaGassmaOrderItemFindManyData>(findData: T): GassmaGassmaOrderItemFindResult<T["select"], T["omit"], GO>[];
  update<T extends GassmaGassmaOrderItemUpdateSingleData>(updateData: T): GassmaGassmaOrderItemFindResult<T["select"], T["omit"], GO> | null;
  updateMany(updateData: GassmaGassmaOrderItemUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaGassmaOrderItemUpdateData): GassmaGassmaOrderItemDefaultFindResult[];
  upsert<T extends GassmaGassmaOrderItemUpsertSingleData>(upsertData: T): GassmaGassmaOrderItemFindResult<T["select"], T["omit"], GO>;
  delete<T extends GassmaGassmaOrderItemDeleteSingleData>(deleteData: T): GassmaGassmaOrderItemFindResult<T["select"], T["omit"], GO> | null;
  deleteMany(deleteData: GassmaGassmaOrderItemDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaGassmaOrderItemAggregateData>(aggregateData: T): GassmaGassmaOrderItemAggregateResult<T>;
  count(coutData: GassmaGassmaOrderItemCountData): number;
  groupBy<T extends GassmaGassmaOrderItemGroupByData>(groupByData: T): GassmaGassmaOrderItemGroupByResult<T>[];
}

export declare class GassmaGassmaNotificationController<GO extends GassmaGassmaNotificationOmit = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnNumber: number,
    endColumnNumber: number
  ): void;
  createMany(createdData: GassmaGassmaNotificationCreateManyData): CreateManyReturn;
  createManyAndReturn<T extends GassmaGassmaNotificationCreateManyAndReturnData>(createdData: T): GassmaGassmaNotificationFindResult<T["select"], T["omit"], GO>[];
  create<T extends GassmaGassmaNotificationCreateData>(createdData: T): GassmaGassmaNotificationFindResult<T["select"], T["omit"], GO>;
  findFirst<T extends GassmaGassmaNotificationFindFirstData>(findData: T): GassmaGassmaNotificationFindResult<T["select"], T["omit"], GO> | null;
  findFirstOrThrow<T extends GassmaGassmaNotificationFindFirstData>(findData: T): GassmaGassmaNotificationFindResult<T["select"], T["omit"], GO>;
  findMany<T extends GassmaGassmaNotificationFindManyData>(findData: T): GassmaGassmaNotificationFindResult<T["select"], T["omit"], GO>[];
  update<T extends GassmaGassmaNotificationUpdateSingleData>(updateData: T): GassmaGassmaNotificationFindResult<T["select"], T["omit"], GO> | null;
  updateMany(updateData: GassmaGassmaNotificationUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaGassmaNotificationUpdateData): GassmaGassmaNotificationDefaultFindResult[];
  upsert<T extends GassmaGassmaNotificationUpsertSingleData>(upsertData: T): GassmaGassmaNotificationFindResult<T["select"], T["omit"], GO>;
  delete<T extends GassmaGassmaNotificationDeleteSingleData>(deleteData: T): GassmaGassmaNotificationFindResult<T["select"], T["omit"], GO> | null;
  deleteMany(deleteData: GassmaGassmaNotificationDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaGassmaNotificationAggregateData>(aggregateData: T): GassmaGassmaNotificationAggregateResult<T>;
  count(coutData: GassmaGassmaNotificationCountData): number;
  groupBy<T extends GassmaGassmaNotificationGroupByData>(groupByData: T): GassmaGassmaNotificationGroupByResult<T>[];
}

export declare class GassmaGassmaUserController<GO extends GassmaGassmaUserOmit = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnNumber: number,
    endColumnNumber: number
  ): void;
  createMany(createdData: GassmaGassmaUserCreateManyData): CreateManyReturn;
  createManyAndReturn<T extends GassmaGassmaUserCreateManyAndReturnData>(createdData: T): GassmaGassmaUserFindResult<T["select"], T["omit"], GO>[];
  create<T extends GassmaGassmaUserCreateData>(createdData: T): GassmaGassmaUserFindResult<T["select"], T["omit"], GO>;
  findFirst<T extends GassmaGassmaUserFindFirstData>(findData: T): GassmaGassmaUserFindResult<T["select"], T["omit"], GO> | null;
  findFirstOrThrow<T extends GassmaGassmaUserFindFirstData>(findData: T): GassmaGassmaUserFindResult<T["select"], T["omit"], GO>;
  findMany<T extends GassmaGassmaUserFindManyData>(findData: T): GassmaGassmaUserFindResult<T["select"], T["omit"], GO>[];
  update<T extends GassmaGassmaUserUpdateSingleData>(updateData: T): GassmaGassmaUserFindResult<T["select"], T["omit"], GO> | null;
  updateMany(updateData: GassmaGassmaUserUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaGassmaUserUpdateData): GassmaGassmaUserDefaultFindResult[];
  upsert<T extends GassmaGassmaUserUpsertSingleData>(upsertData: T): GassmaGassmaUserFindResult<T["select"], T["omit"], GO>;
  delete<T extends GassmaGassmaUserDeleteSingleData>(deleteData: T): GassmaGassmaUserFindResult<T["select"], T["omit"], GO> | null;
  deleteMany(deleteData: GassmaGassmaUserDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaGassmaUserAggregateData>(aggregateData: T): GassmaGassmaUserAggregateResult<T>;
  count(coutData: GassmaGassmaUserCountData): number;
  groupBy<T extends GassmaGassmaUserGroupByData>(groupByData: T): GassmaGassmaUserGroupByResult<T>[];
}

export declare class GassmaGassmaProfileController<GO extends GassmaGassmaProfileOmit = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnNumber: number,
    endColumnNumber: number
  ): void;
  createMany(createdData: GassmaGassmaProfileCreateManyData): CreateManyReturn;
  createManyAndReturn<T extends GassmaGassmaProfileCreateManyAndReturnData>(createdData: T): GassmaGassmaProfileFindResult<T["select"], T["omit"], GO>[];
  create<T extends GassmaGassmaProfileCreateData>(createdData: T): GassmaGassmaProfileFindResult<T["select"], T["omit"], GO>;
  findFirst<T extends GassmaGassmaProfileFindFirstData>(findData: T): GassmaGassmaProfileFindResult<T["select"], T["omit"], GO> | null;
  findFirstOrThrow<T extends GassmaGassmaProfileFindFirstData>(findData: T): GassmaGassmaProfileFindResult<T["select"], T["omit"], GO>;
  findMany<T extends GassmaGassmaProfileFindManyData>(findData: T): GassmaGassmaProfileFindResult<T["select"], T["omit"], GO>[];
  update<T extends GassmaGassmaProfileUpdateSingleData>(updateData: T): GassmaGassmaProfileFindResult<T["select"], T["omit"], GO> | null;
  updateMany(updateData: GassmaGassmaProfileUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaGassmaProfileUpdateData): GassmaGassmaProfileDefaultFindResult[];
  upsert<T extends GassmaGassmaProfileUpsertSingleData>(upsertData: T): GassmaGassmaProfileFindResult<T["select"], T["omit"], GO>;
  delete<T extends GassmaGassmaProfileDeleteSingleData>(deleteData: T): GassmaGassmaProfileFindResult<T["select"], T["omit"], GO> | null;
  deleteMany(deleteData: GassmaGassmaProfileDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaGassmaProfileAggregateData>(aggregateData: T): GassmaGassmaProfileAggregateResult<T>;
  count(coutData: GassmaGassmaProfileCountData): number;
  groupBy<T extends GassmaGassmaProfileGroupByData>(groupByData: T): GassmaGassmaProfileGroupByResult<T>[];
}

export type ManyReturn = {
  count: number;
};

export type CreateManyReturn = ManyReturn;
export type UpdateManyReturn = ManyReturn;
export type DeleteManyReturn = ManyReturn;

export type GassmaGassmaPostUse = {
  "id"?: number;
  "title": string;
  "content"?: string | number;
  "published"?: boolean;
  "viewCount"?: number;
  "rating"?: number | boolean;
  "authorId": number;
  "categoryId"?: number;
  "createdAt"?: Date;
  "updatedAt"?: Date;
};

export type GassmaGassmaCommentUse = {
  "id"?: number;
  "text": string;
  "authorId": number;
  "postId": number;
  "createdAt"?: Date;
};

export type GassmaGassmaCategoryUse = {
  "id"?: number;
  "name": string;
  "parentId"?: number;
};

export type GassmaGassmaTagUse = {
  "id"?: number;
  "name": string;
};

export type GassmaGassmaProductUse = {
  "id"?: number;
  "name": string;
  "price": number;
  "stock": number;
  "status": "available" | "soldout" | "discontinued";
  "createdAt"?: Date;
  "updatedAt"?: Date;
};

export type GassmaGassmaOrderUse = {
  "id"?: number;
  "userId": number;
  "totalAmount": number;
  "quantity": number;
  "status": "pending" | "shipped" | "delivered" | "cancelled";
  "createdAt"?: Date;
};

export type GassmaGassmaOrderItemUse = {
  "id"?: number;
  "orderId": number;
  "productId": number;
  "quantity": number;
  "unitPrice": number;
};

export type GassmaGassmaNotificationUse = {
  "id"?: number;
  "userId": number;
  "message": string;
  "isRead"?: boolean;
};

export type GassmaGassmaUserUse = {
  "id"?: number;
  "email": string;
  "name": string;
  "age"?: number;
  "isActive"?: boolean;
  "role": "ADMIN" | "USER" | "MODERATOR";
  "createdAt"?: Date;
};

export type GassmaGassmaProfileUse = {
  "id"?: number;
  "bio"?: string;
  "website"?: string;
  "userId": number;
};

export type GassmaGassmaPostCreateData = {
  data: GassmaGassmaPostUse & {
    "author"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse } };
    "category"?: { create?: GassmaGassmaCategoryUse; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse } };
    "comments"?: { create?: GassmaGassmaCommentUse | GassmaGassmaCommentUse[]; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: GassmaGassmaCommentUse } | { where: GassmaGassmaCommentWhereUse; create: GassmaGassmaCommentUse }[]; update?: { where: GassmaGassmaCommentWhereUse; data: Partial<GassmaGassmaCommentUse> } | { where: GassmaGassmaCommentWhereUse; data: Partial<GassmaGassmaCommentUse> }[]; delete?: boolean | GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; deleteMany?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; disconnect?: boolean | GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; set?: GassmaGassmaCommentWhereUse[] };
    "tags"?: { create?: GassmaGassmaTagUse | GassmaGassmaTagUse[]; connect?: GassmaGassmaTagWhereUse | GassmaGassmaTagWhereUse[]; connectOrCreate?: { where: GassmaGassmaTagWhereUse; create: GassmaGassmaTagUse } | { where: GassmaGassmaTagWhereUse; create: GassmaGassmaTagUse }[]; disconnect?: GassmaGassmaTagWhereUse | GassmaGassmaTagWhereUse[]; set?: GassmaGassmaTagWhereUse[] };
  };
  include?: GassmaGassmaPostInclude;
} & ({ select?: GassmaGassmaPostSelect; omit?: never } | { select?: never; omit?: GassmaGassmaPostOmit });

export type GassmaGassmaCommentCreateData = {
  data: GassmaGassmaCommentUse & {
    "author"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse } };
    "post"?: { create?: GassmaGassmaPostUse; connect?: GassmaGassmaPostWhereUse; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } };
  };
  include?: GassmaGassmaCommentInclude;
} & ({ select?: GassmaGassmaCommentSelect; omit?: never } | { select?: never; omit?: GassmaGassmaCommentOmit });

export type GassmaGassmaCategoryCreateData = {
  data: GassmaGassmaCategoryUse & {
    "posts"?: { create?: GassmaGassmaPostUse | GassmaGassmaPostUse[]; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } | { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse }[]; update?: { where: GassmaGassmaPostWhereUse; data: Partial<GassmaGassmaPostUse> } | { where: GassmaGassmaPostWhereUse; data: Partial<GassmaGassmaPostUse> }[]; delete?: boolean | GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; deleteMany?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; disconnect?: boolean | GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
    "parent"?: { create?: GassmaGassmaCategoryUse; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse } };
    "children"?: { create?: GassmaGassmaCategoryUse | GassmaGassmaCategoryUse[]; connect?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse } | { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse }[]; update?: { where: GassmaGassmaCategoryWhereUse; data: Partial<GassmaGassmaCategoryUse> } | { where: GassmaGassmaCategoryWhereUse; data: Partial<GassmaGassmaCategoryUse> }[]; delete?: boolean | GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; deleteMany?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; disconnect?: boolean | GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; set?: GassmaGassmaCategoryWhereUse[] };
  };
  include?: GassmaGassmaCategoryInclude;
} & ({ select?: GassmaGassmaCategorySelect; omit?: never } | { select?: never; omit?: GassmaGassmaCategoryOmit });

export type GassmaGassmaTagCreateData = {
  data: GassmaGassmaTagUse & {
    "posts"?: { create?: GassmaGassmaPostUse | GassmaGassmaPostUse[]; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } | { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse }[]; disconnect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
  };
  include?: GassmaGassmaTagInclude;
} & ({ select?: GassmaGassmaTagSelect; omit?: never } | { select?: never; omit?: GassmaGassmaTagOmit });

export type GassmaGassmaProductCreateData = {
  data: GassmaGassmaProductUse & {
    "orderItems"?: { create?: GassmaGassmaOrderItemUse | GassmaGassmaOrderItemUse[]; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: GassmaGassmaOrderItemUse } | { where: GassmaGassmaOrderItemWhereUse; create: GassmaGassmaOrderItemUse }[]; update?: { where: GassmaGassmaOrderItemWhereUse; data: Partial<GassmaGassmaOrderItemUse> } | { where: GassmaGassmaOrderItemWhereUse; data: Partial<GassmaGassmaOrderItemUse> }[]; delete?: boolean | GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; deleteMany?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; disconnect?: boolean | GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; set?: GassmaGassmaOrderItemWhereUse[] };
  };
  include?: GassmaGassmaProductInclude;
} & ({ select?: GassmaGassmaProductSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProductOmit });

export type GassmaGassmaOrderCreateData = {
  data: GassmaGassmaOrderUse & {
    "user"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse } };
    "items"?: { create?: GassmaGassmaOrderItemUse | GassmaGassmaOrderItemUse[]; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: GassmaGassmaOrderItemUse } | { where: GassmaGassmaOrderItemWhereUse; create: GassmaGassmaOrderItemUse }[]; update?: { where: GassmaGassmaOrderItemWhereUse; data: Partial<GassmaGassmaOrderItemUse> } | { where: GassmaGassmaOrderItemWhereUse; data: Partial<GassmaGassmaOrderItemUse> }[]; delete?: boolean | GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; deleteMany?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; disconnect?: boolean | GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; set?: GassmaGassmaOrderItemWhereUse[] };
  };
  include?: GassmaGassmaOrderInclude;
} & ({ select?: GassmaGassmaOrderSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderOmit });

export type GassmaGassmaOrderItemCreateData = {
  data: GassmaGassmaOrderItemUse & {
    "order"?: { create?: GassmaGassmaOrderUse; connect?: GassmaGassmaOrderWhereUse; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: GassmaGassmaOrderUse } };
    "product"?: { create?: GassmaGassmaProductUse; connect?: GassmaGassmaProductWhereUse; connectOrCreate?: { where: GassmaGassmaProductWhereUse; create: GassmaGassmaProductUse } };
  };
  include?: GassmaGassmaOrderItemInclude;
} & ({ select?: GassmaGassmaOrderItemSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderItemOmit });

export type GassmaGassmaNotificationCreateData = {
  data: GassmaGassmaNotificationUse;
  include?: GassmaGassmaNotificationInclude;
} & ({ select?: GassmaGassmaNotificationSelect; omit?: never } | { select?: never; omit?: GassmaGassmaNotificationOmit });

export type GassmaGassmaUserCreateData = {
  data: GassmaGassmaUserUse & {
    "posts"?: { create?: GassmaGassmaPostUse | GassmaGassmaPostUse[]; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } | { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse }[]; update?: { where: GassmaGassmaPostWhereUse; data: Partial<GassmaGassmaPostUse> } | { where: GassmaGassmaPostWhereUse; data: Partial<GassmaGassmaPostUse> }[]; delete?: boolean | GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; deleteMany?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; disconnect?: boolean | GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
    "comments"?: { create?: GassmaGassmaCommentUse | GassmaGassmaCommentUse[]; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: GassmaGassmaCommentUse } | { where: GassmaGassmaCommentWhereUse; create: GassmaGassmaCommentUse }[]; update?: { where: GassmaGassmaCommentWhereUse; data: Partial<GassmaGassmaCommentUse> } | { where: GassmaGassmaCommentWhereUse; data: Partial<GassmaGassmaCommentUse> }[]; delete?: boolean | GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; deleteMany?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; disconnect?: boolean | GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; set?: GassmaGassmaCommentWhereUse[] };
    "orders"?: { create?: GassmaGassmaOrderUse | GassmaGassmaOrderUse[]; connect?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: GassmaGassmaOrderUse } | { where: GassmaGassmaOrderWhereUse; create: GassmaGassmaOrderUse }[]; update?: { where: GassmaGassmaOrderWhereUse; data: Partial<GassmaGassmaOrderUse> } | { where: GassmaGassmaOrderWhereUse; data: Partial<GassmaGassmaOrderUse> }[]; delete?: boolean | GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; deleteMany?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; disconnect?: boolean | GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; set?: GassmaGassmaOrderWhereUse[] };
    "profile"?: { create?: GassmaGassmaProfileUse; connect?: GassmaGassmaProfileWhereUse; connectOrCreate?: { where: GassmaGassmaProfileWhereUse; create: GassmaGassmaProfileUse }; update?: Partial<GassmaGassmaProfileUse>; delete?: true; disconnect?: true };
  };
  include?: GassmaGassmaUserInclude;
} & ({ select?: GassmaGassmaUserSelect; omit?: never } | { select?: never; omit?: GassmaGassmaUserOmit });

export type GassmaGassmaProfileCreateData = {
  data: GassmaGassmaProfileUse & {
    "user"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse }; update?: Partial<GassmaGassmaUserUse>; delete?: true; disconnect?: true };
  };
  include?: GassmaGassmaProfileInclude;
} & ({ select?: GassmaGassmaProfileSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProfileOmit });

export type GassmaGassmaPostCreateManyData = {
  data: GassmaGassmaPostUse[];
};

export type GassmaGassmaCommentCreateManyData = {
  data: GassmaGassmaCommentUse[];
};

export type GassmaGassmaCategoryCreateManyData = {
  data: GassmaGassmaCategoryUse[];
};

export type GassmaGassmaTagCreateManyData = {
  data: GassmaGassmaTagUse[];
};

export type GassmaGassmaProductCreateManyData = {
  data: GassmaGassmaProductUse[];
};

export type GassmaGassmaOrderCreateManyData = {
  data: GassmaGassmaOrderUse[];
};

export type GassmaGassmaOrderItemCreateManyData = {
  data: GassmaGassmaOrderItemUse[];
};

export type GassmaGassmaNotificationCreateManyData = {
  data: GassmaGassmaNotificationUse[];
};

export type GassmaGassmaUserCreateManyData = {
  data: GassmaGassmaUserUse[];
};

export type GassmaGassmaProfileCreateManyData = {
  data: GassmaGassmaProfileUse[];
};

export type GassmaGassmaPostCreateManyAndReturnData = {
  data: GassmaGassmaPostUse[];
  include?: GassmaGassmaPostInclude;
} & ({ select?: GassmaGassmaPostSelect; omit?: never } | { select?: never; omit?: GassmaGassmaPostOmit });

export type GassmaGassmaCommentCreateManyAndReturnData = {
  data: GassmaGassmaCommentUse[];
  include?: GassmaGassmaCommentInclude;
} & ({ select?: GassmaGassmaCommentSelect; omit?: never } | { select?: never; omit?: GassmaGassmaCommentOmit });

export type GassmaGassmaCategoryCreateManyAndReturnData = {
  data: GassmaGassmaCategoryUse[];
  include?: GassmaGassmaCategoryInclude;
} & ({ select?: GassmaGassmaCategorySelect; omit?: never } | { select?: never; omit?: GassmaGassmaCategoryOmit });

export type GassmaGassmaTagCreateManyAndReturnData = {
  data: GassmaGassmaTagUse[];
  include?: GassmaGassmaTagInclude;
} & ({ select?: GassmaGassmaTagSelect; omit?: never } | { select?: never; omit?: GassmaGassmaTagOmit });

export type GassmaGassmaProductCreateManyAndReturnData = {
  data: GassmaGassmaProductUse[];
  include?: GassmaGassmaProductInclude;
} & ({ select?: GassmaGassmaProductSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProductOmit });

export type GassmaGassmaOrderCreateManyAndReturnData = {
  data: GassmaGassmaOrderUse[];
  include?: GassmaGassmaOrderInclude;
} & ({ select?: GassmaGassmaOrderSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderOmit });

export type GassmaGassmaOrderItemCreateManyAndReturnData = {
  data: GassmaGassmaOrderItemUse[];
  include?: GassmaGassmaOrderItemInclude;
} & ({ select?: GassmaGassmaOrderItemSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderItemOmit });

export type GassmaGassmaNotificationCreateManyAndReturnData = {
  data: GassmaGassmaNotificationUse[];
  include?: GassmaGassmaNotificationInclude;
} & ({ select?: GassmaGassmaNotificationSelect; omit?: never } | { select?: never; omit?: GassmaGassmaNotificationOmit });

export type GassmaGassmaUserCreateManyAndReturnData = {
  data: GassmaGassmaUserUse[];
  include?: GassmaGassmaUserInclude;
} & ({ select?: GassmaGassmaUserSelect; omit?: never } | { select?: never; omit?: GassmaGassmaUserOmit });

export type GassmaGassmaProfileCreateManyAndReturnData = {
  data: GassmaGassmaProfileUse[];
  include?: GassmaGassmaProfileInclude;
} & ({ select?: GassmaGassmaProfileSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProfileOmit });

export type GassmaGassmaPostidFilterConditions = {
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

export type GassmaGassmaPosttitleFilterConditions = {
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

export type GassmaGassmaPostcontentFilterConditions = {
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

export type GassmaGassmaPostpublishedFilterConditions = {
  equals?: boolean | null | Gassma.FieldRef;
  not?: boolean | null;
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

export type GassmaGassmaPostviewCountFilterConditions = {
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

export type GassmaGassmaPostratingFilterConditions = {
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

export type GassmaGassmaPostauthorIdFilterConditions = {
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

export type GassmaGassmaPostcategoryIdFilterConditions = {
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

export type GassmaGassmaPostcreatedAtFilterConditions = {
  equals?: Date | null | Gassma.FieldRef;
  not?: Date | null;
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

export type GassmaGassmaPostupdatedAtFilterConditions = {
  equals?: Date | null | Gassma.FieldRef;
  not?: Date | null;
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

export type GassmaGassmaCommentidFilterConditions = {
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

export type GassmaGassmaCommenttextFilterConditions = {
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

export type GassmaGassmaCommentauthorIdFilterConditions = {
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

export type GassmaGassmaCommentpostIdFilterConditions = {
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

export type GassmaGassmaCommentcreatedAtFilterConditions = {
  equals?: Date | null | Gassma.FieldRef;
  not?: Date | null;
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

export type GassmaGassmaCategoryidFilterConditions = {
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

export type GassmaGassmaCategorynameFilterConditions = {
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

export type GassmaGassmaCategoryparentIdFilterConditions = {
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

export type GassmaGassmaTagidFilterConditions = {
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

export type GassmaGassmaTagnameFilterConditions = {
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

export type GassmaGassmaProductidFilterConditions = {
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

export type GassmaGassmaProductnameFilterConditions = {
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

export type GassmaGassmaProductpriceFilterConditions = {
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

export type GassmaGassmaProductstockFilterConditions = {
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

export type GassmaGassmaProductstatusFilterConditions = {
  equals?: "available" | "soldout" | "discontinued" | Gassma.FieldRef;
  not?: "available" | "soldout" | "discontinued";
  in?: ("available" | "soldout" | "discontinued")[];
  notIn?: ("available" | "soldout" | "discontinued")[];
  lt?: "available" | "soldout" | "discontinued" | Gassma.FieldRef;
  lte?: "available" | "soldout" | "discontinued" | Gassma.FieldRef;
  gt?: "available" | "soldout" | "discontinued" | Gassma.FieldRef;
  gte?: "available" | "soldout" | "discontinued" | Gassma.FieldRef;
  contains?: string | Gassma.FieldRef;
  startsWith?: string | Gassma.FieldRef;
  endsWith?: string | Gassma.FieldRef;
  mode?: "default" | "insensitive";
};

export type GassmaGassmaProductcreatedAtFilterConditions = {
  equals?: Date | null | Gassma.FieldRef;
  not?: Date | null;
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

export type GassmaGassmaProductupdatedAtFilterConditions = {
  equals?: Date | null | Gassma.FieldRef;
  not?: Date | null;
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

export type GassmaGassmaOrderidFilterConditions = {
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

export type GassmaGassmaOrderuserIdFilterConditions = {
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

export type GassmaGassmaOrdertotalAmountFilterConditions = {
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

export type GassmaGassmaOrderquantityFilterConditions = {
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

export type GassmaGassmaOrderstatusFilterConditions = {
  equals?: "pending" | "shipped" | "delivered" | "cancelled" | Gassma.FieldRef;
  not?: "pending" | "shipped" | "delivered" | "cancelled";
  in?: ("pending" | "shipped" | "delivered" | "cancelled")[];
  notIn?: ("pending" | "shipped" | "delivered" | "cancelled")[];
  lt?: "pending" | "shipped" | "delivered" | "cancelled" | Gassma.FieldRef;
  lte?: "pending" | "shipped" | "delivered" | "cancelled" | Gassma.FieldRef;
  gt?: "pending" | "shipped" | "delivered" | "cancelled" | Gassma.FieldRef;
  gte?: "pending" | "shipped" | "delivered" | "cancelled" | Gassma.FieldRef;
  contains?: string | Gassma.FieldRef;
  startsWith?: string | Gassma.FieldRef;
  endsWith?: string | Gassma.FieldRef;
  mode?: "default" | "insensitive";
};

export type GassmaGassmaOrdercreatedAtFilterConditions = {
  equals?: Date | null | Gassma.FieldRef;
  not?: Date | null;
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

export type GassmaGassmaOrderItemidFilterConditions = {
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

export type GassmaGassmaOrderItemorderIdFilterConditions = {
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

export type GassmaGassmaOrderItemproductIdFilterConditions = {
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

export type GassmaGassmaOrderItemquantityFilterConditions = {
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

export type GassmaGassmaOrderItemunitPriceFilterConditions = {
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

export type GassmaGassmaNotificationidFilterConditions = {
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

export type GassmaGassmaNotificationuserIdFilterConditions = {
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

export type GassmaGassmaNotificationmessageFilterConditions = {
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

export type GassmaGassmaNotificationisReadFilterConditions = {
  equals?: boolean | null | Gassma.FieldRef;
  not?: boolean | null;
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

export type GassmaGassmaUseridFilterConditions = {
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

export type GassmaGassmaUseremailFilterConditions = {
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

export type GassmaGassmaUsernameFilterConditions = {
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

export type GassmaGassmaUserageFilterConditions = {
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

export type GassmaGassmaUserisActiveFilterConditions = {
  equals?: boolean | null | Gassma.FieldRef;
  not?: boolean | null;
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

export type GassmaGassmaUserroleFilterConditions = {
  equals?: "ADMIN" | "USER" | "MODERATOR" | Gassma.FieldRef;
  not?: "ADMIN" | "USER" | "MODERATOR";
  in?: ("ADMIN" | "USER" | "MODERATOR")[];
  notIn?: ("ADMIN" | "USER" | "MODERATOR")[];
  lt?: "ADMIN" | "USER" | "MODERATOR" | Gassma.FieldRef;
  lte?: "ADMIN" | "USER" | "MODERATOR" | Gassma.FieldRef;
  gt?: "ADMIN" | "USER" | "MODERATOR" | Gassma.FieldRef;
  gte?: "ADMIN" | "USER" | "MODERATOR" | Gassma.FieldRef;
  contains?: string | Gassma.FieldRef;
  startsWith?: string | Gassma.FieldRef;
  endsWith?: string | Gassma.FieldRef;
  mode?: "default" | "insensitive";
};

export type GassmaGassmaUsercreatedAtFilterConditions = {
  equals?: Date | null | Gassma.FieldRef;
  not?: Date | null;
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

export type GassmaGassmaProfileidFilterConditions = {
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

export type GassmaGassmaProfilebioFilterConditions = {
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

export type GassmaGassmaProfilewebsiteFilterConditions = {
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

export type GassmaGassmaProfileuserIdFilterConditions = {
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

export type GassmaGassmaPostWhereUse = {
  "id"?: number | null | GassmaGassmaPostidFilterConditions;
  "title"?: string | GassmaGassmaPosttitleFilterConditions;
  "content"?: string | number | null | GassmaGassmaPostcontentFilterConditions;
  "published"?: boolean | null | GassmaGassmaPostpublishedFilterConditions;
  "viewCount"?: number | null | GassmaGassmaPostviewCountFilterConditions;
  "rating"?: number | boolean | null | GassmaGassmaPostratingFilterConditions;
  "authorId"?: number | GassmaGassmaPostauthorIdFilterConditions;
  "categoryId"?: number | null | GassmaGassmaPostcategoryIdFilterConditions;
  "createdAt"?: Date | null | GassmaGassmaPostcreatedAtFilterConditions;
  "updatedAt"?: Date | null | GassmaGassmaPostupdatedAtFilterConditions;
  "author"?: { is?: GassmaGassmaUserWhereUse; isNot?: GassmaGassmaUserWhereUse };
  "category"?: { is?: GassmaGassmaCategoryWhereUse; isNot?: GassmaGassmaCategoryWhereUse };
  "comments"?: { some?: GassmaGassmaCommentWhereUse; every?: GassmaGassmaCommentWhereUse; none?: GassmaGassmaCommentWhereUse };
  "tags"?: { some?: GassmaGassmaTagWhereUse; every?: GassmaGassmaTagWhereUse; none?: GassmaGassmaTagWhereUse };

  AND?: GassmaGassmaPostWhereUse[] | GassmaGassmaPostWhereUse;
  OR?: GassmaGassmaPostWhereUse[];
  NOT?: GassmaGassmaPostWhereUse[] | GassmaGassmaPostWhereUse;
};

export type GassmaGassmaCommentWhereUse = {
  "id"?: number | null | GassmaGassmaCommentidFilterConditions;
  "text"?: string | GassmaGassmaCommenttextFilterConditions;
  "authorId"?: number | GassmaGassmaCommentauthorIdFilterConditions;
  "postId"?: number | GassmaGassmaCommentpostIdFilterConditions;
  "createdAt"?: Date | null | GassmaGassmaCommentcreatedAtFilterConditions;
  "author"?: { is?: GassmaGassmaUserWhereUse; isNot?: GassmaGassmaUserWhereUse };
  "post"?: { is?: GassmaGassmaPostWhereUse; isNot?: GassmaGassmaPostWhereUse };

  AND?: GassmaGassmaCommentWhereUse[] | GassmaGassmaCommentWhereUse;
  OR?: GassmaGassmaCommentWhereUse[];
  NOT?: GassmaGassmaCommentWhereUse[] | GassmaGassmaCommentWhereUse;
};

export type GassmaGassmaCategoryWhereUse = {
  "id"?: number | null | GassmaGassmaCategoryidFilterConditions;
  "name"?: string | GassmaGassmaCategorynameFilterConditions;
  "parentId"?: number | null | GassmaGassmaCategoryparentIdFilterConditions;
  "posts"?: { some?: GassmaGassmaPostWhereUse; every?: GassmaGassmaPostWhereUse; none?: GassmaGassmaPostWhereUse };
  "parent"?: { is?: GassmaGassmaCategoryWhereUse; isNot?: GassmaGassmaCategoryWhereUse };
  "children"?: { some?: GassmaGassmaCategoryWhereUse; every?: GassmaGassmaCategoryWhereUse; none?: GassmaGassmaCategoryWhereUse };

  AND?: GassmaGassmaCategoryWhereUse[] | GassmaGassmaCategoryWhereUse;
  OR?: GassmaGassmaCategoryWhereUse[];
  NOT?: GassmaGassmaCategoryWhereUse[] | GassmaGassmaCategoryWhereUse;
};

export type GassmaGassmaTagWhereUse = {
  "id"?: number | null | GassmaGassmaTagidFilterConditions;
  "name"?: string | GassmaGassmaTagnameFilterConditions;
  "posts"?: { some?: GassmaGassmaPostWhereUse; every?: GassmaGassmaPostWhereUse; none?: GassmaGassmaPostWhereUse };

  AND?: GassmaGassmaTagWhereUse[] | GassmaGassmaTagWhereUse;
  OR?: GassmaGassmaTagWhereUse[];
  NOT?: GassmaGassmaTagWhereUse[] | GassmaGassmaTagWhereUse;
};

export type GassmaGassmaProductWhereUse = {
  "id"?: number | null | GassmaGassmaProductidFilterConditions;
  "name"?: string | GassmaGassmaProductnameFilterConditions;
  "price"?: number | GassmaGassmaProductpriceFilterConditions;
  "stock"?: number | GassmaGassmaProductstockFilterConditions;
  "status"?: "available" | "soldout" | "discontinued" | GassmaGassmaProductstatusFilterConditions;
  "createdAt"?: Date | null | GassmaGassmaProductcreatedAtFilterConditions;
  "updatedAt"?: Date | null | GassmaGassmaProductupdatedAtFilterConditions;
  "orderItems"?: { some?: GassmaGassmaOrderItemWhereUse; every?: GassmaGassmaOrderItemWhereUse; none?: GassmaGassmaOrderItemWhereUse };

  AND?: GassmaGassmaProductWhereUse[] | GassmaGassmaProductWhereUse;
  OR?: GassmaGassmaProductWhereUse[];
  NOT?: GassmaGassmaProductWhereUse[] | GassmaGassmaProductWhereUse;
};

export type GassmaGassmaOrderWhereUse = {
  "id"?: number | null | GassmaGassmaOrderidFilterConditions;
  "userId"?: number | GassmaGassmaOrderuserIdFilterConditions;
  "totalAmount"?: number | GassmaGassmaOrdertotalAmountFilterConditions;
  "quantity"?: number | GassmaGassmaOrderquantityFilterConditions;
  "status"?: "pending" | "shipped" | "delivered" | "cancelled" | GassmaGassmaOrderstatusFilterConditions;
  "createdAt"?: Date | null | GassmaGassmaOrdercreatedAtFilterConditions;
  "user"?: { is?: GassmaGassmaUserWhereUse; isNot?: GassmaGassmaUserWhereUse };
  "items"?: { some?: GassmaGassmaOrderItemWhereUse; every?: GassmaGassmaOrderItemWhereUse; none?: GassmaGassmaOrderItemWhereUse };

  AND?: GassmaGassmaOrderWhereUse[] | GassmaGassmaOrderWhereUse;
  OR?: GassmaGassmaOrderWhereUse[];
  NOT?: GassmaGassmaOrderWhereUse[] | GassmaGassmaOrderWhereUse;
};

export type GassmaGassmaOrderItemWhereUse = {
  "id"?: number | null | GassmaGassmaOrderItemidFilterConditions;
  "orderId"?: number | GassmaGassmaOrderItemorderIdFilterConditions;
  "productId"?: number | GassmaGassmaOrderItemproductIdFilterConditions;
  "quantity"?: number | GassmaGassmaOrderItemquantityFilterConditions;
  "unitPrice"?: number | GassmaGassmaOrderItemunitPriceFilterConditions;
  "order"?: { is?: GassmaGassmaOrderWhereUse; isNot?: GassmaGassmaOrderWhereUse };
  "product"?: { is?: GassmaGassmaProductWhereUse; isNot?: GassmaGassmaProductWhereUse };

  AND?: GassmaGassmaOrderItemWhereUse[] | GassmaGassmaOrderItemWhereUse;
  OR?: GassmaGassmaOrderItemWhereUse[];
  NOT?: GassmaGassmaOrderItemWhereUse[] | GassmaGassmaOrderItemWhereUse;
};

export type GassmaGassmaNotificationWhereUse = {
  "id"?: number | null | GassmaGassmaNotificationidFilterConditions;
  "userId"?: number | GassmaGassmaNotificationuserIdFilterConditions;
  "message"?: string | GassmaGassmaNotificationmessageFilterConditions;
  "isRead"?: boolean | null | GassmaGassmaNotificationisReadFilterConditions;

  AND?: GassmaGassmaNotificationWhereUse[] | GassmaGassmaNotificationWhereUse;
  OR?: GassmaGassmaNotificationWhereUse[];
  NOT?: GassmaGassmaNotificationWhereUse[] | GassmaGassmaNotificationWhereUse;
};

export type GassmaGassmaUserWhereUse = {
  "id"?: number | null | GassmaGassmaUseridFilterConditions;
  "email"?: string | GassmaGassmaUseremailFilterConditions;
  "name"?: string | GassmaGassmaUsernameFilterConditions;
  "age"?: number | null | GassmaGassmaUserageFilterConditions;
  "isActive"?: boolean | null | GassmaGassmaUserisActiveFilterConditions;
  "role"?: "ADMIN" | "USER" | "MODERATOR" | GassmaGassmaUserroleFilterConditions;
  "createdAt"?: Date | null | GassmaGassmaUsercreatedAtFilterConditions;
  "posts"?: { some?: GassmaGassmaPostWhereUse; every?: GassmaGassmaPostWhereUse; none?: GassmaGassmaPostWhereUse };
  "comments"?: { some?: GassmaGassmaCommentWhereUse; every?: GassmaGassmaCommentWhereUse; none?: GassmaGassmaCommentWhereUse };
  "orders"?: { some?: GassmaGassmaOrderWhereUse; every?: GassmaGassmaOrderWhereUse; none?: GassmaGassmaOrderWhereUse };
  "profile"?: { is?: GassmaGassmaProfileWhereUse; isNot?: GassmaGassmaProfileWhereUse };

  AND?: GassmaGassmaUserWhereUse[] | GassmaGassmaUserWhereUse;
  OR?: GassmaGassmaUserWhereUse[];
  NOT?: GassmaGassmaUserWhereUse[] | GassmaGassmaUserWhereUse;
};

export type GassmaGassmaProfileWhereUse = {
  "id"?: number | null | GassmaGassmaProfileidFilterConditions;
  "bio"?: string | null | GassmaGassmaProfilebioFilterConditions;
  "website"?: string | null | GassmaGassmaProfilewebsiteFilterConditions;
  "userId"?: number | GassmaGassmaProfileuserIdFilterConditions;
  "user"?: { is?: GassmaGassmaUserWhereUse; isNot?: GassmaGassmaUserWhereUse };

  AND?: GassmaGassmaProfileWhereUse[] | GassmaGassmaProfileWhereUse;
  OR?: GassmaGassmaProfileWhereUse[];
  NOT?: GassmaGassmaProfileWhereUse[] | GassmaGassmaProfileWhereUse;
};

export type GassmaGassmaPostidHavingCore = {
  _avg?: GassmaGassmaPostidFilterConditions;
  _count?: GassmaGassmaPostidFilterConditions;
  _max?: GassmaGassmaPostidFilterConditions;
  _min?: GassmaGassmaPostidFilterConditions;
  _sum?: GassmaGassmaPostidFilterConditions;
} & GassmaGassmaPostidFilterConditions;

export type GassmaGassmaPosttitleHavingCore = {
  _avg?: GassmaGassmaPosttitleFilterConditions;
  _count?: GassmaGassmaPosttitleFilterConditions;
  _max?: GassmaGassmaPosttitleFilterConditions;
  _min?: GassmaGassmaPosttitleFilterConditions;
  _sum?: GassmaGassmaPosttitleFilterConditions;
} & GassmaGassmaPosttitleFilterConditions;

export type GassmaGassmaPostcontentHavingCore = {
  _avg?: GassmaGassmaPostcontentFilterConditions;
  _count?: GassmaGassmaPostcontentFilterConditions;
  _max?: GassmaGassmaPostcontentFilterConditions;
  _min?: GassmaGassmaPostcontentFilterConditions;
  _sum?: GassmaGassmaPostcontentFilterConditions;
} & GassmaGassmaPostcontentFilterConditions;

export type GassmaGassmaPostpublishedHavingCore = {
  _avg?: GassmaGassmaPostpublishedFilterConditions;
  _count?: GassmaGassmaPostpublishedFilterConditions;
  _max?: GassmaGassmaPostpublishedFilterConditions;
  _min?: GassmaGassmaPostpublishedFilterConditions;
  _sum?: GassmaGassmaPostpublishedFilterConditions;
} & GassmaGassmaPostpublishedFilterConditions;

export type GassmaGassmaPostviewCountHavingCore = {
  _avg?: GassmaGassmaPostviewCountFilterConditions;
  _count?: GassmaGassmaPostviewCountFilterConditions;
  _max?: GassmaGassmaPostviewCountFilterConditions;
  _min?: GassmaGassmaPostviewCountFilterConditions;
  _sum?: GassmaGassmaPostviewCountFilterConditions;
} & GassmaGassmaPostviewCountFilterConditions;

export type GassmaGassmaPostratingHavingCore = {
  _avg?: GassmaGassmaPostratingFilterConditions;
  _count?: GassmaGassmaPostratingFilterConditions;
  _max?: GassmaGassmaPostratingFilterConditions;
  _min?: GassmaGassmaPostratingFilterConditions;
  _sum?: GassmaGassmaPostratingFilterConditions;
} & GassmaGassmaPostratingFilterConditions;

export type GassmaGassmaPostauthorIdHavingCore = {
  _avg?: GassmaGassmaPostauthorIdFilterConditions;
  _count?: GassmaGassmaPostauthorIdFilterConditions;
  _max?: GassmaGassmaPostauthorIdFilterConditions;
  _min?: GassmaGassmaPostauthorIdFilterConditions;
  _sum?: GassmaGassmaPostauthorIdFilterConditions;
} & GassmaGassmaPostauthorIdFilterConditions;

export type GassmaGassmaPostcategoryIdHavingCore = {
  _avg?: GassmaGassmaPostcategoryIdFilterConditions;
  _count?: GassmaGassmaPostcategoryIdFilterConditions;
  _max?: GassmaGassmaPostcategoryIdFilterConditions;
  _min?: GassmaGassmaPostcategoryIdFilterConditions;
  _sum?: GassmaGassmaPostcategoryIdFilterConditions;
} & GassmaGassmaPostcategoryIdFilterConditions;

export type GassmaGassmaPostcreatedAtHavingCore = {
  _avg?: GassmaGassmaPostcreatedAtFilterConditions;
  _count?: GassmaGassmaPostcreatedAtFilterConditions;
  _max?: GassmaGassmaPostcreatedAtFilterConditions;
  _min?: GassmaGassmaPostcreatedAtFilterConditions;
  _sum?: GassmaGassmaPostcreatedAtFilterConditions;
} & GassmaGassmaPostcreatedAtFilterConditions;

export type GassmaGassmaPostupdatedAtHavingCore = {
  _avg?: GassmaGassmaPostupdatedAtFilterConditions;
  _count?: GassmaGassmaPostupdatedAtFilterConditions;
  _max?: GassmaGassmaPostupdatedAtFilterConditions;
  _min?: GassmaGassmaPostupdatedAtFilterConditions;
  _sum?: GassmaGassmaPostupdatedAtFilterConditions;
} & GassmaGassmaPostupdatedAtFilterConditions;

export type GassmaGassmaCommentidHavingCore = {
  _avg?: GassmaGassmaCommentidFilterConditions;
  _count?: GassmaGassmaCommentidFilterConditions;
  _max?: GassmaGassmaCommentidFilterConditions;
  _min?: GassmaGassmaCommentidFilterConditions;
  _sum?: GassmaGassmaCommentidFilterConditions;
} & GassmaGassmaCommentidFilterConditions;

export type GassmaGassmaCommenttextHavingCore = {
  _avg?: GassmaGassmaCommenttextFilterConditions;
  _count?: GassmaGassmaCommenttextFilterConditions;
  _max?: GassmaGassmaCommenttextFilterConditions;
  _min?: GassmaGassmaCommenttextFilterConditions;
  _sum?: GassmaGassmaCommenttextFilterConditions;
} & GassmaGassmaCommenttextFilterConditions;

export type GassmaGassmaCommentauthorIdHavingCore = {
  _avg?: GassmaGassmaCommentauthorIdFilterConditions;
  _count?: GassmaGassmaCommentauthorIdFilterConditions;
  _max?: GassmaGassmaCommentauthorIdFilterConditions;
  _min?: GassmaGassmaCommentauthorIdFilterConditions;
  _sum?: GassmaGassmaCommentauthorIdFilterConditions;
} & GassmaGassmaCommentauthorIdFilterConditions;

export type GassmaGassmaCommentpostIdHavingCore = {
  _avg?: GassmaGassmaCommentpostIdFilterConditions;
  _count?: GassmaGassmaCommentpostIdFilterConditions;
  _max?: GassmaGassmaCommentpostIdFilterConditions;
  _min?: GassmaGassmaCommentpostIdFilterConditions;
  _sum?: GassmaGassmaCommentpostIdFilterConditions;
} & GassmaGassmaCommentpostIdFilterConditions;

export type GassmaGassmaCommentcreatedAtHavingCore = {
  _avg?: GassmaGassmaCommentcreatedAtFilterConditions;
  _count?: GassmaGassmaCommentcreatedAtFilterConditions;
  _max?: GassmaGassmaCommentcreatedAtFilterConditions;
  _min?: GassmaGassmaCommentcreatedAtFilterConditions;
  _sum?: GassmaGassmaCommentcreatedAtFilterConditions;
} & GassmaGassmaCommentcreatedAtFilterConditions;

export type GassmaGassmaCategoryidHavingCore = {
  _avg?: GassmaGassmaCategoryidFilterConditions;
  _count?: GassmaGassmaCategoryidFilterConditions;
  _max?: GassmaGassmaCategoryidFilterConditions;
  _min?: GassmaGassmaCategoryidFilterConditions;
  _sum?: GassmaGassmaCategoryidFilterConditions;
} & GassmaGassmaCategoryidFilterConditions;

export type GassmaGassmaCategorynameHavingCore = {
  _avg?: GassmaGassmaCategorynameFilterConditions;
  _count?: GassmaGassmaCategorynameFilterConditions;
  _max?: GassmaGassmaCategorynameFilterConditions;
  _min?: GassmaGassmaCategorynameFilterConditions;
  _sum?: GassmaGassmaCategorynameFilterConditions;
} & GassmaGassmaCategorynameFilterConditions;

export type GassmaGassmaCategoryparentIdHavingCore = {
  _avg?: GassmaGassmaCategoryparentIdFilterConditions;
  _count?: GassmaGassmaCategoryparentIdFilterConditions;
  _max?: GassmaGassmaCategoryparentIdFilterConditions;
  _min?: GassmaGassmaCategoryparentIdFilterConditions;
  _sum?: GassmaGassmaCategoryparentIdFilterConditions;
} & GassmaGassmaCategoryparentIdFilterConditions;

export type GassmaGassmaTagidHavingCore = {
  _avg?: GassmaGassmaTagidFilterConditions;
  _count?: GassmaGassmaTagidFilterConditions;
  _max?: GassmaGassmaTagidFilterConditions;
  _min?: GassmaGassmaTagidFilterConditions;
  _sum?: GassmaGassmaTagidFilterConditions;
} & GassmaGassmaTagidFilterConditions;

export type GassmaGassmaTagnameHavingCore = {
  _avg?: GassmaGassmaTagnameFilterConditions;
  _count?: GassmaGassmaTagnameFilterConditions;
  _max?: GassmaGassmaTagnameFilterConditions;
  _min?: GassmaGassmaTagnameFilterConditions;
  _sum?: GassmaGassmaTagnameFilterConditions;
} & GassmaGassmaTagnameFilterConditions;

export type GassmaGassmaProductidHavingCore = {
  _avg?: GassmaGassmaProductidFilterConditions;
  _count?: GassmaGassmaProductidFilterConditions;
  _max?: GassmaGassmaProductidFilterConditions;
  _min?: GassmaGassmaProductidFilterConditions;
  _sum?: GassmaGassmaProductidFilterConditions;
} & GassmaGassmaProductidFilterConditions;

export type GassmaGassmaProductnameHavingCore = {
  _avg?: GassmaGassmaProductnameFilterConditions;
  _count?: GassmaGassmaProductnameFilterConditions;
  _max?: GassmaGassmaProductnameFilterConditions;
  _min?: GassmaGassmaProductnameFilterConditions;
  _sum?: GassmaGassmaProductnameFilterConditions;
} & GassmaGassmaProductnameFilterConditions;

export type GassmaGassmaProductpriceHavingCore = {
  _avg?: GassmaGassmaProductpriceFilterConditions;
  _count?: GassmaGassmaProductpriceFilterConditions;
  _max?: GassmaGassmaProductpriceFilterConditions;
  _min?: GassmaGassmaProductpriceFilterConditions;
  _sum?: GassmaGassmaProductpriceFilterConditions;
} & GassmaGassmaProductpriceFilterConditions;

export type GassmaGassmaProductstockHavingCore = {
  _avg?: GassmaGassmaProductstockFilterConditions;
  _count?: GassmaGassmaProductstockFilterConditions;
  _max?: GassmaGassmaProductstockFilterConditions;
  _min?: GassmaGassmaProductstockFilterConditions;
  _sum?: GassmaGassmaProductstockFilterConditions;
} & GassmaGassmaProductstockFilterConditions;

export type GassmaGassmaProductstatusHavingCore = {
  _avg?: GassmaGassmaProductstatusFilterConditions;
  _count?: GassmaGassmaProductstatusFilterConditions;
  _max?: GassmaGassmaProductstatusFilterConditions;
  _min?: GassmaGassmaProductstatusFilterConditions;
  _sum?: GassmaGassmaProductstatusFilterConditions;
} & GassmaGassmaProductstatusFilterConditions;

export type GassmaGassmaProductcreatedAtHavingCore = {
  _avg?: GassmaGassmaProductcreatedAtFilterConditions;
  _count?: GassmaGassmaProductcreatedAtFilterConditions;
  _max?: GassmaGassmaProductcreatedAtFilterConditions;
  _min?: GassmaGassmaProductcreatedAtFilterConditions;
  _sum?: GassmaGassmaProductcreatedAtFilterConditions;
} & GassmaGassmaProductcreatedAtFilterConditions;

export type GassmaGassmaProductupdatedAtHavingCore = {
  _avg?: GassmaGassmaProductupdatedAtFilterConditions;
  _count?: GassmaGassmaProductupdatedAtFilterConditions;
  _max?: GassmaGassmaProductupdatedAtFilterConditions;
  _min?: GassmaGassmaProductupdatedAtFilterConditions;
  _sum?: GassmaGassmaProductupdatedAtFilterConditions;
} & GassmaGassmaProductupdatedAtFilterConditions;

export type GassmaGassmaOrderidHavingCore = {
  _avg?: GassmaGassmaOrderidFilterConditions;
  _count?: GassmaGassmaOrderidFilterConditions;
  _max?: GassmaGassmaOrderidFilterConditions;
  _min?: GassmaGassmaOrderidFilterConditions;
  _sum?: GassmaGassmaOrderidFilterConditions;
} & GassmaGassmaOrderidFilterConditions;

export type GassmaGassmaOrderuserIdHavingCore = {
  _avg?: GassmaGassmaOrderuserIdFilterConditions;
  _count?: GassmaGassmaOrderuserIdFilterConditions;
  _max?: GassmaGassmaOrderuserIdFilterConditions;
  _min?: GassmaGassmaOrderuserIdFilterConditions;
  _sum?: GassmaGassmaOrderuserIdFilterConditions;
} & GassmaGassmaOrderuserIdFilterConditions;

export type GassmaGassmaOrdertotalAmountHavingCore = {
  _avg?: GassmaGassmaOrdertotalAmountFilterConditions;
  _count?: GassmaGassmaOrdertotalAmountFilterConditions;
  _max?: GassmaGassmaOrdertotalAmountFilterConditions;
  _min?: GassmaGassmaOrdertotalAmountFilterConditions;
  _sum?: GassmaGassmaOrdertotalAmountFilterConditions;
} & GassmaGassmaOrdertotalAmountFilterConditions;

export type GassmaGassmaOrderquantityHavingCore = {
  _avg?: GassmaGassmaOrderquantityFilterConditions;
  _count?: GassmaGassmaOrderquantityFilterConditions;
  _max?: GassmaGassmaOrderquantityFilterConditions;
  _min?: GassmaGassmaOrderquantityFilterConditions;
  _sum?: GassmaGassmaOrderquantityFilterConditions;
} & GassmaGassmaOrderquantityFilterConditions;

export type GassmaGassmaOrderstatusHavingCore = {
  _avg?: GassmaGassmaOrderstatusFilterConditions;
  _count?: GassmaGassmaOrderstatusFilterConditions;
  _max?: GassmaGassmaOrderstatusFilterConditions;
  _min?: GassmaGassmaOrderstatusFilterConditions;
  _sum?: GassmaGassmaOrderstatusFilterConditions;
} & GassmaGassmaOrderstatusFilterConditions;

export type GassmaGassmaOrdercreatedAtHavingCore = {
  _avg?: GassmaGassmaOrdercreatedAtFilterConditions;
  _count?: GassmaGassmaOrdercreatedAtFilterConditions;
  _max?: GassmaGassmaOrdercreatedAtFilterConditions;
  _min?: GassmaGassmaOrdercreatedAtFilterConditions;
  _sum?: GassmaGassmaOrdercreatedAtFilterConditions;
} & GassmaGassmaOrdercreatedAtFilterConditions;

export type GassmaGassmaOrderItemidHavingCore = {
  _avg?: GassmaGassmaOrderItemidFilterConditions;
  _count?: GassmaGassmaOrderItemidFilterConditions;
  _max?: GassmaGassmaOrderItemidFilterConditions;
  _min?: GassmaGassmaOrderItemidFilterConditions;
  _sum?: GassmaGassmaOrderItemidFilterConditions;
} & GassmaGassmaOrderItemidFilterConditions;

export type GassmaGassmaOrderItemorderIdHavingCore = {
  _avg?: GassmaGassmaOrderItemorderIdFilterConditions;
  _count?: GassmaGassmaOrderItemorderIdFilterConditions;
  _max?: GassmaGassmaOrderItemorderIdFilterConditions;
  _min?: GassmaGassmaOrderItemorderIdFilterConditions;
  _sum?: GassmaGassmaOrderItemorderIdFilterConditions;
} & GassmaGassmaOrderItemorderIdFilterConditions;

export type GassmaGassmaOrderItemproductIdHavingCore = {
  _avg?: GassmaGassmaOrderItemproductIdFilterConditions;
  _count?: GassmaGassmaOrderItemproductIdFilterConditions;
  _max?: GassmaGassmaOrderItemproductIdFilterConditions;
  _min?: GassmaGassmaOrderItemproductIdFilterConditions;
  _sum?: GassmaGassmaOrderItemproductIdFilterConditions;
} & GassmaGassmaOrderItemproductIdFilterConditions;

export type GassmaGassmaOrderItemquantityHavingCore = {
  _avg?: GassmaGassmaOrderItemquantityFilterConditions;
  _count?: GassmaGassmaOrderItemquantityFilterConditions;
  _max?: GassmaGassmaOrderItemquantityFilterConditions;
  _min?: GassmaGassmaOrderItemquantityFilterConditions;
  _sum?: GassmaGassmaOrderItemquantityFilterConditions;
} & GassmaGassmaOrderItemquantityFilterConditions;

export type GassmaGassmaOrderItemunitPriceHavingCore = {
  _avg?: GassmaGassmaOrderItemunitPriceFilterConditions;
  _count?: GassmaGassmaOrderItemunitPriceFilterConditions;
  _max?: GassmaGassmaOrderItemunitPriceFilterConditions;
  _min?: GassmaGassmaOrderItemunitPriceFilterConditions;
  _sum?: GassmaGassmaOrderItemunitPriceFilterConditions;
} & GassmaGassmaOrderItemunitPriceFilterConditions;

export type GassmaGassmaNotificationidHavingCore = {
  _avg?: GassmaGassmaNotificationidFilterConditions;
  _count?: GassmaGassmaNotificationidFilterConditions;
  _max?: GassmaGassmaNotificationidFilterConditions;
  _min?: GassmaGassmaNotificationidFilterConditions;
  _sum?: GassmaGassmaNotificationidFilterConditions;
} & GassmaGassmaNotificationidFilterConditions;

export type GassmaGassmaNotificationuserIdHavingCore = {
  _avg?: GassmaGassmaNotificationuserIdFilterConditions;
  _count?: GassmaGassmaNotificationuserIdFilterConditions;
  _max?: GassmaGassmaNotificationuserIdFilterConditions;
  _min?: GassmaGassmaNotificationuserIdFilterConditions;
  _sum?: GassmaGassmaNotificationuserIdFilterConditions;
} & GassmaGassmaNotificationuserIdFilterConditions;

export type GassmaGassmaNotificationmessageHavingCore = {
  _avg?: GassmaGassmaNotificationmessageFilterConditions;
  _count?: GassmaGassmaNotificationmessageFilterConditions;
  _max?: GassmaGassmaNotificationmessageFilterConditions;
  _min?: GassmaGassmaNotificationmessageFilterConditions;
  _sum?: GassmaGassmaNotificationmessageFilterConditions;
} & GassmaGassmaNotificationmessageFilterConditions;

export type GassmaGassmaNotificationisReadHavingCore = {
  _avg?: GassmaGassmaNotificationisReadFilterConditions;
  _count?: GassmaGassmaNotificationisReadFilterConditions;
  _max?: GassmaGassmaNotificationisReadFilterConditions;
  _min?: GassmaGassmaNotificationisReadFilterConditions;
  _sum?: GassmaGassmaNotificationisReadFilterConditions;
} & GassmaGassmaNotificationisReadFilterConditions;

export type GassmaGassmaUseridHavingCore = {
  _avg?: GassmaGassmaUseridFilterConditions;
  _count?: GassmaGassmaUseridFilterConditions;
  _max?: GassmaGassmaUseridFilterConditions;
  _min?: GassmaGassmaUseridFilterConditions;
  _sum?: GassmaGassmaUseridFilterConditions;
} & GassmaGassmaUseridFilterConditions;

export type GassmaGassmaUseremailHavingCore = {
  _avg?: GassmaGassmaUseremailFilterConditions;
  _count?: GassmaGassmaUseremailFilterConditions;
  _max?: GassmaGassmaUseremailFilterConditions;
  _min?: GassmaGassmaUseremailFilterConditions;
  _sum?: GassmaGassmaUseremailFilterConditions;
} & GassmaGassmaUseremailFilterConditions;

export type GassmaGassmaUsernameHavingCore = {
  _avg?: GassmaGassmaUsernameFilterConditions;
  _count?: GassmaGassmaUsernameFilterConditions;
  _max?: GassmaGassmaUsernameFilterConditions;
  _min?: GassmaGassmaUsernameFilterConditions;
  _sum?: GassmaGassmaUsernameFilterConditions;
} & GassmaGassmaUsernameFilterConditions;

export type GassmaGassmaUserageHavingCore = {
  _avg?: GassmaGassmaUserageFilterConditions;
  _count?: GassmaGassmaUserageFilterConditions;
  _max?: GassmaGassmaUserageFilterConditions;
  _min?: GassmaGassmaUserageFilterConditions;
  _sum?: GassmaGassmaUserageFilterConditions;
} & GassmaGassmaUserageFilterConditions;

export type GassmaGassmaUserisActiveHavingCore = {
  _avg?: GassmaGassmaUserisActiveFilterConditions;
  _count?: GassmaGassmaUserisActiveFilterConditions;
  _max?: GassmaGassmaUserisActiveFilterConditions;
  _min?: GassmaGassmaUserisActiveFilterConditions;
  _sum?: GassmaGassmaUserisActiveFilterConditions;
} & GassmaGassmaUserisActiveFilterConditions;

export type GassmaGassmaUserroleHavingCore = {
  _avg?: GassmaGassmaUserroleFilterConditions;
  _count?: GassmaGassmaUserroleFilterConditions;
  _max?: GassmaGassmaUserroleFilterConditions;
  _min?: GassmaGassmaUserroleFilterConditions;
  _sum?: GassmaGassmaUserroleFilterConditions;
} & GassmaGassmaUserroleFilterConditions;

export type GassmaGassmaUsercreatedAtHavingCore = {
  _avg?: GassmaGassmaUsercreatedAtFilterConditions;
  _count?: GassmaGassmaUsercreatedAtFilterConditions;
  _max?: GassmaGassmaUsercreatedAtFilterConditions;
  _min?: GassmaGassmaUsercreatedAtFilterConditions;
  _sum?: GassmaGassmaUsercreatedAtFilterConditions;
} & GassmaGassmaUsercreatedAtFilterConditions;

export type GassmaGassmaProfileidHavingCore = {
  _avg?: GassmaGassmaProfileidFilterConditions;
  _count?: GassmaGassmaProfileidFilterConditions;
  _max?: GassmaGassmaProfileidFilterConditions;
  _min?: GassmaGassmaProfileidFilterConditions;
  _sum?: GassmaGassmaProfileidFilterConditions;
} & GassmaGassmaProfileidFilterConditions;

export type GassmaGassmaProfilebioHavingCore = {
  _avg?: GassmaGassmaProfilebioFilterConditions;
  _count?: GassmaGassmaProfilebioFilterConditions;
  _max?: GassmaGassmaProfilebioFilterConditions;
  _min?: GassmaGassmaProfilebioFilterConditions;
  _sum?: GassmaGassmaProfilebioFilterConditions;
} & GassmaGassmaProfilebioFilterConditions;

export type GassmaGassmaProfilewebsiteHavingCore = {
  _avg?: GassmaGassmaProfilewebsiteFilterConditions;
  _count?: GassmaGassmaProfilewebsiteFilterConditions;
  _max?: GassmaGassmaProfilewebsiteFilterConditions;
  _min?: GassmaGassmaProfilewebsiteFilterConditions;
  _sum?: GassmaGassmaProfilewebsiteFilterConditions;
} & GassmaGassmaProfilewebsiteFilterConditions;

export type GassmaGassmaProfileuserIdHavingCore = {
  _avg?: GassmaGassmaProfileuserIdFilterConditions;
  _count?: GassmaGassmaProfileuserIdFilterConditions;
  _max?: GassmaGassmaProfileuserIdFilterConditions;
  _min?: GassmaGassmaProfileuserIdFilterConditions;
  _sum?: GassmaGassmaProfileuserIdFilterConditions;
} & GassmaGassmaProfileuserIdFilterConditions;

export type GassmaGassmaPostHavingUse = {
  "id"?: number | null | GassmaGassmaPostidHavingCore;
  "title"?: string | GassmaGassmaPosttitleHavingCore;
  "content"?: string | number | null | GassmaGassmaPostcontentHavingCore;
  "published"?: boolean | null | GassmaGassmaPostpublishedHavingCore;
  "viewCount"?: number | null | GassmaGassmaPostviewCountHavingCore;
  "rating"?: number | boolean | null | GassmaGassmaPostratingHavingCore;
  "authorId"?: number | GassmaGassmaPostauthorIdHavingCore;
  "categoryId"?: number | null | GassmaGassmaPostcategoryIdHavingCore;
  "createdAt"?: Date | null | GassmaGassmaPostcreatedAtHavingCore;
  "updatedAt"?: Date | null | GassmaGassmaPostupdatedAtHavingCore;

  AND?: GassmaGassmaPostHavingUse[] | GassmaGassmaPostHavingUse;
  OR?: GassmaGassmaPostHavingUse[];
  NOT?: GassmaGassmaPostHavingUse[] | GassmaGassmaPostHavingUse;
};

export type GassmaGassmaCommentHavingUse = {
  "id"?: number | null | GassmaGassmaCommentidHavingCore;
  "text"?: string | GassmaGassmaCommenttextHavingCore;
  "authorId"?: number | GassmaGassmaCommentauthorIdHavingCore;
  "postId"?: number | GassmaGassmaCommentpostIdHavingCore;
  "createdAt"?: Date | null | GassmaGassmaCommentcreatedAtHavingCore;

  AND?: GassmaGassmaCommentHavingUse[] | GassmaGassmaCommentHavingUse;
  OR?: GassmaGassmaCommentHavingUse[];
  NOT?: GassmaGassmaCommentHavingUse[] | GassmaGassmaCommentHavingUse;
};

export type GassmaGassmaCategoryHavingUse = {
  "id"?: number | null | GassmaGassmaCategoryidHavingCore;
  "name"?: string | GassmaGassmaCategorynameHavingCore;
  "parentId"?: number | null | GassmaGassmaCategoryparentIdHavingCore;

  AND?: GassmaGassmaCategoryHavingUse[] | GassmaGassmaCategoryHavingUse;
  OR?: GassmaGassmaCategoryHavingUse[];
  NOT?: GassmaGassmaCategoryHavingUse[] | GassmaGassmaCategoryHavingUse;
};

export type GassmaGassmaTagHavingUse = {
  "id"?: number | null | GassmaGassmaTagidHavingCore;
  "name"?: string | GassmaGassmaTagnameHavingCore;

  AND?: GassmaGassmaTagHavingUse[] | GassmaGassmaTagHavingUse;
  OR?: GassmaGassmaTagHavingUse[];
  NOT?: GassmaGassmaTagHavingUse[] | GassmaGassmaTagHavingUse;
};

export type GassmaGassmaProductHavingUse = {
  "id"?: number | null | GassmaGassmaProductidHavingCore;
  "name"?: string | GassmaGassmaProductnameHavingCore;
  "price"?: number | GassmaGassmaProductpriceHavingCore;
  "stock"?: number | GassmaGassmaProductstockHavingCore;
  "status"?: "available" | "soldout" | "discontinued" | GassmaGassmaProductstatusHavingCore;
  "createdAt"?: Date | null | GassmaGassmaProductcreatedAtHavingCore;
  "updatedAt"?: Date | null | GassmaGassmaProductupdatedAtHavingCore;

  AND?: GassmaGassmaProductHavingUse[] | GassmaGassmaProductHavingUse;
  OR?: GassmaGassmaProductHavingUse[];
  NOT?: GassmaGassmaProductHavingUse[] | GassmaGassmaProductHavingUse;
};

export type GassmaGassmaOrderHavingUse = {
  "id"?: number | null | GassmaGassmaOrderidHavingCore;
  "userId"?: number | GassmaGassmaOrderuserIdHavingCore;
  "totalAmount"?: number | GassmaGassmaOrdertotalAmountHavingCore;
  "quantity"?: number | GassmaGassmaOrderquantityHavingCore;
  "status"?: "pending" | "shipped" | "delivered" | "cancelled" | GassmaGassmaOrderstatusHavingCore;
  "createdAt"?: Date | null | GassmaGassmaOrdercreatedAtHavingCore;

  AND?: GassmaGassmaOrderHavingUse[] | GassmaGassmaOrderHavingUse;
  OR?: GassmaGassmaOrderHavingUse[];
  NOT?: GassmaGassmaOrderHavingUse[] | GassmaGassmaOrderHavingUse;
};

export type GassmaGassmaOrderItemHavingUse = {
  "id"?: number | null | GassmaGassmaOrderItemidHavingCore;
  "orderId"?: number | GassmaGassmaOrderItemorderIdHavingCore;
  "productId"?: number | GassmaGassmaOrderItemproductIdHavingCore;
  "quantity"?: number | GassmaGassmaOrderItemquantityHavingCore;
  "unitPrice"?: number | GassmaGassmaOrderItemunitPriceHavingCore;

  AND?: GassmaGassmaOrderItemHavingUse[] | GassmaGassmaOrderItemHavingUse;
  OR?: GassmaGassmaOrderItemHavingUse[];
  NOT?: GassmaGassmaOrderItemHavingUse[] | GassmaGassmaOrderItemHavingUse;
};

export type GassmaGassmaNotificationHavingUse = {
  "id"?: number | null | GassmaGassmaNotificationidHavingCore;
  "userId"?: number | GassmaGassmaNotificationuserIdHavingCore;
  "message"?: string | GassmaGassmaNotificationmessageHavingCore;
  "isRead"?: boolean | null | GassmaGassmaNotificationisReadHavingCore;

  AND?: GassmaGassmaNotificationHavingUse[] | GassmaGassmaNotificationHavingUse;
  OR?: GassmaGassmaNotificationHavingUse[];
  NOT?: GassmaGassmaNotificationHavingUse[] | GassmaGassmaNotificationHavingUse;
};

export type GassmaGassmaUserHavingUse = {
  "id"?: number | null | GassmaGassmaUseridHavingCore;
  "email"?: string | GassmaGassmaUseremailHavingCore;
  "name"?: string | GassmaGassmaUsernameHavingCore;
  "age"?: number | null | GassmaGassmaUserageHavingCore;
  "isActive"?: boolean | null | GassmaGassmaUserisActiveHavingCore;
  "role"?: "ADMIN" | "USER" | "MODERATOR" | GassmaGassmaUserroleHavingCore;
  "createdAt"?: Date | null | GassmaGassmaUsercreatedAtHavingCore;

  AND?: GassmaGassmaUserHavingUse[] | GassmaGassmaUserHavingUse;
  OR?: GassmaGassmaUserHavingUse[];
  NOT?: GassmaGassmaUserHavingUse[] | GassmaGassmaUserHavingUse;
};

export type GassmaGassmaProfileHavingUse = {
  "id"?: number | null | GassmaGassmaProfileidHavingCore;
  "bio"?: string | null | GassmaGassmaProfilebioHavingCore;
  "website"?: string | null | GassmaGassmaProfilewebsiteHavingCore;
  "userId"?: number | GassmaGassmaProfileuserIdHavingCore;

  AND?: GassmaGassmaProfileHavingUse[] | GassmaGassmaProfileHavingUse;
  OR?: GassmaGassmaProfileHavingUse[];
  NOT?: GassmaGassmaProfileHavingUse[] | GassmaGassmaProfileHavingUse;
};

export type GassmaGassmaPostFindData = {
  where?: GassmaGassmaPostWhereUse;
  orderBy?: GassmaGassmaPostOrderBy;
  take?: number;
  skip?: number;
  distinct?: "id" | "title" | "content" | "published" | "viewCount" | "rating" | "authorId" | "categoryId" | "createdAt" | "updatedAt" | ("id" | "title" | "content" | "published" | "viewCount" | "rating" | "authorId" | "categoryId" | "createdAt" | "updatedAt")[];
  include?: GassmaGassmaPostInclude;
  cursor?: Partial<GassmaGassmaPostUse>;
  _count?: GassmaGassmaPostCountValue;
} & ({ select?: GassmaGassmaPostFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaPostOmit });

export type GassmaGassmaCommentFindData = {
  where?: GassmaGassmaCommentWhereUse;
  orderBy?: GassmaGassmaCommentOrderBy;
  take?: number;
  skip?: number;
  distinct?: "id" | "text" | "authorId" | "postId" | "createdAt" | ("id" | "text" | "authorId" | "postId" | "createdAt")[];
  include?: GassmaGassmaCommentInclude;
  cursor?: Partial<GassmaGassmaCommentUse>;
  _count?: GassmaGassmaCommentCountValue;
} & ({ select?: GassmaGassmaCommentFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaCommentOmit });

export type GassmaGassmaCategoryFindData = {
  where?: GassmaGassmaCategoryWhereUse;
  orderBy?: GassmaGassmaCategoryOrderBy;
  take?: number;
  skip?: number;
  distinct?: "id" | "name" | "parentId" | ("id" | "name" | "parentId")[];
  include?: GassmaGassmaCategoryInclude;
  cursor?: Partial<GassmaGassmaCategoryUse>;
  _count?: GassmaGassmaCategoryCountValue;
} & ({ select?: GassmaGassmaCategoryFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaCategoryOmit });

export type GassmaGassmaTagFindData = {
  where?: GassmaGassmaTagWhereUse;
  orderBy?: GassmaGassmaTagOrderBy;
  take?: number;
  skip?: number;
  distinct?: "id" | "name" | ("id" | "name")[];
  include?: GassmaGassmaTagInclude;
  cursor?: Partial<GassmaGassmaTagUse>;
  _count?: GassmaGassmaTagCountValue;
} & ({ select?: GassmaGassmaTagFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaTagOmit });

export type GassmaGassmaProductFindData = {
  where?: GassmaGassmaProductWhereUse;
  orderBy?: GassmaGassmaProductOrderBy;
  take?: number;
  skip?: number;
  distinct?: "id" | "name" | "price" | "stock" | "status" | "createdAt" | "updatedAt" | ("id" | "name" | "price" | "stock" | "status" | "createdAt" | "updatedAt")[];
  include?: GassmaGassmaProductInclude;
  cursor?: Partial<GassmaGassmaProductUse>;
  _count?: GassmaGassmaProductCountValue;
} & ({ select?: GassmaGassmaProductFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProductOmit });

export type GassmaGassmaOrderFindData = {
  where?: GassmaGassmaOrderWhereUse;
  orderBy?: GassmaGassmaOrderOrderBy;
  take?: number;
  skip?: number;
  distinct?: "id" | "userId" | "totalAmount" | "quantity" | "status" | "createdAt" | ("id" | "userId" | "totalAmount" | "quantity" | "status" | "createdAt")[];
  include?: GassmaGassmaOrderInclude;
  cursor?: Partial<GassmaGassmaOrderUse>;
  _count?: GassmaGassmaOrderCountValue;
} & ({ select?: GassmaGassmaOrderFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderOmit });

export type GassmaGassmaOrderItemFindData = {
  where?: GassmaGassmaOrderItemWhereUse;
  orderBy?: GassmaGassmaOrderItemOrderBy;
  take?: number;
  skip?: number;
  distinct?: "id" | "orderId" | "productId" | "quantity" | "unitPrice" | ("id" | "orderId" | "productId" | "quantity" | "unitPrice")[];
  include?: GassmaGassmaOrderItemInclude;
  cursor?: Partial<GassmaGassmaOrderItemUse>;
  _count?: GassmaGassmaOrderItemCountValue;
} & ({ select?: GassmaGassmaOrderItemFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderItemOmit });

export type GassmaGassmaNotificationFindData = {
  where?: GassmaGassmaNotificationWhereUse;
  orderBy?: GassmaGassmaNotificationOrderBy;
  take?: number;
  skip?: number;
  distinct?: "id" | "userId" | "message" | "isRead" | ("id" | "userId" | "message" | "isRead")[];
  include?: GassmaGassmaNotificationInclude;
  cursor?: Partial<GassmaGassmaNotificationUse>;
  _count?: GassmaGassmaNotificationCountValue;
} & ({ select?: GassmaGassmaNotificationFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaNotificationOmit });

export type GassmaGassmaUserFindData = {
  where?: GassmaGassmaUserWhereUse;
  orderBy?: GassmaGassmaUserOrderBy;
  take?: number;
  skip?: number;
  distinct?: "id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt" | ("id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt")[];
  include?: GassmaGassmaUserInclude;
  cursor?: Partial<GassmaGassmaUserUse>;
  _count?: GassmaGassmaUserCountValue;
} & ({ select?: GassmaGassmaUserFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaUserOmit });

export type GassmaGassmaProfileFindData = {
  where?: GassmaGassmaProfileWhereUse;
  orderBy?: GassmaGassmaProfileOrderBy;
  take?: number;
  skip?: number;
  distinct?: "id" | "bio" | "website" | "userId" | ("id" | "bio" | "website" | "userId")[];
  include?: GassmaGassmaProfileInclude;
  cursor?: Partial<GassmaGassmaProfileUse>;
  _count?: GassmaGassmaProfileCountValue;
} & ({ select?: GassmaGassmaProfileFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProfileOmit });

export type GassmaGassmaPostFindFirstData = {
  where?: GassmaGassmaPostWhereUse;
  orderBy?: GassmaGassmaPostOrderBy;
  include?: GassmaGassmaPostInclude;
  cursor?: Partial<GassmaGassmaPostUse>;
  _count?: GassmaGassmaPostCountValue;
} & ({ select?: GassmaGassmaPostFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaPostOmit });

export type GassmaGassmaCommentFindFirstData = {
  where?: GassmaGassmaCommentWhereUse;
  orderBy?: GassmaGassmaCommentOrderBy;
  include?: GassmaGassmaCommentInclude;
  cursor?: Partial<GassmaGassmaCommentUse>;
  _count?: GassmaGassmaCommentCountValue;
} & ({ select?: GassmaGassmaCommentFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaCommentOmit });

export type GassmaGassmaCategoryFindFirstData = {
  where?: GassmaGassmaCategoryWhereUse;
  orderBy?: GassmaGassmaCategoryOrderBy;
  include?: GassmaGassmaCategoryInclude;
  cursor?: Partial<GassmaGassmaCategoryUse>;
  _count?: GassmaGassmaCategoryCountValue;
} & ({ select?: GassmaGassmaCategoryFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaCategoryOmit });

export type GassmaGassmaTagFindFirstData = {
  where?: GassmaGassmaTagWhereUse;
  orderBy?: GassmaGassmaTagOrderBy;
  include?: GassmaGassmaTagInclude;
  cursor?: Partial<GassmaGassmaTagUse>;
  _count?: GassmaGassmaTagCountValue;
} & ({ select?: GassmaGassmaTagFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaTagOmit });

export type GassmaGassmaProductFindFirstData = {
  where?: GassmaGassmaProductWhereUse;
  orderBy?: GassmaGassmaProductOrderBy;
  include?: GassmaGassmaProductInclude;
  cursor?: Partial<GassmaGassmaProductUse>;
  _count?: GassmaGassmaProductCountValue;
} & ({ select?: GassmaGassmaProductFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProductOmit });

export type GassmaGassmaOrderFindFirstData = {
  where?: GassmaGassmaOrderWhereUse;
  orderBy?: GassmaGassmaOrderOrderBy;
  include?: GassmaGassmaOrderInclude;
  cursor?: Partial<GassmaGassmaOrderUse>;
  _count?: GassmaGassmaOrderCountValue;
} & ({ select?: GassmaGassmaOrderFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderOmit });

export type GassmaGassmaOrderItemFindFirstData = {
  where?: GassmaGassmaOrderItemWhereUse;
  orderBy?: GassmaGassmaOrderItemOrderBy;
  include?: GassmaGassmaOrderItemInclude;
  cursor?: Partial<GassmaGassmaOrderItemUse>;
  _count?: GassmaGassmaOrderItemCountValue;
} & ({ select?: GassmaGassmaOrderItemFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderItemOmit });

export type GassmaGassmaNotificationFindFirstData = {
  where?: GassmaGassmaNotificationWhereUse;
  orderBy?: GassmaGassmaNotificationOrderBy;
  include?: GassmaGassmaNotificationInclude;
  cursor?: Partial<GassmaGassmaNotificationUse>;
  _count?: GassmaGassmaNotificationCountValue;
} & ({ select?: GassmaGassmaNotificationFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaNotificationOmit });

export type GassmaGassmaUserFindFirstData = {
  where?: GassmaGassmaUserWhereUse;
  orderBy?: GassmaGassmaUserOrderBy;
  include?: GassmaGassmaUserInclude;
  cursor?: Partial<GassmaGassmaUserUse>;
  _count?: GassmaGassmaUserCountValue;
} & ({ select?: GassmaGassmaUserFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaUserOmit });

export type GassmaGassmaProfileFindFirstData = {
  where?: GassmaGassmaProfileWhereUse;
  orderBy?: GassmaGassmaProfileOrderBy;
  include?: GassmaGassmaProfileInclude;
  cursor?: Partial<GassmaGassmaProfileUse>;
  _count?: GassmaGassmaProfileCountValue;
} & ({ select?: GassmaGassmaProfileFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProfileOmit });

export type GassmaGassmaPostFindManyData = GassmaGassmaPostFindData;

export type GassmaGassmaCommentFindManyData = GassmaGassmaCommentFindData;

export type GassmaGassmaCategoryFindManyData = GassmaGassmaCategoryFindData;

export type GassmaGassmaTagFindManyData = GassmaGassmaTagFindData;

export type GassmaGassmaProductFindManyData = GassmaGassmaProductFindData;

export type GassmaGassmaOrderFindManyData = GassmaGassmaOrderFindData;

export type GassmaGassmaOrderItemFindManyData = GassmaGassmaOrderItemFindData;

export type GassmaGassmaNotificationFindManyData = GassmaGassmaNotificationFindData;

export type GassmaGassmaUserFindManyData = GassmaGassmaUserFindData;

export type GassmaGassmaProfileFindManyData = GassmaGassmaProfileFindData;

export type GassmaGassmaPostUpdateData = {
  where?: GassmaGassmaPostWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | Gassma.NumberOperation }> & {
    "author"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse } };
    "category"?: { create?: GassmaGassmaCategoryUse; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse } };
    "comments"?: { create?: GassmaGassmaCommentUse | GassmaGassmaCommentUse[]; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: GassmaGassmaCommentUse } | { where: GassmaGassmaCommentWhereUse; create: GassmaGassmaCommentUse }[]; update?: { where: GassmaGassmaCommentWhereUse; data: Partial<GassmaGassmaCommentUse> } | { where: GassmaGassmaCommentWhereUse; data: Partial<GassmaGassmaCommentUse> }[]; delete?: boolean | GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; deleteMany?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; disconnect?: boolean | GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; set?: GassmaGassmaCommentWhereUse[] };
    "tags"?: { create?: GassmaGassmaTagUse | GassmaGassmaTagUse[]; connect?: GassmaGassmaTagWhereUse | GassmaGassmaTagWhereUse[]; connectOrCreate?: { where: GassmaGassmaTagWhereUse; create: GassmaGassmaTagUse } | { where: GassmaGassmaTagWhereUse; create: GassmaGassmaTagUse }[]; disconnect?: GassmaGassmaTagWhereUse | GassmaGassmaTagWhereUse[]; set?: GassmaGassmaTagWhereUse[] };
  };
  limit?: number;
};

export type GassmaGassmaCommentUpdateData = {
  where?: GassmaGassmaCommentWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | Gassma.NumberOperation }> & {
    "author"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse } };
    "post"?: { create?: GassmaGassmaPostUse; connect?: GassmaGassmaPostWhereUse; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } };
  };
  limit?: number;
};

export type GassmaGassmaCategoryUpdateData = {
  where?: GassmaGassmaCategoryWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | Gassma.NumberOperation }> & {
    "posts"?: { create?: GassmaGassmaPostUse | GassmaGassmaPostUse[]; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } | { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse }[]; update?: { where: GassmaGassmaPostWhereUse; data: Partial<GassmaGassmaPostUse> } | { where: GassmaGassmaPostWhereUse; data: Partial<GassmaGassmaPostUse> }[]; delete?: boolean | GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; deleteMany?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; disconnect?: boolean | GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
    "parent"?: { create?: GassmaGassmaCategoryUse; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse } };
    "children"?: { create?: GassmaGassmaCategoryUse | GassmaGassmaCategoryUse[]; connect?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse } | { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse }[]; update?: { where: GassmaGassmaCategoryWhereUse; data: Partial<GassmaGassmaCategoryUse> } | { where: GassmaGassmaCategoryWhereUse; data: Partial<GassmaGassmaCategoryUse> }[]; delete?: boolean | GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; deleteMany?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; disconnect?: boolean | GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; set?: GassmaGassmaCategoryWhereUse[] };
  };
  limit?: number;
};

export type GassmaGassmaTagUpdateData = {
  where?: GassmaGassmaTagWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaTagUse]: GassmaGassmaTagUse[K] | Gassma.NumberOperation }> & {
    "posts"?: { create?: GassmaGassmaPostUse | GassmaGassmaPostUse[]; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } | { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse }[]; disconnect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
  };
  limit?: number;
};

export type GassmaGassmaProductUpdateData = {
  where?: GassmaGassmaProductWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaProductUse]: GassmaGassmaProductUse[K] | Gassma.NumberOperation }> & {
    "orderItems"?: { create?: GassmaGassmaOrderItemUse | GassmaGassmaOrderItemUse[]; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: GassmaGassmaOrderItemUse } | { where: GassmaGassmaOrderItemWhereUse; create: GassmaGassmaOrderItemUse }[]; update?: { where: GassmaGassmaOrderItemWhereUse; data: Partial<GassmaGassmaOrderItemUse> } | { where: GassmaGassmaOrderItemWhereUse; data: Partial<GassmaGassmaOrderItemUse> }[]; delete?: boolean | GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; deleteMany?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; disconnect?: boolean | GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; set?: GassmaGassmaOrderItemWhereUse[] };
  };
  limit?: number;
};

export type GassmaGassmaOrderUpdateData = {
  where?: GassmaGassmaOrderWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaOrderUse]: GassmaGassmaOrderUse[K] | Gassma.NumberOperation }> & {
    "user"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse } };
    "items"?: { create?: GassmaGassmaOrderItemUse | GassmaGassmaOrderItemUse[]; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: GassmaGassmaOrderItemUse } | { where: GassmaGassmaOrderItemWhereUse; create: GassmaGassmaOrderItemUse }[]; update?: { where: GassmaGassmaOrderItemWhereUse; data: Partial<GassmaGassmaOrderItemUse> } | { where: GassmaGassmaOrderItemWhereUse; data: Partial<GassmaGassmaOrderItemUse> }[]; delete?: boolean | GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; deleteMany?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; disconnect?: boolean | GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; set?: GassmaGassmaOrderItemWhereUse[] };
  };
  limit?: number;
};

export type GassmaGassmaOrderItemUpdateData = {
  where?: GassmaGassmaOrderItemWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | Gassma.NumberOperation }> & {
    "order"?: { create?: GassmaGassmaOrderUse; connect?: GassmaGassmaOrderWhereUse; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: GassmaGassmaOrderUse } };
    "product"?: { create?: GassmaGassmaProductUse; connect?: GassmaGassmaProductWhereUse; connectOrCreate?: { where: GassmaGassmaProductWhereUse; create: GassmaGassmaProductUse } };
  };
  limit?: number;
};

export type GassmaGassmaNotificationUpdateData = {
  where?: GassmaGassmaNotificationWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaNotificationUse]: GassmaGassmaNotificationUse[K] | Gassma.NumberOperation }>;
  limit?: number;
};

export type GassmaGassmaUserUpdateData = {
  where?: GassmaGassmaUserWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | Gassma.NumberOperation }> & {
    "posts"?: { create?: GassmaGassmaPostUse | GassmaGassmaPostUse[]; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } | { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse }[]; update?: { where: GassmaGassmaPostWhereUse; data: Partial<GassmaGassmaPostUse> } | { where: GassmaGassmaPostWhereUse; data: Partial<GassmaGassmaPostUse> }[]; delete?: boolean | GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; deleteMany?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; disconnect?: boolean | GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
    "comments"?: { create?: GassmaGassmaCommentUse | GassmaGassmaCommentUse[]; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: GassmaGassmaCommentUse } | { where: GassmaGassmaCommentWhereUse; create: GassmaGassmaCommentUse }[]; update?: { where: GassmaGassmaCommentWhereUse; data: Partial<GassmaGassmaCommentUse> } | { where: GassmaGassmaCommentWhereUse; data: Partial<GassmaGassmaCommentUse> }[]; delete?: boolean | GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; deleteMany?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; disconnect?: boolean | GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; set?: GassmaGassmaCommentWhereUse[] };
    "orders"?: { create?: GassmaGassmaOrderUse | GassmaGassmaOrderUse[]; connect?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: GassmaGassmaOrderUse } | { where: GassmaGassmaOrderWhereUse; create: GassmaGassmaOrderUse }[]; update?: { where: GassmaGassmaOrderWhereUse; data: Partial<GassmaGassmaOrderUse> } | { where: GassmaGassmaOrderWhereUse; data: Partial<GassmaGassmaOrderUse> }[]; delete?: boolean | GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; deleteMany?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; disconnect?: boolean | GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; set?: GassmaGassmaOrderWhereUse[] };
    "profile"?: { create?: GassmaGassmaProfileUse; connect?: GassmaGassmaProfileWhereUse; connectOrCreate?: { where: GassmaGassmaProfileWhereUse; create: GassmaGassmaProfileUse }; update?: Partial<GassmaGassmaProfileUse>; delete?: true; disconnect?: true };
  };
  limit?: number;
};

export type GassmaGassmaProfileUpdateData = {
  where?: GassmaGassmaProfileWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaProfileUse]: GassmaGassmaProfileUse[K] | Gassma.NumberOperation }> & {
    "user"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse }; update?: Partial<GassmaGassmaUserUse>; delete?: true; disconnect?: true };
  };
  limit?: number;
};

export type GassmaGassmaPostUpdateSingleData = {
  where: GassmaGassmaPostWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | Gassma.NumberOperation }> & {
    "author"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse } };
    "category"?: { create?: GassmaGassmaCategoryUse; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse } };
    "comments"?: { create?: GassmaGassmaCommentUse | GassmaGassmaCommentUse[]; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: GassmaGassmaCommentUse } | { where: GassmaGassmaCommentWhereUse; create: GassmaGassmaCommentUse }[]; update?: { where: GassmaGassmaCommentWhereUse; data: Partial<GassmaGassmaCommentUse> } | { where: GassmaGassmaCommentWhereUse; data: Partial<GassmaGassmaCommentUse> }[]; delete?: boolean | GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; deleteMany?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; disconnect?: boolean | GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; set?: GassmaGassmaCommentWhereUse[] };
    "tags"?: { create?: GassmaGassmaTagUse | GassmaGassmaTagUse[]; connect?: GassmaGassmaTagWhereUse | GassmaGassmaTagWhereUse[]; connectOrCreate?: { where: GassmaGassmaTagWhereUse; create: GassmaGassmaTagUse } | { where: GassmaGassmaTagWhereUse; create: GassmaGassmaTagUse }[]; disconnect?: GassmaGassmaTagWhereUse | GassmaGassmaTagWhereUse[]; set?: GassmaGassmaTagWhereUse[] };
  };
  include?: GassmaGassmaPostInclude;
} & ({ select?: GassmaGassmaPostSelect; omit?: never } | { select?: never; omit?: GassmaGassmaPostOmit });

export type GassmaGassmaCommentUpdateSingleData = {
  where: GassmaGassmaCommentWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | Gassma.NumberOperation }> & {
    "author"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse } };
    "post"?: { create?: GassmaGassmaPostUse; connect?: GassmaGassmaPostWhereUse; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } };
  };
  include?: GassmaGassmaCommentInclude;
} & ({ select?: GassmaGassmaCommentSelect; omit?: never } | { select?: never; omit?: GassmaGassmaCommentOmit });

export type GassmaGassmaCategoryUpdateSingleData = {
  where: GassmaGassmaCategoryWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | Gassma.NumberOperation }> & {
    "posts"?: { create?: GassmaGassmaPostUse | GassmaGassmaPostUse[]; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } | { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse }[]; update?: { where: GassmaGassmaPostWhereUse; data: Partial<GassmaGassmaPostUse> } | { where: GassmaGassmaPostWhereUse; data: Partial<GassmaGassmaPostUse> }[]; delete?: boolean | GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; deleteMany?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; disconnect?: boolean | GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
    "parent"?: { create?: GassmaGassmaCategoryUse; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse } };
    "children"?: { create?: GassmaGassmaCategoryUse | GassmaGassmaCategoryUse[]; connect?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse } | { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse }[]; update?: { where: GassmaGassmaCategoryWhereUse; data: Partial<GassmaGassmaCategoryUse> } | { where: GassmaGassmaCategoryWhereUse; data: Partial<GassmaGassmaCategoryUse> }[]; delete?: boolean | GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; deleteMany?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; disconnect?: boolean | GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; set?: GassmaGassmaCategoryWhereUse[] };
  };
  include?: GassmaGassmaCategoryInclude;
} & ({ select?: GassmaGassmaCategorySelect; omit?: never } | { select?: never; omit?: GassmaGassmaCategoryOmit });

export type GassmaGassmaTagUpdateSingleData = {
  where: GassmaGassmaTagWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaTagUse]: GassmaGassmaTagUse[K] | Gassma.NumberOperation }> & {
    "posts"?: { create?: GassmaGassmaPostUse | GassmaGassmaPostUse[]; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } | { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse }[]; disconnect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
  };
  include?: GassmaGassmaTagInclude;
} & ({ select?: GassmaGassmaTagSelect; omit?: never } | { select?: never; omit?: GassmaGassmaTagOmit });

export type GassmaGassmaProductUpdateSingleData = {
  where: GassmaGassmaProductWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaProductUse]: GassmaGassmaProductUse[K] | Gassma.NumberOperation }> & {
    "orderItems"?: { create?: GassmaGassmaOrderItemUse | GassmaGassmaOrderItemUse[]; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: GassmaGassmaOrderItemUse } | { where: GassmaGassmaOrderItemWhereUse; create: GassmaGassmaOrderItemUse }[]; update?: { where: GassmaGassmaOrderItemWhereUse; data: Partial<GassmaGassmaOrderItemUse> } | { where: GassmaGassmaOrderItemWhereUse; data: Partial<GassmaGassmaOrderItemUse> }[]; delete?: boolean | GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; deleteMany?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; disconnect?: boolean | GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; set?: GassmaGassmaOrderItemWhereUse[] };
  };
  include?: GassmaGassmaProductInclude;
} & ({ select?: GassmaGassmaProductSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProductOmit });

export type GassmaGassmaOrderUpdateSingleData = {
  where: GassmaGassmaOrderWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaOrderUse]: GassmaGassmaOrderUse[K] | Gassma.NumberOperation }> & {
    "user"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse } };
    "items"?: { create?: GassmaGassmaOrderItemUse | GassmaGassmaOrderItemUse[]; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: GassmaGassmaOrderItemUse } | { where: GassmaGassmaOrderItemWhereUse; create: GassmaGassmaOrderItemUse }[]; update?: { where: GassmaGassmaOrderItemWhereUse; data: Partial<GassmaGassmaOrderItemUse> } | { where: GassmaGassmaOrderItemWhereUse; data: Partial<GassmaGassmaOrderItemUse> }[]; delete?: boolean | GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; deleteMany?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; disconnect?: boolean | GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; set?: GassmaGassmaOrderItemWhereUse[] };
  };
  include?: GassmaGassmaOrderInclude;
} & ({ select?: GassmaGassmaOrderSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderOmit });

export type GassmaGassmaOrderItemUpdateSingleData = {
  where: GassmaGassmaOrderItemWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | Gassma.NumberOperation }> & {
    "order"?: { create?: GassmaGassmaOrderUse; connect?: GassmaGassmaOrderWhereUse; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: GassmaGassmaOrderUse } };
    "product"?: { create?: GassmaGassmaProductUse; connect?: GassmaGassmaProductWhereUse; connectOrCreate?: { where: GassmaGassmaProductWhereUse; create: GassmaGassmaProductUse } };
  };
  include?: GassmaGassmaOrderItemInclude;
} & ({ select?: GassmaGassmaOrderItemSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderItemOmit });

export type GassmaGassmaNotificationUpdateSingleData = {
  where: GassmaGassmaNotificationWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaNotificationUse]: GassmaGassmaNotificationUse[K] | Gassma.NumberOperation }>;
  include?: GassmaGassmaNotificationInclude;
} & ({ select?: GassmaGassmaNotificationSelect; omit?: never } | { select?: never; omit?: GassmaGassmaNotificationOmit });

export type GassmaGassmaUserUpdateSingleData = {
  where: GassmaGassmaUserWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | Gassma.NumberOperation }> & {
    "posts"?: { create?: GassmaGassmaPostUse | GassmaGassmaPostUse[]; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } | { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse }[]; update?: { where: GassmaGassmaPostWhereUse; data: Partial<GassmaGassmaPostUse> } | { where: GassmaGassmaPostWhereUse; data: Partial<GassmaGassmaPostUse> }[]; delete?: boolean | GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; deleteMany?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; disconnect?: boolean | GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
    "comments"?: { create?: GassmaGassmaCommentUse | GassmaGassmaCommentUse[]; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: GassmaGassmaCommentUse } | { where: GassmaGassmaCommentWhereUse; create: GassmaGassmaCommentUse }[]; update?: { where: GassmaGassmaCommentWhereUse; data: Partial<GassmaGassmaCommentUse> } | { where: GassmaGassmaCommentWhereUse; data: Partial<GassmaGassmaCommentUse> }[]; delete?: boolean | GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; deleteMany?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; disconnect?: boolean | GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; set?: GassmaGassmaCommentWhereUse[] };
    "orders"?: { create?: GassmaGassmaOrderUse | GassmaGassmaOrderUse[]; connect?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: GassmaGassmaOrderUse } | { where: GassmaGassmaOrderWhereUse; create: GassmaGassmaOrderUse }[]; update?: { where: GassmaGassmaOrderWhereUse; data: Partial<GassmaGassmaOrderUse> } | { where: GassmaGassmaOrderWhereUse; data: Partial<GassmaGassmaOrderUse> }[]; delete?: boolean | GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; deleteMany?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; disconnect?: boolean | GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; set?: GassmaGassmaOrderWhereUse[] };
    "profile"?: { create?: GassmaGassmaProfileUse; connect?: GassmaGassmaProfileWhereUse; connectOrCreate?: { where: GassmaGassmaProfileWhereUse; create: GassmaGassmaProfileUse }; update?: Partial<GassmaGassmaProfileUse>; delete?: true; disconnect?: true };
  };
  include?: GassmaGassmaUserInclude;
} & ({ select?: GassmaGassmaUserSelect; omit?: never } | { select?: never; omit?: GassmaGassmaUserOmit });

export type GassmaGassmaProfileUpdateSingleData = {
  where: GassmaGassmaProfileWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaProfileUse]: GassmaGassmaProfileUse[K] | Gassma.NumberOperation }> & {
    "user"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse }; update?: Partial<GassmaGassmaUserUse>; delete?: true; disconnect?: true };
  };
  include?: GassmaGassmaProfileInclude;
} & ({ select?: GassmaGassmaProfileSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProfileOmit });

export type GassmaGassmaPostUpsertSingleData = {
  where: GassmaGassmaPostWhereUse;
  create: GassmaGassmaPostUse & {
    "author"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse } };
    "category"?: { create?: GassmaGassmaCategoryUse; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse } };
    "comments"?: { create?: GassmaGassmaCommentUse | GassmaGassmaCommentUse[]; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: GassmaGassmaCommentUse } | { where: GassmaGassmaCommentWhereUse; create: GassmaGassmaCommentUse }[]; update?: { where: GassmaGassmaCommentWhereUse; data: Partial<GassmaGassmaCommentUse> } | { where: GassmaGassmaCommentWhereUse; data: Partial<GassmaGassmaCommentUse> }[]; delete?: boolean | GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; deleteMany?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; disconnect?: boolean | GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; set?: GassmaGassmaCommentWhereUse[] };
    "tags"?: { create?: GassmaGassmaTagUse | GassmaGassmaTagUse[]; connect?: GassmaGassmaTagWhereUse | GassmaGassmaTagWhereUse[]; connectOrCreate?: { where: GassmaGassmaTagWhereUse; create: GassmaGassmaTagUse } | { where: GassmaGassmaTagWhereUse; create: GassmaGassmaTagUse }[]; disconnect?: GassmaGassmaTagWhereUse | GassmaGassmaTagWhereUse[]; set?: GassmaGassmaTagWhereUse[] };
  };
  update: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | Gassma.NumberOperation }> & {
    "author"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse } };
    "category"?: { create?: GassmaGassmaCategoryUse; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse } };
    "comments"?: { create?: GassmaGassmaCommentUse | GassmaGassmaCommentUse[]; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: GassmaGassmaCommentUse } | { where: GassmaGassmaCommentWhereUse; create: GassmaGassmaCommentUse }[]; update?: { where: GassmaGassmaCommentWhereUse; data: Partial<GassmaGassmaCommentUse> } | { where: GassmaGassmaCommentWhereUse; data: Partial<GassmaGassmaCommentUse> }[]; delete?: boolean | GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; deleteMany?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; disconnect?: boolean | GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; set?: GassmaGassmaCommentWhereUse[] };
    "tags"?: { create?: GassmaGassmaTagUse | GassmaGassmaTagUse[]; connect?: GassmaGassmaTagWhereUse | GassmaGassmaTagWhereUse[]; connectOrCreate?: { where: GassmaGassmaTagWhereUse; create: GassmaGassmaTagUse } | { where: GassmaGassmaTagWhereUse; create: GassmaGassmaTagUse }[]; disconnect?: GassmaGassmaTagWhereUse | GassmaGassmaTagWhereUse[]; set?: GassmaGassmaTagWhereUse[] };
  };
  include?: GassmaGassmaPostInclude;
} & ({ select?: GassmaGassmaPostSelect; omit?: never } | { select?: never; omit?: GassmaGassmaPostOmit });

export type GassmaGassmaCommentUpsertSingleData = {
  where: GassmaGassmaCommentWhereUse;
  create: GassmaGassmaCommentUse & {
    "author"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse } };
    "post"?: { create?: GassmaGassmaPostUse; connect?: GassmaGassmaPostWhereUse; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } };
  };
  update: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | Gassma.NumberOperation }> & {
    "author"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse } };
    "post"?: { create?: GassmaGassmaPostUse; connect?: GassmaGassmaPostWhereUse; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } };
  };
  include?: GassmaGassmaCommentInclude;
} & ({ select?: GassmaGassmaCommentSelect; omit?: never } | { select?: never; omit?: GassmaGassmaCommentOmit });

export type GassmaGassmaCategoryUpsertSingleData = {
  where: GassmaGassmaCategoryWhereUse;
  create: GassmaGassmaCategoryUse & {
    "posts"?: { create?: GassmaGassmaPostUse | GassmaGassmaPostUse[]; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } | { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse }[]; update?: { where: GassmaGassmaPostWhereUse; data: Partial<GassmaGassmaPostUse> } | { where: GassmaGassmaPostWhereUse; data: Partial<GassmaGassmaPostUse> }[]; delete?: boolean | GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; deleteMany?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; disconnect?: boolean | GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
    "parent"?: { create?: GassmaGassmaCategoryUse; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse } };
    "children"?: { create?: GassmaGassmaCategoryUse | GassmaGassmaCategoryUse[]; connect?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse } | { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse }[]; update?: { where: GassmaGassmaCategoryWhereUse; data: Partial<GassmaGassmaCategoryUse> } | { where: GassmaGassmaCategoryWhereUse; data: Partial<GassmaGassmaCategoryUse> }[]; delete?: boolean | GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; deleteMany?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; disconnect?: boolean | GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; set?: GassmaGassmaCategoryWhereUse[] };
  };
  update: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | Gassma.NumberOperation }> & {
    "posts"?: { create?: GassmaGassmaPostUse | GassmaGassmaPostUse[]; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } | { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse }[]; update?: { where: GassmaGassmaPostWhereUse; data: Partial<GassmaGassmaPostUse> } | { where: GassmaGassmaPostWhereUse; data: Partial<GassmaGassmaPostUse> }[]; delete?: boolean | GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; deleteMany?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; disconnect?: boolean | GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
    "parent"?: { create?: GassmaGassmaCategoryUse; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse } };
    "children"?: { create?: GassmaGassmaCategoryUse | GassmaGassmaCategoryUse[]; connect?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse } | { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse }[]; update?: { where: GassmaGassmaCategoryWhereUse; data: Partial<GassmaGassmaCategoryUse> } | { where: GassmaGassmaCategoryWhereUse; data: Partial<GassmaGassmaCategoryUse> }[]; delete?: boolean | GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; deleteMany?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; disconnect?: boolean | GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; set?: GassmaGassmaCategoryWhereUse[] };
  };
  include?: GassmaGassmaCategoryInclude;
} & ({ select?: GassmaGassmaCategorySelect; omit?: never } | { select?: never; omit?: GassmaGassmaCategoryOmit });

export type GassmaGassmaTagUpsertSingleData = {
  where: GassmaGassmaTagWhereUse;
  create: GassmaGassmaTagUse & {
    "posts"?: { create?: GassmaGassmaPostUse | GassmaGassmaPostUse[]; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } | { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse }[]; disconnect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
  };
  update: Partial<{ [K in keyof GassmaGassmaTagUse]: GassmaGassmaTagUse[K] | Gassma.NumberOperation }> & {
    "posts"?: { create?: GassmaGassmaPostUse | GassmaGassmaPostUse[]; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } | { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse }[]; disconnect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
  };
  include?: GassmaGassmaTagInclude;
} & ({ select?: GassmaGassmaTagSelect; omit?: never } | { select?: never; omit?: GassmaGassmaTagOmit });

export type GassmaGassmaProductUpsertSingleData = {
  where: GassmaGassmaProductWhereUse;
  create: GassmaGassmaProductUse & {
    "orderItems"?: { create?: GassmaGassmaOrderItemUse | GassmaGassmaOrderItemUse[]; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: GassmaGassmaOrderItemUse } | { where: GassmaGassmaOrderItemWhereUse; create: GassmaGassmaOrderItemUse }[]; update?: { where: GassmaGassmaOrderItemWhereUse; data: Partial<GassmaGassmaOrderItemUse> } | { where: GassmaGassmaOrderItemWhereUse; data: Partial<GassmaGassmaOrderItemUse> }[]; delete?: boolean | GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; deleteMany?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; disconnect?: boolean | GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; set?: GassmaGassmaOrderItemWhereUse[] };
  };
  update: Partial<{ [K in keyof GassmaGassmaProductUse]: GassmaGassmaProductUse[K] | Gassma.NumberOperation }> & {
    "orderItems"?: { create?: GassmaGassmaOrderItemUse | GassmaGassmaOrderItemUse[]; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: GassmaGassmaOrderItemUse } | { where: GassmaGassmaOrderItemWhereUse; create: GassmaGassmaOrderItemUse }[]; update?: { where: GassmaGassmaOrderItemWhereUse; data: Partial<GassmaGassmaOrderItemUse> } | { where: GassmaGassmaOrderItemWhereUse; data: Partial<GassmaGassmaOrderItemUse> }[]; delete?: boolean | GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; deleteMany?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; disconnect?: boolean | GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; set?: GassmaGassmaOrderItemWhereUse[] };
  };
  include?: GassmaGassmaProductInclude;
} & ({ select?: GassmaGassmaProductSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProductOmit });

export type GassmaGassmaOrderUpsertSingleData = {
  where: GassmaGassmaOrderWhereUse;
  create: GassmaGassmaOrderUse & {
    "user"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse } };
    "items"?: { create?: GassmaGassmaOrderItemUse | GassmaGassmaOrderItemUse[]; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: GassmaGassmaOrderItemUse } | { where: GassmaGassmaOrderItemWhereUse; create: GassmaGassmaOrderItemUse }[]; update?: { where: GassmaGassmaOrderItemWhereUse; data: Partial<GassmaGassmaOrderItemUse> } | { where: GassmaGassmaOrderItemWhereUse; data: Partial<GassmaGassmaOrderItemUse> }[]; delete?: boolean | GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; deleteMany?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; disconnect?: boolean | GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; set?: GassmaGassmaOrderItemWhereUse[] };
  };
  update: Partial<{ [K in keyof GassmaGassmaOrderUse]: GassmaGassmaOrderUse[K] | Gassma.NumberOperation }> & {
    "user"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse } };
    "items"?: { create?: GassmaGassmaOrderItemUse | GassmaGassmaOrderItemUse[]; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: GassmaGassmaOrderItemUse } | { where: GassmaGassmaOrderItemWhereUse; create: GassmaGassmaOrderItemUse }[]; update?: { where: GassmaGassmaOrderItemWhereUse; data: Partial<GassmaGassmaOrderItemUse> } | { where: GassmaGassmaOrderItemWhereUse; data: Partial<GassmaGassmaOrderItemUse> }[]; delete?: boolean | GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; deleteMany?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; disconnect?: boolean | GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; set?: GassmaGassmaOrderItemWhereUse[] };
  };
  include?: GassmaGassmaOrderInclude;
} & ({ select?: GassmaGassmaOrderSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderOmit });

export type GassmaGassmaOrderItemUpsertSingleData = {
  where: GassmaGassmaOrderItemWhereUse;
  create: GassmaGassmaOrderItemUse & {
    "order"?: { create?: GassmaGassmaOrderUse; connect?: GassmaGassmaOrderWhereUse; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: GassmaGassmaOrderUse } };
    "product"?: { create?: GassmaGassmaProductUse; connect?: GassmaGassmaProductWhereUse; connectOrCreate?: { where: GassmaGassmaProductWhereUse; create: GassmaGassmaProductUse } };
  };
  update: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | Gassma.NumberOperation }> & {
    "order"?: { create?: GassmaGassmaOrderUse; connect?: GassmaGassmaOrderWhereUse; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: GassmaGassmaOrderUse } };
    "product"?: { create?: GassmaGassmaProductUse; connect?: GassmaGassmaProductWhereUse; connectOrCreate?: { where: GassmaGassmaProductWhereUse; create: GassmaGassmaProductUse } };
  };
  include?: GassmaGassmaOrderItemInclude;
} & ({ select?: GassmaGassmaOrderItemSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderItemOmit });

export type GassmaGassmaNotificationUpsertSingleData = {
  where: GassmaGassmaNotificationWhereUse;
  create: GassmaGassmaNotificationUse;
  update: Partial<{ [K in keyof GassmaGassmaNotificationUse]: GassmaGassmaNotificationUse[K] | Gassma.NumberOperation }>;
  include?: GassmaGassmaNotificationInclude;
} & ({ select?: GassmaGassmaNotificationSelect; omit?: never } | { select?: never; omit?: GassmaGassmaNotificationOmit });

export type GassmaGassmaUserUpsertSingleData = {
  where: GassmaGassmaUserWhereUse;
  create: GassmaGassmaUserUse & {
    "posts"?: { create?: GassmaGassmaPostUse | GassmaGassmaPostUse[]; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } | { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse }[]; update?: { where: GassmaGassmaPostWhereUse; data: Partial<GassmaGassmaPostUse> } | { where: GassmaGassmaPostWhereUse; data: Partial<GassmaGassmaPostUse> }[]; delete?: boolean | GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; deleteMany?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; disconnect?: boolean | GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
    "comments"?: { create?: GassmaGassmaCommentUse | GassmaGassmaCommentUse[]; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: GassmaGassmaCommentUse } | { where: GassmaGassmaCommentWhereUse; create: GassmaGassmaCommentUse }[]; update?: { where: GassmaGassmaCommentWhereUse; data: Partial<GassmaGassmaCommentUse> } | { where: GassmaGassmaCommentWhereUse; data: Partial<GassmaGassmaCommentUse> }[]; delete?: boolean | GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; deleteMany?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; disconnect?: boolean | GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; set?: GassmaGassmaCommentWhereUse[] };
    "orders"?: { create?: GassmaGassmaOrderUse | GassmaGassmaOrderUse[]; connect?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: GassmaGassmaOrderUse } | { where: GassmaGassmaOrderWhereUse; create: GassmaGassmaOrderUse }[]; update?: { where: GassmaGassmaOrderWhereUse; data: Partial<GassmaGassmaOrderUse> } | { where: GassmaGassmaOrderWhereUse; data: Partial<GassmaGassmaOrderUse> }[]; delete?: boolean | GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; deleteMany?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; disconnect?: boolean | GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; set?: GassmaGassmaOrderWhereUse[] };
    "profile"?: { create?: GassmaGassmaProfileUse; connect?: GassmaGassmaProfileWhereUse; connectOrCreate?: { where: GassmaGassmaProfileWhereUse; create: GassmaGassmaProfileUse }; update?: Partial<GassmaGassmaProfileUse>; delete?: true; disconnect?: true };
  };
  update: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | Gassma.NumberOperation }> & {
    "posts"?: { create?: GassmaGassmaPostUse | GassmaGassmaPostUse[]; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } | { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse }[]; update?: { where: GassmaGassmaPostWhereUse; data: Partial<GassmaGassmaPostUse> } | { where: GassmaGassmaPostWhereUse; data: Partial<GassmaGassmaPostUse> }[]; delete?: boolean | GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; deleteMany?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; disconnect?: boolean | GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
    "comments"?: { create?: GassmaGassmaCommentUse | GassmaGassmaCommentUse[]; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: GassmaGassmaCommentUse } | { where: GassmaGassmaCommentWhereUse; create: GassmaGassmaCommentUse }[]; update?: { where: GassmaGassmaCommentWhereUse; data: Partial<GassmaGassmaCommentUse> } | { where: GassmaGassmaCommentWhereUse; data: Partial<GassmaGassmaCommentUse> }[]; delete?: boolean | GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; deleteMany?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; disconnect?: boolean | GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; set?: GassmaGassmaCommentWhereUse[] };
    "orders"?: { create?: GassmaGassmaOrderUse | GassmaGassmaOrderUse[]; connect?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: GassmaGassmaOrderUse } | { where: GassmaGassmaOrderWhereUse; create: GassmaGassmaOrderUse }[]; update?: { where: GassmaGassmaOrderWhereUse; data: Partial<GassmaGassmaOrderUse> } | { where: GassmaGassmaOrderWhereUse; data: Partial<GassmaGassmaOrderUse> }[]; delete?: boolean | GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; deleteMany?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; disconnect?: boolean | GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; set?: GassmaGassmaOrderWhereUse[] };
    "profile"?: { create?: GassmaGassmaProfileUse; connect?: GassmaGassmaProfileWhereUse; connectOrCreate?: { where: GassmaGassmaProfileWhereUse; create: GassmaGassmaProfileUse }; update?: Partial<GassmaGassmaProfileUse>; delete?: true; disconnect?: true };
  };
  include?: GassmaGassmaUserInclude;
} & ({ select?: GassmaGassmaUserSelect; omit?: never } | { select?: never; omit?: GassmaGassmaUserOmit });

export type GassmaGassmaProfileUpsertSingleData = {
  where: GassmaGassmaProfileWhereUse;
  create: GassmaGassmaProfileUse & {
    "user"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse }; update?: Partial<GassmaGassmaUserUse>; delete?: true; disconnect?: true };
  };
  update: Partial<{ [K in keyof GassmaGassmaProfileUse]: GassmaGassmaProfileUse[K] | Gassma.NumberOperation }> & {
    "user"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse }; update?: Partial<GassmaGassmaUserUse>; delete?: true; disconnect?: true };
  };
  include?: GassmaGassmaProfileInclude;
} & ({ select?: GassmaGassmaProfileSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProfileOmit });

export type GassmaGassmaPostDeleteData = {
  where: GassmaGassmaPostWhereUse;
  limit?: number;
};

export type GassmaGassmaCommentDeleteData = {
  where: GassmaGassmaCommentWhereUse;
  limit?: number;
};

export type GassmaGassmaCategoryDeleteData = {
  where: GassmaGassmaCategoryWhereUse;
  limit?: number;
};

export type GassmaGassmaTagDeleteData = {
  where: GassmaGassmaTagWhereUse;
  limit?: number;
};

export type GassmaGassmaProductDeleteData = {
  where: GassmaGassmaProductWhereUse;
  limit?: number;
};

export type GassmaGassmaOrderDeleteData = {
  where: GassmaGassmaOrderWhereUse;
  limit?: number;
};

export type GassmaGassmaOrderItemDeleteData = {
  where: GassmaGassmaOrderItemWhereUse;
  limit?: number;
};

export type GassmaGassmaNotificationDeleteData = {
  where: GassmaGassmaNotificationWhereUse;
  limit?: number;
};

export type GassmaGassmaUserDeleteData = {
  where: GassmaGassmaUserWhereUse;
  limit?: number;
};

export type GassmaGassmaProfileDeleteData = {
  where: GassmaGassmaProfileWhereUse;
  limit?: number;
};

export type GassmaGassmaPostDeleteSingleData = {
  where: GassmaGassmaPostWhereUse;
  include?: GassmaGassmaPostInclude;
} & ({ select?: GassmaGassmaPostSelect; omit?: never } | { select?: never; omit?: GassmaGassmaPostOmit });

export type GassmaGassmaCommentDeleteSingleData = {
  where: GassmaGassmaCommentWhereUse;
  include?: GassmaGassmaCommentInclude;
} & ({ select?: GassmaGassmaCommentSelect; omit?: never } | { select?: never; omit?: GassmaGassmaCommentOmit });

export type GassmaGassmaCategoryDeleteSingleData = {
  where: GassmaGassmaCategoryWhereUse;
  include?: GassmaGassmaCategoryInclude;
} & ({ select?: GassmaGassmaCategorySelect; omit?: never } | { select?: never; omit?: GassmaGassmaCategoryOmit });

export type GassmaGassmaTagDeleteSingleData = {
  where: GassmaGassmaTagWhereUse;
  include?: GassmaGassmaTagInclude;
} & ({ select?: GassmaGassmaTagSelect; omit?: never } | { select?: never; omit?: GassmaGassmaTagOmit });

export type GassmaGassmaProductDeleteSingleData = {
  where: GassmaGassmaProductWhereUse;
  include?: GassmaGassmaProductInclude;
} & ({ select?: GassmaGassmaProductSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProductOmit });

export type GassmaGassmaOrderDeleteSingleData = {
  where: GassmaGassmaOrderWhereUse;
  include?: GassmaGassmaOrderInclude;
} & ({ select?: GassmaGassmaOrderSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderOmit });

export type GassmaGassmaOrderItemDeleteSingleData = {
  where: GassmaGassmaOrderItemWhereUse;
  include?: GassmaGassmaOrderItemInclude;
} & ({ select?: GassmaGassmaOrderItemSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderItemOmit });

export type GassmaGassmaNotificationDeleteSingleData = {
  where: GassmaGassmaNotificationWhereUse;
  include?: GassmaGassmaNotificationInclude;
} & ({ select?: GassmaGassmaNotificationSelect; omit?: never } | { select?: never; omit?: GassmaGassmaNotificationOmit });

export type GassmaGassmaUserDeleteSingleData = {
  where: GassmaGassmaUserWhereUse;
  include?: GassmaGassmaUserInclude;
} & ({ select?: GassmaGassmaUserSelect; omit?: never } | { select?: never; omit?: GassmaGassmaUserOmit });

export type GassmaGassmaProfileDeleteSingleData = {
  where: GassmaGassmaProfileWhereUse;
  include?: GassmaGassmaProfileInclude;
} & ({ select?: GassmaGassmaProfileSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProfileOmit });

export type GassmaGassmaPostAggregateData = {
  where?: GassmaGassmaPostWhereUse;
  orderBy?: GassmaGassmaPostOrderBy;
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaPostUse>;
  _avg?: GassmaGassmaPostSelect;
  _count?: GassmaGassmaPostSelect;
  _max?: GassmaGassmaPostSelect;
  _min?: GassmaGassmaPostSelect;
  _sum?: GassmaGassmaPostSelect;
};

export type GassmaGassmaCommentAggregateData = {
  where?: GassmaGassmaCommentWhereUse;
  orderBy?: GassmaGassmaCommentOrderBy;
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaCommentUse>;
  _avg?: GassmaGassmaCommentSelect;
  _count?: GassmaGassmaCommentSelect;
  _max?: GassmaGassmaCommentSelect;
  _min?: GassmaGassmaCommentSelect;
  _sum?: GassmaGassmaCommentSelect;
};

export type GassmaGassmaCategoryAggregateData = {
  where?: GassmaGassmaCategoryWhereUse;
  orderBy?: GassmaGassmaCategoryOrderBy;
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaCategoryUse>;
  _avg?: GassmaGassmaCategorySelect;
  _count?: GassmaGassmaCategorySelect;
  _max?: GassmaGassmaCategorySelect;
  _min?: GassmaGassmaCategorySelect;
  _sum?: GassmaGassmaCategorySelect;
};

export type GassmaGassmaTagAggregateData = {
  where?: GassmaGassmaTagWhereUse;
  orderBy?: GassmaGassmaTagOrderBy;
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaTagUse>;
  _avg?: GassmaGassmaTagSelect;
  _count?: GassmaGassmaTagSelect;
  _max?: GassmaGassmaTagSelect;
  _min?: GassmaGassmaTagSelect;
  _sum?: GassmaGassmaTagSelect;
};

export type GassmaGassmaProductAggregateData = {
  where?: GassmaGassmaProductWhereUse;
  orderBy?: GassmaGassmaProductOrderBy;
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaProductUse>;
  _avg?: GassmaGassmaProductSelect;
  _count?: GassmaGassmaProductSelect;
  _max?: GassmaGassmaProductSelect;
  _min?: GassmaGassmaProductSelect;
  _sum?: GassmaGassmaProductSelect;
};

export type GassmaGassmaOrderAggregateData = {
  where?: GassmaGassmaOrderWhereUse;
  orderBy?: GassmaGassmaOrderOrderBy;
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaOrderUse>;
  _avg?: GassmaGassmaOrderSelect;
  _count?: GassmaGassmaOrderSelect;
  _max?: GassmaGassmaOrderSelect;
  _min?: GassmaGassmaOrderSelect;
  _sum?: GassmaGassmaOrderSelect;
};

export type GassmaGassmaOrderItemAggregateData = {
  where?: GassmaGassmaOrderItemWhereUse;
  orderBy?: GassmaGassmaOrderItemOrderBy;
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaOrderItemUse>;
  _avg?: GassmaGassmaOrderItemSelect;
  _count?: GassmaGassmaOrderItemSelect;
  _max?: GassmaGassmaOrderItemSelect;
  _min?: GassmaGassmaOrderItemSelect;
  _sum?: GassmaGassmaOrderItemSelect;
};

export type GassmaGassmaNotificationAggregateData = {
  where?: GassmaGassmaNotificationWhereUse;
  orderBy?: GassmaGassmaNotificationOrderBy;
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaNotificationUse>;
  _avg?: GassmaGassmaNotificationSelect;
  _count?: GassmaGassmaNotificationSelect;
  _max?: GassmaGassmaNotificationSelect;
  _min?: GassmaGassmaNotificationSelect;
  _sum?: GassmaGassmaNotificationSelect;
};

export type GassmaGassmaUserAggregateData = {
  where?: GassmaGassmaUserWhereUse;
  orderBy?: GassmaGassmaUserOrderBy;
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaUserUse>;
  _avg?: GassmaGassmaUserSelect;
  _count?: GassmaGassmaUserSelect;
  _max?: GassmaGassmaUserSelect;
  _min?: GassmaGassmaUserSelect;
  _sum?: GassmaGassmaUserSelect;
};

export type GassmaGassmaProfileAggregateData = {
  where?: GassmaGassmaProfileWhereUse;
  orderBy?: GassmaGassmaProfileOrderBy;
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaProfileUse>;
  _avg?: GassmaGassmaProfileSelect;
  _count?: GassmaGassmaProfileSelect;
  _max?: GassmaGassmaProfileSelect;
  _min?: GassmaGassmaProfileSelect;
  _sum?: GassmaGassmaProfileSelect;
};

export type GassmaGassmaPostGroupByData = GassmaGassmaPostAggregateData & {
  by: "id" | "title" | "content" | "published" | "viewCount" | "rating" | "authorId" | "categoryId" | "createdAt" | "updatedAt" | ("id" | "title" | "content" | "published" | "viewCount" | "rating" | "authorId" | "categoryId" | "createdAt" | "updatedAt")[];
  having?: GassmaGassmaPostHavingUse;
};

export type GassmaGassmaCommentGroupByData = GassmaGassmaCommentAggregateData & {
  by: "id" | "text" | "authorId" | "postId" | "createdAt" | ("id" | "text" | "authorId" | "postId" | "createdAt")[];
  having?: GassmaGassmaCommentHavingUse;
};

export type GassmaGassmaCategoryGroupByData = GassmaGassmaCategoryAggregateData & {
  by: "id" | "name" | "parentId" | ("id" | "name" | "parentId")[];
  having?: GassmaGassmaCategoryHavingUse;
};

export type GassmaGassmaTagGroupByData = GassmaGassmaTagAggregateData & {
  by: "id" | "name" | ("id" | "name")[];
  having?: GassmaGassmaTagHavingUse;
};

export type GassmaGassmaProductGroupByData = GassmaGassmaProductAggregateData & {
  by: "id" | "name" | "price" | "stock" | "status" | "createdAt" | "updatedAt" | ("id" | "name" | "price" | "stock" | "status" | "createdAt" | "updatedAt")[];
  having?: GassmaGassmaProductHavingUse;
};

export type GassmaGassmaOrderGroupByData = GassmaGassmaOrderAggregateData & {
  by: "id" | "userId" | "totalAmount" | "quantity" | "status" | "createdAt" | ("id" | "userId" | "totalAmount" | "quantity" | "status" | "createdAt")[];
  having?: GassmaGassmaOrderHavingUse;
};

export type GassmaGassmaOrderItemGroupByData = GassmaGassmaOrderItemAggregateData & {
  by: "id" | "orderId" | "productId" | "quantity" | "unitPrice" | ("id" | "orderId" | "productId" | "quantity" | "unitPrice")[];
  having?: GassmaGassmaOrderItemHavingUse;
};

export type GassmaGassmaNotificationGroupByData = GassmaGassmaNotificationAggregateData & {
  by: "id" | "userId" | "message" | "isRead" | ("id" | "userId" | "message" | "isRead")[];
  having?: GassmaGassmaNotificationHavingUse;
};

export type GassmaGassmaUserGroupByData = GassmaGassmaUserAggregateData & {
  by: "id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt" | ("id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt")[];
  having?: GassmaGassmaUserHavingUse;
};

export type GassmaGassmaProfileGroupByData = GassmaGassmaProfileAggregateData & {
  by: "id" | "bio" | "website" | "userId" | ("id" | "bio" | "website" | "userId")[];
  having?: GassmaGassmaProfileHavingUse;
};

export type GassmaGassmaPostInclude = {
  "author"?: true | { select?: GassmaGassmaUserSelect; omit?: GassmaGassmaUserOmit; where?: GassmaGassmaUserWhereUse; orderBy?: GassmaGassmaUserOrderBy; take?: number; skip?: number; include?: GassmaGassmaUserInclude; _count?: GassmaGassmaUserCountValue };
  "category"?: true | { select?: GassmaGassmaCategorySelect; omit?: GassmaGassmaCategoryOmit; where?: GassmaGassmaCategoryWhereUse; orderBy?: GassmaGassmaCategoryOrderBy; take?: number; skip?: number; include?: GassmaGassmaCategoryInclude; _count?: GassmaGassmaCategoryCountValue };
  "comments"?: true | { select?: GassmaGassmaCommentSelect; omit?: GassmaGassmaCommentOmit; where?: GassmaGassmaCommentWhereUse; orderBy?: GassmaGassmaCommentOrderBy; take?: number; skip?: number; include?: GassmaGassmaCommentInclude; _count?: GassmaGassmaCommentCountValue };
  "tags"?: true | { select?: GassmaGassmaTagSelect; omit?: GassmaGassmaTagOmit; where?: GassmaGassmaTagWhereUse; orderBy?: GassmaGassmaTagOrderBy; take?: number; skip?: number; include?: GassmaGassmaTagInclude; _count?: GassmaGassmaTagCountValue };
  "_count"?: GassmaGassmaPostCountValue;
};

export type GassmaGassmaCommentInclude = {
  "author"?: true | { select?: GassmaGassmaUserSelect; omit?: GassmaGassmaUserOmit; where?: GassmaGassmaUserWhereUse; orderBy?: GassmaGassmaUserOrderBy; take?: number; skip?: number; include?: GassmaGassmaUserInclude; _count?: GassmaGassmaUserCountValue };
  "post"?: true | { select?: GassmaGassmaPostSelect; omit?: GassmaGassmaPostOmit; where?: GassmaGassmaPostWhereUse; orderBy?: GassmaGassmaPostOrderBy; take?: number; skip?: number; include?: GassmaGassmaPostInclude; _count?: GassmaGassmaPostCountValue };
  "_count"?: GassmaGassmaCommentCountValue;
};

export type GassmaGassmaCategoryInclude = {
  "posts"?: true | { select?: GassmaGassmaPostSelect; omit?: GassmaGassmaPostOmit; where?: GassmaGassmaPostWhereUse; orderBy?: GassmaGassmaPostOrderBy; take?: number; skip?: number; include?: GassmaGassmaPostInclude; _count?: GassmaGassmaPostCountValue };
  "parent"?: true | { select?: GassmaGassmaCategorySelect; omit?: GassmaGassmaCategoryOmit; where?: GassmaGassmaCategoryWhereUse; orderBy?: GassmaGassmaCategoryOrderBy; take?: number; skip?: number; include?: GassmaGassmaCategoryInclude; _count?: GassmaGassmaCategoryCountValue };
  "children"?: true | { select?: GassmaGassmaCategorySelect; omit?: GassmaGassmaCategoryOmit; where?: GassmaGassmaCategoryWhereUse; orderBy?: GassmaGassmaCategoryOrderBy; take?: number; skip?: number; include?: GassmaGassmaCategoryInclude; _count?: GassmaGassmaCategoryCountValue };
  "_count"?: GassmaGassmaCategoryCountValue;
};

export type GassmaGassmaTagInclude = {
  "posts"?: true | { select?: GassmaGassmaPostSelect; omit?: GassmaGassmaPostOmit; where?: GassmaGassmaPostWhereUse; orderBy?: GassmaGassmaPostOrderBy; take?: number; skip?: number; include?: GassmaGassmaPostInclude; _count?: GassmaGassmaPostCountValue };
  "_count"?: GassmaGassmaTagCountValue;
};

export type GassmaGassmaProductInclude = {
  "orderItems"?: true | { select?: GassmaGassmaOrderItemSelect; omit?: GassmaGassmaOrderItemOmit; where?: GassmaGassmaOrderItemWhereUse; orderBy?: GassmaGassmaOrderItemOrderBy; take?: number; skip?: number; include?: GassmaGassmaOrderItemInclude; _count?: GassmaGassmaOrderItemCountValue };
  "_count"?: GassmaGassmaProductCountValue;
};

export type GassmaGassmaOrderInclude = {
  "user"?: true | { select?: GassmaGassmaUserSelect; omit?: GassmaGassmaUserOmit; where?: GassmaGassmaUserWhereUse; orderBy?: GassmaGassmaUserOrderBy; take?: number; skip?: number; include?: GassmaGassmaUserInclude; _count?: GassmaGassmaUserCountValue };
  "items"?: true | { select?: GassmaGassmaOrderItemSelect; omit?: GassmaGassmaOrderItemOmit; where?: GassmaGassmaOrderItemWhereUse; orderBy?: GassmaGassmaOrderItemOrderBy; take?: number; skip?: number; include?: GassmaGassmaOrderItemInclude; _count?: GassmaGassmaOrderItemCountValue };
  "_count"?: GassmaGassmaOrderCountValue;
};

export type GassmaGassmaOrderItemInclude = {
  "order"?: true | { select?: GassmaGassmaOrderSelect; omit?: GassmaGassmaOrderOmit; where?: GassmaGassmaOrderWhereUse; orderBy?: GassmaGassmaOrderOrderBy; take?: number; skip?: number; include?: GassmaGassmaOrderInclude; _count?: GassmaGassmaOrderCountValue };
  "product"?: true | { select?: GassmaGassmaProductSelect; omit?: GassmaGassmaProductOmit; where?: GassmaGassmaProductWhereUse; orderBy?: GassmaGassmaProductOrderBy; take?: number; skip?: number; include?: GassmaGassmaProductInclude; _count?: GassmaGassmaProductCountValue };
  "_count"?: GassmaGassmaOrderItemCountValue;
};

export type GassmaGassmaNotificationInclude = {};

export type GassmaGassmaUserInclude = {
  "posts"?: true | { select?: GassmaGassmaPostSelect; omit?: GassmaGassmaPostOmit; where?: GassmaGassmaPostWhereUse; orderBy?: GassmaGassmaPostOrderBy; take?: number; skip?: number; include?: GassmaGassmaPostInclude; _count?: GassmaGassmaPostCountValue };
  "comments"?: true | { select?: GassmaGassmaCommentSelect; omit?: GassmaGassmaCommentOmit; where?: GassmaGassmaCommentWhereUse; orderBy?: GassmaGassmaCommentOrderBy; take?: number; skip?: number; include?: GassmaGassmaCommentInclude; _count?: GassmaGassmaCommentCountValue };
  "orders"?: true | { select?: GassmaGassmaOrderSelect; omit?: GassmaGassmaOrderOmit; where?: GassmaGassmaOrderWhereUse; orderBy?: GassmaGassmaOrderOrderBy; take?: number; skip?: number; include?: GassmaGassmaOrderInclude; _count?: GassmaGassmaOrderCountValue };
  "profile"?: true | { select?: GassmaGassmaProfileSelect; omit?: GassmaGassmaProfileOmit; where?: GassmaGassmaProfileWhereUse; orderBy?: GassmaGassmaProfileOrderBy; take?: number; skip?: number; include?: GassmaGassmaProfileInclude; _count?: GassmaGassmaProfileCountValue };
  "_count"?: GassmaGassmaUserCountValue;
};

export type GassmaGassmaProfileInclude = {
  "user"?: true | { select?: GassmaGassmaUserSelect; omit?: GassmaGassmaUserOmit; where?: GassmaGassmaUserWhereUse; orderBy?: GassmaGassmaUserOrderBy; take?: number; skip?: number; include?: GassmaGassmaUserInclude; _count?: GassmaGassmaUserCountValue };
  "_count"?: GassmaGassmaProfileCountValue;
};

export type GassmaGassmaPostCountValue = true | { select: {
    "author"?: true | { where?: GassmaGassmaUserWhereUse };
    "category"?: true | { where?: GassmaGassmaCategoryWhereUse };
    "comments"?: true | { where?: GassmaGassmaCommentWhereUse };
    "tags"?: true | { where?: GassmaGassmaTagWhereUse };
  } };

export type GassmaGassmaCommentCountValue = true | { select: {
    "author"?: true | { where?: GassmaGassmaUserWhereUse };
    "post"?: true | { where?: GassmaGassmaPostWhereUse };
  } };

export type GassmaGassmaCategoryCountValue = true | { select: {
    "posts"?: true | { where?: GassmaGassmaPostWhereUse };
    "parent"?: true | { where?: GassmaGassmaCategoryWhereUse };
    "children"?: true | { where?: GassmaGassmaCategoryWhereUse };
  } };

export type GassmaGassmaTagCountValue = true | { select: {
    "posts"?: true | { where?: GassmaGassmaPostWhereUse };
  } };

export type GassmaGassmaProductCountValue = true | { select: {
    "orderItems"?: true | { where?: GassmaGassmaOrderItemWhereUse };
  } };

export type GassmaGassmaOrderCountValue = true | { select: {
    "user"?: true | { where?: GassmaGassmaUserWhereUse };
    "items"?: true | { where?: GassmaGassmaOrderItemWhereUse };
  } };

export type GassmaGassmaOrderItemCountValue = true | { select: {
    "order"?: true | { where?: GassmaGassmaOrderWhereUse };
    "product"?: true | { where?: GassmaGassmaProductWhereUse };
  } };

export type GassmaGassmaNotificationCountValue = true;

export type GassmaGassmaUserCountValue = true | { select: {
    "posts"?: true | { where?: GassmaGassmaPostWhereUse };
    "comments"?: true | { where?: GassmaGassmaCommentWhereUse };
    "orders"?: true | { where?: GassmaGassmaOrderWhereUse };
    "profile"?: true | { where?: GassmaGassmaProfileWhereUse };
  } };

export type GassmaGassmaProfileCountValue = true | { select: {
    "user"?: true | { where?: GassmaGassmaUserWhereUse };
  } };

export type GassmaGassmaPostOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "title"?: "asc" | "desc" | Gassma.SortOrderInput;
  "content"?: "asc" | "desc" | Gassma.SortOrderInput;
  "published"?: "asc" | "desc" | Gassma.SortOrderInput;
  "viewCount"?: "asc" | "desc" | Gassma.SortOrderInput;
  "rating"?: "asc" | "desc" | Gassma.SortOrderInput;
  "authorId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "categoryId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "createdAt"?: "asc" | "desc" | Gassma.SortOrderInput;
  "updatedAt"?: "asc" | "desc" | Gassma.SortOrderInput;
  "author"?: GassmaGassmaUserOrderBy | { _count: "asc" | "desc" };
  "category"?: GassmaGassmaCategoryOrderBy | { _count: "asc" | "desc" };
  "comments"?: GassmaGassmaCommentOrderBy | { _count: "asc" | "desc" };
  "tags"?: GassmaGassmaTagOrderBy | { _count: "asc" | "desc" };
  "_count"?: { "author"?: "asc" | "desc"; "category"?: "asc" | "desc"; "comments"?: "asc" | "desc"; "tags"?: "asc" | "desc" };
};

export type GassmaGassmaCommentOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "text"?: "asc" | "desc" | Gassma.SortOrderInput;
  "authorId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "postId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "createdAt"?: "asc" | "desc" | Gassma.SortOrderInput;
  "author"?: GassmaGassmaUserOrderBy | { _count: "asc" | "desc" };
  "post"?: GassmaGassmaPostOrderBy | { _count: "asc" | "desc" };
  "_count"?: { "author"?: "asc" | "desc"; "post"?: "asc" | "desc" };
};

export type GassmaGassmaCategoryOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "name"?: "asc" | "desc" | Gassma.SortOrderInput;
  "parentId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "posts"?: GassmaGassmaPostOrderBy | { _count: "asc" | "desc" };
  "parent"?: GassmaGassmaCategoryOrderBy | { _count: "asc" | "desc" };
  "children"?: GassmaGassmaCategoryOrderBy | { _count: "asc" | "desc" };
  "_count"?: { "posts"?: "asc" | "desc"; "parent"?: "asc" | "desc"; "children"?: "asc" | "desc" };
};

export type GassmaGassmaTagOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "name"?: "asc" | "desc" | Gassma.SortOrderInput;
  "posts"?: GassmaGassmaPostOrderBy | { _count: "asc" | "desc" };
  "_count"?: { "posts"?: "asc" | "desc" };
};

export type GassmaGassmaProductOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "name"?: "asc" | "desc" | Gassma.SortOrderInput;
  "price"?: "asc" | "desc" | Gassma.SortOrderInput;
  "stock"?: "asc" | "desc" | Gassma.SortOrderInput;
  "status"?: "asc" | "desc" | Gassma.SortOrderInput;
  "createdAt"?: "asc" | "desc" | Gassma.SortOrderInput;
  "updatedAt"?: "asc" | "desc" | Gassma.SortOrderInput;
  "orderItems"?: GassmaGassmaOrderItemOrderBy | { _count: "asc" | "desc" };
  "_count"?: { "orderItems"?: "asc" | "desc" };
};

export type GassmaGassmaOrderOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "userId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "totalAmount"?: "asc" | "desc" | Gassma.SortOrderInput;
  "quantity"?: "asc" | "desc" | Gassma.SortOrderInput;
  "status"?: "asc" | "desc" | Gassma.SortOrderInput;
  "createdAt"?: "asc" | "desc" | Gassma.SortOrderInput;
  "user"?: GassmaGassmaUserOrderBy | { _count: "asc" | "desc" };
  "items"?: GassmaGassmaOrderItemOrderBy | { _count: "asc" | "desc" };
  "_count"?: { "user"?: "asc" | "desc"; "items"?: "asc" | "desc" };
};

export type GassmaGassmaOrderItemOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "orderId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "productId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "quantity"?: "asc" | "desc" | Gassma.SortOrderInput;
  "unitPrice"?: "asc" | "desc" | Gassma.SortOrderInput;
  "order"?: GassmaGassmaOrderOrderBy | { _count: "asc" | "desc" };
  "product"?: GassmaGassmaProductOrderBy | { _count: "asc" | "desc" };
  "_count"?: { "order"?: "asc" | "desc"; "product"?: "asc" | "desc" };
};

export type GassmaGassmaNotificationOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "userId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "message"?: "asc" | "desc" | Gassma.SortOrderInput;
  "isRead"?: "asc" | "desc" | Gassma.SortOrderInput;
};

export type GassmaGassmaUserOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "email"?: "asc" | "desc" | Gassma.SortOrderInput;
  "name"?: "asc" | "desc" | Gassma.SortOrderInput;
  "age"?: "asc" | "desc" | Gassma.SortOrderInput;
  "isActive"?: "asc" | "desc" | Gassma.SortOrderInput;
  "role"?: "asc" | "desc" | Gassma.SortOrderInput;
  "createdAt"?: "asc" | "desc" | Gassma.SortOrderInput;
  "posts"?: GassmaGassmaPostOrderBy | { _count: "asc" | "desc" };
  "comments"?: GassmaGassmaCommentOrderBy | { _count: "asc" | "desc" };
  "orders"?: GassmaGassmaOrderOrderBy | { _count: "asc" | "desc" };
  "profile"?: GassmaGassmaProfileOrderBy | { _count: "asc" | "desc" };
  "_count"?: { "posts"?: "asc" | "desc"; "comments"?: "asc" | "desc"; "orders"?: "asc" | "desc"; "profile"?: "asc" | "desc" };
};

export type GassmaGassmaProfileOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "bio"?: "asc" | "desc" | Gassma.SortOrderInput;
  "website"?: "asc" | "desc" | Gassma.SortOrderInput;
  "userId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "user"?: GassmaGassmaUserOrderBy | { _count: "asc" | "desc" };
  "_count"?: { "user"?: "asc" | "desc" };
};

export type GassmaGassmaPostSelect = {
  "id"?: true;
  "title"?: true;
  "content"?: true;
  "published"?: true;
  "viewCount"?: true;
  "rating"?: true;
  "authorId"?: true;
  "categoryId"?: true;
  "createdAt"?: true;
  "updatedAt"?: true;
};

export type GassmaGassmaPostFindSelect = {
  "id"?: true;
  "title"?: true;
  "content"?: true;
  "published"?: true;
  "viewCount"?: true;
  "rating"?: true;
  "authorId"?: true;
  "categoryId"?: true;
  "createdAt"?: true;
  "updatedAt"?: true;
  "author"?: true | { select?: GassmaGassmaUserSelect; omit?: GassmaGassmaUserOmit; where?: GassmaGassmaUserWhereUse; orderBy?: GassmaGassmaUserOrderBy; take?: number; skip?: number; include?: GassmaGassmaUserInclude; _count?: GassmaGassmaUserCountValue };
  "category"?: true | { select?: GassmaGassmaCategorySelect; omit?: GassmaGassmaCategoryOmit; where?: GassmaGassmaCategoryWhereUse; orderBy?: GassmaGassmaCategoryOrderBy; take?: number; skip?: number; include?: GassmaGassmaCategoryInclude; _count?: GassmaGassmaCategoryCountValue };
  "comments"?: true | { select?: GassmaGassmaCommentSelect; omit?: GassmaGassmaCommentOmit; where?: GassmaGassmaCommentWhereUse; orderBy?: GassmaGassmaCommentOrderBy; take?: number; skip?: number; include?: GassmaGassmaCommentInclude; _count?: GassmaGassmaCommentCountValue };
  "tags"?: true | { select?: GassmaGassmaTagSelect; omit?: GassmaGassmaTagOmit; where?: GassmaGassmaTagWhereUse; orderBy?: GassmaGassmaTagOrderBy; take?: number; skip?: number; include?: GassmaGassmaTagInclude; _count?: GassmaGassmaTagCountValue };
  "_count"?: GassmaGassmaPostCountValue;
};

export type GassmaGassmaCommentSelect = {
  "id"?: true;
  "text"?: true;
  "authorId"?: true;
  "postId"?: true;
  "createdAt"?: true;
};

export type GassmaGassmaCommentFindSelect = {
  "id"?: true;
  "text"?: true;
  "authorId"?: true;
  "postId"?: true;
  "createdAt"?: true;
  "author"?: true | { select?: GassmaGassmaUserSelect; omit?: GassmaGassmaUserOmit; where?: GassmaGassmaUserWhereUse; orderBy?: GassmaGassmaUserOrderBy; take?: number; skip?: number; include?: GassmaGassmaUserInclude; _count?: GassmaGassmaUserCountValue };
  "post"?: true | { select?: GassmaGassmaPostSelect; omit?: GassmaGassmaPostOmit; where?: GassmaGassmaPostWhereUse; orderBy?: GassmaGassmaPostOrderBy; take?: number; skip?: number; include?: GassmaGassmaPostInclude; _count?: GassmaGassmaPostCountValue };
  "_count"?: GassmaGassmaCommentCountValue;
};

export type GassmaGassmaCategorySelect = {
  "id"?: true;
  "name"?: true;
  "parentId"?: true;
};

export type GassmaGassmaCategoryFindSelect = {
  "id"?: true;
  "name"?: true;
  "parentId"?: true;
  "posts"?: true | { select?: GassmaGassmaPostSelect; omit?: GassmaGassmaPostOmit; where?: GassmaGassmaPostWhereUse; orderBy?: GassmaGassmaPostOrderBy; take?: number; skip?: number; include?: GassmaGassmaPostInclude; _count?: GassmaGassmaPostCountValue };
  "parent"?: true | { select?: GassmaGassmaCategorySelect; omit?: GassmaGassmaCategoryOmit; where?: GassmaGassmaCategoryWhereUse; orderBy?: GassmaGassmaCategoryOrderBy; take?: number; skip?: number; include?: GassmaGassmaCategoryInclude; _count?: GassmaGassmaCategoryCountValue };
  "children"?: true | { select?: GassmaGassmaCategorySelect; omit?: GassmaGassmaCategoryOmit; where?: GassmaGassmaCategoryWhereUse; orderBy?: GassmaGassmaCategoryOrderBy; take?: number; skip?: number; include?: GassmaGassmaCategoryInclude; _count?: GassmaGassmaCategoryCountValue };
  "_count"?: GassmaGassmaCategoryCountValue;
};

export type GassmaGassmaTagSelect = {
  "id"?: true;
  "name"?: true;
};

export type GassmaGassmaTagFindSelect = {
  "id"?: true;
  "name"?: true;
  "posts"?: true | { select?: GassmaGassmaPostSelect; omit?: GassmaGassmaPostOmit; where?: GassmaGassmaPostWhereUse; orderBy?: GassmaGassmaPostOrderBy; take?: number; skip?: number; include?: GassmaGassmaPostInclude; _count?: GassmaGassmaPostCountValue };
  "_count"?: GassmaGassmaTagCountValue;
};

export type GassmaGassmaProductSelect = {
  "id"?: true;
  "name"?: true;
  "price"?: true;
  "stock"?: true;
  "status"?: true;
  "createdAt"?: true;
  "updatedAt"?: true;
};

export type GassmaGassmaProductFindSelect = {
  "id"?: true;
  "name"?: true;
  "price"?: true;
  "stock"?: true;
  "status"?: true;
  "createdAt"?: true;
  "updatedAt"?: true;
  "orderItems"?: true | { select?: GassmaGassmaOrderItemSelect; omit?: GassmaGassmaOrderItemOmit; where?: GassmaGassmaOrderItemWhereUse; orderBy?: GassmaGassmaOrderItemOrderBy; take?: number; skip?: number; include?: GassmaGassmaOrderItemInclude; _count?: GassmaGassmaOrderItemCountValue };
  "_count"?: GassmaGassmaProductCountValue;
};

export type GassmaGassmaOrderSelect = {
  "id"?: true;
  "userId"?: true;
  "totalAmount"?: true;
  "quantity"?: true;
  "status"?: true;
  "createdAt"?: true;
};

export type GassmaGassmaOrderFindSelect = {
  "id"?: true;
  "userId"?: true;
  "totalAmount"?: true;
  "quantity"?: true;
  "status"?: true;
  "createdAt"?: true;
  "user"?: true | { select?: GassmaGassmaUserSelect; omit?: GassmaGassmaUserOmit; where?: GassmaGassmaUserWhereUse; orderBy?: GassmaGassmaUserOrderBy; take?: number; skip?: number; include?: GassmaGassmaUserInclude; _count?: GassmaGassmaUserCountValue };
  "items"?: true | { select?: GassmaGassmaOrderItemSelect; omit?: GassmaGassmaOrderItemOmit; where?: GassmaGassmaOrderItemWhereUse; orderBy?: GassmaGassmaOrderItemOrderBy; take?: number; skip?: number; include?: GassmaGassmaOrderItemInclude; _count?: GassmaGassmaOrderItemCountValue };
  "_count"?: GassmaGassmaOrderCountValue;
};

export type GassmaGassmaOrderItemSelect = {
  "id"?: true;
  "orderId"?: true;
  "productId"?: true;
  "quantity"?: true;
  "unitPrice"?: true;
};

export type GassmaGassmaOrderItemFindSelect = {
  "id"?: true;
  "orderId"?: true;
  "productId"?: true;
  "quantity"?: true;
  "unitPrice"?: true;
  "order"?: true | { select?: GassmaGassmaOrderSelect; omit?: GassmaGassmaOrderOmit; where?: GassmaGassmaOrderWhereUse; orderBy?: GassmaGassmaOrderOrderBy; take?: number; skip?: number; include?: GassmaGassmaOrderInclude; _count?: GassmaGassmaOrderCountValue };
  "product"?: true | { select?: GassmaGassmaProductSelect; omit?: GassmaGassmaProductOmit; where?: GassmaGassmaProductWhereUse; orderBy?: GassmaGassmaProductOrderBy; take?: number; skip?: number; include?: GassmaGassmaProductInclude; _count?: GassmaGassmaProductCountValue };
  "_count"?: GassmaGassmaOrderItemCountValue;
};

export type GassmaGassmaNotificationSelect = {
  "id"?: true;
  "userId"?: true;
  "message"?: true;
  "isRead"?: true;
};

export type GassmaGassmaNotificationFindSelect = {
  "id"?: true;
  "userId"?: true;
  "message"?: true;
  "isRead"?: true;
};

export type GassmaGassmaUserSelect = {
  "id"?: true;
  "email"?: true;
  "name"?: true;
  "age"?: true;
  "isActive"?: true;
  "role"?: true;
  "createdAt"?: true;
};

export type GassmaGassmaUserFindSelect = {
  "id"?: true;
  "email"?: true;
  "name"?: true;
  "age"?: true;
  "isActive"?: true;
  "role"?: true;
  "createdAt"?: true;
  "posts"?: true | { select?: GassmaGassmaPostSelect; omit?: GassmaGassmaPostOmit; where?: GassmaGassmaPostWhereUse; orderBy?: GassmaGassmaPostOrderBy; take?: number; skip?: number; include?: GassmaGassmaPostInclude; _count?: GassmaGassmaPostCountValue };
  "comments"?: true | { select?: GassmaGassmaCommentSelect; omit?: GassmaGassmaCommentOmit; where?: GassmaGassmaCommentWhereUse; orderBy?: GassmaGassmaCommentOrderBy; take?: number; skip?: number; include?: GassmaGassmaCommentInclude; _count?: GassmaGassmaCommentCountValue };
  "orders"?: true | { select?: GassmaGassmaOrderSelect; omit?: GassmaGassmaOrderOmit; where?: GassmaGassmaOrderWhereUse; orderBy?: GassmaGassmaOrderOrderBy; take?: number; skip?: number; include?: GassmaGassmaOrderInclude; _count?: GassmaGassmaOrderCountValue };
  "profile"?: true | { select?: GassmaGassmaProfileSelect; omit?: GassmaGassmaProfileOmit; where?: GassmaGassmaProfileWhereUse; orderBy?: GassmaGassmaProfileOrderBy; take?: number; skip?: number; include?: GassmaGassmaProfileInclude; _count?: GassmaGassmaProfileCountValue };
  "_count"?: GassmaGassmaUserCountValue;
};

export type GassmaGassmaProfileSelect = {
  "id"?: true;
  "bio"?: true;
  "website"?: true;
  "userId"?: true;
};

export type GassmaGassmaProfileFindSelect = {
  "id"?: true;
  "bio"?: true;
  "website"?: true;
  "userId"?: true;
  "user"?: true | { select?: GassmaGassmaUserSelect; omit?: GassmaGassmaUserOmit; where?: GassmaGassmaUserWhereUse; orderBy?: GassmaGassmaUserOrderBy; take?: number; skip?: number; include?: GassmaGassmaUserInclude; _count?: GassmaGassmaUserCountValue };
  "_count"?: GassmaGassmaProfileCountValue;
};

export type GassmaGassmaPostOmit = {
  "id"?: true | false;
  "title"?: true | false;
  "content"?: true | false;
  "published"?: true | false;
  "viewCount"?: true | false;
  "rating"?: true | false;
  "authorId"?: true | false;
  "categoryId"?: true | false;
  "createdAt"?: true | false;
  "updatedAt"?: true | false;
};

export type GassmaGassmaCommentOmit = {
  "id"?: true | false;
  "text"?: true | false;
  "authorId"?: true | false;
  "postId"?: true | false;
  "createdAt"?: true | false;
};

export type GassmaGassmaCategoryOmit = {
  "id"?: true | false;
  "name"?: true | false;
  "parentId"?: true | false;
};

export type GassmaGassmaTagOmit = {
  "id"?: true | false;
  "name"?: true | false;
};

export type GassmaGassmaProductOmit = {
  "id"?: true | false;
  "name"?: true | false;
  "price"?: true | false;
  "stock"?: true | false;
  "status"?: true | false;
  "createdAt"?: true | false;
  "updatedAt"?: true | false;
};

export type GassmaGassmaOrderOmit = {
  "id"?: true | false;
  "userId"?: true | false;
  "totalAmount"?: true | false;
  "quantity"?: true | false;
  "status"?: true | false;
  "createdAt"?: true | false;
};

export type GassmaGassmaOrderItemOmit = {
  "id"?: true | false;
  "orderId"?: true | false;
  "productId"?: true | false;
  "quantity"?: true | false;
  "unitPrice"?: true | false;
};

export type GassmaGassmaNotificationOmit = {
  "id"?: true | false;
  "userId"?: true | false;
  "message"?: true | false;
  "isRead"?: true | false;
};

export type GassmaGassmaUserOmit = {
  "id"?: true | false;
  "email"?: true | false;
  "name"?: true | false;
  "age"?: true | false;
  "isActive"?: true | false;
  "role"?: true | false;
  "createdAt"?: true | false;
};

export type GassmaGassmaProfileOmit = {
  "id"?: true | false;
  "bio"?: true | false;
  "website"?: true | false;
  "userId"?: true | false;
};

export type GassmaGassmaPostCountData = {
  where?: GassmaGassmaPostWhereUse;
  orderBy?: GassmaGassmaPostOrderBy;
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaPostUse>;
};

export type GassmaGassmaCommentCountData = {
  where?: GassmaGassmaCommentWhereUse;
  orderBy?: GassmaGassmaCommentOrderBy;
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaCommentUse>;
};

export type GassmaGassmaCategoryCountData = {
  where?: GassmaGassmaCategoryWhereUse;
  orderBy?: GassmaGassmaCategoryOrderBy;
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaCategoryUse>;
};

export type GassmaGassmaTagCountData = {
  where?: GassmaGassmaTagWhereUse;
  orderBy?: GassmaGassmaTagOrderBy;
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaTagUse>;
};

export type GassmaGassmaProductCountData = {
  where?: GassmaGassmaProductWhereUse;
  orderBy?: GassmaGassmaProductOrderBy;
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaProductUse>;
};

export type GassmaGassmaOrderCountData = {
  where?: GassmaGassmaOrderWhereUse;
  orderBy?: GassmaGassmaOrderOrderBy;
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaOrderUse>;
};

export type GassmaGassmaOrderItemCountData = {
  where?: GassmaGassmaOrderItemWhereUse;
  orderBy?: GassmaGassmaOrderItemOrderBy;
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaOrderItemUse>;
};

export type GassmaGassmaNotificationCountData = {
  where?: GassmaGassmaNotificationWhereUse;
  orderBy?: GassmaGassmaNotificationOrderBy;
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaNotificationUse>;
};

export type GassmaGassmaUserCountData = {
  where?: GassmaGassmaUserWhereUse;
  orderBy?: GassmaGassmaUserOrderBy;
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaUserUse>;
};

export type GassmaGassmaProfileCountData = {
  where?: GassmaGassmaProfileWhereUse;
  orderBy?: GassmaGassmaProfileOrderBy;
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaProfileUse>;
};

export type GassmaGassmaPostCreateReturn = {
 "id": number | null;
 "title": string;
 "content": string | number | null;
 "published": boolean | null;
 "viewCount": number | null;
 "rating": number | boolean | null;
 "authorId": number;
 "categoryId": number | null;
 "createdAt": Date | null;
 "updatedAt": Date | null;
};

export type GassmaGassmaCommentCreateReturn = {
 "id": number | null;
 "text": string;
 "authorId": number;
 "postId": number;
 "createdAt": Date | null;
};

export type GassmaGassmaCategoryCreateReturn = {
 "id": number | null;
 "name": string;
 "parentId": number | null;
};

export type GassmaGassmaTagCreateReturn = {
 "id": number | null;
 "name": string;
};

export type GassmaGassmaProductCreateReturn = {
 "id": number | null;
 "name": string;
 "price": number;
 "stock": number;
 "status": "available" | "soldout" | "discontinued";
 "createdAt": Date | null;
 "updatedAt": Date | null;
};

export type GassmaGassmaOrderCreateReturn = {
 "id": number | null;
 "userId": number;
 "totalAmount": number;
 "quantity": number;
 "status": "pending" | "shipped" | "delivered" | "cancelled";
 "createdAt": Date | null;
};

export type GassmaGassmaOrderItemCreateReturn = {
 "id": number | null;
 "orderId": number;
 "productId": number;
 "quantity": number;
 "unitPrice": number;
};

export type GassmaGassmaNotificationCreateReturn = {
 "id": number | null;
 "userId": number;
 "message": string;
 "isRead": boolean | null;
};

export type GassmaGassmaUserCreateReturn = {
 "id": number | null;
 "email": string;
 "name": string;
 "age": number | null;
 "isActive": boolean | null;
 "role": "ADMIN" | "USER" | "MODERATOR";
 "createdAt": Date | null;
};

export type GassmaGassmaProfileCreateReturn = {
 "id": number | null;
 "bio": string | null;
 "website": string | null;
 "userId": number;
};

export type GassmaGassmaPostDefaultFindResult = GassmaGassmaPostCreateReturn;

export type GassmaGassmaCommentDefaultFindResult = GassmaGassmaCommentCreateReturn;

export type GassmaGassmaCategoryDefaultFindResult = GassmaGassmaCategoryCreateReturn;

export type GassmaGassmaTagDefaultFindResult = GassmaGassmaTagCreateReturn;

export type GassmaGassmaProductDefaultFindResult = GassmaGassmaProductCreateReturn;

export type GassmaGassmaOrderDefaultFindResult = GassmaGassmaOrderCreateReturn;

export type GassmaGassmaOrderItemDefaultFindResult = GassmaGassmaOrderItemCreateReturn;

export type GassmaGassmaNotificationDefaultFindResult = GassmaGassmaNotificationCreateReturn;

export type GassmaGassmaUserDefaultFindResult = GassmaGassmaUserCreateReturn;

export type GassmaGassmaProfileDefaultFindResult = GassmaGassmaProfileCreateReturn;

export type GassmaGassmaPostFindResult<S, QO = undefined, GO = {}> = S extends GassmaGassmaPostSelect
  ? {
      [K in keyof S as S[K] extends true
        ? K & keyof GassmaGassmaPostDefaultFindResult
        : never]: GassmaGassmaPostDefaultFindResult[K & keyof GassmaGassmaPostDefaultFindResult];
    }
  : {
      [K in keyof GassmaGassmaPostDefaultFindResult as
        K extends Gassma.ResolveOmitKeys<GO, QO> ? never : K
      ]: GassmaGassmaPostDefaultFindResult[K];
    };

export type GassmaGassmaCommentFindResult<S, QO = undefined, GO = {}> = S extends GassmaGassmaCommentSelect
  ? {
      [K in keyof S as S[K] extends true
        ? K & keyof GassmaGassmaCommentDefaultFindResult
        : never]: GassmaGassmaCommentDefaultFindResult[K & keyof GassmaGassmaCommentDefaultFindResult];
    }
  : {
      [K in keyof GassmaGassmaCommentDefaultFindResult as
        K extends Gassma.ResolveOmitKeys<GO, QO> ? never : K
      ]: GassmaGassmaCommentDefaultFindResult[K];
    };

export type GassmaGassmaCategoryFindResult<S, QO = undefined, GO = {}> = S extends GassmaGassmaCategorySelect
  ? {
      [K in keyof S as S[K] extends true
        ? K & keyof GassmaGassmaCategoryDefaultFindResult
        : never]: GassmaGassmaCategoryDefaultFindResult[K & keyof GassmaGassmaCategoryDefaultFindResult];
    }
  : {
      [K in keyof GassmaGassmaCategoryDefaultFindResult as
        K extends Gassma.ResolveOmitKeys<GO, QO> ? never : K
      ]: GassmaGassmaCategoryDefaultFindResult[K];
    };

export type GassmaGassmaTagFindResult<S, QO = undefined, GO = {}> = S extends GassmaGassmaTagSelect
  ? {
      [K in keyof S as S[K] extends true
        ? K & keyof GassmaGassmaTagDefaultFindResult
        : never]: GassmaGassmaTagDefaultFindResult[K & keyof GassmaGassmaTagDefaultFindResult];
    }
  : {
      [K in keyof GassmaGassmaTagDefaultFindResult as
        K extends Gassma.ResolveOmitKeys<GO, QO> ? never : K
      ]: GassmaGassmaTagDefaultFindResult[K];
    };

export type GassmaGassmaProductFindResult<S, QO = undefined, GO = {}> = S extends GassmaGassmaProductSelect
  ? {
      [K in keyof S as S[K] extends true
        ? K & keyof GassmaGassmaProductDefaultFindResult
        : never]: GassmaGassmaProductDefaultFindResult[K & keyof GassmaGassmaProductDefaultFindResult];
    }
  : {
      [K in keyof GassmaGassmaProductDefaultFindResult as
        K extends Gassma.ResolveOmitKeys<GO, QO> ? never : K
      ]: GassmaGassmaProductDefaultFindResult[K];
    };

export type GassmaGassmaOrderFindResult<S, QO = undefined, GO = {}> = S extends GassmaGassmaOrderSelect
  ? {
      [K in keyof S as S[K] extends true
        ? K & keyof GassmaGassmaOrderDefaultFindResult
        : never]: GassmaGassmaOrderDefaultFindResult[K & keyof GassmaGassmaOrderDefaultFindResult];
    }
  : {
      [K in keyof GassmaGassmaOrderDefaultFindResult as
        K extends Gassma.ResolveOmitKeys<GO, QO> ? never : K
      ]: GassmaGassmaOrderDefaultFindResult[K];
    };

export type GassmaGassmaOrderItemFindResult<S, QO = undefined, GO = {}> = S extends GassmaGassmaOrderItemSelect
  ? {
      [K in keyof S as S[K] extends true
        ? K & keyof GassmaGassmaOrderItemDefaultFindResult
        : never]: GassmaGassmaOrderItemDefaultFindResult[K & keyof GassmaGassmaOrderItemDefaultFindResult];
    }
  : {
      [K in keyof GassmaGassmaOrderItemDefaultFindResult as
        K extends Gassma.ResolveOmitKeys<GO, QO> ? never : K
      ]: GassmaGassmaOrderItemDefaultFindResult[K];
    };

export type GassmaGassmaNotificationFindResult<S, QO = undefined, GO = {}> = S extends GassmaGassmaNotificationSelect
  ? {
      [K in keyof S as S[K] extends true
        ? K & keyof GassmaGassmaNotificationDefaultFindResult
        : never]: GassmaGassmaNotificationDefaultFindResult[K & keyof GassmaGassmaNotificationDefaultFindResult];
    }
  : {
      [K in keyof GassmaGassmaNotificationDefaultFindResult as
        K extends Gassma.ResolveOmitKeys<GO, QO> ? never : K
      ]: GassmaGassmaNotificationDefaultFindResult[K];
    };

export type GassmaGassmaUserFindResult<S, QO = undefined, GO = {}> = S extends GassmaGassmaUserSelect
  ? {
      [K in keyof S as S[K] extends true
        ? K & keyof GassmaGassmaUserDefaultFindResult
        : never]: GassmaGassmaUserDefaultFindResult[K & keyof GassmaGassmaUserDefaultFindResult];
    }
  : {
      [K in keyof GassmaGassmaUserDefaultFindResult as
        K extends Gassma.ResolveOmitKeys<GO, QO> ? never : K
      ]: GassmaGassmaUserDefaultFindResult[K];
    };

export type GassmaGassmaProfileFindResult<S, QO = undefined, GO = {}> = S extends GassmaGassmaProfileSelect
  ? {
      [K in keyof S as S[K] extends true
        ? K & keyof GassmaGassmaProfileDefaultFindResult
        : never]: GassmaGassmaProfileDefaultFindResult[K & keyof GassmaGassmaProfileDefaultFindResult];
    }
  : {
      [K in keyof GassmaGassmaProfileDefaultFindResult as
        K extends Gassma.ResolveOmitKeys<GO, QO> ? never : K
      ]: GassmaGassmaProfileDefaultFindResult[K];
    };

export type GassmaGassmaPostAggregateBaseReturn = {
  "id": number
  "title": string
  "content": string
  "published": boolean
  "viewCount": number
  "rating": number
  "authorId": number
  "categoryId": number
  "createdAt": Date
  "updatedAt": Date
};

export type GassmaGassmaCommentAggregateBaseReturn = {
  "id": number
  "text": string
  "authorId": number
  "postId": number
  "createdAt": Date
};

export type GassmaGassmaCategoryAggregateBaseReturn = {
  "id": number
  "name": string
  "parentId": number
};

export type GassmaGassmaTagAggregateBaseReturn = {
  "id": number
  "name": string
};

export type GassmaGassmaProductAggregateBaseReturn = {
  "id": number
  "name": string
  "price": number
  "stock": number
  "status": string
  "createdAt": Date
  "updatedAt": Date
};

export type GassmaGassmaOrderAggregateBaseReturn = {
  "id": number
  "userId": number
  "totalAmount": number
  "quantity": number
  "status": string
  "createdAt": Date
};

export type GassmaGassmaOrderItemAggregateBaseReturn = {
  "id": number
  "orderId": number
  "productId": number
  "quantity": number
  "unitPrice": number
};

export type GassmaGassmaNotificationAggregateBaseReturn = {
  "id": number
  "userId": number
  "message": string
  "isRead": boolean
};

export type GassmaGassmaUserAggregateBaseReturn = {
  "id": number
  "email": string
  "name": string
  "age": number
  "isActive": boolean
  "role": string
  "createdAt": Date
};

export type GassmaGassmaProfileAggregateBaseReturn = {
  "id": number
  "bio": string
  "website": string
  "userId": number
};

export type GassmaGassmaPostAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : {
        [P in keyof T as T[P] extends true
          ? P & keyof GassmaGassmaPostAggregateBaseReturn
          : never]: GassmaGassmaPostAggregateBaseReturn[P & keyof GassmaGassmaPostAggregateBaseReturn];
      };

export type GassmaGassmaCommentAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : {
        [P in keyof T as T[P] extends true
          ? P & keyof GassmaGassmaCommentAggregateBaseReturn
          : never]: GassmaGassmaCommentAggregateBaseReturn[P & keyof GassmaGassmaCommentAggregateBaseReturn];
      };

export type GassmaGassmaCategoryAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : {
        [P in keyof T as T[P] extends true
          ? P & keyof GassmaGassmaCategoryAggregateBaseReturn
          : never]: GassmaGassmaCategoryAggregateBaseReturn[P & keyof GassmaGassmaCategoryAggregateBaseReturn];
      };

export type GassmaGassmaTagAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : {
        [P in keyof T as T[P] extends true
          ? P & keyof GassmaGassmaTagAggregateBaseReturn
          : never]: GassmaGassmaTagAggregateBaseReturn[P & keyof GassmaGassmaTagAggregateBaseReturn];
      };

export type GassmaGassmaProductAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : {
        [P in keyof T as T[P] extends true
          ? P & keyof GassmaGassmaProductAggregateBaseReturn
          : never]: GassmaGassmaProductAggregateBaseReturn[P & keyof GassmaGassmaProductAggregateBaseReturn];
      };

export type GassmaGassmaOrderAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : {
        [P in keyof T as T[P] extends true
          ? P & keyof GassmaGassmaOrderAggregateBaseReturn
          : never]: GassmaGassmaOrderAggregateBaseReturn[P & keyof GassmaGassmaOrderAggregateBaseReturn];
      };

export type GassmaGassmaOrderItemAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : {
        [P in keyof T as T[P] extends true
          ? P & keyof GassmaGassmaOrderItemAggregateBaseReturn
          : never]: GassmaGassmaOrderItemAggregateBaseReturn[P & keyof GassmaGassmaOrderItemAggregateBaseReturn];
      };

export type GassmaGassmaNotificationAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : {
        [P in keyof T as T[P] extends true
          ? P & keyof GassmaGassmaNotificationAggregateBaseReturn
          : never]: GassmaGassmaNotificationAggregateBaseReturn[P & keyof GassmaGassmaNotificationAggregateBaseReturn];
      };

export type GassmaGassmaUserAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : {
        [P in keyof T as T[P] extends true
          ? P & keyof GassmaGassmaUserAggregateBaseReturn
          : never]: GassmaGassmaUserAggregateBaseReturn[P & keyof GassmaGassmaUserAggregateBaseReturn];
      };

export type GassmaGassmaProfileAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : {
        [P in keyof T as T[P] extends true
          ? P & keyof GassmaGassmaProfileAggregateBaseReturn
          : never]: GassmaGassmaProfileAggregateBaseReturn[P & keyof GassmaGassmaProfileAggregateBaseReturn];
      };

export type GassmaGassmaPostAggregateResult<T extends GassmaGassmaPostAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaPostAggregateField<T[K], K> : never;
};

export type GassmaGassmaCommentAggregateResult<T extends GassmaGassmaCommentAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaCommentAggregateField<T[K], K> : never;
};

export type GassmaGassmaCategoryAggregateResult<T extends GassmaGassmaCategoryAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaCategoryAggregateField<T[K], K> : never;
};

export type GassmaGassmaTagAggregateResult<T extends GassmaGassmaTagAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaTagAggregateField<T[K], K> : never;
};

export type GassmaGassmaProductAggregateResult<T extends GassmaGassmaProductAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaProductAggregateField<T[K], K> : never;
};

export type GassmaGassmaOrderAggregateResult<T extends GassmaGassmaOrderAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaOrderAggregateField<T[K], K> : never;
};

export type GassmaGassmaOrderItemAggregateResult<T extends GassmaGassmaOrderItemAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaOrderItemAggregateField<T[K], K> : never;
};

export type GassmaGassmaNotificationAggregateResult<T extends GassmaGassmaNotificationAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaNotificationAggregateField<T[K], K> : never;
};

export type GassmaGassmaUserAggregateResult<T extends GassmaGassmaUserAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaUserAggregateField<T[K], K> : never;
};

export type GassmaGassmaProfileAggregateResult<T extends GassmaGassmaProfileAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaProfileAggregateField<T[K], K> : never;
};

export type GassmaGassmaPostGroupByBaseReturn = GassmaGassmaPostCreateReturn;

export type GassmaGassmaCommentGroupByBaseReturn = GassmaGassmaCommentCreateReturn;

export type GassmaGassmaCategoryGroupByBaseReturn = GassmaGassmaCategoryCreateReturn;

export type GassmaGassmaTagGroupByBaseReturn = GassmaGassmaTagCreateReturn;

export type GassmaGassmaProductGroupByBaseReturn = GassmaGassmaProductCreateReturn;

export type GassmaGassmaOrderGroupByBaseReturn = GassmaGassmaOrderCreateReturn;

export type GassmaGassmaOrderItemGroupByBaseReturn = GassmaGassmaOrderItemCreateReturn;

export type GassmaGassmaNotificationGroupByBaseReturn = GassmaGassmaNotificationCreateReturn;

export type GassmaGassmaUserGroupByBaseReturn = GassmaGassmaUserCreateReturn;

export type GassmaGassmaProfileGroupByBaseReturn = GassmaGassmaProfileCreateReturn;

export type GassmaGassmaPostGroupByKeyOfBaseReturn = keyof GassmaGassmaPostGroupByBaseReturn;

export type GassmaGassmaCommentGroupByKeyOfBaseReturn = keyof GassmaGassmaCommentGroupByBaseReturn;

export type GassmaGassmaCategoryGroupByKeyOfBaseReturn = keyof GassmaGassmaCategoryGroupByBaseReturn;

export type GassmaGassmaTagGroupByKeyOfBaseReturn = keyof GassmaGassmaTagGroupByBaseReturn;

export type GassmaGassmaProductGroupByKeyOfBaseReturn = keyof GassmaGassmaProductGroupByBaseReturn;

export type GassmaGassmaOrderGroupByKeyOfBaseReturn = keyof GassmaGassmaOrderGroupByBaseReturn;

export type GassmaGassmaOrderItemGroupByKeyOfBaseReturn = keyof GassmaGassmaOrderItemGroupByBaseReturn;

export type GassmaGassmaNotificationGroupByKeyOfBaseReturn = keyof GassmaGassmaNotificationGroupByBaseReturn;

export type GassmaGassmaUserGroupByKeyOfBaseReturn = keyof GassmaGassmaUserGroupByBaseReturn;

export type GassmaGassmaProfileGroupByKeyOfBaseReturn = keyof GassmaGassmaProfileGroupByBaseReturn;

export type GassmaGassmaPostByField<T extends GassmaGassmaPostGroupByKeyOfBaseReturn | GassmaGassmaPostGroupByKeyOfBaseReturn[]> =
  T extends GassmaGassmaPostGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaGassmaPostGroupByBaseReturn[K & keyof GassmaGassmaPostGroupByBaseReturn];
      }
    : T extends keyof GassmaGassmaPostGroupByBaseReturn
      ? { [K in T]: GassmaGassmaPostGroupByBaseReturn[K] }
      : never;

export type GassmaGassmaCommentByField<T extends GassmaGassmaCommentGroupByKeyOfBaseReturn | GassmaGassmaCommentGroupByKeyOfBaseReturn[]> =
  T extends GassmaGassmaCommentGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaGassmaCommentGroupByBaseReturn[K & keyof GassmaGassmaCommentGroupByBaseReturn];
      }
    : T extends keyof GassmaGassmaCommentGroupByBaseReturn
      ? { [K in T]: GassmaGassmaCommentGroupByBaseReturn[K] }
      : never;

export type GassmaGassmaCategoryByField<T extends GassmaGassmaCategoryGroupByKeyOfBaseReturn | GassmaGassmaCategoryGroupByKeyOfBaseReturn[]> =
  T extends GassmaGassmaCategoryGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaGassmaCategoryGroupByBaseReturn[K & keyof GassmaGassmaCategoryGroupByBaseReturn];
      }
    : T extends keyof GassmaGassmaCategoryGroupByBaseReturn
      ? { [K in T]: GassmaGassmaCategoryGroupByBaseReturn[K] }
      : never;

export type GassmaGassmaTagByField<T extends GassmaGassmaTagGroupByKeyOfBaseReturn | GassmaGassmaTagGroupByKeyOfBaseReturn[]> =
  T extends GassmaGassmaTagGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaGassmaTagGroupByBaseReturn[K & keyof GassmaGassmaTagGroupByBaseReturn];
      }
    : T extends keyof GassmaGassmaTagGroupByBaseReturn
      ? { [K in T]: GassmaGassmaTagGroupByBaseReturn[K] }
      : never;

export type GassmaGassmaProductByField<T extends GassmaGassmaProductGroupByKeyOfBaseReturn | GassmaGassmaProductGroupByKeyOfBaseReturn[]> =
  T extends GassmaGassmaProductGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaGassmaProductGroupByBaseReturn[K & keyof GassmaGassmaProductGroupByBaseReturn];
      }
    : T extends keyof GassmaGassmaProductGroupByBaseReturn
      ? { [K in T]: GassmaGassmaProductGroupByBaseReturn[K] }
      : never;

export type GassmaGassmaOrderByField<T extends GassmaGassmaOrderGroupByKeyOfBaseReturn | GassmaGassmaOrderGroupByKeyOfBaseReturn[]> =
  T extends GassmaGassmaOrderGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaGassmaOrderGroupByBaseReturn[K & keyof GassmaGassmaOrderGroupByBaseReturn];
      }
    : T extends keyof GassmaGassmaOrderGroupByBaseReturn
      ? { [K in T]: GassmaGassmaOrderGroupByBaseReturn[K] }
      : never;

export type GassmaGassmaOrderItemByField<T extends GassmaGassmaOrderItemGroupByKeyOfBaseReturn | GassmaGassmaOrderItemGroupByKeyOfBaseReturn[]> =
  T extends GassmaGassmaOrderItemGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaGassmaOrderItemGroupByBaseReturn[K & keyof GassmaGassmaOrderItemGroupByBaseReturn];
      }
    : T extends keyof GassmaGassmaOrderItemGroupByBaseReturn
      ? { [K in T]: GassmaGassmaOrderItemGroupByBaseReturn[K] }
      : never;

export type GassmaGassmaNotificationByField<T extends GassmaGassmaNotificationGroupByKeyOfBaseReturn | GassmaGassmaNotificationGroupByKeyOfBaseReturn[]> =
  T extends GassmaGassmaNotificationGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaGassmaNotificationGroupByBaseReturn[K & keyof GassmaGassmaNotificationGroupByBaseReturn];
      }
    : T extends keyof GassmaGassmaNotificationGroupByBaseReturn
      ? { [K in T]: GassmaGassmaNotificationGroupByBaseReturn[K] }
      : never;

export type GassmaGassmaUserByField<T extends GassmaGassmaUserGroupByKeyOfBaseReturn | GassmaGassmaUserGroupByKeyOfBaseReturn[]> =
  T extends GassmaGassmaUserGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaGassmaUserGroupByBaseReturn[K & keyof GassmaGassmaUserGroupByBaseReturn];
      }
    : T extends keyof GassmaGassmaUserGroupByBaseReturn
      ? { [K in T]: GassmaGassmaUserGroupByBaseReturn[K] }
      : never;

export type GassmaGassmaProfileByField<T extends GassmaGassmaProfileGroupByKeyOfBaseReturn | GassmaGassmaProfileGroupByKeyOfBaseReturn[]> =
  T extends GassmaGassmaProfileGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaGassmaProfileGroupByBaseReturn[K & keyof GassmaGassmaProfileGroupByBaseReturn];
      }
    : T extends keyof GassmaGassmaProfileGroupByBaseReturn
      ? { [K in T]: GassmaGassmaProfileGroupByBaseReturn[K] }
      : never;

export type GassmaGassmaPostGroupByResult<T extends GassmaGassmaPostGroupByData> = GassmaGassmaPostByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaPostAggregateField<T[K], K> : never;
};

export type GassmaGassmaCommentGroupByResult<T extends GassmaGassmaCommentGroupByData> = GassmaGassmaCommentByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaCommentAggregateField<T[K], K> : never;
};

export type GassmaGassmaCategoryGroupByResult<T extends GassmaGassmaCategoryGroupByData> = GassmaGassmaCategoryByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaCategoryAggregateField<T[K], K> : never;
};

export type GassmaGassmaTagGroupByResult<T extends GassmaGassmaTagGroupByData> = GassmaGassmaTagByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaTagAggregateField<T[K], K> : never;
};

export type GassmaGassmaProductGroupByResult<T extends GassmaGassmaProductGroupByData> = GassmaGassmaProductByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaProductAggregateField<T[K], K> : never;
};

export type GassmaGassmaOrderGroupByResult<T extends GassmaGassmaOrderGroupByData> = GassmaGassmaOrderByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaOrderAggregateField<T[K], K> : never;
};

export type GassmaGassmaOrderItemGroupByResult<T extends GassmaGassmaOrderItemGroupByData> = GassmaGassmaOrderItemByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaOrderItemAggregateField<T[K], K> : never;
};

export type GassmaGassmaNotificationGroupByResult<T extends GassmaGassmaNotificationGroupByData> = GassmaGassmaNotificationByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaNotificationAggregateField<T[K], K> : never;
};

export type GassmaGassmaUserGroupByResult<T extends GassmaGassmaUserGroupByData> = GassmaGassmaUserByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaUserAggregateField<T[K], K> : never;
};

export type GassmaGassmaProfileGroupByResult<T extends GassmaGassmaProfileGroupByData> = GassmaGassmaProfileByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaProfileAggregateField<T[K], K> : never;
};

export interface GassmaClient<O extends GassmaGassmaGlobalOmitConfig = {}> extends GassmaGassmaSheet<O> {}
export declare class GassmaClient<O extends GassmaGassmaGlobalOmitConfig = {}> {
  constructor(options?: GassmaGassmaClientOptions<O>);
}

export declare const Role: {
  readonly admin: "ADMIN";
  readonly user: "USER";
  readonly moderator: "MODERATOR";
};
export type Role = (typeof Role)[keyof typeof Role];
