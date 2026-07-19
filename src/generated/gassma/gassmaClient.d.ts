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

  type FilterConditions<T> = {
    equals?: T | FieldRef;
    not?: T;
    in?: T[];
    notIn?: T[];
    lt?: T | FieldRef;
    lte?: T | FieldRef;
    gt?: T | FieldRef;
    gte?: T | FieldRef;
    contains?: string | FieldRef;
    startsWith?: string | FieldRef;
    endsWith?: string | FieldRef;
    mode?: "default" | "insensitive";
  };

  type TrueKeys<T> = { [K in keyof T]: T[K] extends true ? K : never }[keyof T];
  type FalseKeys<T> = { [K in keyof T]: T[K] extends false ? K : never }[keyof T];
  type ResolveOmitKeys<GO, QO> = Exclude<TrueKeys<GO>, FalseKeys<QO>> | TrueKeys<QO>;

  type At<X, K> = K extends keyof X ? X[K] : {};
  type MergeShape<A, B> = Omit<A, keyof B> & B;
  type ComputedReturns<Fields> = {
    [F in keyof Fields]: Fields[F] extends { compute: (...args: never[]) => infer V } ? V : never;
  };
  type ComputedOf<R, M> = MergeShape<ComputedReturns<At<R, "$allModels">>, ComputedReturns<At<R, M>>>;
  type ResultField<Scalars, S> = {
    needs?: { [K in keyof S]: K extends keyof Scalars ? S[K] : never } & { [K in keyof Scalars]?: boolean };
    compute(record: { [K in keyof S as S[K] extends true ? K & keyof Scalars : never]: Scalars[K & keyof Scalars] }): unknown;
  };
  type ComputedArgs<C> = [keyof C] extends [never] ? {} : {
    select?: { [K in keyof C]?: true };
    omit?: { [K in keyof C]?: true | false };
  };
  type SelectedComputed<C, S> = {
    [K in keyof C as K extends keyof S ? (S[K] extends true ? K : never) : never]: C[K];
  };
  type ActiveComputed<C, QO> = { [K in keyof C as K extends TrueKeys<QO> ? never : K]: C[K] };
  type StripComputed<S, C> = [keyof C] extends [never]
    ? S
    : S extends object ? { [K in Exclude<keyof S, keyof C>]: S[K] } : S;
  type WithComputed<Base, C, S, QO> = [keyof C] extends [never]
    ? Base
    : S extends object
      ? Omit<Base, keyof SelectedComputed<C, S>> & SelectedComputed<C, S>
      : Omit<Base, keyof ActiveComputed<C, QO>> & ActiveComputed<C, QO>;

  type ExactKeys<T, Shape> = Shape & { [K in Exclude<keyof T, keyof Shape>]?: never };
  type StrictGlobalOmit<O, Config> = Config & {
    [K in keyof O]?: K extends keyof Config
      ? ExactKeys<NonNullable<O[K]>, NonNullable<Config[K]>>
      : never;
  };

  type SelectOf<X> = X extends { select: infer S } ? S : undefined;
  type IncludeOf<X> = X extends { include: infer I } ? I : undefined;
  type OmitOf<X> = X extends { omit: infer O } ? O : undefined;
  type CountResult<X> = X extends { select: infer S }
    ? { [P in keyof S]: number }
    : { [key: string]: number };

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
  class NestedWriteTargetNotFoundError extends Error {
    constructor(sheetName: string, operation: string);
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
  "FormulaCell"?: GassmaGassmaFormulaCellOmit;
  "Notification"?: GassmaGassmaNotificationOmit;
  "OffsetNote"?: GassmaGassmaOffsetNoteOmit;
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
  "FormulaCell"?: "id" | "label" | "amount" | "total" | ("id" | "label" | "amount" | "total")[];
  "Notification"?: "id" | "userId" | "message" | "isRead" | ("id" | "userId" | "message" | "isRead")[];
  "OffsetNote"?: "id" | "title" | "value" | ("id" | "title" | "value")[];
  "User"?: "id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt" | ("id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt")[];
  "Profile"?: "id" | "bio" | "website" | "userId" | ("id" | "bio" | "website" | "userId")[];
};

export type GassmaGassmaIgnoreSheetsConfig = "Post" | "Comment" | "Category" | "Tag" | "Product" | "Order" | "OrderItem" | "FormulaCell" | "Notification" | "OffsetNote" | "User" | "Profile" | ("Post" | "Comment" | "Category" | "Tag" | "Product" | "Order" | "OrderItem" | "FormulaCell" | "Notification" | "OffsetNote" | "User" | "Profile")[];

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
  "FormulaCell"?: {
      "id"?: string;
      "label"?: string;
      "amount"?: string;
      "total"?: string;
  };
  "Notification"?: {
      "id"?: string;
      "userId"?: string;
      "message"?: string;
      "isRead"?: string;
  };
  "OffsetNote"?: {
      "id"?: string;
      "title"?: string;
      "value"?: string;
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
  "FormulaCell"?: string;
  "Notification"?: string;
  "OffsetNote"?: string;
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

export type GassmaGassmaClientOptions<O extends Gassma.StrictGlobalOmit<O, GassmaGassmaGlobalOmitConfig> = {}> = {
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
  "Post": GassmaGassmaPostController<O extends { "Post": infer UO } ? UO extends GassmaGassmaPostOmit ? UO : {} : {}, O>;
  "Comment": GassmaGassmaCommentController<O extends { "Comment": infer UO } ? UO extends GassmaGassmaCommentOmit ? UO : {} : {}, O>;
  "Category": GassmaGassmaCategoryController<O extends { "Category": infer UO } ? UO extends GassmaGassmaCategoryOmit ? UO : {} : {}, O>;
  "Tag": GassmaGassmaTagController<O extends { "Tag": infer UO } ? UO extends GassmaGassmaTagOmit ? UO : {} : {}, O>;
  "Product": GassmaGassmaProductController<O extends { "Product": infer UO } ? UO extends GassmaGassmaProductOmit ? UO : {} : {}, O>;
  "Order": GassmaGassmaOrderController<O extends { "Order": infer UO } ? UO extends GassmaGassmaOrderOmit ? UO : {} : {}, O>;
  "OrderItem": GassmaGassmaOrderItemController<O extends { "OrderItem": infer UO } ? UO extends GassmaGassmaOrderItemOmit ? UO : {} : {}, O>;
  "FormulaCell": GassmaGassmaFormulaCellController<O extends { "FormulaCell": infer UO } ? UO extends GassmaGassmaFormulaCellOmit ? UO : {} : {}, O>;
  "Notification": GassmaGassmaNotificationController<O extends { "Notification": infer UO } ? UO extends GassmaGassmaNotificationOmit ? UO : {} : {}, O>;
  "OffsetNote": GassmaGassmaOffsetNoteController<O extends { "OffsetNote": infer UO } ? UO extends GassmaGassmaOffsetNoteOmit ? UO : {} : {}, O>;
  "User": GassmaGassmaUserController<O extends { "User": infer UO } ? UO extends GassmaGassmaUserOmit ? UO : {} : {}, O>;
  "Profile": GassmaGassmaProfileController<O extends { "Profile": infer UO } ? UO extends GassmaGassmaProfileOmit ? UO : {} : {}, O>;
};

export declare class GassmaGassmaPostController<GO extends GassmaGassmaPostOmit = {}, O = {}, C = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  createMany(createdData: GassmaGassmaPostCreateManyData): CreateManyReturn;
  createManyAndReturn<T extends GassmaGassmaPostCreateManyAndReturnData & Gassma.ComputedArgs<C>>(createdData: T): Gassma.WithComputed<GassmaGassmaPostFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>[];
  create<T extends GassmaGassmaPostCreateData & Gassma.ComputedArgs<C>>(createdData: T): Gassma.WithComputed<GassmaGassmaPostFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  findFirst<T extends GassmaGassmaPostFindFirstData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaPostFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  findFirstOrThrow<T extends GassmaGassmaPostFindFirstData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaPostFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  findMany<T extends GassmaGassmaPostFindManyData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaPostFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>[];
  update<T extends GassmaGassmaPostUpdateSingleData & Gassma.ComputedArgs<C>>(updateData: T): Gassma.WithComputed<GassmaGassmaPostFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  updateMany(updateData: GassmaGassmaPostUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaGassmaPostUpdateData): Gassma.WithComputed<GassmaGassmaPostFindResult<undefined, undefined, undefined, GO, O>, C, undefined, undefined>[];
  upsert<T extends GassmaGassmaPostUpsertSingleData & Gassma.ComputedArgs<C>>(upsertData: T): Gassma.WithComputed<GassmaGassmaPostFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  delete<T extends GassmaGassmaPostDeleteSingleData & Gassma.ComputedArgs<C>>(deleteData: T): Gassma.WithComputed<GassmaGassmaPostFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  deleteMany(deleteData: GassmaGassmaPostDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaGassmaPostAggregateData>(aggregateData: T): GassmaGassmaPostAggregateResult<T>;
  count(coutData: GassmaGassmaPostCountData): number;
  groupBy<T extends GassmaGassmaPostGroupByData>(groupByData: T): GassmaGassmaPostGroupByResult<T>[];
}

export declare class GassmaGassmaCommentController<GO extends GassmaGassmaCommentOmit = {}, O = {}, C = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  createMany(createdData: GassmaGassmaCommentCreateManyData): CreateManyReturn;
  createManyAndReturn<T extends GassmaGassmaCommentCreateManyAndReturnData & Gassma.ComputedArgs<C>>(createdData: T): Gassma.WithComputed<GassmaGassmaCommentFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>[];
  create<T extends GassmaGassmaCommentCreateData & Gassma.ComputedArgs<C>>(createdData: T): Gassma.WithComputed<GassmaGassmaCommentFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  findFirst<T extends GassmaGassmaCommentFindFirstData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaCommentFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  findFirstOrThrow<T extends GassmaGassmaCommentFindFirstData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaCommentFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  findMany<T extends GassmaGassmaCommentFindManyData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaCommentFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>[];
  update<T extends GassmaGassmaCommentUpdateSingleData & Gassma.ComputedArgs<C>>(updateData: T): Gassma.WithComputed<GassmaGassmaCommentFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  updateMany(updateData: GassmaGassmaCommentUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaGassmaCommentUpdateData): Gassma.WithComputed<GassmaGassmaCommentFindResult<undefined, undefined, undefined, GO, O>, C, undefined, undefined>[];
  upsert<T extends GassmaGassmaCommentUpsertSingleData & Gassma.ComputedArgs<C>>(upsertData: T): Gassma.WithComputed<GassmaGassmaCommentFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  delete<T extends GassmaGassmaCommentDeleteSingleData & Gassma.ComputedArgs<C>>(deleteData: T): Gassma.WithComputed<GassmaGassmaCommentFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  deleteMany(deleteData: GassmaGassmaCommentDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaGassmaCommentAggregateData>(aggregateData: T): GassmaGassmaCommentAggregateResult<T>;
  count(coutData: GassmaGassmaCommentCountData): number;
  groupBy<T extends GassmaGassmaCommentGroupByData>(groupByData: T): GassmaGassmaCommentGroupByResult<T>[];
}

export declare class GassmaGassmaCategoryController<GO extends GassmaGassmaCategoryOmit = {}, O = {}, C = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  createMany(createdData: GassmaGassmaCategoryCreateManyData): CreateManyReturn;
  createManyAndReturn<T extends GassmaGassmaCategoryCreateManyAndReturnData & Gassma.ComputedArgs<C>>(createdData: T): Gassma.WithComputed<GassmaGassmaCategoryFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>[];
  create<T extends GassmaGassmaCategoryCreateData & Gassma.ComputedArgs<C>>(createdData: T): Gassma.WithComputed<GassmaGassmaCategoryFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  findFirst<T extends GassmaGassmaCategoryFindFirstData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaCategoryFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  findFirstOrThrow<T extends GassmaGassmaCategoryFindFirstData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaCategoryFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  findMany<T extends GassmaGassmaCategoryFindManyData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaCategoryFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>[];
  update<T extends GassmaGassmaCategoryUpdateSingleData & Gassma.ComputedArgs<C>>(updateData: T): Gassma.WithComputed<GassmaGassmaCategoryFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  updateMany(updateData: GassmaGassmaCategoryUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaGassmaCategoryUpdateData): Gassma.WithComputed<GassmaGassmaCategoryFindResult<undefined, undefined, undefined, GO, O>, C, undefined, undefined>[];
  upsert<T extends GassmaGassmaCategoryUpsertSingleData & Gassma.ComputedArgs<C>>(upsertData: T): Gassma.WithComputed<GassmaGassmaCategoryFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  delete<T extends GassmaGassmaCategoryDeleteSingleData & Gassma.ComputedArgs<C>>(deleteData: T): Gassma.WithComputed<GassmaGassmaCategoryFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  deleteMany(deleteData: GassmaGassmaCategoryDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaGassmaCategoryAggregateData>(aggregateData: T): GassmaGassmaCategoryAggregateResult<T>;
  count(coutData: GassmaGassmaCategoryCountData): number;
  groupBy<T extends GassmaGassmaCategoryGroupByData>(groupByData: T): GassmaGassmaCategoryGroupByResult<T>[];
}

export declare class GassmaGassmaTagController<GO extends GassmaGassmaTagOmit = {}, O = {}, C = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  createMany(createdData: GassmaGassmaTagCreateManyData): CreateManyReturn;
  createManyAndReturn<T extends GassmaGassmaTagCreateManyAndReturnData & Gassma.ComputedArgs<C>>(createdData: T): Gassma.WithComputed<GassmaGassmaTagFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>[];
  create<T extends GassmaGassmaTagCreateData & Gassma.ComputedArgs<C>>(createdData: T): Gassma.WithComputed<GassmaGassmaTagFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  findFirst<T extends GassmaGassmaTagFindFirstData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaTagFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  findFirstOrThrow<T extends GassmaGassmaTagFindFirstData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaTagFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  findMany<T extends GassmaGassmaTagFindManyData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaTagFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>[];
  update<T extends GassmaGassmaTagUpdateSingleData & Gassma.ComputedArgs<C>>(updateData: T): Gassma.WithComputed<GassmaGassmaTagFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  updateMany(updateData: GassmaGassmaTagUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaGassmaTagUpdateData): Gassma.WithComputed<GassmaGassmaTagFindResult<undefined, undefined, undefined, GO, O>, C, undefined, undefined>[];
  upsert<T extends GassmaGassmaTagUpsertSingleData & Gassma.ComputedArgs<C>>(upsertData: T): Gassma.WithComputed<GassmaGassmaTagFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  delete<T extends GassmaGassmaTagDeleteSingleData & Gassma.ComputedArgs<C>>(deleteData: T): Gassma.WithComputed<GassmaGassmaTagFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  deleteMany(deleteData: GassmaGassmaTagDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaGassmaTagAggregateData>(aggregateData: T): GassmaGassmaTagAggregateResult<T>;
  count(coutData: GassmaGassmaTagCountData): number;
  groupBy<T extends GassmaGassmaTagGroupByData>(groupByData: T): GassmaGassmaTagGroupByResult<T>[];
}

export declare class GassmaGassmaProductController<GO extends GassmaGassmaProductOmit = {}, O = {}, C = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  createMany(createdData: GassmaGassmaProductCreateManyData): CreateManyReturn;
  createManyAndReturn<T extends GassmaGassmaProductCreateManyAndReturnData & Gassma.ComputedArgs<C>>(createdData: T): Gassma.WithComputed<GassmaGassmaProductFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>[];
  create<T extends GassmaGassmaProductCreateData & Gassma.ComputedArgs<C>>(createdData: T): Gassma.WithComputed<GassmaGassmaProductFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  findFirst<T extends GassmaGassmaProductFindFirstData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaProductFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  findFirstOrThrow<T extends GassmaGassmaProductFindFirstData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaProductFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  findMany<T extends GassmaGassmaProductFindManyData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaProductFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>[];
  update<T extends GassmaGassmaProductUpdateSingleData & Gassma.ComputedArgs<C>>(updateData: T): Gassma.WithComputed<GassmaGassmaProductFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  updateMany(updateData: GassmaGassmaProductUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaGassmaProductUpdateData): Gassma.WithComputed<GassmaGassmaProductFindResult<undefined, undefined, undefined, GO, O>, C, undefined, undefined>[];
  upsert<T extends GassmaGassmaProductUpsertSingleData & Gassma.ComputedArgs<C>>(upsertData: T): Gassma.WithComputed<GassmaGassmaProductFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  delete<T extends GassmaGassmaProductDeleteSingleData & Gassma.ComputedArgs<C>>(deleteData: T): Gassma.WithComputed<GassmaGassmaProductFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  deleteMany(deleteData: GassmaGassmaProductDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaGassmaProductAggregateData>(aggregateData: T): GassmaGassmaProductAggregateResult<T>;
  count(coutData: GassmaGassmaProductCountData): number;
  groupBy<T extends GassmaGassmaProductGroupByData>(groupByData: T): GassmaGassmaProductGroupByResult<T>[];
}

export declare class GassmaGassmaOrderController<GO extends GassmaGassmaOrderOmit = {}, O = {}, C = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  createMany(createdData: GassmaGassmaOrderCreateManyData): CreateManyReturn;
  createManyAndReturn<T extends GassmaGassmaOrderCreateManyAndReturnData & Gassma.ComputedArgs<C>>(createdData: T): Gassma.WithComputed<GassmaGassmaOrderFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>[];
  create<T extends GassmaGassmaOrderCreateData & Gassma.ComputedArgs<C>>(createdData: T): Gassma.WithComputed<GassmaGassmaOrderFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  findFirst<T extends GassmaGassmaOrderFindFirstData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaOrderFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  findFirstOrThrow<T extends GassmaGassmaOrderFindFirstData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaOrderFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  findMany<T extends GassmaGassmaOrderFindManyData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaOrderFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>[];
  update<T extends GassmaGassmaOrderUpdateSingleData & Gassma.ComputedArgs<C>>(updateData: T): Gassma.WithComputed<GassmaGassmaOrderFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  updateMany(updateData: GassmaGassmaOrderUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaGassmaOrderUpdateData): Gassma.WithComputed<GassmaGassmaOrderFindResult<undefined, undefined, undefined, GO, O>, C, undefined, undefined>[];
  upsert<T extends GassmaGassmaOrderUpsertSingleData & Gassma.ComputedArgs<C>>(upsertData: T): Gassma.WithComputed<GassmaGassmaOrderFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  delete<T extends GassmaGassmaOrderDeleteSingleData & Gassma.ComputedArgs<C>>(deleteData: T): Gassma.WithComputed<GassmaGassmaOrderFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  deleteMany(deleteData: GassmaGassmaOrderDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaGassmaOrderAggregateData>(aggregateData: T): GassmaGassmaOrderAggregateResult<T>;
  count(coutData: GassmaGassmaOrderCountData): number;
  groupBy<T extends GassmaGassmaOrderGroupByData>(groupByData: T): GassmaGassmaOrderGroupByResult<T>[];
}

export declare class GassmaGassmaOrderItemController<GO extends GassmaGassmaOrderItemOmit = {}, O = {}, C = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  createMany(createdData: GassmaGassmaOrderItemCreateManyData): CreateManyReturn;
  createManyAndReturn<T extends GassmaGassmaOrderItemCreateManyAndReturnData & Gassma.ComputedArgs<C>>(createdData: T): Gassma.WithComputed<GassmaGassmaOrderItemFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>[];
  create<T extends GassmaGassmaOrderItemCreateData & Gassma.ComputedArgs<C>>(createdData: T): Gassma.WithComputed<GassmaGassmaOrderItemFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  findFirst<T extends GassmaGassmaOrderItemFindFirstData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaOrderItemFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  findFirstOrThrow<T extends GassmaGassmaOrderItemFindFirstData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaOrderItemFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  findMany<T extends GassmaGassmaOrderItemFindManyData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaOrderItemFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>[];
  update<T extends GassmaGassmaOrderItemUpdateSingleData & Gassma.ComputedArgs<C>>(updateData: T): Gassma.WithComputed<GassmaGassmaOrderItemFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  updateMany(updateData: GassmaGassmaOrderItemUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaGassmaOrderItemUpdateData): Gassma.WithComputed<GassmaGassmaOrderItemFindResult<undefined, undefined, undefined, GO, O>, C, undefined, undefined>[];
  upsert<T extends GassmaGassmaOrderItemUpsertSingleData & Gassma.ComputedArgs<C>>(upsertData: T): Gassma.WithComputed<GassmaGassmaOrderItemFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  delete<T extends GassmaGassmaOrderItemDeleteSingleData & Gassma.ComputedArgs<C>>(deleteData: T): Gassma.WithComputed<GassmaGassmaOrderItemFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  deleteMany(deleteData: GassmaGassmaOrderItemDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaGassmaOrderItemAggregateData>(aggregateData: T): GassmaGassmaOrderItemAggregateResult<T>;
  count(coutData: GassmaGassmaOrderItemCountData): number;
  groupBy<T extends GassmaGassmaOrderItemGroupByData>(groupByData: T): GassmaGassmaOrderItemGroupByResult<T>[];
}

export declare class GassmaGassmaFormulaCellController<GO extends GassmaGassmaFormulaCellOmit = {}, O = {}, C = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  createMany(createdData: GassmaGassmaFormulaCellCreateManyData): CreateManyReturn;
  createManyAndReturn<T extends GassmaGassmaFormulaCellCreateManyAndReturnData & Gassma.ComputedArgs<C>>(createdData: T): Gassma.WithComputed<GassmaGassmaFormulaCellFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>[];
  create<T extends GassmaGassmaFormulaCellCreateData & Gassma.ComputedArgs<C>>(createdData: T): Gassma.WithComputed<GassmaGassmaFormulaCellFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  findFirst<T extends GassmaGassmaFormulaCellFindFirstData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaFormulaCellFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  findFirstOrThrow<T extends GassmaGassmaFormulaCellFindFirstData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaFormulaCellFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  findMany<T extends GassmaGassmaFormulaCellFindManyData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaFormulaCellFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>[];
  update<T extends GassmaGassmaFormulaCellUpdateSingleData & Gassma.ComputedArgs<C>>(updateData: T): Gassma.WithComputed<GassmaGassmaFormulaCellFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  updateMany(updateData: GassmaGassmaFormulaCellUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaGassmaFormulaCellUpdateData): Gassma.WithComputed<GassmaGassmaFormulaCellFindResult<undefined, undefined, undefined, GO, O>, C, undefined, undefined>[];
  upsert<T extends GassmaGassmaFormulaCellUpsertSingleData & Gassma.ComputedArgs<C>>(upsertData: T): Gassma.WithComputed<GassmaGassmaFormulaCellFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  delete<T extends GassmaGassmaFormulaCellDeleteSingleData & Gassma.ComputedArgs<C>>(deleteData: T): Gassma.WithComputed<GassmaGassmaFormulaCellFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  deleteMany(deleteData: GassmaGassmaFormulaCellDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaGassmaFormulaCellAggregateData>(aggregateData: T): GassmaGassmaFormulaCellAggregateResult<T>;
  count(coutData: GassmaGassmaFormulaCellCountData): number;
  groupBy<T extends GassmaGassmaFormulaCellGroupByData>(groupByData: T): GassmaGassmaFormulaCellGroupByResult<T>[];
}

export declare class GassmaGassmaNotificationController<GO extends GassmaGassmaNotificationOmit = {}, O = {}, C = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  createMany(createdData: GassmaGassmaNotificationCreateManyData): CreateManyReturn;
  createManyAndReturn<T extends GassmaGassmaNotificationCreateManyAndReturnData & Gassma.ComputedArgs<C>>(createdData: T): Gassma.WithComputed<GassmaGassmaNotificationFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>[];
  create<T extends GassmaGassmaNotificationCreateData & Gassma.ComputedArgs<C>>(createdData: T): Gassma.WithComputed<GassmaGassmaNotificationFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  findFirst<T extends GassmaGassmaNotificationFindFirstData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaNotificationFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  findFirstOrThrow<T extends GassmaGassmaNotificationFindFirstData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaNotificationFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  findMany<T extends GassmaGassmaNotificationFindManyData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaNotificationFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>[];
  update<T extends GassmaGassmaNotificationUpdateSingleData & Gassma.ComputedArgs<C>>(updateData: T): Gassma.WithComputed<GassmaGassmaNotificationFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  updateMany(updateData: GassmaGassmaNotificationUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaGassmaNotificationUpdateData): Gassma.WithComputed<GassmaGassmaNotificationFindResult<undefined, undefined, undefined, GO, O>, C, undefined, undefined>[];
  upsert<T extends GassmaGassmaNotificationUpsertSingleData & Gassma.ComputedArgs<C>>(upsertData: T): Gassma.WithComputed<GassmaGassmaNotificationFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  delete<T extends GassmaGassmaNotificationDeleteSingleData & Gassma.ComputedArgs<C>>(deleteData: T): Gassma.WithComputed<GassmaGassmaNotificationFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  deleteMany(deleteData: GassmaGassmaNotificationDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaGassmaNotificationAggregateData>(aggregateData: T): GassmaGassmaNotificationAggregateResult<T>;
  count(coutData: GassmaGassmaNotificationCountData): number;
  groupBy<T extends GassmaGassmaNotificationGroupByData>(groupByData: T): GassmaGassmaNotificationGroupByResult<T>[];
}

export declare class GassmaGassmaOffsetNoteController<GO extends GassmaGassmaOffsetNoteOmit = {}, O = {}, C = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  createMany(createdData: GassmaGassmaOffsetNoteCreateManyData): CreateManyReturn;
  createManyAndReturn<T extends GassmaGassmaOffsetNoteCreateManyAndReturnData & Gassma.ComputedArgs<C>>(createdData: T): Gassma.WithComputed<GassmaGassmaOffsetNoteFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>[];
  create<T extends GassmaGassmaOffsetNoteCreateData & Gassma.ComputedArgs<C>>(createdData: T): Gassma.WithComputed<GassmaGassmaOffsetNoteFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  findFirst<T extends GassmaGassmaOffsetNoteFindFirstData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaOffsetNoteFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  findFirstOrThrow<T extends GassmaGassmaOffsetNoteFindFirstData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaOffsetNoteFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  findMany<T extends GassmaGassmaOffsetNoteFindManyData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaOffsetNoteFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>[];
  update<T extends GassmaGassmaOffsetNoteUpdateSingleData & Gassma.ComputedArgs<C>>(updateData: T): Gassma.WithComputed<GassmaGassmaOffsetNoteFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  updateMany(updateData: GassmaGassmaOffsetNoteUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaGassmaOffsetNoteUpdateData): Gassma.WithComputed<GassmaGassmaOffsetNoteFindResult<undefined, undefined, undefined, GO, O>, C, undefined, undefined>[];
  upsert<T extends GassmaGassmaOffsetNoteUpsertSingleData & Gassma.ComputedArgs<C>>(upsertData: T): Gassma.WithComputed<GassmaGassmaOffsetNoteFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  delete<T extends GassmaGassmaOffsetNoteDeleteSingleData & Gassma.ComputedArgs<C>>(deleteData: T): Gassma.WithComputed<GassmaGassmaOffsetNoteFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  deleteMany(deleteData: GassmaGassmaOffsetNoteDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaGassmaOffsetNoteAggregateData>(aggregateData: T): GassmaGassmaOffsetNoteAggregateResult<T>;
  count(coutData: GassmaGassmaOffsetNoteCountData): number;
  groupBy<T extends GassmaGassmaOffsetNoteGroupByData>(groupByData: T): GassmaGassmaOffsetNoteGroupByResult<T>[];
}

export declare class GassmaGassmaUserController<GO extends GassmaGassmaUserOmit = {}, O = {}, C = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  createMany(createdData: GassmaGassmaUserCreateManyData): CreateManyReturn;
  createManyAndReturn<T extends GassmaGassmaUserCreateManyAndReturnData & Gassma.ComputedArgs<C>>(createdData: T): Gassma.WithComputed<GassmaGassmaUserFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>[];
  create<T extends GassmaGassmaUserCreateData & Gassma.ComputedArgs<C>>(createdData: T): Gassma.WithComputed<GassmaGassmaUserFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  findFirst<T extends GassmaGassmaUserFindFirstData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaUserFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  findFirstOrThrow<T extends GassmaGassmaUserFindFirstData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaUserFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  findMany<T extends GassmaGassmaUserFindManyData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaUserFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>[];
  update<T extends GassmaGassmaUserUpdateSingleData & Gassma.ComputedArgs<C>>(updateData: T): Gassma.WithComputed<GassmaGassmaUserFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  updateMany(updateData: GassmaGassmaUserUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaGassmaUserUpdateData): Gassma.WithComputed<GassmaGassmaUserFindResult<undefined, undefined, undefined, GO, O>, C, undefined, undefined>[];
  upsert<T extends GassmaGassmaUserUpsertSingleData & Gassma.ComputedArgs<C>>(upsertData: T): Gassma.WithComputed<GassmaGassmaUserFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  delete<T extends GassmaGassmaUserDeleteSingleData & Gassma.ComputedArgs<C>>(deleteData: T): Gassma.WithComputed<GassmaGassmaUserFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  deleteMany(deleteData: GassmaGassmaUserDeleteData): DeleteManyReturn;
  aggregate<T extends GassmaGassmaUserAggregateData>(aggregateData: T): GassmaGassmaUserAggregateResult<T>;
  count(coutData: GassmaGassmaUserCountData): number;
  groupBy<T extends GassmaGassmaUserGroupByData>(groupByData: T): GassmaGassmaUserGroupByResult<T>[];
}

export declare class GassmaGassmaProfileController<GO extends GassmaGassmaProfileOmit = {}, O = {}, C = {}> {
  constructor(sheetName: string, id?: string);

  readonly fields: Record<string, Gassma.FieldRef>;
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  createMany(createdData: GassmaGassmaProfileCreateManyData): CreateManyReturn;
  createManyAndReturn<T extends GassmaGassmaProfileCreateManyAndReturnData & Gassma.ComputedArgs<C>>(createdData: T): Gassma.WithComputed<GassmaGassmaProfileFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>[];
  create<T extends GassmaGassmaProfileCreateData & Gassma.ComputedArgs<C>>(createdData: T): Gassma.WithComputed<GassmaGassmaProfileFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  findFirst<T extends GassmaGassmaProfileFindFirstData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaProfileFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  findFirstOrThrow<T extends GassmaGassmaProfileFindFirstData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaProfileFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  findMany<T extends GassmaGassmaProfileFindManyData & Gassma.ComputedArgs<C>>(findData: T): Gassma.WithComputed<GassmaGassmaProfileFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>[];
  update<T extends GassmaGassmaProfileUpdateSingleData & Gassma.ComputedArgs<C>>(updateData: T): Gassma.WithComputed<GassmaGassmaProfileFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
  updateMany(updateData: GassmaGassmaProfileUpdateData): UpdateManyReturn;
  updateManyAndReturn(updateData: GassmaGassmaProfileUpdateData): Gassma.WithComputed<GassmaGassmaProfileFindResult<undefined, undefined, undefined, GO, O>, C, undefined, undefined>[];
  upsert<T extends GassmaGassmaProfileUpsertSingleData & Gassma.ComputedArgs<C>>(upsertData: T): Gassma.WithComputed<GassmaGassmaProfileFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]>;
  delete<T extends GassmaGassmaProfileDeleteSingleData & Gassma.ComputedArgs<C>>(deleteData: T): Gassma.WithComputed<GassmaGassmaProfileFindResult<Gassma.StripComputed<T["select"], C>, T["include"], T["omit"], GO, O>, C, T["select"], T["omit"]> | null;
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
  "content"?: string | number | null;
  "published"?: boolean;
  "viewCount"?: number;
  "rating"?: number | boolean | null;
  "authorId": number;
  "categoryId"?: number | null;
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
  "parentId"?: number | null;
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

export type GassmaGassmaFormulaCellUse = {
  "id": number;
  "label": string;
  "amount": number;
  "total": number;
};

export type GassmaGassmaNotificationUse = {
  "id"?: number;
  "userId": number;
  "message": string;
  "isRead"?: boolean;
};

export type GassmaGassmaOffsetNoteUse = {
  "id": number;
  "title": string;
  "value": number;
};

export type GassmaGassmaUserUse = {
  "id"?: number;
  "email": string;
  "name": string;
  "age"?: number | null;
  "isActive"?: boolean;
  "role": "ADMIN" | "USER" | "MODERATOR";
  "createdAt"?: Date;
};

export type GassmaGassmaProfileUse = {
  "id"?: number;
  "bio"?: string | null;
  "website"?: string | null;
  "userId": number;
};

export type GassmaGassmaPostCreateData = {
  data: Omit<GassmaGassmaPostUse, "authorId" | "categoryId"> & (Pick<GassmaGassmaPostUse, "authorId"> | { "author": { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse } } }) & (Pick<GassmaGassmaPostUse, "categoryId"> | { "category": { create?: GassmaGassmaCategoryUse; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse } } }) & {
    "comments"?: { create?: Omit<GassmaGassmaCommentUse, "postId"> | Omit<GassmaGassmaCommentUse, "postId">[]; createMany?: { data: Omit<GassmaGassmaCommentUse, "postId">[] }; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: Omit<GassmaGassmaCommentUse, "postId"> } | { where: GassmaGassmaCommentWhereUse; create: Omit<GassmaGassmaCommentUse, "postId"> }[] };
    "tags"?: { create?: GassmaGassmaTagUse | GassmaGassmaTagUse[]; connect?: GassmaGassmaTagWhereUse | GassmaGassmaTagWhereUse[]; connectOrCreate?: { where: GassmaGassmaTagWhereUse; create: GassmaGassmaTagUse } | { where: GassmaGassmaTagWhereUse; create: GassmaGassmaTagUse }[] };
  };
  include?: GassmaGassmaPostInclude;
} & ({ select?: GassmaGassmaPostSelect; omit?: never } | { select?: never; omit?: GassmaGassmaPostOmit });

export type GassmaGassmaCommentCreateData = {
  data: Omit<GassmaGassmaCommentUse, "authorId" | "postId"> & (Pick<GassmaGassmaCommentUse, "authorId"> | { "author": { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse } } }) & (Pick<GassmaGassmaCommentUse, "postId"> | { "post": { create?: GassmaGassmaPostUse; connect?: GassmaGassmaPostWhereUse; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } } });
  include?: GassmaGassmaCommentInclude;
} & ({ select?: GassmaGassmaCommentSelect; omit?: never } | { select?: never; omit?: GassmaGassmaCommentOmit });

export type GassmaGassmaCategoryCreateData = {
  data: Omit<GassmaGassmaCategoryUse, "parentId"> & (Pick<GassmaGassmaCategoryUse, "parentId"> | { "parent": { create?: GassmaGassmaCategoryUse; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse } } }) & {
    "posts"?: { create?: Omit<GassmaGassmaPostUse, "categoryId"> | Omit<GassmaGassmaPostUse, "categoryId">[]; createMany?: { data: Omit<GassmaGassmaPostUse, "categoryId">[] }; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: Omit<GassmaGassmaPostUse, "categoryId"> } | { where: GassmaGassmaPostWhereUse; create: Omit<GassmaGassmaPostUse, "categoryId"> }[] };
    "children"?: { create?: Omit<GassmaGassmaCategoryUse, "parentId"> | Omit<GassmaGassmaCategoryUse, "parentId">[]; createMany?: { data: Omit<GassmaGassmaCategoryUse, "parentId">[] }; connect?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: Omit<GassmaGassmaCategoryUse, "parentId"> } | { where: GassmaGassmaCategoryWhereUse; create: Omit<GassmaGassmaCategoryUse, "parentId"> }[] };
  };
  include?: GassmaGassmaCategoryInclude;
} & ({ select?: GassmaGassmaCategorySelect; omit?: never } | { select?: never; omit?: GassmaGassmaCategoryOmit });

export type GassmaGassmaTagCreateData = {
  data: GassmaGassmaTagUse & {
    "posts"?: { create?: GassmaGassmaPostUse | GassmaGassmaPostUse[]; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } | { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse }[] };
  };
  include?: GassmaGassmaTagInclude;
} & ({ select?: GassmaGassmaTagSelect; omit?: never } | { select?: never; omit?: GassmaGassmaTagOmit });

export type GassmaGassmaProductCreateData = {
  data: GassmaGassmaProductUse & {
    "orderItems"?: { create?: Omit<GassmaGassmaOrderItemUse, "productId"> | Omit<GassmaGassmaOrderItemUse, "productId">[]; createMany?: { data: Omit<GassmaGassmaOrderItemUse, "productId">[] }; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: Omit<GassmaGassmaOrderItemUse, "productId"> } | { where: GassmaGassmaOrderItemWhereUse; create: Omit<GassmaGassmaOrderItemUse, "productId"> }[] };
  };
  include?: GassmaGassmaProductInclude;
} & ({ select?: GassmaGassmaProductSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProductOmit });

export type GassmaGassmaOrderCreateData = {
  data: Omit<GassmaGassmaOrderUse, "userId"> & (Pick<GassmaGassmaOrderUse, "userId"> | { "user": { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse } } }) & {
    "items"?: { create?: Omit<GassmaGassmaOrderItemUse, "orderId"> | Omit<GassmaGassmaOrderItemUse, "orderId">[]; createMany?: { data: Omit<GassmaGassmaOrderItemUse, "orderId">[] }; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: Omit<GassmaGassmaOrderItemUse, "orderId"> } | { where: GassmaGassmaOrderItemWhereUse; create: Omit<GassmaGassmaOrderItemUse, "orderId"> }[] };
  };
  include?: GassmaGassmaOrderInclude;
} & ({ select?: GassmaGassmaOrderSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderOmit });

export type GassmaGassmaOrderItemCreateData = {
  data: Omit<GassmaGassmaOrderItemUse, "orderId" | "productId"> & (Pick<GassmaGassmaOrderItemUse, "orderId"> | { "order": { create?: GassmaGassmaOrderUse; connect?: GassmaGassmaOrderWhereUse; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: GassmaGassmaOrderUse } } }) & (Pick<GassmaGassmaOrderItemUse, "productId"> | { "product": { create?: GassmaGassmaProductUse; connect?: GassmaGassmaProductWhereUse; connectOrCreate?: { where: GassmaGassmaProductWhereUse; create: GassmaGassmaProductUse } } });
  include?: GassmaGassmaOrderItemInclude;
} & ({ select?: GassmaGassmaOrderItemSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderItemOmit });

export type GassmaGassmaFormulaCellCreateData = {
  data: GassmaGassmaFormulaCellUse;
  include?: GassmaGassmaFormulaCellInclude;
} & ({ select?: GassmaGassmaFormulaCellSelect; omit?: never } | { select?: never; omit?: GassmaGassmaFormulaCellOmit });

export type GassmaGassmaNotificationCreateData = {
  data: GassmaGassmaNotificationUse;
  include?: GassmaGassmaNotificationInclude;
} & ({ select?: GassmaGassmaNotificationSelect; omit?: never } | { select?: never; omit?: GassmaGassmaNotificationOmit });

export type GassmaGassmaOffsetNoteCreateData = {
  data: GassmaGassmaOffsetNoteUse;
  include?: GassmaGassmaOffsetNoteInclude;
} & ({ select?: GassmaGassmaOffsetNoteSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOffsetNoteOmit });

export type GassmaGassmaUserCreateData = {
  data: GassmaGassmaUserUse & {
    "posts"?: { create?: Omit<GassmaGassmaPostUse, "authorId"> | Omit<GassmaGassmaPostUse, "authorId">[]; createMany?: { data: Omit<GassmaGassmaPostUse, "authorId">[] }; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: Omit<GassmaGassmaPostUse, "authorId"> } | { where: GassmaGassmaPostWhereUse; create: Omit<GassmaGassmaPostUse, "authorId"> }[] };
    "comments"?: { create?: Omit<GassmaGassmaCommentUse, "authorId"> | Omit<GassmaGassmaCommentUse, "authorId">[]; createMany?: { data: Omit<GassmaGassmaCommentUse, "authorId">[] }; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: Omit<GassmaGassmaCommentUse, "authorId"> } | { where: GassmaGassmaCommentWhereUse; create: Omit<GassmaGassmaCommentUse, "authorId"> }[] };
    "orders"?: { create?: Omit<GassmaGassmaOrderUse, "userId"> | Omit<GassmaGassmaOrderUse, "userId">[]; createMany?: { data: Omit<GassmaGassmaOrderUse, "userId">[] }; connect?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: Omit<GassmaGassmaOrderUse, "userId"> } | { where: GassmaGassmaOrderWhereUse; create: Omit<GassmaGassmaOrderUse, "userId"> }[] };
    "profile"?: { create?: Omit<GassmaGassmaProfileUse, "userId">; connect?: GassmaGassmaProfileWhereUse; connectOrCreate?: { where: GassmaGassmaProfileWhereUse; create: Omit<GassmaGassmaProfileUse, "userId"> } };
  };
  include?: GassmaGassmaUserInclude;
} & ({ select?: GassmaGassmaUserSelect; omit?: never } | { select?: never; omit?: GassmaGassmaUserOmit });

export type GassmaGassmaProfileCreateData = {
  data: Omit<GassmaGassmaProfileUse, "userId"> & (Pick<GassmaGassmaProfileUse, "userId"> | { "user": { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse } } });
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

export type GassmaGassmaFormulaCellCreateManyData = {
  data: GassmaGassmaFormulaCellUse[];
};

export type GassmaGassmaNotificationCreateManyData = {
  data: GassmaGassmaNotificationUse[];
};

export type GassmaGassmaOffsetNoteCreateManyData = {
  data: GassmaGassmaOffsetNoteUse[];
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

export type GassmaGassmaFormulaCellCreateManyAndReturnData = {
  data: GassmaGassmaFormulaCellUse[];
  include?: GassmaGassmaFormulaCellInclude;
} & ({ select?: GassmaGassmaFormulaCellSelect; omit?: never } | { select?: never; omit?: GassmaGassmaFormulaCellOmit });

export type GassmaGassmaNotificationCreateManyAndReturnData = {
  data: GassmaGassmaNotificationUse[];
  include?: GassmaGassmaNotificationInclude;
} & ({ select?: GassmaGassmaNotificationSelect; omit?: never } | { select?: never; omit?: GassmaGassmaNotificationOmit });

export type GassmaGassmaOffsetNoteCreateManyAndReturnData = {
  data: GassmaGassmaOffsetNoteUse[];
  include?: GassmaGassmaOffsetNoteInclude;
} & ({ select?: GassmaGassmaOffsetNoteSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOffsetNoteOmit });

export type GassmaGassmaUserCreateManyAndReturnData = {
  data: GassmaGassmaUserUse[];
  include?: GassmaGassmaUserInclude;
} & ({ select?: GassmaGassmaUserSelect; omit?: never } | { select?: never; omit?: GassmaGassmaUserOmit });

export type GassmaGassmaProfileCreateManyAndReturnData = {
  data: GassmaGassmaProfileUse[];
  include?: GassmaGassmaProfileInclude;
} & ({ select?: GassmaGassmaProfileSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProfileOmit });

export type GassmaGassmaPostidFilterConditions = {
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

export type GassmaGassmaPostviewCountFilterConditions = {
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

export type GassmaGassmaPostupdatedAtFilterConditions = {
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

export type GassmaGassmaCommentidFilterConditions = {
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

export type GassmaGassmaCategoryidFilterConditions = {
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

export type GassmaGassmaProductupdatedAtFilterConditions = {
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

export type GassmaGassmaOrderidFilterConditions = {
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

export type GassmaGassmaOrderItemidFilterConditions = {
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

export type GassmaGassmaFormulaCellidFilterConditions = {
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

export type GassmaGassmaFormulaCelllabelFilterConditions = {
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

export type GassmaGassmaFormulaCellamountFilterConditions = {
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

export type GassmaGassmaFormulaCelltotalFilterConditions = {
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

export type GassmaGassmaOffsetNoteidFilterConditions = {
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

export type GassmaGassmaOffsetNotetitleFilterConditions = {
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

export type GassmaGassmaOffsetNotevalueFilterConditions = {
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

export type GassmaGassmaUseridFilterConditions = {
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

export type GassmaGassmaProfileidFilterConditions = {
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
  "id"?: number | GassmaGassmaPostidFilterConditions;
  "title"?: string | GassmaGassmaPosttitleFilterConditions;
  "content"?: string | number | null | GassmaGassmaPostcontentFilterConditions;
  "published"?: boolean | GassmaGassmaPostpublishedFilterConditions;
  "viewCount"?: number | GassmaGassmaPostviewCountFilterConditions;
  "rating"?: number | boolean | null | GassmaGassmaPostratingFilterConditions;
  "authorId"?: number | GassmaGassmaPostauthorIdFilterConditions;
  "categoryId"?: number | null | GassmaGassmaPostcategoryIdFilterConditions;
  "createdAt"?: Date | GassmaGassmaPostcreatedAtFilterConditions;
  "updatedAt"?: Date | GassmaGassmaPostupdatedAtFilterConditions;
  "author"?: { is?: GassmaGassmaUserWhereUse | null; isNot?: GassmaGassmaUserWhereUse | null } | null;
  "category"?: { is?: GassmaGassmaCategoryWhereUse | null; isNot?: GassmaGassmaCategoryWhereUse | null } | null;
  "comments"?: { some?: GassmaGassmaCommentWhereUse; every?: GassmaGassmaCommentWhereUse; none?: GassmaGassmaCommentWhereUse };
  "tags"?: { some?: GassmaGassmaTagWhereUse; every?: GassmaGassmaTagWhereUse; none?: GassmaGassmaTagWhereUse };

  AND?: GassmaGassmaPostWhereUse[] | GassmaGassmaPostWhereUse;
  OR?: GassmaGassmaPostWhereUse[];
  NOT?: GassmaGassmaPostWhereUse[] | GassmaGassmaPostWhereUse;
};

export type GassmaGassmaCommentWhereUse = {
  "id"?: number | GassmaGassmaCommentidFilterConditions;
  "text"?: string | GassmaGassmaCommenttextFilterConditions;
  "authorId"?: number | GassmaGassmaCommentauthorIdFilterConditions;
  "postId"?: number | GassmaGassmaCommentpostIdFilterConditions;
  "createdAt"?: Date | GassmaGassmaCommentcreatedAtFilterConditions;
  "author"?: { is?: GassmaGassmaUserWhereUse | null; isNot?: GassmaGassmaUserWhereUse | null } | null;
  "post"?: { is?: GassmaGassmaPostWhereUse | null; isNot?: GassmaGassmaPostWhereUse | null } | null;

  AND?: GassmaGassmaCommentWhereUse[] | GassmaGassmaCommentWhereUse;
  OR?: GassmaGassmaCommentWhereUse[];
  NOT?: GassmaGassmaCommentWhereUse[] | GassmaGassmaCommentWhereUse;
};

export type GassmaGassmaCategoryWhereUse = {
  "id"?: number | GassmaGassmaCategoryidFilterConditions;
  "name"?: string | GassmaGassmaCategorynameFilterConditions;
  "parentId"?: number | null | GassmaGassmaCategoryparentIdFilterConditions;
  "posts"?: { some?: GassmaGassmaPostWhereUse; every?: GassmaGassmaPostWhereUse; none?: GassmaGassmaPostWhereUse };
  "parent"?: { is?: GassmaGassmaCategoryWhereUse | null; isNot?: GassmaGassmaCategoryWhereUse | null } | null;
  "children"?: { some?: GassmaGassmaCategoryWhereUse; every?: GassmaGassmaCategoryWhereUse; none?: GassmaGassmaCategoryWhereUse };

  AND?: GassmaGassmaCategoryWhereUse[] | GassmaGassmaCategoryWhereUse;
  OR?: GassmaGassmaCategoryWhereUse[];
  NOT?: GassmaGassmaCategoryWhereUse[] | GassmaGassmaCategoryWhereUse;
};

export type GassmaGassmaTagWhereUse = {
  "id"?: number | GassmaGassmaTagidFilterConditions;
  "name"?: string | GassmaGassmaTagnameFilterConditions;
  "posts"?: { some?: GassmaGassmaPostWhereUse; every?: GassmaGassmaPostWhereUse; none?: GassmaGassmaPostWhereUse };

  AND?: GassmaGassmaTagWhereUse[] | GassmaGassmaTagWhereUse;
  OR?: GassmaGassmaTagWhereUse[];
  NOT?: GassmaGassmaTagWhereUse[] | GassmaGassmaTagWhereUse;
};

export type GassmaGassmaProductWhereUse = {
  "id"?: number | GassmaGassmaProductidFilterConditions;
  "name"?: string | GassmaGassmaProductnameFilterConditions;
  "price"?: number | GassmaGassmaProductpriceFilterConditions;
  "stock"?: number | GassmaGassmaProductstockFilterConditions;
  "status"?: "available" | "soldout" | "discontinued" | GassmaGassmaProductstatusFilterConditions;
  "createdAt"?: Date | GassmaGassmaProductcreatedAtFilterConditions;
  "updatedAt"?: Date | GassmaGassmaProductupdatedAtFilterConditions;
  "orderItems"?: { some?: GassmaGassmaOrderItemWhereUse; every?: GassmaGassmaOrderItemWhereUse; none?: GassmaGassmaOrderItemWhereUse };

  AND?: GassmaGassmaProductWhereUse[] | GassmaGassmaProductWhereUse;
  OR?: GassmaGassmaProductWhereUse[];
  NOT?: GassmaGassmaProductWhereUse[] | GassmaGassmaProductWhereUse;
};

export type GassmaGassmaOrderWhereUse = {
  "id"?: number | GassmaGassmaOrderidFilterConditions;
  "userId"?: number | GassmaGassmaOrderuserIdFilterConditions;
  "totalAmount"?: number | GassmaGassmaOrdertotalAmountFilterConditions;
  "quantity"?: number | GassmaGassmaOrderquantityFilterConditions;
  "status"?: "pending" | "shipped" | "delivered" | "cancelled" | GassmaGassmaOrderstatusFilterConditions;
  "createdAt"?: Date | GassmaGassmaOrdercreatedAtFilterConditions;
  "user"?: { is?: GassmaGassmaUserWhereUse | null; isNot?: GassmaGassmaUserWhereUse | null } | null;
  "items"?: { some?: GassmaGassmaOrderItemWhereUse; every?: GassmaGassmaOrderItemWhereUse; none?: GassmaGassmaOrderItemWhereUse };

  AND?: GassmaGassmaOrderWhereUse[] | GassmaGassmaOrderWhereUse;
  OR?: GassmaGassmaOrderWhereUse[];
  NOT?: GassmaGassmaOrderWhereUse[] | GassmaGassmaOrderWhereUse;
};

export type GassmaGassmaOrderItemWhereUse = {
  "id"?: number | GassmaGassmaOrderItemidFilterConditions;
  "orderId"?: number | GassmaGassmaOrderItemorderIdFilterConditions;
  "productId"?: number | GassmaGassmaOrderItemproductIdFilterConditions;
  "quantity"?: number | GassmaGassmaOrderItemquantityFilterConditions;
  "unitPrice"?: number | GassmaGassmaOrderItemunitPriceFilterConditions;
  "order"?: { is?: GassmaGassmaOrderWhereUse | null; isNot?: GassmaGassmaOrderWhereUse | null } | null;
  "product"?: { is?: GassmaGassmaProductWhereUse | null; isNot?: GassmaGassmaProductWhereUse | null } | null;

  AND?: GassmaGassmaOrderItemWhereUse[] | GassmaGassmaOrderItemWhereUse;
  OR?: GassmaGassmaOrderItemWhereUse[];
  NOT?: GassmaGassmaOrderItemWhereUse[] | GassmaGassmaOrderItemWhereUse;
};

export type GassmaGassmaFormulaCellWhereUse = {
  "id"?: number | GassmaGassmaFormulaCellidFilterConditions;
  "label"?: string | GassmaGassmaFormulaCelllabelFilterConditions;
  "amount"?: number | GassmaGassmaFormulaCellamountFilterConditions;
  "total"?: number | GassmaGassmaFormulaCelltotalFilterConditions;

  AND?: GassmaGassmaFormulaCellWhereUse[] | GassmaGassmaFormulaCellWhereUse;
  OR?: GassmaGassmaFormulaCellWhereUse[];
  NOT?: GassmaGassmaFormulaCellWhereUse[] | GassmaGassmaFormulaCellWhereUse;
};

export type GassmaGassmaNotificationWhereUse = {
  "id"?: number | GassmaGassmaNotificationidFilterConditions;
  "userId"?: number | GassmaGassmaNotificationuserIdFilterConditions;
  "message"?: string | GassmaGassmaNotificationmessageFilterConditions;
  "isRead"?: boolean | GassmaGassmaNotificationisReadFilterConditions;

  AND?: GassmaGassmaNotificationWhereUse[] | GassmaGassmaNotificationWhereUse;
  OR?: GassmaGassmaNotificationWhereUse[];
  NOT?: GassmaGassmaNotificationWhereUse[] | GassmaGassmaNotificationWhereUse;
};

export type GassmaGassmaOffsetNoteWhereUse = {
  "id"?: number | GassmaGassmaOffsetNoteidFilterConditions;
  "title"?: string | GassmaGassmaOffsetNotetitleFilterConditions;
  "value"?: number | GassmaGassmaOffsetNotevalueFilterConditions;

  AND?: GassmaGassmaOffsetNoteWhereUse[] | GassmaGassmaOffsetNoteWhereUse;
  OR?: GassmaGassmaOffsetNoteWhereUse[];
  NOT?: GassmaGassmaOffsetNoteWhereUse[] | GassmaGassmaOffsetNoteWhereUse;
};

export type GassmaGassmaUserWhereUse = {
  "id"?: number | GassmaGassmaUseridFilterConditions;
  "email"?: string | GassmaGassmaUseremailFilterConditions;
  "name"?: string | GassmaGassmaUsernameFilterConditions;
  "age"?: number | null | GassmaGassmaUserageFilterConditions;
  "isActive"?: boolean | GassmaGassmaUserisActiveFilterConditions;
  "role"?: "ADMIN" | "USER" | "MODERATOR" | GassmaGassmaUserroleFilterConditions;
  "createdAt"?: Date | GassmaGassmaUsercreatedAtFilterConditions;
  "posts"?: { some?: GassmaGassmaPostWhereUse; every?: GassmaGassmaPostWhereUse; none?: GassmaGassmaPostWhereUse };
  "comments"?: { some?: GassmaGassmaCommentWhereUse; every?: GassmaGassmaCommentWhereUse; none?: GassmaGassmaCommentWhereUse };
  "orders"?: { some?: GassmaGassmaOrderWhereUse; every?: GassmaGassmaOrderWhereUse; none?: GassmaGassmaOrderWhereUse };
  "profile"?: { is?: GassmaGassmaProfileWhereUse | null; isNot?: GassmaGassmaProfileWhereUse | null } | null;

  AND?: GassmaGassmaUserWhereUse[] | GassmaGassmaUserWhereUse;
  OR?: GassmaGassmaUserWhereUse[];
  NOT?: GassmaGassmaUserWhereUse[] | GassmaGassmaUserWhereUse;
};

export type GassmaGassmaProfileWhereUse = {
  "id"?: number | GassmaGassmaProfileidFilterConditions;
  "bio"?: string | null | GassmaGassmaProfilebioFilterConditions;
  "website"?: string | null | GassmaGassmaProfilewebsiteFilterConditions;
  "userId"?: number | GassmaGassmaProfileuserIdFilterConditions;
  "user"?: { is?: GassmaGassmaUserWhereUse | null; isNot?: GassmaGassmaUserWhereUse | null } | null;

  AND?: GassmaGassmaProfileWhereUse[] | GassmaGassmaProfileWhereUse;
  OR?: GassmaGassmaProfileWhereUse[];
  NOT?: GassmaGassmaProfileWhereUse[] | GassmaGassmaProfileWhereUse;
};

export type GassmaGassmaPostidHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaPostidFilterConditions;
  _min?: GassmaGassmaPostidFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaPostidFilterConditions;

export type GassmaGassmaPosttitleHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaPosttitleFilterConditions;
  _min?: GassmaGassmaPosttitleFilterConditions;
} & GassmaGassmaPosttitleFilterConditions;

export type GassmaGassmaPostcontentHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaPostcontentFilterConditions;
  _min?: GassmaGassmaPostcontentFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaPostcontentFilterConditions;

export type GassmaGassmaPostpublishedHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaPostpublishedFilterConditions;
  _min?: GassmaGassmaPostpublishedFilterConditions;
} & GassmaGassmaPostpublishedFilterConditions;

export type GassmaGassmaPostviewCountHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaPostviewCountFilterConditions;
  _min?: GassmaGassmaPostviewCountFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaPostviewCountFilterConditions;

export type GassmaGassmaPostratingHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaPostratingFilterConditions;
  _min?: GassmaGassmaPostratingFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaPostratingFilterConditions;

export type GassmaGassmaPostauthorIdHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaPostauthorIdFilterConditions;
  _min?: GassmaGassmaPostauthorIdFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaPostauthorIdFilterConditions;

export type GassmaGassmaPostcategoryIdHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaPostcategoryIdFilterConditions;
  _min?: GassmaGassmaPostcategoryIdFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaPostcategoryIdFilterConditions;

export type GassmaGassmaPostcreatedAtHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaPostcreatedAtFilterConditions;
  _min?: GassmaGassmaPostcreatedAtFilterConditions;
} & GassmaGassmaPostcreatedAtFilterConditions;

export type GassmaGassmaPostupdatedAtHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaPostupdatedAtFilterConditions;
  _min?: GassmaGassmaPostupdatedAtFilterConditions;
} & GassmaGassmaPostupdatedAtFilterConditions;

export type GassmaGassmaCommentidHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaCommentidFilterConditions;
  _min?: GassmaGassmaCommentidFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaCommentidFilterConditions;

export type GassmaGassmaCommenttextHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaCommenttextFilterConditions;
  _min?: GassmaGassmaCommenttextFilterConditions;
} & GassmaGassmaCommenttextFilterConditions;

export type GassmaGassmaCommentauthorIdHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaCommentauthorIdFilterConditions;
  _min?: GassmaGassmaCommentauthorIdFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaCommentauthorIdFilterConditions;

export type GassmaGassmaCommentpostIdHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaCommentpostIdFilterConditions;
  _min?: GassmaGassmaCommentpostIdFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaCommentpostIdFilterConditions;

export type GassmaGassmaCommentcreatedAtHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaCommentcreatedAtFilterConditions;
  _min?: GassmaGassmaCommentcreatedAtFilterConditions;
} & GassmaGassmaCommentcreatedAtFilterConditions;

export type GassmaGassmaCategoryidHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaCategoryidFilterConditions;
  _min?: GassmaGassmaCategoryidFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaCategoryidFilterConditions;

export type GassmaGassmaCategorynameHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaCategorynameFilterConditions;
  _min?: GassmaGassmaCategorynameFilterConditions;
} & GassmaGassmaCategorynameFilterConditions;

export type GassmaGassmaCategoryparentIdHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaCategoryparentIdFilterConditions;
  _min?: GassmaGassmaCategoryparentIdFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaCategoryparentIdFilterConditions;

export type GassmaGassmaTagidHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaTagidFilterConditions;
  _min?: GassmaGassmaTagidFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaTagidFilterConditions;

export type GassmaGassmaTagnameHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaTagnameFilterConditions;
  _min?: GassmaGassmaTagnameFilterConditions;
} & GassmaGassmaTagnameFilterConditions;

export type GassmaGassmaProductidHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaProductidFilterConditions;
  _min?: GassmaGassmaProductidFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaProductidFilterConditions;

export type GassmaGassmaProductnameHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaProductnameFilterConditions;
  _min?: GassmaGassmaProductnameFilterConditions;
} & GassmaGassmaProductnameFilterConditions;

export type GassmaGassmaProductpriceHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaProductpriceFilterConditions;
  _min?: GassmaGassmaProductpriceFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaProductpriceFilterConditions;

export type GassmaGassmaProductstockHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaProductstockFilterConditions;
  _min?: GassmaGassmaProductstockFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaProductstockFilterConditions;

export type GassmaGassmaProductstatusHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaProductstatusFilterConditions;
  _min?: GassmaGassmaProductstatusFilterConditions;
} & GassmaGassmaProductstatusFilterConditions;

export type GassmaGassmaProductcreatedAtHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaProductcreatedAtFilterConditions;
  _min?: GassmaGassmaProductcreatedAtFilterConditions;
} & GassmaGassmaProductcreatedAtFilterConditions;

export type GassmaGassmaProductupdatedAtHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaProductupdatedAtFilterConditions;
  _min?: GassmaGassmaProductupdatedAtFilterConditions;
} & GassmaGassmaProductupdatedAtFilterConditions;

export type GassmaGassmaOrderidHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaOrderidFilterConditions;
  _min?: GassmaGassmaOrderidFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaOrderidFilterConditions;

export type GassmaGassmaOrderuserIdHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaOrderuserIdFilterConditions;
  _min?: GassmaGassmaOrderuserIdFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaOrderuserIdFilterConditions;

export type GassmaGassmaOrdertotalAmountHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaOrdertotalAmountFilterConditions;
  _min?: GassmaGassmaOrdertotalAmountFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaOrdertotalAmountFilterConditions;

export type GassmaGassmaOrderquantityHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaOrderquantityFilterConditions;
  _min?: GassmaGassmaOrderquantityFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaOrderquantityFilterConditions;

export type GassmaGassmaOrderstatusHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaOrderstatusFilterConditions;
  _min?: GassmaGassmaOrderstatusFilterConditions;
} & GassmaGassmaOrderstatusFilterConditions;

export type GassmaGassmaOrdercreatedAtHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaOrdercreatedAtFilterConditions;
  _min?: GassmaGassmaOrdercreatedAtFilterConditions;
} & GassmaGassmaOrdercreatedAtFilterConditions;

export type GassmaGassmaOrderItemidHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaOrderItemidFilterConditions;
  _min?: GassmaGassmaOrderItemidFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaOrderItemidFilterConditions;

export type GassmaGassmaOrderItemorderIdHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaOrderItemorderIdFilterConditions;
  _min?: GassmaGassmaOrderItemorderIdFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaOrderItemorderIdFilterConditions;

export type GassmaGassmaOrderItemproductIdHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaOrderItemproductIdFilterConditions;
  _min?: GassmaGassmaOrderItemproductIdFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaOrderItemproductIdFilterConditions;

export type GassmaGassmaOrderItemquantityHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaOrderItemquantityFilterConditions;
  _min?: GassmaGassmaOrderItemquantityFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaOrderItemquantityFilterConditions;

export type GassmaGassmaOrderItemunitPriceHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaOrderItemunitPriceFilterConditions;
  _min?: GassmaGassmaOrderItemunitPriceFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaOrderItemunitPriceFilterConditions;

export type GassmaGassmaFormulaCellidHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaFormulaCellidFilterConditions;
  _min?: GassmaGassmaFormulaCellidFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaFormulaCellidFilterConditions;

export type GassmaGassmaFormulaCelllabelHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaFormulaCelllabelFilterConditions;
  _min?: GassmaGassmaFormulaCelllabelFilterConditions;
} & GassmaGassmaFormulaCelllabelFilterConditions;

export type GassmaGassmaFormulaCellamountHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaFormulaCellamountFilterConditions;
  _min?: GassmaGassmaFormulaCellamountFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaFormulaCellamountFilterConditions;

export type GassmaGassmaFormulaCelltotalHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaFormulaCelltotalFilterConditions;
  _min?: GassmaGassmaFormulaCelltotalFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaFormulaCelltotalFilterConditions;

export type GassmaGassmaNotificationidHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaNotificationidFilterConditions;
  _min?: GassmaGassmaNotificationidFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaNotificationidFilterConditions;

export type GassmaGassmaNotificationuserIdHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaNotificationuserIdFilterConditions;
  _min?: GassmaGassmaNotificationuserIdFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaNotificationuserIdFilterConditions;

export type GassmaGassmaNotificationmessageHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaNotificationmessageFilterConditions;
  _min?: GassmaGassmaNotificationmessageFilterConditions;
} & GassmaGassmaNotificationmessageFilterConditions;

export type GassmaGassmaNotificationisReadHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaNotificationisReadFilterConditions;
  _min?: GassmaGassmaNotificationisReadFilterConditions;
} & GassmaGassmaNotificationisReadFilterConditions;

export type GassmaGassmaOffsetNoteidHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaOffsetNoteidFilterConditions;
  _min?: GassmaGassmaOffsetNoteidFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaOffsetNoteidFilterConditions;

export type GassmaGassmaOffsetNotetitleHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaOffsetNotetitleFilterConditions;
  _min?: GassmaGassmaOffsetNotetitleFilterConditions;
} & GassmaGassmaOffsetNotetitleFilterConditions;

export type GassmaGassmaOffsetNotevalueHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaOffsetNotevalueFilterConditions;
  _min?: GassmaGassmaOffsetNotevalueFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaOffsetNotevalueFilterConditions;

export type GassmaGassmaUseridHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaUseridFilterConditions;
  _min?: GassmaGassmaUseridFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaUseridFilterConditions;

export type GassmaGassmaUseremailHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaUseremailFilterConditions;
  _min?: GassmaGassmaUseremailFilterConditions;
} & GassmaGassmaUseremailFilterConditions;

export type GassmaGassmaUsernameHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaUsernameFilterConditions;
  _min?: GassmaGassmaUsernameFilterConditions;
} & GassmaGassmaUsernameFilterConditions;

export type GassmaGassmaUserageHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaUserageFilterConditions;
  _min?: GassmaGassmaUserageFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaUserageFilterConditions;

export type GassmaGassmaUserisActiveHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaUserisActiveFilterConditions;
  _min?: GassmaGassmaUserisActiveFilterConditions;
} & GassmaGassmaUserisActiveFilterConditions;

export type GassmaGassmaUserroleHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaUserroleFilterConditions;
  _min?: GassmaGassmaUserroleFilterConditions;
} & GassmaGassmaUserroleFilterConditions;

export type GassmaGassmaUsercreatedAtHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaUsercreatedAtFilterConditions;
  _min?: GassmaGassmaUsercreatedAtFilterConditions;
} & GassmaGassmaUsercreatedAtFilterConditions;

export type GassmaGassmaProfileidHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaProfileidFilterConditions;
  _min?: GassmaGassmaProfileidFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaProfileidFilterConditions;

export type GassmaGassmaProfilebioHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaProfilebioFilterConditions;
  _min?: GassmaGassmaProfilebioFilterConditions;
} & GassmaGassmaProfilebioFilterConditions;

export type GassmaGassmaProfilewebsiteHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaProfilewebsiteFilterConditions;
  _min?: GassmaGassmaProfilewebsiteFilterConditions;
} & GassmaGassmaProfilewebsiteFilterConditions;

export type GassmaGassmaProfileuserIdHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaProfileuserIdFilterConditions;
  _min?: GassmaGassmaProfileuserIdFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaProfileuserIdFilterConditions;

export type GassmaGassmaPostHavingUse = {
  "id"?: number | GassmaGassmaPostidHavingCore;
  "title"?: string | GassmaGassmaPosttitleHavingCore;
  "content"?: string | number | null | GassmaGassmaPostcontentHavingCore;
  "published"?: boolean | GassmaGassmaPostpublishedHavingCore;
  "viewCount"?: number | GassmaGassmaPostviewCountHavingCore;
  "rating"?: number | boolean | null | GassmaGassmaPostratingHavingCore;
  "authorId"?: number | GassmaGassmaPostauthorIdHavingCore;
  "categoryId"?: number | null | GassmaGassmaPostcategoryIdHavingCore;
  "createdAt"?: Date | GassmaGassmaPostcreatedAtHavingCore;
  "updatedAt"?: Date | GassmaGassmaPostupdatedAtHavingCore;

  AND?: GassmaGassmaPostHavingUse[] | GassmaGassmaPostHavingUse;
  OR?: GassmaGassmaPostHavingUse[];
  NOT?: GassmaGassmaPostHavingUse[] | GassmaGassmaPostHavingUse;
};

export type GassmaGassmaCommentHavingUse = {
  "id"?: number | GassmaGassmaCommentidHavingCore;
  "text"?: string | GassmaGassmaCommenttextHavingCore;
  "authorId"?: number | GassmaGassmaCommentauthorIdHavingCore;
  "postId"?: number | GassmaGassmaCommentpostIdHavingCore;
  "createdAt"?: Date | GassmaGassmaCommentcreatedAtHavingCore;

  AND?: GassmaGassmaCommentHavingUse[] | GassmaGassmaCommentHavingUse;
  OR?: GassmaGassmaCommentHavingUse[];
  NOT?: GassmaGassmaCommentHavingUse[] | GassmaGassmaCommentHavingUse;
};

export type GassmaGassmaCategoryHavingUse = {
  "id"?: number | GassmaGassmaCategoryidHavingCore;
  "name"?: string | GassmaGassmaCategorynameHavingCore;
  "parentId"?: number | null | GassmaGassmaCategoryparentIdHavingCore;

  AND?: GassmaGassmaCategoryHavingUse[] | GassmaGassmaCategoryHavingUse;
  OR?: GassmaGassmaCategoryHavingUse[];
  NOT?: GassmaGassmaCategoryHavingUse[] | GassmaGassmaCategoryHavingUse;
};

export type GassmaGassmaTagHavingUse = {
  "id"?: number | GassmaGassmaTagidHavingCore;
  "name"?: string | GassmaGassmaTagnameHavingCore;

  AND?: GassmaGassmaTagHavingUse[] | GassmaGassmaTagHavingUse;
  OR?: GassmaGassmaTagHavingUse[];
  NOT?: GassmaGassmaTagHavingUse[] | GassmaGassmaTagHavingUse;
};

export type GassmaGassmaProductHavingUse = {
  "id"?: number | GassmaGassmaProductidHavingCore;
  "name"?: string | GassmaGassmaProductnameHavingCore;
  "price"?: number | GassmaGassmaProductpriceHavingCore;
  "stock"?: number | GassmaGassmaProductstockHavingCore;
  "status"?: "available" | "soldout" | "discontinued" | GassmaGassmaProductstatusHavingCore;
  "createdAt"?: Date | GassmaGassmaProductcreatedAtHavingCore;
  "updatedAt"?: Date | GassmaGassmaProductupdatedAtHavingCore;

  AND?: GassmaGassmaProductHavingUse[] | GassmaGassmaProductHavingUse;
  OR?: GassmaGassmaProductHavingUse[];
  NOT?: GassmaGassmaProductHavingUse[] | GassmaGassmaProductHavingUse;
};

export type GassmaGassmaOrderHavingUse = {
  "id"?: number | GassmaGassmaOrderidHavingCore;
  "userId"?: number | GassmaGassmaOrderuserIdHavingCore;
  "totalAmount"?: number | GassmaGassmaOrdertotalAmountHavingCore;
  "quantity"?: number | GassmaGassmaOrderquantityHavingCore;
  "status"?: "pending" | "shipped" | "delivered" | "cancelled" | GassmaGassmaOrderstatusHavingCore;
  "createdAt"?: Date | GassmaGassmaOrdercreatedAtHavingCore;

  AND?: GassmaGassmaOrderHavingUse[] | GassmaGassmaOrderHavingUse;
  OR?: GassmaGassmaOrderHavingUse[];
  NOT?: GassmaGassmaOrderHavingUse[] | GassmaGassmaOrderHavingUse;
};

export type GassmaGassmaOrderItemHavingUse = {
  "id"?: number | GassmaGassmaOrderItemidHavingCore;
  "orderId"?: number | GassmaGassmaOrderItemorderIdHavingCore;
  "productId"?: number | GassmaGassmaOrderItemproductIdHavingCore;
  "quantity"?: number | GassmaGassmaOrderItemquantityHavingCore;
  "unitPrice"?: number | GassmaGassmaOrderItemunitPriceHavingCore;

  AND?: GassmaGassmaOrderItemHavingUse[] | GassmaGassmaOrderItemHavingUse;
  OR?: GassmaGassmaOrderItemHavingUse[];
  NOT?: GassmaGassmaOrderItemHavingUse[] | GassmaGassmaOrderItemHavingUse;
};

export type GassmaGassmaFormulaCellHavingUse = {
  "id"?: number | GassmaGassmaFormulaCellidHavingCore;
  "label"?: string | GassmaGassmaFormulaCelllabelHavingCore;
  "amount"?: number | GassmaGassmaFormulaCellamountHavingCore;
  "total"?: number | GassmaGassmaFormulaCelltotalHavingCore;

  AND?: GassmaGassmaFormulaCellHavingUse[] | GassmaGassmaFormulaCellHavingUse;
  OR?: GassmaGassmaFormulaCellHavingUse[];
  NOT?: GassmaGassmaFormulaCellHavingUse[] | GassmaGassmaFormulaCellHavingUse;
};

export type GassmaGassmaNotificationHavingUse = {
  "id"?: number | GassmaGassmaNotificationidHavingCore;
  "userId"?: number | GassmaGassmaNotificationuserIdHavingCore;
  "message"?: string | GassmaGassmaNotificationmessageHavingCore;
  "isRead"?: boolean | GassmaGassmaNotificationisReadHavingCore;

  AND?: GassmaGassmaNotificationHavingUse[] | GassmaGassmaNotificationHavingUse;
  OR?: GassmaGassmaNotificationHavingUse[];
  NOT?: GassmaGassmaNotificationHavingUse[] | GassmaGassmaNotificationHavingUse;
};

export type GassmaGassmaOffsetNoteHavingUse = {
  "id"?: number | GassmaGassmaOffsetNoteidHavingCore;
  "title"?: string | GassmaGassmaOffsetNotetitleHavingCore;
  "value"?: number | GassmaGassmaOffsetNotevalueHavingCore;

  AND?: GassmaGassmaOffsetNoteHavingUse[] | GassmaGassmaOffsetNoteHavingUse;
  OR?: GassmaGassmaOffsetNoteHavingUse[];
  NOT?: GassmaGassmaOffsetNoteHavingUse[] | GassmaGassmaOffsetNoteHavingUse;
};

export type GassmaGassmaUserHavingUse = {
  "id"?: number | GassmaGassmaUseridHavingCore;
  "email"?: string | GassmaGassmaUseremailHavingCore;
  "name"?: string | GassmaGassmaUsernameHavingCore;
  "age"?: number | null | GassmaGassmaUserageHavingCore;
  "isActive"?: boolean | GassmaGassmaUserisActiveHavingCore;
  "role"?: "ADMIN" | "USER" | "MODERATOR" | GassmaGassmaUserroleHavingCore;
  "createdAt"?: Date | GassmaGassmaUsercreatedAtHavingCore;

  AND?: GassmaGassmaUserHavingUse[] | GassmaGassmaUserHavingUse;
  OR?: GassmaGassmaUserHavingUse[];
  NOT?: GassmaGassmaUserHavingUse[] | GassmaGassmaUserHavingUse;
};

export type GassmaGassmaProfileHavingUse = {
  "id"?: number | GassmaGassmaProfileidHavingCore;
  "bio"?: string | null | GassmaGassmaProfilebioHavingCore;
  "website"?: string | null | GassmaGassmaProfilewebsiteHavingCore;
  "userId"?: number | GassmaGassmaProfileuserIdHavingCore;

  AND?: GassmaGassmaProfileHavingUse[] | GassmaGassmaProfileHavingUse;
  OR?: GassmaGassmaProfileHavingUse[];
  NOT?: GassmaGassmaProfileHavingUse[] | GassmaGassmaProfileHavingUse;
};

export type GassmaGassmaPostFindData = {
  where?: GassmaGassmaPostWhereUse;
  orderBy?: GassmaGassmaPostOrderBy | GassmaGassmaPostOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "title" | "content" | "published" | "viewCount" | "rating" | "authorId" | "categoryId" | "createdAt" | "updatedAt" | ("id" | "title" | "content" | "published" | "viewCount" | "rating" | "authorId" | "categoryId" | "createdAt" | "updatedAt")[];
  include?: GassmaGassmaPostInclude;
  cursor?: Partial<GassmaGassmaPostUse>;
  _count?: GassmaGassmaPostCountValue;
} & ({ select?: GassmaGassmaPostFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaPostOmit });

export type GassmaGassmaCommentFindData = {
  where?: GassmaGassmaCommentWhereUse;
  orderBy?: GassmaGassmaCommentOrderBy | GassmaGassmaCommentOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "text" | "authorId" | "postId" | "createdAt" | ("id" | "text" | "authorId" | "postId" | "createdAt")[];
  include?: GassmaGassmaCommentInclude;
  cursor?: Partial<GassmaGassmaCommentUse>;
  _count?: GassmaGassmaCommentCountValue;
} & ({ select?: GassmaGassmaCommentFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaCommentOmit });

export type GassmaGassmaCategoryFindData = {
  where?: GassmaGassmaCategoryWhereUse;
  orderBy?: GassmaGassmaCategoryOrderBy | GassmaGassmaCategoryOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "name" | "parentId" | ("id" | "name" | "parentId")[];
  include?: GassmaGassmaCategoryInclude;
  cursor?: Partial<GassmaGassmaCategoryUse>;
  _count?: GassmaGassmaCategoryCountValue;
} & ({ select?: GassmaGassmaCategoryFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaCategoryOmit });

export type GassmaGassmaTagFindData = {
  where?: GassmaGassmaTagWhereUse;
  orderBy?: GassmaGassmaTagOrderBy | GassmaGassmaTagOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "name" | ("id" | "name")[];
  include?: GassmaGassmaTagInclude;
  cursor?: Partial<GassmaGassmaTagUse>;
  _count?: GassmaGassmaTagCountValue;
} & ({ select?: GassmaGassmaTagFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaTagOmit });

export type GassmaGassmaProductFindData = {
  where?: GassmaGassmaProductWhereUse;
  orderBy?: GassmaGassmaProductOrderBy | GassmaGassmaProductOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "name" | "price" | "stock" | "status" | "createdAt" | "updatedAt" | ("id" | "name" | "price" | "stock" | "status" | "createdAt" | "updatedAt")[];
  include?: GassmaGassmaProductInclude;
  cursor?: Partial<GassmaGassmaProductUse>;
  _count?: GassmaGassmaProductCountValue;
} & ({ select?: GassmaGassmaProductFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProductOmit });

export type GassmaGassmaOrderFindData = {
  where?: GassmaGassmaOrderWhereUse;
  orderBy?: GassmaGassmaOrderOrderBy | GassmaGassmaOrderOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "userId" | "totalAmount" | "quantity" | "status" | "createdAt" | ("id" | "userId" | "totalAmount" | "quantity" | "status" | "createdAt")[];
  include?: GassmaGassmaOrderInclude;
  cursor?: Partial<GassmaGassmaOrderUse>;
  _count?: GassmaGassmaOrderCountValue;
} & ({ select?: GassmaGassmaOrderFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderOmit });

export type GassmaGassmaOrderItemFindData = {
  where?: GassmaGassmaOrderItemWhereUse;
  orderBy?: GassmaGassmaOrderItemOrderBy | GassmaGassmaOrderItemOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "orderId" | "productId" | "quantity" | "unitPrice" | ("id" | "orderId" | "productId" | "quantity" | "unitPrice")[];
  include?: GassmaGassmaOrderItemInclude;
  cursor?: Partial<GassmaGassmaOrderItemUse>;
  _count?: GassmaGassmaOrderItemCountValue;
} & ({ select?: GassmaGassmaOrderItemFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderItemOmit });

export type GassmaGassmaFormulaCellFindData = {
  where?: GassmaGassmaFormulaCellWhereUse;
  orderBy?: GassmaGassmaFormulaCellOrderBy | GassmaGassmaFormulaCellOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "label" | "amount" | "total" | ("id" | "label" | "amount" | "total")[];
  include?: GassmaGassmaFormulaCellInclude;
  cursor?: Partial<GassmaGassmaFormulaCellUse>;
  _count?: GassmaGassmaFormulaCellCountValue;
} & ({ select?: GassmaGassmaFormulaCellFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaFormulaCellOmit });

export type GassmaGassmaNotificationFindData = {
  where?: GassmaGassmaNotificationWhereUse;
  orderBy?: GassmaGassmaNotificationOrderBy | GassmaGassmaNotificationOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "userId" | "message" | "isRead" | ("id" | "userId" | "message" | "isRead")[];
  include?: GassmaGassmaNotificationInclude;
  cursor?: Partial<GassmaGassmaNotificationUse>;
  _count?: GassmaGassmaNotificationCountValue;
} & ({ select?: GassmaGassmaNotificationFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaNotificationOmit });

export type GassmaGassmaOffsetNoteFindData = {
  where?: GassmaGassmaOffsetNoteWhereUse;
  orderBy?: GassmaGassmaOffsetNoteOrderBy | GassmaGassmaOffsetNoteOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "title" | "value" | ("id" | "title" | "value")[];
  include?: GassmaGassmaOffsetNoteInclude;
  cursor?: Partial<GassmaGassmaOffsetNoteUse>;
  _count?: GassmaGassmaOffsetNoteCountValue;
} & ({ select?: GassmaGassmaOffsetNoteFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOffsetNoteOmit });

export type GassmaGassmaUserFindData = {
  where?: GassmaGassmaUserWhereUse;
  orderBy?: GassmaGassmaUserOrderBy | GassmaGassmaUserOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt" | ("id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt")[];
  include?: GassmaGassmaUserInclude;
  cursor?: Partial<GassmaGassmaUserUse>;
  _count?: GassmaGassmaUserCountValue;
} & ({ select?: GassmaGassmaUserFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaUserOmit });

export type GassmaGassmaProfileFindData = {
  where?: GassmaGassmaProfileWhereUse;
  orderBy?: GassmaGassmaProfileOrderBy | GassmaGassmaProfileOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "bio" | "website" | "userId" | ("id" | "bio" | "website" | "userId")[];
  include?: GassmaGassmaProfileInclude;
  cursor?: Partial<GassmaGassmaProfileUse>;
  _count?: GassmaGassmaProfileCountValue;
} & ({ select?: GassmaGassmaProfileFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProfileOmit });

export type GassmaGassmaPostFindFirstData = {
  where?: GassmaGassmaPostWhereUse;
  orderBy?: GassmaGassmaPostOrderBy | GassmaGassmaPostOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "title" | "content" | "published" | "viewCount" | "rating" | "authorId" | "categoryId" | "createdAt" | "updatedAt" | ("id" | "title" | "content" | "published" | "viewCount" | "rating" | "authorId" | "categoryId" | "createdAt" | "updatedAt")[];
  include?: GassmaGassmaPostInclude;
  cursor?: Partial<GassmaGassmaPostUse>;
  _count?: GassmaGassmaPostCountValue;
} & ({ select?: GassmaGassmaPostFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaPostOmit });

export type GassmaGassmaCommentFindFirstData = {
  where?: GassmaGassmaCommentWhereUse;
  orderBy?: GassmaGassmaCommentOrderBy | GassmaGassmaCommentOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "text" | "authorId" | "postId" | "createdAt" | ("id" | "text" | "authorId" | "postId" | "createdAt")[];
  include?: GassmaGassmaCommentInclude;
  cursor?: Partial<GassmaGassmaCommentUse>;
  _count?: GassmaGassmaCommentCountValue;
} & ({ select?: GassmaGassmaCommentFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaCommentOmit });

export type GassmaGassmaCategoryFindFirstData = {
  where?: GassmaGassmaCategoryWhereUse;
  orderBy?: GassmaGassmaCategoryOrderBy | GassmaGassmaCategoryOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "name" | "parentId" | ("id" | "name" | "parentId")[];
  include?: GassmaGassmaCategoryInclude;
  cursor?: Partial<GassmaGassmaCategoryUse>;
  _count?: GassmaGassmaCategoryCountValue;
} & ({ select?: GassmaGassmaCategoryFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaCategoryOmit });

export type GassmaGassmaTagFindFirstData = {
  where?: GassmaGassmaTagWhereUse;
  orderBy?: GassmaGassmaTagOrderBy | GassmaGassmaTagOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "name" | ("id" | "name")[];
  include?: GassmaGassmaTagInclude;
  cursor?: Partial<GassmaGassmaTagUse>;
  _count?: GassmaGassmaTagCountValue;
} & ({ select?: GassmaGassmaTagFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaTagOmit });

export type GassmaGassmaProductFindFirstData = {
  where?: GassmaGassmaProductWhereUse;
  orderBy?: GassmaGassmaProductOrderBy | GassmaGassmaProductOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "name" | "price" | "stock" | "status" | "createdAt" | "updatedAt" | ("id" | "name" | "price" | "stock" | "status" | "createdAt" | "updatedAt")[];
  include?: GassmaGassmaProductInclude;
  cursor?: Partial<GassmaGassmaProductUse>;
  _count?: GassmaGassmaProductCountValue;
} & ({ select?: GassmaGassmaProductFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProductOmit });

export type GassmaGassmaOrderFindFirstData = {
  where?: GassmaGassmaOrderWhereUse;
  orderBy?: GassmaGassmaOrderOrderBy | GassmaGassmaOrderOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "userId" | "totalAmount" | "quantity" | "status" | "createdAt" | ("id" | "userId" | "totalAmount" | "quantity" | "status" | "createdAt")[];
  include?: GassmaGassmaOrderInclude;
  cursor?: Partial<GassmaGassmaOrderUse>;
  _count?: GassmaGassmaOrderCountValue;
} & ({ select?: GassmaGassmaOrderFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderOmit });

export type GassmaGassmaOrderItemFindFirstData = {
  where?: GassmaGassmaOrderItemWhereUse;
  orderBy?: GassmaGassmaOrderItemOrderBy | GassmaGassmaOrderItemOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "orderId" | "productId" | "quantity" | "unitPrice" | ("id" | "orderId" | "productId" | "quantity" | "unitPrice")[];
  include?: GassmaGassmaOrderItemInclude;
  cursor?: Partial<GassmaGassmaOrderItemUse>;
  _count?: GassmaGassmaOrderItemCountValue;
} & ({ select?: GassmaGassmaOrderItemFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderItemOmit });

export type GassmaGassmaFormulaCellFindFirstData = {
  where?: GassmaGassmaFormulaCellWhereUse;
  orderBy?: GassmaGassmaFormulaCellOrderBy | GassmaGassmaFormulaCellOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "label" | "amount" | "total" | ("id" | "label" | "amount" | "total")[];
  include?: GassmaGassmaFormulaCellInclude;
  cursor?: Partial<GassmaGassmaFormulaCellUse>;
  _count?: GassmaGassmaFormulaCellCountValue;
} & ({ select?: GassmaGassmaFormulaCellFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaFormulaCellOmit });

export type GassmaGassmaNotificationFindFirstData = {
  where?: GassmaGassmaNotificationWhereUse;
  orderBy?: GassmaGassmaNotificationOrderBy | GassmaGassmaNotificationOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "userId" | "message" | "isRead" | ("id" | "userId" | "message" | "isRead")[];
  include?: GassmaGassmaNotificationInclude;
  cursor?: Partial<GassmaGassmaNotificationUse>;
  _count?: GassmaGassmaNotificationCountValue;
} & ({ select?: GassmaGassmaNotificationFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaNotificationOmit });

export type GassmaGassmaOffsetNoteFindFirstData = {
  where?: GassmaGassmaOffsetNoteWhereUse;
  orderBy?: GassmaGassmaOffsetNoteOrderBy | GassmaGassmaOffsetNoteOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "title" | "value" | ("id" | "title" | "value")[];
  include?: GassmaGassmaOffsetNoteInclude;
  cursor?: Partial<GassmaGassmaOffsetNoteUse>;
  _count?: GassmaGassmaOffsetNoteCountValue;
} & ({ select?: GassmaGassmaOffsetNoteFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOffsetNoteOmit });

export type GassmaGassmaUserFindFirstData = {
  where?: GassmaGassmaUserWhereUse;
  orderBy?: GassmaGassmaUserOrderBy | GassmaGassmaUserOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt" | ("id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt")[];
  include?: GassmaGassmaUserInclude;
  cursor?: Partial<GassmaGassmaUserUse>;
  _count?: GassmaGassmaUserCountValue;
} & ({ select?: GassmaGassmaUserFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaUserOmit });

export type GassmaGassmaProfileFindFirstData = {
  where?: GassmaGassmaProfileWhereUse;
  orderBy?: GassmaGassmaProfileOrderBy | GassmaGassmaProfileOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "bio" | "website" | "userId" | ("id" | "bio" | "website" | "userId")[];
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

export type GassmaGassmaFormulaCellFindManyData = GassmaGassmaFormulaCellFindData;

export type GassmaGassmaNotificationFindManyData = GassmaGassmaNotificationFindData;

export type GassmaGassmaOffsetNoteFindManyData = GassmaGassmaOffsetNoteFindData;

export type GassmaGassmaUserFindManyData = GassmaGassmaUserFindData;

export type GassmaGassmaProfileFindManyData = GassmaGassmaProfileFindData;

export type GassmaGassmaPostUpdateData = {
  where?: GassmaGassmaPostWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) }>;
  limit?: number;
};

export type GassmaGassmaCommentUpdateData = {
  where?: GassmaGassmaCommentWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | (K extends "id" | "authorId" | "postId" ? Gassma.NumberOperation : never) }>;
  limit?: number;
};

export type GassmaGassmaCategoryUpdateData = {
  where?: GassmaGassmaCategoryWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | (K extends "id" | "parentId" ? Gassma.NumberOperation : never) }>;
  limit?: number;
};

export type GassmaGassmaTagUpdateData = {
  where?: GassmaGassmaTagWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaTagUse]: GassmaGassmaTagUse[K] | (K extends "id" ? Gassma.NumberOperation : never) }>;
  limit?: number;
};

export type GassmaGassmaProductUpdateData = {
  where?: GassmaGassmaProductWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaProductUse]: GassmaGassmaProductUse[K] | (K extends "id" | "price" | "stock" ? Gassma.NumberOperation : never) }>;
  limit?: number;
};

export type GassmaGassmaOrderUpdateData = {
  where?: GassmaGassmaOrderWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaOrderUse]: GassmaGassmaOrderUse[K] | (K extends "id" | "userId" | "totalAmount" | "quantity" ? Gassma.NumberOperation : never) }>;
  limit?: number;
};

export type GassmaGassmaOrderItemUpdateData = {
  where?: GassmaGassmaOrderItemWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | (K extends "id" | "orderId" | "productId" | "quantity" | "unitPrice" ? Gassma.NumberOperation : never) }>;
  limit?: number;
};

export type GassmaGassmaFormulaCellUpdateData = {
  where?: GassmaGassmaFormulaCellWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaFormulaCellUse]: GassmaGassmaFormulaCellUse[K] | (K extends "id" | "amount" | "total" ? Gassma.NumberOperation : never) }>;
  limit?: number;
};

export type GassmaGassmaNotificationUpdateData = {
  where?: GassmaGassmaNotificationWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaNotificationUse]: GassmaGassmaNotificationUse[K] | (K extends "id" | "userId" ? Gassma.NumberOperation : never) }>;
  limit?: number;
};

export type GassmaGassmaOffsetNoteUpdateData = {
  where?: GassmaGassmaOffsetNoteWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaOffsetNoteUse]: GassmaGassmaOffsetNoteUse[K] | (K extends "id" | "value" ? Gassma.NumberOperation : never) }>;
  limit?: number;
};

export type GassmaGassmaUserUpdateData = {
  where?: GassmaGassmaUserWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | (K extends "id" | "age" ? Gassma.NumberOperation : never) }>;
  limit?: number;
};

export type GassmaGassmaProfileUpdateData = {
  where?: GassmaGassmaProfileWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaProfileUse]: GassmaGassmaProfileUse[K] | (K extends "id" | "userId" ? Gassma.NumberOperation : never) }>;
  limit?: number;
};

export type GassmaGassmaPostUpdateSingleData = {
  where: GassmaGassmaPostWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) }> & {
    "author"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse }; update?: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | (K extends "id" | "age" ? Gassma.NumberOperation : never) }>; delete?: true; disconnect?: true };
    "category"?: { create?: GassmaGassmaCategoryUse; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse }; update?: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | (K extends "id" | "parentId" ? Gassma.NumberOperation : never) }>; delete?: true; disconnect?: true };
    "comments"?: { create?: Omit<GassmaGassmaCommentUse, "postId"> | Omit<GassmaGassmaCommentUse, "postId">[]; createMany?: { data: Omit<GassmaGassmaCommentUse, "postId">[] }; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: Omit<GassmaGassmaCommentUse, "postId"> } | { where: GassmaGassmaCommentWhereUse; create: Omit<GassmaGassmaCommentUse, "postId"> }[]; update?: { where: GassmaGassmaCommentWhereUse; data: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | (K extends "id" | "authorId" | "postId" ? Gassma.NumberOperation : never) }> } | { where: GassmaGassmaCommentWhereUse; data: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | (K extends "id" | "authorId" | "postId" ? Gassma.NumberOperation : never) }> }[]; delete?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; deleteMany?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; disconnect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; set?: GassmaGassmaCommentWhereUse[] };
    "tags"?: { create?: GassmaGassmaTagUse | GassmaGassmaTagUse[]; connect?: GassmaGassmaTagWhereUse | GassmaGassmaTagWhereUse[]; connectOrCreate?: { where: GassmaGassmaTagWhereUse; create: GassmaGassmaTagUse } | { where: GassmaGassmaTagWhereUse; create: GassmaGassmaTagUse }[]; disconnect?: GassmaGassmaTagWhereUse | GassmaGassmaTagWhereUse[]; set?: GassmaGassmaTagWhereUse[] };
  };
  include?: GassmaGassmaPostInclude;
} & ({ select?: GassmaGassmaPostSelect; omit?: never } | { select?: never; omit?: GassmaGassmaPostOmit });

export type GassmaGassmaCommentUpdateSingleData = {
  where: GassmaGassmaCommentWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | (K extends "id" | "authorId" | "postId" ? Gassma.NumberOperation : never) }> & {
    "author"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse }; update?: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | (K extends "id" | "age" ? Gassma.NumberOperation : never) }>; delete?: true; disconnect?: true };
    "post"?: { create?: GassmaGassmaPostUse; connect?: GassmaGassmaPostWhereUse; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse }; update?: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) }>; delete?: true; disconnect?: true };
  };
  include?: GassmaGassmaCommentInclude;
} & ({ select?: GassmaGassmaCommentSelect; omit?: never } | { select?: never; omit?: GassmaGassmaCommentOmit });

export type GassmaGassmaCategoryUpdateSingleData = {
  where: GassmaGassmaCategoryWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | (K extends "id" | "parentId" ? Gassma.NumberOperation : never) }> & {
    "posts"?: { create?: Omit<GassmaGassmaPostUse, "categoryId"> | Omit<GassmaGassmaPostUse, "categoryId">[]; createMany?: { data: Omit<GassmaGassmaPostUse, "categoryId">[] }; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: Omit<GassmaGassmaPostUse, "categoryId"> } | { where: GassmaGassmaPostWhereUse; create: Omit<GassmaGassmaPostUse, "categoryId"> }[]; update?: { where: GassmaGassmaPostWhereUse; data: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) }> } | { where: GassmaGassmaPostWhereUse; data: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) }> }[]; delete?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; deleteMany?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; disconnect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
    "parent"?: { create?: GassmaGassmaCategoryUse; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse }; update?: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | (K extends "id" | "parentId" ? Gassma.NumberOperation : never) }>; delete?: true; disconnect?: true };
    "children"?: { create?: Omit<GassmaGassmaCategoryUse, "parentId"> | Omit<GassmaGassmaCategoryUse, "parentId">[]; createMany?: { data: Omit<GassmaGassmaCategoryUse, "parentId">[] }; connect?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: Omit<GassmaGassmaCategoryUse, "parentId"> } | { where: GassmaGassmaCategoryWhereUse; create: Omit<GassmaGassmaCategoryUse, "parentId"> }[]; update?: { where: GassmaGassmaCategoryWhereUse; data: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | (K extends "id" | "parentId" ? Gassma.NumberOperation : never) }> } | { where: GassmaGassmaCategoryWhereUse; data: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | (K extends "id" | "parentId" ? Gassma.NumberOperation : never) }> }[]; delete?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; deleteMany?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; disconnect?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; set?: GassmaGassmaCategoryWhereUse[] };
  };
  include?: GassmaGassmaCategoryInclude;
} & ({ select?: GassmaGassmaCategorySelect; omit?: never } | { select?: never; omit?: GassmaGassmaCategoryOmit });

export type GassmaGassmaTagUpdateSingleData = {
  where: GassmaGassmaTagWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaTagUse]: GassmaGassmaTagUse[K] | (K extends "id" ? Gassma.NumberOperation : never) }> & {
    "posts"?: { create?: GassmaGassmaPostUse | GassmaGassmaPostUse[]; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } | { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse }[]; disconnect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
  };
  include?: GassmaGassmaTagInclude;
} & ({ select?: GassmaGassmaTagSelect; omit?: never } | { select?: never; omit?: GassmaGassmaTagOmit });

export type GassmaGassmaProductUpdateSingleData = {
  where: GassmaGassmaProductWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaProductUse]: GassmaGassmaProductUse[K] | (K extends "id" | "price" | "stock" ? Gassma.NumberOperation : never) }> & {
    "orderItems"?: { create?: Omit<GassmaGassmaOrderItemUse, "productId"> | Omit<GassmaGassmaOrderItemUse, "productId">[]; createMany?: { data: Omit<GassmaGassmaOrderItemUse, "productId">[] }; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: Omit<GassmaGassmaOrderItemUse, "productId"> } | { where: GassmaGassmaOrderItemWhereUse; create: Omit<GassmaGassmaOrderItemUse, "productId"> }[]; update?: { where: GassmaGassmaOrderItemWhereUse; data: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | (K extends "id" | "orderId" | "productId" | "quantity" | "unitPrice" ? Gassma.NumberOperation : never) }> } | { where: GassmaGassmaOrderItemWhereUse; data: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | (K extends "id" | "orderId" | "productId" | "quantity" | "unitPrice" ? Gassma.NumberOperation : never) }> }[]; delete?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; deleteMany?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; disconnect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; set?: GassmaGassmaOrderItemWhereUse[] };
  };
  include?: GassmaGassmaProductInclude;
} & ({ select?: GassmaGassmaProductSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProductOmit });

export type GassmaGassmaOrderUpdateSingleData = {
  where: GassmaGassmaOrderWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaOrderUse]: GassmaGassmaOrderUse[K] | (K extends "id" | "userId" | "totalAmount" | "quantity" ? Gassma.NumberOperation : never) }> & {
    "user"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse }; update?: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | (K extends "id" | "age" ? Gassma.NumberOperation : never) }>; delete?: true; disconnect?: true };
    "items"?: { create?: Omit<GassmaGassmaOrderItemUse, "orderId"> | Omit<GassmaGassmaOrderItemUse, "orderId">[]; createMany?: { data: Omit<GassmaGassmaOrderItemUse, "orderId">[] }; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: Omit<GassmaGassmaOrderItemUse, "orderId"> } | { where: GassmaGassmaOrderItemWhereUse; create: Omit<GassmaGassmaOrderItemUse, "orderId"> }[]; update?: { where: GassmaGassmaOrderItemWhereUse; data: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | (K extends "id" | "orderId" | "productId" | "quantity" | "unitPrice" ? Gassma.NumberOperation : never) }> } | { where: GassmaGassmaOrderItemWhereUse; data: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | (K extends "id" | "orderId" | "productId" | "quantity" | "unitPrice" ? Gassma.NumberOperation : never) }> }[]; delete?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; deleteMany?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; disconnect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; set?: GassmaGassmaOrderItemWhereUse[] };
  };
  include?: GassmaGassmaOrderInclude;
} & ({ select?: GassmaGassmaOrderSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderOmit });

export type GassmaGassmaOrderItemUpdateSingleData = {
  where: GassmaGassmaOrderItemWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | (K extends "id" | "orderId" | "productId" | "quantity" | "unitPrice" ? Gassma.NumberOperation : never) }> & {
    "order"?: { create?: GassmaGassmaOrderUse; connect?: GassmaGassmaOrderWhereUse; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: GassmaGassmaOrderUse }; update?: Partial<{ [K in keyof GassmaGassmaOrderUse]: GassmaGassmaOrderUse[K] | (K extends "id" | "userId" | "totalAmount" | "quantity" ? Gassma.NumberOperation : never) }>; delete?: true; disconnect?: true };
    "product"?: { create?: GassmaGassmaProductUse; connect?: GassmaGassmaProductWhereUse; connectOrCreate?: { where: GassmaGassmaProductWhereUse; create: GassmaGassmaProductUse }; update?: Partial<{ [K in keyof GassmaGassmaProductUse]: GassmaGassmaProductUse[K] | (K extends "id" | "price" | "stock" ? Gassma.NumberOperation : never) }>; delete?: true; disconnect?: true };
  };
  include?: GassmaGassmaOrderItemInclude;
} & ({ select?: GassmaGassmaOrderItemSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderItemOmit });

export type GassmaGassmaFormulaCellUpdateSingleData = {
  where: GassmaGassmaFormulaCellWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaFormulaCellUse]: GassmaGassmaFormulaCellUse[K] | (K extends "id" | "amount" | "total" ? Gassma.NumberOperation : never) }>;
  include?: GassmaGassmaFormulaCellInclude;
} & ({ select?: GassmaGassmaFormulaCellSelect; omit?: never } | { select?: never; omit?: GassmaGassmaFormulaCellOmit });

export type GassmaGassmaNotificationUpdateSingleData = {
  where: GassmaGassmaNotificationWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaNotificationUse]: GassmaGassmaNotificationUse[K] | (K extends "id" | "userId" ? Gassma.NumberOperation : never) }>;
  include?: GassmaGassmaNotificationInclude;
} & ({ select?: GassmaGassmaNotificationSelect; omit?: never } | { select?: never; omit?: GassmaGassmaNotificationOmit });

export type GassmaGassmaOffsetNoteUpdateSingleData = {
  where: GassmaGassmaOffsetNoteWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaOffsetNoteUse]: GassmaGassmaOffsetNoteUse[K] | (K extends "id" | "value" ? Gassma.NumberOperation : never) }>;
  include?: GassmaGassmaOffsetNoteInclude;
} & ({ select?: GassmaGassmaOffsetNoteSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOffsetNoteOmit });

export type GassmaGassmaUserUpdateSingleData = {
  where: GassmaGassmaUserWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | (K extends "id" | "age" ? Gassma.NumberOperation : never) }> & {
    "posts"?: { create?: Omit<GassmaGassmaPostUse, "authorId"> | Omit<GassmaGassmaPostUse, "authorId">[]; createMany?: { data: Omit<GassmaGassmaPostUse, "authorId">[] }; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: Omit<GassmaGassmaPostUse, "authorId"> } | { where: GassmaGassmaPostWhereUse; create: Omit<GassmaGassmaPostUse, "authorId"> }[]; update?: { where: GassmaGassmaPostWhereUse; data: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) }> } | { where: GassmaGassmaPostWhereUse; data: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) }> }[]; delete?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; deleteMany?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; disconnect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
    "comments"?: { create?: Omit<GassmaGassmaCommentUse, "authorId"> | Omit<GassmaGassmaCommentUse, "authorId">[]; createMany?: { data: Omit<GassmaGassmaCommentUse, "authorId">[] }; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: Omit<GassmaGassmaCommentUse, "authorId"> } | { where: GassmaGassmaCommentWhereUse; create: Omit<GassmaGassmaCommentUse, "authorId"> }[]; update?: { where: GassmaGassmaCommentWhereUse; data: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | (K extends "id" | "authorId" | "postId" ? Gassma.NumberOperation : never) }> } | { where: GassmaGassmaCommentWhereUse; data: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | (K extends "id" | "authorId" | "postId" ? Gassma.NumberOperation : never) }> }[]; delete?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; deleteMany?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; disconnect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; set?: GassmaGassmaCommentWhereUse[] };
    "orders"?: { create?: Omit<GassmaGassmaOrderUse, "userId"> | Omit<GassmaGassmaOrderUse, "userId">[]; createMany?: { data: Omit<GassmaGassmaOrderUse, "userId">[] }; connect?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: Omit<GassmaGassmaOrderUse, "userId"> } | { where: GassmaGassmaOrderWhereUse; create: Omit<GassmaGassmaOrderUse, "userId"> }[]; update?: { where: GassmaGassmaOrderWhereUse; data: Partial<{ [K in keyof GassmaGassmaOrderUse]: GassmaGassmaOrderUse[K] | (K extends "id" | "userId" | "totalAmount" | "quantity" ? Gassma.NumberOperation : never) }> } | { where: GassmaGassmaOrderWhereUse; data: Partial<{ [K in keyof GassmaGassmaOrderUse]: GassmaGassmaOrderUse[K] | (K extends "id" | "userId" | "totalAmount" | "quantity" ? Gassma.NumberOperation : never) }> }[]; delete?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; deleteMany?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; disconnect?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; set?: GassmaGassmaOrderWhereUse[] };
    "profile"?: { create?: Omit<GassmaGassmaProfileUse, "userId">; connect?: GassmaGassmaProfileWhereUse; connectOrCreate?: { where: GassmaGassmaProfileWhereUse; create: Omit<GassmaGassmaProfileUse, "userId"> }; update?: Partial<{ [K in keyof GassmaGassmaProfileUse]: GassmaGassmaProfileUse[K] | (K extends "id" | "userId" ? Gassma.NumberOperation : never) }>; delete?: true; disconnect?: true };
  };
  include?: GassmaGassmaUserInclude;
} & ({ select?: GassmaGassmaUserSelect; omit?: never } | { select?: never; omit?: GassmaGassmaUserOmit });

export type GassmaGassmaProfileUpdateSingleData = {
  where: GassmaGassmaProfileWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaProfileUse]: GassmaGassmaProfileUse[K] | (K extends "id" | "userId" ? Gassma.NumberOperation : never) }> & {
    "user"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse }; update?: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | (K extends "id" | "age" ? Gassma.NumberOperation : never) }>; delete?: true; disconnect?: true };
  };
  include?: GassmaGassmaProfileInclude;
} & ({ select?: GassmaGassmaProfileSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProfileOmit });

export type GassmaGassmaPostUpsertSingleData = {
  where: GassmaGassmaPostWhereUse;
  create: Omit<GassmaGassmaPostUse, "authorId" | "categoryId"> & (Pick<GassmaGassmaPostUse, "authorId"> | { "author": { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse } } }) & (Pick<GassmaGassmaPostUse, "categoryId"> | { "category": { create?: GassmaGassmaCategoryUse; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse } } }) & {
    "comments"?: { create?: Omit<GassmaGassmaCommentUse, "postId"> | Omit<GassmaGassmaCommentUse, "postId">[]; createMany?: { data: Omit<GassmaGassmaCommentUse, "postId">[] }; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: Omit<GassmaGassmaCommentUse, "postId"> } | { where: GassmaGassmaCommentWhereUse; create: Omit<GassmaGassmaCommentUse, "postId"> }[] };
    "tags"?: { create?: GassmaGassmaTagUse | GassmaGassmaTagUse[]; connect?: GassmaGassmaTagWhereUse | GassmaGassmaTagWhereUse[]; connectOrCreate?: { where: GassmaGassmaTagWhereUse; create: GassmaGassmaTagUse } | { where: GassmaGassmaTagWhereUse; create: GassmaGassmaTagUse }[] };
  };
  update: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) }> & {
    "author"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse }; update?: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | (K extends "id" | "age" ? Gassma.NumberOperation : never) }>; delete?: true; disconnect?: true };
    "category"?: { create?: GassmaGassmaCategoryUse; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse }; update?: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | (K extends "id" | "parentId" ? Gassma.NumberOperation : never) }>; delete?: true; disconnect?: true };
    "comments"?: { create?: Omit<GassmaGassmaCommentUse, "postId"> | Omit<GassmaGassmaCommentUse, "postId">[]; createMany?: { data: Omit<GassmaGassmaCommentUse, "postId">[] }; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: Omit<GassmaGassmaCommentUse, "postId"> } | { where: GassmaGassmaCommentWhereUse; create: Omit<GassmaGassmaCommentUse, "postId"> }[]; update?: { where: GassmaGassmaCommentWhereUse; data: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | (K extends "id" | "authorId" | "postId" ? Gassma.NumberOperation : never) }> } | { where: GassmaGassmaCommentWhereUse; data: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | (K extends "id" | "authorId" | "postId" ? Gassma.NumberOperation : never) }> }[]; delete?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; deleteMany?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; disconnect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; set?: GassmaGassmaCommentWhereUse[] };
    "tags"?: { create?: GassmaGassmaTagUse | GassmaGassmaTagUse[]; connect?: GassmaGassmaTagWhereUse | GassmaGassmaTagWhereUse[]; connectOrCreate?: { where: GassmaGassmaTagWhereUse; create: GassmaGassmaTagUse } | { where: GassmaGassmaTagWhereUse; create: GassmaGassmaTagUse }[]; disconnect?: GassmaGassmaTagWhereUse | GassmaGassmaTagWhereUse[]; set?: GassmaGassmaTagWhereUse[] };
  };
  include?: GassmaGassmaPostInclude;
} & ({ select?: GassmaGassmaPostSelect; omit?: never } | { select?: never; omit?: GassmaGassmaPostOmit });

export type GassmaGassmaCommentUpsertSingleData = {
  where: GassmaGassmaCommentWhereUse;
  create: Omit<GassmaGassmaCommentUse, "authorId" | "postId"> & (Pick<GassmaGassmaCommentUse, "authorId"> | { "author": { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse } } }) & (Pick<GassmaGassmaCommentUse, "postId"> | { "post": { create?: GassmaGassmaPostUse; connect?: GassmaGassmaPostWhereUse; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } } });
  update: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | (K extends "id" | "authorId" | "postId" ? Gassma.NumberOperation : never) }> & {
    "author"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse }; update?: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | (K extends "id" | "age" ? Gassma.NumberOperation : never) }>; delete?: true; disconnect?: true };
    "post"?: { create?: GassmaGassmaPostUse; connect?: GassmaGassmaPostWhereUse; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse }; update?: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) }>; delete?: true; disconnect?: true };
  };
  include?: GassmaGassmaCommentInclude;
} & ({ select?: GassmaGassmaCommentSelect; omit?: never } | { select?: never; omit?: GassmaGassmaCommentOmit });

export type GassmaGassmaCategoryUpsertSingleData = {
  where: GassmaGassmaCategoryWhereUse;
  create: Omit<GassmaGassmaCategoryUse, "parentId"> & (Pick<GassmaGassmaCategoryUse, "parentId"> | { "parent": { create?: GassmaGassmaCategoryUse; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse } } }) & {
    "posts"?: { create?: Omit<GassmaGassmaPostUse, "categoryId"> | Omit<GassmaGassmaPostUse, "categoryId">[]; createMany?: { data: Omit<GassmaGassmaPostUse, "categoryId">[] }; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: Omit<GassmaGassmaPostUse, "categoryId"> } | { where: GassmaGassmaPostWhereUse; create: Omit<GassmaGassmaPostUse, "categoryId"> }[] };
    "children"?: { create?: Omit<GassmaGassmaCategoryUse, "parentId"> | Omit<GassmaGassmaCategoryUse, "parentId">[]; createMany?: { data: Omit<GassmaGassmaCategoryUse, "parentId">[] }; connect?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: Omit<GassmaGassmaCategoryUse, "parentId"> } | { where: GassmaGassmaCategoryWhereUse; create: Omit<GassmaGassmaCategoryUse, "parentId"> }[] };
  };
  update: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | (K extends "id" | "parentId" ? Gassma.NumberOperation : never) }> & {
    "posts"?: { create?: Omit<GassmaGassmaPostUse, "categoryId"> | Omit<GassmaGassmaPostUse, "categoryId">[]; createMany?: { data: Omit<GassmaGassmaPostUse, "categoryId">[] }; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: Omit<GassmaGassmaPostUse, "categoryId"> } | { where: GassmaGassmaPostWhereUse; create: Omit<GassmaGassmaPostUse, "categoryId"> }[]; update?: { where: GassmaGassmaPostWhereUse; data: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) }> } | { where: GassmaGassmaPostWhereUse; data: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) }> }[]; delete?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; deleteMany?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; disconnect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
    "parent"?: { create?: GassmaGassmaCategoryUse; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: GassmaGassmaCategoryUse }; update?: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | (K extends "id" | "parentId" ? Gassma.NumberOperation : never) }>; delete?: true; disconnect?: true };
    "children"?: { create?: Omit<GassmaGassmaCategoryUse, "parentId"> | Omit<GassmaGassmaCategoryUse, "parentId">[]; createMany?: { data: Omit<GassmaGassmaCategoryUse, "parentId">[] }; connect?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: Omit<GassmaGassmaCategoryUse, "parentId"> } | { where: GassmaGassmaCategoryWhereUse; create: Omit<GassmaGassmaCategoryUse, "parentId"> }[]; update?: { where: GassmaGassmaCategoryWhereUse; data: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | (K extends "id" | "parentId" ? Gassma.NumberOperation : never) }> } | { where: GassmaGassmaCategoryWhereUse; data: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | (K extends "id" | "parentId" ? Gassma.NumberOperation : never) }> }[]; delete?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; deleteMany?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; disconnect?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; set?: GassmaGassmaCategoryWhereUse[] };
  };
  include?: GassmaGassmaCategoryInclude;
} & ({ select?: GassmaGassmaCategorySelect; omit?: never } | { select?: never; omit?: GassmaGassmaCategoryOmit });

export type GassmaGassmaTagUpsertSingleData = {
  where: GassmaGassmaTagWhereUse;
  create: GassmaGassmaTagUse & {
    "posts"?: { create?: GassmaGassmaPostUse | GassmaGassmaPostUse[]; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } | { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse }[] };
  };
  update: Partial<{ [K in keyof GassmaGassmaTagUse]: GassmaGassmaTagUse[K] | (K extends "id" ? Gassma.NumberOperation : never) }> & {
    "posts"?: { create?: GassmaGassmaPostUse | GassmaGassmaPostUse[]; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse } | { where: GassmaGassmaPostWhereUse; create: GassmaGassmaPostUse }[]; disconnect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
  };
  include?: GassmaGassmaTagInclude;
} & ({ select?: GassmaGassmaTagSelect; omit?: never } | { select?: never; omit?: GassmaGassmaTagOmit });

export type GassmaGassmaProductUpsertSingleData = {
  where: GassmaGassmaProductWhereUse;
  create: GassmaGassmaProductUse & {
    "orderItems"?: { create?: Omit<GassmaGassmaOrderItemUse, "productId"> | Omit<GassmaGassmaOrderItemUse, "productId">[]; createMany?: { data: Omit<GassmaGassmaOrderItemUse, "productId">[] }; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: Omit<GassmaGassmaOrderItemUse, "productId"> } | { where: GassmaGassmaOrderItemWhereUse; create: Omit<GassmaGassmaOrderItemUse, "productId"> }[] };
  };
  update: Partial<{ [K in keyof GassmaGassmaProductUse]: GassmaGassmaProductUse[K] | (K extends "id" | "price" | "stock" ? Gassma.NumberOperation : never) }> & {
    "orderItems"?: { create?: Omit<GassmaGassmaOrderItemUse, "productId"> | Omit<GassmaGassmaOrderItemUse, "productId">[]; createMany?: { data: Omit<GassmaGassmaOrderItemUse, "productId">[] }; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: Omit<GassmaGassmaOrderItemUse, "productId"> } | { where: GassmaGassmaOrderItemWhereUse; create: Omit<GassmaGassmaOrderItemUse, "productId"> }[]; update?: { where: GassmaGassmaOrderItemWhereUse; data: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | (K extends "id" | "orderId" | "productId" | "quantity" | "unitPrice" ? Gassma.NumberOperation : never) }> } | { where: GassmaGassmaOrderItemWhereUse; data: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | (K extends "id" | "orderId" | "productId" | "quantity" | "unitPrice" ? Gassma.NumberOperation : never) }> }[]; delete?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; deleteMany?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; disconnect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; set?: GassmaGassmaOrderItemWhereUse[] };
  };
  include?: GassmaGassmaProductInclude;
} & ({ select?: GassmaGassmaProductSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProductOmit });

export type GassmaGassmaOrderUpsertSingleData = {
  where: GassmaGassmaOrderWhereUse;
  create: Omit<GassmaGassmaOrderUse, "userId"> & (Pick<GassmaGassmaOrderUse, "userId"> | { "user": { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse } } }) & {
    "items"?: { create?: Omit<GassmaGassmaOrderItemUse, "orderId"> | Omit<GassmaGassmaOrderItemUse, "orderId">[]; createMany?: { data: Omit<GassmaGassmaOrderItemUse, "orderId">[] }; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: Omit<GassmaGassmaOrderItemUse, "orderId"> } | { where: GassmaGassmaOrderItemWhereUse; create: Omit<GassmaGassmaOrderItemUse, "orderId"> }[] };
  };
  update: Partial<{ [K in keyof GassmaGassmaOrderUse]: GassmaGassmaOrderUse[K] | (K extends "id" | "userId" | "totalAmount" | "quantity" ? Gassma.NumberOperation : never) }> & {
    "user"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse }; update?: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | (K extends "id" | "age" ? Gassma.NumberOperation : never) }>; delete?: true; disconnect?: true };
    "items"?: { create?: Omit<GassmaGassmaOrderItemUse, "orderId"> | Omit<GassmaGassmaOrderItemUse, "orderId">[]; createMany?: { data: Omit<GassmaGassmaOrderItemUse, "orderId">[] }; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: Omit<GassmaGassmaOrderItemUse, "orderId"> } | { where: GassmaGassmaOrderItemWhereUse; create: Omit<GassmaGassmaOrderItemUse, "orderId"> }[]; update?: { where: GassmaGassmaOrderItemWhereUse; data: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | (K extends "id" | "orderId" | "productId" | "quantity" | "unitPrice" ? Gassma.NumberOperation : never) }> } | { where: GassmaGassmaOrderItemWhereUse; data: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | (K extends "id" | "orderId" | "productId" | "quantity" | "unitPrice" ? Gassma.NumberOperation : never) }> }[]; delete?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; deleteMany?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; disconnect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; set?: GassmaGassmaOrderItemWhereUse[] };
  };
  include?: GassmaGassmaOrderInclude;
} & ({ select?: GassmaGassmaOrderSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderOmit });

export type GassmaGassmaOrderItemUpsertSingleData = {
  where: GassmaGassmaOrderItemWhereUse;
  create: Omit<GassmaGassmaOrderItemUse, "orderId" | "productId"> & (Pick<GassmaGassmaOrderItemUse, "orderId"> | { "order": { create?: GassmaGassmaOrderUse; connect?: GassmaGassmaOrderWhereUse; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: GassmaGassmaOrderUse } } }) & (Pick<GassmaGassmaOrderItemUse, "productId"> | { "product": { create?: GassmaGassmaProductUse; connect?: GassmaGassmaProductWhereUse; connectOrCreate?: { where: GassmaGassmaProductWhereUse; create: GassmaGassmaProductUse } } });
  update: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | (K extends "id" | "orderId" | "productId" | "quantity" | "unitPrice" ? Gassma.NumberOperation : never) }> & {
    "order"?: { create?: GassmaGassmaOrderUse; connect?: GassmaGassmaOrderWhereUse; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: GassmaGassmaOrderUse }; update?: Partial<{ [K in keyof GassmaGassmaOrderUse]: GassmaGassmaOrderUse[K] | (K extends "id" | "userId" | "totalAmount" | "quantity" ? Gassma.NumberOperation : never) }>; delete?: true; disconnect?: true };
    "product"?: { create?: GassmaGassmaProductUse; connect?: GassmaGassmaProductWhereUse; connectOrCreate?: { where: GassmaGassmaProductWhereUse; create: GassmaGassmaProductUse }; update?: Partial<{ [K in keyof GassmaGassmaProductUse]: GassmaGassmaProductUse[K] | (K extends "id" | "price" | "stock" ? Gassma.NumberOperation : never) }>; delete?: true; disconnect?: true };
  };
  include?: GassmaGassmaOrderItemInclude;
} & ({ select?: GassmaGassmaOrderItemSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderItemOmit });

export type GassmaGassmaFormulaCellUpsertSingleData = {
  where: GassmaGassmaFormulaCellWhereUse;
  create: GassmaGassmaFormulaCellUse;
  update: Partial<{ [K in keyof GassmaGassmaFormulaCellUse]: GassmaGassmaFormulaCellUse[K] | (K extends "id" | "amount" | "total" ? Gassma.NumberOperation : never) }>;
  include?: GassmaGassmaFormulaCellInclude;
} & ({ select?: GassmaGassmaFormulaCellSelect; omit?: never } | { select?: never; omit?: GassmaGassmaFormulaCellOmit });

export type GassmaGassmaNotificationUpsertSingleData = {
  where: GassmaGassmaNotificationWhereUse;
  create: GassmaGassmaNotificationUse;
  update: Partial<{ [K in keyof GassmaGassmaNotificationUse]: GassmaGassmaNotificationUse[K] | (K extends "id" | "userId" ? Gassma.NumberOperation : never) }>;
  include?: GassmaGassmaNotificationInclude;
} & ({ select?: GassmaGassmaNotificationSelect; omit?: never } | { select?: never; omit?: GassmaGassmaNotificationOmit });

export type GassmaGassmaOffsetNoteUpsertSingleData = {
  where: GassmaGassmaOffsetNoteWhereUse;
  create: GassmaGassmaOffsetNoteUse;
  update: Partial<{ [K in keyof GassmaGassmaOffsetNoteUse]: GassmaGassmaOffsetNoteUse[K] | (K extends "id" | "value" ? Gassma.NumberOperation : never) }>;
  include?: GassmaGassmaOffsetNoteInclude;
} & ({ select?: GassmaGassmaOffsetNoteSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOffsetNoteOmit });

export type GassmaGassmaUserUpsertSingleData = {
  where: GassmaGassmaUserWhereUse;
  create: GassmaGassmaUserUse & {
    "posts"?: { create?: Omit<GassmaGassmaPostUse, "authorId"> | Omit<GassmaGassmaPostUse, "authorId">[]; createMany?: { data: Omit<GassmaGassmaPostUse, "authorId">[] }; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: Omit<GassmaGassmaPostUse, "authorId"> } | { where: GassmaGassmaPostWhereUse; create: Omit<GassmaGassmaPostUse, "authorId"> }[] };
    "comments"?: { create?: Omit<GassmaGassmaCommentUse, "authorId"> | Omit<GassmaGassmaCommentUse, "authorId">[]; createMany?: { data: Omit<GassmaGassmaCommentUse, "authorId">[] }; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: Omit<GassmaGassmaCommentUse, "authorId"> } | { where: GassmaGassmaCommentWhereUse; create: Omit<GassmaGassmaCommentUse, "authorId"> }[] };
    "orders"?: { create?: Omit<GassmaGassmaOrderUse, "userId"> | Omit<GassmaGassmaOrderUse, "userId">[]; createMany?: { data: Omit<GassmaGassmaOrderUse, "userId">[] }; connect?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: Omit<GassmaGassmaOrderUse, "userId"> } | { where: GassmaGassmaOrderWhereUse; create: Omit<GassmaGassmaOrderUse, "userId"> }[] };
    "profile"?: { create?: Omit<GassmaGassmaProfileUse, "userId">; connect?: GassmaGassmaProfileWhereUse; connectOrCreate?: { where: GassmaGassmaProfileWhereUse; create: Omit<GassmaGassmaProfileUse, "userId"> } };
  };
  update: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | (K extends "id" | "age" ? Gassma.NumberOperation : never) }> & {
    "posts"?: { create?: Omit<GassmaGassmaPostUse, "authorId"> | Omit<GassmaGassmaPostUse, "authorId">[]; createMany?: { data: Omit<GassmaGassmaPostUse, "authorId">[] }; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: Omit<GassmaGassmaPostUse, "authorId"> } | { where: GassmaGassmaPostWhereUse; create: Omit<GassmaGassmaPostUse, "authorId"> }[]; update?: { where: GassmaGassmaPostWhereUse; data: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) }> } | { where: GassmaGassmaPostWhereUse; data: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) }> }[]; delete?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; deleteMany?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; disconnect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
    "comments"?: { create?: Omit<GassmaGassmaCommentUse, "authorId"> | Omit<GassmaGassmaCommentUse, "authorId">[]; createMany?: { data: Omit<GassmaGassmaCommentUse, "authorId">[] }; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: Omit<GassmaGassmaCommentUse, "authorId"> } | { where: GassmaGassmaCommentWhereUse; create: Omit<GassmaGassmaCommentUse, "authorId"> }[]; update?: { where: GassmaGassmaCommentWhereUse; data: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | (K extends "id" | "authorId" | "postId" ? Gassma.NumberOperation : never) }> } | { where: GassmaGassmaCommentWhereUse; data: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | (K extends "id" | "authorId" | "postId" ? Gassma.NumberOperation : never) }> }[]; delete?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; deleteMany?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; disconnect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; set?: GassmaGassmaCommentWhereUse[] };
    "orders"?: { create?: Omit<GassmaGassmaOrderUse, "userId"> | Omit<GassmaGassmaOrderUse, "userId">[]; createMany?: { data: Omit<GassmaGassmaOrderUse, "userId">[] }; connect?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: Omit<GassmaGassmaOrderUse, "userId"> } | { where: GassmaGassmaOrderWhereUse; create: Omit<GassmaGassmaOrderUse, "userId"> }[]; update?: { where: GassmaGassmaOrderWhereUse; data: Partial<{ [K in keyof GassmaGassmaOrderUse]: GassmaGassmaOrderUse[K] | (K extends "id" | "userId" | "totalAmount" | "quantity" ? Gassma.NumberOperation : never) }> } | { where: GassmaGassmaOrderWhereUse; data: Partial<{ [K in keyof GassmaGassmaOrderUse]: GassmaGassmaOrderUse[K] | (K extends "id" | "userId" | "totalAmount" | "quantity" ? Gassma.NumberOperation : never) }> }[]; delete?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; deleteMany?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; disconnect?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; set?: GassmaGassmaOrderWhereUse[] };
    "profile"?: { create?: Omit<GassmaGassmaProfileUse, "userId">; connect?: GassmaGassmaProfileWhereUse; connectOrCreate?: { where: GassmaGassmaProfileWhereUse; create: Omit<GassmaGassmaProfileUse, "userId"> }; update?: Partial<{ [K in keyof GassmaGassmaProfileUse]: GassmaGassmaProfileUse[K] | (K extends "id" | "userId" ? Gassma.NumberOperation : never) }>; delete?: true; disconnect?: true };
  };
  include?: GassmaGassmaUserInclude;
} & ({ select?: GassmaGassmaUserSelect; omit?: never } | { select?: never; omit?: GassmaGassmaUserOmit });

export type GassmaGassmaProfileUpsertSingleData = {
  where: GassmaGassmaProfileWhereUse;
  create: Omit<GassmaGassmaProfileUse, "userId"> & (Pick<GassmaGassmaProfileUse, "userId"> | { "user": { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse } } });
  update: Partial<{ [K in keyof GassmaGassmaProfileUse]: GassmaGassmaProfileUse[K] | (K extends "id" | "userId" ? Gassma.NumberOperation : never) }> & {
    "user"?: { create?: GassmaGassmaUserUse; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: GassmaGassmaUserUse }; update?: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | (K extends "id" | "age" ? Gassma.NumberOperation : never) }>; delete?: true; disconnect?: true };
  };
  include?: GassmaGassmaProfileInclude;
} & ({ select?: GassmaGassmaProfileSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProfileOmit });

export type GassmaGassmaPostDeleteData = {
  where?: GassmaGassmaPostWhereUse;
  limit?: number;
};

export type GassmaGassmaCommentDeleteData = {
  where?: GassmaGassmaCommentWhereUse;
  limit?: number;
};

export type GassmaGassmaCategoryDeleteData = {
  where?: GassmaGassmaCategoryWhereUse;
  limit?: number;
};

export type GassmaGassmaTagDeleteData = {
  where?: GassmaGassmaTagWhereUse;
  limit?: number;
};

export type GassmaGassmaProductDeleteData = {
  where?: GassmaGassmaProductWhereUse;
  limit?: number;
};

export type GassmaGassmaOrderDeleteData = {
  where?: GassmaGassmaOrderWhereUse;
  limit?: number;
};

export type GassmaGassmaOrderItemDeleteData = {
  where?: GassmaGassmaOrderItemWhereUse;
  limit?: number;
};

export type GassmaGassmaFormulaCellDeleteData = {
  where?: GassmaGassmaFormulaCellWhereUse;
  limit?: number;
};

export type GassmaGassmaNotificationDeleteData = {
  where?: GassmaGassmaNotificationWhereUse;
  limit?: number;
};

export type GassmaGassmaOffsetNoteDeleteData = {
  where?: GassmaGassmaOffsetNoteWhereUse;
  limit?: number;
};

export type GassmaGassmaUserDeleteData = {
  where?: GassmaGassmaUserWhereUse;
  limit?: number;
};

export type GassmaGassmaProfileDeleteData = {
  where?: GassmaGassmaProfileWhereUse;
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

export type GassmaGassmaFormulaCellDeleteSingleData = {
  where: GassmaGassmaFormulaCellWhereUse;
  include?: GassmaGassmaFormulaCellInclude;
} & ({ select?: GassmaGassmaFormulaCellSelect; omit?: never } | { select?: never; omit?: GassmaGassmaFormulaCellOmit });

export type GassmaGassmaNotificationDeleteSingleData = {
  where: GassmaGassmaNotificationWhereUse;
  include?: GassmaGassmaNotificationInclude;
} & ({ select?: GassmaGassmaNotificationSelect; omit?: never } | { select?: never; omit?: GassmaGassmaNotificationOmit });

export type GassmaGassmaOffsetNoteDeleteSingleData = {
  where: GassmaGassmaOffsetNoteWhereUse;
  include?: GassmaGassmaOffsetNoteInclude;
} & ({ select?: GassmaGassmaOffsetNoteSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOffsetNoteOmit });

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
  orderBy?: GassmaGassmaPostOrderBy | GassmaGassmaPostOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaPostUse>;
  _avg?: GassmaGassmaPostNumberSelect;
  _count?: GassmaGassmaPostSelect;
  _max?: GassmaGassmaPostSelect;
  _min?: GassmaGassmaPostSelect;
  _sum?: GassmaGassmaPostNumberSelect;
};

export type GassmaGassmaCommentAggregateData = {
  where?: GassmaGassmaCommentWhereUse;
  orderBy?: GassmaGassmaCommentOrderBy | GassmaGassmaCommentOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaCommentUse>;
  _avg?: GassmaGassmaCommentNumberSelect;
  _count?: GassmaGassmaCommentSelect;
  _max?: GassmaGassmaCommentSelect;
  _min?: GassmaGassmaCommentSelect;
  _sum?: GassmaGassmaCommentNumberSelect;
};

export type GassmaGassmaCategoryAggregateData = {
  where?: GassmaGassmaCategoryWhereUse;
  orderBy?: GassmaGassmaCategoryOrderBy | GassmaGassmaCategoryOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaCategoryUse>;
  _avg?: GassmaGassmaCategoryNumberSelect;
  _count?: GassmaGassmaCategorySelect;
  _max?: GassmaGassmaCategorySelect;
  _min?: GassmaGassmaCategorySelect;
  _sum?: GassmaGassmaCategoryNumberSelect;
};

export type GassmaGassmaTagAggregateData = {
  where?: GassmaGassmaTagWhereUse;
  orderBy?: GassmaGassmaTagOrderBy | GassmaGassmaTagOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaTagUse>;
  _avg?: GassmaGassmaTagNumberSelect;
  _count?: GassmaGassmaTagSelect;
  _max?: GassmaGassmaTagSelect;
  _min?: GassmaGassmaTagSelect;
  _sum?: GassmaGassmaTagNumberSelect;
};

export type GassmaGassmaProductAggregateData = {
  where?: GassmaGassmaProductWhereUse;
  orderBy?: GassmaGassmaProductOrderBy | GassmaGassmaProductOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaProductUse>;
  _avg?: GassmaGassmaProductNumberSelect;
  _count?: GassmaGassmaProductSelect;
  _max?: GassmaGassmaProductSelect;
  _min?: GassmaGassmaProductSelect;
  _sum?: GassmaGassmaProductNumberSelect;
};

export type GassmaGassmaOrderAggregateData = {
  where?: GassmaGassmaOrderWhereUse;
  orderBy?: GassmaGassmaOrderOrderBy | GassmaGassmaOrderOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaOrderUse>;
  _avg?: GassmaGassmaOrderNumberSelect;
  _count?: GassmaGassmaOrderSelect;
  _max?: GassmaGassmaOrderSelect;
  _min?: GassmaGassmaOrderSelect;
  _sum?: GassmaGassmaOrderNumberSelect;
};

export type GassmaGassmaOrderItemAggregateData = {
  where?: GassmaGassmaOrderItemWhereUse;
  orderBy?: GassmaGassmaOrderItemOrderBy | GassmaGassmaOrderItemOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaOrderItemUse>;
  _avg?: GassmaGassmaOrderItemNumberSelect;
  _count?: GassmaGassmaOrderItemSelect;
  _max?: GassmaGassmaOrderItemSelect;
  _min?: GassmaGassmaOrderItemSelect;
  _sum?: GassmaGassmaOrderItemNumberSelect;
};

export type GassmaGassmaFormulaCellAggregateData = {
  where?: GassmaGassmaFormulaCellWhereUse;
  orderBy?: GassmaGassmaFormulaCellOrderBy | GassmaGassmaFormulaCellOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaFormulaCellUse>;
  _avg?: GassmaGassmaFormulaCellNumberSelect;
  _count?: GassmaGassmaFormulaCellSelect;
  _max?: GassmaGassmaFormulaCellSelect;
  _min?: GassmaGassmaFormulaCellSelect;
  _sum?: GassmaGassmaFormulaCellNumberSelect;
};

export type GassmaGassmaNotificationAggregateData = {
  where?: GassmaGassmaNotificationWhereUse;
  orderBy?: GassmaGassmaNotificationOrderBy | GassmaGassmaNotificationOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaNotificationUse>;
  _avg?: GassmaGassmaNotificationNumberSelect;
  _count?: GassmaGassmaNotificationSelect;
  _max?: GassmaGassmaNotificationSelect;
  _min?: GassmaGassmaNotificationSelect;
  _sum?: GassmaGassmaNotificationNumberSelect;
};

export type GassmaGassmaOffsetNoteAggregateData = {
  where?: GassmaGassmaOffsetNoteWhereUse;
  orderBy?: GassmaGassmaOffsetNoteOrderBy | GassmaGassmaOffsetNoteOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaOffsetNoteUse>;
  _avg?: GassmaGassmaOffsetNoteNumberSelect;
  _count?: GassmaGassmaOffsetNoteSelect;
  _max?: GassmaGassmaOffsetNoteSelect;
  _min?: GassmaGassmaOffsetNoteSelect;
  _sum?: GassmaGassmaOffsetNoteNumberSelect;
};

export type GassmaGassmaUserAggregateData = {
  where?: GassmaGassmaUserWhereUse;
  orderBy?: GassmaGassmaUserOrderBy | GassmaGassmaUserOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaUserUse>;
  _avg?: GassmaGassmaUserNumberSelect;
  _count?: GassmaGassmaUserSelect;
  _max?: GassmaGassmaUserSelect;
  _min?: GassmaGassmaUserSelect;
  _sum?: GassmaGassmaUserNumberSelect;
};

export type GassmaGassmaProfileAggregateData = {
  where?: GassmaGassmaProfileWhereUse;
  orderBy?: GassmaGassmaProfileOrderBy | GassmaGassmaProfileOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaProfileUse>;
  _avg?: GassmaGassmaProfileNumberSelect;
  _count?: GassmaGassmaProfileSelect;
  _max?: GassmaGassmaProfileSelect;
  _min?: GassmaGassmaProfileSelect;
  _sum?: GassmaGassmaProfileNumberSelect;
};

export type GassmaGassmaPostGroupByData = Omit<GassmaGassmaPostAggregateData, "cursor"> & {
  by: "id" | "title" | "content" | "published" | "viewCount" | "rating" | "authorId" | "categoryId" | "createdAt" | "updatedAt" | ("id" | "title" | "content" | "published" | "viewCount" | "rating" | "authorId" | "categoryId" | "createdAt" | "updatedAt")[];
  having?: GassmaGassmaPostHavingUse;
};

export type GassmaGassmaCommentGroupByData = Omit<GassmaGassmaCommentAggregateData, "cursor"> & {
  by: "id" | "text" | "authorId" | "postId" | "createdAt" | ("id" | "text" | "authorId" | "postId" | "createdAt")[];
  having?: GassmaGassmaCommentHavingUse;
};

export type GassmaGassmaCategoryGroupByData = Omit<GassmaGassmaCategoryAggregateData, "cursor"> & {
  by: "id" | "name" | "parentId" | ("id" | "name" | "parentId")[];
  having?: GassmaGassmaCategoryHavingUse;
};

export type GassmaGassmaTagGroupByData = Omit<GassmaGassmaTagAggregateData, "cursor"> & {
  by: "id" | "name" | ("id" | "name")[];
  having?: GassmaGassmaTagHavingUse;
};

export type GassmaGassmaProductGroupByData = Omit<GassmaGassmaProductAggregateData, "cursor"> & {
  by: "id" | "name" | "price" | "stock" | "status" | "createdAt" | "updatedAt" | ("id" | "name" | "price" | "stock" | "status" | "createdAt" | "updatedAt")[];
  having?: GassmaGassmaProductHavingUse;
};

export type GassmaGassmaOrderGroupByData = Omit<GassmaGassmaOrderAggregateData, "cursor"> & {
  by: "id" | "userId" | "totalAmount" | "quantity" | "status" | "createdAt" | ("id" | "userId" | "totalAmount" | "quantity" | "status" | "createdAt")[];
  having?: GassmaGassmaOrderHavingUse;
};

export type GassmaGassmaOrderItemGroupByData = Omit<GassmaGassmaOrderItemAggregateData, "cursor"> & {
  by: "id" | "orderId" | "productId" | "quantity" | "unitPrice" | ("id" | "orderId" | "productId" | "quantity" | "unitPrice")[];
  having?: GassmaGassmaOrderItemHavingUse;
};

export type GassmaGassmaFormulaCellGroupByData = Omit<GassmaGassmaFormulaCellAggregateData, "cursor"> & {
  by: "id" | "label" | "amount" | "total" | ("id" | "label" | "amount" | "total")[];
  having?: GassmaGassmaFormulaCellHavingUse;
};

export type GassmaGassmaNotificationGroupByData = Omit<GassmaGassmaNotificationAggregateData, "cursor"> & {
  by: "id" | "userId" | "message" | "isRead" | ("id" | "userId" | "message" | "isRead")[];
  having?: GassmaGassmaNotificationHavingUse;
};

export type GassmaGassmaOffsetNoteGroupByData = Omit<GassmaGassmaOffsetNoteAggregateData, "cursor"> & {
  by: "id" | "title" | "value" | ("id" | "title" | "value")[];
  having?: GassmaGassmaOffsetNoteHavingUse;
};

export type GassmaGassmaUserGroupByData = Omit<GassmaGassmaUserAggregateData, "cursor"> & {
  by: "id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt" | ("id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt")[];
  having?: GassmaGassmaUserHavingUse;
};

export type GassmaGassmaProfileGroupByData = Omit<GassmaGassmaProfileAggregateData, "cursor"> & {
  by: "id" | "bio" | "website" | "userId" | ("id" | "bio" | "website" | "userId")[];
  having?: GassmaGassmaProfileHavingUse;
};

export type GassmaGassmaPostInclude = {
  "author"?: true | { select?: GassmaGassmaUserFindSelect; omit?: GassmaGassmaUserOmit; where?: GassmaGassmaUserWhereUse; orderBy?: GassmaGassmaUserOrderBy | GassmaGassmaUserOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaUserInclude; _count?: GassmaGassmaUserCountValue };
  "category"?: true | { select?: GassmaGassmaCategoryFindSelect; omit?: GassmaGassmaCategoryOmit; where?: GassmaGassmaCategoryWhereUse; orderBy?: GassmaGassmaCategoryOrderBy | GassmaGassmaCategoryOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaCategoryInclude; _count?: GassmaGassmaCategoryCountValue };
  "comments"?: true | { select?: GassmaGassmaCommentFindSelect; omit?: GassmaGassmaCommentOmit; where?: GassmaGassmaCommentWhereUse; orderBy?: GassmaGassmaCommentOrderBy | GassmaGassmaCommentOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaCommentInclude; _count?: GassmaGassmaCommentCountValue };
  "tags"?: true | { select?: GassmaGassmaTagFindSelect; omit?: GassmaGassmaTagOmit; where?: GassmaGassmaTagWhereUse; orderBy?: GassmaGassmaTagOrderBy | GassmaGassmaTagOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaTagInclude; _count?: GassmaGassmaTagCountValue };
  "_count"?: GassmaGassmaPostCountValue;
};

export type GassmaGassmaCommentInclude = {
  "author"?: true | { select?: GassmaGassmaUserFindSelect; omit?: GassmaGassmaUserOmit; where?: GassmaGassmaUserWhereUse; orderBy?: GassmaGassmaUserOrderBy | GassmaGassmaUserOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaUserInclude; _count?: GassmaGassmaUserCountValue };
  "post"?: true | { select?: GassmaGassmaPostFindSelect; omit?: GassmaGassmaPostOmit; where?: GassmaGassmaPostWhereUse; orderBy?: GassmaGassmaPostOrderBy | GassmaGassmaPostOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaPostInclude; _count?: GassmaGassmaPostCountValue };
  "_count"?: GassmaGassmaCommentCountValue;
};

export type GassmaGassmaCategoryInclude = {
  "posts"?: true | { select?: GassmaGassmaPostFindSelect; omit?: GassmaGassmaPostOmit; where?: GassmaGassmaPostWhereUse; orderBy?: GassmaGassmaPostOrderBy | GassmaGassmaPostOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaPostInclude; _count?: GassmaGassmaPostCountValue };
  "parent"?: true | { select?: GassmaGassmaCategoryFindSelect; omit?: GassmaGassmaCategoryOmit; where?: GassmaGassmaCategoryWhereUse; orderBy?: GassmaGassmaCategoryOrderBy | GassmaGassmaCategoryOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaCategoryInclude; _count?: GassmaGassmaCategoryCountValue };
  "children"?: true | { select?: GassmaGassmaCategoryFindSelect; omit?: GassmaGassmaCategoryOmit; where?: GassmaGassmaCategoryWhereUse; orderBy?: GassmaGassmaCategoryOrderBy | GassmaGassmaCategoryOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaCategoryInclude; _count?: GassmaGassmaCategoryCountValue };
  "_count"?: GassmaGassmaCategoryCountValue;
};

export type GassmaGassmaTagInclude = {
  "posts"?: true | { select?: GassmaGassmaPostFindSelect; omit?: GassmaGassmaPostOmit; where?: GassmaGassmaPostWhereUse; orderBy?: GassmaGassmaPostOrderBy | GassmaGassmaPostOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaPostInclude; _count?: GassmaGassmaPostCountValue };
  "_count"?: GassmaGassmaTagCountValue;
};

export type GassmaGassmaProductInclude = {
  "orderItems"?: true | { select?: GassmaGassmaOrderItemFindSelect; omit?: GassmaGassmaOrderItemOmit; where?: GassmaGassmaOrderItemWhereUse; orderBy?: GassmaGassmaOrderItemOrderBy | GassmaGassmaOrderItemOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaOrderItemInclude; _count?: GassmaGassmaOrderItemCountValue };
  "_count"?: GassmaGassmaProductCountValue;
};

export type GassmaGassmaOrderInclude = {
  "user"?: true | { select?: GassmaGassmaUserFindSelect; omit?: GassmaGassmaUserOmit; where?: GassmaGassmaUserWhereUse; orderBy?: GassmaGassmaUserOrderBy | GassmaGassmaUserOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaUserInclude; _count?: GassmaGassmaUserCountValue };
  "items"?: true | { select?: GassmaGassmaOrderItemFindSelect; omit?: GassmaGassmaOrderItemOmit; where?: GassmaGassmaOrderItemWhereUse; orderBy?: GassmaGassmaOrderItemOrderBy | GassmaGassmaOrderItemOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaOrderItemInclude; _count?: GassmaGassmaOrderItemCountValue };
  "_count"?: GassmaGassmaOrderCountValue;
};

export type GassmaGassmaOrderItemInclude = {
  "order"?: true | { select?: GassmaGassmaOrderFindSelect; omit?: GassmaGassmaOrderOmit; where?: GassmaGassmaOrderWhereUse; orderBy?: GassmaGassmaOrderOrderBy | GassmaGassmaOrderOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaOrderInclude; _count?: GassmaGassmaOrderCountValue };
  "product"?: true | { select?: GassmaGassmaProductFindSelect; omit?: GassmaGassmaProductOmit; where?: GassmaGassmaProductWhereUse; orderBy?: GassmaGassmaProductOrderBy | GassmaGassmaProductOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaProductInclude; _count?: GassmaGassmaProductCountValue };
  "_count"?: GassmaGassmaOrderItemCountValue;
};

export type GassmaGassmaFormulaCellInclude = {};

export type GassmaGassmaNotificationInclude = {};

export type GassmaGassmaOffsetNoteInclude = {};

export type GassmaGassmaUserInclude = {
  "posts"?: true | { select?: GassmaGassmaPostFindSelect; omit?: GassmaGassmaPostOmit; where?: GassmaGassmaPostWhereUse; orderBy?: GassmaGassmaPostOrderBy | GassmaGassmaPostOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaPostInclude; _count?: GassmaGassmaPostCountValue };
  "comments"?: true | { select?: GassmaGassmaCommentFindSelect; omit?: GassmaGassmaCommentOmit; where?: GassmaGassmaCommentWhereUse; orderBy?: GassmaGassmaCommentOrderBy | GassmaGassmaCommentOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaCommentInclude; _count?: GassmaGassmaCommentCountValue };
  "orders"?: true | { select?: GassmaGassmaOrderFindSelect; omit?: GassmaGassmaOrderOmit; where?: GassmaGassmaOrderWhereUse; orderBy?: GassmaGassmaOrderOrderBy | GassmaGassmaOrderOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaOrderInclude; _count?: GassmaGassmaOrderCountValue };
  "profile"?: true | { select?: GassmaGassmaProfileFindSelect; omit?: GassmaGassmaProfileOmit; where?: GassmaGassmaProfileWhereUse; orderBy?: GassmaGassmaProfileOrderBy | GassmaGassmaProfileOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaProfileInclude; _count?: GassmaGassmaProfileCountValue };
  "_count"?: GassmaGassmaUserCountValue;
};

export type GassmaGassmaProfileInclude = {
  "user"?: true | { select?: GassmaGassmaUserFindSelect; omit?: GassmaGassmaUserOmit; where?: GassmaGassmaUserWhereUse; orderBy?: GassmaGassmaUserOrderBy | GassmaGassmaUserOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaUserInclude; _count?: GassmaGassmaUserCountValue };
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

export type GassmaGassmaFormulaCellCountValue = true;

export type GassmaGassmaNotificationCountValue = true;

export type GassmaGassmaOffsetNoteCountValue = true;

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

export type GassmaGassmaFormulaCellOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "label"?: "asc" | "desc" | Gassma.SortOrderInput;
  "amount"?: "asc" | "desc" | Gassma.SortOrderInput;
  "total"?: "asc" | "desc" | Gassma.SortOrderInput;
};

export type GassmaGassmaNotificationOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "userId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "message"?: "asc" | "desc" | Gassma.SortOrderInput;
  "isRead"?: "asc" | "desc" | Gassma.SortOrderInput;
};

export type GassmaGassmaOffsetNoteOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "title"?: "asc" | "desc" | Gassma.SortOrderInput;
  "value"?: "asc" | "desc" | Gassma.SortOrderInput;
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

export type GassmaGassmaPostNumberSelect = {
  "id"?: true;
  "content"?: true;
  "viewCount"?: true;
  "rating"?: true;
  "authorId"?: true;
  "categoryId"?: true;
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
  "author"?: true | { select?: GassmaGassmaUserFindSelect; omit?: GassmaGassmaUserOmit; where?: GassmaGassmaUserWhereUse; orderBy?: GassmaGassmaUserOrderBy | GassmaGassmaUserOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaUserInclude; _count?: GassmaGassmaUserCountValue };
  "category"?: true | { select?: GassmaGassmaCategoryFindSelect; omit?: GassmaGassmaCategoryOmit; where?: GassmaGassmaCategoryWhereUse; orderBy?: GassmaGassmaCategoryOrderBy | GassmaGassmaCategoryOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaCategoryInclude; _count?: GassmaGassmaCategoryCountValue };
  "comments"?: true | { select?: GassmaGassmaCommentFindSelect; omit?: GassmaGassmaCommentOmit; where?: GassmaGassmaCommentWhereUse; orderBy?: GassmaGassmaCommentOrderBy | GassmaGassmaCommentOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaCommentInclude; _count?: GassmaGassmaCommentCountValue };
  "tags"?: true | { select?: GassmaGassmaTagFindSelect; omit?: GassmaGassmaTagOmit; where?: GassmaGassmaTagWhereUse; orderBy?: GassmaGassmaTagOrderBy | GassmaGassmaTagOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaTagInclude; _count?: GassmaGassmaTagCountValue };
  "_count"?: GassmaGassmaPostCountValue;
};

export type GassmaGassmaCommentSelect = {
  "id"?: true;
  "text"?: true;
  "authorId"?: true;
  "postId"?: true;
  "createdAt"?: true;
};

export type GassmaGassmaCommentNumberSelect = {
  "id"?: true;
  "authorId"?: true;
  "postId"?: true;
};

export type GassmaGassmaCommentFindSelect = {
  "id"?: true;
  "text"?: true;
  "authorId"?: true;
  "postId"?: true;
  "createdAt"?: true;
  "author"?: true | { select?: GassmaGassmaUserFindSelect; omit?: GassmaGassmaUserOmit; where?: GassmaGassmaUserWhereUse; orderBy?: GassmaGassmaUserOrderBy | GassmaGassmaUserOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaUserInclude; _count?: GassmaGassmaUserCountValue };
  "post"?: true | { select?: GassmaGassmaPostFindSelect; omit?: GassmaGassmaPostOmit; where?: GassmaGassmaPostWhereUse; orderBy?: GassmaGassmaPostOrderBy | GassmaGassmaPostOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaPostInclude; _count?: GassmaGassmaPostCountValue };
  "_count"?: GassmaGassmaCommentCountValue;
};

export type GassmaGassmaCategorySelect = {
  "id"?: true;
  "name"?: true;
  "parentId"?: true;
};

export type GassmaGassmaCategoryNumberSelect = {
  "id"?: true;
  "parentId"?: true;
};

export type GassmaGassmaCategoryFindSelect = {
  "id"?: true;
  "name"?: true;
  "parentId"?: true;
  "posts"?: true | { select?: GassmaGassmaPostFindSelect; omit?: GassmaGassmaPostOmit; where?: GassmaGassmaPostWhereUse; orderBy?: GassmaGassmaPostOrderBy | GassmaGassmaPostOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaPostInclude; _count?: GassmaGassmaPostCountValue };
  "parent"?: true | { select?: GassmaGassmaCategoryFindSelect; omit?: GassmaGassmaCategoryOmit; where?: GassmaGassmaCategoryWhereUse; orderBy?: GassmaGassmaCategoryOrderBy | GassmaGassmaCategoryOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaCategoryInclude; _count?: GassmaGassmaCategoryCountValue };
  "children"?: true | { select?: GassmaGassmaCategoryFindSelect; omit?: GassmaGassmaCategoryOmit; where?: GassmaGassmaCategoryWhereUse; orderBy?: GassmaGassmaCategoryOrderBy | GassmaGassmaCategoryOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaCategoryInclude; _count?: GassmaGassmaCategoryCountValue };
  "_count"?: GassmaGassmaCategoryCountValue;
};

export type GassmaGassmaTagSelect = {
  "id"?: true;
  "name"?: true;
};

export type GassmaGassmaTagNumberSelect = {
  "id"?: true;
};

export type GassmaGassmaTagFindSelect = {
  "id"?: true;
  "name"?: true;
  "posts"?: true | { select?: GassmaGassmaPostFindSelect; omit?: GassmaGassmaPostOmit; where?: GassmaGassmaPostWhereUse; orderBy?: GassmaGassmaPostOrderBy | GassmaGassmaPostOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaPostInclude; _count?: GassmaGassmaPostCountValue };
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

export type GassmaGassmaProductNumberSelect = {
  "id"?: true;
  "price"?: true;
  "stock"?: true;
};

export type GassmaGassmaProductFindSelect = {
  "id"?: true;
  "name"?: true;
  "price"?: true;
  "stock"?: true;
  "status"?: true;
  "createdAt"?: true;
  "updatedAt"?: true;
  "orderItems"?: true | { select?: GassmaGassmaOrderItemFindSelect; omit?: GassmaGassmaOrderItemOmit; where?: GassmaGassmaOrderItemWhereUse; orderBy?: GassmaGassmaOrderItemOrderBy | GassmaGassmaOrderItemOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaOrderItemInclude; _count?: GassmaGassmaOrderItemCountValue };
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

export type GassmaGassmaOrderNumberSelect = {
  "id"?: true;
  "userId"?: true;
  "totalAmount"?: true;
  "quantity"?: true;
};

export type GassmaGassmaOrderFindSelect = {
  "id"?: true;
  "userId"?: true;
  "totalAmount"?: true;
  "quantity"?: true;
  "status"?: true;
  "createdAt"?: true;
  "user"?: true | { select?: GassmaGassmaUserFindSelect; omit?: GassmaGassmaUserOmit; where?: GassmaGassmaUserWhereUse; orderBy?: GassmaGassmaUserOrderBy | GassmaGassmaUserOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaUserInclude; _count?: GassmaGassmaUserCountValue };
  "items"?: true | { select?: GassmaGassmaOrderItemFindSelect; omit?: GassmaGassmaOrderItemOmit; where?: GassmaGassmaOrderItemWhereUse; orderBy?: GassmaGassmaOrderItemOrderBy | GassmaGassmaOrderItemOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaOrderItemInclude; _count?: GassmaGassmaOrderItemCountValue };
  "_count"?: GassmaGassmaOrderCountValue;
};

export type GassmaGassmaOrderItemSelect = {
  "id"?: true;
  "orderId"?: true;
  "productId"?: true;
  "quantity"?: true;
  "unitPrice"?: true;
};

export type GassmaGassmaOrderItemNumberSelect = {
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
  "order"?: true | { select?: GassmaGassmaOrderFindSelect; omit?: GassmaGassmaOrderOmit; where?: GassmaGassmaOrderWhereUse; orderBy?: GassmaGassmaOrderOrderBy | GassmaGassmaOrderOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaOrderInclude; _count?: GassmaGassmaOrderCountValue };
  "product"?: true | { select?: GassmaGassmaProductFindSelect; omit?: GassmaGassmaProductOmit; where?: GassmaGassmaProductWhereUse; orderBy?: GassmaGassmaProductOrderBy | GassmaGassmaProductOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaProductInclude; _count?: GassmaGassmaProductCountValue };
  "_count"?: GassmaGassmaOrderItemCountValue;
};

export type GassmaGassmaFormulaCellSelect = {
  "id"?: true;
  "label"?: true;
  "amount"?: true;
  "total"?: true;
};

export type GassmaGassmaFormulaCellNumberSelect = {
  "id"?: true;
  "amount"?: true;
  "total"?: true;
};

export type GassmaGassmaFormulaCellFindSelect = {
  "id"?: true;
  "label"?: true;
  "amount"?: true;
  "total"?: true;
};

export type GassmaGassmaNotificationSelect = {
  "id"?: true;
  "userId"?: true;
  "message"?: true;
  "isRead"?: true;
};

export type GassmaGassmaNotificationNumberSelect = {
  "id"?: true;
  "userId"?: true;
};

export type GassmaGassmaNotificationFindSelect = {
  "id"?: true;
  "userId"?: true;
  "message"?: true;
  "isRead"?: true;
};

export type GassmaGassmaOffsetNoteSelect = {
  "id"?: true;
  "title"?: true;
  "value"?: true;
};

export type GassmaGassmaOffsetNoteNumberSelect = {
  "id"?: true;
  "value"?: true;
};

export type GassmaGassmaOffsetNoteFindSelect = {
  "id"?: true;
  "title"?: true;
  "value"?: true;
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

export type GassmaGassmaUserNumberSelect = {
  "id"?: true;
  "age"?: true;
};

export type GassmaGassmaUserFindSelect = {
  "id"?: true;
  "email"?: true;
  "name"?: true;
  "age"?: true;
  "isActive"?: true;
  "role"?: true;
  "createdAt"?: true;
  "posts"?: true | { select?: GassmaGassmaPostFindSelect; omit?: GassmaGassmaPostOmit; where?: GassmaGassmaPostWhereUse; orderBy?: GassmaGassmaPostOrderBy | GassmaGassmaPostOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaPostInclude; _count?: GassmaGassmaPostCountValue };
  "comments"?: true | { select?: GassmaGassmaCommentFindSelect; omit?: GassmaGassmaCommentOmit; where?: GassmaGassmaCommentWhereUse; orderBy?: GassmaGassmaCommentOrderBy | GassmaGassmaCommentOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaCommentInclude; _count?: GassmaGassmaCommentCountValue };
  "orders"?: true | { select?: GassmaGassmaOrderFindSelect; omit?: GassmaGassmaOrderOmit; where?: GassmaGassmaOrderWhereUse; orderBy?: GassmaGassmaOrderOrderBy | GassmaGassmaOrderOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaOrderInclude; _count?: GassmaGassmaOrderCountValue };
  "profile"?: true | { select?: GassmaGassmaProfileFindSelect; omit?: GassmaGassmaProfileOmit; where?: GassmaGassmaProfileWhereUse; orderBy?: GassmaGassmaProfileOrderBy | GassmaGassmaProfileOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaProfileInclude; _count?: GassmaGassmaProfileCountValue };
  "_count"?: GassmaGassmaUserCountValue;
};

export type GassmaGassmaProfileSelect = {
  "id"?: true;
  "bio"?: true;
  "website"?: true;
  "userId"?: true;
};

export type GassmaGassmaProfileNumberSelect = {
  "id"?: true;
  "userId"?: true;
};

export type GassmaGassmaProfileFindSelect = {
  "id"?: true;
  "bio"?: true;
  "website"?: true;
  "userId"?: true;
  "user"?: true | { select?: GassmaGassmaUserFindSelect; omit?: GassmaGassmaUserOmit; where?: GassmaGassmaUserWhereUse; orderBy?: GassmaGassmaUserOrderBy | GassmaGassmaUserOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaUserInclude; _count?: GassmaGassmaUserCountValue };
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

export type GassmaGassmaFormulaCellOmit = {
  "id"?: true | false;
  "label"?: true | false;
  "amount"?: true | false;
  "total"?: true | false;
};

export type GassmaGassmaNotificationOmit = {
  "id"?: true | false;
  "userId"?: true | false;
  "message"?: true | false;
  "isRead"?: true | false;
};

export type GassmaGassmaOffsetNoteOmit = {
  "id"?: true | false;
  "title"?: true | false;
  "value"?: true | false;
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
  orderBy?: GassmaGassmaPostOrderBy | GassmaGassmaPostOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaPostUse>;
};

export type GassmaGassmaCommentCountData = {
  where?: GassmaGassmaCommentWhereUse;
  orderBy?: GassmaGassmaCommentOrderBy | GassmaGassmaCommentOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaCommentUse>;
};

export type GassmaGassmaCategoryCountData = {
  where?: GassmaGassmaCategoryWhereUse;
  orderBy?: GassmaGassmaCategoryOrderBy | GassmaGassmaCategoryOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaCategoryUse>;
};

export type GassmaGassmaTagCountData = {
  where?: GassmaGassmaTagWhereUse;
  orderBy?: GassmaGassmaTagOrderBy | GassmaGassmaTagOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaTagUse>;
};

export type GassmaGassmaProductCountData = {
  where?: GassmaGassmaProductWhereUse;
  orderBy?: GassmaGassmaProductOrderBy | GassmaGassmaProductOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaProductUse>;
};

export type GassmaGassmaOrderCountData = {
  where?: GassmaGassmaOrderWhereUse;
  orderBy?: GassmaGassmaOrderOrderBy | GassmaGassmaOrderOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaOrderUse>;
};

export type GassmaGassmaOrderItemCountData = {
  where?: GassmaGassmaOrderItemWhereUse;
  orderBy?: GassmaGassmaOrderItemOrderBy | GassmaGassmaOrderItemOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaOrderItemUse>;
};

export type GassmaGassmaFormulaCellCountData = {
  where?: GassmaGassmaFormulaCellWhereUse;
  orderBy?: GassmaGassmaFormulaCellOrderBy | GassmaGassmaFormulaCellOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaFormulaCellUse>;
};

export type GassmaGassmaNotificationCountData = {
  where?: GassmaGassmaNotificationWhereUse;
  orderBy?: GassmaGassmaNotificationOrderBy | GassmaGassmaNotificationOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaNotificationUse>;
};

export type GassmaGassmaOffsetNoteCountData = {
  where?: GassmaGassmaOffsetNoteWhereUse;
  orderBy?: GassmaGassmaOffsetNoteOrderBy | GassmaGassmaOffsetNoteOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaOffsetNoteUse>;
};

export type GassmaGassmaUserCountData = {
  where?: GassmaGassmaUserWhereUse;
  orderBy?: GassmaGassmaUserOrderBy | GassmaGassmaUserOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaUserUse>;
};

export type GassmaGassmaProfileCountData = {
  where?: GassmaGassmaProfileWhereUse;
  orderBy?: GassmaGassmaProfileOrderBy | GassmaGassmaProfileOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaProfileUse>;
};

export type GassmaGassmaPostCreateReturn = {
 "id": number;
 "title": string;
 "content": string | number | null;
 "published": boolean;
 "viewCount": number;
 "rating": number | boolean | null;
 "authorId": number;
 "categoryId": number | null;
 "createdAt": Date;
 "updatedAt": Date;
};

export type GassmaGassmaCommentCreateReturn = {
 "id": number;
 "text": string;
 "authorId": number;
 "postId": number;
 "createdAt": Date;
};

export type GassmaGassmaCategoryCreateReturn = {
 "id": number;
 "name": string;
 "parentId": number | null;
};

export type GassmaGassmaTagCreateReturn = {
 "id": number;
 "name": string;
};

export type GassmaGassmaProductCreateReturn = {
 "id": number;
 "name": string;
 "price": number;
 "stock": number;
 "status": "available" | "soldout" | "discontinued";
 "createdAt": Date;
 "updatedAt": Date;
};

export type GassmaGassmaOrderCreateReturn = {
 "id": number;
 "userId": number;
 "totalAmount": number;
 "quantity": number;
 "status": "pending" | "shipped" | "delivered" | "cancelled";
 "createdAt": Date;
};

export type GassmaGassmaOrderItemCreateReturn = {
 "id": number;
 "orderId": number;
 "productId": number;
 "quantity": number;
 "unitPrice": number;
};

export type GassmaGassmaFormulaCellCreateReturn = {
 "id": number;
 "label": string;
 "amount": number;
 "total": number;
};

export type GassmaGassmaNotificationCreateReturn = {
 "id": number;
 "userId": number;
 "message": string;
 "isRead": boolean;
};

export type GassmaGassmaOffsetNoteCreateReturn = {
 "id": number;
 "title": string;
 "value": number;
};

export type GassmaGassmaUserCreateReturn = {
 "id": number;
 "email": string;
 "name": string;
 "age": number | null;
 "isActive": boolean;
 "role": "ADMIN" | "USER" | "MODERATOR";
 "createdAt": Date;
};

export type GassmaGassmaProfileCreateReturn = {
 "id": number;
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

export type GassmaGassmaFormulaCellDefaultFindResult = GassmaGassmaFormulaCellCreateReturn;

export type GassmaGassmaNotificationDefaultFindResult = GassmaGassmaNotificationCreateReturn;

export type GassmaGassmaOffsetNoteDefaultFindResult = GassmaGassmaOffsetNoteCreateReturn;

export type GassmaGassmaUserDefaultFindResult = GassmaGassmaUserCreateReturn;

export type GassmaGassmaProfileDefaultFindResult = GassmaGassmaProfileCreateReturn;

export type GassmaGassmaPostFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends GassmaGassmaPostFindSelect
  ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaPostDefaultFindResult | "author" | "category" | "comments" | "tags" | "_count")]:
          K extends "author" ? GassmaGassmaUserFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "User": infer TO } ? TO extends GassmaGassmaUserOmit ? TO : {} : {}, O> | null :
          K extends "category" ? GassmaGassmaCategoryFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Category": infer TO } ? TO extends GassmaGassmaCategoryOmit ? TO : {} : {}, O> | null :
          K extends "comments" ? GassmaGassmaCommentFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Comment": infer TO } ? TO extends GassmaGassmaCommentOmit ? TO : {} : {}, O>[] :
          K extends "tags" ? GassmaGassmaTagFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Tag": infer TO } ? TO extends GassmaGassmaTagOmit ? TO : {} : {}, O>[] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaPostDefaultFindResult[K & keyof GassmaGassmaPostDefaultFindResult];
    }
  : {
      [K in keyof GassmaGassmaPostDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaPostDefaultFindResult[K];
    }) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "author" | "category" | "comments" | "tags" | "_count" ? K : never]:
          K extends "author" ? GassmaGassmaUserFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "User": infer TO } ? TO extends GassmaGassmaUserOmit ? TO : {} : {}, O> | null :
          K extends "category" ? GassmaGassmaCategoryFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Category": infer TO } ? TO extends GassmaGassmaCategoryOmit ? TO : {} : {}, O> | null :
          K extends "comments" ? GassmaGassmaCommentFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Comment": infer TO } ? TO extends GassmaGassmaCommentOmit ? TO : {} : {}, O>[] :
          K extends "tags" ? GassmaGassmaTagFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Tag": infer TO } ? TO extends GassmaGassmaTagOmit ? TO : {} : {}, O>[] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaCommentFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends GassmaGassmaCommentFindSelect
  ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaCommentDefaultFindResult | "author" | "post" | "_count")]:
          K extends "author" ? GassmaGassmaUserFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "User": infer TO } ? TO extends GassmaGassmaUserOmit ? TO : {} : {}, O> | null :
          K extends "post" ? GassmaGassmaPostFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Post": infer TO } ? TO extends GassmaGassmaPostOmit ? TO : {} : {}, O> | null :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaCommentDefaultFindResult[K & keyof GassmaGassmaCommentDefaultFindResult];
    }
  : {
      [K in keyof GassmaGassmaCommentDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaCommentDefaultFindResult[K];
    }) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "author" | "post" | "_count" ? K : never]:
          K extends "author" ? GassmaGassmaUserFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "User": infer TO } ? TO extends GassmaGassmaUserOmit ? TO : {} : {}, O> | null :
          K extends "post" ? GassmaGassmaPostFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Post": infer TO } ? TO extends GassmaGassmaPostOmit ? TO : {} : {}, O> | null :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaCategoryFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends GassmaGassmaCategoryFindSelect
  ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaCategoryDefaultFindResult | "posts" | "parent" | "children" | "_count")]:
          K extends "posts" ? GassmaGassmaPostFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Post": infer TO } ? TO extends GassmaGassmaPostOmit ? TO : {} : {}, O>[] :
          K extends "parent" ? GassmaGassmaCategoryFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Category": infer TO } ? TO extends GassmaGassmaCategoryOmit ? TO : {} : {}, O> | null :
          K extends "children" ? GassmaGassmaCategoryFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Category": infer TO } ? TO extends GassmaGassmaCategoryOmit ? TO : {} : {}, O>[] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaCategoryDefaultFindResult[K & keyof GassmaGassmaCategoryDefaultFindResult];
    }
  : {
      [K in keyof GassmaGassmaCategoryDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaCategoryDefaultFindResult[K];
    }) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "posts" | "parent" | "children" | "_count" ? K : never]:
          K extends "posts" ? GassmaGassmaPostFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Post": infer TO } ? TO extends GassmaGassmaPostOmit ? TO : {} : {}, O>[] :
          K extends "parent" ? GassmaGassmaCategoryFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Category": infer TO } ? TO extends GassmaGassmaCategoryOmit ? TO : {} : {}, O> | null :
          K extends "children" ? GassmaGassmaCategoryFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Category": infer TO } ? TO extends GassmaGassmaCategoryOmit ? TO : {} : {}, O>[] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaTagFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends GassmaGassmaTagFindSelect
  ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaTagDefaultFindResult | "posts" | "_count")]:
          K extends "posts" ? GassmaGassmaPostFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Post": infer TO } ? TO extends GassmaGassmaPostOmit ? TO : {} : {}, O>[] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaTagDefaultFindResult[K & keyof GassmaGassmaTagDefaultFindResult];
    }
  : {
      [K in keyof GassmaGassmaTagDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaTagDefaultFindResult[K];
    }) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "posts" | "_count" ? K : never]:
          K extends "posts" ? GassmaGassmaPostFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Post": infer TO } ? TO extends GassmaGassmaPostOmit ? TO : {} : {}, O>[] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaProductFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends GassmaGassmaProductFindSelect
  ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaProductDefaultFindResult | "orderItems" | "_count")]:
          K extends "orderItems" ? GassmaGassmaOrderItemFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "OrderItem": infer TO } ? TO extends GassmaGassmaOrderItemOmit ? TO : {} : {}, O>[] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaProductDefaultFindResult[K & keyof GassmaGassmaProductDefaultFindResult];
    }
  : {
      [K in keyof GassmaGassmaProductDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaProductDefaultFindResult[K];
    }) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "orderItems" | "_count" ? K : never]:
          K extends "orderItems" ? GassmaGassmaOrderItemFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "OrderItem": infer TO } ? TO extends GassmaGassmaOrderItemOmit ? TO : {} : {}, O>[] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaOrderFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends GassmaGassmaOrderFindSelect
  ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaOrderDefaultFindResult | "user" | "items" | "_count")]:
          K extends "user" ? GassmaGassmaUserFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "User": infer TO } ? TO extends GassmaGassmaUserOmit ? TO : {} : {}, O> | null :
          K extends "items" ? GassmaGassmaOrderItemFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "OrderItem": infer TO } ? TO extends GassmaGassmaOrderItemOmit ? TO : {} : {}, O>[] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaOrderDefaultFindResult[K & keyof GassmaGassmaOrderDefaultFindResult];
    }
  : {
      [K in keyof GassmaGassmaOrderDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaOrderDefaultFindResult[K];
    }) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "user" | "items" | "_count" ? K : never]:
          K extends "user" ? GassmaGassmaUserFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "User": infer TO } ? TO extends GassmaGassmaUserOmit ? TO : {} : {}, O> | null :
          K extends "items" ? GassmaGassmaOrderItemFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "OrderItem": infer TO } ? TO extends GassmaGassmaOrderItemOmit ? TO : {} : {}, O>[] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaOrderItemFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends GassmaGassmaOrderItemFindSelect
  ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaOrderItemDefaultFindResult | "order" | "product" | "_count")]:
          K extends "order" ? GassmaGassmaOrderFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Order": infer TO } ? TO extends GassmaGassmaOrderOmit ? TO : {} : {}, O> | null :
          K extends "product" ? GassmaGassmaProductFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Product": infer TO } ? TO extends GassmaGassmaProductOmit ? TO : {} : {}, O> | null :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaOrderItemDefaultFindResult[K & keyof GassmaGassmaOrderItemDefaultFindResult];
    }
  : {
      [K in keyof GassmaGassmaOrderItemDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaOrderItemDefaultFindResult[K];
    }) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "order" | "product" | "_count" ? K : never]:
          K extends "order" ? GassmaGassmaOrderFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Order": infer TO } ? TO extends GassmaGassmaOrderOmit ? TO : {} : {}, O> | null :
          K extends "product" ? GassmaGassmaProductFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Product": infer TO } ? TO extends GassmaGassmaProductOmit ? TO : {} : {}, O> | null :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaFormulaCellFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends GassmaGassmaFormulaCellFindSelect
  ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaFormulaCellDefaultFindResult | "_count")]:

          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaFormulaCellDefaultFindResult[K & keyof GassmaGassmaFormulaCellDefaultFindResult];
    }
  : {
      [K in keyof GassmaGassmaFormulaCellDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaFormulaCellDefaultFindResult[K];
    }) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "_count" ? K : never]:

          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaNotificationFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends GassmaGassmaNotificationFindSelect
  ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaNotificationDefaultFindResult | "_count")]:

          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaNotificationDefaultFindResult[K & keyof GassmaGassmaNotificationDefaultFindResult];
    }
  : {
      [K in keyof GassmaGassmaNotificationDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaNotificationDefaultFindResult[K];
    }) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "_count" ? K : never]:

          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaOffsetNoteFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends GassmaGassmaOffsetNoteFindSelect
  ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaOffsetNoteDefaultFindResult | "_count")]:

          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaOffsetNoteDefaultFindResult[K & keyof GassmaGassmaOffsetNoteDefaultFindResult];
    }
  : {
      [K in keyof GassmaGassmaOffsetNoteDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaOffsetNoteDefaultFindResult[K];
    }) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "_count" ? K : never]:

          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaUserFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends GassmaGassmaUserFindSelect
  ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaUserDefaultFindResult | "posts" | "comments" | "orders" | "profile" | "_count")]:
          K extends "posts" ? GassmaGassmaPostFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Post": infer TO } ? TO extends GassmaGassmaPostOmit ? TO : {} : {}, O>[] :
          K extends "comments" ? GassmaGassmaCommentFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Comment": infer TO } ? TO extends GassmaGassmaCommentOmit ? TO : {} : {}, O>[] :
          K extends "orders" ? GassmaGassmaOrderFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Order": infer TO } ? TO extends GassmaGassmaOrderOmit ? TO : {} : {}, O>[] :
          K extends "profile" ? GassmaGassmaProfileFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Profile": infer TO } ? TO extends GassmaGassmaProfileOmit ? TO : {} : {}, O> | null :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaUserDefaultFindResult[K & keyof GassmaGassmaUserDefaultFindResult];
    }
  : {
      [K in keyof GassmaGassmaUserDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaUserDefaultFindResult[K];
    }) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "posts" | "comments" | "orders" | "profile" | "_count" ? K : never]:
          K extends "posts" ? GassmaGassmaPostFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Post": infer TO } ? TO extends GassmaGassmaPostOmit ? TO : {} : {}, O>[] :
          K extends "comments" ? GassmaGassmaCommentFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Comment": infer TO } ? TO extends GassmaGassmaCommentOmit ? TO : {} : {}, O>[] :
          K extends "orders" ? GassmaGassmaOrderFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Order": infer TO } ? TO extends GassmaGassmaOrderOmit ? TO : {} : {}, O>[] :
          K extends "profile" ? GassmaGassmaProfileFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Profile": infer TO } ? TO extends GassmaGassmaProfileOmit ? TO : {} : {}, O> | null :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaProfileFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends GassmaGassmaProfileFindSelect
  ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaProfileDefaultFindResult | "user" | "_count")]:
          K extends "user" ? GassmaGassmaUserFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "User": infer TO } ? TO extends GassmaGassmaUserOmit ? TO : {} : {}, O> | null :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaProfileDefaultFindResult[K & keyof GassmaGassmaProfileDefaultFindResult];
    }
  : {
      [K in keyof GassmaGassmaProfileDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaProfileDefaultFindResult[K];
    }) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "user" | "_count" ? K : never]:
          K extends "user" ? GassmaGassmaUserFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "User": infer TO } ? TO extends GassmaGassmaUserOmit ? TO : {} : {}, O> | null :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaPostAggregateBaseReturn = {
  "id": number
  "title": string
  "content": string | number
  "published": boolean
  "viewCount": number
  "rating": number | boolean
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
  "status": "available" | "soldout" | "discontinued"
  "createdAt": Date
  "updatedAt": Date
};

export type GassmaGassmaOrderAggregateBaseReturn = {
  "id": number
  "userId": number
  "totalAmount": number
  "quantity": number
  "status": "pending" | "shipped" | "delivered" | "cancelled"
  "createdAt": Date
};

export type GassmaGassmaOrderItemAggregateBaseReturn = {
  "id": number
  "orderId": number
  "productId": number
  "quantity": number
  "unitPrice": number
};

export type GassmaGassmaFormulaCellAggregateBaseReturn = {
  "id": number
  "label": string
  "amount": number
  "total": number
};

export type GassmaGassmaNotificationAggregateBaseReturn = {
  "id": number
  "userId": number
  "message": string
  "isRead": boolean
};

export type GassmaGassmaOffsetNoteAggregateBaseReturn = {
  "id": number
  "title": string
  "value": number
};

export type GassmaGassmaUserAggregateBaseReturn = {
  "id": number
  "email": string
  "name": string
  "age": number
  "isActive": boolean
  "role": "ADMIN" | "USER" | "MODERATOR"
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
    : K extends "_avg" | "_sum"
      ? { [P in keyof T as T[P] extends true ? P : never]: number | null }
      : {
          [P in keyof T as T[P] extends true
            ? P & keyof GassmaGassmaPostAggregateBaseReturn
            : never]: GassmaGassmaPostAggregateBaseReturn[P & keyof GassmaGassmaPostAggregateBaseReturn] | null;
        };

export type GassmaGassmaCommentAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : K extends "_avg" | "_sum"
      ? { [P in keyof T as T[P] extends true ? P : never]: number | null }
      : {
          [P in keyof T as T[P] extends true
            ? P & keyof GassmaGassmaCommentAggregateBaseReturn
            : never]: GassmaGassmaCommentAggregateBaseReturn[P & keyof GassmaGassmaCommentAggregateBaseReturn] | null;
        };

export type GassmaGassmaCategoryAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : K extends "_avg" | "_sum"
      ? { [P in keyof T as T[P] extends true ? P : never]: number | null }
      : {
          [P in keyof T as T[P] extends true
            ? P & keyof GassmaGassmaCategoryAggregateBaseReturn
            : never]: GassmaGassmaCategoryAggregateBaseReturn[P & keyof GassmaGassmaCategoryAggregateBaseReturn] | null;
        };

export type GassmaGassmaTagAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : K extends "_avg" | "_sum"
      ? { [P in keyof T as T[P] extends true ? P : never]: number | null }
      : {
          [P in keyof T as T[P] extends true
            ? P & keyof GassmaGassmaTagAggregateBaseReturn
            : never]: GassmaGassmaTagAggregateBaseReturn[P & keyof GassmaGassmaTagAggregateBaseReturn] | null;
        };

export type GassmaGassmaProductAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : K extends "_avg" | "_sum"
      ? { [P in keyof T as T[P] extends true ? P : never]: number | null }
      : {
          [P in keyof T as T[P] extends true
            ? P & keyof GassmaGassmaProductAggregateBaseReturn
            : never]: GassmaGassmaProductAggregateBaseReturn[P & keyof GassmaGassmaProductAggregateBaseReturn] | null;
        };

export type GassmaGassmaOrderAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : K extends "_avg" | "_sum"
      ? { [P in keyof T as T[P] extends true ? P : never]: number | null }
      : {
          [P in keyof T as T[P] extends true
            ? P & keyof GassmaGassmaOrderAggregateBaseReturn
            : never]: GassmaGassmaOrderAggregateBaseReturn[P & keyof GassmaGassmaOrderAggregateBaseReturn] | null;
        };

export type GassmaGassmaOrderItemAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : K extends "_avg" | "_sum"
      ? { [P in keyof T as T[P] extends true ? P : never]: number | null }
      : {
          [P in keyof T as T[P] extends true
            ? P & keyof GassmaGassmaOrderItemAggregateBaseReturn
            : never]: GassmaGassmaOrderItemAggregateBaseReturn[P & keyof GassmaGassmaOrderItemAggregateBaseReturn] | null;
        };

export type GassmaGassmaFormulaCellAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : K extends "_avg" | "_sum"
      ? { [P in keyof T as T[P] extends true ? P : never]: number | null }
      : {
          [P in keyof T as T[P] extends true
            ? P & keyof GassmaGassmaFormulaCellAggregateBaseReturn
            : never]: GassmaGassmaFormulaCellAggregateBaseReturn[P & keyof GassmaGassmaFormulaCellAggregateBaseReturn] | null;
        };

export type GassmaGassmaNotificationAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : K extends "_avg" | "_sum"
      ? { [P in keyof T as T[P] extends true ? P : never]: number | null }
      : {
          [P in keyof T as T[P] extends true
            ? P & keyof GassmaGassmaNotificationAggregateBaseReturn
            : never]: GassmaGassmaNotificationAggregateBaseReturn[P & keyof GassmaGassmaNotificationAggregateBaseReturn] | null;
        };

export type GassmaGassmaOffsetNoteAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : K extends "_avg" | "_sum"
      ? { [P in keyof T as T[P] extends true ? P : never]: number | null }
      : {
          [P in keyof T as T[P] extends true
            ? P & keyof GassmaGassmaOffsetNoteAggregateBaseReturn
            : never]: GassmaGassmaOffsetNoteAggregateBaseReturn[P & keyof GassmaGassmaOffsetNoteAggregateBaseReturn] | null;
        };

export type GassmaGassmaUserAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : K extends "_avg" | "_sum"
      ? { [P in keyof T as T[P] extends true ? P : never]: number | null }
      : {
          [P in keyof T as T[P] extends true
            ? P & keyof GassmaGassmaUserAggregateBaseReturn
            : never]: GassmaGassmaUserAggregateBaseReturn[P & keyof GassmaGassmaUserAggregateBaseReturn] | null;
        };

export type GassmaGassmaProfileAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? { [P in keyof T as T[P] extends true ? P : never]: number }
    : K extends "_avg" | "_sum"
      ? { [P in keyof T as T[P] extends true ? P : never]: number | null }
      : {
          [P in keyof T as T[P] extends true
            ? P & keyof GassmaGassmaProfileAggregateBaseReturn
            : never]: GassmaGassmaProfileAggregateBaseReturn[P & keyof GassmaGassmaProfileAggregateBaseReturn] | null;
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

export type GassmaGassmaFormulaCellAggregateResult<T extends GassmaGassmaFormulaCellAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaFormulaCellAggregateField<T[K], K> : never;
};

export type GassmaGassmaNotificationAggregateResult<T extends GassmaGassmaNotificationAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaNotificationAggregateField<T[K], K> : never;
};

export type GassmaGassmaOffsetNoteAggregateResult<T extends GassmaGassmaOffsetNoteAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaOffsetNoteAggregateField<T[K], K> : never;
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

export type GassmaGassmaFormulaCellGroupByBaseReturn = GassmaGassmaFormulaCellCreateReturn;

export type GassmaGassmaNotificationGroupByBaseReturn = GassmaGassmaNotificationCreateReturn;

export type GassmaGassmaOffsetNoteGroupByBaseReturn = GassmaGassmaOffsetNoteCreateReturn;

export type GassmaGassmaUserGroupByBaseReturn = GassmaGassmaUserCreateReturn;

export type GassmaGassmaProfileGroupByBaseReturn = GassmaGassmaProfileCreateReturn;

export type GassmaGassmaPostGroupByKeyOfBaseReturn = keyof GassmaGassmaPostGroupByBaseReturn;

export type GassmaGassmaCommentGroupByKeyOfBaseReturn = keyof GassmaGassmaCommentGroupByBaseReturn;

export type GassmaGassmaCategoryGroupByKeyOfBaseReturn = keyof GassmaGassmaCategoryGroupByBaseReturn;

export type GassmaGassmaTagGroupByKeyOfBaseReturn = keyof GassmaGassmaTagGroupByBaseReturn;

export type GassmaGassmaProductGroupByKeyOfBaseReturn = keyof GassmaGassmaProductGroupByBaseReturn;

export type GassmaGassmaOrderGroupByKeyOfBaseReturn = keyof GassmaGassmaOrderGroupByBaseReturn;

export type GassmaGassmaOrderItemGroupByKeyOfBaseReturn = keyof GassmaGassmaOrderItemGroupByBaseReturn;

export type GassmaGassmaFormulaCellGroupByKeyOfBaseReturn = keyof GassmaGassmaFormulaCellGroupByBaseReturn;

export type GassmaGassmaNotificationGroupByKeyOfBaseReturn = keyof GassmaGassmaNotificationGroupByBaseReturn;

export type GassmaGassmaOffsetNoteGroupByKeyOfBaseReturn = keyof GassmaGassmaOffsetNoteGroupByBaseReturn;

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

export type GassmaGassmaFormulaCellByField<T extends GassmaGassmaFormulaCellGroupByKeyOfBaseReturn | GassmaGassmaFormulaCellGroupByKeyOfBaseReturn[]> =
  T extends GassmaGassmaFormulaCellGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaGassmaFormulaCellGroupByBaseReturn[K & keyof GassmaGassmaFormulaCellGroupByBaseReturn];
      }
    : T extends keyof GassmaGassmaFormulaCellGroupByBaseReturn
      ? { [K in T]: GassmaGassmaFormulaCellGroupByBaseReturn[K] }
      : never;

export type GassmaGassmaNotificationByField<T extends GassmaGassmaNotificationGroupByKeyOfBaseReturn | GassmaGassmaNotificationGroupByKeyOfBaseReturn[]> =
  T extends GassmaGassmaNotificationGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaGassmaNotificationGroupByBaseReturn[K & keyof GassmaGassmaNotificationGroupByBaseReturn];
      }
    : T extends keyof GassmaGassmaNotificationGroupByBaseReturn
      ? { [K in T]: GassmaGassmaNotificationGroupByBaseReturn[K] }
      : never;

export type GassmaGassmaOffsetNoteByField<T extends GassmaGassmaOffsetNoteGroupByKeyOfBaseReturn | GassmaGassmaOffsetNoteGroupByKeyOfBaseReturn[]> =
  T extends GassmaGassmaOffsetNoteGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaGassmaOffsetNoteGroupByBaseReturn[K & keyof GassmaGassmaOffsetNoteGroupByBaseReturn];
      }
    : T extends keyof GassmaGassmaOffsetNoteGroupByBaseReturn
      ? { [K in T]: GassmaGassmaOffsetNoteGroupByBaseReturn[K] }
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

export type GassmaGassmaFormulaCellGroupByResult<T extends GassmaGassmaFormulaCellGroupByData> = GassmaGassmaFormulaCellByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaFormulaCellAggregateField<T[K], K> : never;
};

export type GassmaGassmaNotificationGroupByResult<T extends GassmaGassmaNotificationGroupByData> = GassmaGassmaNotificationByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaNotificationAggregateField<T[K], K> : never;
};

export type GassmaGassmaOffsetNoteGroupByResult<T extends GassmaGassmaOffsetNoteGroupByData> = GassmaGassmaOffsetNoteByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaOffsetNoteAggregateField<T[K], K> : never;
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

export type GassmaGassmaModelName =
  | "Post"
  | "Comment"
  | "Category"
  | "Tag"
  | "Product"
  | "Order"
  | "OrderItem"
  | "FormulaCell"
  | "Notification"
  | "OffsetNote"
  | "User"
  | "Profile";

export type GassmaGassmaOperationName =
  | "findFirst"
  | "findFirstOrThrow"
  | "findMany"
  | "create"
  | "createMany"
  | "createManyAndReturn"
  | "update"
  | "updateMany"
  | "updateManyAndReturn"
  | "upsert"
  | "delete"
  | "deleteMany"
  | "count"
  | "aggregate"
  | "groupBy";

export type GassmaGassmaPostQueryArgs =
  | GassmaGassmaPostFindFirstData
  | GassmaGassmaPostFindManyData
  | GassmaGassmaPostCreateData
  | GassmaGassmaPostCreateManyData
  | GassmaGassmaPostCreateManyAndReturnData
  | GassmaGassmaPostUpdateSingleData
  | GassmaGassmaPostUpdateData
  | GassmaGassmaPostUpsertSingleData
  | GassmaGassmaPostDeleteSingleData
  | GassmaGassmaPostDeleteData
  | GassmaGassmaPostCountData
  | GassmaGassmaPostAggregateData
  | GassmaGassmaPostGroupByData;

export type GassmaGassmaPostQueryHooks<GO extends GassmaGassmaPostOmit = {}, O = {}> = {
  findFirst?: <T extends GassmaGassmaPostFindFirstData>(params: {
    model: "Post";
    operation: "findFirst";
    args: T;
    query: (args: T) => GassmaGassmaPostFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaPostFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaPostFindFirstData>(params: {
    model: "Post";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaPostFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaPostFindResult<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaPostFindManyData>(params: {
    model: "Post";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaPostFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaPostFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaPostCreateData>(params: {
    model: "Post";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaPostFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaPostFindResult<T["select"], T["include"], T["omit"], GO, O>;
  createMany?: (params: {
    model: "Post";
    operation: "createMany";
    args: GassmaGassmaPostCreateManyData;
    query: (args: GassmaGassmaPostCreateManyData) => CreateManyReturn;
  }) => CreateManyReturn;
  createManyAndReturn?: <T extends GassmaGassmaPostCreateManyAndReturnData>(params: {
    model: "Post";
    operation: "createManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaPostFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaPostFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaPostUpdateSingleData>(params: {
    model: "Post";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaPostFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaPostFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "Post";
    operation: "updateMany";
    args: GassmaGassmaPostUpdateData;
    query: (args: GassmaGassmaPostUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: (params: {
    model: "Post";
    operation: "updateManyAndReturn";
    args: GassmaGassmaPostUpdateData;
    query: (args: GassmaGassmaPostUpdateData) => GassmaGassmaPostFindResult<undefined, undefined, undefined, GO, O>[];
  }) => GassmaGassmaPostFindResult<undefined, undefined, undefined, GO, O>[];
  upsert?: <T extends GassmaGassmaPostUpsertSingleData>(params: {
    model: "Post";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaPostFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaPostFindResult<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaPostDeleteSingleData>(params: {
    model: "Post";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaPostFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaPostFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "Post";
    operation: "deleteMany";
    args: GassmaGassmaPostDeleteData;
    query: (args: GassmaGassmaPostDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: (params: {
    model: "Post";
    operation: "count";
    args: GassmaGassmaPostCountData;
    query: (args: GassmaGassmaPostCountData) => number;
  }) => number;
  aggregate?: <T extends GassmaGassmaPostAggregateData>(params: {
    model: "Post";
    operation: "aggregate";
    args: T;
    query: (args: T) => GassmaGassmaPostAggregateResult<T>;
  }) => GassmaGassmaPostAggregateResult<T>;
  groupBy?: <T extends GassmaGassmaPostGroupByData>(params: {
    model: "Post";
    operation: "groupBy";
    args: T;
    query: (args: T) => GassmaGassmaPostGroupByResult<T>[];
  }) => GassmaGassmaPostGroupByResult<T>[];
  $allOperations?: (params: {
    model: "Post";
    operation: GassmaGassmaOperationName;
    args: GassmaGassmaPostQueryArgs;
    query: (args: GassmaGassmaPostQueryArgs) => unknown;
  }) => unknown;
};

export type GassmaGassmaCommentQueryArgs =
  | GassmaGassmaCommentFindFirstData
  | GassmaGassmaCommentFindManyData
  | GassmaGassmaCommentCreateData
  | GassmaGassmaCommentCreateManyData
  | GassmaGassmaCommentCreateManyAndReturnData
  | GassmaGassmaCommentUpdateSingleData
  | GassmaGassmaCommentUpdateData
  | GassmaGassmaCommentUpsertSingleData
  | GassmaGassmaCommentDeleteSingleData
  | GassmaGassmaCommentDeleteData
  | GassmaGassmaCommentCountData
  | GassmaGassmaCommentAggregateData
  | GassmaGassmaCommentGroupByData;

export type GassmaGassmaCommentQueryHooks<GO extends GassmaGassmaCommentOmit = {}, O = {}> = {
  findFirst?: <T extends GassmaGassmaCommentFindFirstData>(params: {
    model: "Comment";
    operation: "findFirst";
    args: T;
    query: (args: T) => GassmaGassmaCommentFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaCommentFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaCommentFindFirstData>(params: {
    model: "Comment";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaCommentFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaCommentFindResult<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaCommentFindManyData>(params: {
    model: "Comment";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaCommentFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaCommentFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaCommentCreateData>(params: {
    model: "Comment";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaCommentFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaCommentFindResult<T["select"], T["include"], T["omit"], GO, O>;
  createMany?: (params: {
    model: "Comment";
    operation: "createMany";
    args: GassmaGassmaCommentCreateManyData;
    query: (args: GassmaGassmaCommentCreateManyData) => CreateManyReturn;
  }) => CreateManyReturn;
  createManyAndReturn?: <T extends GassmaGassmaCommentCreateManyAndReturnData>(params: {
    model: "Comment";
    operation: "createManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaCommentFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaCommentFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaCommentUpdateSingleData>(params: {
    model: "Comment";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaCommentFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaCommentFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "Comment";
    operation: "updateMany";
    args: GassmaGassmaCommentUpdateData;
    query: (args: GassmaGassmaCommentUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: (params: {
    model: "Comment";
    operation: "updateManyAndReturn";
    args: GassmaGassmaCommentUpdateData;
    query: (args: GassmaGassmaCommentUpdateData) => GassmaGassmaCommentFindResult<undefined, undefined, undefined, GO, O>[];
  }) => GassmaGassmaCommentFindResult<undefined, undefined, undefined, GO, O>[];
  upsert?: <T extends GassmaGassmaCommentUpsertSingleData>(params: {
    model: "Comment";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaCommentFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaCommentFindResult<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaCommentDeleteSingleData>(params: {
    model: "Comment";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaCommentFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaCommentFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "Comment";
    operation: "deleteMany";
    args: GassmaGassmaCommentDeleteData;
    query: (args: GassmaGassmaCommentDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: (params: {
    model: "Comment";
    operation: "count";
    args: GassmaGassmaCommentCountData;
    query: (args: GassmaGassmaCommentCountData) => number;
  }) => number;
  aggregate?: <T extends GassmaGassmaCommentAggregateData>(params: {
    model: "Comment";
    operation: "aggregate";
    args: T;
    query: (args: T) => GassmaGassmaCommentAggregateResult<T>;
  }) => GassmaGassmaCommentAggregateResult<T>;
  groupBy?: <T extends GassmaGassmaCommentGroupByData>(params: {
    model: "Comment";
    operation: "groupBy";
    args: T;
    query: (args: T) => GassmaGassmaCommentGroupByResult<T>[];
  }) => GassmaGassmaCommentGroupByResult<T>[];
  $allOperations?: (params: {
    model: "Comment";
    operation: GassmaGassmaOperationName;
    args: GassmaGassmaCommentQueryArgs;
    query: (args: GassmaGassmaCommentQueryArgs) => unknown;
  }) => unknown;
};

export type GassmaGassmaCategoryQueryArgs =
  | GassmaGassmaCategoryFindFirstData
  | GassmaGassmaCategoryFindManyData
  | GassmaGassmaCategoryCreateData
  | GassmaGassmaCategoryCreateManyData
  | GassmaGassmaCategoryCreateManyAndReturnData
  | GassmaGassmaCategoryUpdateSingleData
  | GassmaGassmaCategoryUpdateData
  | GassmaGassmaCategoryUpsertSingleData
  | GassmaGassmaCategoryDeleteSingleData
  | GassmaGassmaCategoryDeleteData
  | GassmaGassmaCategoryCountData
  | GassmaGassmaCategoryAggregateData
  | GassmaGassmaCategoryGroupByData;

export type GassmaGassmaCategoryQueryHooks<GO extends GassmaGassmaCategoryOmit = {}, O = {}> = {
  findFirst?: <T extends GassmaGassmaCategoryFindFirstData>(params: {
    model: "Category";
    operation: "findFirst";
    args: T;
    query: (args: T) => GassmaGassmaCategoryFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaCategoryFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaCategoryFindFirstData>(params: {
    model: "Category";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaCategoryFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaCategoryFindResult<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaCategoryFindManyData>(params: {
    model: "Category";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaCategoryFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaCategoryFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaCategoryCreateData>(params: {
    model: "Category";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaCategoryFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaCategoryFindResult<T["select"], T["include"], T["omit"], GO, O>;
  createMany?: (params: {
    model: "Category";
    operation: "createMany";
    args: GassmaGassmaCategoryCreateManyData;
    query: (args: GassmaGassmaCategoryCreateManyData) => CreateManyReturn;
  }) => CreateManyReturn;
  createManyAndReturn?: <T extends GassmaGassmaCategoryCreateManyAndReturnData>(params: {
    model: "Category";
    operation: "createManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaCategoryFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaCategoryFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaCategoryUpdateSingleData>(params: {
    model: "Category";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaCategoryFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaCategoryFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "Category";
    operation: "updateMany";
    args: GassmaGassmaCategoryUpdateData;
    query: (args: GassmaGassmaCategoryUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: (params: {
    model: "Category";
    operation: "updateManyAndReturn";
    args: GassmaGassmaCategoryUpdateData;
    query: (args: GassmaGassmaCategoryUpdateData) => GassmaGassmaCategoryFindResult<undefined, undefined, undefined, GO, O>[];
  }) => GassmaGassmaCategoryFindResult<undefined, undefined, undefined, GO, O>[];
  upsert?: <T extends GassmaGassmaCategoryUpsertSingleData>(params: {
    model: "Category";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaCategoryFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaCategoryFindResult<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaCategoryDeleteSingleData>(params: {
    model: "Category";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaCategoryFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaCategoryFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "Category";
    operation: "deleteMany";
    args: GassmaGassmaCategoryDeleteData;
    query: (args: GassmaGassmaCategoryDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: (params: {
    model: "Category";
    operation: "count";
    args: GassmaGassmaCategoryCountData;
    query: (args: GassmaGassmaCategoryCountData) => number;
  }) => number;
  aggregate?: <T extends GassmaGassmaCategoryAggregateData>(params: {
    model: "Category";
    operation: "aggregate";
    args: T;
    query: (args: T) => GassmaGassmaCategoryAggregateResult<T>;
  }) => GassmaGassmaCategoryAggregateResult<T>;
  groupBy?: <T extends GassmaGassmaCategoryGroupByData>(params: {
    model: "Category";
    operation: "groupBy";
    args: T;
    query: (args: T) => GassmaGassmaCategoryGroupByResult<T>[];
  }) => GassmaGassmaCategoryGroupByResult<T>[];
  $allOperations?: (params: {
    model: "Category";
    operation: GassmaGassmaOperationName;
    args: GassmaGassmaCategoryQueryArgs;
    query: (args: GassmaGassmaCategoryQueryArgs) => unknown;
  }) => unknown;
};

export type GassmaGassmaTagQueryArgs =
  | GassmaGassmaTagFindFirstData
  | GassmaGassmaTagFindManyData
  | GassmaGassmaTagCreateData
  | GassmaGassmaTagCreateManyData
  | GassmaGassmaTagCreateManyAndReturnData
  | GassmaGassmaTagUpdateSingleData
  | GassmaGassmaTagUpdateData
  | GassmaGassmaTagUpsertSingleData
  | GassmaGassmaTagDeleteSingleData
  | GassmaGassmaTagDeleteData
  | GassmaGassmaTagCountData
  | GassmaGassmaTagAggregateData
  | GassmaGassmaTagGroupByData;

export type GassmaGassmaTagQueryHooks<GO extends GassmaGassmaTagOmit = {}, O = {}> = {
  findFirst?: <T extends GassmaGassmaTagFindFirstData>(params: {
    model: "Tag";
    operation: "findFirst";
    args: T;
    query: (args: T) => GassmaGassmaTagFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaTagFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaTagFindFirstData>(params: {
    model: "Tag";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaTagFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaTagFindResult<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaTagFindManyData>(params: {
    model: "Tag";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaTagFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaTagFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaTagCreateData>(params: {
    model: "Tag";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaTagFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaTagFindResult<T["select"], T["include"], T["omit"], GO, O>;
  createMany?: (params: {
    model: "Tag";
    operation: "createMany";
    args: GassmaGassmaTagCreateManyData;
    query: (args: GassmaGassmaTagCreateManyData) => CreateManyReturn;
  }) => CreateManyReturn;
  createManyAndReturn?: <T extends GassmaGassmaTagCreateManyAndReturnData>(params: {
    model: "Tag";
    operation: "createManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaTagFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaTagFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaTagUpdateSingleData>(params: {
    model: "Tag";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaTagFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaTagFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "Tag";
    operation: "updateMany";
    args: GassmaGassmaTagUpdateData;
    query: (args: GassmaGassmaTagUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: (params: {
    model: "Tag";
    operation: "updateManyAndReturn";
    args: GassmaGassmaTagUpdateData;
    query: (args: GassmaGassmaTagUpdateData) => GassmaGassmaTagFindResult<undefined, undefined, undefined, GO, O>[];
  }) => GassmaGassmaTagFindResult<undefined, undefined, undefined, GO, O>[];
  upsert?: <T extends GassmaGassmaTagUpsertSingleData>(params: {
    model: "Tag";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaTagFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaTagFindResult<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaTagDeleteSingleData>(params: {
    model: "Tag";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaTagFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaTagFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "Tag";
    operation: "deleteMany";
    args: GassmaGassmaTagDeleteData;
    query: (args: GassmaGassmaTagDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: (params: {
    model: "Tag";
    operation: "count";
    args: GassmaGassmaTagCountData;
    query: (args: GassmaGassmaTagCountData) => number;
  }) => number;
  aggregate?: <T extends GassmaGassmaTagAggregateData>(params: {
    model: "Tag";
    operation: "aggregate";
    args: T;
    query: (args: T) => GassmaGassmaTagAggregateResult<T>;
  }) => GassmaGassmaTagAggregateResult<T>;
  groupBy?: <T extends GassmaGassmaTagGroupByData>(params: {
    model: "Tag";
    operation: "groupBy";
    args: T;
    query: (args: T) => GassmaGassmaTagGroupByResult<T>[];
  }) => GassmaGassmaTagGroupByResult<T>[];
  $allOperations?: (params: {
    model: "Tag";
    operation: GassmaGassmaOperationName;
    args: GassmaGassmaTagQueryArgs;
    query: (args: GassmaGassmaTagQueryArgs) => unknown;
  }) => unknown;
};

export type GassmaGassmaProductQueryArgs =
  | GassmaGassmaProductFindFirstData
  | GassmaGassmaProductFindManyData
  | GassmaGassmaProductCreateData
  | GassmaGassmaProductCreateManyData
  | GassmaGassmaProductCreateManyAndReturnData
  | GassmaGassmaProductUpdateSingleData
  | GassmaGassmaProductUpdateData
  | GassmaGassmaProductUpsertSingleData
  | GassmaGassmaProductDeleteSingleData
  | GassmaGassmaProductDeleteData
  | GassmaGassmaProductCountData
  | GassmaGassmaProductAggregateData
  | GassmaGassmaProductGroupByData;

export type GassmaGassmaProductQueryHooks<GO extends GassmaGassmaProductOmit = {}, O = {}> = {
  findFirst?: <T extends GassmaGassmaProductFindFirstData>(params: {
    model: "Product";
    operation: "findFirst";
    args: T;
    query: (args: T) => GassmaGassmaProductFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaProductFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaProductFindFirstData>(params: {
    model: "Product";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaProductFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaProductFindResult<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaProductFindManyData>(params: {
    model: "Product";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaProductFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaProductFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaProductCreateData>(params: {
    model: "Product";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaProductFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaProductFindResult<T["select"], T["include"], T["omit"], GO, O>;
  createMany?: (params: {
    model: "Product";
    operation: "createMany";
    args: GassmaGassmaProductCreateManyData;
    query: (args: GassmaGassmaProductCreateManyData) => CreateManyReturn;
  }) => CreateManyReturn;
  createManyAndReturn?: <T extends GassmaGassmaProductCreateManyAndReturnData>(params: {
    model: "Product";
    operation: "createManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaProductFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaProductFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaProductUpdateSingleData>(params: {
    model: "Product";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaProductFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaProductFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "Product";
    operation: "updateMany";
    args: GassmaGassmaProductUpdateData;
    query: (args: GassmaGassmaProductUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: (params: {
    model: "Product";
    operation: "updateManyAndReturn";
    args: GassmaGassmaProductUpdateData;
    query: (args: GassmaGassmaProductUpdateData) => GassmaGassmaProductFindResult<undefined, undefined, undefined, GO, O>[];
  }) => GassmaGassmaProductFindResult<undefined, undefined, undefined, GO, O>[];
  upsert?: <T extends GassmaGassmaProductUpsertSingleData>(params: {
    model: "Product";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaProductFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaProductFindResult<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaProductDeleteSingleData>(params: {
    model: "Product";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaProductFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaProductFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "Product";
    operation: "deleteMany";
    args: GassmaGassmaProductDeleteData;
    query: (args: GassmaGassmaProductDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: (params: {
    model: "Product";
    operation: "count";
    args: GassmaGassmaProductCountData;
    query: (args: GassmaGassmaProductCountData) => number;
  }) => number;
  aggregate?: <T extends GassmaGassmaProductAggregateData>(params: {
    model: "Product";
    operation: "aggregate";
    args: T;
    query: (args: T) => GassmaGassmaProductAggregateResult<T>;
  }) => GassmaGassmaProductAggregateResult<T>;
  groupBy?: <T extends GassmaGassmaProductGroupByData>(params: {
    model: "Product";
    operation: "groupBy";
    args: T;
    query: (args: T) => GassmaGassmaProductGroupByResult<T>[];
  }) => GassmaGassmaProductGroupByResult<T>[];
  $allOperations?: (params: {
    model: "Product";
    operation: GassmaGassmaOperationName;
    args: GassmaGassmaProductQueryArgs;
    query: (args: GassmaGassmaProductQueryArgs) => unknown;
  }) => unknown;
};

export type GassmaGassmaOrderQueryArgs =
  | GassmaGassmaOrderFindFirstData
  | GassmaGassmaOrderFindManyData
  | GassmaGassmaOrderCreateData
  | GassmaGassmaOrderCreateManyData
  | GassmaGassmaOrderCreateManyAndReturnData
  | GassmaGassmaOrderUpdateSingleData
  | GassmaGassmaOrderUpdateData
  | GassmaGassmaOrderUpsertSingleData
  | GassmaGassmaOrderDeleteSingleData
  | GassmaGassmaOrderDeleteData
  | GassmaGassmaOrderCountData
  | GassmaGassmaOrderAggregateData
  | GassmaGassmaOrderGroupByData;

export type GassmaGassmaOrderQueryHooks<GO extends GassmaGassmaOrderOmit = {}, O = {}> = {
  findFirst?: <T extends GassmaGassmaOrderFindFirstData>(params: {
    model: "Order";
    operation: "findFirst";
    args: T;
    query: (args: T) => GassmaGassmaOrderFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaOrderFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaOrderFindFirstData>(params: {
    model: "Order";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaOrderFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaOrderFindResult<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaOrderFindManyData>(params: {
    model: "Order";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaOrderFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaOrderFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaOrderCreateData>(params: {
    model: "Order";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaOrderFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaOrderFindResult<T["select"], T["include"], T["omit"], GO, O>;
  createMany?: (params: {
    model: "Order";
    operation: "createMany";
    args: GassmaGassmaOrderCreateManyData;
    query: (args: GassmaGassmaOrderCreateManyData) => CreateManyReturn;
  }) => CreateManyReturn;
  createManyAndReturn?: <T extends GassmaGassmaOrderCreateManyAndReturnData>(params: {
    model: "Order";
    operation: "createManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaOrderFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaOrderFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaOrderUpdateSingleData>(params: {
    model: "Order";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaOrderFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaOrderFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "Order";
    operation: "updateMany";
    args: GassmaGassmaOrderUpdateData;
    query: (args: GassmaGassmaOrderUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: (params: {
    model: "Order";
    operation: "updateManyAndReturn";
    args: GassmaGassmaOrderUpdateData;
    query: (args: GassmaGassmaOrderUpdateData) => GassmaGassmaOrderFindResult<undefined, undefined, undefined, GO, O>[];
  }) => GassmaGassmaOrderFindResult<undefined, undefined, undefined, GO, O>[];
  upsert?: <T extends GassmaGassmaOrderUpsertSingleData>(params: {
    model: "Order";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaOrderFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaOrderFindResult<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaOrderDeleteSingleData>(params: {
    model: "Order";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaOrderFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaOrderFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "Order";
    operation: "deleteMany";
    args: GassmaGassmaOrderDeleteData;
    query: (args: GassmaGassmaOrderDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: (params: {
    model: "Order";
    operation: "count";
    args: GassmaGassmaOrderCountData;
    query: (args: GassmaGassmaOrderCountData) => number;
  }) => number;
  aggregate?: <T extends GassmaGassmaOrderAggregateData>(params: {
    model: "Order";
    operation: "aggregate";
    args: T;
    query: (args: T) => GassmaGassmaOrderAggregateResult<T>;
  }) => GassmaGassmaOrderAggregateResult<T>;
  groupBy?: <T extends GassmaGassmaOrderGroupByData>(params: {
    model: "Order";
    operation: "groupBy";
    args: T;
    query: (args: T) => GassmaGassmaOrderGroupByResult<T>[];
  }) => GassmaGassmaOrderGroupByResult<T>[];
  $allOperations?: (params: {
    model: "Order";
    operation: GassmaGassmaOperationName;
    args: GassmaGassmaOrderQueryArgs;
    query: (args: GassmaGassmaOrderQueryArgs) => unknown;
  }) => unknown;
};

export type GassmaGassmaOrderItemQueryArgs =
  | GassmaGassmaOrderItemFindFirstData
  | GassmaGassmaOrderItemFindManyData
  | GassmaGassmaOrderItemCreateData
  | GassmaGassmaOrderItemCreateManyData
  | GassmaGassmaOrderItemCreateManyAndReturnData
  | GassmaGassmaOrderItemUpdateSingleData
  | GassmaGassmaOrderItemUpdateData
  | GassmaGassmaOrderItemUpsertSingleData
  | GassmaGassmaOrderItemDeleteSingleData
  | GassmaGassmaOrderItemDeleteData
  | GassmaGassmaOrderItemCountData
  | GassmaGassmaOrderItemAggregateData
  | GassmaGassmaOrderItemGroupByData;

export type GassmaGassmaOrderItemQueryHooks<GO extends GassmaGassmaOrderItemOmit = {}, O = {}> = {
  findFirst?: <T extends GassmaGassmaOrderItemFindFirstData>(params: {
    model: "OrderItem";
    operation: "findFirst";
    args: T;
    query: (args: T) => GassmaGassmaOrderItemFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaOrderItemFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaOrderItemFindFirstData>(params: {
    model: "OrderItem";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaOrderItemFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaOrderItemFindResult<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaOrderItemFindManyData>(params: {
    model: "OrderItem";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaOrderItemFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaOrderItemFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaOrderItemCreateData>(params: {
    model: "OrderItem";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaOrderItemFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaOrderItemFindResult<T["select"], T["include"], T["omit"], GO, O>;
  createMany?: (params: {
    model: "OrderItem";
    operation: "createMany";
    args: GassmaGassmaOrderItemCreateManyData;
    query: (args: GassmaGassmaOrderItemCreateManyData) => CreateManyReturn;
  }) => CreateManyReturn;
  createManyAndReturn?: <T extends GassmaGassmaOrderItemCreateManyAndReturnData>(params: {
    model: "OrderItem";
    operation: "createManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaOrderItemFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaOrderItemFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaOrderItemUpdateSingleData>(params: {
    model: "OrderItem";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaOrderItemFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaOrderItemFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "OrderItem";
    operation: "updateMany";
    args: GassmaGassmaOrderItemUpdateData;
    query: (args: GassmaGassmaOrderItemUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: (params: {
    model: "OrderItem";
    operation: "updateManyAndReturn";
    args: GassmaGassmaOrderItemUpdateData;
    query: (args: GassmaGassmaOrderItemUpdateData) => GassmaGassmaOrderItemFindResult<undefined, undefined, undefined, GO, O>[];
  }) => GassmaGassmaOrderItemFindResult<undefined, undefined, undefined, GO, O>[];
  upsert?: <T extends GassmaGassmaOrderItemUpsertSingleData>(params: {
    model: "OrderItem";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaOrderItemFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaOrderItemFindResult<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaOrderItemDeleteSingleData>(params: {
    model: "OrderItem";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaOrderItemFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaOrderItemFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "OrderItem";
    operation: "deleteMany";
    args: GassmaGassmaOrderItemDeleteData;
    query: (args: GassmaGassmaOrderItemDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: (params: {
    model: "OrderItem";
    operation: "count";
    args: GassmaGassmaOrderItemCountData;
    query: (args: GassmaGassmaOrderItemCountData) => number;
  }) => number;
  aggregate?: <T extends GassmaGassmaOrderItemAggregateData>(params: {
    model: "OrderItem";
    operation: "aggregate";
    args: T;
    query: (args: T) => GassmaGassmaOrderItemAggregateResult<T>;
  }) => GassmaGassmaOrderItemAggregateResult<T>;
  groupBy?: <T extends GassmaGassmaOrderItemGroupByData>(params: {
    model: "OrderItem";
    operation: "groupBy";
    args: T;
    query: (args: T) => GassmaGassmaOrderItemGroupByResult<T>[];
  }) => GassmaGassmaOrderItemGroupByResult<T>[];
  $allOperations?: (params: {
    model: "OrderItem";
    operation: GassmaGassmaOperationName;
    args: GassmaGassmaOrderItemQueryArgs;
    query: (args: GassmaGassmaOrderItemQueryArgs) => unknown;
  }) => unknown;
};

export type GassmaGassmaFormulaCellQueryArgs =
  | GassmaGassmaFormulaCellFindFirstData
  | GassmaGassmaFormulaCellFindManyData
  | GassmaGassmaFormulaCellCreateData
  | GassmaGassmaFormulaCellCreateManyData
  | GassmaGassmaFormulaCellCreateManyAndReturnData
  | GassmaGassmaFormulaCellUpdateSingleData
  | GassmaGassmaFormulaCellUpdateData
  | GassmaGassmaFormulaCellUpsertSingleData
  | GassmaGassmaFormulaCellDeleteSingleData
  | GassmaGassmaFormulaCellDeleteData
  | GassmaGassmaFormulaCellCountData
  | GassmaGassmaFormulaCellAggregateData
  | GassmaGassmaFormulaCellGroupByData;

export type GassmaGassmaFormulaCellQueryHooks<GO extends GassmaGassmaFormulaCellOmit = {}, O = {}> = {
  findFirst?: <T extends GassmaGassmaFormulaCellFindFirstData>(params: {
    model: "FormulaCell";
    operation: "findFirst";
    args: T;
    query: (args: T) => GassmaGassmaFormulaCellFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaFormulaCellFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaFormulaCellFindFirstData>(params: {
    model: "FormulaCell";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaFormulaCellFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaFormulaCellFindResult<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaFormulaCellFindManyData>(params: {
    model: "FormulaCell";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaFormulaCellFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaFormulaCellFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaFormulaCellCreateData>(params: {
    model: "FormulaCell";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaFormulaCellFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaFormulaCellFindResult<T["select"], T["include"], T["omit"], GO, O>;
  createMany?: (params: {
    model: "FormulaCell";
    operation: "createMany";
    args: GassmaGassmaFormulaCellCreateManyData;
    query: (args: GassmaGassmaFormulaCellCreateManyData) => CreateManyReturn;
  }) => CreateManyReturn;
  createManyAndReturn?: <T extends GassmaGassmaFormulaCellCreateManyAndReturnData>(params: {
    model: "FormulaCell";
    operation: "createManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaFormulaCellFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaFormulaCellFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaFormulaCellUpdateSingleData>(params: {
    model: "FormulaCell";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaFormulaCellFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaFormulaCellFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "FormulaCell";
    operation: "updateMany";
    args: GassmaGassmaFormulaCellUpdateData;
    query: (args: GassmaGassmaFormulaCellUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: (params: {
    model: "FormulaCell";
    operation: "updateManyAndReturn";
    args: GassmaGassmaFormulaCellUpdateData;
    query: (args: GassmaGassmaFormulaCellUpdateData) => GassmaGassmaFormulaCellFindResult<undefined, undefined, undefined, GO, O>[];
  }) => GassmaGassmaFormulaCellFindResult<undefined, undefined, undefined, GO, O>[];
  upsert?: <T extends GassmaGassmaFormulaCellUpsertSingleData>(params: {
    model: "FormulaCell";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaFormulaCellFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaFormulaCellFindResult<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaFormulaCellDeleteSingleData>(params: {
    model: "FormulaCell";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaFormulaCellFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaFormulaCellFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "FormulaCell";
    operation: "deleteMany";
    args: GassmaGassmaFormulaCellDeleteData;
    query: (args: GassmaGassmaFormulaCellDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: (params: {
    model: "FormulaCell";
    operation: "count";
    args: GassmaGassmaFormulaCellCountData;
    query: (args: GassmaGassmaFormulaCellCountData) => number;
  }) => number;
  aggregate?: <T extends GassmaGassmaFormulaCellAggregateData>(params: {
    model: "FormulaCell";
    operation: "aggregate";
    args: T;
    query: (args: T) => GassmaGassmaFormulaCellAggregateResult<T>;
  }) => GassmaGassmaFormulaCellAggregateResult<T>;
  groupBy?: <T extends GassmaGassmaFormulaCellGroupByData>(params: {
    model: "FormulaCell";
    operation: "groupBy";
    args: T;
    query: (args: T) => GassmaGassmaFormulaCellGroupByResult<T>[];
  }) => GassmaGassmaFormulaCellGroupByResult<T>[];
  $allOperations?: (params: {
    model: "FormulaCell";
    operation: GassmaGassmaOperationName;
    args: GassmaGassmaFormulaCellQueryArgs;
    query: (args: GassmaGassmaFormulaCellQueryArgs) => unknown;
  }) => unknown;
};

export type GassmaGassmaNotificationQueryArgs =
  | GassmaGassmaNotificationFindFirstData
  | GassmaGassmaNotificationFindManyData
  | GassmaGassmaNotificationCreateData
  | GassmaGassmaNotificationCreateManyData
  | GassmaGassmaNotificationCreateManyAndReturnData
  | GassmaGassmaNotificationUpdateSingleData
  | GassmaGassmaNotificationUpdateData
  | GassmaGassmaNotificationUpsertSingleData
  | GassmaGassmaNotificationDeleteSingleData
  | GassmaGassmaNotificationDeleteData
  | GassmaGassmaNotificationCountData
  | GassmaGassmaNotificationAggregateData
  | GassmaGassmaNotificationGroupByData;

export type GassmaGassmaNotificationQueryHooks<GO extends GassmaGassmaNotificationOmit = {}, O = {}> = {
  findFirst?: <T extends GassmaGassmaNotificationFindFirstData>(params: {
    model: "Notification";
    operation: "findFirst";
    args: T;
    query: (args: T) => GassmaGassmaNotificationFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaNotificationFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaNotificationFindFirstData>(params: {
    model: "Notification";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaNotificationFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaNotificationFindResult<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaNotificationFindManyData>(params: {
    model: "Notification";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaNotificationFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaNotificationFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaNotificationCreateData>(params: {
    model: "Notification";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaNotificationFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaNotificationFindResult<T["select"], T["include"], T["omit"], GO, O>;
  createMany?: (params: {
    model: "Notification";
    operation: "createMany";
    args: GassmaGassmaNotificationCreateManyData;
    query: (args: GassmaGassmaNotificationCreateManyData) => CreateManyReturn;
  }) => CreateManyReturn;
  createManyAndReturn?: <T extends GassmaGassmaNotificationCreateManyAndReturnData>(params: {
    model: "Notification";
    operation: "createManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaNotificationFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaNotificationFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaNotificationUpdateSingleData>(params: {
    model: "Notification";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaNotificationFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaNotificationFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "Notification";
    operation: "updateMany";
    args: GassmaGassmaNotificationUpdateData;
    query: (args: GassmaGassmaNotificationUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: (params: {
    model: "Notification";
    operation: "updateManyAndReturn";
    args: GassmaGassmaNotificationUpdateData;
    query: (args: GassmaGassmaNotificationUpdateData) => GassmaGassmaNotificationFindResult<undefined, undefined, undefined, GO, O>[];
  }) => GassmaGassmaNotificationFindResult<undefined, undefined, undefined, GO, O>[];
  upsert?: <T extends GassmaGassmaNotificationUpsertSingleData>(params: {
    model: "Notification";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaNotificationFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaNotificationFindResult<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaNotificationDeleteSingleData>(params: {
    model: "Notification";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaNotificationFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaNotificationFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "Notification";
    operation: "deleteMany";
    args: GassmaGassmaNotificationDeleteData;
    query: (args: GassmaGassmaNotificationDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: (params: {
    model: "Notification";
    operation: "count";
    args: GassmaGassmaNotificationCountData;
    query: (args: GassmaGassmaNotificationCountData) => number;
  }) => number;
  aggregate?: <T extends GassmaGassmaNotificationAggregateData>(params: {
    model: "Notification";
    operation: "aggregate";
    args: T;
    query: (args: T) => GassmaGassmaNotificationAggregateResult<T>;
  }) => GassmaGassmaNotificationAggregateResult<T>;
  groupBy?: <T extends GassmaGassmaNotificationGroupByData>(params: {
    model: "Notification";
    operation: "groupBy";
    args: T;
    query: (args: T) => GassmaGassmaNotificationGroupByResult<T>[];
  }) => GassmaGassmaNotificationGroupByResult<T>[];
  $allOperations?: (params: {
    model: "Notification";
    operation: GassmaGassmaOperationName;
    args: GassmaGassmaNotificationQueryArgs;
    query: (args: GassmaGassmaNotificationQueryArgs) => unknown;
  }) => unknown;
};

export type GassmaGassmaOffsetNoteQueryArgs =
  | GassmaGassmaOffsetNoteFindFirstData
  | GassmaGassmaOffsetNoteFindManyData
  | GassmaGassmaOffsetNoteCreateData
  | GassmaGassmaOffsetNoteCreateManyData
  | GassmaGassmaOffsetNoteCreateManyAndReturnData
  | GassmaGassmaOffsetNoteUpdateSingleData
  | GassmaGassmaOffsetNoteUpdateData
  | GassmaGassmaOffsetNoteUpsertSingleData
  | GassmaGassmaOffsetNoteDeleteSingleData
  | GassmaGassmaOffsetNoteDeleteData
  | GassmaGassmaOffsetNoteCountData
  | GassmaGassmaOffsetNoteAggregateData
  | GassmaGassmaOffsetNoteGroupByData;

export type GassmaGassmaOffsetNoteQueryHooks<GO extends GassmaGassmaOffsetNoteOmit = {}, O = {}> = {
  findFirst?: <T extends GassmaGassmaOffsetNoteFindFirstData>(params: {
    model: "OffsetNote";
    operation: "findFirst";
    args: T;
    query: (args: T) => GassmaGassmaOffsetNoteFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaOffsetNoteFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaOffsetNoteFindFirstData>(params: {
    model: "OffsetNote";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaOffsetNoteFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaOffsetNoteFindResult<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaOffsetNoteFindManyData>(params: {
    model: "OffsetNote";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaOffsetNoteFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaOffsetNoteFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaOffsetNoteCreateData>(params: {
    model: "OffsetNote";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaOffsetNoteFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaOffsetNoteFindResult<T["select"], T["include"], T["omit"], GO, O>;
  createMany?: (params: {
    model: "OffsetNote";
    operation: "createMany";
    args: GassmaGassmaOffsetNoteCreateManyData;
    query: (args: GassmaGassmaOffsetNoteCreateManyData) => CreateManyReturn;
  }) => CreateManyReturn;
  createManyAndReturn?: <T extends GassmaGassmaOffsetNoteCreateManyAndReturnData>(params: {
    model: "OffsetNote";
    operation: "createManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaOffsetNoteFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaOffsetNoteFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaOffsetNoteUpdateSingleData>(params: {
    model: "OffsetNote";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaOffsetNoteFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaOffsetNoteFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "OffsetNote";
    operation: "updateMany";
    args: GassmaGassmaOffsetNoteUpdateData;
    query: (args: GassmaGassmaOffsetNoteUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: (params: {
    model: "OffsetNote";
    operation: "updateManyAndReturn";
    args: GassmaGassmaOffsetNoteUpdateData;
    query: (args: GassmaGassmaOffsetNoteUpdateData) => GassmaGassmaOffsetNoteFindResult<undefined, undefined, undefined, GO, O>[];
  }) => GassmaGassmaOffsetNoteFindResult<undefined, undefined, undefined, GO, O>[];
  upsert?: <T extends GassmaGassmaOffsetNoteUpsertSingleData>(params: {
    model: "OffsetNote";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaOffsetNoteFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaOffsetNoteFindResult<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaOffsetNoteDeleteSingleData>(params: {
    model: "OffsetNote";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaOffsetNoteFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaOffsetNoteFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "OffsetNote";
    operation: "deleteMany";
    args: GassmaGassmaOffsetNoteDeleteData;
    query: (args: GassmaGassmaOffsetNoteDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: (params: {
    model: "OffsetNote";
    operation: "count";
    args: GassmaGassmaOffsetNoteCountData;
    query: (args: GassmaGassmaOffsetNoteCountData) => number;
  }) => number;
  aggregate?: <T extends GassmaGassmaOffsetNoteAggregateData>(params: {
    model: "OffsetNote";
    operation: "aggregate";
    args: T;
    query: (args: T) => GassmaGassmaOffsetNoteAggregateResult<T>;
  }) => GassmaGassmaOffsetNoteAggregateResult<T>;
  groupBy?: <T extends GassmaGassmaOffsetNoteGroupByData>(params: {
    model: "OffsetNote";
    operation: "groupBy";
    args: T;
    query: (args: T) => GassmaGassmaOffsetNoteGroupByResult<T>[];
  }) => GassmaGassmaOffsetNoteGroupByResult<T>[];
  $allOperations?: (params: {
    model: "OffsetNote";
    operation: GassmaGassmaOperationName;
    args: GassmaGassmaOffsetNoteQueryArgs;
    query: (args: GassmaGassmaOffsetNoteQueryArgs) => unknown;
  }) => unknown;
};

export type GassmaGassmaUserQueryArgs =
  | GassmaGassmaUserFindFirstData
  | GassmaGassmaUserFindManyData
  | GassmaGassmaUserCreateData
  | GassmaGassmaUserCreateManyData
  | GassmaGassmaUserCreateManyAndReturnData
  | GassmaGassmaUserUpdateSingleData
  | GassmaGassmaUserUpdateData
  | GassmaGassmaUserUpsertSingleData
  | GassmaGassmaUserDeleteSingleData
  | GassmaGassmaUserDeleteData
  | GassmaGassmaUserCountData
  | GassmaGassmaUserAggregateData
  | GassmaGassmaUserGroupByData;

export type GassmaGassmaUserQueryHooks<GO extends GassmaGassmaUserOmit = {}, O = {}> = {
  findFirst?: <T extends GassmaGassmaUserFindFirstData>(params: {
    model: "User";
    operation: "findFirst";
    args: T;
    query: (args: T) => GassmaGassmaUserFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaUserFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaUserFindFirstData>(params: {
    model: "User";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaUserFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaUserFindResult<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaUserFindManyData>(params: {
    model: "User";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaUserFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaUserFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaUserCreateData>(params: {
    model: "User";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaUserFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaUserFindResult<T["select"], T["include"], T["omit"], GO, O>;
  createMany?: (params: {
    model: "User";
    operation: "createMany";
    args: GassmaGassmaUserCreateManyData;
    query: (args: GassmaGassmaUserCreateManyData) => CreateManyReturn;
  }) => CreateManyReturn;
  createManyAndReturn?: <T extends GassmaGassmaUserCreateManyAndReturnData>(params: {
    model: "User";
    operation: "createManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaUserFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaUserFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaUserUpdateSingleData>(params: {
    model: "User";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaUserFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaUserFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "User";
    operation: "updateMany";
    args: GassmaGassmaUserUpdateData;
    query: (args: GassmaGassmaUserUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: (params: {
    model: "User";
    operation: "updateManyAndReturn";
    args: GassmaGassmaUserUpdateData;
    query: (args: GassmaGassmaUserUpdateData) => GassmaGassmaUserFindResult<undefined, undefined, undefined, GO, O>[];
  }) => GassmaGassmaUserFindResult<undefined, undefined, undefined, GO, O>[];
  upsert?: <T extends GassmaGassmaUserUpsertSingleData>(params: {
    model: "User";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaUserFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaUserFindResult<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaUserDeleteSingleData>(params: {
    model: "User";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaUserFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaUserFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "User";
    operation: "deleteMany";
    args: GassmaGassmaUserDeleteData;
    query: (args: GassmaGassmaUserDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: (params: {
    model: "User";
    operation: "count";
    args: GassmaGassmaUserCountData;
    query: (args: GassmaGassmaUserCountData) => number;
  }) => number;
  aggregate?: <T extends GassmaGassmaUserAggregateData>(params: {
    model: "User";
    operation: "aggregate";
    args: T;
    query: (args: T) => GassmaGassmaUserAggregateResult<T>;
  }) => GassmaGassmaUserAggregateResult<T>;
  groupBy?: <T extends GassmaGassmaUserGroupByData>(params: {
    model: "User";
    operation: "groupBy";
    args: T;
    query: (args: T) => GassmaGassmaUserGroupByResult<T>[];
  }) => GassmaGassmaUserGroupByResult<T>[];
  $allOperations?: (params: {
    model: "User";
    operation: GassmaGassmaOperationName;
    args: GassmaGassmaUserQueryArgs;
    query: (args: GassmaGassmaUserQueryArgs) => unknown;
  }) => unknown;
};

export type GassmaGassmaProfileQueryArgs =
  | GassmaGassmaProfileFindFirstData
  | GassmaGassmaProfileFindManyData
  | GassmaGassmaProfileCreateData
  | GassmaGassmaProfileCreateManyData
  | GassmaGassmaProfileCreateManyAndReturnData
  | GassmaGassmaProfileUpdateSingleData
  | GassmaGassmaProfileUpdateData
  | GassmaGassmaProfileUpsertSingleData
  | GassmaGassmaProfileDeleteSingleData
  | GassmaGassmaProfileDeleteData
  | GassmaGassmaProfileCountData
  | GassmaGassmaProfileAggregateData
  | GassmaGassmaProfileGroupByData;

export type GassmaGassmaProfileQueryHooks<GO extends GassmaGassmaProfileOmit = {}, O = {}> = {
  findFirst?: <T extends GassmaGassmaProfileFindFirstData>(params: {
    model: "Profile";
    operation: "findFirst";
    args: T;
    query: (args: T) => GassmaGassmaProfileFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaProfileFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaProfileFindFirstData>(params: {
    model: "Profile";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaProfileFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaProfileFindResult<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaProfileFindManyData>(params: {
    model: "Profile";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaProfileFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaProfileFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaProfileCreateData>(params: {
    model: "Profile";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaProfileFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaProfileFindResult<T["select"], T["include"], T["omit"], GO, O>;
  createMany?: (params: {
    model: "Profile";
    operation: "createMany";
    args: GassmaGassmaProfileCreateManyData;
    query: (args: GassmaGassmaProfileCreateManyData) => CreateManyReturn;
  }) => CreateManyReturn;
  createManyAndReturn?: <T extends GassmaGassmaProfileCreateManyAndReturnData>(params: {
    model: "Profile";
    operation: "createManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaProfileFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaProfileFindResult<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaProfileUpdateSingleData>(params: {
    model: "Profile";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaProfileFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaProfileFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "Profile";
    operation: "updateMany";
    args: GassmaGassmaProfileUpdateData;
    query: (args: GassmaGassmaProfileUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: (params: {
    model: "Profile";
    operation: "updateManyAndReturn";
    args: GassmaGassmaProfileUpdateData;
    query: (args: GassmaGassmaProfileUpdateData) => GassmaGassmaProfileFindResult<undefined, undefined, undefined, GO, O>[];
  }) => GassmaGassmaProfileFindResult<undefined, undefined, undefined, GO, O>[];
  upsert?: <T extends GassmaGassmaProfileUpsertSingleData>(params: {
    model: "Profile";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaProfileFindResult<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaProfileFindResult<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaProfileDeleteSingleData>(params: {
    model: "Profile";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaProfileFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaProfileFindResult<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "Profile";
    operation: "deleteMany";
    args: GassmaGassmaProfileDeleteData;
    query: (args: GassmaGassmaProfileDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: (params: {
    model: "Profile";
    operation: "count";
    args: GassmaGassmaProfileCountData;
    query: (args: GassmaGassmaProfileCountData) => number;
  }) => number;
  aggregate?: <T extends GassmaGassmaProfileAggregateData>(params: {
    model: "Profile";
    operation: "aggregate";
    args: T;
    query: (args: T) => GassmaGassmaProfileAggregateResult<T>;
  }) => GassmaGassmaProfileAggregateResult<T>;
  groupBy?: <T extends GassmaGassmaProfileGroupByData>(params: {
    model: "Profile";
    operation: "groupBy";
    args: T;
    query: (args: T) => GassmaGassmaProfileGroupByResult<T>[];
  }) => GassmaGassmaProfileGroupByResult<T>[];
  $allOperations?: (params: {
    model: "Profile";
    operation: GassmaGassmaOperationName;
    args: GassmaGassmaProfileQueryArgs;
    query: (args: GassmaGassmaProfileQueryArgs) => unknown;
  }) => unknown;
};

export type GassmaGassmaQueryArgs =
  | GassmaGassmaPostQueryArgs
  | GassmaGassmaCommentQueryArgs
  | GassmaGassmaCategoryQueryArgs
  | GassmaGassmaTagQueryArgs
  | GassmaGassmaProductQueryArgs
  | GassmaGassmaOrderQueryArgs
  | GassmaGassmaOrderItemQueryArgs
  | GassmaGassmaFormulaCellQueryArgs
  | GassmaGassmaNotificationQueryArgs
  | GassmaGassmaOffsetNoteQueryArgs
  | GassmaGassmaUserQueryArgs
  | GassmaGassmaProfileQueryArgs;

export type GassmaGassmaAllModelsQueryHooks = {
  findFirst?: (params: {
    model: GassmaGassmaModelName;
    operation: "findFirst";
    args: GassmaGassmaPostFindFirstData | GassmaGassmaCommentFindFirstData | GassmaGassmaCategoryFindFirstData | GassmaGassmaTagFindFirstData | GassmaGassmaProductFindFirstData | GassmaGassmaOrderFindFirstData | GassmaGassmaOrderItemFindFirstData | GassmaGassmaFormulaCellFindFirstData | GassmaGassmaNotificationFindFirstData | GassmaGassmaOffsetNoteFindFirstData | GassmaGassmaUserFindFirstData | GassmaGassmaProfileFindFirstData;
    query: (args: GassmaGassmaPostFindFirstData | GassmaGassmaCommentFindFirstData | GassmaGassmaCategoryFindFirstData | GassmaGassmaTagFindFirstData | GassmaGassmaProductFindFirstData | GassmaGassmaOrderFindFirstData | GassmaGassmaOrderItemFindFirstData | GassmaGassmaFormulaCellFindFirstData | GassmaGassmaNotificationFindFirstData | GassmaGassmaOffsetNoteFindFirstData | GassmaGassmaUserFindFirstData | GassmaGassmaProfileFindFirstData) => unknown;
  }) => unknown;
  findFirstOrThrow?: (params: {
    model: GassmaGassmaModelName;
    operation: "findFirstOrThrow";
    args: GassmaGassmaPostFindFirstData | GassmaGassmaCommentFindFirstData | GassmaGassmaCategoryFindFirstData | GassmaGassmaTagFindFirstData | GassmaGassmaProductFindFirstData | GassmaGassmaOrderFindFirstData | GassmaGassmaOrderItemFindFirstData | GassmaGassmaFormulaCellFindFirstData | GassmaGassmaNotificationFindFirstData | GassmaGassmaOffsetNoteFindFirstData | GassmaGassmaUserFindFirstData | GassmaGassmaProfileFindFirstData;
    query: (args: GassmaGassmaPostFindFirstData | GassmaGassmaCommentFindFirstData | GassmaGassmaCategoryFindFirstData | GassmaGassmaTagFindFirstData | GassmaGassmaProductFindFirstData | GassmaGassmaOrderFindFirstData | GassmaGassmaOrderItemFindFirstData | GassmaGassmaFormulaCellFindFirstData | GassmaGassmaNotificationFindFirstData | GassmaGassmaOffsetNoteFindFirstData | GassmaGassmaUserFindFirstData | GassmaGassmaProfileFindFirstData) => unknown;
  }) => unknown;
  findMany?: (params: {
    model: GassmaGassmaModelName;
    operation: "findMany";
    args: GassmaGassmaPostFindManyData | GassmaGassmaCommentFindManyData | GassmaGassmaCategoryFindManyData | GassmaGassmaTagFindManyData | GassmaGassmaProductFindManyData | GassmaGassmaOrderFindManyData | GassmaGassmaOrderItemFindManyData | GassmaGassmaFormulaCellFindManyData | GassmaGassmaNotificationFindManyData | GassmaGassmaOffsetNoteFindManyData | GassmaGassmaUserFindManyData | GassmaGassmaProfileFindManyData;
    query: (args: GassmaGassmaPostFindManyData | GassmaGassmaCommentFindManyData | GassmaGassmaCategoryFindManyData | GassmaGassmaTagFindManyData | GassmaGassmaProductFindManyData | GassmaGassmaOrderFindManyData | GassmaGassmaOrderItemFindManyData | GassmaGassmaFormulaCellFindManyData | GassmaGassmaNotificationFindManyData | GassmaGassmaOffsetNoteFindManyData | GassmaGassmaUserFindManyData | GassmaGassmaProfileFindManyData) => unknown;
  }) => unknown;
  create?: (params: {
    model: GassmaGassmaModelName;
    operation: "create";
    args: GassmaGassmaPostCreateData | GassmaGassmaCommentCreateData | GassmaGassmaCategoryCreateData | GassmaGassmaTagCreateData | GassmaGassmaProductCreateData | GassmaGassmaOrderCreateData | GassmaGassmaOrderItemCreateData | GassmaGassmaFormulaCellCreateData | GassmaGassmaNotificationCreateData | GassmaGassmaOffsetNoteCreateData | GassmaGassmaUserCreateData | GassmaGassmaProfileCreateData;
    query: (args: GassmaGassmaPostCreateData | GassmaGassmaCommentCreateData | GassmaGassmaCategoryCreateData | GassmaGassmaTagCreateData | GassmaGassmaProductCreateData | GassmaGassmaOrderCreateData | GassmaGassmaOrderItemCreateData | GassmaGassmaFormulaCellCreateData | GassmaGassmaNotificationCreateData | GassmaGassmaOffsetNoteCreateData | GassmaGassmaUserCreateData | GassmaGassmaProfileCreateData) => unknown;
  }) => unknown;
  createMany?: (params: {
    model: GassmaGassmaModelName;
    operation: "createMany";
    args: GassmaGassmaPostCreateManyData | GassmaGassmaCommentCreateManyData | GassmaGassmaCategoryCreateManyData | GassmaGassmaTagCreateManyData | GassmaGassmaProductCreateManyData | GassmaGassmaOrderCreateManyData | GassmaGassmaOrderItemCreateManyData | GassmaGassmaFormulaCellCreateManyData | GassmaGassmaNotificationCreateManyData | GassmaGassmaOffsetNoteCreateManyData | GassmaGassmaUserCreateManyData | GassmaGassmaProfileCreateManyData;
    query: (args: GassmaGassmaPostCreateManyData | GassmaGassmaCommentCreateManyData | GassmaGassmaCategoryCreateManyData | GassmaGassmaTagCreateManyData | GassmaGassmaProductCreateManyData | GassmaGassmaOrderCreateManyData | GassmaGassmaOrderItemCreateManyData | GassmaGassmaFormulaCellCreateManyData | GassmaGassmaNotificationCreateManyData | GassmaGassmaOffsetNoteCreateManyData | GassmaGassmaUserCreateManyData | GassmaGassmaProfileCreateManyData) => unknown;
  }) => unknown;
  createManyAndReturn?: (params: {
    model: GassmaGassmaModelName;
    operation: "createManyAndReturn";
    args: GassmaGassmaPostCreateManyAndReturnData | GassmaGassmaCommentCreateManyAndReturnData | GassmaGassmaCategoryCreateManyAndReturnData | GassmaGassmaTagCreateManyAndReturnData | GassmaGassmaProductCreateManyAndReturnData | GassmaGassmaOrderCreateManyAndReturnData | GassmaGassmaOrderItemCreateManyAndReturnData | GassmaGassmaFormulaCellCreateManyAndReturnData | GassmaGassmaNotificationCreateManyAndReturnData | GassmaGassmaOffsetNoteCreateManyAndReturnData | GassmaGassmaUserCreateManyAndReturnData | GassmaGassmaProfileCreateManyAndReturnData;
    query: (args: GassmaGassmaPostCreateManyAndReturnData | GassmaGassmaCommentCreateManyAndReturnData | GassmaGassmaCategoryCreateManyAndReturnData | GassmaGassmaTagCreateManyAndReturnData | GassmaGassmaProductCreateManyAndReturnData | GassmaGassmaOrderCreateManyAndReturnData | GassmaGassmaOrderItemCreateManyAndReturnData | GassmaGassmaFormulaCellCreateManyAndReturnData | GassmaGassmaNotificationCreateManyAndReturnData | GassmaGassmaOffsetNoteCreateManyAndReturnData | GassmaGassmaUserCreateManyAndReturnData | GassmaGassmaProfileCreateManyAndReturnData) => unknown;
  }) => unknown;
  update?: (params: {
    model: GassmaGassmaModelName;
    operation: "update";
    args: GassmaGassmaPostUpdateSingleData | GassmaGassmaCommentUpdateSingleData | GassmaGassmaCategoryUpdateSingleData | GassmaGassmaTagUpdateSingleData | GassmaGassmaProductUpdateSingleData | GassmaGassmaOrderUpdateSingleData | GassmaGassmaOrderItemUpdateSingleData | GassmaGassmaFormulaCellUpdateSingleData | GassmaGassmaNotificationUpdateSingleData | GassmaGassmaOffsetNoteUpdateSingleData | GassmaGassmaUserUpdateSingleData | GassmaGassmaProfileUpdateSingleData;
    query: (args: GassmaGassmaPostUpdateSingleData | GassmaGassmaCommentUpdateSingleData | GassmaGassmaCategoryUpdateSingleData | GassmaGassmaTagUpdateSingleData | GassmaGassmaProductUpdateSingleData | GassmaGassmaOrderUpdateSingleData | GassmaGassmaOrderItemUpdateSingleData | GassmaGassmaFormulaCellUpdateSingleData | GassmaGassmaNotificationUpdateSingleData | GassmaGassmaOffsetNoteUpdateSingleData | GassmaGassmaUserUpdateSingleData | GassmaGassmaProfileUpdateSingleData) => unknown;
  }) => unknown;
  updateMany?: (params: {
    model: GassmaGassmaModelName;
    operation: "updateMany";
    args: GassmaGassmaPostUpdateData | GassmaGassmaCommentUpdateData | GassmaGassmaCategoryUpdateData | GassmaGassmaTagUpdateData | GassmaGassmaProductUpdateData | GassmaGassmaOrderUpdateData | GassmaGassmaOrderItemUpdateData | GassmaGassmaFormulaCellUpdateData | GassmaGassmaNotificationUpdateData | GassmaGassmaOffsetNoteUpdateData | GassmaGassmaUserUpdateData | GassmaGassmaProfileUpdateData;
    query: (args: GassmaGassmaPostUpdateData | GassmaGassmaCommentUpdateData | GassmaGassmaCategoryUpdateData | GassmaGassmaTagUpdateData | GassmaGassmaProductUpdateData | GassmaGassmaOrderUpdateData | GassmaGassmaOrderItemUpdateData | GassmaGassmaFormulaCellUpdateData | GassmaGassmaNotificationUpdateData | GassmaGassmaOffsetNoteUpdateData | GassmaGassmaUserUpdateData | GassmaGassmaProfileUpdateData) => unknown;
  }) => unknown;
  updateManyAndReturn?: (params: {
    model: GassmaGassmaModelName;
    operation: "updateManyAndReturn";
    args: GassmaGassmaPostUpdateData | GassmaGassmaCommentUpdateData | GassmaGassmaCategoryUpdateData | GassmaGassmaTagUpdateData | GassmaGassmaProductUpdateData | GassmaGassmaOrderUpdateData | GassmaGassmaOrderItemUpdateData | GassmaGassmaFormulaCellUpdateData | GassmaGassmaNotificationUpdateData | GassmaGassmaOffsetNoteUpdateData | GassmaGassmaUserUpdateData | GassmaGassmaProfileUpdateData;
    query: (args: GassmaGassmaPostUpdateData | GassmaGassmaCommentUpdateData | GassmaGassmaCategoryUpdateData | GassmaGassmaTagUpdateData | GassmaGassmaProductUpdateData | GassmaGassmaOrderUpdateData | GassmaGassmaOrderItemUpdateData | GassmaGassmaFormulaCellUpdateData | GassmaGassmaNotificationUpdateData | GassmaGassmaOffsetNoteUpdateData | GassmaGassmaUserUpdateData | GassmaGassmaProfileUpdateData) => unknown;
  }) => unknown;
  upsert?: (params: {
    model: GassmaGassmaModelName;
    operation: "upsert";
    args: GassmaGassmaPostUpsertSingleData | GassmaGassmaCommentUpsertSingleData | GassmaGassmaCategoryUpsertSingleData | GassmaGassmaTagUpsertSingleData | GassmaGassmaProductUpsertSingleData | GassmaGassmaOrderUpsertSingleData | GassmaGassmaOrderItemUpsertSingleData | GassmaGassmaFormulaCellUpsertSingleData | GassmaGassmaNotificationUpsertSingleData | GassmaGassmaOffsetNoteUpsertSingleData | GassmaGassmaUserUpsertSingleData | GassmaGassmaProfileUpsertSingleData;
    query: (args: GassmaGassmaPostUpsertSingleData | GassmaGassmaCommentUpsertSingleData | GassmaGassmaCategoryUpsertSingleData | GassmaGassmaTagUpsertSingleData | GassmaGassmaProductUpsertSingleData | GassmaGassmaOrderUpsertSingleData | GassmaGassmaOrderItemUpsertSingleData | GassmaGassmaFormulaCellUpsertSingleData | GassmaGassmaNotificationUpsertSingleData | GassmaGassmaOffsetNoteUpsertSingleData | GassmaGassmaUserUpsertSingleData | GassmaGassmaProfileUpsertSingleData) => unknown;
  }) => unknown;
  delete?: (params: {
    model: GassmaGassmaModelName;
    operation: "delete";
    args: GassmaGassmaPostDeleteSingleData | GassmaGassmaCommentDeleteSingleData | GassmaGassmaCategoryDeleteSingleData | GassmaGassmaTagDeleteSingleData | GassmaGassmaProductDeleteSingleData | GassmaGassmaOrderDeleteSingleData | GassmaGassmaOrderItemDeleteSingleData | GassmaGassmaFormulaCellDeleteSingleData | GassmaGassmaNotificationDeleteSingleData | GassmaGassmaOffsetNoteDeleteSingleData | GassmaGassmaUserDeleteSingleData | GassmaGassmaProfileDeleteSingleData;
    query: (args: GassmaGassmaPostDeleteSingleData | GassmaGassmaCommentDeleteSingleData | GassmaGassmaCategoryDeleteSingleData | GassmaGassmaTagDeleteSingleData | GassmaGassmaProductDeleteSingleData | GassmaGassmaOrderDeleteSingleData | GassmaGassmaOrderItemDeleteSingleData | GassmaGassmaFormulaCellDeleteSingleData | GassmaGassmaNotificationDeleteSingleData | GassmaGassmaOffsetNoteDeleteSingleData | GassmaGassmaUserDeleteSingleData | GassmaGassmaProfileDeleteSingleData) => unknown;
  }) => unknown;
  deleteMany?: (params: {
    model: GassmaGassmaModelName;
    operation: "deleteMany";
    args: GassmaGassmaPostDeleteData | GassmaGassmaCommentDeleteData | GassmaGassmaCategoryDeleteData | GassmaGassmaTagDeleteData | GassmaGassmaProductDeleteData | GassmaGassmaOrderDeleteData | GassmaGassmaOrderItemDeleteData | GassmaGassmaFormulaCellDeleteData | GassmaGassmaNotificationDeleteData | GassmaGassmaOffsetNoteDeleteData | GassmaGassmaUserDeleteData | GassmaGassmaProfileDeleteData;
    query: (args: GassmaGassmaPostDeleteData | GassmaGassmaCommentDeleteData | GassmaGassmaCategoryDeleteData | GassmaGassmaTagDeleteData | GassmaGassmaProductDeleteData | GassmaGassmaOrderDeleteData | GassmaGassmaOrderItemDeleteData | GassmaGassmaFormulaCellDeleteData | GassmaGassmaNotificationDeleteData | GassmaGassmaOffsetNoteDeleteData | GassmaGassmaUserDeleteData | GassmaGassmaProfileDeleteData) => unknown;
  }) => unknown;
  count?: (params: {
    model: GassmaGassmaModelName;
    operation: "count";
    args: GassmaGassmaPostCountData | GassmaGassmaCommentCountData | GassmaGassmaCategoryCountData | GassmaGassmaTagCountData | GassmaGassmaProductCountData | GassmaGassmaOrderCountData | GassmaGassmaOrderItemCountData | GassmaGassmaFormulaCellCountData | GassmaGassmaNotificationCountData | GassmaGassmaOffsetNoteCountData | GassmaGassmaUserCountData | GassmaGassmaProfileCountData;
    query: (args: GassmaGassmaPostCountData | GassmaGassmaCommentCountData | GassmaGassmaCategoryCountData | GassmaGassmaTagCountData | GassmaGassmaProductCountData | GassmaGassmaOrderCountData | GassmaGassmaOrderItemCountData | GassmaGassmaFormulaCellCountData | GassmaGassmaNotificationCountData | GassmaGassmaOffsetNoteCountData | GassmaGassmaUserCountData | GassmaGassmaProfileCountData) => unknown;
  }) => unknown;
  aggregate?: (params: {
    model: GassmaGassmaModelName;
    operation: "aggregate";
    args: GassmaGassmaPostAggregateData | GassmaGassmaCommentAggregateData | GassmaGassmaCategoryAggregateData | GassmaGassmaTagAggregateData | GassmaGassmaProductAggregateData | GassmaGassmaOrderAggregateData | GassmaGassmaOrderItemAggregateData | GassmaGassmaFormulaCellAggregateData | GassmaGassmaNotificationAggregateData | GassmaGassmaOffsetNoteAggregateData | GassmaGassmaUserAggregateData | GassmaGassmaProfileAggregateData;
    query: (args: GassmaGassmaPostAggregateData | GassmaGassmaCommentAggregateData | GassmaGassmaCategoryAggregateData | GassmaGassmaTagAggregateData | GassmaGassmaProductAggregateData | GassmaGassmaOrderAggregateData | GassmaGassmaOrderItemAggregateData | GassmaGassmaFormulaCellAggregateData | GassmaGassmaNotificationAggregateData | GassmaGassmaOffsetNoteAggregateData | GassmaGassmaUserAggregateData | GassmaGassmaProfileAggregateData) => unknown;
  }) => unknown;
  groupBy?: (params: {
    model: GassmaGassmaModelName;
    operation: "groupBy";
    args: GassmaGassmaPostGroupByData | GassmaGassmaCommentGroupByData | GassmaGassmaCategoryGroupByData | GassmaGassmaTagGroupByData | GassmaGassmaProductGroupByData | GassmaGassmaOrderGroupByData | GassmaGassmaOrderItemGroupByData | GassmaGassmaFormulaCellGroupByData | GassmaGassmaNotificationGroupByData | GassmaGassmaOffsetNoteGroupByData | GassmaGassmaUserGroupByData | GassmaGassmaProfileGroupByData;
    query: (args: GassmaGassmaPostGroupByData | GassmaGassmaCommentGroupByData | GassmaGassmaCategoryGroupByData | GassmaGassmaTagGroupByData | GassmaGassmaProductGroupByData | GassmaGassmaOrderGroupByData | GassmaGassmaOrderItemGroupByData | GassmaGassmaFormulaCellGroupByData | GassmaGassmaNotificationGroupByData | GassmaGassmaOffsetNoteGroupByData | GassmaGassmaUserGroupByData | GassmaGassmaProfileGroupByData) => unknown;
  }) => unknown;
  $allOperations?: (params: {
    model: GassmaGassmaModelName;
    operation: GassmaGassmaOperationName;
    args: GassmaGassmaQueryArgs;
    query: (args: GassmaGassmaQueryArgs) => unknown;
  }) => unknown;
};

export type GassmaGassmaQueryExtension<O extends GassmaGassmaGlobalOmitConfig = {}> = {
  "Post"?: GassmaGassmaPostQueryHooks<O extends { "Post": infer UO } ? UO extends GassmaGassmaPostOmit ? UO : {} : {}, O>;
  "Comment"?: GassmaGassmaCommentQueryHooks<O extends { "Comment": infer UO } ? UO extends GassmaGassmaCommentOmit ? UO : {} : {}, O>;
  "Category"?: GassmaGassmaCategoryQueryHooks<O extends { "Category": infer UO } ? UO extends GassmaGassmaCategoryOmit ? UO : {} : {}, O>;
  "Tag"?: GassmaGassmaTagQueryHooks<O extends { "Tag": infer UO } ? UO extends GassmaGassmaTagOmit ? UO : {} : {}, O>;
  "Product"?: GassmaGassmaProductQueryHooks<O extends { "Product": infer UO } ? UO extends GassmaGassmaProductOmit ? UO : {} : {}, O>;
  "Order"?: GassmaGassmaOrderQueryHooks<O extends { "Order": infer UO } ? UO extends GassmaGassmaOrderOmit ? UO : {} : {}, O>;
  "OrderItem"?: GassmaGassmaOrderItemQueryHooks<O extends { "OrderItem": infer UO } ? UO extends GassmaGassmaOrderItemOmit ? UO : {} : {}, O>;
  "FormulaCell"?: GassmaGassmaFormulaCellQueryHooks<O extends { "FormulaCell": infer UO } ? UO extends GassmaGassmaFormulaCellOmit ? UO : {} : {}, O>;
  "Notification"?: GassmaGassmaNotificationQueryHooks<O extends { "Notification": infer UO } ? UO extends GassmaGassmaNotificationOmit ? UO : {} : {}, O>;
  "OffsetNote"?: GassmaGassmaOffsetNoteQueryHooks<O extends { "OffsetNote": infer UO } ? UO extends GassmaGassmaOffsetNoteOmit ? UO : {} : {}, O>;
  "User"?: GassmaGassmaUserQueryHooks<O extends { "User": infer UO } ? UO extends GassmaGassmaUserOmit ? UO : {} : {}, O>;
  "Profile"?: GassmaGassmaProfileQueryHooks<O extends { "Profile": infer UO } ? UO extends GassmaGassmaProfileOmit ? UO : {} : {}, O>;
  $allModels?: GassmaGassmaAllModelsQueryHooks;
};

export type GassmaGassmaResultScalars<M> =
  M extends "Post" ? GassmaGassmaPostDefaultFindResult :
  M extends "Comment" ? GassmaGassmaCommentDefaultFindResult :
  M extends "Category" ? GassmaGassmaCategoryDefaultFindResult :
  M extends "Tag" ? GassmaGassmaTagDefaultFindResult :
  M extends "Product" ? GassmaGassmaProductDefaultFindResult :
  M extends "Order" ? GassmaGassmaOrderDefaultFindResult :
  M extends "OrderItem" ? GassmaGassmaOrderItemDefaultFindResult :
  M extends "FormulaCell" ? GassmaGassmaFormulaCellDefaultFindResult :
  M extends "Notification" ? GassmaGassmaNotificationDefaultFindResult :
  M extends "OffsetNote" ? GassmaGassmaOffsetNoteDefaultFindResult :
  M extends "User" ? GassmaGassmaUserDefaultFindResult :
  M extends "Profile" ? GassmaGassmaProfileDefaultFindResult :
  { [field: string]: unknown };

export type GassmaGassmaResultShape = {
  [M in GassmaGassmaModelName | "$allModels"]?: unknown;
};

export type GassmaGassmaResultExtension<R_> = {
  [M in keyof R_]: {
    [F in keyof R_[M]]?: Gassma.ResultField<GassmaGassmaResultScalars<M>, R_[M][F]>;
  };
};

export type GassmaGassmaResultConfig = {
  [M in GassmaGassmaModelName | "$allModels"]?: {
    [field: string]: {
      needs?: { [key: string]: boolean };
      compute: (record: any) => unknown;
    };
  };
};

export type GassmaGassmaComputedMap<CMap, R> = {
  "Post": Gassma.MergeShape<Gassma.At<CMap, "Post">, Gassma.ComputedOf<R, "Post">>;
  "Comment": Gassma.MergeShape<Gassma.At<CMap, "Comment">, Gassma.ComputedOf<R, "Comment">>;
  "Category": Gassma.MergeShape<Gassma.At<CMap, "Category">, Gassma.ComputedOf<R, "Category">>;
  "Tag": Gassma.MergeShape<Gassma.At<CMap, "Tag">, Gassma.ComputedOf<R, "Tag">>;
  "Product": Gassma.MergeShape<Gassma.At<CMap, "Product">, Gassma.ComputedOf<R, "Product">>;
  "Order": Gassma.MergeShape<Gassma.At<CMap, "Order">, Gassma.ComputedOf<R, "Order">>;
  "OrderItem": Gassma.MergeShape<Gassma.At<CMap, "OrderItem">, Gassma.ComputedOf<R, "OrderItem">>;
  "FormulaCell": Gassma.MergeShape<Gassma.At<CMap, "FormulaCell">, Gassma.ComputedOf<R, "FormulaCell">>;
  "Notification": Gassma.MergeShape<Gassma.At<CMap, "Notification">, Gassma.ComputedOf<R, "Notification">>;
  "OffsetNote": Gassma.MergeShape<Gassma.At<CMap, "OffsetNote">, Gassma.ComputedOf<R, "OffsetNote">>;
  "User": Gassma.MergeShape<Gassma.At<CMap, "User">, Gassma.ComputedOf<R, "User">>;
  "Profile": Gassma.MergeShape<Gassma.At<CMap, "Profile">, Gassma.ComputedOf<R, "Profile">>;
};

export type GassmaGassmaExtendsFn<O extends GassmaGassmaGlobalOmitConfig, CMap> = <R_ extends GassmaGassmaResultShape = {}, R extends GassmaGassmaResultConfig = {}>(extension: {
  query?: GassmaGassmaQueryExtension<O>;
  result?: GassmaGassmaResultExtension<R_> & R;
}) => GassmaGassmaExtendedClient<O, GassmaGassmaComputedMap<CMap, R>>;

export type GassmaGassmaExtendedClient<O extends GassmaGassmaGlobalOmitConfig = {}, CMap = {}> = {
  "Post": GassmaGassmaPostController<O extends { "Post": infer UO } ? UO extends GassmaGassmaPostOmit ? UO : {} : {}, O, Gassma.At<CMap, "Post">>;
  "Comment": GassmaGassmaCommentController<O extends { "Comment": infer UO } ? UO extends GassmaGassmaCommentOmit ? UO : {} : {}, O, Gassma.At<CMap, "Comment">>;
  "Category": GassmaGassmaCategoryController<O extends { "Category": infer UO } ? UO extends GassmaGassmaCategoryOmit ? UO : {} : {}, O, Gassma.At<CMap, "Category">>;
  "Tag": GassmaGassmaTagController<O extends { "Tag": infer UO } ? UO extends GassmaGassmaTagOmit ? UO : {} : {}, O, Gassma.At<CMap, "Tag">>;
  "Product": GassmaGassmaProductController<O extends { "Product": infer UO } ? UO extends GassmaGassmaProductOmit ? UO : {} : {}, O, Gassma.At<CMap, "Product">>;
  "Order": GassmaGassmaOrderController<O extends { "Order": infer UO } ? UO extends GassmaGassmaOrderOmit ? UO : {} : {}, O, Gassma.At<CMap, "Order">>;
  "OrderItem": GassmaGassmaOrderItemController<O extends { "OrderItem": infer UO } ? UO extends GassmaGassmaOrderItemOmit ? UO : {} : {}, O, Gassma.At<CMap, "OrderItem">>;
  "FormulaCell": GassmaGassmaFormulaCellController<O extends { "FormulaCell": infer UO } ? UO extends GassmaGassmaFormulaCellOmit ? UO : {} : {}, O, Gassma.At<CMap, "FormulaCell">>;
  "Notification": GassmaGassmaNotificationController<O extends { "Notification": infer UO } ? UO extends GassmaGassmaNotificationOmit ? UO : {} : {}, O, Gassma.At<CMap, "Notification">>;
  "OffsetNote": GassmaGassmaOffsetNoteController<O extends { "OffsetNote": infer UO } ? UO extends GassmaGassmaOffsetNoteOmit ? UO : {} : {}, O, Gassma.At<CMap, "OffsetNote">>;
  "User": GassmaGassmaUserController<O extends { "User": infer UO } ? UO extends GassmaGassmaUserOmit ? UO : {} : {}, O, Gassma.At<CMap, "User">>;
  "Profile": GassmaGassmaProfileController<O extends { "Profile": infer UO } ? UO extends GassmaGassmaProfileOmit ? UO : {} : {}, O, Gassma.At<CMap, "Profile">>;
  $extends: GassmaGassmaExtendsFn<O, CMap>;
};

export type GassmaGassmaExtension<O extends GassmaGassmaGlobalOmitConfig = {}> = {
  query?: GassmaGassmaQueryExtension<O>;
  result?: GassmaGassmaResultConfig;
};

export interface GassmaClient<O extends Gassma.StrictGlobalOmit<O, GassmaGassmaGlobalOmitConfig> = {}> extends GassmaGassmaSheet<O> {
  $extends: GassmaGassmaExtendsFn<O, {}>;
}
export declare class GassmaClient<O extends Gassma.StrictGlobalOmit<O, GassmaGassmaGlobalOmitConfig> = {}> {
  constructor(options?: GassmaGassmaClientOptions<O>);
}

export declare const Role: {
  readonly admin: "ADMIN";
  readonly user: "USER";
  readonly moderator: "MODERATOR";
};
export type Role = (typeof Role)[keyof typeof Role];
