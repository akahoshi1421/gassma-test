export namespace Gassma {
  type RawValue = {
    readonly __gassmaRawValueBrand: "Gassma.raw";
  };

  /**
   * Writes the value to the cell as-is, skipping formula-injection escaping.
   * A string starting with `=` therefore becomes a live spreadsheet formula.
   *
   * Susceptible to formula injection: never pass unsanitized user input.
   *
   * @example
   * ```
   * gassma.Report.create({
   *   data: { title: userInput, total: Gassma.raw("=SUM(B2:B10)") },
   * });
   * ```
   */
  function raw(value: string): RawValue;

  type RawAllowed<T> = { [K in keyof T]: T[K] | RawValue };

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
  type ResultField<Scalars, S, CKeys extends PropertyKey = never, CTypes = {}> = {
    needs?: { [K in keyof S]: K extends keyof Scalars | CKeys ? S[K] : never } & { [K in keyof Scalars]?: boolean } & { [K in CKeys]?: boolean };
    compute(record: { [K in keyof S as S[K] extends true ? K & (keyof Scalars | CKeys) : never]: K extends keyof CTypes ? CTypes[K] : K extends keyof Scalars ? Scalars[K] : never }): unknown;
  };
  type ComputedArgs<C> = [keyof C] extends [never] ? {} : {
    select?: { [K in keyof C]?: true };
    omit?: { [K in keyof C]?: true | false };
  };
  type SelectedComputed<C, S> = {
    [K in keyof C as K extends keyof S ? (S[K] extends true ? K : never) : never]: C[K];
  };
  type ActiveComputed<C, QO> = { [K in keyof C as K extends TrueKeys<QO> ? never : K]: C[K] };
  type SelectGiven<S> = (<T>() => T extends S ? 1 : 2) extends <T>() => T extends unknown ? 1 : 2
    ? false
    : [S] extends [undefined] ? false : true;
  type StripComputed<S, C> = [keyof C] extends [never]
    ? S
    : SelectGiven<S> extends true ? { [K in Exclude<keyof S, keyof C>]: S[K] } : S;
  type WithComputed<Base, C, S, QO> = [keyof C] extends [never]
    ? Base
    : SelectGiven<S> extends true
      ? Omit<Base, keyof SelectedComputed<C, S>> & SelectedComputed<C, S>
      : Omit<Base, keyof ActiveComputed<C, QO>> & ActiveComputed<C, QO>;

  type Subset<T, U> = { [K in keyof T]: K extends keyof U ? T[K] : never };
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

  type Lock = {
    waitLock(timeoutInMillis: number): void;
    releaseLock(): void;
    hasLock(): boolean;
  };

  type GassmaTransactionOptions = {
    maxWait?: number;
    timeout?: number;
    rollback?: boolean;
  };

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
  class GassmaFindFirstTakeError extends Error {
    constructor();
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
  class GassmaGroupByOrderByRequiredError extends Error {
    constructor(...paginationArguments: string[]);
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
  class GassmaAggregateSelectionRequiredError extends Error {
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
  class RelationIgnoredColumnError extends Error {
    constructor(sheetName: string, relationName: string, columnName: string, ignoredSheetName: string);
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
  class GassmaUndefinedValueError extends Error {
    constructor(path: string);
  }
  class GassmaSkipInArrayError extends Error {
    constructor(path: string);
  }
  class GassmaMissingArgumentError extends Error {
    constructor(argumentName: string);
  }
  class GassmaUnknownArgumentError extends Error {
    constructor(argumentName: string, availableArguments: string[]);
  }
  class GassmaInvalidValueError extends Error {
    constructor(argumentName: string, expected: string);
  }
  class GassmaRelationNotFoundError extends Error {
    constructor(relationName: string, sheetName: string);
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
  class GassmaTransactionLockTimeoutError extends Error {
    constructor(maxWaitMs: number);
  }
  class GassmaTransactionTimeoutError extends Error {
    constructor(phase: "query" | "commit", timeoutMs: number, elapsedMs: number);
  }
  class GassmaNestedTransactionError extends Error {
    constructor();
  }
  class GassmaTransactionRollbackError extends Error {
    constructor(backupSheetNames: string[]);
    readonly backupSheetNames: string[];
  }
  class GassmaTransactionLockRequiredError extends Error {
    constructor();
  }
  class GassmaInvalidLockError extends Error {
    constructor();
  }
  class GassmaAutoincrementNotConfiguredError extends Error {
    constructor(sheetName: string, field: string, configuredFields: string[]);
  }
  class GassmaAutoincrementInTransactionError extends Error {
    constructor(methodName: string);
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
  "SensorReading"?: GassmaGassmaSensorReadingOmit;
  "TimeSlot"?: GassmaGassmaTimeSlotOmit;
  "Reservation"?: GassmaGassmaReservationOmit;
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
  "SensorReading"?: "id" | "sensorName" | "recordedAt" | ("id" | "sensorName" | "recordedAt")[];
  "TimeSlot"?: "id" | "label" | "slotAt" | ("id" | "label" | "slotAt")[];
  "Reservation"?: "id" | "guestName" | "slotAt" | ("id" | "guestName" | "slotAt")[];
  "Product"?: "id" | "name" | "price" | "stock" | "status" | "createdAt" | "updatedAt" | ("id" | "name" | "price" | "stock" | "status" | "createdAt" | "updatedAt")[];
  "Order"?: "id" | "userId" | "totalAmount" | "quantity" | "status" | "createdAt" | ("id" | "userId" | "totalAmount" | "quantity" | "status" | "createdAt")[];
  "OrderItem"?: "id" | "orderId" | "productId" | "quantity" | "unitPrice" | ("id" | "orderId" | "productId" | "quantity" | "unitPrice")[];
  "FormulaCell"?: "id" | "label" | "amount" | "total" | ("id" | "label" | "amount" | "total")[];
  "Notification"?: "id" | "userId" | "message" | "isRead" | ("id" | "userId" | "message" | "isRead")[];
  "OffsetNote"?: "id" | "title" | "value" | ("id" | "title" | "value")[];
  "User"?: "id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt" | ("id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt")[];
  "Profile"?: "id" | "bio" | "website" | "userId" | ("id" | "bio" | "website" | "userId")[];
};

export type GassmaGassmaIgnoreSheetsConfig = "Post" | "Comment" | "Category" | "Tag" | "SensorReading" | "TimeSlot" | "Reservation" | "Product" | "Order" | "OrderItem" | "FormulaCell" | "Notification" | "OffsetNote" | "User" | "Profile" | ("Post" | "Comment" | "Category" | "Tag" | "SensorReading" | "TimeSlot" | "Reservation" | "Product" | "Order" | "OrderItem" | "FormulaCell" | "Notification" | "OffsetNote" | "User" | "Profile")[];

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
  "SensorReading"?: {
      "id"?: string;
      "sensorName"?: string;
      "recordedAt"?: string;
  };
  "TimeSlot"?: {
      "id"?: string;
      "label"?: string;
      "slotAt"?: string;
  };
  "Reservation"?: {
      "id"?: string;
      "guestName"?: string;
      "slotAt"?: string;
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
  "SensorReading"?: string;
  "TimeSlot"?: string;
  "Reservation"?: string;
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
  "SensorReading"?: "id" | "sensorName" | "recordedAt" | ("id" | "sensorName" | "recordedAt")[];
  "TimeSlot"?: "id" | "label" | "slotAt" | ("id" | "label" | "slotAt")[];
  "Reservation"?: "id" | "guestName" | "slotAt" | ("id" | "guestName" | "slotAt")[];
  "Product"?: "id" | "name" | "price" | "stock" | "status" | "createdAt" | "updatedAt" | ("id" | "name" | "price" | "stock" | "status" | "createdAt" | "updatedAt")[];
  "Order"?: "id" | "userId" | "totalAmount" | "quantity" | "status" | "createdAt" | ("id" | "userId" | "totalAmount" | "quantity" | "status" | "createdAt")[];
  "OrderItem"?: "id" | "orderId" | "productId" | "quantity" | "unitPrice" | ("id" | "orderId" | "productId" | "quantity" | "unitPrice")[];
  "Notification"?: "id" | "userId" | "message" | "isRead" | ("id" | "userId" | "message" | "isRead")[];
  "User"?: "id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt" | ("id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt")[];
  "Profile"?: "id" | "bio" | "website" | "userId" | ("id" | "bio" | "website" | "userId")[];
};

export type GassmaGassmaClientOptions<O extends Gassma.StrictGlobalOmit<O, GassmaGassmaGlobalOmitConfig> = {}> = {
  id?: string;
  /**
   * Lock used to serialize `$transaction` and `autoincrement`.
   * Defaults to `LockService.getScriptLock()` of the script using GASsma.
   * Read more here: https://gassma.io/en/docs/reference/transaction
   * @example
   * ```
   * const gassma = new GassmaClient({ lock: LockService.getDocumentLock() })
   * ```
   */
  lock?: Gassma.Lock;
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
  /**
   * `gassma.Post`: Exposes CRUD operations for the **Post** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Posts
   * const posts = gassma.Post.findMany()
   * ```
   */
  "Post": GassmaGassmaPostController<O extends { "Post": infer UO } ? UO extends GassmaGassmaPostOmit ? UO : {} : {}, O>;
  /**
   * `gassma.Comment`: Exposes CRUD operations for the **Comment** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Comments
   * const comments = gassma.Comment.findMany()
   * ```
   */
  "Comment": GassmaGassmaCommentController<O extends { "Comment": infer UO } ? UO extends GassmaGassmaCommentOmit ? UO : {} : {}, O>;
  /**
   * `gassma.Category`: Exposes CRUD operations for the **Category** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Categories
   * const categories = gassma.Category.findMany()
   * ```
   */
  "Category": GassmaGassmaCategoryController<O extends { "Category": infer UO } ? UO extends GassmaGassmaCategoryOmit ? UO : {} : {}, O>;
  /**
   * `gassma.Tag`: Exposes CRUD operations for the **Tag** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Tags
   * const tags = gassma.Tag.findMany()
   * ```
   */
  "Tag": GassmaGassmaTagController<O extends { "Tag": infer UO } ? UO extends GassmaGassmaTagOmit ? UO : {} : {}, O>;
  /**
   * `gassma.SensorReading`: Exposes CRUD operations for the **SensorReading** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more SensorReadings
   * const sensorReadings = gassma.SensorReading.findMany()
   * ```
   */
  "SensorReading": GassmaGassmaSensorReadingController<O extends { "SensorReading": infer UO } ? UO extends GassmaGassmaSensorReadingOmit ? UO : {} : {}, O>;
  /**
   * `gassma.TimeSlot`: Exposes CRUD operations for the **TimeSlot** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more TimeSlots
   * const timeSlots = gassma.TimeSlot.findMany()
   * ```
   */
  "TimeSlot": GassmaGassmaTimeSlotController<O extends { "TimeSlot": infer UO } ? UO extends GassmaGassmaTimeSlotOmit ? UO : {} : {}, O>;
  /**
   * `gassma.Reservation`: Exposes CRUD operations for the **Reservation** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Reservations
   * const reservations = gassma.Reservation.findMany()
   * ```
   */
  "Reservation": GassmaGassmaReservationController<O extends { "Reservation": infer UO } ? UO extends GassmaGassmaReservationOmit ? UO : {} : {}, O>;
  /**
   * `gassma.Product`: Exposes CRUD operations for the **Product** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Products
   * const products = gassma.Product.findMany()
   * ```
   */
  "Product": GassmaGassmaProductController<O extends { "Product": infer UO } ? UO extends GassmaGassmaProductOmit ? UO : {} : {}, O>;
  /**
   * `gassma.Order`: Exposes CRUD operations for the **Order** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Orders
   * const orders = gassma.Order.findMany()
   * ```
   */
  "Order": GassmaGassmaOrderController<O extends { "Order": infer UO } ? UO extends GassmaGassmaOrderOmit ? UO : {} : {}, O>;
  /**
   * `gassma.OrderItem`: Exposes CRUD operations for the **OrderItem** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more OrderItems
   * const orderItems = gassma.OrderItem.findMany()
   * ```
   */
  "OrderItem": GassmaGassmaOrderItemController<O extends { "OrderItem": infer UO } ? UO extends GassmaGassmaOrderItemOmit ? UO : {} : {}, O>;
  /**
   * `gassma.FormulaCell`: Exposes CRUD operations for the **FormulaCell** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more FormulaCells
   * const formulaCells = gassma.FormulaCell.findMany()
   * ```
   */
  "FormulaCell": GassmaGassmaFormulaCellController<O extends { "FormulaCell": infer UO } ? UO extends GassmaGassmaFormulaCellOmit ? UO : {} : {}, O>;
  /**
   * `gassma.Notification`: Exposes CRUD operations for the **Notification** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Notifications
   * const notifications = gassma.Notification.findMany()
   * ```
   */
  "Notification": GassmaGassmaNotificationController<O extends { "Notification": infer UO } ? UO extends GassmaGassmaNotificationOmit ? UO : {} : {}, O>;
  /**
   * `gassma.OffsetNote`: Exposes CRUD operations for the **OffsetNote** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more OffsetNotes
   * const offsetNotes = gassma.OffsetNote.findMany()
   * ```
   */
  "OffsetNote": GassmaGassmaOffsetNoteController<O extends { "OffsetNote": infer UO } ? UO extends GassmaGassmaOffsetNoteOmit ? UO : {} : {}, O>;
  /**
   * `gassma.User`: Exposes CRUD operations for the **User** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Users
   * const users = gassma.User.findMany()
   * ```
   */
  "User": GassmaGassmaUserController<O extends { "User": infer UO } ? UO extends GassmaGassmaUserOmit ? UO : {} : {}, O>;
  /**
   * `gassma.Profile`: Exposes CRUD operations for the **Profile** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Profiles
   * const profiles = gassma.Profile.findMany()
   * ```
   */
  "Profile": GassmaGassmaProfileController<O extends { "Profile": infer UO } ? UO extends GassmaGassmaProfileOmit ? UO : {} : {}, O>;
};

/**
 * The delegate class that exposes CRUD operations for the **Post** model.
 */
export declare class GassmaGassmaPostController<GO extends GassmaGassmaPostOmit = {}, O = {}, CMap = {}> {
  constructor(sheetName: string, id?: string);

  /**
   * Fields of the Post model
   */
  readonly fields: Record<string, Gassma.FieldRef>;
  /**
   * Change the range this model reads and writes on the spreadsheet.
   * Read more here: https://gassma.io/en/docs/reference/settings/changeSettings
   * @param {number} startRowNumber - The row number the header row lives on.
   * @param {number | string} startColumnValue - The first column of the range.
   * @param {number | string} endColumnValue - The last column of the range.
   */
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  /**
   * Create many Posts.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createMany
   * @param {GassmaGassmaPostCreateManyData} createdData - Arguments to create many Posts.
   * @example
   * // Create many Posts
   * const post = gassma.Post.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createMany(createdData: GassmaGassmaPostCreateManyData): CreateManyReturn;
  /**
   * Create many Posts and returns the data saved in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createManyAndReturn
   * @param {GassmaGassmaPostCreateManyAndReturnData} createdData - Arguments to create many Posts.
   * @example
   * // Create many Posts
   * const post = gassma.Post.createManyAndReturn({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   * // Create many Posts and only return the `id`
   * const postWithIdOnly = gassma.Post.createManyAndReturn({
   *   select: { id: true },
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createManyAndReturn<T extends GassmaGassmaPostCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Post">>>(createdData: T & Gassma.Subset<T, GassmaGassmaPostCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Post">>>): GassmaGassmaPostFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create a Post.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/create
   * @param {GassmaGassmaPostCreateData} createdData - Arguments to create a Post.
   * @example
   * // Create one Post
   * const Post = gassma.Post.create({
   *   data: {
   *     // ... data to create a Post
   *   }
   * })
   * 
   */
  create<T extends GassmaGassmaPostCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "Post">>>(createdData: T & Gassma.Subset<T, GassmaGassmaPostCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "Post">>>): GassmaGassmaPostFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first Post that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @param {GassmaGassmaPostFindFirstData} findData - Arguments to find a Post
   * @example
   * // Get one Post
   * const post = gassma.Post.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends GassmaGassmaPostFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Post">>>(findData: T & Gassma.Subset<T, GassmaGassmaPostFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Post">>>): GassmaGassmaPostFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Find the first Post.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @example
   * // Get the first Post
   * const post = gassma.Post.findFirst()
   */
  findFirst(): GassmaGassmaPostFindResult<unknown, unknown, unknown, GO, O, CMap> | null;
  /**
   * Find the first Post that matches the filter or
   * throw `NotFoundError` if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @param {GassmaGassmaPostFindFirstData} findData - Arguments to find a Post
   * @example
   * // Get one Post
   * const post = gassma.Post.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends GassmaGassmaPostFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Post">>>(findData: T & Gassma.Subset<T, GassmaGassmaPostFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Post">>>): GassmaGassmaPostFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first Post or throw `NotFoundError` if no Posts exist.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @example
   * // Get the first Post
   * const post = gassma.Post.findFirstOrThrow()
   */
  findFirstOrThrow(): GassmaGassmaPostFindResult<unknown, unknown, unknown, GO, O, CMap>;
  /**
   * Find zero or more Posts that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @param {GassmaGassmaPostFindManyData} findData - Arguments to filter and select certain fields only.
   * @example
   * // Get all Posts
   * const posts = gassma.Post.findMany()
   * 
   * // Get first 10 Posts
   * const posts = gassma.Post.findMany({ take: 10 })
   * 
   * // Only select the `id`
   * const postWithIdOnly = gassma.Post.findMany({ select: { id: true } })
   * 
   */
  findMany<T extends GassmaGassmaPostFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "Post">>>(findData: T & Gassma.Subset<T, GassmaGassmaPostFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "Post">>>): GassmaGassmaPostFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Find all Posts.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @example
   * // Get all Posts
   * const posts = gassma.Post.findMany()
   */
  findMany(): GassmaGassmaPostFindResult<unknown, unknown, unknown, GO, O, CMap>[];
  /**
   * Update one Post.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/update
   * @param {GassmaGassmaPostUpdateSingleData} updateData - Arguments to update one Post.
   * @example
   * // Update one Post
   * const post = gassma.Post.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends GassmaGassmaPostUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Post">>>(updateData: T & Gassma.Subset<T, GassmaGassmaPostUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Post">>>): GassmaGassmaPostFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Update zero or more Posts.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateMany
   * @param {GassmaGassmaPostUpdateData} updateData - Arguments to update one or more rows.
   * @example
   * // Update many Posts
   * const { count } = gassma.Post.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany(updateData: GassmaGassmaPostUpdateData): UpdateManyReturn;
  /**
   * Update zero or more Posts and returns the data updated in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateManyAndReturn
   * @param {GassmaGassmaPostUpdateManyAndReturnData} updateData - Arguments to update many Posts.
   * @example
   * // Update many Posts
   * const posts = gassma.Post.updateManyAndReturn({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   * // Update zero or more Posts and only return the `id`
   * const postWithIdOnly = gassma.Post.updateManyAndReturn({
   *   select: { id: true },
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateManyAndReturn<T extends GassmaGassmaPostUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Post">>>(updateData: T & Gassma.Subset<T, GassmaGassmaPostUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Post">>>): GassmaGassmaPostFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create or update one Post.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/upsert
   * @param {GassmaGassmaPostUpsertSingleData} upsertData - Arguments to update or create a Post.
   * @example
   * // Update or create a Post
   * const post = gassma.Post.upsert({
   *   create: {
   *     // ... data to create a Post
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Post we want to update
   *   }
   * })
   */
  upsert<T extends GassmaGassmaPostUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Post">>>(upsertData: T & Gassma.Subset<T, GassmaGassmaPostUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Post">>>): GassmaGassmaPostFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Delete a Post.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/delete
   * @param {GassmaGassmaPostDeleteSingleData} deleteData - Arguments to delete one Post.
   * @example
   * // Delete one Post
   * const Post = gassma.Post.delete({
   *   where: {
   *     // ... filter to delete one Post
   *   }
   * })
   * 
   */
  delete<T extends GassmaGassmaPostDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Post">>>(deleteData: T & Gassma.Subset<T, GassmaGassmaPostDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Post">>>): GassmaGassmaPostFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Delete zero or more Posts.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @param {GassmaGassmaPostDeleteData} deleteData - Arguments to filter Posts to delete.
   * @example
   * // Delete a few Posts
   * const { count } = gassma.Post.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany(deleteData: GassmaGassmaPostDeleteData): DeleteManyReturn;
  /**
   * Delete every Post.
   * Calling `deleteMany` without arguments deletes **all** rows in the sheet. This cannot be undone.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @example
   * // Delete every Post in the sheet
   * const { count } = gassma.Post.deleteMany()
   */
  deleteMany(): DeleteManyReturn;
  /**
   * Allows you to perform aggregations operations on a Post.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/aggregate
   * @param {GassmaGassmaPostAggregateData} aggregateData - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Count the Posts that match the filter
   * const aggregations = gassma.Post.aggregate({
   *   _count: true,
   *   where: {
   *     // ... provide filter here
   *   },
   *   take: 10,
   * })
   */
  aggregate<T extends GassmaGassmaPostAggregateData>(aggregateData: T & Gassma.Subset<T, GassmaGassmaPostAggregateData>): GassmaGassmaPostAggregateResult<T>;
  /**
   * Count the number of Posts.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @param {GassmaGassmaPostCountData} countData - Arguments to filter Posts to count.
   * @example
   * // Count the number of Posts
   * const count = gassma.Post.count({
   *   where: {
   *     // ... the filter for the Posts we want to count
   *   }
   * })
   */
  count<T extends GassmaGassmaPostCountData>(countData: T & Gassma.Subset<T, GassmaGassmaPostCountData>): GassmaGassmaPostCountResult<T>;
  /**
   * Count every Post.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @example
   * // Count every Post
   * const count = gassma.Post.count()
   */
  count(): number;
  /**
   * Group by Post.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/groupBy
   * @param {GassmaGassmaPostGroupByData} groupByData - Group by arguments.
   * @example
   * // Group by id, get count
   * const result = gassma.Post.groupBy({
   *   by: ['id'],
   *   _count: true,
   * })
   * 
   */
  groupBy<T extends GassmaGassmaPostGroupByData>(groupByData: T & Gassma.Subset<T, GassmaGassmaPostGroupByData>): GassmaGassmaPostGroupByResult<T>[];
  /**
   * Get the value the next `create` will issue for an autoincrement field of Post.
   * Reading the counter is allowed inside `$transaction`.
   * Throws `GassmaAutoincrementNotConfiguredError` when the field is not an autoincrement field.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Post.
   * @example
   * // The id the next Post will get
   * const next = gassma.Post.$getAutoincrement("id")
   */
  $getAutoincrement(field: "id"): number;
  /**
   * Set the value the next `create` will issue for an autoincrement field of Post.
   * `next` is the value that will be issued next, so it must be an integer of 1 or more.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Post.
   * @param {number} next - The value the next `create` will issue.
   * @example
   * // Let the next Post continue from 1000
   * gassma.Post.$setAutoincrement("id", 1000)
   */
  $setAutoincrement(field: "id", next: number): void;
  /**
   * Line the counter of Post up with the rows already in the sheet.
   * The counter becomes the largest value in the column plus one, which is also the return value.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Post.
   * @example
   * // Adopt a sheet that already has rows
   * const next = gassma.Post.$syncAutoincrement("id")
   */
  $syncAutoincrement(field: "id"): number;
}

/**
 * The delegate class that exposes CRUD operations for the **Comment** model.
 */
export declare class GassmaGassmaCommentController<GO extends GassmaGassmaCommentOmit = {}, O = {}, CMap = {}> {
  constructor(sheetName: string, id?: string);

  /**
   * Fields of the Comment model
   */
  readonly fields: Record<string, Gassma.FieldRef>;
  /**
   * Change the range this model reads and writes on the spreadsheet.
   * Read more here: https://gassma.io/en/docs/reference/settings/changeSettings
   * @param {number} startRowNumber - The row number the header row lives on.
   * @param {number | string} startColumnValue - The first column of the range.
   * @param {number | string} endColumnValue - The last column of the range.
   */
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  /**
   * Create many Comments.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createMany
   * @param {GassmaGassmaCommentCreateManyData} createdData - Arguments to create many Comments.
   * @example
   * // Create many Comments
   * const comment = gassma.Comment.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createMany(createdData: GassmaGassmaCommentCreateManyData): CreateManyReturn;
  /**
   * Create many Comments and returns the data saved in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createManyAndReturn
   * @param {GassmaGassmaCommentCreateManyAndReturnData} createdData - Arguments to create many Comments.
   * @example
   * // Create many Comments
   * const comment = gassma.Comment.createManyAndReturn({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   * // Create many Comments and only return the `id`
   * const commentWithIdOnly = gassma.Comment.createManyAndReturn({
   *   select: { id: true },
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createManyAndReturn<T extends GassmaGassmaCommentCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Comment">>>(createdData: T & Gassma.Subset<T, GassmaGassmaCommentCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Comment">>>): GassmaGassmaCommentFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create a Comment.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/create
   * @param {GassmaGassmaCommentCreateData} createdData - Arguments to create a Comment.
   * @example
   * // Create one Comment
   * const Comment = gassma.Comment.create({
   *   data: {
   *     // ... data to create a Comment
   *   }
   * })
   * 
   */
  create<T extends GassmaGassmaCommentCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "Comment">>>(createdData: T & Gassma.Subset<T, GassmaGassmaCommentCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "Comment">>>): GassmaGassmaCommentFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first Comment that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @param {GassmaGassmaCommentFindFirstData} findData - Arguments to find a Comment
   * @example
   * // Get one Comment
   * const comment = gassma.Comment.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends GassmaGassmaCommentFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Comment">>>(findData: T & Gassma.Subset<T, GassmaGassmaCommentFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Comment">>>): GassmaGassmaCommentFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Find the first Comment.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @example
   * // Get the first Comment
   * const comment = gassma.Comment.findFirst()
   */
  findFirst(): GassmaGassmaCommentFindResult<unknown, unknown, unknown, GO, O, CMap> | null;
  /**
   * Find the first Comment that matches the filter or
   * throw `NotFoundError` if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @param {GassmaGassmaCommentFindFirstData} findData - Arguments to find a Comment
   * @example
   * // Get one Comment
   * const comment = gassma.Comment.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends GassmaGassmaCommentFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Comment">>>(findData: T & Gassma.Subset<T, GassmaGassmaCommentFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Comment">>>): GassmaGassmaCommentFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first Comment or throw `NotFoundError` if no Comments exist.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @example
   * // Get the first Comment
   * const comment = gassma.Comment.findFirstOrThrow()
   */
  findFirstOrThrow(): GassmaGassmaCommentFindResult<unknown, unknown, unknown, GO, O, CMap>;
  /**
   * Find zero or more Comments that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @param {GassmaGassmaCommentFindManyData} findData - Arguments to filter and select certain fields only.
   * @example
   * // Get all Comments
   * const comments = gassma.Comment.findMany()
   * 
   * // Get first 10 Comments
   * const comments = gassma.Comment.findMany({ take: 10 })
   * 
   * // Only select the `id`
   * const commentWithIdOnly = gassma.Comment.findMany({ select: { id: true } })
   * 
   */
  findMany<T extends GassmaGassmaCommentFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "Comment">>>(findData: T & Gassma.Subset<T, GassmaGassmaCommentFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "Comment">>>): GassmaGassmaCommentFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Find all Comments.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @example
   * // Get all Comments
   * const comments = gassma.Comment.findMany()
   */
  findMany(): GassmaGassmaCommentFindResult<unknown, unknown, unknown, GO, O, CMap>[];
  /**
   * Update one Comment.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/update
   * @param {GassmaGassmaCommentUpdateSingleData} updateData - Arguments to update one Comment.
   * @example
   * // Update one Comment
   * const comment = gassma.Comment.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends GassmaGassmaCommentUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Comment">>>(updateData: T & Gassma.Subset<T, GassmaGassmaCommentUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Comment">>>): GassmaGassmaCommentFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Update zero or more Comments.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateMany
   * @param {GassmaGassmaCommentUpdateData} updateData - Arguments to update one or more rows.
   * @example
   * // Update many Comments
   * const { count } = gassma.Comment.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany(updateData: GassmaGassmaCommentUpdateData): UpdateManyReturn;
  /**
   * Update zero or more Comments and returns the data updated in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateManyAndReturn
   * @param {GassmaGassmaCommentUpdateManyAndReturnData} updateData - Arguments to update many Comments.
   * @example
   * // Update many Comments
   * const comments = gassma.Comment.updateManyAndReturn({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   * // Update zero or more Comments and only return the `id`
   * const commentWithIdOnly = gassma.Comment.updateManyAndReturn({
   *   select: { id: true },
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateManyAndReturn<T extends GassmaGassmaCommentUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Comment">>>(updateData: T & Gassma.Subset<T, GassmaGassmaCommentUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Comment">>>): GassmaGassmaCommentFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create or update one Comment.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/upsert
   * @param {GassmaGassmaCommentUpsertSingleData} upsertData - Arguments to update or create a Comment.
   * @example
   * // Update or create a Comment
   * const comment = gassma.Comment.upsert({
   *   create: {
   *     // ... data to create a Comment
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Comment we want to update
   *   }
   * })
   */
  upsert<T extends GassmaGassmaCommentUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Comment">>>(upsertData: T & Gassma.Subset<T, GassmaGassmaCommentUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Comment">>>): GassmaGassmaCommentFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Delete a Comment.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/delete
   * @param {GassmaGassmaCommentDeleteSingleData} deleteData - Arguments to delete one Comment.
   * @example
   * // Delete one Comment
   * const Comment = gassma.Comment.delete({
   *   where: {
   *     // ... filter to delete one Comment
   *   }
   * })
   * 
   */
  delete<T extends GassmaGassmaCommentDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Comment">>>(deleteData: T & Gassma.Subset<T, GassmaGassmaCommentDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Comment">>>): GassmaGassmaCommentFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Delete zero or more Comments.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @param {GassmaGassmaCommentDeleteData} deleteData - Arguments to filter Comments to delete.
   * @example
   * // Delete a few Comments
   * const { count } = gassma.Comment.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany(deleteData: GassmaGassmaCommentDeleteData): DeleteManyReturn;
  /**
   * Delete every Comment.
   * Calling `deleteMany` without arguments deletes **all** rows in the sheet. This cannot be undone.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @example
   * // Delete every Comment in the sheet
   * const { count } = gassma.Comment.deleteMany()
   */
  deleteMany(): DeleteManyReturn;
  /**
   * Allows you to perform aggregations operations on a Comment.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/aggregate
   * @param {GassmaGassmaCommentAggregateData} aggregateData - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Count the Comments that match the filter
   * const aggregations = gassma.Comment.aggregate({
   *   _count: true,
   *   where: {
   *     // ... provide filter here
   *   },
   *   take: 10,
   * })
   */
  aggregate<T extends GassmaGassmaCommentAggregateData>(aggregateData: T & Gassma.Subset<T, GassmaGassmaCommentAggregateData>): GassmaGassmaCommentAggregateResult<T>;
  /**
   * Count the number of Comments.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @param {GassmaGassmaCommentCountData} countData - Arguments to filter Comments to count.
   * @example
   * // Count the number of Comments
   * const count = gassma.Comment.count({
   *   where: {
   *     // ... the filter for the Comments we want to count
   *   }
   * })
   */
  count<T extends GassmaGassmaCommentCountData>(countData: T & Gassma.Subset<T, GassmaGassmaCommentCountData>): GassmaGassmaCommentCountResult<T>;
  /**
   * Count every Comment.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @example
   * // Count every Comment
   * const count = gassma.Comment.count()
   */
  count(): number;
  /**
   * Group by Comment.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/groupBy
   * @param {GassmaGassmaCommentGroupByData} groupByData - Group by arguments.
   * @example
   * // Group by id, get count
   * const result = gassma.Comment.groupBy({
   *   by: ['id'],
   *   _count: true,
   * })
   * 
   */
  groupBy<T extends GassmaGassmaCommentGroupByData>(groupByData: T & Gassma.Subset<T, GassmaGassmaCommentGroupByData>): GassmaGassmaCommentGroupByResult<T>[];
  /**
   * Get the value the next `create` will issue for an autoincrement field of Comment.
   * Reading the counter is allowed inside `$transaction`.
   * Throws `GassmaAutoincrementNotConfiguredError` when the field is not an autoincrement field.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Comment.
   * @example
   * // The id the next Comment will get
   * const next = gassma.Comment.$getAutoincrement("id")
   */
  $getAutoincrement(field: "id"): number;
  /**
   * Set the value the next `create` will issue for an autoincrement field of Comment.
   * `next` is the value that will be issued next, so it must be an integer of 1 or more.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Comment.
   * @param {number} next - The value the next `create` will issue.
   * @example
   * // Let the next Comment continue from 1000
   * gassma.Comment.$setAutoincrement("id", 1000)
   */
  $setAutoincrement(field: "id", next: number): void;
  /**
   * Line the counter of Comment up with the rows already in the sheet.
   * The counter becomes the largest value in the column plus one, which is also the return value.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Comment.
   * @example
   * // Adopt a sheet that already has rows
   * const next = gassma.Comment.$syncAutoincrement("id")
   */
  $syncAutoincrement(field: "id"): number;
}

/**
 * The delegate class that exposes CRUD operations for the **Category** model.
 */
export declare class GassmaGassmaCategoryController<GO extends GassmaGassmaCategoryOmit = {}, O = {}, CMap = {}> {
  constructor(sheetName: string, id?: string);

  /**
   * Fields of the Category model
   */
  readonly fields: Record<string, Gassma.FieldRef>;
  /**
   * Change the range this model reads and writes on the spreadsheet.
   * Read more here: https://gassma.io/en/docs/reference/settings/changeSettings
   * @param {number} startRowNumber - The row number the header row lives on.
   * @param {number | string} startColumnValue - The first column of the range.
   * @param {number | string} endColumnValue - The last column of the range.
   */
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  /**
   * Create many Categories.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createMany
   * @param {GassmaGassmaCategoryCreateManyData} createdData - Arguments to create many Categories.
   * @example
   * // Create many Categories
   * const category = gassma.Category.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createMany(createdData: GassmaGassmaCategoryCreateManyData): CreateManyReturn;
  /**
   * Create many Categories and returns the data saved in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createManyAndReturn
   * @param {GassmaGassmaCategoryCreateManyAndReturnData} createdData - Arguments to create many Categories.
   * @example
   * // Create many Categories
   * const category = gassma.Category.createManyAndReturn({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   * // Create many Categories and only return the `id`
   * const categoryWithIdOnly = gassma.Category.createManyAndReturn({
   *   select: { id: true },
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createManyAndReturn<T extends GassmaGassmaCategoryCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Category">>>(createdData: T & Gassma.Subset<T, GassmaGassmaCategoryCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Category">>>): GassmaGassmaCategoryFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create a Category.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/create
   * @param {GassmaGassmaCategoryCreateData} createdData - Arguments to create a Category.
   * @example
   * // Create one Category
   * const Category = gassma.Category.create({
   *   data: {
   *     // ... data to create a Category
   *   }
   * })
   * 
   */
  create<T extends GassmaGassmaCategoryCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "Category">>>(createdData: T & Gassma.Subset<T, GassmaGassmaCategoryCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "Category">>>): GassmaGassmaCategoryFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first Category that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @param {GassmaGassmaCategoryFindFirstData} findData - Arguments to find a Category
   * @example
   * // Get one Category
   * const category = gassma.Category.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends GassmaGassmaCategoryFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Category">>>(findData: T & Gassma.Subset<T, GassmaGassmaCategoryFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Category">>>): GassmaGassmaCategoryFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Find the first Category.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @example
   * // Get the first Category
   * const category = gassma.Category.findFirst()
   */
  findFirst(): GassmaGassmaCategoryFindResult<unknown, unknown, unknown, GO, O, CMap> | null;
  /**
   * Find the first Category that matches the filter or
   * throw `NotFoundError` if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @param {GassmaGassmaCategoryFindFirstData} findData - Arguments to find a Category
   * @example
   * // Get one Category
   * const category = gassma.Category.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends GassmaGassmaCategoryFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Category">>>(findData: T & Gassma.Subset<T, GassmaGassmaCategoryFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Category">>>): GassmaGassmaCategoryFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first Category or throw `NotFoundError` if no Categories exist.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @example
   * // Get the first Category
   * const category = gassma.Category.findFirstOrThrow()
   */
  findFirstOrThrow(): GassmaGassmaCategoryFindResult<unknown, unknown, unknown, GO, O, CMap>;
  /**
   * Find zero or more Categories that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @param {GassmaGassmaCategoryFindManyData} findData - Arguments to filter and select certain fields only.
   * @example
   * // Get all Categories
   * const categories = gassma.Category.findMany()
   * 
   * // Get first 10 Categories
   * const categories = gassma.Category.findMany({ take: 10 })
   * 
   * // Only select the `id`
   * const categoryWithIdOnly = gassma.Category.findMany({ select: { id: true } })
   * 
   */
  findMany<T extends GassmaGassmaCategoryFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "Category">>>(findData: T & Gassma.Subset<T, GassmaGassmaCategoryFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "Category">>>): GassmaGassmaCategoryFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Find all Categories.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @example
   * // Get all Categories
   * const categories = gassma.Category.findMany()
   */
  findMany(): GassmaGassmaCategoryFindResult<unknown, unknown, unknown, GO, O, CMap>[];
  /**
   * Update one Category.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/update
   * @param {GassmaGassmaCategoryUpdateSingleData} updateData - Arguments to update one Category.
   * @example
   * // Update one Category
   * const category = gassma.Category.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends GassmaGassmaCategoryUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Category">>>(updateData: T & Gassma.Subset<T, GassmaGassmaCategoryUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Category">>>): GassmaGassmaCategoryFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Update zero or more Categories.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateMany
   * @param {GassmaGassmaCategoryUpdateData} updateData - Arguments to update one or more rows.
   * @example
   * // Update many Categories
   * const { count } = gassma.Category.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany(updateData: GassmaGassmaCategoryUpdateData): UpdateManyReturn;
  /**
   * Update zero or more Categories and returns the data updated in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateManyAndReturn
   * @param {GassmaGassmaCategoryUpdateManyAndReturnData} updateData - Arguments to update many Categories.
   * @example
   * // Update many Categories
   * const categories = gassma.Category.updateManyAndReturn({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   * // Update zero or more Categories and only return the `id`
   * const categoryWithIdOnly = gassma.Category.updateManyAndReturn({
   *   select: { id: true },
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateManyAndReturn<T extends GassmaGassmaCategoryUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Category">>>(updateData: T & Gassma.Subset<T, GassmaGassmaCategoryUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Category">>>): GassmaGassmaCategoryFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create or update one Category.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/upsert
   * @param {GassmaGassmaCategoryUpsertSingleData} upsertData - Arguments to update or create a Category.
   * @example
   * // Update or create a Category
   * const category = gassma.Category.upsert({
   *   create: {
   *     // ... data to create a Category
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Category we want to update
   *   }
   * })
   */
  upsert<T extends GassmaGassmaCategoryUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Category">>>(upsertData: T & Gassma.Subset<T, GassmaGassmaCategoryUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Category">>>): GassmaGassmaCategoryFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Delete a Category.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/delete
   * @param {GassmaGassmaCategoryDeleteSingleData} deleteData - Arguments to delete one Category.
   * @example
   * // Delete one Category
   * const Category = gassma.Category.delete({
   *   where: {
   *     // ... filter to delete one Category
   *   }
   * })
   * 
   */
  delete<T extends GassmaGassmaCategoryDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Category">>>(deleteData: T & Gassma.Subset<T, GassmaGassmaCategoryDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Category">>>): GassmaGassmaCategoryFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Delete zero or more Categories.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @param {GassmaGassmaCategoryDeleteData} deleteData - Arguments to filter Categories to delete.
   * @example
   * // Delete a few Categories
   * const { count } = gassma.Category.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany(deleteData: GassmaGassmaCategoryDeleteData): DeleteManyReturn;
  /**
   * Delete every Category.
   * Calling `deleteMany` without arguments deletes **all** rows in the sheet. This cannot be undone.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @example
   * // Delete every Category in the sheet
   * const { count } = gassma.Category.deleteMany()
   */
  deleteMany(): DeleteManyReturn;
  /**
   * Allows you to perform aggregations operations on a Category.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/aggregate
   * @param {GassmaGassmaCategoryAggregateData} aggregateData - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Count the Categories that match the filter
   * const aggregations = gassma.Category.aggregate({
   *   _count: true,
   *   where: {
   *     // ... provide filter here
   *   },
   *   take: 10,
   * })
   */
  aggregate<T extends GassmaGassmaCategoryAggregateData>(aggregateData: T & Gassma.Subset<T, GassmaGassmaCategoryAggregateData>): GassmaGassmaCategoryAggregateResult<T>;
  /**
   * Count the number of Categories.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @param {GassmaGassmaCategoryCountData} countData - Arguments to filter Categories to count.
   * @example
   * // Count the number of Categories
   * const count = gassma.Category.count({
   *   where: {
   *     // ... the filter for the Categories we want to count
   *   }
   * })
   */
  count<T extends GassmaGassmaCategoryCountData>(countData: T & Gassma.Subset<T, GassmaGassmaCategoryCountData>): GassmaGassmaCategoryCountResult<T>;
  /**
   * Count every Category.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @example
   * // Count every Category
   * const count = gassma.Category.count()
   */
  count(): number;
  /**
   * Group by Category.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/groupBy
   * @param {GassmaGassmaCategoryGroupByData} groupByData - Group by arguments.
   * @example
   * // Group by id, get count
   * const result = gassma.Category.groupBy({
   *   by: ['id'],
   *   _count: true,
   * })
   * 
   */
  groupBy<T extends GassmaGassmaCategoryGroupByData>(groupByData: T & Gassma.Subset<T, GassmaGassmaCategoryGroupByData>): GassmaGassmaCategoryGroupByResult<T>[];
  /**
   * Get the value the next `create` will issue for an autoincrement field of Category.
   * Reading the counter is allowed inside `$transaction`.
   * Throws `GassmaAutoincrementNotConfiguredError` when the field is not an autoincrement field.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Category.
   * @example
   * // The id the next Category will get
   * const next = gassma.Category.$getAutoincrement("id")
   */
  $getAutoincrement(field: "id"): number;
  /**
   * Set the value the next `create` will issue for an autoincrement field of Category.
   * `next` is the value that will be issued next, so it must be an integer of 1 or more.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Category.
   * @param {number} next - The value the next `create` will issue.
   * @example
   * // Let the next Category continue from 1000
   * gassma.Category.$setAutoincrement("id", 1000)
   */
  $setAutoincrement(field: "id", next: number): void;
  /**
   * Line the counter of Category up with the rows already in the sheet.
   * The counter becomes the largest value in the column plus one, which is also the return value.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Category.
   * @example
   * // Adopt a sheet that already has rows
   * const next = gassma.Category.$syncAutoincrement("id")
   */
  $syncAutoincrement(field: "id"): number;
}

/**
 * The delegate class that exposes CRUD operations for the **Tag** model.
 */
export declare class GassmaGassmaTagController<GO extends GassmaGassmaTagOmit = {}, O = {}, CMap = {}> {
  constructor(sheetName: string, id?: string);

  /**
   * Fields of the Tag model
   */
  readonly fields: Record<string, Gassma.FieldRef>;
  /**
   * Change the range this model reads and writes on the spreadsheet.
   * Read more here: https://gassma.io/en/docs/reference/settings/changeSettings
   * @param {number} startRowNumber - The row number the header row lives on.
   * @param {number | string} startColumnValue - The first column of the range.
   * @param {number | string} endColumnValue - The last column of the range.
   */
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  /**
   * Create many Tags.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createMany
   * @param {GassmaGassmaTagCreateManyData} createdData - Arguments to create many Tags.
   * @example
   * // Create many Tags
   * const tag = gassma.Tag.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createMany(createdData: GassmaGassmaTagCreateManyData): CreateManyReturn;
  /**
   * Create many Tags and returns the data saved in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createManyAndReturn
   * @param {GassmaGassmaTagCreateManyAndReturnData} createdData - Arguments to create many Tags.
   * @example
   * // Create many Tags
   * const tag = gassma.Tag.createManyAndReturn({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   * // Create many Tags and only return the `id`
   * const tagWithIdOnly = gassma.Tag.createManyAndReturn({
   *   select: { id: true },
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createManyAndReturn<T extends GassmaGassmaTagCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Tag">>>(createdData: T & Gassma.Subset<T, GassmaGassmaTagCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Tag">>>): GassmaGassmaTagFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create a Tag.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/create
   * @param {GassmaGassmaTagCreateData} createdData - Arguments to create a Tag.
   * @example
   * // Create one Tag
   * const Tag = gassma.Tag.create({
   *   data: {
   *     // ... data to create a Tag
   *   }
   * })
   * 
   */
  create<T extends GassmaGassmaTagCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "Tag">>>(createdData: T & Gassma.Subset<T, GassmaGassmaTagCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "Tag">>>): GassmaGassmaTagFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first Tag that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @param {GassmaGassmaTagFindFirstData} findData - Arguments to find a Tag
   * @example
   * // Get one Tag
   * const tag = gassma.Tag.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends GassmaGassmaTagFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Tag">>>(findData: T & Gassma.Subset<T, GassmaGassmaTagFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Tag">>>): GassmaGassmaTagFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Find the first Tag.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @example
   * // Get the first Tag
   * const tag = gassma.Tag.findFirst()
   */
  findFirst(): GassmaGassmaTagFindResult<unknown, unknown, unknown, GO, O, CMap> | null;
  /**
   * Find the first Tag that matches the filter or
   * throw `NotFoundError` if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @param {GassmaGassmaTagFindFirstData} findData - Arguments to find a Tag
   * @example
   * // Get one Tag
   * const tag = gassma.Tag.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends GassmaGassmaTagFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Tag">>>(findData: T & Gassma.Subset<T, GassmaGassmaTagFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Tag">>>): GassmaGassmaTagFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first Tag or throw `NotFoundError` if no Tags exist.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @example
   * // Get the first Tag
   * const tag = gassma.Tag.findFirstOrThrow()
   */
  findFirstOrThrow(): GassmaGassmaTagFindResult<unknown, unknown, unknown, GO, O, CMap>;
  /**
   * Find zero or more Tags that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @param {GassmaGassmaTagFindManyData} findData - Arguments to filter and select certain fields only.
   * @example
   * // Get all Tags
   * const tags = gassma.Tag.findMany()
   * 
   * // Get first 10 Tags
   * const tags = gassma.Tag.findMany({ take: 10 })
   * 
   * // Only select the `id`
   * const tagWithIdOnly = gassma.Tag.findMany({ select: { id: true } })
   * 
   */
  findMany<T extends GassmaGassmaTagFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "Tag">>>(findData: T & Gassma.Subset<T, GassmaGassmaTagFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "Tag">>>): GassmaGassmaTagFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Find all Tags.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @example
   * // Get all Tags
   * const tags = gassma.Tag.findMany()
   */
  findMany(): GassmaGassmaTagFindResult<unknown, unknown, unknown, GO, O, CMap>[];
  /**
   * Update one Tag.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/update
   * @param {GassmaGassmaTagUpdateSingleData} updateData - Arguments to update one Tag.
   * @example
   * // Update one Tag
   * const tag = gassma.Tag.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends GassmaGassmaTagUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Tag">>>(updateData: T & Gassma.Subset<T, GassmaGassmaTagUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Tag">>>): GassmaGassmaTagFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Update zero or more Tags.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateMany
   * @param {GassmaGassmaTagUpdateData} updateData - Arguments to update one or more rows.
   * @example
   * // Update many Tags
   * const { count } = gassma.Tag.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany(updateData: GassmaGassmaTagUpdateData): UpdateManyReturn;
  /**
   * Update zero or more Tags and returns the data updated in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateManyAndReturn
   * @param {GassmaGassmaTagUpdateManyAndReturnData} updateData - Arguments to update many Tags.
   * @example
   * // Update many Tags
   * const tags = gassma.Tag.updateManyAndReturn({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   * // Update zero or more Tags and only return the `id`
   * const tagWithIdOnly = gassma.Tag.updateManyAndReturn({
   *   select: { id: true },
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateManyAndReturn<T extends GassmaGassmaTagUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Tag">>>(updateData: T & Gassma.Subset<T, GassmaGassmaTagUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Tag">>>): GassmaGassmaTagFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create or update one Tag.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/upsert
   * @param {GassmaGassmaTagUpsertSingleData} upsertData - Arguments to update or create a Tag.
   * @example
   * // Update or create a Tag
   * const tag = gassma.Tag.upsert({
   *   create: {
   *     // ... data to create a Tag
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Tag we want to update
   *   }
   * })
   */
  upsert<T extends GassmaGassmaTagUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Tag">>>(upsertData: T & Gassma.Subset<T, GassmaGassmaTagUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Tag">>>): GassmaGassmaTagFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Delete a Tag.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/delete
   * @param {GassmaGassmaTagDeleteSingleData} deleteData - Arguments to delete one Tag.
   * @example
   * // Delete one Tag
   * const Tag = gassma.Tag.delete({
   *   where: {
   *     // ... filter to delete one Tag
   *   }
   * })
   * 
   */
  delete<T extends GassmaGassmaTagDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Tag">>>(deleteData: T & Gassma.Subset<T, GassmaGassmaTagDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Tag">>>): GassmaGassmaTagFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Delete zero or more Tags.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @param {GassmaGassmaTagDeleteData} deleteData - Arguments to filter Tags to delete.
   * @example
   * // Delete a few Tags
   * const { count } = gassma.Tag.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany(deleteData: GassmaGassmaTagDeleteData): DeleteManyReturn;
  /**
   * Delete every Tag.
   * Calling `deleteMany` without arguments deletes **all** rows in the sheet. This cannot be undone.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @example
   * // Delete every Tag in the sheet
   * const { count } = gassma.Tag.deleteMany()
   */
  deleteMany(): DeleteManyReturn;
  /**
   * Allows you to perform aggregations operations on a Tag.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/aggregate
   * @param {GassmaGassmaTagAggregateData} aggregateData - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Count the Tags that match the filter
   * const aggregations = gassma.Tag.aggregate({
   *   _count: true,
   *   where: {
   *     // ... provide filter here
   *   },
   *   take: 10,
   * })
   */
  aggregate<T extends GassmaGassmaTagAggregateData>(aggregateData: T & Gassma.Subset<T, GassmaGassmaTagAggregateData>): GassmaGassmaTagAggregateResult<T>;
  /**
   * Count the number of Tags.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @param {GassmaGassmaTagCountData} countData - Arguments to filter Tags to count.
   * @example
   * // Count the number of Tags
   * const count = gassma.Tag.count({
   *   where: {
   *     // ... the filter for the Tags we want to count
   *   }
   * })
   */
  count<T extends GassmaGassmaTagCountData>(countData: T & Gassma.Subset<T, GassmaGassmaTagCountData>): GassmaGassmaTagCountResult<T>;
  /**
   * Count every Tag.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @example
   * // Count every Tag
   * const count = gassma.Tag.count()
   */
  count(): number;
  /**
   * Group by Tag.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/groupBy
   * @param {GassmaGassmaTagGroupByData} groupByData - Group by arguments.
   * @example
   * // Group by id, get count
   * const result = gassma.Tag.groupBy({
   *   by: ['id'],
   *   _count: true,
   * })
   * 
   */
  groupBy<T extends GassmaGassmaTagGroupByData>(groupByData: T & Gassma.Subset<T, GassmaGassmaTagGroupByData>): GassmaGassmaTagGroupByResult<T>[];
  /**
   * Get the value the next `create` will issue for an autoincrement field of Tag.
   * Reading the counter is allowed inside `$transaction`.
   * Throws `GassmaAutoincrementNotConfiguredError` when the field is not an autoincrement field.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Tag.
   * @example
   * // The id the next Tag will get
   * const next = gassma.Tag.$getAutoincrement("id")
   */
  $getAutoincrement(field: "id"): number;
  /**
   * Set the value the next `create` will issue for an autoincrement field of Tag.
   * `next` is the value that will be issued next, so it must be an integer of 1 or more.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Tag.
   * @param {number} next - The value the next `create` will issue.
   * @example
   * // Let the next Tag continue from 1000
   * gassma.Tag.$setAutoincrement("id", 1000)
   */
  $setAutoincrement(field: "id", next: number): void;
  /**
   * Line the counter of Tag up with the rows already in the sheet.
   * The counter becomes the largest value in the column plus one, which is also the return value.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Tag.
   * @example
   * // Adopt a sheet that already has rows
   * const next = gassma.Tag.$syncAutoincrement("id")
   */
  $syncAutoincrement(field: "id"): number;
}

/**
 * The delegate class that exposes CRUD operations for the **SensorReading** model.
 */
export declare class GassmaGassmaSensorReadingController<GO extends GassmaGassmaSensorReadingOmit = {}, O = {}, CMap = {}> {
  constructor(sheetName: string, id?: string);

  /**
   * Fields of the SensorReading model
   */
  readonly fields: Record<string, Gassma.FieldRef>;
  /**
   * Change the range this model reads and writes on the spreadsheet.
   * Read more here: https://gassma.io/en/docs/reference/settings/changeSettings
   * @param {number} startRowNumber - The row number the header row lives on.
   * @param {number | string} startColumnValue - The first column of the range.
   * @param {number | string} endColumnValue - The last column of the range.
   */
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  /**
   * Create many SensorReadings.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createMany
   * @param {GassmaGassmaSensorReadingCreateManyData} createdData - Arguments to create many SensorReadings.
   * @example
   * // Create many SensorReadings
   * const sensorReading = gassma.SensorReading.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createMany(createdData: GassmaGassmaSensorReadingCreateManyData): CreateManyReturn;
  /**
   * Create many SensorReadings and returns the data saved in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createManyAndReturn
   * @param {GassmaGassmaSensorReadingCreateManyAndReturnData} createdData - Arguments to create many SensorReadings.
   * @example
   * // Create many SensorReadings
   * const sensorReading = gassma.SensorReading.createManyAndReturn({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   * // Create many SensorReadings and only return the `id`
   * const sensorReadingWithIdOnly = gassma.SensorReading.createManyAndReturn({
   *   select: { id: true },
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createManyAndReturn<T extends GassmaGassmaSensorReadingCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "SensorReading">>>(createdData: T & Gassma.Subset<T, GassmaGassmaSensorReadingCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "SensorReading">>>): GassmaGassmaSensorReadingFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create a SensorReading.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/create
   * @param {GassmaGassmaSensorReadingCreateData} createdData - Arguments to create a SensorReading.
   * @example
   * // Create one SensorReading
   * const SensorReading = gassma.SensorReading.create({
   *   data: {
   *     // ... data to create a SensorReading
   *   }
   * })
   * 
   */
  create<T extends GassmaGassmaSensorReadingCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "SensorReading">>>(createdData: T & Gassma.Subset<T, GassmaGassmaSensorReadingCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "SensorReading">>>): GassmaGassmaSensorReadingFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first SensorReading that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @param {GassmaGassmaSensorReadingFindFirstData} findData - Arguments to find a SensorReading
   * @example
   * // Get one SensorReading
   * const sensorReading = gassma.SensorReading.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends GassmaGassmaSensorReadingFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "SensorReading">>>(findData: T & Gassma.Subset<T, GassmaGassmaSensorReadingFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "SensorReading">>>): GassmaGassmaSensorReadingFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Find the first SensorReading.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @example
   * // Get the first SensorReading
   * const sensorReading = gassma.SensorReading.findFirst()
   */
  findFirst(): GassmaGassmaSensorReadingFindResult<unknown, unknown, unknown, GO, O, CMap> | null;
  /**
   * Find the first SensorReading that matches the filter or
   * throw `NotFoundError` if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @param {GassmaGassmaSensorReadingFindFirstData} findData - Arguments to find a SensorReading
   * @example
   * // Get one SensorReading
   * const sensorReading = gassma.SensorReading.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends GassmaGassmaSensorReadingFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "SensorReading">>>(findData: T & Gassma.Subset<T, GassmaGassmaSensorReadingFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "SensorReading">>>): GassmaGassmaSensorReadingFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first SensorReading or throw `NotFoundError` if no SensorReadings exist.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @example
   * // Get the first SensorReading
   * const sensorReading = gassma.SensorReading.findFirstOrThrow()
   */
  findFirstOrThrow(): GassmaGassmaSensorReadingFindResult<unknown, unknown, unknown, GO, O, CMap>;
  /**
   * Find zero or more SensorReadings that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @param {GassmaGassmaSensorReadingFindManyData} findData - Arguments to filter and select certain fields only.
   * @example
   * // Get all SensorReadings
   * const sensorReadings = gassma.SensorReading.findMany()
   * 
   * // Get first 10 SensorReadings
   * const sensorReadings = gassma.SensorReading.findMany({ take: 10 })
   * 
   * // Only select the `id`
   * const sensorReadingWithIdOnly = gassma.SensorReading.findMany({ select: { id: true } })
   * 
   */
  findMany<T extends GassmaGassmaSensorReadingFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "SensorReading">>>(findData: T & Gassma.Subset<T, GassmaGassmaSensorReadingFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "SensorReading">>>): GassmaGassmaSensorReadingFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Find all SensorReadings.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @example
   * // Get all SensorReadings
   * const sensorReadings = gassma.SensorReading.findMany()
   */
  findMany(): GassmaGassmaSensorReadingFindResult<unknown, unknown, unknown, GO, O, CMap>[];
  /**
   * Update one SensorReading.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/update
   * @param {GassmaGassmaSensorReadingUpdateSingleData} updateData - Arguments to update one SensorReading.
   * @example
   * // Update one SensorReading
   * const sensorReading = gassma.SensorReading.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends GassmaGassmaSensorReadingUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "SensorReading">>>(updateData: T & Gassma.Subset<T, GassmaGassmaSensorReadingUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "SensorReading">>>): GassmaGassmaSensorReadingFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Update zero or more SensorReadings.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateMany
   * @param {GassmaGassmaSensorReadingUpdateData} updateData - Arguments to update one or more rows.
   * @example
   * // Update many SensorReadings
   * const { count } = gassma.SensorReading.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany(updateData: GassmaGassmaSensorReadingUpdateData): UpdateManyReturn;
  /**
   * Update zero or more SensorReadings and returns the data updated in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateManyAndReturn
   * @param {GassmaGassmaSensorReadingUpdateManyAndReturnData} updateData - Arguments to update many SensorReadings.
   * @example
   * // Update many SensorReadings
   * const sensorReadings = gassma.SensorReading.updateManyAndReturn({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   * // Update zero or more SensorReadings and only return the `id`
   * const sensorReadingWithIdOnly = gassma.SensorReading.updateManyAndReturn({
   *   select: { id: true },
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateManyAndReturn<T extends GassmaGassmaSensorReadingUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "SensorReading">>>(updateData: T & Gassma.Subset<T, GassmaGassmaSensorReadingUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "SensorReading">>>): GassmaGassmaSensorReadingFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create or update one SensorReading.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/upsert
   * @param {GassmaGassmaSensorReadingUpsertSingleData} upsertData - Arguments to update or create a SensorReading.
   * @example
   * // Update or create a SensorReading
   * const sensorReading = gassma.SensorReading.upsert({
   *   create: {
   *     // ... data to create a SensorReading
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the SensorReading we want to update
   *   }
   * })
   */
  upsert<T extends GassmaGassmaSensorReadingUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "SensorReading">>>(upsertData: T & Gassma.Subset<T, GassmaGassmaSensorReadingUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "SensorReading">>>): GassmaGassmaSensorReadingFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Delete a SensorReading.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/delete
   * @param {GassmaGassmaSensorReadingDeleteSingleData} deleteData - Arguments to delete one SensorReading.
   * @example
   * // Delete one SensorReading
   * const SensorReading = gassma.SensorReading.delete({
   *   where: {
   *     // ... filter to delete one SensorReading
   *   }
   * })
   * 
   */
  delete<T extends GassmaGassmaSensorReadingDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "SensorReading">>>(deleteData: T & Gassma.Subset<T, GassmaGassmaSensorReadingDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "SensorReading">>>): GassmaGassmaSensorReadingFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Delete zero or more SensorReadings.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @param {GassmaGassmaSensorReadingDeleteData} deleteData - Arguments to filter SensorReadings to delete.
   * @example
   * // Delete a few SensorReadings
   * const { count } = gassma.SensorReading.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany(deleteData: GassmaGassmaSensorReadingDeleteData): DeleteManyReturn;
  /**
   * Delete every SensorReading.
   * Calling `deleteMany` without arguments deletes **all** rows in the sheet. This cannot be undone.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @example
   * // Delete every SensorReading in the sheet
   * const { count } = gassma.SensorReading.deleteMany()
   */
  deleteMany(): DeleteManyReturn;
  /**
   * Allows you to perform aggregations operations on a SensorReading.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/aggregate
   * @param {GassmaGassmaSensorReadingAggregateData} aggregateData - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Count the SensorReadings that match the filter
   * const aggregations = gassma.SensorReading.aggregate({
   *   _count: true,
   *   where: {
   *     // ... provide filter here
   *   },
   *   take: 10,
   * })
   */
  aggregate<T extends GassmaGassmaSensorReadingAggregateData>(aggregateData: T & Gassma.Subset<T, GassmaGassmaSensorReadingAggregateData>): GassmaGassmaSensorReadingAggregateResult<T>;
  /**
   * Count the number of SensorReadings.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @param {GassmaGassmaSensorReadingCountData} countData - Arguments to filter SensorReadings to count.
   * @example
   * // Count the number of SensorReadings
   * const count = gassma.SensorReading.count({
   *   where: {
   *     // ... the filter for the SensorReadings we want to count
   *   }
   * })
   */
  count<T extends GassmaGassmaSensorReadingCountData>(countData: T & Gassma.Subset<T, GassmaGassmaSensorReadingCountData>): GassmaGassmaSensorReadingCountResult<T>;
  /**
   * Count every SensorReading.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @example
   * // Count every SensorReading
   * const count = gassma.SensorReading.count()
   */
  count(): number;
  /**
   * Group by SensorReading.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/groupBy
   * @param {GassmaGassmaSensorReadingGroupByData} groupByData - Group by arguments.
   * @example
   * // Group by id, get count
   * const result = gassma.SensorReading.groupBy({
   *   by: ['id'],
   *   _count: true,
   * })
   * 
   */
  groupBy<T extends GassmaGassmaSensorReadingGroupByData>(groupByData: T & Gassma.Subset<T, GassmaGassmaSensorReadingGroupByData>): GassmaGassmaSensorReadingGroupByResult<T>[];
  /**
   * Get the value the next `create` will issue for an autoincrement field of SensorReading.
   * Reading the counter is allowed inside `$transaction`.
   * Throws `GassmaAutoincrementNotConfiguredError` when the field is not an autoincrement field.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of SensorReading.
   * @example
   * // The id the next SensorReading will get
   * const next = gassma.SensorReading.$getAutoincrement("id")
   */
  $getAutoincrement(field: "id"): number;
  /**
   * Set the value the next `create` will issue for an autoincrement field of SensorReading.
   * `next` is the value that will be issued next, so it must be an integer of 1 or more.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of SensorReading.
   * @param {number} next - The value the next `create` will issue.
   * @example
   * // Let the next SensorReading continue from 1000
   * gassma.SensorReading.$setAutoincrement("id", 1000)
   */
  $setAutoincrement(field: "id", next: number): void;
  /**
   * Line the counter of SensorReading up with the rows already in the sheet.
   * The counter becomes the largest value in the column plus one, which is also the return value.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of SensorReading.
   * @example
   * // Adopt a sheet that already has rows
   * const next = gassma.SensorReading.$syncAutoincrement("id")
   */
  $syncAutoincrement(field: "id"): number;
}

/**
 * The delegate class that exposes CRUD operations for the **TimeSlot** model.
 */
export declare class GassmaGassmaTimeSlotController<GO extends GassmaGassmaTimeSlotOmit = {}, O = {}, CMap = {}> {
  constructor(sheetName: string, id?: string);

  /**
   * Fields of the TimeSlot model
   */
  readonly fields: Record<string, Gassma.FieldRef>;
  /**
   * Change the range this model reads and writes on the spreadsheet.
   * Read more here: https://gassma.io/en/docs/reference/settings/changeSettings
   * @param {number} startRowNumber - The row number the header row lives on.
   * @param {number | string} startColumnValue - The first column of the range.
   * @param {number | string} endColumnValue - The last column of the range.
   */
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  /**
   * Create many TimeSlots.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createMany
   * @param {GassmaGassmaTimeSlotCreateManyData} createdData - Arguments to create many TimeSlots.
   * @example
   * // Create many TimeSlots
   * const timeSlot = gassma.TimeSlot.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createMany(createdData: GassmaGassmaTimeSlotCreateManyData): CreateManyReturn;
  /**
   * Create many TimeSlots and returns the data saved in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createManyAndReturn
   * @param {GassmaGassmaTimeSlotCreateManyAndReturnData} createdData - Arguments to create many TimeSlots.
   * @example
   * // Create many TimeSlots
   * const timeSlot = gassma.TimeSlot.createManyAndReturn({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   * // Create many TimeSlots and only return the `id`
   * const timeSlotWithIdOnly = gassma.TimeSlot.createManyAndReturn({
   *   select: { id: true },
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createManyAndReturn<T extends GassmaGassmaTimeSlotCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "TimeSlot">>>(createdData: T & Gassma.Subset<T, GassmaGassmaTimeSlotCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "TimeSlot">>>): GassmaGassmaTimeSlotFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create a TimeSlot.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/create
   * @param {GassmaGassmaTimeSlotCreateData} createdData - Arguments to create a TimeSlot.
   * @example
   * // Create one TimeSlot
   * const TimeSlot = gassma.TimeSlot.create({
   *   data: {
   *     // ... data to create a TimeSlot
   *   }
   * })
   * 
   */
  create<T extends GassmaGassmaTimeSlotCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "TimeSlot">>>(createdData: T & Gassma.Subset<T, GassmaGassmaTimeSlotCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "TimeSlot">>>): GassmaGassmaTimeSlotFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first TimeSlot that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @param {GassmaGassmaTimeSlotFindFirstData} findData - Arguments to find a TimeSlot
   * @example
   * // Get one TimeSlot
   * const timeSlot = gassma.TimeSlot.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends GassmaGassmaTimeSlotFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "TimeSlot">>>(findData: T & Gassma.Subset<T, GassmaGassmaTimeSlotFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "TimeSlot">>>): GassmaGassmaTimeSlotFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Find the first TimeSlot.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @example
   * // Get the first TimeSlot
   * const timeSlot = gassma.TimeSlot.findFirst()
   */
  findFirst(): GassmaGassmaTimeSlotFindResult<unknown, unknown, unknown, GO, O, CMap> | null;
  /**
   * Find the first TimeSlot that matches the filter or
   * throw `NotFoundError` if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @param {GassmaGassmaTimeSlotFindFirstData} findData - Arguments to find a TimeSlot
   * @example
   * // Get one TimeSlot
   * const timeSlot = gassma.TimeSlot.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends GassmaGassmaTimeSlotFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "TimeSlot">>>(findData: T & Gassma.Subset<T, GassmaGassmaTimeSlotFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "TimeSlot">>>): GassmaGassmaTimeSlotFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first TimeSlot or throw `NotFoundError` if no TimeSlots exist.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @example
   * // Get the first TimeSlot
   * const timeSlot = gassma.TimeSlot.findFirstOrThrow()
   */
  findFirstOrThrow(): GassmaGassmaTimeSlotFindResult<unknown, unknown, unknown, GO, O, CMap>;
  /**
   * Find zero or more TimeSlots that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @param {GassmaGassmaTimeSlotFindManyData} findData - Arguments to filter and select certain fields only.
   * @example
   * // Get all TimeSlots
   * const timeSlots = gassma.TimeSlot.findMany()
   * 
   * // Get first 10 TimeSlots
   * const timeSlots = gassma.TimeSlot.findMany({ take: 10 })
   * 
   * // Only select the `id`
   * const timeSlotWithIdOnly = gassma.TimeSlot.findMany({ select: { id: true } })
   * 
   */
  findMany<T extends GassmaGassmaTimeSlotFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "TimeSlot">>>(findData: T & Gassma.Subset<T, GassmaGassmaTimeSlotFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "TimeSlot">>>): GassmaGassmaTimeSlotFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Find all TimeSlots.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @example
   * // Get all TimeSlots
   * const timeSlots = gassma.TimeSlot.findMany()
   */
  findMany(): GassmaGassmaTimeSlotFindResult<unknown, unknown, unknown, GO, O, CMap>[];
  /**
   * Update one TimeSlot.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/update
   * @param {GassmaGassmaTimeSlotUpdateSingleData} updateData - Arguments to update one TimeSlot.
   * @example
   * // Update one TimeSlot
   * const timeSlot = gassma.TimeSlot.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends GassmaGassmaTimeSlotUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "TimeSlot">>>(updateData: T & Gassma.Subset<T, GassmaGassmaTimeSlotUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "TimeSlot">>>): GassmaGassmaTimeSlotFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Update zero or more TimeSlots.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateMany
   * @param {GassmaGassmaTimeSlotUpdateData} updateData - Arguments to update one or more rows.
   * @example
   * // Update many TimeSlots
   * const { count } = gassma.TimeSlot.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany(updateData: GassmaGassmaTimeSlotUpdateData): UpdateManyReturn;
  /**
   * Update zero or more TimeSlots and returns the data updated in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateManyAndReturn
   * @param {GassmaGassmaTimeSlotUpdateManyAndReturnData} updateData - Arguments to update many TimeSlots.
   * @example
   * // Update many TimeSlots
   * const timeSlots = gassma.TimeSlot.updateManyAndReturn({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   * // Update zero or more TimeSlots and only return the `id`
   * const timeSlotWithIdOnly = gassma.TimeSlot.updateManyAndReturn({
   *   select: { id: true },
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateManyAndReturn<T extends GassmaGassmaTimeSlotUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "TimeSlot">>>(updateData: T & Gassma.Subset<T, GassmaGassmaTimeSlotUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "TimeSlot">>>): GassmaGassmaTimeSlotFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create or update one TimeSlot.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/upsert
   * @param {GassmaGassmaTimeSlotUpsertSingleData} upsertData - Arguments to update or create a TimeSlot.
   * @example
   * // Update or create a TimeSlot
   * const timeSlot = gassma.TimeSlot.upsert({
   *   create: {
   *     // ... data to create a TimeSlot
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the TimeSlot we want to update
   *   }
   * })
   */
  upsert<T extends GassmaGassmaTimeSlotUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "TimeSlot">>>(upsertData: T & Gassma.Subset<T, GassmaGassmaTimeSlotUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "TimeSlot">>>): GassmaGassmaTimeSlotFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Delete a TimeSlot.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/delete
   * @param {GassmaGassmaTimeSlotDeleteSingleData} deleteData - Arguments to delete one TimeSlot.
   * @example
   * // Delete one TimeSlot
   * const TimeSlot = gassma.TimeSlot.delete({
   *   where: {
   *     // ... filter to delete one TimeSlot
   *   }
   * })
   * 
   */
  delete<T extends GassmaGassmaTimeSlotDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "TimeSlot">>>(deleteData: T & Gassma.Subset<T, GassmaGassmaTimeSlotDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "TimeSlot">>>): GassmaGassmaTimeSlotFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Delete zero or more TimeSlots.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @param {GassmaGassmaTimeSlotDeleteData} deleteData - Arguments to filter TimeSlots to delete.
   * @example
   * // Delete a few TimeSlots
   * const { count } = gassma.TimeSlot.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany(deleteData: GassmaGassmaTimeSlotDeleteData): DeleteManyReturn;
  /**
   * Delete every TimeSlot.
   * Calling `deleteMany` without arguments deletes **all** rows in the sheet. This cannot be undone.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @example
   * // Delete every TimeSlot in the sheet
   * const { count } = gassma.TimeSlot.deleteMany()
   */
  deleteMany(): DeleteManyReturn;
  /**
   * Allows you to perform aggregations operations on a TimeSlot.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/aggregate
   * @param {GassmaGassmaTimeSlotAggregateData} aggregateData - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Count the TimeSlots that match the filter
   * const aggregations = gassma.TimeSlot.aggregate({
   *   _count: true,
   *   where: {
   *     // ... provide filter here
   *   },
   *   take: 10,
   * })
   */
  aggregate<T extends GassmaGassmaTimeSlotAggregateData>(aggregateData: T & Gassma.Subset<T, GassmaGassmaTimeSlotAggregateData>): GassmaGassmaTimeSlotAggregateResult<T>;
  /**
   * Count the number of TimeSlots.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @param {GassmaGassmaTimeSlotCountData} countData - Arguments to filter TimeSlots to count.
   * @example
   * // Count the number of TimeSlots
   * const count = gassma.TimeSlot.count({
   *   where: {
   *     // ... the filter for the TimeSlots we want to count
   *   }
   * })
   */
  count<T extends GassmaGassmaTimeSlotCountData>(countData: T & Gassma.Subset<T, GassmaGassmaTimeSlotCountData>): GassmaGassmaTimeSlotCountResult<T>;
  /**
   * Count every TimeSlot.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @example
   * // Count every TimeSlot
   * const count = gassma.TimeSlot.count()
   */
  count(): number;
  /**
   * Group by TimeSlot.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/groupBy
   * @param {GassmaGassmaTimeSlotGroupByData} groupByData - Group by arguments.
   * @example
   * // Group by id, get count
   * const result = gassma.TimeSlot.groupBy({
   *   by: ['id'],
   *   _count: true,
   * })
   * 
   */
  groupBy<T extends GassmaGassmaTimeSlotGroupByData>(groupByData: T & Gassma.Subset<T, GassmaGassmaTimeSlotGroupByData>): GassmaGassmaTimeSlotGroupByResult<T>[];
  /**
   * Get the value the next `create` will issue for an autoincrement field of TimeSlot.
   * Reading the counter is allowed inside `$transaction`.
   * Throws `GassmaAutoincrementNotConfiguredError` when the field is not an autoincrement field.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of TimeSlot.
   * @example
   * // The id the next TimeSlot will get
   * const next = gassma.TimeSlot.$getAutoincrement("id")
   */
  $getAutoincrement(field: "id"): number;
  /**
   * Set the value the next `create` will issue for an autoincrement field of TimeSlot.
   * `next` is the value that will be issued next, so it must be an integer of 1 or more.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of TimeSlot.
   * @param {number} next - The value the next `create` will issue.
   * @example
   * // Let the next TimeSlot continue from 1000
   * gassma.TimeSlot.$setAutoincrement("id", 1000)
   */
  $setAutoincrement(field: "id", next: number): void;
  /**
   * Line the counter of TimeSlot up with the rows already in the sheet.
   * The counter becomes the largest value in the column plus one, which is also the return value.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of TimeSlot.
   * @example
   * // Adopt a sheet that already has rows
   * const next = gassma.TimeSlot.$syncAutoincrement("id")
   */
  $syncAutoincrement(field: "id"): number;
}

/**
 * The delegate class that exposes CRUD operations for the **Reservation** model.
 */
export declare class GassmaGassmaReservationController<GO extends GassmaGassmaReservationOmit = {}, O = {}, CMap = {}> {
  constructor(sheetName: string, id?: string);

  /**
   * Fields of the Reservation model
   */
  readonly fields: Record<string, Gassma.FieldRef>;
  /**
   * Change the range this model reads and writes on the spreadsheet.
   * Read more here: https://gassma.io/en/docs/reference/settings/changeSettings
   * @param {number} startRowNumber - The row number the header row lives on.
   * @param {number | string} startColumnValue - The first column of the range.
   * @param {number | string} endColumnValue - The last column of the range.
   */
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  /**
   * Create many Reservations.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createMany
   * @param {GassmaGassmaReservationCreateManyData} createdData - Arguments to create many Reservations.
   * @example
   * // Create many Reservations
   * const reservation = gassma.Reservation.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createMany(createdData: GassmaGassmaReservationCreateManyData): CreateManyReturn;
  /**
   * Create many Reservations and returns the data saved in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createManyAndReturn
   * @param {GassmaGassmaReservationCreateManyAndReturnData} createdData - Arguments to create many Reservations.
   * @example
   * // Create many Reservations
   * const reservation = gassma.Reservation.createManyAndReturn({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   * // Create many Reservations and only return the `id`
   * const reservationWithIdOnly = gassma.Reservation.createManyAndReturn({
   *   select: { id: true },
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createManyAndReturn<T extends GassmaGassmaReservationCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Reservation">>>(createdData: T & Gassma.Subset<T, GassmaGassmaReservationCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Reservation">>>): GassmaGassmaReservationFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create a Reservation.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/create
   * @param {GassmaGassmaReservationCreateData} createdData - Arguments to create a Reservation.
   * @example
   * // Create one Reservation
   * const Reservation = gassma.Reservation.create({
   *   data: {
   *     // ... data to create a Reservation
   *   }
   * })
   * 
   */
  create<T extends GassmaGassmaReservationCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "Reservation">>>(createdData: T & Gassma.Subset<T, GassmaGassmaReservationCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "Reservation">>>): GassmaGassmaReservationFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first Reservation that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @param {GassmaGassmaReservationFindFirstData} findData - Arguments to find a Reservation
   * @example
   * // Get one Reservation
   * const reservation = gassma.Reservation.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends GassmaGassmaReservationFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Reservation">>>(findData: T & Gassma.Subset<T, GassmaGassmaReservationFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Reservation">>>): GassmaGassmaReservationFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Find the first Reservation.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @example
   * // Get the first Reservation
   * const reservation = gassma.Reservation.findFirst()
   */
  findFirst(): GassmaGassmaReservationFindResult<unknown, unknown, unknown, GO, O, CMap> | null;
  /**
   * Find the first Reservation that matches the filter or
   * throw `NotFoundError` if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @param {GassmaGassmaReservationFindFirstData} findData - Arguments to find a Reservation
   * @example
   * // Get one Reservation
   * const reservation = gassma.Reservation.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends GassmaGassmaReservationFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Reservation">>>(findData: T & Gassma.Subset<T, GassmaGassmaReservationFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Reservation">>>): GassmaGassmaReservationFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first Reservation or throw `NotFoundError` if no Reservations exist.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @example
   * // Get the first Reservation
   * const reservation = gassma.Reservation.findFirstOrThrow()
   */
  findFirstOrThrow(): GassmaGassmaReservationFindResult<unknown, unknown, unknown, GO, O, CMap>;
  /**
   * Find zero or more Reservations that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @param {GassmaGassmaReservationFindManyData} findData - Arguments to filter and select certain fields only.
   * @example
   * // Get all Reservations
   * const reservations = gassma.Reservation.findMany()
   * 
   * // Get first 10 Reservations
   * const reservations = gassma.Reservation.findMany({ take: 10 })
   * 
   * // Only select the `id`
   * const reservationWithIdOnly = gassma.Reservation.findMany({ select: { id: true } })
   * 
   */
  findMany<T extends GassmaGassmaReservationFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "Reservation">>>(findData: T & Gassma.Subset<T, GassmaGassmaReservationFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "Reservation">>>): GassmaGassmaReservationFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Find all Reservations.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @example
   * // Get all Reservations
   * const reservations = gassma.Reservation.findMany()
   */
  findMany(): GassmaGassmaReservationFindResult<unknown, unknown, unknown, GO, O, CMap>[];
  /**
   * Update one Reservation.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/update
   * @param {GassmaGassmaReservationUpdateSingleData} updateData - Arguments to update one Reservation.
   * @example
   * // Update one Reservation
   * const reservation = gassma.Reservation.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends GassmaGassmaReservationUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Reservation">>>(updateData: T & Gassma.Subset<T, GassmaGassmaReservationUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Reservation">>>): GassmaGassmaReservationFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Update zero or more Reservations.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateMany
   * @param {GassmaGassmaReservationUpdateData} updateData - Arguments to update one or more rows.
   * @example
   * // Update many Reservations
   * const { count } = gassma.Reservation.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany(updateData: GassmaGassmaReservationUpdateData): UpdateManyReturn;
  /**
   * Update zero or more Reservations and returns the data updated in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateManyAndReturn
   * @param {GassmaGassmaReservationUpdateManyAndReturnData} updateData - Arguments to update many Reservations.
   * @example
   * // Update many Reservations
   * const reservations = gassma.Reservation.updateManyAndReturn({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   * // Update zero or more Reservations and only return the `id`
   * const reservationWithIdOnly = gassma.Reservation.updateManyAndReturn({
   *   select: { id: true },
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateManyAndReturn<T extends GassmaGassmaReservationUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Reservation">>>(updateData: T & Gassma.Subset<T, GassmaGassmaReservationUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Reservation">>>): GassmaGassmaReservationFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create or update one Reservation.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/upsert
   * @param {GassmaGassmaReservationUpsertSingleData} upsertData - Arguments to update or create a Reservation.
   * @example
   * // Update or create a Reservation
   * const reservation = gassma.Reservation.upsert({
   *   create: {
   *     // ... data to create a Reservation
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Reservation we want to update
   *   }
   * })
   */
  upsert<T extends GassmaGassmaReservationUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Reservation">>>(upsertData: T & Gassma.Subset<T, GassmaGassmaReservationUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Reservation">>>): GassmaGassmaReservationFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Delete a Reservation.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/delete
   * @param {GassmaGassmaReservationDeleteSingleData} deleteData - Arguments to delete one Reservation.
   * @example
   * // Delete one Reservation
   * const Reservation = gassma.Reservation.delete({
   *   where: {
   *     // ... filter to delete one Reservation
   *   }
   * })
   * 
   */
  delete<T extends GassmaGassmaReservationDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Reservation">>>(deleteData: T & Gassma.Subset<T, GassmaGassmaReservationDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Reservation">>>): GassmaGassmaReservationFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Delete zero or more Reservations.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @param {GassmaGassmaReservationDeleteData} deleteData - Arguments to filter Reservations to delete.
   * @example
   * // Delete a few Reservations
   * const { count } = gassma.Reservation.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany(deleteData: GassmaGassmaReservationDeleteData): DeleteManyReturn;
  /**
   * Delete every Reservation.
   * Calling `deleteMany` without arguments deletes **all** rows in the sheet. This cannot be undone.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @example
   * // Delete every Reservation in the sheet
   * const { count } = gassma.Reservation.deleteMany()
   */
  deleteMany(): DeleteManyReturn;
  /**
   * Allows you to perform aggregations operations on a Reservation.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/aggregate
   * @param {GassmaGassmaReservationAggregateData} aggregateData - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Count the Reservations that match the filter
   * const aggregations = gassma.Reservation.aggregate({
   *   _count: true,
   *   where: {
   *     // ... provide filter here
   *   },
   *   take: 10,
   * })
   */
  aggregate<T extends GassmaGassmaReservationAggregateData>(aggregateData: T & Gassma.Subset<T, GassmaGassmaReservationAggregateData>): GassmaGassmaReservationAggregateResult<T>;
  /**
   * Count the number of Reservations.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @param {GassmaGassmaReservationCountData} countData - Arguments to filter Reservations to count.
   * @example
   * // Count the number of Reservations
   * const count = gassma.Reservation.count({
   *   where: {
   *     // ... the filter for the Reservations we want to count
   *   }
   * })
   */
  count<T extends GassmaGassmaReservationCountData>(countData: T & Gassma.Subset<T, GassmaGassmaReservationCountData>): GassmaGassmaReservationCountResult<T>;
  /**
   * Count every Reservation.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @example
   * // Count every Reservation
   * const count = gassma.Reservation.count()
   */
  count(): number;
  /**
   * Group by Reservation.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/groupBy
   * @param {GassmaGassmaReservationGroupByData} groupByData - Group by arguments.
   * @example
   * // Group by id, get count
   * const result = gassma.Reservation.groupBy({
   *   by: ['id'],
   *   _count: true,
   * })
   * 
   */
  groupBy<T extends GassmaGassmaReservationGroupByData>(groupByData: T & Gassma.Subset<T, GassmaGassmaReservationGroupByData>): GassmaGassmaReservationGroupByResult<T>[];
  /**
   * Get the value the next `create` will issue for an autoincrement field of Reservation.
   * Reading the counter is allowed inside `$transaction`.
   * Throws `GassmaAutoincrementNotConfiguredError` when the field is not an autoincrement field.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Reservation.
   * @example
   * // The id the next Reservation will get
   * const next = gassma.Reservation.$getAutoincrement("id")
   */
  $getAutoincrement(field: "id"): number;
  /**
   * Set the value the next `create` will issue for an autoincrement field of Reservation.
   * `next` is the value that will be issued next, so it must be an integer of 1 or more.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Reservation.
   * @param {number} next - The value the next `create` will issue.
   * @example
   * // Let the next Reservation continue from 1000
   * gassma.Reservation.$setAutoincrement("id", 1000)
   */
  $setAutoincrement(field: "id", next: number): void;
  /**
   * Line the counter of Reservation up with the rows already in the sheet.
   * The counter becomes the largest value in the column plus one, which is also the return value.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Reservation.
   * @example
   * // Adopt a sheet that already has rows
   * const next = gassma.Reservation.$syncAutoincrement("id")
   */
  $syncAutoincrement(field: "id"): number;
}

/**
 * The delegate class that exposes CRUD operations for the **Product** model.
 */
export declare class GassmaGassmaProductController<GO extends GassmaGassmaProductOmit = {}, O = {}, CMap = {}> {
  constructor(sheetName: string, id?: string);

  /**
   * Fields of the Product model
   */
  readonly fields: Record<string, Gassma.FieldRef>;
  /**
   * Change the range this model reads and writes on the spreadsheet.
   * Read more here: https://gassma.io/en/docs/reference/settings/changeSettings
   * @param {number} startRowNumber - The row number the header row lives on.
   * @param {number | string} startColumnValue - The first column of the range.
   * @param {number | string} endColumnValue - The last column of the range.
   */
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  /**
   * Create many Products.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createMany
   * @param {GassmaGassmaProductCreateManyData} createdData - Arguments to create many Products.
   * @example
   * // Create many Products
   * const product = gassma.Product.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createMany(createdData: GassmaGassmaProductCreateManyData): CreateManyReturn;
  /**
   * Create many Products and returns the data saved in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createManyAndReturn
   * @param {GassmaGassmaProductCreateManyAndReturnData} createdData - Arguments to create many Products.
   * @example
   * // Create many Products
   * const product = gassma.Product.createManyAndReturn({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   * // Create many Products and only return the `id`
   * const productWithIdOnly = gassma.Product.createManyAndReturn({
   *   select: { id: true },
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createManyAndReturn<T extends GassmaGassmaProductCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Product">>>(createdData: T & Gassma.Subset<T, GassmaGassmaProductCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Product">>>): GassmaGassmaProductFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create a Product.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/create
   * @param {GassmaGassmaProductCreateData} createdData - Arguments to create a Product.
   * @example
   * // Create one Product
   * const Product = gassma.Product.create({
   *   data: {
   *     // ... data to create a Product
   *   }
   * })
   * 
   */
  create<T extends GassmaGassmaProductCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "Product">>>(createdData: T & Gassma.Subset<T, GassmaGassmaProductCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "Product">>>): GassmaGassmaProductFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first Product that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @param {GassmaGassmaProductFindFirstData} findData - Arguments to find a Product
   * @example
   * // Get one Product
   * const product = gassma.Product.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends GassmaGassmaProductFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Product">>>(findData: T & Gassma.Subset<T, GassmaGassmaProductFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Product">>>): GassmaGassmaProductFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Find the first Product.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @example
   * // Get the first Product
   * const product = gassma.Product.findFirst()
   */
  findFirst(): GassmaGassmaProductFindResult<unknown, unknown, unknown, GO, O, CMap> | null;
  /**
   * Find the first Product that matches the filter or
   * throw `NotFoundError` if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @param {GassmaGassmaProductFindFirstData} findData - Arguments to find a Product
   * @example
   * // Get one Product
   * const product = gassma.Product.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends GassmaGassmaProductFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Product">>>(findData: T & Gassma.Subset<T, GassmaGassmaProductFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Product">>>): GassmaGassmaProductFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first Product or throw `NotFoundError` if no Products exist.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @example
   * // Get the first Product
   * const product = gassma.Product.findFirstOrThrow()
   */
  findFirstOrThrow(): GassmaGassmaProductFindResult<unknown, unknown, unknown, GO, O, CMap>;
  /**
   * Find zero or more Products that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @param {GassmaGassmaProductFindManyData} findData - Arguments to filter and select certain fields only.
   * @example
   * // Get all Products
   * const products = gassma.Product.findMany()
   * 
   * // Get first 10 Products
   * const products = gassma.Product.findMany({ take: 10 })
   * 
   * // Only select the `id`
   * const productWithIdOnly = gassma.Product.findMany({ select: { id: true } })
   * 
   */
  findMany<T extends GassmaGassmaProductFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "Product">>>(findData: T & Gassma.Subset<T, GassmaGassmaProductFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "Product">>>): GassmaGassmaProductFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Find all Products.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @example
   * // Get all Products
   * const products = gassma.Product.findMany()
   */
  findMany(): GassmaGassmaProductFindResult<unknown, unknown, unknown, GO, O, CMap>[];
  /**
   * Update one Product.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/update
   * @param {GassmaGassmaProductUpdateSingleData} updateData - Arguments to update one Product.
   * @example
   * // Update one Product
   * const product = gassma.Product.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends GassmaGassmaProductUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Product">>>(updateData: T & Gassma.Subset<T, GassmaGassmaProductUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Product">>>): GassmaGassmaProductFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Update zero or more Products.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateMany
   * @param {GassmaGassmaProductUpdateData} updateData - Arguments to update one or more rows.
   * @example
   * // Update many Products
   * const { count } = gassma.Product.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany(updateData: GassmaGassmaProductUpdateData): UpdateManyReturn;
  /**
   * Update zero or more Products and returns the data updated in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateManyAndReturn
   * @param {GassmaGassmaProductUpdateManyAndReturnData} updateData - Arguments to update many Products.
   * @example
   * // Update many Products
   * const products = gassma.Product.updateManyAndReturn({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   * // Update zero or more Products and only return the `id`
   * const productWithIdOnly = gassma.Product.updateManyAndReturn({
   *   select: { id: true },
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateManyAndReturn<T extends GassmaGassmaProductUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Product">>>(updateData: T & Gassma.Subset<T, GassmaGassmaProductUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Product">>>): GassmaGassmaProductFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create or update one Product.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/upsert
   * @param {GassmaGassmaProductUpsertSingleData} upsertData - Arguments to update or create a Product.
   * @example
   * // Update or create a Product
   * const product = gassma.Product.upsert({
   *   create: {
   *     // ... data to create a Product
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Product we want to update
   *   }
   * })
   */
  upsert<T extends GassmaGassmaProductUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Product">>>(upsertData: T & Gassma.Subset<T, GassmaGassmaProductUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Product">>>): GassmaGassmaProductFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Delete a Product.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/delete
   * @param {GassmaGassmaProductDeleteSingleData} deleteData - Arguments to delete one Product.
   * @example
   * // Delete one Product
   * const Product = gassma.Product.delete({
   *   where: {
   *     // ... filter to delete one Product
   *   }
   * })
   * 
   */
  delete<T extends GassmaGassmaProductDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Product">>>(deleteData: T & Gassma.Subset<T, GassmaGassmaProductDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Product">>>): GassmaGassmaProductFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Delete zero or more Products.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @param {GassmaGassmaProductDeleteData} deleteData - Arguments to filter Products to delete.
   * @example
   * // Delete a few Products
   * const { count } = gassma.Product.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany(deleteData: GassmaGassmaProductDeleteData): DeleteManyReturn;
  /**
   * Delete every Product.
   * Calling `deleteMany` without arguments deletes **all** rows in the sheet. This cannot be undone.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @example
   * // Delete every Product in the sheet
   * const { count } = gassma.Product.deleteMany()
   */
  deleteMany(): DeleteManyReturn;
  /**
   * Allows you to perform aggregations operations on a Product.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/aggregate
   * @param {GassmaGassmaProductAggregateData} aggregateData - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Count the Products that match the filter
   * const aggregations = gassma.Product.aggregate({
   *   _count: true,
   *   where: {
   *     // ... provide filter here
   *   },
   *   take: 10,
   * })
   */
  aggregate<T extends GassmaGassmaProductAggregateData>(aggregateData: T & Gassma.Subset<T, GassmaGassmaProductAggregateData>): GassmaGassmaProductAggregateResult<T>;
  /**
   * Count the number of Products.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @param {GassmaGassmaProductCountData} countData - Arguments to filter Products to count.
   * @example
   * // Count the number of Products
   * const count = gassma.Product.count({
   *   where: {
   *     // ... the filter for the Products we want to count
   *   }
   * })
   */
  count<T extends GassmaGassmaProductCountData>(countData: T & Gassma.Subset<T, GassmaGassmaProductCountData>): GassmaGassmaProductCountResult<T>;
  /**
   * Count every Product.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @example
   * // Count every Product
   * const count = gassma.Product.count()
   */
  count(): number;
  /**
   * Group by Product.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/groupBy
   * @param {GassmaGassmaProductGroupByData} groupByData - Group by arguments.
   * @example
   * // Group by id, get count
   * const result = gassma.Product.groupBy({
   *   by: ['id'],
   *   _count: true,
   * })
   * 
   */
  groupBy<T extends GassmaGassmaProductGroupByData>(groupByData: T & Gassma.Subset<T, GassmaGassmaProductGroupByData>): GassmaGassmaProductGroupByResult<T>[];
  /**
   * Get the value the next `create` will issue for an autoincrement field of Product.
   * Reading the counter is allowed inside `$transaction`.
   * Throws `GassmaAutoincrementNotConfiguredError` when the field is not an autoincrement field.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Product.
   * @example
   * // The id the next Product will get
   * const next = gassma.Product.$getAutoincrement("id")
   */
  $getAutoincrement(field: "id"): number;
  /**
   * Set the value the next `create` will issue for an autoincrement field of Product.
   * `next` is the value that will be issued next, so it must be an integer of 1 or more.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Product.
   * @param {number} next - The value the next `create` will issue.
   * @example
   * // Let the next Product continue from 1000
   * gassma.Product.$setAutoincrement("id", 1000)
   */
  $setAutoincrement(field: "id", next: number): void;
  /**
   * Line the counter of Product up with the rows already in the sheet.
   * The counter becomes the largest value in the column plus one, which is also the return value.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Product.
   * @example
   * // Adopt a sheet that already has rows
   * const next = gassma.Product.$syncAutoincrement("id")
   */
  $syncAutoincrement(field: "id"): number;
}

/**
 * The delegate class that exposes CRUD operations for the **Order** model.
 */
export declare class GassmaGassmaOrderController<GO extends GassmaGassmaOrderOmit = {}, O = {}, CMap = {}> {
  constructor(sheetName: string, id?: string);

  /**
   * Fields of the Order model
   */
  readonly fields: Record<string, Gassma.FieldRef>;
  /**
   * Change the range this model reads and writes on the spreadsheet.
   * Read more here: https://gassma.io/en/docs/reference/settings/changeSettings
   * @param {number} startRowNumber - The row number the header row lives on.
   * @param {number | string} startColumnValue - The first column of the range.
   * @param {number | string} endColumnValue - The last column of the range.
   */
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  /**
   * Create many Orders.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createMany
   * @param {GassmaGassmaOrderCreateManyData} createdData - Arguments to create many Orders.
   * @example
   * // Create many Orders
   * const order = gassma.Order.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createMany(createdData: GassmaGassmaOrderCreateManyData): CreateManyReturn;
  /**
   * Create many Orders and returns the data saved in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createManyAndReturn
   * @param {GassmaGassmaOrderCreateManyAndReturnData} createdData - Arguments to create many Orders.
   * @example
   * // Create many Orders
   * const order = gassma.Order.createManyAndReturn({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   * // Create many Orders and only return the `id`
   * const orderWithIdOnly = gassma.Order.createManyAndReturn({
   *   select: { id: true },
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createManyAndReturn<T extends GassmaGassmaOrderCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Order">>>(createdData: T & Gassma.Subset<T, GassmaGassmaOrderCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Order">>>): GassmaGassmaOrderFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create a Order.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/create
   * @param {GassmaGassmaOrderCreateData} createdData - Arguments to create a Order.
   * @example
   * // Create one Order
   * const Order = gassma.Order.create({
   *   data: {
   *     // ... data to create a Order
   *   }
   * })
   * 
   */
  create<T extends GassmaGassmaOrderCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "Order">>>(createdData: T & Gassma.Subset<T, GassmaGassmaOrderCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "Order">>>): GassmaGassmaOrderFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first Order that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @param {GassmaGassmaOrderFindFirstData} findData - Arguments to find a Order
   * @example
   * // Get one Order
   * const order = gassma.Order.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends GassmaGassmaOrderFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Order">>>(findData: T & Gassma.Subset<T, GassmaGassmaOrderFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Order">>>): GassmaGassmaOrderFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Find the first Order.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @example
   * // Get the first Order
   * const order = gassma.Order.findFirst()
   */
  findFirst(): GassmaGassmaOrderFindResult<unknown, unknown, unknown, GO, O, CMap> | null;
  /**
   * Find the first Order that matches the filter or
   * throw `NotFoundError` if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @param {GassmaGassmaOrderFindFirstData} findData - Arguments to find a Order
   * @example
   * // Get one Order
   * const order = gassma.Order.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends GassmaGassmaOrderFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Order">>>(findData: T & Gassma.Subset<T, GassmaGassmaOrderFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Order">>>): GassmaGassmaOrderFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first Order or throw `NotFoundError` if no Orders exist.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @example
   * // Get the first Order
   * const order = gassma.Order.findFirstOrThrow()
   */
  findFirstOrThrow(): GassmaGassmaOrderFindResult<unknown, unknown, unknown, GO, O, CMap>;
  /**
   * Find zero or more Orders that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @param {GassmaGassmaOrderFindManyData} findData - Arguments to filter and select certain fields only.
   * @example
   * // Get all Orders
   * const orders = gassma.Order.findMany()
   * 
   * // Get first 10 Orders
   * const orders = gassma.Order.findMany({ take: 10 })
   * 
   * // Only select the `id`
   * const orderWithIdOnly = gassma.Order.findMany({ select: { id: true } })
   * 
   */
  findMany<T extends GassmaGassmaOrderFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "Order">>>(findData: T & Gassma.Subset<T, GassmaGassmaOrderFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "Order">>>): GassmaGassmaOrderFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Find all Orders.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @example
   * // Get all Orders
   * const orders = gassma.Order.findMany()
   */
  findMany(): GassmaGassmaOrderFindResult<unknown, unknown, unknown, GO, O, CMap>[];
  /**
   * Update one Order.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/update
   * @param {GassmaGassmaOrderUpdateSingleData} updateData - Arguments to update one Order.
   * @example
   * // Update one Order
   * const order = gassma.Order.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends GassmaGassmaOrderUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Order">>>(updateData: T & Gassma.Subset<T, GassmaGassmaOrderUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Order">>>): GassmaGassmaOrderFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Update zero or more Orders.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateMany
   * @param {GassmaGassmaOrderUpdateData} updateData - Arguments to update one or more rows.
   * @example
   * // Update many Orders
   * const { count } = gassma.Order.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany(updateData: GassmaGassmaOrderUpdateData): UpdateManyReturn;
  /**
   * Update zero or more Orders and returns the data updated in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateManyAndReturn
   * @param {GassmaGassmaOrderUpdateManyAndReturnData} updateData - Arguments to update many Orders.
   * @example
   * // Update many Orders
   * const orders = gassma.Order.updateManyAndReturn({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   * // Update zero or more Orders and only return the `id`
   * const orderWithIdOnly = gassma.Order.updateManyAndReturn({
   *   select: { id: true },
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateManyAndReturn<T extends GassmaGassmaOrderUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Order">>>(updateData: T & Gassma.Subset<T, GassmaGassmaOrderUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Order">>>): GassmaGassmaOrderFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create or update one Order.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/upsert
   * @param {GassmaGassmaOrderUpsertSingleData} upsertData - Arguments to update or create a Order.
   * @example
   * // Update or create a Order
   * const order = gassma.Order.upsert({
   *   create: {
   *     // ... data to create a Order
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Order we want to update
   *   }
   * })
   */
  upsert<T extends GassmaGassmaOrderUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Order">>>(upsertData: T & Gassma.Subset<T, GassmaGassmaOrderUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Order">>>): GassmaGassmaOrderFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Delete a Order.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/delete
   * @param {GassmaGassmaOrderDeleteSingleData} deleteData - Arguments to delete one Order.
   * @example
   * // Delete one Order
   * const Order = gassma.Order.delete({
   *   where: {
   *     // ... filter to delete one Order
   *   }
   * })
   * 
   */
  delete<T extends GassmaGassmaOrderDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Order">>>(deleteData: T & Gassma.Subset<T, GassmaGassmaOrderDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Order">>>): GassmaGassmaOrderFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Delete zero or more Orders.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @param {GassmaGassmaOrderDeleteData} deleteData - Arguments to filter Orders to delete.
   * @example
   * // Delete a few Orders
   * const { count } = gassma.Order.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany(deleteData: GassmaGassmaOrderDeleteData): DeleteManyReturn;
  /**
   * Delete every Order.
   * Calling `deleteMany` without arguments deletes **all** rows in the sheet. This cannot be undone.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @example
   * // Delete every Order in the sheet
   * const { count } = gassma.Order.deleteMany()
   */
  deleteMany(): DeleteManyReturn;
  /**
   * Allows you to perform aggregations operations on a Order.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/aggregate
   * @param {GassmaGassmaOrderAggregateData} aggregateData - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Count the Orders that match the filter
   * const aggregations = gassma.Order.aggregate({
   *   _count: true,
   *   where: {
   *     // ... provide filter here
   *   },
   *   take: 10,
   * })
   */
  aggregate<T extends GassmaGassmaOrderAggregateData>(aggregateData: T & Gassma.Subset<T, GassmaGassmaOrderAggregateData>): GassmaGassmaOrderAggregateResult<T>;
  /**
   * Count the number of Orders.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @param {GassmaGassmaOrderCountData} countData - Arguments to filter Orders to count.
   * @example
   * // Count the number of Orders
   * const count = gassma.Order.count({
   *   where: {
   *     // ... the filter for the Orders we want to count
   *   }
   * })
   */
  count<T extends GassmaGassmaOrderCountData>(countData: T & Gassma.Subset<T, GassmaGassmaOrderCountData>): GassmaGassmaOrderCountResult<T>;
  /**
   * Count every Order.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @example
   * // Count every Order
   * const count = gassma.Order.count()
   */
  count(): number;
  /**
   * Group by Order.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/groupBy
   * @param {GassmaGassmaOrderGroupByData} groupByData - Group by arguments.
   * @example
   * // Group by id, get count
   * const result = gassma.Order.groupBy({
   *   by: ['id'],
   *   _count: true,
   * })
   * 
   */
  groupBy<T extends GassmaGassmaOrderGroupByData>(groupByData: T & Gassma.Subset<T, GassmaGassmaOrderGroupByData>): GassmaGassmaOrderGroupByResult<T>[];
  /**
   * Get the value the next `create` will issue for an autoincrement field of Order.
   * Reading the counter is allowed inside `$transaction`.
   * Throws `GassmaAutoincrementNotConfiguredError` when the field is not an autoincrement field.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Order.
   * @example
   * // The id the next Order will get
   * const next = gassma.Order.$getAutoincrement("id")
   */
  $getAutoincrement(field: "id"): number;
  /**
   * Set the value the next `create` will issue for an autoincrement field of Order.
   * `next` is the value that will be issued next, so it must be an integer of 1 or more.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Order.
   * @param {number} next - The value the next `create` will issue.
   * @example
   * // Let the next Order continue from 1000
   * gassma.Order.$setAutoincrement("id", 1000)
   */
  $setAutoincrement(field: "id", next: number): void;
  /**
   * Line the counter of Order up with the rows already in the sheet.
   * The counter becomes the largest value in the column plus one, which is also the return value.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Order.
   * @example
   * // Adopt a sheet that already has rows
   * const next = gassma.Order.$syncAutoincrement("id")
   */
  $syncAutoincrement(field: "id"): number;
}

/**
 * The delegate class that exposes CRUD operations for the **OrderItem** model.
 */
export declare class GassmaGassmaOrderItemController<GO extends GassmaGassmaOrderItemOmit = {}, O = {}, CMap = {}> {
  constructor(sheetName: string, id?: string);

  /**
   * Fields of the OrderItem model
   */
  readonly fields: Record<string, Gassma.FieldRef>;
  /**
   * Change the range this model reads and writes on the spreadsheet.
   * Read more here: https://gassma.io/en/docs/reference/settings/changeSettings
   * @param {number} startRowNumber - The row number the header row lives on.
   * @param {number | string} startColumnValue - The first column of the range.
   * @param {number | string} endColumnValue - The last column of the range.
   */
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  /**
   * Create many OrderItems.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createMany
   * @param {GassmaGassmaOrderItemCreateManyData} createdData - Arguments to create many OrderItems.
   * @example
   * // Create many OrderItems
   * const orderItem = gassma.OrderItem.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createMany(createdData: GassmaGassmaOrderItemCreateManyData): CreateManyReturn;
  /**
   * Create many OrderItems and returns the data saved in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createManyAndReturn
   * @param {GassmaGassmaOrderItemCreateManyAndReturnData} createdData - Arguments to create many OrderItems.
   * @example
   * // Create many OrderItems
   * const orderItem = gassma.OrderItem.createManyAndReturn({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   * // Create many OrderItems and only return the `id`
   * const orderItemWithIdOnly = gassma.OrderItem.createManyAndReturn({
   *   select: { id: true },
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createManyAndReturn<T extends GassmaGassmaOrderItemCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "OrderItem">>>(createdData: T & Gassma.Subset<T, GassmaGassmaOrderItemCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "OrderItem">>>): GassmaGassmaOrderItemFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create a OrderItem.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/create
   * @param {GassmaGassmaOrderItemCreateData} createdData - Arguments to create a OrderItem.
   * @example
   * // Create one OrderItem
   * const OrderItem = gassma.OrderItem.create({
   *   data: {
   *     // ... data to create a OrderItem
   *   }
   * })
   * 
   */
  create<T extends GassmaGassmaOrderItemCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "OrderItem">>>(createdData: T & Gassma.Subset<T, GassmaGassmaOrderItemCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "OrderItem">>>): GassmaGassmaOrderItemFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first OrderItem that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @param {GassmaGassmaOrderItemFindFirstData} findData - Arguments to find a OrderItem
   * @example
   * // Get one OrderItem
   * const orderItem = gassma.OrderItem.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends GassmaGassmaOrderItemFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "OrderItem">>>(findData: T & Gassma.Subset<T, GassmaGassmaOrderItemFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "OrderItem">>>): GassmaGassmaOrderItemFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Find the first OrderItem.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @example
   * // Get the first OrderItem
   * const orderItem = gassma.OrderItem.findFirst()
   */
  findFirst(): GassmaGassmaOrderItemFindResult<unknown, unknown, unknown, GO, O, CMap> | null;
  /**
   * Find the first OrderItem that matches the filter or
   * throw `NotFoundError` if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @param {GassmaGassmaOrderItemFindFirstData} findData - Arguments to find a OrderItem
   * @example
   * // Get one OrderItem
   * const orderItem = gassma.OrderItem.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends GassmaGassmaOrderItemFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "OrderItem">>>(findData: T & Gassma.Subset<T, GassmaGassmaOrderItemFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "OrderItem">>>): GassmaGassmaOrderItemFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first OrderItem or throw `NotFoundError` if no OrderItems exist.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @example
   * // Get the first OrderItem
   * const orderItem = gassma.OrderItem.findFirstOrThrow()
   */
  findFirstOrThrow(): GassmaGassmaOrderItemFindResult<unknown, unknown, unknown, GO, O, CMap>;
  /**
   * Find zero or more OrderItems that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @param {GassmaGassmaOrderItemFindManyData} findData - Arguments to filter and select certain fields only.
   * @example
   * // Get all OrderItems
   * const orderItems = gassma.OrderItem.findMany()
   * 
   * // Get first 10 OrderItems
   * const orderItems = gassma.OrderItem.findMany({ take: 10 })
   * 
   * // Only select the `id`
   * const orderItemWithIdOnly = gassma.OrderItem.findMany({ select: { id: true } })
   * 
   */
  findMany<T extends GassmaGassmaOrderItemFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "OrderItem">>>(findData: T & Gassma.Subset<T, GassmaGassmaOrderItemFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "OrderItem">>>): GassmaGassmaOrderItemFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Find all OrderItems.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @example
   * // Get all OrderItems
   * const orderItems = gassma.OrderItem.findMany()
   */
  findMany(): GassmaGassmaOrderItemFindResult<unknown, unknown, unknown, GO, O, CMap>[];
  /**
   * Update one OrderItem.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/update
   * @param {GassmaGassmaOrderItemUpdateSingleData} updateData - Arguments to update one OrderItem.
   * @example
   * // Update one OrderItem
   * const orderItem = gassma.OrderItem.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends GassmaGassmaOrderItemUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "OrderItem">>>(updateData: T & Gassma.Subset<T, GassmaGassmaOrderItemUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "OrderItem">>>): GassmaGassmaOrderItemFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Update zero or more OrderItems.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateMany
   * @param {GassmaGassmaOrderItemUpdateData} updateData - Arguments to update one or more rows.
   * @example
   * // Update many OrderItems
   * const { count } = gassma.OrderItem.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany(updateData: GassmaGassmaOrderItemUpdateData): UpdateManyReturn;
  /**
   * Update zero or more OrderItems and returns the data updated in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateManyAndReturn
   * @param {GassmaGassmaOrderItemUpdateManyAndReturnData} updateData - Arguments to update many OrderItems.
   * @example
   * // Update many OrderItems
   * const orderItems = gassma.OrderItem.updateManyAndReturn({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   * // Update zero or more OrderItems and only return the `id`
   * const orderItemWithIdOnly = gassma.OrderItem.updateManyAndReturn({
   *   select: { id: true },
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateManyAndReturn<T extends GassmaGassmaOrderItemUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "OrderItem">>>(updateData: T & Gassma.Subset<T, GassmaGassmaOrderItemUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "OrderItem">>>): GassmaGassmaOrderItemFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create or update one OrderItem.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/upsert
   * @param {GassmaGassmaOrderItemUpsertSingleData} upsertData - Arguments to update or create a OrderItem.
   * @example
   * // Update or create a OrderItem
   * const orderItem = gassma.OrderItem.upsert({
   *   create: {
   *     // ... data to create a OrderItem
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the OrderItem we want to update
   *   }
   * })
   */
  upsert<T extends GassmaGassmaOrderItemUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "OrderItem">>>(upsertData: T & Gassma.Subset<T, GassmaGassmaOrderItemUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "OrderItem">>>): GassmaGassmaOrderItemFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Delete a OrderItem.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/delete
   * @param {GassmaGassmaOrderItemDeleteSingleData} deleteData - Arguments to delete one OrderItem.
   * @example
   * // Delete one OrderItem
   * const OrderItem = gassma.OrderItem.delete({
   *   where: {
   *     // ... filter to delete one OrderItem
   *   }
   * })
   * 
   */
  delete<T extends GassmaGassmaOrderItemDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "OrderItem">>>(deleteData: T & Gassma.Subset<T, GassmaGassmaOrderItemDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "OrderItem">>>): GassmaGassmaOrderItemFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Delete zero or more OrderItems.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @param {GassmaGassmaOrderItemDeleteData} deleteData - Arguments to filter OrderItems to delete.
   * @example
   * // Delete a few OrderItems
   * const { count } = gassma.OrderItem.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany(deleteData: GassmaGassmaOrderItemDeleteData): DeleteManyReturn;
  /**
   * Delete every OrderItem.
   * Calling `deleteMany` without arguments deletes **all** rows in the sheet. This cannot be undone.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @example
   * // Delete every OrderItem in the sheet
   * const { count } = gassma.OrderItem.deleteMany()
   */
  deleteMany(): DeleteManyReturn;
  /**
   * Allows you to perform aggregations operations on a OrderItem.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/aggregate
   * @param {GassmaGassmaOrderItemAggregateData} aggregateData - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Count the OrderItems that match the filter
   * const aggregations = gassma.OrderItem.aggregate({
   *   _count: true,
   *   where: {
   *     // ... provide filter here
   *   },
   *   take: 10,
   * })
   */
  aggregate<T extends GassmaGassmaOrderItemAggregateData>(aggregateData: T & Gassma.Subset<T, GassmaGassmaOrderItemAggregateData>): GassmaGassmaOrderItemAggregateResult<T>;
  /**
   * Count the number of OrderItems.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @param {GassmaGassmaOrderItemCountData} countData - Arguments to filter OrderItems to count.
   * @example
   * // Count the number of OrderItems
   * const count = gassma.OrderItem.count({
   *   where: {
   *     // ... the filter for the OrderItems we want to count
   *   }
   * })
   */
  count<T extends GassmaGassmaOrderItemCountData>(countData: T & Gassma.Subset<T, GassmaGassmaOrderItemCountData>): GassmaGassmaOrderItemCountResult<T>;
  /**
   * Count every OrderItem.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @example
   * // Count every OrderItem
   * const count = gassma.OrderItem.count()
   */
  count(): number;
  /**
   * Group by OrderItem.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/groupBy
   * @param {GassmaGassmaOrderItemGroupByData} groupByData - Group by arguments.
   * @example
   * // Group by id, get count
   * const result = gassma.OrderItem.groupBy({
   *   by: ['id'],
   *   _count: true,
   * })
   * 
   */
  groupBy<T extends GassmaGassmaOrderItemGroupByData>(groupByData: T & Gassma.Subset<T, GassmaGassmaOrderItemGroupByData>): GassmaGassmaOrderItemGroupByResult<T>[];
  /**
   * Get the value the next `create` will issue for an autoincrement field of OrderItem.
   * Reading the counter is allowed inside `$transaction`.
   * Throws `GassmaAutoincrementNotConfiguredError` when the field is not an autoincrement field.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of OrderItem.
   * @example
   * // The id the next OrderItem will get
   * const next = gassma.OrderItem.$getAutoincrement("id")
   */
  $getAutoincrement(field: "id"): number;
  /**
   * Set the value the next `create` will issue for an autoincrement field of OrderItem.
   * `next` is the value that will be issued next, so it must be an integer of 1 or more.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of OrderItem.
   * @param {number} next - The value the next `create` will issue.
   * @example
   * // Let the next OrderItem continue from 1000
   * gassma.OrderItem.$setAutoincrement("id", 1000)
   */
  $setAutoincrement(field: "id", next: number): void;
  /**
   * Line the counter of OrderItem up with the rows already in the sheet.
   * The counter becomes the largest value in the column plus one, which is also the return value.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of OrderItem.
   * @example
   * // Adopt a sheet that already has rows
   * const next = gassma.OrderItem.$syncAutoincrement("id")
   */
  $syncAutoincrement(field: "id"): number;
}

/**
 * The delegate class that exposes CRUD operations for the **FormulaCell** model.
 */
export declare class GassmaGassmaFormulaCellController<GO extends GassmaGassmaFormulaCellOmit = {}, O = {}, CMap = {}> {
  constructor(sheetName: string, id?: string);

  /**
   * Fields of the FormulaCell model
   */
  readonly fields: Record<string, Gassma.FieldRef>;
  /**
   * Change the range this model reads and writes on the spreadsheet.
   * Read more here: https://gassma.io/en/docs/reference/settings/changeSettings
   * @param {number} startRowNumber - The row number the header row lives on.
   * @param {number | string} startColumnValue - The first column of the range.
   * @param {number | string} endColumnValue - The last column of the range.
   */
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  /**
   * Create many FormulaCells.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createMany
   * @param {GassmaGassmaFormulaCellCreateManyData} createdData - Arguments to create many FormulaCells.
   * @example
   * // Create many FormulaCells
   * const formulaCell = gassma.FormulaCell.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createMany(createdData: GassmaGassmaFormulaCellCreateManyData): CreateManyReturn;
  /**
   * Create many FormulaCells and returns the data saved in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createManyAndReturn
   * @param {GassmaGassmaFormulaCellCreateManyAndReturnData} createdData - Arguments to create many FormulaCells.
   * @example
   * // Create many FormulaCells
   * const formulaCell = gassma.FormulaCell.createManyAndReturn({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   * // Create many FormulaCells and only return the `id`
   * const formulaCellWithIdOnly = gassma.FormulaCell.createManyAndReturn({
   *   select: { id: true },
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createManyAndReturn<T extends GassmaGassmaFormulaCellCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "FormulaCell">>>(createdData: T & Gassma.Subset<T, GassmaGassmaFormulaCellCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "FormulaCell">>>): GassmaGassmaFormulaCellFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create a FormulaCell.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/create
   * @param {GassmaGassmaFormulaCellCreateData} createdData - Arguments to create a FormulaCell.
   * @example
   * // Create one FormulaCell
   * const FormulaCell = gassma.FormulaCell.create({
   *   data: {
   *     // ... data to create a FormulaCell
   *   }
   * })
   * 
   */
  create<T extends GassmaGassmaFormulaCellCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "FormulaCell">>>(createdData: T & Gassma.Subset<T, GassmaGassmaFormulaCellCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "FormulaCell">>>): GassmaGassmaFormulaCellFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first FormulaCell that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @param {GassmaGassmaFormulaCellFindFirstData} findData - Arguments to find a FormulaCell
   * @example
   * // Get one FormulaCell
   * const formulaCell = gassma.FormulaCell.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends GassmaGassmaFormulaCellFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "FormulaCell">>>(findData: T & Gassma.Subset<T, GassmaGassmaFormulaCellFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "FormulaCell">>>): GassmaGassmaFormulaCellFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Find the first FormulaCell.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @example
   * // Get the first FormulaCell
   * const formulaCell = gassma.FormulaCell.findFirst()
   */
  findFirst(): GassmaGassmaFormulaCellFindResult<unknown, unknown, unknown, GO, O, CMap> | null;
  /**
   * Find the first FormulaCell that matches the filter or
   * throw `NotFoundError` if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @param {GassmaGassmaFormulaCellFindFirstData} findData - Arguments to find a FormulaCell
   * @example
   * // Get one FormulaCell
   * const formulaCell = gassma.FormulaCell.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends GassmaGassmaFormulaCellFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "FormulaCell">>>(findData: T & Gassma.Subset<T, GassmaGassmaFormulaCellFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "FormulaCell">>>): GassmaGassmaFormulaCellFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first FormulaCell or throw `NotFoundError` if no FormulaCells exist.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @example
   * // Get the first FormulaCell
   * const formulaCell = gassma.FormulaCell.findFirstOrThrow()
   */
  findFirstOrThrow(): GassmaGassmaFormulaCellFindResult<unknown, unknown, unknown, GO, O, CMap>;
  /**
   * Find zero or more FormulaCells that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @param {GassmaGassmaFormulaCellFindManyData} findData - Arguments to filter and select certain fields only.
   * @example
   * // Get all FormulaCells
   * const formulaCells = gassma.FormulaCell.findMany()
   * 
   * // Get first 10 FormulaCells
   * const formulaCells = gassma.FormulaCell.findMany({ take: 10 })
   * 
   * // Only select the `id`
   * const formulaCellWithIdOnly = gassma.FormulaCell.findMany({ select: { id: true } })
   * 
   */
  findMany<T extends GassmaGassmaFormulaCellFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "FormulaCell">>>(findData: T & Gassma.Subset<T, GassmaGassmaFormulaCellFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "FormulaCell">>>): GassmaGassmaFormulaCellFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Find all FormulaCells.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @example
   * // Get all FormulaCells
   * const formulaCells = gassma.FormulaCell.findMany()
   */
  findMany(): GassmaGassmaFormulaCellFindResult<unknown, unknown, unknown, GO, O, CMap>[];
  /**
   * Update one FormulaCell.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/update
   * @param {GassmaGassmaFormulaCellUpdateSingleData} updateData - Arguments to update one FormulaCell.
   * @example
   * // Update one FormulaCell
   * const formulaCell = gassma.FormulaCell.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends GassmaGassmaFormulaCellUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "FormulaCell">>>(updateData: T & Gassma.Subset<T, GassmaGassmaFormulaCellUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "FormulaCell">>>): GassmaGassmaFormulaCellFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Update zero or more FormulaCells.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateMany
   * @param {GassmaGassmaFormulaCellUpdateData} updateData - Arguments to update one or more rows.
   * @example
   * // Update many FormulaCells
   * const { count } = gassma.FormulaCell.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany(updateData: GassmaGassmaFormulaCellUpdateData): UpdateManyReturn;
  /**
   * Update zero or more FormulaCells and returns the data updated in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateManyAndReturn
   * @param {GassmaGassmaFormulaCellUpdateManyAndReturnData} updateData - Arguments to update many FormulaCells.
   * @example
   * // Update many FormulaCells
   * const formulaCells = gassma.FormulaCell.updateManyAndReturn({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   * // Update zero or more FormulaCells and only return the `id`
   * const formulaCellWithIdOnly = gassma.FormulaCell.updateManyAndReturn({
   *   select: { id: true },
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateManyAndReturn<T extends GassmaGassmaFormulaCellUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "FormulaCell">>>(updateData: T & Gassma.Subset<T, GassmaGassmaFormulaCellUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "FormulaCell">>>): GassmaGassmaFormulaCellFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create or update one FormulaCell.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/upsert
   * @param {GassmaGassmaFormulaCellUpsertSingleData} upsertData - Arguments to update or create a FormulaCell.
   * @example
   * // Update or create a FormulaCell
   * const formulaCell = gassma.FormulaCell.upsert({
   *   create: {
   *     // ... data to create a FormulaCell
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the FormulaCell we want to update
   *   }
   * })
   */
  upsert<T extends GassmaGassmaFormulaCellUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "FormulaCell">>>(upsertData: T & Gassma.Subset<T, GassmaGassmaFormulaCellUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "FormulaCell">>>): GassmaGassmaFormulaCellFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Delete a FormulaCell.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/delete
   * @param {GassmaGassmaFormulaCellDeleteSingleData} deleteData - Arguments to delete one FormulaCell.
   * @example
   * // Delete one FormulaCell
   * const FormulaCell = gassma.FormulaCell.delete({
   *   where: {
   *     // ... filter to delete one FormulaCell
   *   }
   * })
   * 
   */
  delete<T extends GassmaGassmaFormulaCellDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "FormulaCell">>>(deleteData: T & Gassma.Subset<T, GassmaGassmaFormulaCellDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "FormulaCell">>>): GassmaGassmaFormulaCellFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Delete zero or more FormulaCells.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @param {GassmaGassmaFormulaCellDeleteData} deleteData - Arguments to filter FormulaCells to delete.
   * @example
   * // Delete a few FormulaCells
   * const { count } = gassma.FormulaCell.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany(deleteData: GassmaGassmaFormulaCellDeleteData): DeleteManyReturn;
  /**
   * Delete every FormulaCell.
   * Calling `deleteMany` without arguments deletes **all** rows in the sheet. This cannot be undone.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @example
   * // Delete every FormulaCell in the sheet
   * const { count } = gassma.FormulaCell.deleteMany()
   */
  deleteMany(): DeleteManyReturn;
  /**
   * Allows you to perform aggregations operations on a FormulaCell.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/aggregate
   * @param {GassmaGassmaFormulaCellAggregateData} aggregateData - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Count the FormulaCells that match the filter
   * const aggregations = gassma.FormulaCell.aggregate({
   *   _count: true,
   *   where: {
   *     // ... provide filter here
   *   },
   *   take: 10,
   * })
   */
  aggregate<T extends GassmaGassmaFormulaCellAggregateData>(aggregateData: T & Gassma.Subset<T, GassmaGassmaFormulaCellAggregateData>): GassmaGassmaFormulaCellAggregateResult<T>;
  /**
   * Count the number of FormulaCells.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @param {GassmaGassmaFormulaCellCountData} countData - Arguments to filter FormulaCells to count.
   * @example
   * // Count the number of FormulaCells
   * const count = gassma.FormulaCell.count({
   *   where: {
   *     // ... the filter for the FormulaCells we want to count
   *   }
   * })
   */
  count<T extends GassmaGassmaFormulaCellCountData>(countData: T & Gassma.Subset<T, GassmaGassmaFormulaCellCountData>): GassmaGassmaFormulaCellCountResult<T>;
  /**
   * Count every FormulaCell.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @example
   * // Count every FormulaCell
   * const count = gassma.FormulaCell.count()
   */
  count(): number;
  /**
   * Group by FormulaCell.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/groupBy
   * @param {GassmaGassmaFormulaCellGroupByData} groupByData - Group by arguments.
   * @example
   * // Group by id, get count
   * const result = gassma.FormulaCell.groupBy({
   *   by: ['id'],
   *   _count: true,
   * })
   * 
   */
  groupBy<T extends GassmaGassmaFormulaCellGroupByData>(groupByData: T & Gassma.Subset<T, GassmaGassmaFormulaCellGroupByData>): GassmaGassmaFormulaCellGroupByResult<T>[];
  /**
   * Get the value the next `create` will issue for an autoincrement field of FormulaCell.
   * FormulaCell has no autoincrement field, so this cannot be called.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   */
  $getAutoincrement(field: never): number;
  /**
   * Set the value the next `create` will issue for an autoincrement field of FormulaCell.
   * FormulaCell has no autoincrement field, so this cannot be called.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   */
  $setAutoincrement(field: never, next: number): void;
  /**
   * Line the counter of FormulaCell up with the rows already in the sheet.
   * FormulaCell has no autoincrement field, so this cannot be called.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   */
  $syncAutoincrement(field: never): number;
}

/**
 * The delegate class that exposes CRUD operations for the **Notification** model.
 */
export declare class GassmaGassmaNotificationController<GO extends GassmaGassmaNotificationOmit = {}, O = {}, CMap = {}> {
  constructor(sheetName: string, id?: string);

  /**
   * Fields of the Notification model
   */
  readonly fields: Record<string, Gassma.FieldRef>;
  /**
   * Change the range this model reads and writes on the spreadsheet.
   * Read more here: https://gassma.io/en/docs/reference/settings/changeSettings
   * @param {number} startRowNumber - The row number the header row lives on.
   * @param {number | string} startColumnValue - The first column of the range.
   * @param {number | string} endColumnValue - The last column of the range.
   */
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  /**
   * Create many Notifications.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createMany
   * @param {GassmaGassmaNotificationCreateManyData} createdData - Arguments to create many Notifications.
   * @example
   * // Create many Notifications
   * const notification = gassma.Notification.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createMany(createdData: GassmaGassmaNotificationCreateManyData): CreateManyReturn;
  /**
   * Create many Notifications and returns the data saved in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createManyAndReturn
   * @param {GassmaGassmaNotificationCreateManyAndReturnData} createdData - Arguments to create many Notifications.
   * @example
   * // Create many Notifications
   * const notification = gassma.Notification.createManyAndReturn({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   * // Create many Notifications and only return the `id`
   * const notificationWithIdOnly = gassma.Notification.createManyAndReturn({
   *   select: { id: true },
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createManyAndReturn<T extends GassmaGassmaNotificationCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Notification">>>(createdData: T & Gassma.Subset<T, GassmaGassmaNotificationCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Notification">>>): GassmaGassmaNotificationFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create a Notification.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/create
   * @param {GassmaGassmaNotificationCreateData} createdData - Arguments to create a Notification.
   * @example
   * // Create one Notification
   * const Notification = gassma.Notification.create({
   *   data: {
   *     // ... data to create a Notification
   *   }
   * })
   * 
   */
  create<T extends GassmaGassmaNotificationCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "Notification">>>(createdData: T & Gassma.Subset<T, GassmaGassmaNotificationCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "Notification">>>): GassmaGassmaNotificationFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first Notification that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @param {GassmaGassmaNotificationFindFirstData} findData - Arguments to find a Notification
   * @example
   * // Get one Notification
   * const notification = gassma.Notification.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends GassmaGassmaNotificationFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Notification">>>(findData: T & Gassma.Subset<T, GassmaGassmaNotificationFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Notification">>>): GassmaGassmaNotificationFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Find the first Notification.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @example
   * // Get the first Notification
   * const notification = gassma.Notification.findFirst()
   */
  findFirst(): GassmaGassmaNotificationFindResult<unknown, unknown, unknown, GO, O, CMap> | null;
  /**
   * Find the first Notification that matches the filter or
   * throw `NotFoundError` if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @param {GassmaGassmaNotificationFindFirstData} findData - Arguments to find a Notification
   * @example
   * // Get one Notification
   * const notification = gassma.Notification.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends GassmaGassmaNotificationFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Notification">>>(findData: T & Gassma.Subset<T, GassmaGassmaNotificationFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Notification">>>): GassmaGassmaNotificationFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first Notification or throw `NotFoundError` if no Notifications exist.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @example
   * // Get the first Notification
   * const notification = gassma.Notification.findFirstOrThrow()
   */
  findFirstOrThrow(): GassmaGassmaNotificationFindResult<unknown, unknown, unknown, GO, O, CMap>;
  /**
   * Find zero or more Notifications that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @param {GassmaGassmaNotificationFindManyData} findData - Arguments to filter and select certain fields only.
   * @example
   * // Get all Notifications
   * const notifications = gassma.Notification.findMany()
   * 
   * // Get first 10 Notifications
   * const notifications = gassma.Notification.findMany({ take: 10 })
   * 
   * // Only select the `id`
   * const notificationWithIdOnly = gassma.Notification.findMany({ select: { id: true } })
   * 
   */
  findMany<T extends GassmaGassmaNotificationFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "Notification">>>(findData: T & Gassma.Subset<T, GassmaGassmaNotificationFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "Notification">>>): GassmaGassmaNotificationFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Find all Notifications.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @example
   * // Get all Notifications
   * const notifications = gassma.Notification.findMany()
   */
  findMany(): GassmaGassmaNotificationFindResult<unknown, unknown, unknown, GO, O, CMap>[];
  /**
   * Update one Notification.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/update
   * @param {GassmaGassmaNotificationUpdateSingleData} updateData - Arguments to update one Notification.
   * @example
   * // Update one Notification
   * const notification = gassma.Notification.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends GassmaGassmaNotificationUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Notification">>>(updateData: T & Gassma.Subset<T, GassmaGassmaNotificationUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Notification">>>): GassmaGassmaNotificationFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Update zero or more Notifications.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateMany
   * @param {GassmaGassmaNotificationUpdateData} updateData - Arguments to update one or more rows.
   * @example
   * // Update many Notifications
   * const { count } = gassma.Notification.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany(updateData: GassmaGassmaNotificationUpdateData): UpdateManyReturn;
  /**
   * Update zero or more Notifications and returns the data updated in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateManyAndReturn
   * @param {GassmaGassmaNotificationUpdateManyAndReturnData} updateData - Arguments to update many Notifications.
   * @example
   * // Update many Notifications
   * const notifications = gassma.Notification.updateManyAndReturn({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   * // Update zero or more Notifications and only return the `id`
   * const notificationWithIdOnly = gassma.Notification.updateManyAndReturn({
   *   select: { id: true },
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateManyAndReturn<T extends GassmaGassmaNotificationUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Notification">>>(updateData: T & Gassma.Subset<T, GassmaGassmaNotificationUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Notification">>>): GassmaGassmaNotificationFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create or update one Notification.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/upsert
   * @param {GassmaGassmaNotificationUpsertSingleData} upsertData - Arguments to update or create a Notification.
   * @example
   * // Update or create a Notification
   * const notification = gassma.Notification.upsert({
   *   create: {
   *     // ... data to create a Notification
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Notification we want to update
   *   }
   * })
   */
  upsert<T extends GassmaGassmaNotificationUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Notification">>>(upsertData: T & Gassma.Subset<T, GassmaGassmaNotificationUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Notification">>>): GassmaGassmaNotificationFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Delete a Notification.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/delete
   * @param {GassmaGassmaNotificationDeleteSingleData} deleteData - Arguments to delete one Notification.
   * @example
   * // Delete one Notification
   * const Notification = gassma.Notification.delete({
   *   where: {
   *     // ... filter to delete one Notification
   *   }
   * })
   * 
   */
  delete<T extends GassmaGassmaNotificationDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Notification">>>(deleteData: T & Gassma.Subset<T, GassmaGassmaNotificationDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Notification">>>): GassmaGassmaNotificationFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Delete zero or more Notifications.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @param {GassmaGassmaNotificationDeleteData} deleteData - Arguments to filter Notifications to delete.
   * @example
   * // Delete a few Notifications
   * const { count } = gassma.Notification.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany(deleteData: GassmaGassmaNotificationDeleteData): DeleteManyReturn;
  /**
   * Delete every Notification.
   * Calling `deleteMany` without arguments deletes **all** rows in the sheet. This cannot be undone.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @example
   * // Delete every Notification in the sheet
   * const { count } = gassma.Notification.deleteMany()
   */
  deleteMany(): DeleteManyReturn;
  /**
   * Allows you to perform aggregations operations on a Notification.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/aggregate
   * @param {GassmaGassmaNotificationAggregateData} aggregateData - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Count the Notifications that match the filter
   * const aggregations = gassma.Notification.aggregate({
   *   _count: true,
   *   where: {
   *     // ... provide filter here
   *   },
   *   take: 10,
   * })
   */
  aggregate<T extends GassmaGassmaNotificationAggregateData>(aggregateData: T & Gassma.Subset<T, GassmaGassmaNotificationAggregateData>): GassmaGassmaNotificationAggregateResult<T>;
  /**
   * Count the number of Notifications.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @param {GassmaGassmaNotificationCountData} countData - Arguments to filter Notifications to count.
   * @example
   * // Count the number of Notifications
   * const count = gassma.Notification.count({
   *   where: {
   *     // ... the filter for the Notifications we want to count
   *   }
   * })
   */
  count<T extends GassmaGassmaNotificationCountData>(countData: T & Gassma.Subset<T, GassmaGassmaNotificationCountData>): GassmaGassmaNotificationCountResult<T>;
  /**
   * Count every Notification.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @example
   * // Count every Notification
   * const count = gassma.Notification.count()
   */
  count(): number;
  /**
   * Group by Notification.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/groupBy
   * @param {GassmaGassmaNotificationGroupByData} groupByData - Group by arguments.
   * @example
   * // Group by id, get count
   * const result = gassma.Notification.groupBy({
   *   by: ['id'],
   *   _count: true,
   * })
   * 
   */
  groupBy<T extends GassmaGassmaNotificationGroupByData>(groupByData: T & Gassma.Subset<T, GassmaGassmaNotificationGroupByData>): GassmaGassmaNotificationGroupByResult<T>[];
  /**
   * Get the value the next `create` will issue for an autoincrement field of Notification.
   * Reading the counter is allowed inside `$transaction`.
   * Throws `GassmaAutoincrementNotConfiguredError` when the field is not an autoincrement field.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Notification.
   * @example
   * // The id the next Notification will get
   * const next = gassma.Notification.$getAutoincrement("id")
   */
  $getAutoincrement(field: "id"): number;
  /**
   * Set the value the next `create` will issue for an autoincrement field of Notification.
   * `next` is the value that will be issued next, so it must be an integer of 1 or more.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Notification.
   * @param {number} next - The value the next `create` will issue.
   * @example
   * // Let the next Notification continue from 1000
   * gassma.Notification.$setAutoincrement("id", 1000)
   */
  $setAutoincrement(field: "id", next: number): void;
  /**
   * Line the counter of Notification up with the rows already in the sheet.
   * The counter becomes the largest value in the column plus one, which is also the return value.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Notification.
   * @example
   * // Adopt a sheet that already has rows
   * const next = gassma.Notification.$syncAutoincrement("id")
   */
  $syncAutoincrement(field: "id"): number;
}

/**
 * The delegate class that exposes CRUD operations for the **OffsetNote** model.
 */
export declare class GassmaGassmaOffsetNoteController<GO extends GassmaGassmaOffsetNoteOmit = {}, O = {}, CMap = {}> {
  constructor(sheetName: string, id?: string);

  /**
   * Fields of the OffsetNote model
   */
  readonly fields: Record<string, Gassma.FieldRef>;
  /**
   * Change the range this model reads and writes on the spreadsheet.
   * Read more here: https://gassma.io/en/docs/reference/settings/changeSettings
   * @param {number} startRowNumber - The row number the header row lives on.
   * @param {number | string} startColumnValue - The first column of the range.
   * @param {number | string} endColumnValue - The last column of the range.
   */
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  /**
   * Create many OffsetNotes.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createMany
   * @param {GassmaGassmaOffsetNoteCreateManyData} createdData - Arguments to create many OffsetNotes.
   * @example
   * // Create many OffsetNotes
   * const offsetNote = gassma.OffsetNote.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createMany(createdData: GassmaGassmaOffsetNoteCreateManyData): CreateManyReturn;
  /**
   * Create many OffsetNotes and returns the data saved in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createManyAndReturn
   * @param {GassmaGassmaOffsetNoteCreateManyAndReturnData} createdData - Arguments to create many OffsetNotes.
   * @example
   * // Create many OffsetNotes
   * const offsetNote = gassma.OffsetNote.createManyAndReturn({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   * // Create many OffsetNotes and only return the `id`
   * const offsetNoteWithIdOnly = gassma.OffsetNote.createManyAndReturn({
   *   select: { id: true },
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createManyAndReturn<T extends GassmaGassmaOffsetNoteCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "OffsetNote">>>(createdData: T & Gassma.Subset<T, GassmaGassmaOffsetNoteCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "OffsetNote">>>): GassmaGassmaOffsetNoteFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create a OffsetNote.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/create
   * @param {GassmaGassmaOffsetNoteCreateData} createdData - Arguments to create a OffsetNote.
   * @example
   * // Create one OffsetNote
   * const OffsetNote = gassma.OffsetNote.create({
   *   data: {
   *     // ... data to create a OffsetNote
   *   }
   * })
   * 
   */
  create<T extends GassmaGassmaOffsetNoteCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "OffsetNote">>>(createdData: T & Gassma.Subset<T, GassmaGassmaOffsetNoteCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "OffsetNote">>>): GassmaGassmaOffsetNoteFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first OffsetNote that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @param {GassmaGassmaOffsetNoteFindFirstData} findData - Arguments to find a OffsetNote
   * @example
   * // Get one OffsetNote
   * const offsetNote = gassma.OffsetNote.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends GassmaGassmaOffsetNoteFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "OffsetNote">>>(findData: T & Gassma.Subset<T, GassmaGassmaOffsetNoteFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "OffsetNote">>>): GassmaGassmaOffsetNoteFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Find the first OffsetNote.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @example
   * // Get the first OffsetNote
   * const offsetNote = gassma.OffsetNote.findFirst()
   */
  findFirst(): GassmaGassmaOffsetNoteFindResult<unknown, unknown, unknown, GO, O, CMap> | null;
  /**
   * Find the first OffsetNote that matches the filter or
   * throw `NotFoundError` if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @param {GassmaGassmaOffsetNoteFindFirstData} findData - Arguments to find a OffsetNote
   * @example
   * // Get one OffsetNote
   * const offsetNote = gassma.OffsetNote.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends GassmaGassmaOffsetNoteFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "OffsetNote">>>(findData: T & Gassma.Subset<T, GassmaGassmaOffsetNoteFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "OffsetNote">>>): GassmaGassmaOffsetNoteFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first OffsetNote or throw `NotFoundError` if no OffsetNotes exist.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @example
   * // Get the first OffsetNote
   * const offsetNote = gassma.OffsetNote.findFirstOrThrow()
   */
  findFirstOrThrow(): GassmaGassmaOffsetNoteFindResult<unknown, unknown, unknown, GO, O, CMap>;
  /**
   * Find zero or more OffsetNotes that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @param {GassmaGassmaOffsetNoteFindManyData} findData - Arguments to filter and select certain fields only.
   * @example
   * // Get all OffsetNotes
   * const offsetNotes = gassma.OffsetNote.findMany()
   * 
   * // Get first 10 OffsetNotes
   * const offsetNotes = gassma.OffsetNote.findMany({ take: 10 })
   * 
   * // Only select the `id`
   * const offsetNoteWithIdOnly = gassma.OffsetNote.findMany({ select: { id: true } })
   * 
   */
  findMany<T extends GassmaGassmaOffsetNoteFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "OffsetNote">>>(findData: T & Gassma.Subset<T, GassmaGassmaOffsetNoteFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "OffsetNote">>>): GassmaGassmaOffsetNoteFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Find all OffsetNotes.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @example
   * // Get all OffsetNotes
   * const offsetNotes = gassma.OffsetNote.findMany()
   */
  findMany(): GassmaGassmaOffsetNoteFindResult<unknown, unknown, unknown, GO, O, CMap>[];
  /**
   * Update one OffsetNote.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/update
   * @param {GassmaGassmaOffsetNoteUpdateSingleData} updateData - Arguments to update one OffsetNote.
   * @example
   * // Update one OffsetNote
   * const offsetNote = gassma.OffsetNote.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends GassmaGassmaOffsetNoteUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "OffsetNote">>>(updateData: T & Gassma.Subset<T, GassmaGassmaOffsetNoteUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "OffsetNote">>>): GassmaGassmaOffsetNoteFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Update zero or more OffsetNotes.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateMany
   * @param {GassmaGassmaOffsetNoteUpdateData} updateData - Arguments to update one or more rows.
   * @example
   * // Update many OffsetNotes
   * const { count } = gassma.OffsetNote.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany(updateData: GassmaGassmaOffsetNoteUpdateData): UpdateManyReturn;
  /**
   * Update zero or more OffsetNotes and returns the data updated in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateManyAndReturn
   * @param {GassmaGassmaOffsetNoteUpdateManyAndReturnData} updateData - Arguments to update many OffsetNotes.
   * @example
   * // Update many OffsetNotes
   * const offsetNotes = gassma.OffsetNote.updateManyAndReturn({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   * // Update zero or more OffsetNotes and only return the `id`
   * const offsetNoteWithIdOnly = gassma.OffsetNote.updateManyAndReturn({
   *   select: { id: true },
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateManyAndReturn<T extends GassmaGassmaOffsetNoteUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "OffsetNote">>>(updateData: T & Gassma.Subset<T, GassmaGassmaOffsetNoteUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "OffsetNote">>>): GassmaGassmaOffsetNoteFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create or update one OffsetNote.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/upsert
   * @param {GassmaGassmaOffsetNoteUpsertSingleData} upsertData - Arguments to update or create a OffsetNote.
   * @example
   * // Update or create a OffsetNote
   * const offsetNote = gassma.OffsetNote.upsert({
   *   create: {
   *     // ... data to create a OffsetNote
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the OffsetNote we want to update
   *   }
   * })
   */
  upsert<T extends GassmaGassmaOffsetNoteUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "OffsetNote">>>(upsertData: T & Gassma.Subset<T, GassmaGassmaOffsetNoteUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "OffsetNote">>>): GassmaGassmaOffsetNoteFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Delete a OffsetNote.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/delete
   * @param {GassmaGassmaOffsetNoteDeleteSingleData} deleteData - Arguments to delete one OffsetNote.
   * @example
   * // Delete one OffsetNote
   * const OffsetNote = gassma.OffsetNote.delete({
   *   where: {
   *     // ... filter to delete one OffsetNote
   *   }
   * })
   * 
   */
  delete<T extends GassmaGassmaOffsetNoteDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "OffsetNote">>>(deleteData: T & Gassma.Subset<T, GassmaGassmaOffsetNoteDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "OffsetNote">>>): GassmaGassmaOffsetNoteFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Delete zero or more OffsetNotes.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @param {GassmaGassmaOffsetNoteDeleteData} deleteData - Arguments to filter OffsetNotes to delete.
   * @example
   * // Delete a few OffsetNotes
   * const { count } = gassma.OffsetNote.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany(deleteData: GassmaGassmaOffsetNoteDeleteData): DeleteManyReturn;
  /**
   * Delete every OffsetNote.
   * Calling `deleteMany` without arguments deletes **all** rows in the sheet. This cannot be undone.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @example
   * // Delete every OffsetNote in the sheet
   * const { count } = gassma.OffsetNote.deleteMany()
   */
  deleteMany(): DeleteManyReturn;
  /**
   * Allows you to perform aggregations operations on a OffsetNote.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/aggregate
   * @param {GassmaGassmaOffsetNoteAggregateData} aggregateData - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Count the OffsetNotes that match the filter
   * const aggregations = gassma.OffsetNote.aggregate({
   *   _count: true,
   *   where: {
   *     // ... provide filter here
   *   },
   *   take: 10,
   * })
   */
  aggregate<T extends GassmaGassmaOffsetNoteAggregateData>(aggregateData: T & Gassma.Subset<T, GassmaGassmaOffsetNoteAggregateData>): GassmaGassmaOffsetNoteAggregateResult<T>;
  /**
   * Count the number of OffsetNotes.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @param {GassmaGassmaOffsetNoteCountData} countData - Arguments to filter OffsetNotes to count.
   * @example
   * // Count the number of OffsetNotes
   * const count = gassma.OffsetNote.count({
   *   where: {
   *     // ... the filter for the OffsetNotes we want to count
   *   }
   * })
   */
  count<T extends GassmaGassmaOffsetNoteCountData>(countData: T & Gassma.Subset<T, GassmaGassmaOffsetNoteCountData>): GassmaGassmaOffsetNoteCountResult<T>;
  /**
   * Count every OffsetNote.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @example
   * // Count every OffsetNote
   * const count = gassma.OffsetNote.count()
   */
  count(): number;
  /**
   * Group by OffsetNote.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/groupBy
   * @param {GassmaGassmaOffsetNoteGroupByData} groupByData - Group by arguments.
   * @example
   * // Group by id, get count
   * const result = gassma.OffsetNote.groupBy({
   *   by: ['id'],
   *   _count: true,
   * })
   * 
   */
  groupBy<T extends GassmaGassmaOffsetNoteGroupByData>(groupByData: T & Gassma.Subset<T, GassmaGassmaOffsetNoteGroupByData>): GassmaGassmaOffsetNoteGroupByResult<T>[];
  /**
   * Get the value the next `create` will issue for an autoincrement field of OffsetNote.
   * OffsetNote has no autoincrement field, so this cannot be called.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   */
  $getAutoincrement(field: never): number;
  /**
   * Set the value the next `create` will issue for an autoincrement field of OffsetNote.
   * OffsetNote has no autoincrement field, so this cannot be called.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   */
  $setAutoincrement(field: never, next: number): void;
  /**
   * Line the counter of OffsetNote up with the rows already in the sheet.
   * OffsetNote has no autoincrement field, so this cannot be called.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   */
  $syncAutoincrement(field: never): number;
}

/**
 * The delegate class that exposes CRUD operations for the **User** model.
 */
export declare class GassmaGassmaUserController<GO extends GassmaGassmaUserOmit = {}, O = {}, CMap = {}> {
  constructor(sheetName: string, id?: string);

  /**
   * Fields of the User model
   */
  readonly fields: Record<string, Gassma.FieldRef>;
  /**
   * Change the range this model reads and writes on the spreadsheet.
   * Read more here: https://gassma.io/en/docs/reference/settings/changeSettings
   * @param {number} startRowNumber - The row number the header row lives on.
   * @param {number | string} startColumnValue - The first column of the range.
   * @param {number | string} endColumnValue - The last column of the range.
   */
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  /**
   * Create many Users.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createMany
   * @param {GassmaGassmaUserCreateManyData} createdData - Arguments to create many Users.
   * @example
   * // Create many Users
   * const user = gassma.User.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createMany(createdData: GassmaGassmaUserCreateManyData): CreateManyReturn;
  /**
   * Create many Users and returns the data saved in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createManyAndReturn
   * @param {GassmaGassmaUserCreateManyAndReturnData} createdData - Arguments to create many Users.
   * @example
   * // Create many Users
   * const user = gassma.User.createManyAndReturn({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   * // Create many Users and only return the `id`
   * const userWithIdOnly = gassma.User.createManyAndReturn({
   *   select: { id: true },
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createManyAndReturn<T extends GassmaGassmaUserCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "User">>>(createdData: T & Gassma.Subset<T, GassmaGassmaUserCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "User">>>): GassmaGassmaUserFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create a User.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/create
   * @param {GassmaGassmaUserCreateData} createdData - Arguments to create a User.
   * @example
   * // Create one User
   * const User = gassma.User.create({
   *   data: {
   *     // ... data to create a User
   *   }
   * })
   * 
   */
  create<T extends GassmaGassmaUserCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "User">>>(createdData: T & Gassma.Subset<T, GassmaGassmaUserCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "User">>>): GassmaGassmaUserFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first User that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @param {GassmaGassmaUserFindFirstData} findData - Arguments to find a User
   * @example
   * // Get one User
   * const user = gassma.User.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends GassmaGassmaUserFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "User">>>(findData: T & Gassma.Subset<T, GassmaGassmaUserFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "User">>>): GassmaGassmaUserFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Find the first User.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @example
   * // Get the first User
   * const user = gassma.User.findFirst()
   */
  findFirst(): GassmaGassmaUserFindResult<unknown, unknown, unknown, GO, O, CMap> | null;
  /**
   * Find the first User that matches the filter or
   * throw `NotFoundError` if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @param {GassmaGassmaUserFindFirstData} findData - Arguments to find a User
   * @example
   * // Get one User
   * const user = gassma.User.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends GassmaGassmaUserFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "User">>>(findData: T & Gassma.Subset<T, GassmaGassmaUserFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "User">>>): GassmaGassmaUserFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first User or throw `NotFoundError` if no Users exist.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @example
   * // Get the first User
   * const user = gassma.User.findFirstOrThrow()
   */
  findFirstOrThrow(): GassmaGassmaUserFindResult<unknown, unknown, unknown, GO, O, CMap>;
  /**
   * Find zero or more Users that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @param {GassmaGassmaUserFindManyData} findData - Arguments to filter and select certain fields only.
   * @example
   * // Get all Users
   * const users = gassma.User.findMany()
   * 
   * // Get first 10 Users
   * const users = gassma.User.findMany({ take: 10 })
   * 
   * // Only select the `id`
   * const userWithIdOnly = gassma.User.findMany({ select: { id: true } })
   * 
   */
  findMany<T extends GassmaGassmaUserFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "User">>>(findData: T & Gassma.Subset<T, GassmaGassmaUserFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "User">>>): GassmaGassmaUserFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Find all Users.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @example
   * // Get all Users
   * const users = gassma.User.findMany()
   */
  findMany(): GassmaGassmaUserFindResult<unknown, unknown, unknown, GO, O, CMap>[];
  /**
   * Update one User.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/update
   * @param {GassmaGassmaUserUpdateSingleData} updateData - Arguments to update one User.
   * @example
   * // Update one User
   * const user = gassma.User.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends GassmaGassmaUserUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "User">>>(updateData: T & Gassma.Subset<T, GassmaGassmaUserUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "User">>>): GassmaGassmaUserFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Update zero or more Users.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateMany
   * @param {GassmaGassmaUserUpdateData} updateData - Arguments to update one or more rows.
   * @example
   * // Update many Users
   * const { count } = gassma.User.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany(updateData: GassmaGassmaUserUpdateData): UpdateManyReturn;
  /**
   * Update zero or more Users and returns the data updated in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateManyAndReturn
   * @param {GassmaGassmaUserUpdateManyAndReturnData} updateData - Arguments to update many Users.
   * @example
   * // Update many Users
   * const users = gassma.User.updateManyAndReturn({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   * // Update zero or more Users and only return the `id`
   * const userWithIdOnly = gassma.User.updateManyAndReturn({
   *   select: { id: true },
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateManyAndReturn<T extends GassmaGassmaUserUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "User">>>(updateData: T & Gassma.Subset<T, GassmaGassmaUserUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "User">>>): GassmaGassmaUserFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create or update one User.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/upsert
   * @param {GassmaGassmaUserUpsertSingleData} upsertData - Arguments to update or create a User.
   * @example
   * // Update or create a User
   * const user = gassma.User.upsert({
   *   create: {
   *     // ... data to create a User
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the User we want to update
   *   }
   * })
   */
  upsert<T extends GassmaGassmaUserUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "User">>>(upsertData: T & Gassma.Subset<T, GassmaGassmaUserUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "User">>>): GassmaGassmaUserFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Delete a User.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/delete
   * @param {GassmaGassmaUserDeleteSingleData} deleteData - Arguments to delete one User.
   * @example
   * // Delete one User
   * const User = gassma.User.delete({
   *   where: {
   *     // ... filter to delete one User
   *   }
   * })
   * 
   */
  delete<T extends GassmaGassmaUserDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "User">>>(deleteData: T & Gassma.Subset<T, GassmaGassmaUserDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "User">>>): GassmaGassmaUserFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Delete zero or more Users.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @param {GassmaGassmaUserDeleteData} deleteData - Arguments to filter Users to delete.
   * @example
   * // Delete a few Users
   * const { count } = gassma.User.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany(deleteData: GassmaGassmaUserDeleteData): DeleteManyReturn;
  /**
   * Delete every User.
   * Calling `deleteMany` without arguments deletes **all** rows in the sheet. This cannot be undone.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @example
   * // Delete every User in the sheet
   * const { count } = gassma.User.deleteMany()
   */
  deleteMany(): DeleteManyReturn;
  /**
   * Allows you to perform aggregations operations on a User.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/aggregate
   * @param {GassmaGassmaUserAggregateData} aggregateData - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Count the Users that match the filter
   * const aggregations = gassma.User.aggregate({
   *   _count: true,
   *   where: {
   *     // ... provide filter here
   *   },
   *   take: 10,
   * })
   */
  aggregate<T extends GassmaGassmaUserAggregateData>(aggregateData: T & Gassma.Subset<T, GassmaGassmaUserAggregateData>): GassmaGassmaUserAggregateResult<T>;
  /**
   * Count the number of Users.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @param {GassmaGassmaUserCountData} countData - Arguments to filter Users to count.
   * @example
   * // Count the number of Users
   * const count = gassma.User.count({
   *   where: {
   *     // ... the filter for the Users we want to count
   *   }
   * })
   */
  count<T extends GassmaGassmaUserCountData>(countData: T & Gassma.Subset<T, GassmaGassmaUserCountData>): GassmaGassmaUserCountResult<T>;
  /**
   * Count every User.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @example
   * // Count every User
   * const count = gassma.User.count()
   */
  count(): number;
  /**
   * Group by User.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/groupBy
   * @param {GassmaGassmaUserGroupByData} groupByData - Group by arguments.
   * @example
   * // Group by id, get count
   * const result = gassma.User.groupBy({
   *   by: ['id'],
   *   _count: true,
   * })
   * 
   */
  groupBy<T extends GassmaGassmaUserGroupByData>(groupByData: T & Gassma.Subset<T, GassmaGassmaUserGroupByData>): GassmaGassmaUserGroupByResult<T>[];
  /**
   * Get the value the next `create` will issue for an autoincrement field of User.
   * Reading the counter is allowed inside `$transaction`.
   * Throws `GassmaAutoincrementNotConfiguredError` when the field is not an autoincrement field.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of User.
   * @example
   * // The id the next User will get
   * const next = gassma.User.$getAutoincrement("id")
   */
  $getAutoincrement(field: "id"): number;
  /**
   * Set the value the next `create` will issue for an autoincrement field of User.
   * `next` is the value that will be issued next, so it must be an integer of 1 or more.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of User.
   * @param {number} next - The value the next `create` will issue.
   * @example
   * // Let the next User continue from 1000
   * gassma.User.$setAutoincrement("id", 1000)
   */
  $setAutoincrement(field: "id", next: number): void;
  /**
   * Line the counter of User up with the rows already in the sheet.
   * The counter becomes the largest value in the column plus one, which is also the return value.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of User.
   * @example
   * // Adopt a sheet that already has rows
   * const next = gassma.User.$syncAutoincrement("id")
   */
  $syncAutoincrement(field: "id"): number;
}

/**
 * The delegate class that exposes CRUD operations for the **Profile** model.
 */
export declare class GassmaGassmaProfileController<GO extends GassmaGassmaProfileOmit = {}, O = {}, CMap = {}> {
  constructor(sheetName: string, id?: string);

  /**
   * Fields of the Profile model
   */
  readonly fields: Record<string, Gassma.FieldRef>;
  /**
   * Change the range this model reads and writes on the spreadsheet.
   * Read more here: https://gassma.io/en/docs/reference/settings/changeSettings
   * @param {number} startRowNumber - The row number the header row lives on.
   * @param {number | string} startColumnValue - The first column of the range.
   * @param {number | string} endColumnValue - The last column of the range.
   */
  changeSettings(
    startRowNumber: number,
    startColumnValue: number | string,
    endColumnValue: number | string
  ): void;
  /**
   * Create many Profiles.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createMany
   * @param {GassmaGassmaProfileCreateManyData} createdData - Arguments to create many Profiles.
   * @example
   * // Create many Profiles
   * const profile = gassma.Profile.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createMany(createdData: GassmaGassmaProfileCreateManyData): CreateManyReturn;
  /**
   * Create many Profiles and returns the data saved in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/createManyAndReturn
   * @param {GassmaGassmaProfileCreateManyAndReturnData} createdData - Arguments to create many Profiles.
   * @example
   * // Create many Profiles
   * const profile = gassma.Profile.createManyAndReturn({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   * // Create many Profiles and only return the `id`
   * const profileWithIdOnly = gassma.Profile.createManyAndReturn({
   *   select: { id: true },
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   * 
   */
  createManyAndReturn<T extends GassmaGassmaProfileCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Profile">>>(createdData: T & Gassma.Subset<T, GassmaGassmaProfileCreateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Profile">>>): GassmaGassmaProfileFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create a Profile.
   * Read more here: https://gassma.io/en/docs/reference/crud/create/create
   * @param {GassmaGassmaProfileCreateData} createdData - Arguments to create a Profile.
   * @example
   * // Create one Profile
   * const Profile = gassma.Profile.create({
   *   data: {
   *     // ... data to create a Profile
   *   }
   * })
   * 
   */
  create<T extends GassmaGassmaProfileCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "Profile">>>(createdData: T & Gassma.Subset<T, GassmaGassmaProfileCreateData & Gassma.ComputedArgs<Gassma.At<CMap, "Profile">>>): GassmaGassmaProfileFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first Profile that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @param {GassmaGassmaProfileFindFirstData} findData - Arguments to find a Profile
   * @example
   * // Get one Profile
   * const profile = gassma.Profile.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends GassmaGassmaProfileFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Profile">>>(findData: T & Gassma.Subset<T, GassmaGassmaProfileFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Profile">>>): GassmaGassmaProfileFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Find the first Profile.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirst
   * @example
   * // Get the first Profile
   * const profile = gassma.Profile.findFirst()
   */
  findFirst(): GassmaGassmaProfileFindResult<unknown, unknown, unknown, GO, O, CMap> | null;
  /**
   * Find the first Profile that matches the filter or
   * throw `NotFoundError` if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @param {GassmaGassmaProfileFindFirstData} findData - Arguments to find a Profile
   * @example
   * // Get one Profile
   * const profile = gassma.Profile.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends GassmaGassmaProfileFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Profile">>>(findData: T & Gassma.Subset<T, GassmaGassmaProfileFindFirstData & Gassma.ComputedArgs<Gassma.At<CMap, "Profile">>>): GassmaGassmaProfileFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Find the first Profile or throw `NotFoundError` if no Profiles exist.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findFirstOrThrow
   * @example
   * // Get the first Profile
   * const profile = gassma.Profile.findFirstOrThrow()
   */
  findFirstOrThrow(): GassmaGassmaProfileFindResult<unknown, unknown, unknown, GO, O, CMap>;
  /**
   * Find zero or more Profiles that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @param {GassmaGassmaProfileFindManyData} findData - Arguments to filter and select certain fields only.
   * @example
   * // Get all Profiles
   * const profiles = gassma.Profile.findMany()
   * 
   * // Get first 10 Profiles
   * const profiles = gassma.Profile.findMany({ take: 10 })
   * 
   * // Only select the `id`
   * const profileWithIdOnly = gassma.Profile.findMany({ select: { id: true } })
   * 
   */
  findMany<T extends GassmaGassmaProfileFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "Profile">>>(findData: T & Gassma.Subset<T, GassmaGassmaProfileFindManyData & Gassma.ComputedArgs<Gassma.At<CMap, "Profile">>>): GassmaGassmaProfileFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Find all Profiles.
   * Read more here: https://gassma.io/en/docs/reference/crud/read/findMany
   * @example
   * // Get all Profiles
   * const profiles = gassma.Profile.findMany()
   */
  findMany(): GassmaGassmaProfileFindResult<unknown, unknown, unknown, GO, O, CMap>[];
  /**
   * Update one Profile.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/update
   * @param {GassmaGassmaProfileUpdateSingleData} updateData - Arguments to update one Profile.
   * @example
   * // Update one Profile
   * const profile = gassma.Profile.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends GassmaGassmaProfileUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Profile">>>(updateData: T & Gassma.Subset<T, GassmaGassmaProfileUpdateSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Profile">>>): GassmaGassmaProfileFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Update zero or more Profiles.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateMany
   * @param {GassmaGassmaProfileUpdateData} updateData - Arguments to update one or more rows.
   * @example
   * // Update many Profiles
   * const { count } = gassma.Profile.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany(updateData: GassmaGassmaProfileUpdateData): UpdateManyReturn;
  /**
   * Update zero or more Profiles and returns the data updated in the spreadsheet.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/updateManyAndReturn
   * @param {GassmaGassmaProfileUpdateManyAndReturnData} updateData - Arguments to update many Profiles.
   * @example
   * // Update many Profiles
   * const profiles = gassma.Profile.updateManyAndReturn({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   * // Update zero or more Profiles and only return the `id`
   * const profileWithIdOnly = gassma.Profile.updateManyAndReturn({
   *   select: { id: true },
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateManyAndReturn<T extends GassmaGassmaProfileUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Profile">>>(updateData: T & Gassma.Subset<T, GassmaGassmaProfileUpdateManyAndReturnData & Gassma.ComputedArgs<Gassma.At<CMap, "Profile">>>): GassmaGassmaProfileFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>[];
  /**
   * Create or update one Profile.
   * Read more here: https://gassma.io/en/docs/reference/crud/update/upsert
   * @param {GassmaGassmaProfileUpsertSingleData} upsertData - Arguments to update or create a Profile.
   * @example
   * // Update or create a Profile
   * const profile = gassma.Profile.upsert({
   *   create: {
   *     // ... data to create a Profile
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Profile we want to update
   *   }
   * })
   */
  upsert<T extends GassmaGassmaProfileUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Profile">>>(upsertData: T & Gassma.Subset<T, GassmaGassmaProfileUpsertSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Profile">>>): GassmaGassmaProfileFindResult<T["select"], T["include"], T["omit"], GO, O, CMap>;
  /**
   * Delete a Profile.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/delete
   * @param {GassmaGassmaProfileDeleteSingleData} deleteData - Arguments to delete one Profile.
   * @example
   * // Delete one Profile
   * const Profile = gassma.Profile.delete({
   *   where: {
   *     // ... filter to delete one Profile
   *   }
   * })
   * 
   */
  delete<T extends GassmaGassmaProfileDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Profile">>>(deleteData: T & Gassma.Subset<T, GassmaGassmaProfileDeleteSingleData & Gassma.ComputedArgs<Gassma.At<CMap, "Profile">>>): GassmaGassmaProfileFindResult<T["select"], T["include"], T["omit"], GO, O, CMap> | null;
  /**
   * Delete zero or more Profiles.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @param {GassmaGassmaProfileDeleteData} deleteData - Arguments to filter Profiles to delete.
   * @example
   * // Delete a few Profiles
   * const { count } = gassma.Profile.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany(deleteData: GassmaGassmaProfileDeleteData): DeleteManyReturn;
  /**
   * Delete every Profile.
   * Calling `deleteMany` without arguments deletes **all** rows in the sheet. This cannot be undone.
   * Read more here: https://gassma.io/en/docs/reference/crud/delete/deleteMany
   * @example
   * // Delete every Profile in the sheet
   * const { count } = gassma.Profile.deleteMany()
   */
  deleteMany(): DeleteManyReturn;
  /**
   * Allows you to perform aggregations operations on a Profile.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/aggregate
   * @param {GassmaGassmaProfileAggregateData} aggregateData - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Count the Profiles that match the filter
   * const aggregations = gassma.Profile.aggregate({
   *   _count: true,
   *   where: {
   *     // ... provide filter here
   *   },
   *   take: 10,
   * })
   */
  aggregate<T extends GassmaGassmaProfileAggregateData>(aggregateData: T & Gassma.Subset<T, GassmaGassmaProfileAggregateData>): GassmaGassmaProfileAggregateResult<T>;
  /**
   * Count the number of Profiles.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @param {GassmaGassmaProfileCountData} countData - Arguments to filter Profiles to count.
   * @example
   * // Count the number of Profiles
   * const count = gassma.Profile.count({
   *   where: {
   *     // ... the filter for the Profiles we want to count
   *   }
   * })
   */
  count<T extends GassmaGassmaProfileCountData>(countData: T & Gassma.Subset<T, GassmaGassmaProfileCountData>): GassmaGassmaProfileCountResult<T>;
  /**
   * Count every Profile.
   * Read more here: https://gassma.io/en/docs/reference/statistics/count
   * @example
   * // Count every Profile
   * const count = gassma.Profile.count()
   */
  count(): number;
  /**
   * Group by Profile.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://gassma.io/en/docs/reference/statistics/groupBy
   * @param {GassmaGassmaProfileGroupByData} groupByData - Group by arguments.
   * @example
   * // Group by id, get count
   * const result = gassma.Profile.groupBy({
   *   by: ['id'],
   *   _count: true,
   * })
   * 
   */
  groupBy<T extends GassmaGassmaProfileGroupByData>(groupByData: T & Gassma.Subset<T, GassmaGassmaProfileGroupByData>): GassmaGassmaProfileGroupByResult<T>[];
  /**
   * Get the value the next `create` will issue for an autoincrement field of Profile.
   * Reading the counter is allowed inside `$transaction`.
   * Throws `GassmaAutoincrementNotConfiguredError` when the field is not an autoincrement field.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Profile.
   * @example
   * // The id the next Profile will get
   * const next = gassma.Profile.$getAutoincrement("id")
   */
  $getAutoincrement(field: "id"): number;
  /**
   * Set the value the next `create` will issue for an autoincrement field of Profile.
   * `next` is the value that will be issued next, so it must be an integer of 1 or more.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Profile.
   * @param {number} next - The value the next `create` will issue.
   * @example
   * // Let the next Profile continue from 1000
   * gassma.Profile.$setAutoincrement("id", 1000)
   */
  $setAutoincrement(field: "id", next: number): void;
  /**
   * Line the counter of Profile up with the rows already in the sheet.
   * The counter becomes the largest value in the column plus one, which is also the return value.
   * Throws `GassmaAutoincrementInTransactionError` inside `$transaction`, because the counter is never rolled back.
   * Read more here: https://gassma.io/en/docs/reference/config/autoincrement
   * @param {string} field - An autoincrement field of Profile.
   * @example
   * // Adopt a sheet that already has rows
   * const next = gassma.Profile.$syncAutoincrement("id")
   */
  $syncAutoincrement(field: "id"): number;
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

export type GassmaGassmaSensorReadingUse = {
  "id"?: number;
  "sensorName": string;
  "recordedAt": Date;
};

export type GassmaGassmaTimeSlotUse = {
  "id"?: number;
  "label": string;
  "slotAt"?: Date | null;
};

export type GassmaGassmaReservationUse = {
  "id"?: number;
  "guestName": string;
  "slotAt": Date;
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
  data: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "authorId" | "categoryId">> & (Gassma.RawAllowed<Pick<GassmaGassmaPostUse, "authorId">> | { "author": { create?: Gassma.RawAllowed<GassmaGassmaUserUse>; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: Gassma.RawAllowed<GassmaGassmaUserUse> } } }) & (Gassma.RawAllowed<Pick<GassmaGassmaPostUse, "categoryId">> | { "category": { create?: Gassma.RawAllowed<GassmaGassmaCategoryUse>; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: Gassma.RawAllowed<GassmaGassmaCategoryUse> } } }) & {
    "comments"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "postId">> | Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "postId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "postId">>[] }; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "postId">> } | { where: GassmaGassmaCommentWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "postId">> }[] };
    "tags"?: { create?: Gassma.RawAllowed<GassmaGassmaTagUse> | Gassma.RawAllowed<GassmaGassmaTagUse>[]; connect?: GassmaGassmaTagWhereUse | GassmaGassmaTagWhereUse[]; connectOrCreate?: { where: GassmaGassmaTagWhereUse; create: Gassma.RawAllowed<GassmaGassmaTagUse> } | { where: GassmaGassmaTagWhereUse; create: Gassma.RawAllowed<GassmaGassmaTagUse> }[] };
  };
  include?: GassmaGassmaPostInclude;
} & ({ select?: GassmaGassmaPostSelect; omit?: never } | { select?: never; omit?: GassmaGassmaPostOmit });

export type GassmaGassmaCommentCreateData = {
  data: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "authorId" | "postId">> & (Gassma.RawAllowed<Pick<GassmaGassmaCommentUse, "authorId">> | { "author": { create?: Gassma.RawAllowed<GassmaGassmaUserUse>; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: Gassma.RawAllowed<GassmaGassmaUserUse> } } }) & (Gassma.RawAllowed<Pick<GassmaGassmaCommentUse, "postId">> | { "post": { create?: Gassma.RawAllowed<GassmaGassmaPostUse>; connect?: GassmaGassmaPostWhereUse; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<GassmaGassmaPostUse> } } });
  include?: GassmaGassmaCommentInclude;
} & ({ select?: GassmaGassmaCommentSelect; omit?: never } | { select?: never; omit?: GassmaGassmaCommentOmit });

export type GassmaGassmaCategoryCreateData = {
  data: Gassma.RawAllowed<Omit<GassmaGassmaCategoryUse, "parentId">> & (Gassma.RawAllowed<Pick<GassmaGassmaCategoryUse, "parentId">> | { "parent": { create?: Gassma.RawAllowed<GassmaGassmaCategoryUse>; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: Gassma.RawAllowed<GassmaGassmaCategoryUse> } } }) & {
    "posts"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "categoryId">> | Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "categoryId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "categoryId">>[] }; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "categoryId">> } | { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "categoryId">> }[] };
    "children"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaCategoryUse, "parentId">> | Gassma.RawAllowed<Omit<GassmaGassmaCategoryUse, "parentId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaCategoryUse, "parentId">>[] }; connect?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaCategoryUse, "parentId">> } | { where: GassmaGassmaCategoryWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaCategoryUse, "parentId">> }[] };
  };
  include?: GassmaGassmaCategoryInclude;
} & ({ select?: GassmaGassmaCategorySelect; omit?: never } | { select?: never; omit?: GassmaGassmaCategoryOmit });

export type GassmaGassmaTagCreateData = {
  data: Gassma.RawAllowed<GassmaGassmaTagUse> & {
    "posts"?: { create?: Gassma.RawAllowed<GassmaGassmaPostUse> | Gassma.RawAllowed<GassmaGassmaPostUse>[]; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<GassmaGassmaPostUse> } | { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<GassmaGassmaPostUse> }[] };
  };
  include?: GassmaGassmaTagInclude;
} & ({ select?: GassmaGassmaTagSelect; omit?: never } | { select?: never; omit?: GassmaGassmaTagOmit });

export type GassmaGassmaSensorReadingCreateData = {
  data: Gassma.RawAllowed<GassmaGassmaSensorReadingUse>;
  include?: GassmaGassmaSensorReadingInclude;
} & ({ select?: GassmaGassmaSensorReadingSelect; omit?: never } | { select?: never; omit?: GassmaGassmaSensorReadingOmit });

export type GassmaGassmaTimeSlotCreateData = {
  data: Gassma.RawAllowed<GassmaGassmaTimeSlotUse> & {
    "reservations"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaReservationUse, "slotAt">> | Gassma.RawAllowed<Omit<GassmaGassmaReservationUse, "slotAt">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaReservationUse, "slotAt">>[] }; connect?: GassmaGassmaReservationWhereUse | GassmaGassmaReservationWhereUse[]; connectOrCreate?: { where: GassmaGassmaReservationWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaReservationUse, "slotAt">> } | { where: GassmaGassmaReservationWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaReservationUse, "slotAt">> }[] };
  };
  include?: GassmaGassmaTimeSlotInclude;
} & ({ select?: GassmaGassmaTimeSlotSelect; omit?: never } | { select?: never; omit?: GassmaGassmaTimeSlotOmit });

export type GassmaGassmaReservationCreateData = {
  data: Gassma.RawAllowed<Omit<GassmaGassmaReservationUse, "slotAt">> & (Gassma.RawAllowed<Pick<GassmaGassmaReservationUse, "slotAt">> | { "timeSlot": { create?: Gassma.RawAllowed<GassmaGassmaTimeSlotUse>; connect?: GassmaGassmaTimeSlotWhereUse; connectOrCreate?: { where: GassmaGassmaTimeSlotWhereUse; create: Gassma.RawAllowed<GassmaGassmaTimeSlotUse> } } });
  include?: GassmaGassmaReservationInclude;
} & ({ select?: GassmaGassmaReservationSelect; omit?: never } | { select?: never; omit?: GassmaGassmaReservationOmit });

export type GassmaGassmaProductCreateData = {
  data: Gassma.RawAllowed<GassmaGassmaProductUse> & {
    "orderItems"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "productId">> | Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "productId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "productId">>[] }; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "productId">> } | { where: GassmaGassmaOrderItemWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "productId">> }[] };
  };
  include?: GassmaGassmaProductInclude;
} & ({ select?: GassmaGassmaProductSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProductOmit });

export type GassmaGassmaOrderCreateData = {
  data: Gassma.RawAllowed<Omit<GassmaGassmaOrderUse, "userId">> & (Gassma.RawAllowed<Pick<GassmaGassmaOrderUse, "userId">> | { "user": { create?: Gassma.RawAllowed<GassmaGassmaUserUse>; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: Gassma.RawAllowed<GassmaGassmaUserUse> } } }) & {
    "items"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "orderId">> | Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "orderId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "orderId">>[] }; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "orderId">> } | { where: GassmaGassmaOrderItemWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "orderId">> }[] };
  };
  include?: GassmaGassmaOrderInclude;
} & ({ select?: GassmaGassmaOrderSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderOmit });

export type GassmaGassmaOrderItemCreateData = {
  data: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "orderId" | "productId">> & (Gassma.RawAllowed<Pick<GassmaGassmaOrderItemUse, "orderId">> | { "order": { create?: Gassma.RawAllowed<GassmaGassmaOrderUse>; connect?: GassmaGassmaOrderWhereUse; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: Gassma.RawAllowed<GassmaGassmaOrderUse> } } }) & (Gassma.RawAllowed<Pick<GassmaGassmaOrderItemUse, "productId">> | { "product": { create?: Gassma.RawAllowed<GassmaGassmaProductUse>; connect?: GassmaGassmaProductWhereUse; connectOrCreate?: { where: GassmaGassmaProductWhereUse; create: Gassma.RawAllowed<GassmaGassmaProductUse> } } });
  include?: GassmaGassmaOrderItemInclude;
} & ({ select?: GassmaGassmaOrderItemSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderItemOmit });

export type GassmaGassmaFormulaCellCreateData = {
  data: Gassma.RawAllowed<GassmaGassmaFormulaCellUse>;
  include?: GassmaGassmaFormulaCellInclude;
} & ({ select?: GassmaGassmaFormulaCellSelect; omit?: never } | { select?: never; omit?: GassmaGassmaFormulaCellOmit });

export type GassmaGassmaNotificationCreateData = {
  data: Gassma.RawAllowed<GassmaGassmaNotificationUse>;
  include?: GassmaGassmaNotificationInclude;
} & ({ select?: GassmaGassmaNotificationSelect; omit?: never } | { select?: never; omit?: GassmaGassmaNotificationOmit });

export type GassmaGassmaOffsetNoteCreateData = {
  data: Gassma.RawAllowed<GassmaGassmaOffsetNoteUse>;
  include?: GassmaGassmaOffsetNoteInclude;
} & ({ select?: GassmaGassmaOffsetNoteSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOffsetNoteOmit });

export type GassmaGassmaUserCreateData = {
  data: Gassma.RawAllowed<GassmaGassmaUserUse> & {
    "posts"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "authorId">> | Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "authorId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "authorId">>[] }; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "authorId">> } | { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "authorId">> }[] };
    "comments"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "authorId">> | Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "authorId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "authorId">>[] }; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "authorId">> } | { where: GassmaGassmaCommentWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "authorId">> }[] };
    "orders"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaOrderUse, "userId">> | Gassma.RawAllowed<Omit<GassmaGassmaOrderUse, "userId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaOrderUse, "userId">>[] }; connect?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaOrderUse, "userId">> } | { where: GassmaGassmaOrderWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaOrderUse, "userId">> }[] };
    "profile"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaProfileUse, "userId">>; connect?: GassmaGassmaProfileWhereUse; connectOrCreate?: { where: GassmaGassmaProfileWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaProfileUse, "userId">> } };
  };
  include?: GassmaGassmaUserInclude;
} & ({ select?: GassmaGassmaUserSelect; omit?: never } | { select?: never; omit?: GassmaGassmaUserOmit });

export type GassmaGassmaProfileCreateData = {
  data: Gassma.RawAllowed<Omit<GassmaGassmaProfileUse, "userId">> & (Gassma.RawAllowed<Pick<GassmaGassmaProfileUse, "userId">> | { "user": { create?: Gassma.RawAllowed<GassmaGassmaUserUse>; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: Gassma.RawAllowed<GassmaGassmaUserUse> } } });
  include?: GassmaGassmaProfileInclude;
} & ({ select?: GassmaGassmaProfileSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProfileOmit });

export type GassmaGassmaPostCreateManyData = {
  data: Gassma.RawAllowed<GassmaGassmaPostUse>[];
};

export type GassmaGassmaCommentCreateManyData = {
  data: Gassma.RawAllowed<GassmaGassmaCommentUse>[];
};

export type GassmaGassmaCategoryCreateManyData = {
  data: Gassma.RawAllowed<GassmaGassmaCategoryUse>[];
};

export type GassmaGassmaTagCreateManyData = {
  data: Gassma.RawAllowed<GassmaGassmaTagUse>[];
};

export type GassmaGassmaSensorReadingCreateManyData = {
  data: Gassma.RawAllowed<GassmaGassmaSensorReadingUse>[];
};

export type GassmaGassmaTimeSlotCreateManyData = {
  data: Gassma.RawAllowed<GassmaGassmaTimeSlotUse>[];
};

export type GassmaGassmaReservationCreateManyData = {
  data: Gassma.RawAllowed<GassmaGassmaReservationUse>[];
};

export type GassmaGassmaProductCreateManyData = {
  data: Gassma.RawAllowed<GassmaGassmaProductUse>[];
};

export type GassmaGassmaOrderCreateManyData = {
  data: Gassma.RawAllowed<GassmaGassmaOrderUse>[];
};

export type GassmaGassmaOrderItemCreateManyData = {
  data: Gassma.RawAllowed<GassmaGassmaOrderItemUse>[];
};

export type GassmaGassmaFormulaCellCreateManyData = {
  data: Gassma.RawAllowed<GassmaGassmaFormulaCellUse>[];
};

export type GassmaGassmaNotificationCreateManyData = {
  data: Gassma.RawAllowed<GassmaGassmaNotificationUse>[];
};

export type GassmaGassmaOffsetNoteCreateManyData = {
  data: Gassma.RawAllowed<GassmaGassmaOffsetNoteUse>[];
};

export type GassmaGassmaUserCreateManyData = {
  data: Gassma.RawAllowed<GassmaGassmaUserUse>[];
};

export type GassmaGassmaProfileCreateManyData = {
  data: Gassma.RawAllowed<GassmaGassmaProfileUse>[];
};

export type GassmaGassmaPostCreateManyAndReturnData = {
  data: Gassma.RawAllowed<GassmaGassmaPostUse>[];
  include?: GassmaGassmaPostInclude;
} & ({ select?: GassmaGassmaPostSelect; omit?: never } | { select?: never; omit?: GassmaGassmaPostOmit });

export type GassmaGassmaCommentCreateManyAndReturnData = {
  data: Gassma.RawAllowed<GassmaGassmaCommentUse>[];
  include?: GassmaGassmaCommentInclude;
} & ({ select?: GassmaGassmaCommentSelect; omit?: never } | { select?: never; omit?: GassmaGassmaCommentOmit });

export type GassmaGassmaCategoryCreateManyAndReturnData = {
  data: Gassma.RawAllowed<GassmaGassmaCategoryUse>[];
  include?: GassmaGassmaCategoryInclude;
} & ({ select?: GassmaGassmaCategorySelect; omit?: never } | { select?: never; omit?: GassmaGassmaCategoryOmit });

export type GassmaGassmaTagCreateManyAndReturnData = {
  data: Gassma.RawAllowed<GassmaGassmaTagUse>[];
  include?: GassmaGassmaTagInclude;
} & ({ select?: GassmaGassmaTagSelect; omit?: never } | { select?: never; omit?: GassmaGassmaTagOmit });

export type GassmaGassmaSensorReadingCreateManyAndReturnData = {
  data: Gassma.RawAllowed<GassmaGassmaSensorReadingUse>[];
  include?: GassmaGassmaSensorReadingInclude;
} & ({ select?: GassmaGassmaSensorReadingSelect; omit?: never } | { select?: never; omit?: GassmaGassmaSensorReadingOmit });

export type GassmaGassmaTimeSlotCreateManyAndReturnData = {
  data: Gassma.RawAllowed<GassmaGassmaTimeSlotUse>[];
  include?: GassmaGassmaTimeSlotInclude;
} & ({ select?: GassmaGassmaTimeSlotSelect; omit?: never } | { select?: never; omit?: GassmaGassmaTimeSlotOmit });

export type GassmaGassmaReservationCreateManyAndReturnData = {
  data: Gassma.RawAllowed<GassmaGassmaReservationUse>[];
  include?: GassmaGassmaReservationInclude;
} & ({ select?: GassmaGassmaReservationSelect; omit?: never } | { select?: never; omit?: GassmaGassmaReservationOmit });

export type GassmaGassmaProductCreateManyAndReturnData = {
  data: Gassma.RawAllowed<GassmaGassmaProductUse>[];
  include?: GassmaGassmaProductInclude;
} & ({ select?: GassmaGassmaProductSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProductOmit });

export type GassmaGassmaOrderCreateManyAndReturnData = {
  data: Gassma.RawAllowed<GassmaGassmaOrderUse>[];
  include?: GassmaGassmaOrderInclude;
} & ({ select?: GassmaGassmaOrderSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderOmit });

export type GassmaGassmaOrderItemCreateManyAndReturnData = {
  data: Gassma.RawAllowed<GassmaGassmaOrderItemUse>[];
  include?: GassmaGassmaOrderItemInclude;
} & ({ select?: GassmaGassmaOrderItemSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderItemOmit });

export type GassmaGassmaFormulaCellCreateManyAndReturnData = {
  data: Gassma.RawAllowed<GassmaGassmaFormulaCellUse>[];
  include?: GassmaGassmaFormulaCellInclude;
} & ({ select?: GassmaGassmaFormulaCellSelect; omit?: never } | { select?: never; omit?: GassmaGassmaFormulaCellOmit });

export type GassmaGassmaNotificationCreateManyAndReturnData = {
  data: Gassma.RawAllowed<GassmaGassmaNotificationUse>[];
  include?: GassmaGassmaNotificationInclude;
} & ({ select?: GassmaGassmaNotificationSelect; omit?: never } | { select?: never; omit?: GassmaGassmaNotificationOmit });

export type GassmaGassmaOffsetNoteCreateManyAndReturnData = {
  data: Gassma.RawAllowed<GassmaGassmaOffsetNoteUse>[];
  include?: GassmaGassmaOffsetNoteInclude;
} & ({ select?: GassmaGassmaOffsetNoteSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOffsetNoteOmit });

export type GassmaGassmaUserCreateManyAndReturnData = {
  data: Gassma.RawAllowed<GassmaGassmaUserUse>[];
  include?: GassmaGassmaUserInclude;
} & ({ select?: GassmaGassmaUserSelect; omit?: never } | { select?: never; omit?: GassmaGassmaUserOmit });

export type GassmaGassmaProfileCreateManyAndReturnData = {
  data: Gassma.RawAllowed<GassmaGassmaProfileUse>[];
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

export type GassmaGassmaSensorReadingidFilterConditions = {
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

export type GassmaGassmaSensorReadingsensorNameFilterConditions = {
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

export type GassmaGassmaSensorReadingrecordedAtFilterConditions = {
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

export type GassmaGassmaTimeSlotidFilterConditions = {
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

export type GassmaGassmaTimeSlotlabelFilterConditions = {
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

export type GassmaGassmaTimeSlotslotAtFilterConditions = {
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

export type GassmaGassmaReservationidFilterConditions = {
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

export type GassmaGassmaReservationguestNameFilterConditions = {
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

export type GassmaGassmaReservationslotAtFilterConditions = {
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

export type GassmaGassmaSensorReadingWhereUse = {
  "id"?: number | GassmaGassmaSensorReadingidFilterConditions;
  "sensorName"?: string | GassmaGassmaSensorReadingsensorNameFilterConditions;
  "recordedAt"?: Date | GassmaGassmaSensorReadingrecordedAtFilterConditions;

  AND?: GassmaGassmaSensorReadingWhereUse[] | GassmaGassmaSensorReadingWhereUse;
  OR?: GassmaGassmaSensorReadingWhereUse[];
  NOT?: GassmaGassmaSensorReadingWhereUse[] | GassmaGassmaSensorReadingWhereUse;
};

export type GassmaGassmaTimeSlotWhereUse = {
  "id"?: number | GassmaGassmaTimeSlotidFilterConditions;
  "label"?: string | GassmaGassmaTimeSlotlabelFilterConditions;
  "slotAt"?: Date | null | GassmaGassmaTimeSlotslotAtFilterConditions;
  "reservations"?: { some?: GassmaGassmaReservationWhereUse; every?: GassmaGassmaReservationWhereUse; none?: GassmaGassmaReservationWhereUse };

  AND?: GassmaGassmaTimeSlotWhereUse[] | GassmaGassmaTimeSlotWhereUse;
  OR?: GassmaGassmaTimeSlotWhereUse[];
  NOT?: GassmaGassmaTimeSlotWhereUse[] | GassmaGassmaTimeSlotWhereUse;
};

export type GassmaGassmaReservationWhereUse = {
  "id"?: number | GassmaGassmaReservationidFilterConditions;
  "guestName"?: string | GassmaGassmaReservationguestNameFilterConditions;
  "slotAt"?: Date | GassmaGassmaReservationslotAtFilterConditions;
  "timeSlot"?: { is?: GassmaGassmaTimeSlotWhereUse | null; isNot?: GassmaGassmaTimeSlotWhereUse | null } | null;

  AND?: GassmaGassmaReservationWhereUse[] | GassmaGassmaReservationWhereUse;
  OR?: GassmaGassmaReservationWhereUse[];
  NOT?: GassmaGassmaReservationWhereUse[] | GassmaGassmaReservationWhereUse;
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

export type GassmaGassmaSensorReadingidHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaSensorReadingidFilterConditions;
  _min?: GassmaGassmaSensorReadingidFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaSensorReadingidFilterConditions;

export type GassmaGassmaSensorReadingsensorNameHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaSensorReadingsensorNameFilterConditions;
  _min?: GassmaGassmaSensorReadingsensorNameFilterConditions;
} & GassmaGassmaSensorReadingsensorNameFilterConditions;

export type GassmaGassmaSensorReadingrecordedAtHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaSensorReadingrecordedAtFilterConditions;
  _min?: GassmaGassmaSensorReadingrecordedAtFilterConditions;
} & GassmaGassmaSensorReadingrecordedAtFilterConditions;

export type GassmaGassmaTimeSlotidHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaTimeSlotidFilterConditions;
  _min?: GassmaGassmaTimeSlotidFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaTimeSlotidFilterConditions;

export type GassmaGassmaTimeSlotlabelHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaTimeSlotlabelFilterConditions;
  _min?: GassmaGassmaTimeSlotlabelFilterConditions;
} & GassmaGassmaTimeSlotlabelFilterConditions;

export type GassmaGassmaTimeSlotslotAtHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaTimeSlotslotAtFilterConditions;
  _min?: GassmaGassmaTimeSlotslotAtFilterConditions;
} & GassmaGassmaTimeSlotslotAtFilterConditions;

export type GassmaGassmaReservationidHavingCore = {
  _avg?: Gassma.FilterConditions<number>;
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaReservationidFilterConditions;
  _min?: GassmaGassmaReservationidFilterConditions;
  _sum?: Gassma.FilterConditions<number>;
} & GassmaGassmaReservationidFilterConditions;

export type GassmaGassmaReservationguestNameHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaReservationguestNameFilterConditions;
  _min?: GassmaGassmaReservationguestNameFilterConditions;
} & GassmaGassmaReservationguestNameFilterConditions;

export type GassmaGassmaReservationslotAtHavingCore = {
  _count?: Gassma.FilterConditions<number>;
  _max?: GassmaGassmaReservationslotAtFilterConditions;
  _min?: GassmaGassmaReservationslotAtFilterConditions;
} & GassmaGassmaReservationslotAtFilterConditions;

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

export type GassmaGassmaSensorReadingHavingUse = {
  "id"?: number | GassmaGassmaSensorReadingidHavingCore;
  "sensorName"?: string | GassmaGassmaSensorReadingsensorNameHavingCore;
  "recordedAt"?: Date | GassmaGassmaSensorReadingrecordedAtHavingCore;

  AND?: GassmaGassmaSensorReadingHavingUse[] | GassmaGassmaSensorReadingHavingUse;
  OR?: GassmaGassmaSensorReadingHavingUse[];
  NOT?: GassmaGassmaSensorReadingHavingUse[] | GassmaGassmaSensorReadingHavingUse;
};

export type GassmaGassmaTimeSlotHavingUse = {
  "id"?: number | GassmaGassmaTimeSlotidHavingCore;
  "label"?: string | GassmaGassmaTimeSlotlabelHavingCore;
  "slotAt"?: Date | null | GassmaGassmaTimeSlotslotAtHavingCore;

  AND?: GassmaGassmaTimeSlotHavingUse[] | GassmaGassmaTimeSlotHavingUse;
  OR?: GassmaGassmaTimeSlotHavingUse[];
  NOT?: GassmaGassmaTimeSlotHavingUse[] | GassmaGassmaTimeSlotHavingUse;
};

export type GassmaGassmaReservationHavingUse = {
  "id"?: number | GassmaGassmaReservationidHavingCore;
  "guestName"?: string | GassmaGassmaReservationguestNameHavingCore;
  "slotAt"?: Date | GassmaGassmaReservationslotAtHavingCore;

  AND?: GassmaGassmaReservationHavingUse[] | GassmaGassmaReservationHavingUse;
  OR?: GassmaGassmaReservationHavingUse[];
  NOT?: GassmaGassmaReservationHavingUse[] | GassmaGassmaReservationHavingUse;
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

export type GassmaGassmaSensorReadingFindData = {
  where?: GassmaGassmaSensorReadingWhereUse;
  orderBy?: GassmaGassmaSensorReadingOrderBy | GassmaGassmaSensorReadingOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "sensorName" | "recordedAt" | ("id" | "sensorName" | "recordedAt")[];
  include?: GassmaGassmaSensorReadingInclude;
  cursor?: Partial<GassmaGassmaSensorReadingUse>;
  _count?: GassmaGassmaSensorReadingCountValue;
} & ({ select?: GassmaGassmaSensorReadingFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaSensorReadingOmit });

export type GassmaGassmaTimeSlotFindData = {
  where?: GassmaGassmaTimeSlotWhereUse;
  orderBy?: GassmaGassmaTimeSlotOrderBy | GassmaGassmaTimeSlotOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "label" | "slotAt" | ("id" | "label" | "slotAt")[];
  include?: GassmaGassmaTimeSlotInclude;
  cursor?: Partial<GassmaGassmaTimeSlotUse>;
  _count?: GassmaGassmaTimeSlotCountValue;
} & ({ select?: GassmaGassmaTimeSlotFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaTimeSlotOmit });

export type GassmaGassmaReservationFindData = {
  where?: GassmaGassmaReservationWhereUse;
  orderBy?: GassmaGassmaReservationOrderBy | GassmaGassmaReservationOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "guestName" | "slotAt" | ("id" | "guestName" | "slotAt")[];
  include?: GassmaGassmaReservationInclude;
  cursor?: Partial<GassmaGassmaReservationUse>;
  _count?: GassmaGassmaReservationCountValue;
} & ({ select?: GassmaGassmaReservationFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaReservationOmit });

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

export type GassmaGassmaSensorReadingFindFirstData = {
  where?: GassmaGassmaSensorReadingWhereUse;
  orderBy?: GassmaGassmaSensorReadingOrderBy | GassmaGassmaSensorReadingOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "sensorName" | "recordedAt" | ("id" | "sensorName" | "recordedAt")[];
  include?: GassmaGassmaSensorReadingInclude;
  cursor?: Partial<GassmaGassmaSensorReadingUse>;
  _count?: GassmaGassmaSensorReadingCountValue;
} & ({ select?: GassmaGassmaSensorReadingFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaSensorReadingOmit });

export type GassmaGassmaTimeSlotFindFirstData = {
  where?: GassmaGassmaTimeSlotWhereUse;
  orderBy?: GassmaGassmaTimeSlotOrderBy | GassmaGassmaTimeSlotOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "label" | "slotAt" | ("id" | "label" | "slotAt")[];
  include?: GassmaGassmaTimeSlotInclude;
  cursor?: Partial<GassmaGassmaTimeSlotUse>;
  _count?: GassmaGassmaTimeSlotCountValue;
} & ({ select?: GassmaGassmaTimeSlotFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaTimeSlotOmit });

export type GassmaGassmaReservationFindFirstData = {
  where?: GassmaGassmaReservationWhereUse;
  orderBy?: GassmaGassmaReservationOrderBy | GassmaGassmaReservationOrderBy[];
  take?: number;
  skip?: number;
  distinct?: "id" | "guestName" | "slotAt" | ("id" | "guestName" | "slotAt")[];
  include?: GassmaGassmaReservationInclude;
  cursor?: Partial<GassmaGassmaReservationUse>;
  _count?: GassmaGassmaReservationCountValue;
} & ({ select?: GassmaGassmaReservationFindSelect; omit?: never } | { select?: never; omit?: GassmaGassmaReservationOmit });

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

export type GassmaGassmaSensorReadingFindManyData = GassmaGassmaSensorReadingFindData;

export type GassmaGassmaTimeSlotFindManyData = GassmaGassmaTimeSlotFindData;

export type GassmaGassmaReservationFindManyData = GassmaGassmaReservationFindData;

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
  data: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
};

export type GassmaGassmaCommentUpdateData = {
  where?: GassmaGassmaCommentWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | (K extends "id" | "authorId" | "postId" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
};

export type GassmaGassmaCategoryUpdateData = {
  where?: GassmaGassmaCategoryWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | (K extends "id" | "parentId" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
};

export type GassmaGassmaTagUpdateData = {
  where?: GassmaGassmaTagWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaTagUse]: GassmaGassmaTagUse[K] | (K extends "id" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
};

export type GassmaGassmaSensorReadingUpdateData = {
  where?: GassmaGassmaSensorReadingWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaSensorReadingUse]: GassmaGassmaSensorReadingUse[K] | (K extends "id" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
};

export type GassmaGassmaTimeSlotUpdateData = {
  where?: GassmaGassmaTimeSlotWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaTimeSlotUse]: GassmaGassmaTimeSlotUse[K] | (K extends "id" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
};

export type GassmaGassmaReservationUpdateData = {
  where?: GassmaGassmaReservationWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaReservationUse]: GassmaGassmaReservationUse[K] | (K extends "id" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
};

export type GassmaGassmaProductUpdateData = {
  where?: GassmaGassmaProductWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaProductUse]: GassmaGassmaProductUse[K] | (K extends "id" | "price" | "stock" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
};

export type GassmaGassmaOrderUpdateData = {
  where?: GassmaGassmaOrderWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaOrderUse]: GassmaGassmaOrderUse[K] | (K extends "id" | "userId" | "totalAmount" | "quantity" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
};

export type GassmaGassmaOrderItemUpdateData = {
  where?: GassmaGassmaOrderItemWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | (K extends "id" | "orderId" | "productId" | "quantity" | "unitPrice" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
};

export type GassmaGassmaFormulaCellUpdateData = {
  where?: GassmaGassmaFormulaCellWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaFormulaCellUse]: GassmaGassmaFormulaCellUse[K] | (K extends "id" | "amount" | "total" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
};

export type GassmaGassmaNotificationUpdateData = {
  where?: GassmaGassmaNotificationWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaNotificationUse]: GassmaGassmaNotificationUse[K] | (K extends "id" | "userId" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
};

export type GassmaGassmaOffsetNoteUpdateData = {
  where?: GassmaGassmaOffsetNoteWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaOffsetNoteUse]: GassmaGassmaOffsetNoteUse[K] | (K extends "id" | "value" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
};

export type GassmaGassmaUserUpdateData = {
  where?: GassmaGassmaUserWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | (K extends "id" | "age" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
};

export type GassmaGassmaProfileUpdateData = {
  where?: GassmaGassmaProfileWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaProfileUse]: GassmaGassmaProfileUse[K] | (K extends "id" | "userId" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
};

export type GassmaGassmaPostUpdateManyAndReturnData = {
  where?: GassmaGassmaPostWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
  include?: GassmaGassmaPostInclude;
} & ({ select?: GassmaGassmaPostSelect; omit?: never } | { select?: never; omit?: GassmaGassmaPostOmit });

export type GassmaGassmaCommentUpdateManyAndReturnData = {
  where?: GassmaGassmaCommentWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | (K extends "id" | "authorId" | "postId" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
  include?: GassmaGassmaCommentInclude;
} & ({ select?: GassmaGassmaCommentSelect; omit?: never } | { select?: never; omit?: GassmaGassmaCommentOmit });

export type GassmaGassmaCategoryUpdateManyAndReturnData = {
  where?: GassmaGassmaCategoryWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | (K extends "id" | "parentId" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
  include?: GassmaGassmaCategoryInclude;
} & ({ select?: GassmaGassmaCategorySelect; omit?: never } | { select?: never; omit?: GassmaGassmaCategoryOmit });

export type GassmaGassmaTagUpdateManyAndReturnData = {
  where?: GassmaGassmaTagWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaTagUse]: GassmaGassmaTagUse[K] | (K extends "id" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
  include?: GassmaGassmaTagInclude;
} & ({ select?: GassmaGassmaTagSelect; omit?: never } | { select?: never; omit?: GassmaGassmaTagOmit });

export type GassmaGassmaSensorReadingUpdateManyAndReturnData = {
  where?: GassmaGassmaSensorReadingWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaSensorReadingUse]: GassmaGassmaSensorReadingUse[K] | (K extends "id" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
  include?: GassmaGassmaSensorReadingInclude;
} & ({ select?: GassmaGassmaSensorReadingSelect; omit?: never } | { select?: never; omit?: GassmaGassmaSensorReadingOmit });

export type GassmaGassmaTimeSlotUpdateManyAndReturnData = {
  where?: GassmaGassmaTimeSlotWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaTimeSlotUse]: GassmaGassmaTimeSlotUse[K] | (K extends "id" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
  include?: GassmaGassmaTimeSlotInclude;
} & ({ select?: GassmaGassmaTimeSlotSelect; omit?: never } | { select?: never; omit?: GassmaGassmaTimeSlotOmit });

export type GassmaGassmaReservationUpdateManyAndReturnData = {
  where?: GassmaGassmaReservationWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaReservationUse]: GassmaGassmaReservationUse[K] | (K extends "id" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
  include?: GassmaGassmaReservationInclude;
} & ({ select?: GassmaGassmaReservationSelect; omit?: never } | { select?: never; omit?: GassmaGassmaReservationOmit });

export type GassmaGassmaProductUpdateManyAndReturnData = {
  where?: GassmaGassmaProductWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaProductUse]: GassmaGassmaProductUse[K] | (K extends "id" | "price" | "stock" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
  include?: GassmaGassmaProductInclude;
} & ({ select?: GassmaGassmaProductSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProductOmit });

export type GassmaGassmaOrderUpdateManyAndReturnData = {
  where?: GassmaGassmaOrderWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaOrderUse]: GassmaGassmaOrderUse[K] | (K extends "id" | "userId" | "totalAmount" | "quantity" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
  include?: GassmaGassmaOrderInclude;
} & ({ select?: GassmaGassmaOrderSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderOmit });

export type GassmaGassmaOrderItemUpdateManyAndReturnData = {
  where?: GassmaGassmaOrderItemWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | (K extends "id" | "orderId" | "productId" | "quantity" | "unitPrice" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
  include?: GassmaGassmaOrderItemInclude;
} & ({ select?: GassmaGassmaOrderItemSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderItemOmit });

export type GassmaGassmaFormulaCellUpdateManyAndReturnData = {
  where?: GassmaGassmaFormulaCellWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaFormulaCellUse]: GassmaGassmaFormulaCellUse[K] | (K extends "id" | "amount" | "total" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
  include?: GassmaGassmaFormulaCellInclude;
} & ({ select?: GassmaGassmaFormulaCellSelect; omit?: never } | { select?: never; omit?: GassmaGassmaFormulaCellOmit });

export type GassmaGassmaNotificationUpdateManyAndReturnData = {
  where?: GassmaGassmaNotificationWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaNotificationUse]: GassmaGassmaNotificationUse[K] | (K extends "id" | "userId" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
  include?: GassmaGassmaNotificationInclude;
} & ({ select?: GassmaGassmaNotificationSelect; omit?: never } | { select?: never; omit?: GassmaGassmaNotificationOmit });

export type GassmaGassmaOffsetNoteUpdateManyAndReturnData = {
  where?: GassmaGassmaOffsetNoteWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaOffsetNoteUse]: GassmaGassmaOffsetNoteUse[K] | (K extends "id" | "value" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
  include?: GassmaGassmaOffsetNoteInclude;
} & ({ select?: GassmaGassmaOffsetNoteSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOffsetNoteOmit });

export type GassmaGassmaUserUpdateManyAndReturnData = {
  where?: GassmaGassmaUserWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | (K extends "id" | "age" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
  include?: GassmaGassmaUserInclude;
} & ({ select?: GassmaGassmaUserSelect; omit?: never } | { select?: never; omit?: GassmaGassmaUserOmit });

export type GassmaGassmaProfileUpdateManyAndReturnData = {
  where?: GassmaGassmaProfileWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaProfileUse]: GassmaGassmaProfileUse[K] | (K extends "id" | "userId" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  limit?: number;
  include?: GassmaGassmaProfileInclude;
} & ({ select?: GassmaGassmaProfileSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProfileOmit });

export type GassmaGassmaPostUpdateSingleData = {
  where: GassmaGassmaPostWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> & {
    "author"?: { create?: Gassma.RawAllowed<GassmaGassmaUserUse>; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: Gassma.RawAllowed<GassmaGassmaUserUse> }; update?: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | (K extends "id" | "age" ? Gassma.NumberOperation : never) | Gassma.RawValue }>; delete?: true; disconnect?: true };
    "category"?: { create?: Gassma.RawAllowed<GassmaGassmaCategoryUse>; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: Gassma.RawAllowed<GassmaGassmaCategoryUse> }; update?: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | (K extends "id" | "parentId" ? Gassma.NumberOperation : never) | Gassma.RawValue }>; delete?: true; disconnect?: true };
    "comments"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "postId">> | Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "postId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "postId">>[] }; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "postId">> } | { where: GassmaGassmaCommentWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "postId">> }[]; update?: { where: GassmaGassmaCommentWhereUse; data: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | (K extends "id" | "authorId" | "postId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> } | { where: GassmaGassmaCommentWhereUse; data: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | (K extends "id" | "authorId" | "postId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> }[]; delete?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; deleteMany?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; disconnect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; set?: GassmaGassmaCommentWhereUse[] };
    "tags"?: { create?: Gassma.RawAllowed<GassmaGassmaTagUse> | Gassma.RawAllowed<GassmaGassmaTagUse>[]; connect?: GassmaGassmaTagWhereUse | GassmaGassmaTagWhereUse[]; connectOrCreate?: { where: GassmaGassmaTagWhereUse; create: Gassma.RawAllowed<GassmaGassmaTagUse> } | { where: GassmaGassmaTagWhereUse; create: Gassma.RawAllowed<GassmaGassmaTagUse> }[]; disconnect?: GassmaGassmaTagWhereUse | GassmaGassmaTagWhereUse[]; set?: GassmaGassmaTagWhereUse[] };
  };
  include?: GassmaGassmaPostInclude;
} & ({ select?: GassmaGassmaPostSelect; omit?: never } | { select?: never; omit?: GassmaGassmaPostOmit });

export type GassmaGassmaCommentUpdateSingleData = {
  where: GassmaGassmaCommentWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | (K extends "id" | "authorId" | "postId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> & {
    "author"?: { create?: Gassma.RawAllowed<GassmaGassmaUserUse>; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: Gassma.RawAllowed<GassmaGassmaUserUse> }; update?: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | (K extends "id" | "age" ? Gassma.NumberOperation : never) | Gassma.RawValue }>; delete?: true; disconnect?: true };
    "post"?: { create?: Gassma.RawAllowed<GassmaGassmaPostUse>; connect?: GassmaGassmaPostWhereUse; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<GassmaGassmaPostUse> }; update?: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) | Gassma.RawValue }>; delete?: true; disconnect?: true };
  };
  include?: GassmaGassmaCommentInclude;
} & ({ select?: GassmaGassmaCommentSelect; omit?: never } | { select?: never; omit?: GassmaGassmaCommentOmit });

export type GassmaGassmaCategoryUpdateSingleData = {
  where: GassmaGassmaCategoryWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | (K extends "id" | "parentId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> & {
    "posts"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "categoryId">> | Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "categoryId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "categoryId">>[] }; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "categoryId">> } | { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "categoryId">> }[]; update?: { where: GassmaGassmaPostWhereUse; data: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> } | { where: GassmaGassmaPostWhereUse; data: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> }[]; delete?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; deleteMany?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; disconnect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
    "parent"?: { create?: Gassma.RawAllowed<GassmaGassmaCategoryUse>; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: Gassma.RawAllowed<GassmaGassmaCategoryUse> }; update?: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | (K extends "id" | "parentId" ? Gassma.NumberOperation : never) | Gassma.RawValue }>; delete?: true; disconnect?: true };
    "children"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaCategoryUse, "parentId">> | Gassma.RawAllowed<Omit<GassmaGassmaCategoryUse, "parentId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaCategoryUse, "parentId">>[] }; connect?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaCategoryUse, "parentId">> } | { where: GassmaGassmaCategoryWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaCategoryUse, "parentId">> }[]; update?: { where: GassmaGassmaCategoryWhereUse; data: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | (K extends "id" | "parentId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> } | { where: GassmaGassmaCategoryWhereUse; data: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | (K extends "id" | "parentId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> }[]; delete?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; deleteMany?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; disconnect?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; set?: GassmaGassmaCategoryWhereUse[] };
  };
  include?: GassmaGassmaCategoryInclude;
} & ({ select?: GassmaGassmaCategorySelect; omit?: never } | { select?: never; omit?: GassmaGassmaCategoryOmit });

export type GassmaGassmaTagUpdateSingleData = {
  where: GassmaGassmaTagWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaTagUse]: GassmaGassmaTagUse[K] | (K extends "id" ? Gassma.NumberOperation : never) | Gassma.RawValue }> & {
    "posts"?: { create?: Gassma.RawAllowed<GassmaGassmaPostUse> | Gassma.RawAllowed<GassmaGassmaPostUse>[]; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<GassmaGassmaPostUse> } | { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<GassmaGassmaPostUse> }[]; disconnect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
  };
  include?: GassmaGassmaTagInclude;
} & ({ select?: GassmaGassmaTagSelect; omit?: never } | { select?: never; omit?: GassmaGassmaTagOmit });

export type GassmaGassmaSensorReadingUpdateSingleData = {
  where: GassmaGassmaSensorReadingWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaSensorReadingUse]: GassmaGassmaSensorReadingUse[K] | (K extends "id" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  include?: GassmaGassmaSensorReadingInclude;
} & ({ select?: GassmaGassmaSensorReadingSelect; omit?: never } | { select?: never; omit?: GassmaGassmaSensorReadingOmit });

export type GassmaGassmaTimeSlotUpdateSingleData = {
  where: GassmaGassmaTimeSlotWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaTimeSlotUse]: GassmaGassmaTimeSlotUse[K] | (K extends "id" ? Gassma.NumberOperation : never) | Gassma.RawValue }> & {
    "reservations"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaReservationUse, "slotAt">> | Gassma.RawAllowed<Omit<GassmaGassmaReservationUse, "slotAt">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaReservationUse, "slotAt">>[] }; connect?: GassmaGassmaReservationWhereUse | GassmaGassmaReservationWhereUse[]; connectOrCreate?: { where: GassmaGassmaReservationWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaReservationUse, "slotAt">> } | { where: GassmaGassmaReservationWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaReservationUse, "slotAt">> }[]; update?: { where: GassmaGassmaReservationWhereUse; data: Partial<{ [K in keyof GassmaGassmaReservationUse]: GassmaGassmaReservationUse[K] | (K extends "id" ? Gassma.NumberOperation : never) | Gassma.RawValue }> } | { where: GassmaGassmaReservationWhereUse; data: Partial<{ [K in keyof GassmaGassmaReservationUse]: GassmaGassmaReservationUse[K] | (K extends "id" ? Gassma.NumberOperation : never) | Gassma.RawValue }> }[]; delete?: GassmaGassmaReservationWhereUse | GassmaGassmaReservationWhereUse[]; deleteMany?: GassmaGassmaReservationWhereUse | GassmaGassmaReservationWhereUse[]; disconnect?: GassmaGassmaReservationWhereUse | GassmaGassmaReservationWhereUse[]; set?: GassmaGassmaReservationWhereUse[] };
  };
  include?: GassmaGassmaTimeSlotInclude;
} & ({ select?: GassmaGassmaTimeSlotSelect; omit?: never } | { select?: never; omit?: GassmaGassmaTimeSlotOmit });

export type GassmaGassmaReservationUpdateSingleData = {
  where: GassmaGassmaReservationWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaReservationUse]: GassmaGassmaReservationUse[K] | (K extends "id" ? Gassma.NumberOperation : never) | Gassma.RawValue }> & {
    "timeSlot"?: { create?: Gassma.RawAllowed<GassmaGassmaTimeSlotUse>; connect?: GassmaGassmaTimeSlotWhereUse; connectOrCreate?: { where: GassmaGassmaTimeSlotWhereUse; create: Gassma.RawAllowed<GassmaGassmaTimeSlotUse> }; update?: Partial<{ [K in keyof GassmaGassmaTimeSlotUse]: GassmaGassmaTimeSlotUse[K] | (K extends "id" ? Gassma.NumberOperation : never) | Gassma.RawValue }>; delete?: true; disconnect?: true };
  };
  include?: GassmaGassmaReservationInclude;
} & ({ select?: GassmaGassmaReservationSelect; omit?: never } | { select?: never; omit?: GassmaGassmaReservationOmit });

export type GassmaGassmaProductUpdateSingleData = {
  where: GassmaGassmaProductWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaProductUse]: GassmaGassmaProductUse[K] | (K extends "id" | "price" | "stock" ? Gassma.NumberOperation : never) | Gassma.RawValue }> & {
    "orderItems"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "productId">> | Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "productId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "productId">>[] }; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "productId">> } | { where: GassmaGassmaOrderItemWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "productId">> }[]; update?: { where: GassmaGassmaOrderItemWhereUse; data: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | (K extends "id" | "orderId" | "productId" | "quantity" | "unitPrice" ? Gassma.NumberOperation : never) | Gassma.RawValue }> } | { where: GassmaGassmaOrderItemWhereUse; data: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | (K extends "id" | "orderId" | "productId" | "quantity" | "unitPrice" ? Gassma.NumberOperation : never) | Gassma.RawValue }> }[]; delete?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; deleteMany?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; disconnect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; set?: GassmaGassmaOrderItemWhereUse[] };
  };
  include?: GassmaGassmaProductInclude;
} & ({ select?: GassmaGassmaProductSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProductOmit });

export type GassmaGassmaOrderUpdateSingleData = {
  where: GassmaGassmaOrderWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaOrderUse]: GassmaGassmaOrderUse[K] | (K extends "id" | "userId" | "totalAmount" | "quantity" ? Gassma.NumberOperation : never) | Gassma.RawValue }> & {
    "user"?: { create?: Gassma.RawAllowed<GassmaGassmaUserUse>; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: Gassma.RawAllowed<GassmaGassmaUserUse> }; update?: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | (K extends "id" | "age" ? Gassma.NumberOperation : never) | Gassma.RawValue }>; delete?: true; disconnect?: true };
    "items"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "orderId">> | Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "orderId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "orderId">>[] }; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "orderId">> } | { where: GassmaGassmaOrderItemWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "orderId">> }[]; update?: { where: GassmaGassmaOrderItemWhereUse; data: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | (K extends "id" | "orderId" | "productId" | "quantity" | "unitPrice" ? Gassma.NumberOperation : never) | Gassma.RawValue }> } | { where: GassmaGassmaOrderItemWhereUse; data: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | (K extends "id" | "orderId" | "productId" | "quantity" | "unitPrice" ? Gassma.NumberOperation : never) | Gassma.RawValue }> }[]; delete?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; deleteMany?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; disconnect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; set?: GassmaGassmaOrderItemWhereUse[] };
  };
  include?: GassmaGassmaOrderInclude;
} & ({ select?: GassmaGassmaOrderSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderOmit });

export type GassmaGassmaOrderItemUpdateSingleData = {
  where: GassmaGassmaOrderItemWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | (K extends "id" | "orderId" | "productId" | "quantity" | "unitPrice" ? Gassma.NumberOperation : never) | Gassma.RawValue }> & {
    "order"?: { create?: Gassma.RawAllowed<GassmaGassmaOrderUse>; connect?: GassmaGassmaOrderWhereUse; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: Gassma.RawAllowed<GassmaGassmaOrderUse> }; update?: Partial<{ [K in keyof GassmaGassmaOrderUse]: GassmaGassmaOrderUse[K] | (K extends "id" | "userId" | "totalAmount" | "quantity" ? Gassma.NumberOperation : never) | Gassma.RawValue }>; delete?: true; disconnect?: true };
    "product"?: { create?: Gassma.RawAllowed<GassmaGassmaProductUse>; connect?: GassmaGassmaProductWhereUse; connectOrCreate?: { where: GassmaGassmaProductWhereUse; create: Gassma.RawAllowed<GassmaGassmaProductUse> }; update?: Partial<{ [K in keyof GassmaGassmaProductUse]: GassmaGassmaProductUse[K] | (K extends "id" | "price" | "stock" ? Gassma.NumberOperation : never) | Gassma.RawValue }>; delete?: true; disconnect?: true };
  };
  include?: GassmaGassmaOrderItemInclude;
} & ({ select?: GassmaGassmaOrderItemSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderItemOmit });

export type GassmaGassmaFormulaCellUpdateSingleData = {
  where: GassmaGassmaFormulaCellWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaFormulaCellUse]: GassmaGassmaFormulaCellUse[K] | (K extends "id" | "amount" | "total" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  include?: GassmaGassmaFormulaCellInclude;
} & ({ select?: GassmaGassmaFormulaCellSelect; omit?: never } | { select?: never; omit?: GassmaGassmaFormulaCellOmit });

export type GassmaGassmaNotificationUpdateSingleData = {
  where: GassmaGassmaNotificationWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaNotificationUse]: GassmaGassmaNotificationUse[K] | (K extends "id" | "userId" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  include?: GassmaGassmaNotificationInclude;
} & ({ select?: GassmaGassmaNotificationSelect; omit?: never } | { select?: never; omit?: GassmaGassmaNotificationOmit });

export type GassmaGassmaOffsetNoteUpdateSingleData = {
  where: GassmaGassmaOffsetNoteWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaOffsetNoteUse]: GassmaGassmaOffsetNoteUse[K] | (K extends "id" | "value" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  include?: GassmaGassmaOffsetNoteInclude;
} & ({ select?: GassmaGassmaOffsetNoteSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOffsetNoteOmit });

export type GassmaGassmaUserUpdateSingleData = {
  where: GassmaGassmaUserWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | (K extends "id" | "age" ? Gassma.NumberOperation : never) | Gassma.RawValue }> & {
    "posts"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "authorId">> | Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "authorId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "authorId">>[] }; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "authorId">> } | { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "authorId">> }[]; update?: { where: GassmaGassmaPostWhereUse; data: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> } | { where: GassmaGassmaPostWhereUse; data: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> }[]; delete?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; deleteMany?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; disconnect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
    "comments"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "authorId">> | Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "authorId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "authorId">>[] }; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "authorId">> } | { where: GassmaGassmaCommentWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "authorId">> }[]; update?: { where: GassmaGassmaCommentWhereUse; data: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | (K extends "id" | "authorId" | "postId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> } | { where: GassmaGassmaCommentWhereUse; data: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | (K extends "id" | "authorId" | "postId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> }[]; delete?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; deleteMany?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; disconnect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; set?: GassmaGassmaCommentWhereUse[] };
    "orders"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaOrderUse, "userId">> | Gassma.RawAllowed<Omit<GassmaGassmaOrderUse, "userId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaOrderUse, "userId">>[] }; connect?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaOrderUse, "userId">> } | { where: GassmaGassmaOrderWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaOrderUse, "userId">> }[]; update?: { where: GassmaGassmaOrderWhereUse; data: Partial<{ [K in keyof GassmaGassmaOrderUse]: GassmaGassmaOrderUse[K] | (K extends "id" | "userId" | "totalAmount" | "quantity" ? Gassma.NumberOperation : never) | Gassma.RawValue }> } | { where: GassmaGassmaOrderWhereUse; data: Partial<{ [K in keyof GassmaGassmaOrderUse]: GassmaGassmaOrderUse[K] | (K extends "id" | "userId" | "totalAmount" | "quantity" ? Gassma.NumberOperation : never) | Gassma.RawValue }> }[]; delete?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; deleteMany?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; disconnect?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; set?: GassmaGassmaOrderWhereUse[] };
    "profile"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaProfileUse, "userId">>; connect?: GassmaGassmaProfileWhereUse; connectOrCreate?: { where: GassmaGassmaProfileWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaProfileUse, "userId">> }; update?: Partial<{ [K in keyof GassmaGassmaProfileUse]: GassmaGassmaProfileUse[K] | (K extends "id" | "userId" ? Gassma.NumberOperation : never) | Gassma.RawValue }>; delete?: true; disconnect?: true };
  };
  include?: GassmaGassmaUserInclude;
} & ({ select?: GassmaGassmaUserSelect; omit?: never } | { select?: never; omit?: GassmaGassmaUserOmit });

export type GassmaGassmaProfileUpdateSingleData = {
  where: GassmaGassmaProfileWhereUse;
  data: Partial<{ [K in keyof GassmaGassmaProfileUse]: GassmaGassmaProfileUse[K] | (K extends "id" | "userId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> & {
    "user"?: { create?: Gassma.RawAllowed<GassmaGassmaUserUse>; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: Gassma.RawAllowed<GassmaGassmaUserUse> }; update?: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | (K extends "id" | "age" ? Gassma.NumberOperation : never) | Gassma.RawValue }>; delete?: true; disconnect?: true };
  };
  include?: GassmaGassmaProfileInclude;
} & ({ select?: GassmaGassmaProfileSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProfileOmit });

export type GassmaGassmaPostUpsertSingleData = {
  where: GassmaGassmaPostWhereUse;
  create: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "authorId" | "categoryId">> & (Gassma.RawAllowed<Pick<GassmaGassmaPostUse, "authorId">> | { "author": { create?: Gassma.RawAllowed<GassmaGassmaUserUse>; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: Gassma.RawAllowed<GassmaGassmaUserUse> } } }) & (Gassma.RawAllowed<Pick<GassmaGassmaPostUse, "categoryId">> | { "category": { create?: Gassma.RawAllowed<GassmaGassmaCategoryUse>; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: Gassma.RawAllowed<GassmaGassmaCategoryUse> } } }) & {
    "comments"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "postId">> | Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "postId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "postId">>[] }; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "postId">> } | { where: GassmaGassmaCommentWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "postId">> }[] };
    "tags"?: { create?: Gassma.RawAllowed<GassmaGassmaTagUse> | Gassma.RawAllowed<GassmaGassmaTagUse>[]; connect?: GassmaGassmaTagWhereUse | GassmaGassmaTagWhereUse[]; connectOrCreate?: { where: GassmaGassmaTagWhereUse; create: Gassma.RawAllowed<GassmaGassmaTagUse> } | { where: GassmaGassmaTagWhereUse; create: Gassma.RawAllowed<GassmaGassmaTagUse> }[] };
  };
  update: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> & {
    "author"?: { create?: Gassma.RawAllowed<GassmaGassmaUserUse>; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: Gassma.RawAllowed<GassmaGassmaUserUse> }; update?: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | (K extends "id" | "age" ? Gassma.NumberOperation : never) | Gassma.RawValue }>; delete?: true; disconnect?: true };
    "category"?: { create?: Gassma.RawAllowed<GassmaGassmaCategoryUse>; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: Gassma.RawAllowed<GassmaGassmaCategoryUse> }; update?: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | (K extends "id" | "parentId" ? Gassma.NumberOperation : never) | Gassma.RawValue }>; delete?: true; disconnect?: true };
    "comments"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "postId">> | Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "postId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "postId">>[] }; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "postId">> } | { where: GassmaGassmaCommentWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "postId">> }[]; update?: { where: GassmaGassmaCommentWhereUse; data: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | (K extends "id" | "authorId" | "postId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> } | { where: GassmaGassmaCommentWhereUse; data: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | (K extends "id" | "authorId" | "postId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> }[]; delete?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; deleteMany?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; disconnect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; set?: GassmaGassmaCommentWhereUse[] };
    "tags"?: { create?: Gassma.RawAllowed<GassmaGassmaTagUse> | Gassma.RawAllowed<GassmaGassmaTagUse>[]; connect?: GassmaGassmaTagWhereUse | GassmaGassmaTagWhereUse[]; connectOrCreate?: { where: GassmaGassmaTagWhereUse; create: Gassma.RawAllowed<GassmaGassmaTagUse> } | { where: GassmaGassmaTagWhereUse; create: Gassma.RawAllowed<GassmaGassmaTagUse> }[]; disconnect?: GassmaGassmaTagWhereUse | GassmaGassmaTagWhereUse[]; set?: GassmaGassmaTagWhereUse[] };
  };
  include?: GassmaGassmaPostInclude;
} & ({ select?: GassmaGassmaPostSelect; omit?: never } | { select?: never; omit?: GassmaGassmaPostOmit });

export type GassmaGassmaCommentUpsertSingleData = {
  where: GassmaGassmaCommentWhereUse;
  create: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "authorId" | "postId">> & (Gassma.RawAllowed<Pick<GassmaGassmaCommentUse, "authorId">> | { "author": { create?: Gassma.RawAllowed<GassmaGassmaUserUse>; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: Gassma.RawAllowed<GassmaGassmaUserUse> } } }) & (Gassma.RawAllowed<Pick<GassmaGassmaCommentUse, "postId">> | { "post": { create?: Gassma.RawAllowed<GassmaGassmaPostUse>; connect?: GassmaGassmaPostWhereUse; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<GassmaGassmaPostUse> } } });
  update: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | (K extends "id" | "authorId" | "postId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> & {
    "author"?: { create?: Gassma.RawAllowed<GassmaGassmaUserUse>; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: Gassma.RawAllowed<GassmaGassmaUserUse> }; update?: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | (K extends "id" | "age" ? Gassma.NumberOperation : never) | Gassma.RawValue }>; delete?: true; disconnect?: true };
    "post"?: { create?: Gassma.RawAllowed<GassmaGassmaPostUse>; connect?: GassmaGassmaPostWhereUse; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<GassmaGassmaPostUse> }; update?: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) | Gassma.RawValue }>; delete?: true; disconnect?: true };
  };
  include?: GassmaGassmaCommentInclude;
} & ({ select?: GassmaGassmaCommentSelect; omit?: never } | { select?: never; omit?: GassmaGassmaCommentOmit });

export type GassmaGassmaCategoryUpsertSingleData = {
  where: GassmaGassmaCategoryWhereUse;
  create: Gassma.RawAllowed<Omit<GassmaGassmaCategoryUse, "parentId">> & (Gassma.RawAllowed<Pick<GassmaGassmaCategoryUse, "parentId">> | { "parent": { create?: Gassma.RawAllowed<GassmaGassmaCategoryUse>; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: Gassma.RawAllowed<GassmaGassmaCategoryUse> } } }) & {
    "posts"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "categoryId">> | Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "categoryId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "categoryId">>[] }; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "categoryId">> } | { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "categoryId">> }[] };
    "children"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaCategoryUse, "parentId">> | Gassma.RawAllowed<Omit<GassmaGassmaCategoryUse, "parentId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaCategoryUse, "parentId">>[] }; connect?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaCategoryUse, "parentId">> } | { where: GassmaGassmaCategoryWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaCategoryUse, "parentId">> }[] };
  };
  update: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | (K extends "id" | "parentId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> & {
    "posts"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "categoryId">> | Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "categoryId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "categoryId">>[] }; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "categoryId">> } | { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "categoryId">> }[]; update?: { where: GassmaGassmaPostWhereUse; data: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> } | { where: GassmaGassmaPostWhereUse; data: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> }[]; delete?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; deleteMany?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; disconnect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
    "parent"?: { create?: Gassma.RawAllowed<GassmaGassmaCategoryUse>; connect?: GassmaGassmaCategoryWhereUse; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: Gassma.RawAllowed<GassmaGassmaCategoryUse> }; update?: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | (K extends "id" | "parentId" ? Gassma.NumberOperation : never) | Gassma.RawValue }>; delete?: true; disconnect?: true };
    "children"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaCategoryUse, "parentId">> | Gassma.RawAllowed<Omit<GassmaGassmaCategoryUse, "parentId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaCategoryUse, "parentId">>[] }; connect?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; connectOrCreate?: { where: GassmaGassmaCategoryWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaCategoryUse, "parentId">> } | { where: GassmaGassmaCategoryWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaCategoryUse, "parentId">> }[]; update?: { where: GassmaGassmaCategoryWhereUse; data: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | (K extends "id" | "parentId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> } | { where: GassmaGassmaCategoryWhereUse; data: Partial<{ [K in keyof GassmaGassmaCategoryUse]: GassmaGassmaCategoryUse[K] | (K extends "id" | "parentId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> }[]; delete?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; deleteMany?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; disconnect?: GassmaGassmaCategoryWhereUse | GassmaGassmaCategoryWhereUse[]; set?: GassmaGassmaCategoryWhereUse[] };
  };
  include?: GassmaGassmaCategoryInclude;
} & ({ select?: GassmaGassmaCategorySelect; omit?: never } | { select?: never; omit?: GassmaGassmaCategoryOmit });

export type GassmaGassmaTagUpsertSingleData = {
  where: GassmaGassmaTagWhereUse;
  create: Gassma.RawAllowed<GassmaGassmaTagUse> & {
    "posts"?: { create?: Gassma.RawAllowed<GassmaGassmaPostUse> | Gassma.RawAllowed<GassmaGassmaPostUse>[]; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<GassmaGassmaPostUse> } | { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<GassmaGassmaPostUse> }[] };
  };
  update: Partial<{ [K in keyof GassmaGassmaTagUse]: GassmaGassmaTagUse[K] | (K extends "id" ? Gassma.NumberOperation : never) | Gassma.RawValue }> & {
    "posts"?: { create?: Gassma.RawAllowed<GassmaGassmaPostUse> | Gassma.RawAllowed<GassmaGassmaPostUse>[]; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<GassmaGassmaPostUse> } | { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<GassmaGassmaPostUse> }[]; disconnect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
  };
  include?: GassmaGassmaTagInclude;
} & ({ select?: GassmaGassmaTagSelect; omit?: never } | { select?: never; omit?: GassmaGassmaTagOmit });

export type GassmaGassmaSensorReadingUpsertSingleData = {
  where: GassmaGassmaSensorReadingWhereUse;
  create: Gassma.RawAllowed<GassmaGassmaSensorReadingUse>;
  update: Partial<{ [K in keyof GassmaGassmaSensorReadingUse]: GassmaGassmaSensorReadingUse[K] | (K extends "id" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  include?: GassmaGassmaSensorReadingInclude;
} & ({ select?: GassmaGassmaSensorReadingSelect; omit?: never } | { select?: never; omit?: GassmaGassmaSensorReadingOmit });

export type GassmaGassmaTimeSlotUpsertSingleData = {
  where: GassmaGassmaTimeSlotWhereUse;
  create: Gassma.RawAllowed<GassmaGassmaTimeSlotUse> & {
    "reservations"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaReservationUse, "slotAt">> | Gassma.RawAllowed<Omit<GassmaGassmaReservationUse, "slotAt">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaReservationUse, "slotAt">>[] }; connect?: GassmaGassmaReservationWhereUse | GassmaGassmaReservationWhereUse[]; connectOrCreate?: { where: GassmaGassmaReservationWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaReservationUse, "slotAt">> } | { where: GassmaGassmaReservationWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaReservationUse, "slotAt">> }[] };
  };
  update: Partial<{ [K in keyof GassmaGassmaTimeSlotUse]: GassmaGassmaTimeSlotUse[K] | (K extends "id" ? Gassma.NumberOperation : never) | Gassma.RawValue }> & {
    "reservations"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaReservationUse, "slotAt">> | Gassma.RawAllowed<Omit<GassmaGassmaReservationUse, "slotAt">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaReservationUse, "slotAt">>[] }; connect?: GassmaGassmaReservationWhereUse | GassmaGassmaReservationWhereUse[]; connectOrCreate?: { where: GassmaGassmaReservationWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaReservationUse, "slotAt">> } | { where: GassmaGassmaReservationWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaReservationUse, "slotAt">> }[]; update?: { where: GassmaGassmaReservationWhereUse; data: Partial<{ [K in keyof GassmaGassmaReservationUse]: GassmaGassmaReservationUse[K] | (K extends "id" ? Gassma.NumberOperation : never) | Gassma.RawValue }> } | { where: GassmaGassmaReservationWhereUse; data: Partial<{ [K in keyof GassmaGassmaReservationUse]: GassmaGassmaReservationUse[K] | (K extends "id" ? Gassma.NumberOperation : never) | Gassma.RawValue }> }[]; delete?: GassmaGassmaReservationWhereUse | GassmaGassmaReservationWhereUse[]; deleteMany?: GassmaGassmaReservationWhereUse | GassmaGassmaReservationWhereUse[]; disconnect?: GassmaGassmaReservationWhereUse | GassmaGassmaReservationWhereUse[]; set?: GassmaGassmaReservationWhereUse[] };
  };
  include?: GassmaGassmaTimeSlotInclude;
} & ({ select?: GassmaGassmaTimeSlotSelect; omit?: never } | { select?: never; omit?: GassmaGassmaTimeSlotOmit });

export type GassmaGassmaReservationUpsertSingleData = {
  where: GassmaGassmaReservationWhereUse;
  create: Gassma.RawAllowed<Omit<GassmaGassmaReservationUse, "slotAt">> & (Gassma.RawAllowed<Pick<GassmaGassmaReservationUse, "slotAt">> | { "timeSlot": { create?: Gassma.RawAllowed<GassmaGassmaTimeSlotUse>; connect?: GassmaGassmaTimeSlotWhereUse; connectOrCreate?: { where: GassmaGassmaTimeSlotWhereUse; create: Gassma.RawAllowed<GassmaGassmaTimeSlotUse> } } });
  update: Partial<{ [K in keyof GassmaGassmaReservationUse]: GassmaGassmaReservationUse[K] | (K extends "id" ? Gassma.NumberOperation : never) | Gassma.RawValue }> & {
    "timeSlot"?: { create?: Gassma.RawAllowed<GassmaGassmaTimeSlotUse>; connect?: GassmaGassmaTimeSlotWhereUse; connectOrCreate?: { where: GassmaGassmaTimeSlotWhereUse; create: Gassma.RawAllowed<GassmaGassmaTimeSlotUse> }; update?: Partial<{ [K in keyof GassmaGassmaTimeSlotUse]: GassmaGassmaTimeSlotUse[K] | (K extends "id" ? Gassma.NumberOperation : never) | Gassma.RawValue }>; delete?: true; disconnect?: true };
  };
  include?: GassmaGassmaReservationInclude;
} & ({ select?: GassmaGassmaReservationSelect; omit?: never } | { select?: never; omit?: GassmaGassmaReservationOmit });

export type GassmaGassmaProductUpsertSingleData = {
  where: GassmaGassmaProductWhereUse;
  create: Gassma.RawAllowed<GassmaGassmaProductUse> & {
    "orderItems"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "productId">> | Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "productId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "productId">>[] }; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "productId">> } | { where: GassmaGassmaOrderItemWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "productId">> }[] };
  };
  update: Partial<{ [K in keyof GassmaGassmaProductUse]: GassmaGassmaProductUse[K] | (K extends "id" | "price" | "stock" ? Gassma.NumberOperation : never) | Gassma.RawValue }> & {
    "orderItems"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "productId">> | Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "productId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "productId">>[] }; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "productId">> } | { where: GassmaGassmaOrderItemWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "productId">> }[]; update?: { where: GassmaGassmaOrderItemWhereUse; data: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | (K extends "id" | "orderId" | "productId" | "quantity" | "unitPrice" ? Gassma.NumberOperation : never) | Gassma.RawValue }> } | { where: GassmaGassmaOrderItemWhereUse; data: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | (K extends "id" | "orderId" | "productId" | "quantity" | "unitPrice" ? Gassma.NumberOperation : never) | Gassma.RawValue }> }[]; delete?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; deleteMany?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; disconnect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; set?: GassmaGassmaOrderItemWhereUse[] };
  };
  include?: GassmaGassmaProductInclude;
} & ({ select?: GassmaGassmaProductSelect; omit?: never } | { select?: never; omit?: GassmaGassmaProductOmit });

export type GassmaGassmaOrderUpsertSingleData = {
  where: GassmaGassmaOrderWhereUse;
  create: Gassma.RawAllowed<Omit<GassmaGassmaOrderUse, "userId">> & (Gassma.RawAllowed<Pick<GassmaGassmaOrderUse, "userId">> | { "user": { create?: Gassma.RawAllowed<GassmaGassmaUserUse>; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: Gassma.RawAllowed<GassmaGassmaUserUse> } } }) & {
    "items"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "orderId">> | Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "orderId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "orderId">>[] }; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "orderId">> } | { where: GassmaGassmaOrderItemWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "orderId">> }[] };
  };
  update: Partial<{ [K in keyof GassmaGassmaOrderUse]: GassmaGassmaOrderUse[K] | (K extends "id" | "userId" | "totalAmount" | "quantity" ? Gassma.NumberOperation : never) | Gassma.RawValue }> & {
    "user"?: { create?: Gassma.RawAllowed<GassmaGassmaUserUse>; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: Gassma.RawAllowed<GassmaGassmaUserUse> }; update?: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | (K extends "id" | "age" ? Gassma.NumberOperation : never) | Gassma.RawValue }>; delete?: true; disconnect?: true };
    "items"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "orderId">> | Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "orderId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "orderId">>[] }; connect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderItemWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "orderId">> } | { where: GassmaGassmaOrderItemWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "orderId">> }[]; update?: { where: GassmaGassmaOrderItemWhereUse; data: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | (K extends "id" | "orderId" | "productId" | "quantity" | "unitPrice" ? Gassma.NumberOperation : never) | Gassma.RawValue }> } | { where: GassmaGassmaOrderItemWhereUse; data: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | (K extends "id" | "orderId" | "productId" | "quantity" | "unitPrice" ? Gassma.NumberOperation : never) | Gassma.RawValue }> }[]; delete?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; deleteMany?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; disconnect?: GassmaGassmaOrderItemWhereUse | GassmaGassmaOrderItemWhereUse[]; set?: GassmaGassmaOrderItemWhereUse[] };
  };
  include?: GassmaGassmaOrderInclude;
} & ({ select?: GassmaGassmaOrderSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderOmit });

export type GassmaGassmaOrderItemUpsertSingleData = {
  where: GassmaGassmaOrderItemWhereUse;
  create: Gassma.RawAllowed<Omit<GassmaGassmaOrderItemUse, "orderId" | "productId">> & (Gassma.RawAllowed<Pick<GassmaGassmaOrderItemUse, "orderId">> | { "order": { create?: Gassma.RawAllowed<GassmaGassmaOrderUse>; connect?: GassmaGassmaOrderWhereUse; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: Gassma.RawAllowed<GassmaGassmaOrderUse> } } }) & (Gassma.RawAllowed<Pick<GassmaGassmaOrderItemUse, "productId">> | { "product": { create?: Gassma.RawAllowed<GassmaGassmaProductUse>; connect?: GassmaGassmaProductWhereUse; connectOrCreate?: { where: GassmaGassmaProductWhereUse; create: Gassma.RawAllowed<GassmaGassmaProductUse> } } });
  update: Partial<{ [K in keyof GassmaGassmaOrderItemUse]: GassmaGassmaOrderItemUse[K] | (K extends "id" | "orderId" | "productId" | "quantity" | "unitPrice" ? Gassma.NumberOperation : never) | Gassma.RawValue }> & {
    "order"?: { create?: Gassma.RawAllowed<GassmaGassmaOrderUse>; connect?: GassmaGassmaOrderWhereUse; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: Gassma.RawAllowed<GassmaGassmaOrderUse> }; update?: Partial<{ [K in keyof GassmaGassmaOrderUse]: GassmaGassmaOrderUse[K] | (K extends "id" | "userId" | "totalAmount" | "quantity" ? Gassma.NumberOperation : never) | Gassma.RawValue }>; delete?: true; disconnect?: true };
    "product"?: { create?: Gassma.RawAllowed<GassmaGassmaProductUse>; connect?: GassmaGassmaProductWhereUse; connectOrCreate?: { where: GassmaGassmaProductWhereUse; create: Gassma.RawAllowed<GassmaGassmaProductUse> }; update?: Partial<{ [K in keyof GassmaGassmaProductUse]: GassmaGassmaProductUse[K] | (K extends "id" | "price" | "stock" ? Gassma.NumberOperation : never) | Gassma.RawValue }>; delete?: true; disconnect?: true };
  };
  include?: GassmaGassmaOrderItemInclude;
} & ({ select?: GassmaGassmaOrderItemSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOrderItemOmit });

export type GassmaGassmaFormulaCellUpsertSingleData = {
  where: GassmaGassmaFormulaCellWhereUse;
  create: Gassma.RawAllowed<GassmaGassmaFormulaCellUse>;
  update: Partial<{ [K in keyof GassmaGassmaFormulaCellUse]: GassmaGassmaFormulaCellUse[K] | (K extends "id" | "amount" | "total" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  include?: GassmaGassmaFormulaCellInclude;
} & ({ select?: GassmaGassmaFormulaCellSelect; omit?: never } | { select?: never; omit?: GassmaGassmaFormulaCellOmit });

export type GassmaGassmaNotificationUpsertSingleData = {
  where: GassmaGassmaNotificationWhereUse;
  create: Gassma.RawAllowed<GassmaGassmaNotificationUse>;
  update: Partial<{ [K in keyof GassmaGassmaNotificationUse]: GassmaGassmaNotificationUse[K] | (K extends "id" | "userId" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  include?: GassmaGassmaNotificationInclude;
} & ({ select?: GassmaGassmaNotificationSelect; omit?: never } | { select?: never; omit?: GassmaGassmaNotificationOmit });

export type GassmaGassmaOffsetNoteUpsertSingleData = {
  where: GassmaGassmaOffsetNoteWhereUse;
  create: Gassma.RawAllowed<GassmaGassmaOffsetNoteUse>;
  update: Partial<{ [K in keyof GassmaGassmaOffsetNoteUse]: GassmaGassmaOffsetNoteUse[K] | (K extends "id" | "value" ? Gassma.NumberOperation : never) | Gassma.RawValue }>;
  include?: GassmaGassmaOffsetNoteInclude;
} & ({ select?: GassmaGassmaOffsetNoteSelect; omit?: never } | { select?: never; omit?: GassmaGassmaOffsetNoteOmit });

export type GassmaGassmaUserUpsertSingleData = {
  where: GassmaGassmaUserWhereUse;
  create: Gassma.RawAllowed<GassmaGassmaUserUse> & {
    "posts"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "authorId">> | Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "authorId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "authorId">>[] }; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "authorId">> } | { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "authorId">> }[] };
    "comments"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "authorId">> | Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "authorId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "authorId">>[] }; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "authorId">> } | { where: GassmaGassmaCommentWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "authorId">> }[] };
    "orders"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaOrderUse, "userId">> | Gassma.RawAllowed<Omit<GassmaGassmaOrderUse, "userId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaOrderUse, "userId">>[] }; connect?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaOrderUse, "userId">> } | { where: GassmaGassmaOrderWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaOrderUse, "userId">> }[] };
    "profile"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaProfileUse, "userId">>; connect?: GassmaGassmaProfileWhereUse; connectOrCreate?: { where: GassmaGassmaProfileWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaProfileUse, "userId">> } };
  };
  update: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | (K extends "id" | "age" ? Gassma.NumberOperation : never) | Gassma.RawValue }> & {
    "posts"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "authorId">> | Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "authorId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "authorId">>[] }; connect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; connectOrCreate?: { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "authorId">> } | { where: GassmaGassmaPostWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaPostUse, "authorId">> }[]; update?: { where: GassmaGassmaPostWhereUse; data: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> } | { where: GassmaGassmaPostWhereUse; data: Partial<{ [K in keyof GassmaGassmaPostUse]: GassmaGassmaPostUse[K] | (K extends "id" | "content" | "viewCount" | "rating" | "authorId" | "categoryId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> }[]; delete?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; deleteMany?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; disconnect?: GassmaGassmaPostWhereUse | GassmaGassmaPostWhereUse[]; set?: GassmaGassmaPostWhereUse[] };
    "comments"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "authorId">> | Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "authorId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "authorId">>[] }; connect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; connectOrCreate?: { where: GassmaGassmaCommentWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "authorId">> } | { where: GassmaGassmaCommentWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaCommentUse, "authorId">> }[]; update?: { where: GassmaGassmaCommentWhereUse; data: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | (K extends "id" | "authorId" | "postId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> } | { where: GassmaGassmaCommentWhereUse; data: Partial<{ [K in keyof GassmaGassmaCommentUse]: GassmaGassmaCommentUse[K] | (K extends "id" | "authorId" | "postId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> }[]; delete?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; deleteMany?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; disconnect?: GassmaGassmaCommentWhereUse | GassmaGassmaCommentWhereUse[]; set?: GassmaGassmaCommentWhereUse[] };
    "orders"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaOrderUse, "userId">> | Gassma.RawAllowed<Omit<GassmaGassmaOrderUse, "userId">>[]; createMany?: { data: Gassma.RawAllowed<Omit<GassmaGassmaOrderUse, "userId">>[] }; connect?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; connectOrCreate?: { where: GassmaGassmaOrderWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaOrderUse, "userId">> } | { where: GassmaGassmaOrderWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaOrderUse, "userId">> }[]; update?: { where: GassmaGassmaOrderWhereUse; data: Partial<{ [K in keyof GassmaGassmaOrderUse]: GassmaGassmaOrderUse[K] | (K extends "id" | "userId" | "totalAmount" | "quantity" ? Gassma.NumberOperation : never) | Gassma.RawValue }> } | { where: GassmaGassmaOrderWhereUse; data: Partial<{ [K in keyof GassmaGassmaOrderUse]: GassmaGassmaOrderUse[K] | (K extends "id" | "userId" | "totalAmount" | "quantity" ? Gassma.NumberOperation : never) | Gassma.RawValue }> }[]; delete?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; deleteMany?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; disconnect?: GassmaGassmaOrderWhereUse | GassmaGassmaOrderWhereUse[]; set?: GassmaGassmaOrderWhereUse[] };
    "profile"?: { create?: Gassma.RawAllowed<Omit<GassmaGassmaProfileUse, "userId">>; connect?: GassmaGassmaProfileWhereUse; connectOrCreate?: { where: GassmaGassmaProfileWhereUse; create: Gassma.RawAllowed<Omit<GassmaGassmaProfileUse, "userId">> }; update?: Partial<{ [K in keyof GassmaGassmaProfileUse]: GassmaGassmaProfileUse[K] | (K extends "id" | "userId" ? Gassma.NumberOperation : never) | Gassma.RawValue }>; delete?: true; disconnect?: true };
  };
  include?: GassmaGassmaUserInclude;
} & ({ select?: GassmaGassmaUserSelect; omit?: never } | { select?: never; omit?: GassmaGassmaUserOmit });

export type GassmaGassmaProfileUpsertSingleData = {
  where: GassmaGassmaProfileWhereUse;
  create: Gassma.RawAllowed<Omit<GassmaGassmaProfileUse, "userId">> & (Gassma.RawAllowed<Pick<GassmaGassmaProfileUse, "userId">> | { "user": { create?: Gassma.RawAllowed<GassmaGassmaUserUse>; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: Gassma.RawAllowed<GassmaGassmaUserUse> } } });
  update: Partial<{ [K in keyof GassmaGassmaProfileUse]: GassmaGassmaProfileUse[K] | (K extends "id" | "userId" ? Gassma.NumberOperation : never) | Gassma.RawValue }> & {
    "user"?: { create?: Gassma.RawAllowed<GassmaGassmaUserUse>; connect?: GassmaGassmaUserWhereUse; connectOrCreate?: { where: GassmaGassmaUserWhereUse; create: Gassma.RawAllowed<GassmaGassmaUserUse> }; update?: Partial<{ [K in keyof GassmaGassmaUserUse]: GassmaGassmaUserUse[K] | (K extends "id" | "age" ? Gassma.NumberOperation : never) | Gassma.RawValue }>; delete?: true; disconnect?: true };
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

export type GassmaGassmaSensorReadingDeleteData = {
  where?: GassmaGassmaSensorReadingWhereUse;
  limit?: number;
};

export type GassmaGassmaTimeSlotDeleteData = {
  where?: GassmaGassmaTimeSlotWhereUse;
  limit?: number;
};

export type GassmaGassmaReservationDeleteData = {
  where?: GassmaGassmaReservationWhereUse;
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

export type GassmaGassmaSensorReadingDeleteSingleData = {
  where: GassmaGassmaSensorReadingWhereUse;
  include?: GassmaGassmaSensorReadingInclude;
} & ({ select?: GassmaGassmaSensorReadingSelect; omit?: never } | { select?: never; omit?: GassmaGassmaSensorReadingOmit });

export type GassmaGassmaTimeSlotDeleteSingleData = {
  where: GassmaGassmaTimeSlotWhereUse;
  include?: GassmaGassmaTimeSlotInclude;
} & ({ select?: GassmaGassmaTimeSlotSelect; omit?: never } | { select?: never; omit?: GassmaGassmaTimeSlotOmit });

export type GassmaGassmaReservationDeleteSingleData = {
  where: GassmaGassmaReservationWhereUse;
  include?: GassmaGassmaReservationInclude;
} & ({ select?: GassmaGassmaReservationSelect; omit?: never } | { select?: never; omit?: GassmaGassmaReservationOmit });

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
  _count?: GassmaGassmaPostCountSelect | true;
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
  _count?: GassmaGassmaCommentCountSelect | true;
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
  _count?: GassmaGassmaCategoryCountSelect | true;
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
  _count?: GassmaGassmaTagCountSelect | true;
  _max?: GassmaGassmaTagSelect;
  _min?: GassmaGassmaTagSelect;
  _sum?: GassmaGassmaTagNumberSelect;
};

export type GassmaGassmaSensorReadingAggregateData = {
  where?: GassmaGassmaSensorReadingWhereUse;
  orderBy?: GassmaGassmaSensorReadingOrderBy | GassmaGassmaSensorReadingOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaSensorReadingUse>;
  _avg?: GassmaGassmaSensorReadingNumberSelect;
  _count?: GassmaGassmaSensorReadingCountSelect | true;
  _max?: GassmaGassmaSensorReadingSelect;
  _min?: GassmaGassmaSensorReadingSelect;
  _sum?: GassmaGassmaSensorReadingNumberSelect;
};

export type GassmaGassmaTimeSlotAggregateData = {
  where?: GassmaGassmaTimeSlotWhereUse;
  orderBy?: GassmaGassmaTimeSlotOrderBy | GassmaGassmaTimeSlotOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaTimeSlotUse>;
  _avg?: GassmaGassmaTimeSlotNumberSelect;
  _count?: GassmaGassmaTimeSlotCountSelect | true;
  _max?: GassmaGassmaTimeSlotSelect;
  _min?: GassmaGassmaTimeSlotSelect;
  _sum?: GassmaGassmaTimeSlotNumberSelect;
};

export type GassmaGassmaReservationAggregateData = {
  where?: GassmaGassmaReservationWhereUse;
  orderBy?: GassmaGassmaReservationOrderBy | GassmaGassmaReservationOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaReservationUse>;
  _avg?: GassmaGassmaReservationNumberSelect;
  _count?: GassmaGassmaReservationCountSelect | true;
  _max?: GassmaGassmaReservationSelect;
  _min?: GassmaGassmaReservationSelect;
  _sum?: GassmaGassmaReservationNumberSelect;
};

export type GassmaGassmaProductAggregateData = {
  where?: GassmaGassmaProductWhereUse;
  orderBy?: GassmaGassmaProductOrderBy | GassmaGassmaProductOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaProductUse>;
  _avg?: GassmaGassmaProductNumberSelect;
  _count?: GassmaGassmaProductCountSelect | true;
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
  _count?: GassmaGassmaOrderCountSelect | true;
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
  _count?: GassmaGassmaOrderItemCountSelect | true;
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
  _count?: GassmaGassmaFormulaCellCountSelect | true;
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
  _count?: GassmaGassmaNotificationCountSelect | true;
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
  _count?: GassmaGassmaOffsetNoteCountSelect | true;
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
  _count?: GassmaGassmaUserCountSelect | true;
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
  _count?: GassmaGassmaProfileCountSelect | true;
  _max?: GassmaGassmaProfileSelect;
  _min?: GassmaGassmaProfileSelect;
  _sum?: GassmaGassmaProfileNumberSelect;
};

export type GassmaGassmaPostGroupByData = Omit<GassmaGassmaPostAggregateData, "cursor" | "orderBy"> & {
  by: "id" | "title" | "content" | "published" | "viewCount" | "rating" | "authorId" | "categoryId" | "createdAt" | "updatedAt" | ("id" | "title" | "content" | "published" | "viewCount" | "rating" | "authorId" | "categoryId" | "createdAt" | "updatedAt")[];
  orderBy?: GassmaGassmaPostOrderByWithAggregation | GassmaGassmaPostOrderByWithAggregation[];
  having?: GassmaGassmaPostHavingUse;
};

export type GassmaGassmaCommentGroupByData = Omit<GassmaGassmaCommentAggregateData, "cursor" | "orderBy"> & {
  by: "id" | "text" | "authorId" | "postId" | "createdAt" | ("id" | "text" | "authorId" | "postId" | "createdAt")[];
  orderBy?: GassmaGassmaCommentOrderByWithAggregation | GassmaGassmaCommentOrderByWithAggregation[];
  having?: GassmaGassmaCommentHavingUse;
};

export type GassmaGassmaCategoryGroupByData = Omit<GassmaGassmaCategoryAggregateData, "cursor" | "orderBy"> & {
  by: "id" | "name" | "parentId" | ("id" | "name" | "parentId")[];
  orderBy?: GassmaGassmaCategoryOrderByWithAggregation | GassmaGassmaCategoryOrderByWithAggregation[];
  having?: GassmaGassmaCategoryHavingUse;
};

export type GassmaGassmaTagGroupByData = Omit<GassmaGassmaTagAggregateData, "cursor" | "orderBy"> & {
  by: "id" | "name" | ("id" | "name")[];
  orderBy?: GassmaGassmaTagOrderByWithAggregation | GassmaGassmaTagOrderByWithAggregation[];
  having?: GassmaGassmaTagHavingUse;
};

export type GassmaGassmaSensorReadingGroupByData = Omit<GassmaGassmaSensorReadingAggregateData, "cursor" | "orderBy"> & {
  by: "id" | "sensorName" | "recordedAt" | ("id" | "sensorName" | "recordedAt")[];
  orderBy?: GassmaGassmaSensorReadingOrderByWithAggregation | GassmaGassmaSensorReadingOrderByWithAggregation[];
  having?: GassmaGassmaSensorReadingHavingUse;
};

export type GassmaGassmaTimeSlotGroupByData = Omit<GassmaGassmaTimeSlotAggregateData, "cursor" | "orderBy"> & {
  by: "id" | "label" | "slotAt" | ("id" | "label" | "slotAt")[];
  orderBy?: GassmaGassmaTimeSlotOrderByWithAggregation | GassmaGassmaTimeSlotOrderByWithAggregation[];
  having?: GassmaGassmaTimeSlotHavingUse;
};

export type GassmaGassmaReservationGroupByData = Omit<GassmaGassmaReservationAggregateData, "cursor" | "orderBy"> & {
  by: "id" | "guestName" | "slotAt" | ("id" | "guestName" | "slotAt")[];
  orderBy?: GassmaGassmaReservationOrderByWithAggregation | GassmaGassmaReservationOrderByWithAggregation[];
  having?: GassmaGassmaReservationHavingUse;
};

export type GassmaGassmaProductGroupByData = Omit<GassmaGassmaProductAggregateData, "cursor" | "orderBy"> & {
  by: "id" | "name" | "price" | "stock" | "status" | "createdAt" | "updatedAt" | ("id" | "name" | "price" | "stock" | "status" | "createdAt" | "updatedAt")[];
  orderBy?: GassmaGassmaProductOrderByWithAggregation | GassmaGassmaProductOrderByWithAggregation[];
  having?: GassmaGassmaProductHavingUse;
};

export type GassmaGassmaOrderGroupByData = Omit<GassmaGassmaOrderAggregateData, "cursor" | "orderBy"> & {
  by: "id" | "userId" | "totalAmount" | "quantity" | "status" | "createdAt" | ("id" | "userId" | "totalAmount" | "quantity" | "status" | "createdAt")[];
  orderBy?: GassmaGassmaOrderOrderByWithAggregation | GassmaGassmaOrderOrderByWithAggregation[];
  having?: GassmaGassmaOrderHavingUse;
};

export type GassmaGassmaOrderItemGroupByData = Omit<GassmaGassmaOrderItemAggregateData, "cursor" | "orderBy"> & {
  by: "id" | "orderId" | "productId" | "quantity" | "unitPrice" | ("id" | "orderId" | "productId" | "quantity" | "unitPrice")[];
  orderBy?: GassmaGassmaOrderItemOrderByWithAggregation | GassmaGassmaOrderItemOrderByWithAggregation[];
  having?: GassmaGassmaOrderItemHavingUse;
};

export type GassmaGassmaFormulaCellGroupByData = Omit<GassmaGassmaFormulaCellAggregateData, "cursor" | "orderBy"> & {
  by: "id" | "label" | "amount" | "total" | ("id" | "label" | "amount" | "total")[];
  orderBy?: GassmaGassmaFormulaCellOrderByWithAggregation | GassmaGassmaFormulaCellOrderByWithAggregation[];
  having?: GassmaGassmaFormulaCellHavingUse;
};

export type GassmaGassmaNotificationGroupByData = Omit<GassmaGassmaNotificationAggregateData, "cursor" | "orderBy"> & {
  by: "id" | "userId" | "message" | "isRead" | ("id" | "userId" | "message" | "isRead")[];
  orderBy?: GassmaGassmaNotificationOrderByWithAggregation | GassmaGassmaNotificationOrderByWithAggregation[];
  having?: GassmaGassmaNotificationHavingUse;
};

export type GassmaGassmaOffsetNoteGroupByData = Omit<GassmaGassmaOffsetNoteAggregateData, "cursor" | "orderBy"> & {
  by: "id" | "title" | "value" | ("id" | "title" | "value")[];
  orderBy?: GassmaGassmaOffsetNoteOrderByWithAggregation | GassmaGassmaOffsetNoteOrderByWithAggregation[];
  having?: GassmaGassmaOffsetNoteHavingUse;
};

export type GassmaGassmaUserGroupByData = Omit<GassmaGassmaUserAggregateData, "cursor" | "orderBy"> & {
  by: "id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt" | ("id" | "email" | "name" | "age" | "isActive" | "role" | "createdAt")[];
  orderBy?: GassmaGassmaUserOrderByWithAggregation | GassmaGassmaUserOrderByWithAggregation[];
  having?: GassmaGassmaUserHavingUse;
};

export type GassmaGassmaProfileGroupByData = Omit<GassmaGassmaProfileAggregateData, "cursor" | "orderBy"> & {
  by: "id" | "bio" | "website" | "userId" | ("id" | "bio" | "website" | "userId")[];
  orderBy?: GassmaGassmaProfileOrderByWithAggregation | GassmaGassmaProfileOrderByWithAggregation[];
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

export type GassmaGassmaSensorReadingInclude = {};

export type GassmaGassmaTimeSlotInclude = {
  "reservations"?: true | { select?: GassmaGassmaReservationFindSelect; omit?: GassmaGassmaReservationOmit; where?: GassmaGassmaReservationWhereUse; orderBy?: GassmaGassmaReservationOrderBy | GassmaGassmaReservationOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaReservationInclude; _count?: GassmaGassmaReservationCountValue };
  "_count"?: GassmaGassmaTimeSlotCountValue;
};

export type GassmaGassmaReservationInclude = {
  "timeSlot"?: true | { select?: GassmaGassmaTimeSlotFindSelect; omit?: GassmaGassmaTimeSlotOmit; where?: GassmaGassmaTimeSlotWhereUse; orderBy?: GassmaGassmaTimeSlotOrderBy | GassmaGassmaTimeSlotOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaTimeSlotInclude; _count?: GassmaGassmaTimeSlotCountValue };
  "_count"?: GassmaGassmaReservationCountValue;
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

export type GassmaGassmaSensorReadingCountValue = true;

export type GassmaGassmaTimeSlotCountValue = true | { select: {
    "reservations"?: true | { where?: GassmaGassmaReservationWhereUse };
  } };

export type GassmaGassmaReservationCountValue = true | { select: {
    "timeSlot"?: true | { where?: GassmaGassmaTimeSlotWhereUse };
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

export type GassmaGassmaSensorReadingOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "sensorName"?: "asc" | "desc" | Gassma.SortOrderInput;
  "recordedAt"?: "asc" | "desc" | Gassma.SortOrderInput;
};

export type GassmaGassmaTimeSlotOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "label"?: "asc" | "desc" | Gassma.SortOrderInput;
  "slotAt"?: "asc" | "desc" | Gassma.SortOrderInput;
  "reservations"?: GassmaGassmaReservationOrderBy | { _count: "asc" | "desc" };
  "_count"?: { "reservations"?: "asc" | "desc" };
};

export type GassmaGassmaReservationOrderBy = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "guestName"?: "asc" | "desc" | Gassma.SortOrderInput;
  "slotAt"?: "asc" | "desc" | Gassma.SortOrderInput;
  "timeSlot"?: GassmaGassmaTimeSlotOrderBy | { _count: "asc" | "desc" };
  "_count"?: { "timeSlot"?: "asc" | "desc" };
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

export type GassmaGassmaPostOrderByWithAggregation = {
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
  "_avg"?: { "id"?: "asc" | "desc"; "content"?: "asc" | "desc"; "viewCount"?: "asc" | "desc"; "rating"?: "asc" | "desc"; "authorId"?: "asc" | "desc"; "categoryId"?: "asc" | "desc" };
  "_count"?: { "id"?: "asc" | "desc"; "title"?: "asc" | "desc"; "content"?: "asc" | "desc"; "published"?: "asc" | "desc"; "viewCount"?: "asc" | "desc"; "rating"?: "asc" | "desc"; "authorId"?: "asc" | "desc"; "categoryId"?: "asc" | "desc"; "createdAt"?: "asc" | "desc"; "updatedAt"?: "asc" | "desc" };
  "_max"?: { "id"?: "asc" | "desc"; "title"?: "asc" | "desc"; "content"?: "asc" | "desc"; "published"?: "asc" | "desc"; "viewCount"?: "asc" | "desc"; "rating"?: "asc" | "desc"; "authorId"?: "asc" | "desc"; "categoryId"?: "asc" | "desc"; "createdAt"?: "asc" | "desc"; "updatedAt"?: "asc" | "desc" };
  "_min"?: { "id"?: "asc" | "desc"; "title"?: "asc" | "desc"; "content"?: "asc" | "desc"; "published"?: "asc" | "desc"; "viewCount"?: "asc" | "desc"; "rating"?: "asc" | "desc"; "authorId"?: "asc" | "desc"; "categoryId"?: "asc" | "desc"; "createdAt"?: "asc" | "desc"; "updatedAt"?: "asc" | "desc" };
  "_sum"?: { "id"?: "asc" | "desc"; "content"?: "asc" | "desc"; "viewCount"?: "asc" | "desc"; "rating"?: "asc" | "desc"; "authorId"?: "asc" | "desc"; "categoryId"?: "asc" | "desc" };
};

export type GassmaGassmaCommentOrderByWithAggregation = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "text"?: "asc" | "desc" | Gassma.SortOrderInput;
  "authorId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "postId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "createdAt"?: "asc" | "desc" | Gassma.SortOrderInput;
  "_avg"?: { "id"?: "asc" | "desc"; "authorId"?: "asc" | "desc"; "postId"?: "asc" | "desc" };
  "_count"?: { "id"?: "asc" | "desc"; "text"?: "asc" | "desc"; "authorId"?: "asc" | "desc"; "postId"?: "asc" | "desc"; "createdAt"?: "asc" | "desc" };
  "_max"?: { "id"?: "asc" | "desc"; "text"?: "asc" | "desc"; "authorId"?: "asc" | "desc"; "postId"?: "asc" | "desc"; "createdAt"?: "asc" | "desc" };
  "_min"?: { "id"?: "asc" | "desc"; "text"?: "asc" | "desc"; "authorId"?: "asc" | "desc"; "postId"?: "asc" | "desc"; "createdAt"?: "asc" | "desc" };
  "_sum"?: { "id"?: "asc" | "desc"; "authorId"?: "asc" | "desc"; "postId"?: "asc" | "desc" };
};

export type GassmaGassmaCategoryOrderByWithAggregation = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "name"?: "asc" | "desc" | Gassma.SortOrderInput;
  "parentId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "_avg"?: { "id"?: "asc" | "desc"; "parentId"?: "asc" | "desc" };
  "_count"?: { "id"?: "asc" | "desc"; "name"?: "asc" | "desc"; "parentId"?: "asc" | "desc" };
  "_max"?: { "id"?: "asc" | "desc"; "name"?: "asc" | "desc"; "parentId"?: "asc" | "desc" };
  "_min"?: { "id"?: "asc" | "desc"; "name"?: "asc" | "desc"; "parentId"?: "asc" | "desc" };
  "_sum"?: { "id"?: "asc" | "desc"; "parentId"?: "asc" | "desc" };
};

export type GassmaGassmaTagOrderByWithAggregation = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "name"?: "asc" | "desc" | Gassma.SortOrderInput;
  "_avg"?: { "id"?: "asc" | "desc" };
  "_count"?: { "id"?: "asc" | "desc"; "name"?: "asc" | "desc" };
  "_max"?: { "id"?: "asc" | "desc"; "name"?: "asc" | "desc" };
  "_min"?: { "id"?: "asc" | "desc"; "name"?: "asc" | "desc" };
  "_sum"?: { "id"?: "asc" | "desc" };
};

export type GassmaGassmaSensorReadingOrderByWithAggregation = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "sensorName"?: "asc" | "desc" | Gassma.SortOrderInput;
  "recordedAt"?: "asc" | "desc" | Gassma.SortOrderInput;
  "_avg"?: { "id"?: "asc" | "desc" };
  "_count"?: { "id"?: "asc" | "desc"; "sensorName"?: "asc" | "desc"; "recordedAt"?: "asc" | "desc" };
  "_max"?: { "id"?: "asc" | "desc"; "sensorName"?: "asc" | "desc"; "recordedAt"?: "asc" | "desc" };
  "_min"?: { "id"?: "asc" | "desc"; "sensorName"?: "asc" | "desc"; "recordedAt"?: "asc" | "desc" };
  "_sum"?: { "id"?: "asc" | "desc" };
};

export type GassmaGassmaTimeSlotOrderByWithAggregation = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "label"?: "asc" | "desc" | Gassma.SortOrderInput;
  "slotAt"?: "asc" | "desc" | Gassma.SortOrderInput;
  "_avg"?: { "id"?: "asc" | "desc" };
  "_count"?: { "id"?: "asc" | "desc"; "label"?: "asc" | "desc"; "slotAt"?: "asc" | "desc" };
  "_max"?: { "id"?: "asc" | "desc"; "label"?: "asc" | "desc"; "slotAt"?: "asc" | "desc" };
  "_min"?: { "id"?: "asc" | "desc"; "label"?: "asc" | "desc"; "slotAt"?: "asc" | "desc" };
  "_sum"?: { "id"?: "asc" | "desc" };
};

export type GassmaGassmaReservationOrderByWithAggregation = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "guestName"?: "asc" | "desc" | Gassma.SortOrderInput;
  "slotAt"?: "asc" | "desc" | Gassma.SortOrderInput;
  "_avg"?: { "id"?: "asc" | "desc" };
  "_count"?: { "id"?: "asc" | "desc"; "guestName"?: "asc" | "desc"; "slotAt"?: "asc" | "desc" };
  "_max"?: { "id"?: "asc" | "desc"; "guestName"?: "asc" | "desc"; "slotAt"?: "asc" | "desc" };
  "_min"?: { "id"?: "asc" | "desc"; "guestName"?: "asc" | "desc"; "slotAt"?: "asc" | "desc" };
  "_sum"?: { "id"?: "asc" | "desc" };
};

export type GassmaGassmaProductOrderByWithAggregation = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "name"?: "asc" | "desc" | Gassma.SortOrderInput;
  "price"?: "asc" | "desc" | Gassma.SortOrderInput;
  "stock"?: "asc" | "desc" | Gassma.SortOrderInput;
  "status"?: "asc" | "desc" | Gassma.SortOrderInput;
  "createdAt"?: "asc" | "desc" | Gassma.SortOrderInput;
  "updatedAt"?: "asc" | "desc" | Gassma.SortOrderInput;
  "_avg"?: { "id"?: "asc" | "desc"; "price"?: "asc" | "desc"; "stock"?: "asc" | "desc" };
  "_count"?: { "id"?: "asc" | "desc"; "name"?: "asc" | "desc"; "price"?: "asc" | "desc"; "stock"?: "asc" | "desc"; "status"?: "asc" | "desc"; "createdAt"?: "asc" | "desc"; "updatedAt"?: "asc" | "desc" };
  "_max"?: { "id"?: "asc" | "desc"; "name"?: "asc" | "desc"; "price"?: "asc" | "desc"; "stock"?: "asc" | "desc"; "status"?: "asc" | "desc"; "createdAt"?: "asc" | "desc"; "updatedAt"?: "asc" | "desc" };
  "_min"?: { "id"?: "asc" | "desc"; "name"?: "asc" | "desc"; "price"?: "asc" | "desc"; "stock"?: "asc" | "desc"; "status"?: "asc" | "desc"; "createdAt"?: "asc" | "desc"; "updatedAt"?: "asc" | "desc" };
  "_sum"?: { "id"?: "asc" | "desc"; "price"?: "asc" | "desc"; "stock"?: "asc" | "desc" };
};

export type GassmaGassmaOrderOrderByWithAggregation = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "userId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "totalAmount"?: "asc" | "desc" | Gassma.SortOrderInput;
  "quantity"?: "asc" | "desc" | Gassma.SortOrderInput;
  "status"?: "asc" | "desc" | Gassma.SortOrderInput;
  "createdAt"?: "asc" | "desc" | Gassma.SortOrderInput;
  "_avg"?: { "id"?: "asc" | "desc"; "userId"?: "asc" | "desc"; "totalAmount"?: "asc" | "desc"; "quantity"?: "asc" | "desc" };
  "_count"?: { "id"?: "asc" | "desc"; "userId"?: "asc" | "desc"; "totalAmount"?: "asc" | "desc"; "quantity"?: "asc" | "desc"; "status"?: "asc" | "desc"; "createdAt"?: "asc" | "desc" };
  "_max"?: { "id"?: "asc" | "desc"; "userId"?: "asc" | "desc"; "totalAmount"?: "asc" | "desc"; "quantity"?: "asc" | "desc"; "status"?: "asc" | "desc"; "createdAt"?: "asc" | "desc" };
  "_min"?: { "id"?: "asc" | "desc"; "userId"?: "asc" | "desc"; "totalAmount"?: "asc" | "desc"; "quantity"?: "asc" | "desc"; "status"?: "asc" | "desc"; "createdAt"?: "asc" | "desc" };
  "_sum"?: { "id"?: "asc" | "desc"; "userId"?: "asc" | "desc"; "totalAmount"?: "asc" | "desc"; "quantity"?: "asc" | "desc" };
};

export type GassmaGassmaOrderItemOrderByWithAggregation = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "orderId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "productId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "quantity"?: "asc" | "desc" | Gassma.SortOrderInput;
  "unitPrice"?: "asc" | "desc" | Gassma.SortOrderInput;
  "_avg"?: { "id"?: "asc" | "desc"; "orderId"?: "asc" | "desc"; "productId"?: "asc" | "desc"; "quantity"?: "asc" | "desc"; "unitPrice"?: "asc" | "desc" };
  "_count"?: { "id"?: "asc" | "desc"; "orderId"?: "asc" | "desc"; "productId"?: "asc" | "desc"; "quantity"?: "asc" | "desc"; "unitPrice"?: "asc" | "desc" };
  "_max"?: { "id"?: "asc" | "desc"; "orderId"?: "asc" | "desc"; "productId"?: "asc" | "desc"; "quantity"?: "asc" | "desc"; "unitPrice"?: "asc" | "desc" };
  "_min"?: { "id"?: "asc" | "desc"; "orderId"?: "asc" | "desc"; "productId"?: "asc" | "desc"; "quantity"?: "asc" | "desc"; "unitPrice"?: "asc" | "desc" };
  "_sum"?: { "id"?: "asc" | "desc"; "orderId"?: "asc" | "desc"; "productId"?: "asc" | "desc"; "quantity"?: "asc" | "desc"; "unitPrice"?: "asc" | "desc" };
};

export type GassmaGassmaFormulaCellOrderByWithAggregation = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "label"?: "asc" | "desc" | Gassma.SortOrderInput;
  "amount"?: "asc" | "desc" | Gassma.SortOrderInput;
  "total"?: "asc" | "desc" | Gassma.SortOrderInput;
  "_avg"?: { "id"?: "asc" | "desc"; "amount"?: "asc" | "desc"; "total"?: "asc" | "desc" };
  "_count"?: { "id"?: "asc" | "desc"; "label"?: "asc" | "desc"; "amount"?: "asc" | "desc"; "total"?: "asc" | "desc" };
  "_max"?: { "id"?: "asc" | "desc"; "label"?: "asc" | "desc"; "amount"?: "asc" | "desc"; "total"?: "asc" | "desc" };
  "_min"?: { "id"?: "asc" | "desc"; "label"?: "asc" | "desc"; "amount"?: "asc" | "desc"; "total"?: "asc" | "desc" };
  "_sum"?: { "id"?: "asc" | "desc"; "amount"?: "asc" | "desc"; "total"?: "asc" | "desc" };
};

export type GassmaGassmaNotificationOrderByWithAggregation = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "userId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "message"?: "asc" | "desc" | Gassma.SortOrderInput;
  "isRead"?: "asc" | "desc" | Gassma.SortOrderInput;
  "_avg"?: { "id"?: "asc" | "desc"; "userId"?: "asc" | "desc" };
  "_count"?: { "id"?: "asc" | "desc"; "userId"?: "asc" | "desc"; "message"?: "asc" | "desc"; "isRead"?: "asc" | "desc" };
  "_max"?: { "id"?: "asc" | "desc"; "userId"?: "asc" | "desc"; "message"?: "asc" | "desc"; "isRead"?: "asc" | "desc" };
  "_min"?: { "id"?: "asc" | "desc"; "userId"?: "asc" | "desc"; "message"?: "asc" | "desc"; "isRead"?: "asc" | "desc" };
  "_sum"?: { "id"?: "asc" | "desc"; "userId"?: "asc" | "desc" };
};

export type GassmaGassmaOffsetNoteOrderByWithAggregation = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "title"?: "asc" | "desc" | Gassma.SortOrderInput;
  "value"?: "asc" | "desc" | Gassma.SortOrderInput;
  "_avg"?: { "id"?: "asc" | "desc"; "value"?: "asc" | "desc" };
  "_count"?: { "id"?: "asc" | "desc"; "title"?: "asc" | "desc"; "value"?: "asc" | "desc" };
  "_max"?: { "id"?: "asc" | "desc"; "title"?: "asc" | "desc"; "value"?: "asc" | "desc" };
  "_min"?: { "id"?: "asc" | "desc"; "title"?: "asc" | "desc"; "value"?: "asc" | "desc" };
  "_sum"?: { "id"?: "asc" | "desc"; "value"?: "asc" | "desc" };
};

export type GassmaGassmaUserOrderByWithAggregation = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "email"?: "asc" | "desc" | Gassma.SortOrderInput;
  "name"?: "asc" | "desc" | Gassma.SortOrderInput;
  "age"?: "asc" | "desc" | Gassma.SortOrderInput;
  "isActive"?: "asc" | "desc" | Gassma.SortOrderInput;
  "role"?: "asc" | "desc" | Gassma.SortOrderInput;
  "createdAt"?: "asc" | "desc" | Gassma.SortOrderInput;
  "_avg"?: { "id"?: "asc" | "desc"; "age"?: "asc" | "desc" };
  "_count"?: { "id"?: "asc" | "desc"; "email"?: "asc" | "desc"; "name"?: "asc" | "desc"; "age"?: "asc" | "desc"; "isActive"?: "asc" | "desc"; "role"?: "asc" | "desc"; "createdAt"?: "asc" | "desc" };
  "_max"?: { "id"?: "asc" | "desc"; "email"?: "asc" | "desc"; "name"?: "asc" | "desc"; "age"?: "asc" | "desc"; "isActive"?: "asc" | "desc"; "role"?: "asc" | "desc"; "createdAt"?: "asc" | "desc" };
  "_min"?: { "id"?: "asc" | "desc"; "email"?: "asc" | "desc"; "name"?: "asc" | "desc"; "age"?: "asc" | "desc"; "isActive"?: "asc" | "desc"; "role"?: "asc" | "desc"; "createdAt"?: "asc" | "desc" };
  "_sum"?: { "id"?: "asc" | "desc"; "age"?: "asc" | "desc" };
};

export type GassmaGassmaProfileOrderByWithAggregation = {
  "id"?: "asc" | "desc" | Gassma.SortOrderInput;
  "bio"?: "asc" | "desc" | Gassma.SortOrderInput;
  "website"?: "asc" | "desc" | Gassma.SortOrderInput;
  "userId"?: "asc" | "desc" | Gassma.SortOrderInput;
  "_avg"?: { "id"?: "asc" | "desc"; "userId"?: "asc" | "desc" };
  "_count"?: { "id"?: "asc" | "desc"; "bio"?: "asc" | "desc"; "website"?: "asc" | "desc"; "userId"?: "asc" | "desc" };
  "_max"?: { "id"?: "asc" | "desc"; "bio"?: "asc" | "desc"; "website"?: "asc" | "desc"; "userId"?: "asc" | "desc" };
  "_min"?: { "id"?: "asc" | "desc"; "bio"?: "asc" | "desc"; "website"?: "asc" | "desc"; "userId"?: "asc" | "desc" };
  "_sum"?: { "id"?: "asc" | "desc"; "userId"?: "asc" | "desc" };
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

export type GassmaGassmaPostCountSelect = GassmaGassmaPostSelect & {
  "_all"?: true;
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

export type GassmaGassmaCommentCountSelect = GassmaGassmaCommentSelect & {
  "_all"?: true;
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

export type GassmaGassmaCategoryCountSelect = GassmaGassmaCategorySelect & {
  "_all"?: true;
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

export type GassmaGassmaTagCountSelect = GassmaGassmaTagSelect & {
  "_all"?: true;
};

export type GassmaGassmaTagFindSelect = {
  "id"?: true;
  "name"?: true;
  "posts"?: true | { select?: GassmaGassmaPostFindSelect; omit?: GassmaGassmaPostOmit; where?: GassmaGassmaPostWhereUse; orderBy?: GassmaGassmaPostOrderBy | GassmaGassmaPostOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaPostInclude; _count?: GassmaGassmaPostCountValue };
  "_count"?: GassmaGassmaTagCountValue;
};

export type GassmaGassmaSensorReadingSelect = {
  "id"?: true;
  "sensorName"?: true;
  "recordedAt"?: true;
};

export type GassmaGassmaSensorReadingNumberSelect = {
  "id"?: true;
};

export type GassmaGassmaSensorReadingCountSelect = GassmaGassmaSensorReadingSelect & {
  "_all"?: true;
};

export type GassmaGassmaSensorReadingFindSelect = {
  "id"?: true;
  "sensorName"?: true;
  "recordedAt"?: true;
};

export type GassmaGassmaTimeSlotSelect = {
  "id"?: true;
  "label"?: true;
  "slotAt"?: true;
};

export type GassmaGassmaTimeSlotNumberSelect = {
  "id"?: true;
};

export type GassmaGassmaTimeSlotCountSelect = GassmaGassmaTimeSlotSelect & {
  "_all"?: true;
};

export type GassmaGassmaTimeSlotFindSelect = {
  "id"?: true;
  "label"?: true;
  "slotAt"?: true;
  "reservations"?: true | { select?: GassmaGassmaReservationFindSelect; omit?: GassmaGassmaReservationOmit; where?: GassmaGassmaReservationWhereUse; orderBy?: GassmaGassmaReservationOrderBy | GassmaGassmaReservationOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaReservationInclude; _count?: GassmaGassmaReservationCountValue };
  "_count"?: GassmaGassmaTimeSlotCountValue;
};

export type GassmaGassmaReservationSelect = {
  "id"?: true;
  "guestName"?: true;
  "slotAt"?: true;
};

export type GassmaGassmaReservationNumberSelect = {
  "id"?: true;
};

export type GassmaGassmaReservationCountSelect = GassmaGassmaReservationSelect & {
  "_all"?: true;
};

export type GassmaGassmaReservationFindSelect = {
  "id"?: true;
  "guestName"?: true;
  "slotAt"?: true;
  "timeSlot"?: true | { select?: GassmaGassmaTimeSlotFindSelect; omit?: GassmaGassmaTimeSlotOmit; where?: GassmaGassmaTimeSlotWhereUse; orderBy?: GassmaGassmaTimeSlotOrderBy | GassmaGassmaTimeSlotOrderBy[]; take?: number; skip?: number; include?: GassmaGassmaTimeSlotInclude; _count?: GassmaGassmaTimeSlotCountValue };
  "_count"?: GassmaGassmaReservationCountValue;
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

export type GassmaGassmaProductCountSelect = GassmaGassmaProductSelect & {
  "_all"?: true;
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

export type GassmaGassmaOrderCountSelect = GassmaGassmaOrderSelect & {
  "_all"?: true;
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

export type GassmaGassmaOrderItemCountSelect = GassmaGassmaOrderItemSelect & {
  "_all"?: true;
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

export type GassmaGassmaFormulaCellCountSelect = GassmaGassmaFormulaCellSelect & {
  "_all"?: true;
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

export type GassmaGassmaNotificationCountSelect = GassmaGassmaNotificationSelect & {
  "_all"?: true;
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

export type GassmaGassmaOffsetNoteCountSelect = GassmaGassmaOffsetNoteSelect & {
  "_all"?: true;
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

export type GassmaGassmaUserCountSelect = GassmaGassmaUserSelect & {
  "_all"?: true;
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

export type GassmaGassmaProfileCountSelect = GassmaGassmaProfileSelect & {
  "_all"?: true;
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

export type GassmaGassmaSensorReadingOmit = {
  "id"?: true | false;
  "sensorName"?: true | false;
  "recordedAt"?: true | false;
};

export type GassmaGassmaTimeSlotOmit = {
  "id"?: true | false;
  "label"?: true | false;
  "slotAt"?: true | false;
};

export type GassmaGassmaReservationOmit = {
  "id"?: true | false;
  "guestName"?: true | false;
  "slotAt"?: true | false;
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
  select?: GassmaGassmaPostCountSelect | true;
};

export type GassmaGassmaCommentCountData = {
  where?: GassmaGassmaCommentWhereUse;
  orderBy?: GassmaGassmaCommentOrderBy | GassmaGassmaCommentOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaCommentUse>;
  select?: GassmaGassmaCommentCountSelect | true;
};

export type GassmaGassmaCategoryCountData = {
  where?: GassmaGassmaCategoryWhereUse;
  orderBy?: GassmaGassmaCategoryOrderBy | GassmaGassmaCategoryOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaCategoryUse>;
  select?: GassmaGassmaCategoryCountSelect | true;
};

export type GassmaGassmaTagCountData = {
  where?: GassmaGassmaTagWhereUse;
  orderBy?: GassmaGassmaTagOrderBy | GassmaGassmaTagOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaTagUse>;
  select?: GassmaGassmaTagCountSelect | true;
};

export type GassmaGassmaSensorReadingCountData = {
  where?: GassmaGassmaSensorReadingWhereUse;
  orderBy?: GassmaGassmaSensorReadingOrderBy | GassmaGassmaSensorReadingOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaSensorReadingUse>;
  select?: GassmaGassmaSensorReadingCountSelect | true;
};

export type GassmaGassmaTimeSlotCountData = {
  where?: GassmaGassmaTimeSlotWhereUse;
  orderBy?: GassmaGassmaTimeSlotOrderBy | GassmaGassmaTimeSlotOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaTimeSlotUse>;
  select?: GassmaGassmaTimeSlotCountSelect | true;
};

export type GassmaGassmaReservationCountData = {
  where?: GassmaGassmaReservationWhereUse;
  orderBy?: GassmaGassmaReservationOrderBy | GassmaGassmaReservationOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaReservationUse>;
  select?: GassmaGassmaReservationCountSelect | true;
};

export type GassmaGassmaProductCountData = {
  where?: GassmaGassmaProductWhereUse;
  orderBy?: GassmaGassmaProductOrderBy | GassmaGassmaProductOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaProductUse>;
  select?: GassmaGassmaProductCountSelect | true;
};

export type GassmaGassmaOrderCountData = {
  where?: GassmaGassmaOrderWhereUse;
  orderBy?: GassmaGassmaOrderOrderBy | GassmaGassmaOrderOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaOrderUse>;
  select?: GassmaGassmaOrderCountSelect | true;
};

export type GassmaGassmaOrderItemCountData = {
  where?: GassmaGassmaOrderItemWhereUse;
  orderBy?: GassmaGassmaOrderItemOrderBy | GassmaGassmaOrderItemOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaOrderItemUse>;
  select?: GassmaGassmaOrderItemCountSelect | true;
};

export type GassmaGassmaFormulaCellCountData = {
  where?: GassmaGassmaFormulaCellWhereUse;
  orderBy?: GassmaGassmaFormulaCellOrderBy | GassmaGassmaFormulaCellOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaFormulaCellUse>;
  select?: GassmaGassmaFormulaCellCountSelect | true;
};

export type GassmaGassmaNotificationCountData = {
  where?: GassmaGassmaNotificationWhereUse;
  orderBy?: GassmaGassmaNotificationOrderBy | GassmaGassmaNotificationOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaNotificationUse>;
  select?: GassmaGassmaNotificationCountSelect | true;
};

export type GassmaGassmaOffsetNoteCountData = {
  where?: GassmaGassmaOffsetNoteWhereUse;
  orderBy?: GassmaGassmaOffsetNoteOrderBy | GassmaGassmaOffsetNoteOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaOffsetNoteUse>;
  select?: GassmaGassmaOffsetNoteCountSelect | true;
};

export type GassmaGassmaUserCountData = {
  where?: GassmaGassmaUserWhereUse;
  orderBy?: GassmaGassmaUserOrderBy | GassmaGassmaUserOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaUserUse>;
  select?: GassmaGassmaUserCountSelect | true;
};

export type GassmaGassmaProfileCountData = {
  where?: GassmaGassmaProfileWhereUse;
  orderBy?: GassmaGassmaProfileOrderBy | GassmaGassmaProfileOrderBy[];
  take?: number;
  skip?: number;
  cursor?: Partial<GassmaGassmaProfileUse>;
  select?: GassmaGassmaProfileCountSelect | true;
};

export type GassmaGassmaPostCountResult<T extends GassmaGassmaPostCountData> = T extends { select: infer S }
  ? S extends true
    ? number
    : { [K in keyof S]: number }
  : number;

export type GassmaGassmaCommentCountResult<T extends GassmaGassmaCommentCountData> = T extends { select: infer S }
  ? S extends true
    ? number
    : { [K in keyof S]: number }
  : number;

export type GassmaGassmaCategoryCountResult<T extends GassmaGassmaCategoryCountData> = T extends { select: infer S }
  ? S extends true
    ? number
    : { [K in keyof S]: number }
  : number;

export type GassmaGassmaTagCountResult<T extends GassmaGassmaTagCountData> = T extends { select: infer S }
  ? S extends true
    ? number
    : { [K in keyof S]: number }
  : number;

export type GassmaGassmaSensorReadingCountResult<T extends GassmaGassmaSensorReadingCountData> = T extends { select: infer S }
  ? S extends true
    ? number
    : { [K in keyof S]: number }
  : number;

export type GassmaGassmaTimeSlotCountResult<T extends GassmaGassmaTimeSlotCountData> = T extends { select: infer S }
  ? S extends true
    ? number
    : { [K in keyof S]: number }
  : number;

export type GassmaGassmaReservationCountResult<T extends GassmaGassmaReservationCountData> = T extends { select: infer S }
  ? S extends true
    ? number
    : { [K in keyof S]: number }
  : number;

export type GassmaGassmaProductCountResult<T extends GassmaGassmaProductCountData> = T extends { select: infer S }
  ? S extends true
    ? number
    : { [K in keyof S]: number }
  : number;

export type GassmaGassmaOrderCountResult<T extends GassmaGassmaOrderCountData> = T extends { select: infer S }
  ? S extends true
    ? number
    : { [K in keyof S]: number }
  : number;

export type GassmaGassmaOrderItemCountResult<T extends GassmaGassmaOrderItemCountData> = T extends { select: infer S }
  ? S extends true
    ? number
    : { [K in keyof S]: number }
  : number;

export type GassmaGassmaFormulaCellCountResult<T extends GassmaGassmaFormulaCellCountData> = T extends { select: infer S }
  ? S extends true
    ? number
    : { [K in keyof S]: number }
  : number;

export type GassmaGassmaNotificationCountResult<T extends GassmaGassmaNotificationCountData> = T extends { select: infer S }
  ? S extends true
    ? number
    : { [K in keyof S]: number }
  : number;

export type GassmaGassmaOffsetNoteCountResult<T extends GassmaGassmaOffsetNoteCountData> = T extends { select: infer S }
  ? S extends true
    ? number
    : { [K in keyof S]: number }
  : number;

export type GassmaGassmaUserCountResult<T extends GassmaGassmaUserCountData> = T extends { select: infer S }
  ? S extends true
    ? number
    : { [K in keyof S]: number }
  : number;

export type GassmaGassmaProfileCountResult<T extends GassmaGassmaProfileCountData> = T extends { select: infer S }
  ? S extends true
    ? number
    : { [K in keyof S]: number }
  : number;

/**
 * Model Post
 * 
 */
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

/**
 * Model Comment
 * 
 */
export type GassmaGassmaCommentCreateReturn = {
 "id": number;
 "text": string;
 "authorId": number;
 "postId": number;
 "createdAt": Date;
};

/**
 * Model Category
 * 
 */
export type GassmaGassmaCategoryCreateReturn = {
 "id": number;
 "name": string;
 "parentId": number | null;
};

/**
 * Model Tag
 * 
 */
export type GassmaGassmaTagCreateReturn = {
 "id": number;
 "name": string;
};

/**
 * Model SensorReading
 * 
 */
export type GassmaGassmaSensorReadingCreateReturn = {
 "id": number;
 "sensorName": string;
 "recordedAt": Date;
};

/**
 * Model TimeSlot
 * 
 */
export type GassmaGassmaTimeSlotCreateReturn = {
 "id": number;
 "label": string;
 "slotAt": Date | null;
};

/**
 * Model Reservation
 * 
 */
export type GassmaGassmaReservationCreateReturn = {
 "id": number;
 "guestName": string;
 "slotAt": Date;
};

/**
 * Model Product
 * 
 */
export type GassmaGassmaProductCreateReturn = {
 "id": number;
 "name": string;
 "price": number;
 "stock": number;
 "status": "available" | "soldout" | "discontinued";
 "createdAt": Date;
 "updatedAt": Date;
};

/**
 * Model Order
 * 
 */
export type GassmaGassmaOrderCreateReturn = {
 "id": number;
 "userId": number;
 "totalAmount": number;
 "quantity": number;
 "status": "pending" | "shipped" | "delivered" | "cancelled";
 "createdAt": Date;
};

/**
 * Model OrderItem
 * 
 */
export type GassmaGassmaOrderItemCreateReturn = {
 "id": number;
 "orderId": number;
 "productId": number;
 "quantity": number;
 "unitPrice": number;
};

/**
 * Model FormulaCell
 * 
 */
export type GassmaGassmaFormulaCellCreateReturn = {
 "id": number;
 "label": string;
 "amount": number;
 "total": number;
};

/**
 * Model Notification
 * 
 */
export type GassmaGassmaNotificationCreateReturn = {
 "id": number;
 "userId": number;
 "message": string;
 "isRead": boolean;
};

/**
 * Model OffsetNote
 * 
 */
export type GassmaGassmaOffsetNoteCreateReturn = {
 "id": number;
 "title": string;
 "value": number;
};

/**
 * Model User
 * 
 */
export type GassmaGassmaUserCreateReturn = {
 "id": number;
 "email": string;
 "name": string;
 "age": number | null;
 "isActive": boolean;
 "role": "ADMIN" | "USER" | "MODERATOR";
 "createdAt": Date;
};

/**
 * Model Profile
 * 
 */
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

export type GassmaGassmaSensorReadingDefaultFindResult = GassmaGassmaSensorReadingCreateReturn;

export type GassmaGassmaTimeSlotDefaultFindResult = GassmaGassmaTimeSlotCreateReturn;

export type GassmaGassmaReservationDefaultFindResult = GassmaGassmaReservationCreateReturn;

export type GassmaGassmaProductDefaultFindResult = GassmaGassmaProductCreateReturn;

export type GassmaGassmaOrderDefaultFindResult = GassmaGassmaOrderCreateReturn;

export type GassmaGassmaOrderItemDefaultFindResult = GassmaGassmaOrderItemCreateReturn;

export type GassmaGassmaFormulaCellDefaultFindResult = GassmaGassmaFormulaCellCreateReturn;

export type GassmaGassmaNotificationDefaultFindResult = GassmaGassmaNotificationCreateReturn;

export type GassmaGassmaOffsetNoteDefaultFindResult = GassmaGassmaOffsetNoteCreateReturn;

export type GassmaGassmaUserDefaultFindResult = GassmaGassmaUserCreateReturn;

export type GassmaGassmaProfileDefaultFindResult = GassmaGassmaProfileCreateReturn;

export type GassmaGassmaPostFindResultBase<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
    ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaPostDefaultFindResult | "author" | "category" | "comments" | "tags" | "_count")]:
          K extends "author" | "category" | "comments" | "tags" ? {
            "author": GassmaGassmaUserFindResultBase<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "User": infer TO } ? TO extends GassmaGassmaUserOmit ? TO : {} : {}, O>;
            "category": GassmaGassmaCategoryFindResultBase<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Category": infer TO } ? TO extends GassmaGassmaCategoryOmit ? TO : {} : {}, O> | null;
            "comments": GassmaGassmaCommentFindResultBase<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Comment": infer TO } ? TO extends GassmaGassmaCommentOmit ? TO : {} : {}, O>[];
            "tags": GassmaGassmaTagFindResultBase<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Tag": infer TO } ? TO extends GassmaGassmaTagOmit ? TO : {} : {}, O>[];
          }[K] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaPostDefaultFindResult[K & keyof GassmaGassmaPostDefaultFindResult];
    }
    : {
      [K in keyof GassmaGassmaPostDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaPostDefaultFindResult[K];
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "author" | "category" | "comments" | "tags" | "_count" ? K : never]:
          K extends "author" | "category" | "comments" | "tags" ? {
            "author": GassmaGassmaUserFindResultBase<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "User": infer TO } ? TO extends GassmaGassmaUserOmit ? TO : {} : {}, O>;
            "category": GassmaGassmaCategoryFindResultBase<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Category": infer TO } ? TO extends GassmaGassmaCategoryOmit ? TO : {} : {}, O> | null;
            "comments": GassmaGassmaCommentFindResultBase<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Comment": infer TO } ? TO extends GassmaGassmaCommentOmit ? TO : {} : {}, O>[];
            "tags": GassmaGassmaTagFindResultBase<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Tag": infer TO } ? TO extends GassmaGassmaTagOmit ? TO : {} : {}, O>[];
          }[K] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaPostFindResultCore<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
    ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaPostDefaultFindResult | "author" | "category" | "comments" | "tags" | "_count")]:
          K extends "author" | "category" | "comments" | "tags" ? {
            "author": GassmaGassmaUserFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "User": infer TO } ? TO extends GassmaGassmaUserOmit ? TO : {} : {}, O, CMap>;
            "category": GassmaGassmaCategoryFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Category": infer TO } ? TO extends GassmaGassmaCategoryOmit ? TO : {} : {}, O, CMap> | null;
            "comments": GassmaGassmaCommentFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Comment": infer TO } ? TO extends GassmaGassmaCommentOmit ? TO : {} : {}, O, CMap>[];
            "tags": GassmaGassmaTagFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Tag": infer TO } ? TO extends GassmaGassmaTagOmit ? TO : {} : {}, O, CMap>[];
          }[K] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaPostDefaultFindResult[K & keyof GassmaGassmaPostDefaultFindResult];
    }
    : {
      [K in keyof GassmaGassmaPostDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaPostDefaultFindResult[K];
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "author" | "category" | "comments" | "tags" | "_count" ? K : never]:
          K extends "author" | "category" | "comments" | "tags" ? {
            "author": GassmaGassmaUserFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "User": infer TO } ? TO extends GassmaGassmaUserOmit ? TO : {} : {}, O, CMap>;
            "category": GassmaGassmaCategoryFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Category": infer TO } ? TO extends GassmaGassmaCategoryOmit ? TO : {} : {}, O, CMap> | null;
            "comments": GassmaGassmaCommentFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Comment": infer TO } ? TO extends GassmaGassmaCommentOmit ? TO : {} : {}, O, CMap>[];
            "tags": GassmaGassmaTagFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Tag": infer TO } ? TO extends GassmaGassmaTagOmit ? TO : {} : {}, O, CMap>[];
          }[K] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaPostFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = Gassma.WithComputed<
  GassmaGassmaPostFindResultCore<Gassma.StripComputed<S, Gassma.At<CMap, "Post">>, I, QO, GO, O, CMap>,
  Gassma.At<CMap, "Post">,
  S,
  QO
>;

export type GassmaGassmaCommentFindResultBase<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
    ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaCommentDefaultFindResult | "author" | "post" | "_count")]:
          K extends "author" | "post" ? {
            "author": GassmaGassmaUserFindResultBase<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "User": infer TO } ? TO extends GassmaGassmaUserOmit ? TO : {} : {}, O>;
            "post": GassmaGassmaPostFindResultBase<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Post": infer TO } ? TO extends GassmaGassmaPostOmit ? TO : {} : {}, O>;
          }[K] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaCommentDefaultFindResult[K & keyof GassmaGassmaCommentDefaultFindResult];
    }
    : {
      [K in keyof GassmaGassmaCommentDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaCommentDefaultFindResult[K];
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "author" | "post" | "_count" ? K : never]:
          K extends "author" | "post" ? {
            "author": GassmaGassmaUserFindResultBase<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "User": infer TO } ? TO extends GassmaGassmaUserOmit ? TO : {} : {}, O>;
            "post": GassmaGassmaPostFindResultBase<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Post": infer TO } ? TO extends GassmaGassmaPostOmit ? TO : {} : {}, O>;
          }[K] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaCommentFindResultCore<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
    ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaCommentDefaultFindResult | "author" | "post" | "_count")]:
          K extends "author" | "post" ? {
            "author": GassmaGassmaUserFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "User": infer TO } ? TO extends GassmaGassmaUserOmit ? TO : {} : {}, O, CMap>;
            "post": GassmaGassmaPostFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Post": infer TO } ? TO extends GassmaGassmaPostOmit ? TO : {} : {}, O, CMap>;
          }[K] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaCommentDefaultFindResult[K & keyof GassmaGassmaCommentDefaultFindResult];
    }
    : {
      [K in keyof GassmaGassmaCommentDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaCommentDefaultFindResult[K];
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "author" | "post" | "_count" ? K : never]:
          K extends "author" | "post" ? {
            "author": GassmaGassmaUserFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "User": infer TO } ? TO extends GassmaGassmaUserOmit ? TO : {} : {}, O, CMap>;
            "post": GassmaGassmaPostFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Post": infer TO } ? TO extends GassmaGassmaPostOmit ? TO : {} : {}, O, CMap>;
          }[K] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaCommentFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = Gassma.WithComputed<
  GassmaGassmaCommentFindResultCore<Gassma.StripComputed<S, Gassma.At<CMap, "Comment">>, I, QO, GO, O, CMap>,
  Gassma.At<CMap, "Comment">,
  S,
  QO
>;

export type GassmaGassmaCategoryFindResultBase<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
    ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaCategoryDefaultFindResult | "posts" | "parent" | "children" | "_count")]:
          K extends "posts" | "parent" | "children" ? {
            "posts": GassmaGassmaPostFindResultBase<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Post": infer TO } ? TO extends GassmaGassmaPostOmit ? TO : {} : {}, O>[];
            "parent": GassmaGassmaCategoryFindResultBase<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Category": infer TO } ? TO extends GassmaGassmaCategoryOmit ? TO : {} : {}, O> | null;
            "children": GassmaGassmaCategoryFindResultBase<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Category": infer TO } ? TO extends GassmaGassmaCategoryOmit ? TO : {} : {}, O>[];
          }[K] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaCategoryDefaultFindResult[K & keyof GassmaGassmaCategoryDefaultFindResult];
    }
    : {
      [K in keyof GassmaGassmaCategoryDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaCategoryDefaultFindResult[K];
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "posts" | "parent" | "children" | "_count" ? K : never]:
          K extends "posts" | "parent" | "children" ? {
            "posts": GassmaGassmaPostFindResultBase<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Post": infer TO } ? TO extends GassmaGassmaPostOmit ? TO : {} : {}, O>[];
            "parent": GassmaGassmaCategoryFindResultBase<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Category": infer TO } ? TO extends GassmaGassmaCategoryOmit ? TO : {} : {}, O> | null;
            "children": GassmaGassmaCategoryFindResultBase<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Category": infer TO } ? TO extends GassmaGassmaCategoryOmit ? TO : {} : {}, O>[];
          }[K] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaCategoryFindResultCore<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
    ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaCategoryDefaultFindResult | "posts" | "parent" | "children" | "_count")]:
          K extends "posts" | "parent" | "children" ? {
            "posts": GassmaGassmaPostFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Post": infer TO } ? TO extends GassmaGassmaPostOmit ? TO : {} : {}, O, CMap>[];
            "parent": GassmaGassmaCategoryFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Category": infer TO } ? TO extends GassmaGassmaCategoryOmit ? TO : {} : {}, O, CMap> | null;
            "children": GassmaGassmaCategoryFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Category": infer TO } ? TO extends GassmaGassmaCategoryOmit ? TO : {} : {}, O, CMap>[];
          }[K] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaCategoryDefaultFindResult[K & keyof GassmaGassmaCategoryDefaultFindResult];
    }
    : {
      [K in keyof GassmaGassmaCategoryDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaCategoryDefaultFindResult[K];
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "posts" | "parent" | "children" | "_count" ? K : never]:
          K extends "posts" | "parent" | "children" ? {
            "posts": GassmaGassmaPostFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Post": infer TO } ? TO extends GassmaGassmaPostOmit ? TO : {} : {}, O, CMap>[];
            "parent": GassmaGassmaCategoryFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Category": infer TO } ? TO extends GassmaGassmaCategoryOmit ? TO : {} : {}, O, CMap> | null;
            "children": GassmaGassmaCategoryFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Category": infer TO } ? TO extends GassmaGassmaCategoryOmit ? TO : {} : {}, O, CMap>[];
          }[K] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaCategoryFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = Gassma.WithComputed<
  GassmaGassmaCategoryFindResultCore<Gassma.StripComputed<S, Gassma.At<CMap, "Category">>, I, QO, GO, O, CMap>,
  Gassma.At<CMap, "Category">,
  S,
  QO
>;

export type GassmaGassmaTagFindResultBase<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
    ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaTagDefaultFindResult | "posts" | "_count")]:
          K extends "posts" ? {
            "posts": GassmaGassmaPostFindResultBase<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Post": infer TO } ? TO extends GassmaGassmaPostOmit ? TO : {} : {}, O>[];
          }[K] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaTagDefaultFindResult[K & keyof GassmaGassmaTagDefaultFindResult];
    }
    : {
      [K in keyof GassmaGassmaTagDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaTagDefaultFindResult[K];
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "posts" | "_count" ? K : never]:
          K extends "posts" ? {
            "posts": GassmaGassmaPostFindResultBase<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Post": infer TO } ? TO extends GassmaGassmaPostOmit ? TO : {} : {}, O>[];
          }[K] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaTagFindResultCore<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
    ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaTagDefaultFindResult | "posts" | "_count")]:
          K extends "posts" ? {
            "posts": GassmaGassmaPostFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Post": infer TO } ? TO extends GassmaGassmaPostOmit ? TO : {} : {}, O, CMap>[];
          }[K] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaTagDefaultFindResult[K & keyof GassmaGassmaTagDefaultFindResult];
    }
    : {
      [K in keyof GassmaGassmaTagDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaTagDefaultFindResult[K];
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "posts" | "_count" ? K : never]:
          K extends "posts" ? {
            "posts": GassmaGassmaPostFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Post": infer TO } ? TO extends GassmaGassmaPostOmit ? TO : {} : {}, O, CMap>[];
          }[K] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaTagFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = Gassma.WithComputed<
  GassmaGassmaTagFindResultCore<Gassma.StripComputed<S, Gassma.At<CMap, "Tag">>, I, QO, GO, O, CMap>,
  Gassma.At<CMap, "Tag">,
  S,
  QO
>;

export type GassmaGassmaSensorReadingFindResultBase<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
    ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaSensorReadingDefaultFindResult | "_count")]:

          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaSensorReadingDefaultFindResult[K & keyof GassmaGassmaSensorReadingDefaultFindResult];
    }
    : {
      [K in keyof GassmaGassmaSensorReadingDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaSensorReadingDefaultFindResult[K];
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "_count" ? K : never]:

          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaSensorReadingFindResultCore<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
    ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaSensorReadingDefaultFindResult | "_count")]:

          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaSensorReadingDefaultFindResult[K & keyof GassmaGassmaSensorReadingDefaultFindResult];
    }
    : {
      [K in keyof GassmaGassmaSensorReadingDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaSensorReadingDefaultFindResult[K];
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "_count" ? K : never]:

          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaSensorReadingFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = Gassma.WithComputed<
  GassmaGassmaSensorReadingFindResultCore<Gassma.StripComputed<S, Gassma.At<CMap, "SensorReading">>, I, QO, GO, O, CMap>,
  Gassma.At<CMap, "SensorReading">,
  S,
  QO
>;

export type GassmaGassmaTimeSlotFindResultBase<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
    ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaTimeSlotDefaultFindResult | "reservations" | "_count")]:
          K extends "reservations" ? {
            "reservations": GassmaGassmaReservationFindResultBase<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Reservation": infer TO } ? TO extends GassmaGassmaReservationOmit ? TO : {} : {}, O>[];
          }[K] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaTimeSlotDefaultFindResult[K & keyof GassmaGassmaTimeSlotDefaultFindResult];
    }
    : {
      [K in keyof GassmaGassmaTimeSlotDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaTimeSlotDefaultFindResult[K];
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "reservations" | "_count" ? K : never]:
          K extends "reservations" ? {
            "reservations": GassmaGassmaReservationFindResultBase<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Reservation": infer TO } ? TO extends GassmaGassmaReservationOmit ? TO : {} : {}, O>[];
          }[K] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaTimeSlotFindResultCore<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
    ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaTimeSlotDefaultFindResult | "reservations" | "_count")]:
          K extends "reservations" ? {
            "reservations": GassmaGassmaReservationFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Reservation": infer TO } ? TO extends GassmaGassmaReservationOmit ? TO : {} : {}, O, CMap>[];
          }[K] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaTimeSlotDefaultFindResult[K & keyof GassmaGassmaTimeSlotDefaultFindResult];
    }
    : {
      [K in keyof GassmaGassmaTimeSlotDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaTimeSlotDefaultFindResult[K];
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "reservations" | "_count" ? K : never]:
          K extends "reservations" ? {
            "reservations": GassmaGassmaReservationFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Reservation": infer TO } ? TO extends GassmaGassmaReservationOmit ? TO : {} : {}, O, CMap>[];
          }[K] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaTimeSlotFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = Gassma.WithComputed<
  GassmaGassmaTimeSlotFindResultCore<Gassma.StripComputed<S, Gassma.At<CMap, "TimeSlot">>, I, QO, GO, O, CMap>,
  Gassma.At<CMap, "TimeSlot">,
  S,
  QO
>;

export type GassmaGassmaReservationFindResultBase<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
    ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaReservationDefaultFindResult | "timeSlot" | "_count")]:
          K extends "timeSlot" ? {
            "timeSlot": GassmaGassmaTimeSlotFindResultBase<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "TimeSlot": infer TO } ? TO extends GassmaGassmaTimeSlotOmit ? TO : {} : {}, O>;
          }[K] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaReservationDefaultFindResult[K & keyof GassmaGassmaReservationDefaultFindResult];
    }
    : {
      [K in keyof GassmaGassmaReservationDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaReservationDefaultFindResult[K];
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "timeSlot" | "_count" ? K : never]:
          K extends "timeSlot" ? {
            "timeSlot": GassmaGassmaTimeSlotFindResultBase<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "TimeSlot": infer TO } ? TO extends GassmaGassmaTimeSlotOmit ? TO : {} : {}, O>;
          }[K] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaReservationFindResultCore<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
    ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaReservationDefaultFindResult | "timeSlot" | "_count")]:
          K extends "timeSlot" ? {
            "timeSlot": GassmaGassmaTimeSlotFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "TimeSlot": infer TO } ? TO extends GassmaGassmaTimeSlotOmit ? TO : {} : {}, O, CMap>;
          }[K] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaReservationDefaultFindResult[K & keyof GassmaGassmaReservationDefaultFindResult];
    }
    : {
      [K in keyof GassmaGassmaReservationDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaReservationDefaultFindResult[K];
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "timeSlot" | "_count" ? K : never]:
          K extends "timeSlot" ? {
            "timeSlot": GassmaGassmaTimeSlotFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "TimeSlot": infer TO } ? TO extends GassmaGassmaTimeSlotOmit ? TO : {} : {}, O, CMap>;
          }[K] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaReservationFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = Gassma.WithComputed<
  GassmaGassmaReservationFindResultCore<Gassma.StripComputed<S, Gassma.At<CMap, "Reservation">>, I, QO, GO, O, CMap>,
  Gassma.At<CMap, "Reservation">,
  S,
  QO
>;

export type GassmaGassmaProductFindResultBase<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
    ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaProductDefaultFindResult | "orderItems" | "_count")]:
          K extends "orderItems" ? {
            "orderItems": GassmaGassmaOrderItemFindResultBase<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "OrderItem": infer TO } ? TO extends GassmaGassmaOrderItemOmit ? TO : {} : {}, O>[];
          }[K] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaProductDefaultFindResult[K & keyof GassmaGassmaProductDefaultFindResult];
    }
    : {
      [K in keyof GassmaGassmaProductDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaProductDefaultFindResult[K];
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "orderItems" | "_count" ? K : never]:
          K extends "orderItems" ? {
            "orderItems": GassmaGassmaOrderItemFindResultBase<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "OrderItem": infer TO } ? TO extends GassmaGassmaOrderItemOmit ? TO : {} : {}, O>[];
          }[K] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaProductFindResultCore<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
    ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaProductDefaultFindResult | "orderItems" | "_count")]:
          K extends "orderItems" ? {
            "orderItems": GassmaGassmaOrderItemFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "OrderItem": infer TO } ? TO extends GassmaGassmaOrderItemOmit ? TO : {} : {}, O, CMap>[];
          }[K] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaProductDefaultFindResult[K & keyof GassmaGassmaProductDefaultFindResult];
    }
    : {
      [K in keyof GassmaGassmaProductDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaProductDefaultFindResult[K];
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "orderItems" | "_count" ? K : never]:
          K extends "orderItems" ? {
            "orderItems": GassmaGassmaOrderItemFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "OrderItem": infer TO } ? TO extends GassmaGassmaOrderItemOmit ? TO : {} : {}, O, CMap>[];
          }[K] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaProductFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = Gassma.WithComputed<
  GassmaGassmaProductFindResultCore<Gassma.StripComputed<S, Gassma.At<CMap, "Product">>, I, QO, GO, O, CMap>,
  Gassma.At<CMap, "Product">,
  S,
  QO
>;

export type GassmaGassmaOrderFindResultBase<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
    ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaOrderDefaultFindResult | "user" | "items" | "_count")]:
          K extends "user" | "items" ? {
            "user": GassmaGassmaUserFindResultBase<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "User": infer TO } ? TO extends GassmaGassmaUserOmit ? TO : {} : {}, O>;
            "items": GassmaGassmaOrderItemFindResultBase<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "OrderItem": infer TO } ? TO extends GassmaGassmaOrderItemOmit ? TO : {} : {}, O>[];
          }[K] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaOrderDefaultFindResult[K & keyof GassmaGassmaOrderDefaultFindResult];
    }
    : {
      [K in keyof GassmaGassmaOrderDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaOrderDefaultFindResult[K];
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "user" | "items" | "_count" ? K : never]:
          K extends "user" | "items" ? {
            "user": GassmaGassmaUserFindResultBase<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "User": infer TO } ? TO extends GassmaGassmaUserOmit ? TO : {} : {}, O>;
            "items": GassmaGassmaOrderItemFindResultBase<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "OrderItem": infer TO } ? TO extends GassmaGassmaOrderItemOmit ? TO : {} : {}, O>[];
          }[K] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaOrderFindResultCore<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
    ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaOrderDefaultFindResult | "user" | "items" | "_count")]:
          K extends "user" | "items" ? {
            "user": GassmaGassmaUserFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "User": infer TO } ? TO extends GassmaGassmaUserOmit ? TO : {} : {}, O, CMap>;
            "items": GassmaGassmaOrderItemFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "OrderItem": infer TO } ? TO extends GassmaGassmaOrderItemOmit ? TO : {} : {}, O, CMap>[];
          }[K] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaOrderDefaultFindResult[K & keyof GassmaGassmaOrderDefaultFindResult];
    }
    : {
      [K in keyof GassmaGassmaOrderDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaOrderDefaultFindResult[K];
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "user" | "items" | "_count" ? K : never]:
          K extends "user" | "items" ? {
            "user": GassmaGassmaUserFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "User": infer TO } ? TO extends GassmaGassmaUserOmit ? TO : {} : {}, O, CMap>;
            "items": GassmaGassmaOrderItemFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "OrderItem": infer TO } ? TO extends GassmaGassmaOrderItemOmit ? TO : {} : {}, O, CMap>[];
          }[K] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaOrderFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = Gassma.WithComputed<
  GassmaGassmaOrderFindResultCore<Gassma.StripComputed<S, Gassma.At<CMap, "Order">>, I, QO, GO, O, CMap>,
  Gassma.At<CMap, "Order">,
  S,
  QO
>;

export type GassmaGassmaOrderItemFindResultBase<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
    ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaOrderItemDefaultFindResult | "order" | "product" | "_count")]:
          K extends "order" | "product" ? {
            "order": GassmaGassmaOrderFindResultBase<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Order": infer TO } ? TO extends GassmaGassmaOrderOmit ? TO : {} : {}, O>;
            "product": GassmaGassmaProductFindResultBase<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Product": infer TO } ? TO extends GassmaGassmaProductOmit ? TO : {} : {}, O>;
          }[K] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaOrderItemDefaultFindResult[K & keyof GassmaGassmaOrderItemDefaultFindResult];
    }
    : {
      [K in keyof GassmaGassmaOrderItemDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaOrderItemDefaultFindResult[K];
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "order" | "product" | "_count" ? K : never]:
          K extends "order" | "product" ? {
            "order": GassmaGassmaOrderFindResultBase<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Order": infer TO } ? TO extends GassmaGassmaOrderOmit ? TO : {} : {}, O>;
            "product": GassmaGassmaProductFindResultBase<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Product": infer TO } ? TO extends GassmaGassmaProductOmit ? TO : {} : {}, O>;
          }[K] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaOrderItemFindResultCore<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
    ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaOrderItemDefaultFindResult | "order" | "product" | "_count")]:
          K extends "order" | "product" ? {
            "order": GassmaGassmaOrderFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Order": infer TO } ? TO extends GassmaGassmaOrderOmit ? TO : {} : {}, O, CMap>;
            "product": GassmaGassmaProductFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Product": infer TO } ? TO extends GassmaGassmaProductOmit ? TO : {} : {}, O, CMap>;
          }[K] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaOrderItemDefaultFindResult[K & keyof GassmaGassmaOrderItemDefaultFindResult];
    }
    : {
      [K in keyof GassmaGassmaOrderItemDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaOrderItemDefaultFindResult[K];
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "order" | "product" | "_count" ? K : never]:
          K extends "order" | "product" ? {
            "order": GassmaGassmaOrderFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Order": infer TO } ? TO extends GassmaGassmaOrderOmit ? TO : {} : {}, O, CMap>;
            "product": GassmaGassmaProductFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Product": infer TO } ? TO extends GassmaGassmaProductOmit ? TO : {} : {}, O, CMap>;
          }[K] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaOrderItemFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = Gassma.WithComputed<
  GassmaGassmaOrderItemFindResultCore<Gassma.StripComputed<S, Gassma.At<CMap, "OrderItem">>, I, QO, GO, O, CMap>,
  Gassma.At<CMap, "OrderItem">,
  S,
  QO
>;

export type GassmaGassmaFormulaCellFindResultBase<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
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
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "_count" ? K : never]:

          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaFormulaCellFindResultCore<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
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
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "_count" ? K : never]:

          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaFormulaCellFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = Gassma.WithComputed<
  GassmaGassmaFormulaCellFindResultCore<Gassma.StripComputed<S, Gassma.At<CMap, "FormulaCell">>, I, QO, GO, O, CMap>,
  Gassma.At<CMap, "FormulaCell">,
  S,
  QO
>;

export type GassmaGassmaNotificationFindResultBase<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
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
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "_count" ? K : never]:

          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaNotificationFindResultCore<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
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
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "_count" ? K : never]:

          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaNotificationFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = Gassma.WithComputed<
  GassmaGassmaNotificationFindResultCore<Gassma.StripComputed<S, Gassma.At<CMap, "Notification">>, I, QO, GO, O, CMap>,
  Gassma.At<CMap, "Notification">,
  S,
  QO
>;

export type GassmaGassmaOffsetNoteFindResultBase<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
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
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "_count" ? K : never]:

          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaOffsetNoteFindResultCore<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
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
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "_count" ? K : never]:

          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaOffsetNoteFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = Gassma.WithComputed<
  GassmaGassmaOffsetNoteFindResultCore<Gassma.StripComputed<S, Gassma.At<CMap, "OffsetNote">>, I, QO, GO, O, CMap>,
  Gassma.At<CMap, "OffsetNote">,
  S,
  QO
>;

export type GassmaGassmaUserFindResultBase<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
    ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaUserDefaultFindResult | "posts" | "comments" | "orders" | "profile" | "_count")]:
          K extends "posts" | "comments" | "orders" | "profile" ? {
            "posts": GassmaGassmaPostFindResultBase<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Post": infer TO } ? TO extends GassmaGassmaPostOmit ? TO : {} : {}, O>[];
            "comments": GassmaGassmaCommentFindResultBase<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Comment": infer TO } ? TO extends GassmaGassmaCommentOmit ? TO : {} : {}, O>[];
            "orders": GassmaGassmaOrderFindResultBase<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Order": infer TO } ? TO extends GassmaGassmaOrderOmit ? TO : {} : {}, O>[];
            "profile": GassmaGassmaProfileFindResultBase<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Profile": infer TO } ? TO extends GassmaGassmaProfileOmit ? TO : {} : {}, O> | null;
          }[K] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaUserDefaultFindResult[K & keyof GassmaGassmaUserDefaultFindResult];
    }
    : {
      [K in keyof GassmaGassmaUserDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaUserDefaultFindResult[K];
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "posts" | "comments" | "orders" | "profile" | "_count" ? K : never]:
          K extends "posts" | "comments" | "orders" | "profile" ? {
            "posts": GassmaGassmaPostFindResultBase<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Post": infer TO } ? TO extends GassmaGassmaPostOmit ? TO : {} : {}, O>[];
            "comments": GassmaGassmaCommentFindResultBase<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Comment": infer TO } ? TO extends GassmaGassmaCommentOmit ? TO : {} : {}, O>[];
            "orders": GassmaGassmaOrderFindResultBase<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Order": infer TO } ? TO extends GassmaGassmaOrderOmit ? TO : {} : {}, O>[];
            "profile": GassmaGassmaProfileFindResultBase<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Profile": infer TO } ? TO extends GassmaGassmaProfileOmit ? TO : {} : {}, O> | null;
          }[K] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaUserFindResultCore<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
    ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaUserDefaultFindResult | "posts" | "comments" | "orders" | "profile" | "_count")]:
          K extends "posts" | "comments" | "orders" | "profile" ? {
            "posts": GassmaGassmaPostFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Post": infer TO } ? TO extends GassmaGassmaPostOmit ? TO : {} : {}, O, CMap>[];
            "comments": GassmaGassmaCommentFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Comment": infer TO } ? TO extends GassmaGassmaCommentOmit ? TO : {} : {}, O, CMap>[];
            "orders": GassmaGassmaOrderFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Order": infer TO } ? TO extends GassmaGassmaOrderOmit ? TO : {} : {}, O, CMap>[];
            "profile": GassmaGassmaProfileFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "Profile": infer TO } ? TO extends GassmaGassmaProfileOmit ? TO : {} : {}, O, CMap> | null;
          }[K] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaUserDefaultFindResult[K & keyof GassmaGassmaUserDefaultFindResult];
    }
    : {
      [K in keyof GassmaGassmaUserDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaUserDefaultFindResult[K];
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "posts" | "comments" | "orders" | "profile" | "_count" ? K : never]:
          K extends "posts" | "comments" | "orders" | "profile" ? {
            "posts": GassmaGassmaPostFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Post": infer TO } ? TO extends GassmaGassmaPostOmit ? TO : {} : {}, O, CMap>[];
            "comments": GassmaGassmaCommentFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Comment": infer TO } ? TO extends GassmaGassmaCommentOmit ? TO : {} : {}, O, CMap>[];
            "orders": GassmaGassmaOrderFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Order": infer TO } ? TO extends GassmaGassmaOrderOmit ? TO : {} : {}, O, CMap>[];
            "profile": GassmaGassmaProfileFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "Profile": infer TO } ? TO extends GassmaGassmaProfileOmit ? TO : {} : {}, O, CMap> | null;
          }[K] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaUserFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = Gassma.WithComputed<
  GassmaGassmaUserFindResultCore<Gassma.StripComputed<S, Gassma.At<CMap, "User">>, I, QO, GO, O, CMap>,
  Gassma.At<CMap, "User">,
  S,
  QO
>;

export type GassmaGassmaProfileFindResultBase<S, I = undefined, QO = undefined, GO = {}, O = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
    ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaProfileDefaultFindResult | "user" | "_count")]:
          K extends "user" ? {
            "user": GassmaGassmaUserFindResultBase<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "User": infer TO } ? TO extends GassmaGassmaUserOmit ? TO : {} : {}, O>;
          }[K] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaProfileDefaultFindResult[K & keyof GassmaGassmaProfileDefaultFindResult];
    }
    : {
      [K in keyof GassmaGassmaProfileDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaProfileDefaultFindResult[K];
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "user" | "_count" ? K : never]:
          K extends "user" ? {
            "user": GassmaGassmaUserFindResultBase<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "User": infer TO } ? TO extends GassmaGassmaUserOmit ? TO : {} : {}, O>;
          }[K] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaProfileFindResultCore<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = (S extends unknown
  ? Gassma.SelectGiven<S> extends true
    ? {
      [K in keyof S as S[K] extends false | undefined
        ? never
        : K & (keyof GassmaGassmaProfileDefaultFindResult | "user" | "_count")]:
          K extends "user" ? {
            "user": GassmaGassmaUserFindResult<Gassma.SelectOf<S[K]>, Gassma.IncludeOf<S[K]>, Gassma.OmitOf<S[K]>, O extends { "User": infer TO } ? TO extends GassmaGassmaUserOmit ? TO : {} : {}, O, CMap>;
          }[K] :
          K extends "_count" ? Gassma.CountResult<S[K]> :
          GassmaGassmaProfileDefaultFindResult[K & keyof GassmaGassmaProfileDefaultFindResult];
    }
    : {
      [K in keyof GassmaGassmaProfileDefaultFindResult as K extends Gassma.ResolveOmitKeys<GO, QO>
        ? never
        : K]: GassmaGassmaProfileDefaultFindResult[K];
    }
  : never) &
  (I extends undefined
    ? {}
    : {
        [K in keyof I as K extends "user" | "_count" ? K : never]:
          K extends "user" ? {
            "user": GassmaGassmaUserFindResult<Gassma.SelectOf<I[K]>, Gassma.IncludeOf<I[K]>, Gassma.OmitOf<I[K]>, O extends { "User": infer TO } ? TO extends GassmaGassmaUserOmit ? TO : {} : {}, O, CMap>;
          }[K] :
          K extends "_count" ? Gassma.CountResult<I[K]> :
          never;
      });

export type GassmaGassmaProfileFindResult<S, I = undefined, QO = undefined, GO = {}, O = {}, CMap = {}> = Gassma.WithComputed<
  GassmaGassmaProfileFindResultCore<Gassma.StripComputed<S, Gassma.At<CMap, "Profile">>, I, QO, GO, O, CMap>,
  Gassma.At<CMap, "Profile">,
  S,
  QO
>;

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

export type GassmaGassmaSensorReadingAggregateBaseReturn = {
  "id": number
  "sensorName": string
  "recordedAt": Date
};

export type GassmaGassmaTimeSlotAggregateBaseReturn = {
  "id": number
  "label": string
  "slotAt": Date
};

export type GassmaGassmaReservationAggregateBaseReturn = {
  "id": number
  "guestName": string
  "slotAt": Date
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
    ? T extends true
      ? number
      : { [P in keyof T as T[P] extends true ? P : never]: number }
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
    ? T extends true
      ? number
      : { [P in keyof T as T[P] extends true ? P : never]: number }
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
    ? T extends true
      ? number
      : { [P in keyof T as T[P] extends true ? P : never]: number }
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
    ? T extends true
      ? number
      : { [P in keyof T as T[P] extends true ? P : never]: number }
    : K extends "_avg" | "_sum"
      ? { [P in keyof T as T[P] extends true ? P : never]: number | null }
      : {
          [P in keyof T as T[P] extends true
            ? P & keyof GassmaGassmaTagAggregateBaseReturn
            : never]: GassmaGassmaTagAggregateBaseReturn[P & keyof GassmaGassmaTagAggregateBaseReturn] | null;
        };

export type GassmaGassmaSensorReadingAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? T extends true
      ? number
      : { [P in keyof T as T[P] extends true ? P : never]: number }
    : K extends "_avg" | "_sum"
      ? { [P in keyof T as T[P] extends true ? P : never]: number | null }
      : {
          [P in keyof T as T[P] extends true
            ? P & keyof GassmaGassmaSensorReadingAggregateBaseReturn
            : never]: GassmaGassmaSensorReadingAggregateBaseReturn[P & keyof GassmaGassmaSensorReadingAggregateBaseReturn] | null;
        };

export type GassmaGassmaTimeSlotAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? T extends true
      ? number
      : { [P in keyof T as T[P] extends true ? P : never]: number }
    : K extends "_avg" | "_sum"
      ? { [P in keyof T as T[P] extends true ? P : never]: number | null }
      : {
          [P in keyof T as T[P] extends true
            ? P & keyof GassmaGassmaTimeSlotAggregateBaseReturn
            : never]: GassmaGassmaTimeSlotAggregateBaseReturn[P & keyof GassmaGassmaTimeSlotAggregateBaseReturn] | null;
        };

export type GassmaGassmaReservationAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? T extends true
      ? number
      : { [P in keyof T as T[P] extends true ? P : never]: number }
    : K extends "_avg" | "_sum"
      ? { [P in keyof T as T[P] extends true ? P : never]: number | null }
      : {
          [P in keyof T as T[P] extends true
            ? P & keyof GassmaGassmaReservationAggregateBaseReturn
            : never]: GassmaGassmaReservationAggregateBaseReturn[P & keyof GassmaGassmaReservationAggregateBaseReturn] | null;
        };

export type GassmaGassmaProductAggregateField<T, K extends string> = T extends undefined
  ? never
  : K extends "_count"
    ? T extends true
      ? number
      : { [P in keyof T as T[P] extends true ? P : never]: number }
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
    ? T extends true
      ? number
      : { [P in keyof T as T[P] extends true ? P : never]: number }
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
    ? T extends true
      ? number
      : { [P in keyof T as T[P] extends true ? P : never]: number }
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
    ? T extends true
      ? number
      : { [P in keyof T as T[P] extends true ? P : never]: number }
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
    ? T extends true
      ? number
      : { [P in keyof T as T[P] extends true ? P : never]: number }
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
    ? T extends true
      ? number
      : { [P in keyof T as T[P] extends true ? P : never]: number }
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
    ? T extends true
      ? number
      : { [P in keyof T as T[P] extends true ? P : never]: number }
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
    ? T extends true
      ? number
      : { [P in keyof T as T[P] extends true ? P : never]: number }
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

export type GassmaGassmaSensorReadingAggregateResult<T extends GassmaGassmaSensorReadingAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaSensorReadingAggregateField<T[K], K> : never;
};

export type GassmaGassmaTimeSlotAggregateResult<T extends GassmaGassmaTimeSlotAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaTimeSlotAggregateField<T[K], K> : never;
};

export type GassmaGassmaReservationAggregateResult<T extends GassmaGassmaReservationAggregateData> = {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaReservationAggregateField<T[K], K> : never;
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

export type GassmaGassmaSensorReadingGroupByBaseReturn = GassmaGassmaSensorReadingCreateReturn;

export type GassmaGassmaTimeSlotGroupByBaseReturn = GassmaGassmaTimeSlotCreateReturn;

export type GassmaGassmaReservationGroupByBaseReturn = GassmaGassmaReservationCreateReturn;

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

export type GassmaGassmaSensorReadingGroupByKeyOfBaseReturn = keyof GassmaGassmaSensorReadingGroupByBaseReturn;

export type GassmaGassmaTimeSlotGroupByKeyOfBaseReturn = keyof GassmaGassmaTimeSlotGroupByBaseReturn;

export type GassmaGassmaReservationGroupByKeyOfBaseReturn = keyof GassmaGassmaReservationGroupByBaseReturn;

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

export type GassmaGassmaSensorReadingByField<T extends GassmaGassmaSensorReadingGroupByKeyOfBaseReturn | GassmaGassmaSensorReadingGroupByKeyOfBaseReturn[]> =
  T extends GassmaGassmaSensorReadingGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaGassmaSensorReadingGroupByBaseReturn[K & keyof GassmaGassmaSensorReadingGroupByBaseReturn];
      }
    : T extends keyof GassmaGassmaSensorReadingGroupByBaseReturn
      ? { [K in T]: GassmaGassmaSensorReadingGroupByBaseReturn[K] }
      : never;

export type GassmaGassmaTimeSlotByField<T extends GassmaGassmaTimeSlotGroupByKeyOfBaseReturn | GassmaGassmaTimeSlotGroupByKeyOfBaseReturn[]> =
  T extends GassmaGassmaTimeSlotGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaGassmaTimeSlotGroupByBaseReturn[K & keyof GassmaGassmaTimeSlotGroupByBaseReturn];
      }
    : T extends keyof GassmaGassmaTimeSlotGroupByBaseReturn
      ? { [K in T]: GassmaGassmaTimeSlotGroupByBaseReturn[K] }
      : never;

export type GassmaGassmaReservationByField<T extends GassmaGassmaReservationGroupByKeyOfBaseReturn | GassmaGassmaReservationGroupByKeyOfBaseReturn[]> =
  T extends GassmaGassmaReservationGroupByKeyOfBaseReturn[]
    ? {
        [K in T[number]]: GassmaGassmaReservationGroupByBaseReturn[K & keyof GassmaGassmaReservationGroupByBaseReturn];
      }
    : T extends keyof GassmaGassmaReservationGroupByBaseReturn
      ? { [K in T]: GassmaGassmaReservationGroupByBaseReturn[K] }
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

export type GassmaGassmaSensorReadingGroupByResult<T extends GassmaGassmaSensorReadingGroupByData> = GassmaGassmaSensorReadingByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaSensorReadingAggregateField<T[K], K> : never;
};

export type GassmaGassmaTimeSlotGroupByResult<T extends GassmaGassmaTimeSlotGroupByData> = GassmaGassmaTimeSlotByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaTimeSlotAggregateField<T[K], K> : never;
};

export type GassmaGassmaReservationGroupByResult<T extends GassmaGassmaReservationGroupByData> = GassmaGassmaReservationByField<T["by"]> & {
  [K in keyof T as K extends "_avg" | "_count" | "_max" | "_min" | "_sum"
    ? T[K] extends undefined
      ? never
      : K
    : never]: K extends string ? GassmaGassmaReservationAggregateField<T[K], K> : never;
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
  | "SensorReading"
  | "TimeSlot"
  | "Reservation"
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
  | GassmaGassmaPostUpdateManyAndReturnData
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
    query: (args: T) => GassmaGassmaPostFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaPostFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaPostFindFirstData>(params: {
    model: "Post";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaPostFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaPostFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaPostFindManyData>(params: {
    model: "Post";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaPostFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaPostFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaPostCreateData>(params: {
    model: "Post";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaPostFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaPostFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
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
    query: (args: T) => GassmaGassmaPostFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaPostFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaPostUpdateSingleData>(params: {
    model: "Post";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaPostFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaPostFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "Post";
    operation: "updateMany";
    args: GassmaGassmaPostUpdateData;
    query: (args: GassmaGassmaPostUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: <T extends GassmaGassmaPostUpdateManyAndReturnData>(params: {
    model: "Post";
    operation: "updateManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaPostFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaPostFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  upsert?: <T extends GassmaGassmaPostUpsertSingleData>(params: {
    model: "Post";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaPostFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaPostFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaPostDeleteSingleData>(params: {
    model: "Post";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaPostFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaPostFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "Post";
    operation: "deleteMany";
    args: GassmaGassmaPostDeleteData;
    query: (args: GassmaGassmaPostDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: <T extends GassmaGassmaPostCountData>(params: {
    model: "Post";
    operation: "count";
    args: T;
    query: (args: T) => GassmaGassmaPostCountResult<T>;
  }) => GassmaGassmaPostCountResult<T>;
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
  | GassmaGassmaCommentUpdateManyAndReturnData
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
    query: (args: T) => GassmaGassmaCommentFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaCommentFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaCommentFindFirstData>(params: {
    model: "Comment";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaCommentFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaCommentFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaCommentFindManyData>(params: {
    model: "Comment";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaCommentFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaCommentFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaCommentCreateData>(params: {
    model: "Comment";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaCommentFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaCommentFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
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
    query: (args: T) => GassmaGassmaCommentFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaCommentFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaCommentUpdateSingleData>(params: {
    model: "Comment";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaCommentFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaCommentFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "Comment";
    operation: "updateMany";
    args: GassmaGassmaCommentUpdateData;
    query: (args: GassmaGassmaCommentUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: <T extends GassmaGassmaCommentUpdateManyAndReturnData>(params: {
    model: "Comment";
    operation: "updateManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaCommentFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaCommentFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  upsert?: <T extends GassmaGassmaCommentUpsertSingleData>(params: {
    model: "Comment";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaCommentFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaCommentFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaCommentDeleteSingleData>(params: {
    model: "Comment";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaCommentFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaCommentFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "Comment";
    operation: "deleteMany";
    args: GassmaGassmaCommentDeleteData;
    query: (args: GassmaGassmaCommentDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: <T extends GassmaGassmaCommentCountData>(params: {
    model: "Comment";
    operation: "count";
    args: T;
    query: (args: T) => GassmaGassmaCommentCountResult<T>;
  }) => GassmaGassmaCommentCountResult<T>;
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
  | GassmaGassmaCategoryUpdateManyAndReturnData
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
    query: (args: T) => GassmaGassmaCategoryFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaCategoryFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaCategoryFindFirstData>(params: {
    model: "Category";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaCategoryFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaCategoryFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaCategoryFindManyData>(params: {
    model: "Category";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaCategoryFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaCategoryFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaCategoryCreateData>(params: {
    model: "Category";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaCategoryFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaCategoryFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
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
    query: (args: T) => GassmaGassmaCategoryFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaCategoryFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaCategoryUpdateSingleData>(params: {
    model: "Category";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaCategoryFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaCategoryFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "Category";
    operation: "updateMany";
    args: GassmaGassmaCategoryUpdateData;
    query: (args: GassmaGassmaCategoryUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: <T extends GassmaGassmaCategoryUpdateManyAndReturnData>(params: {
    model: "Category";
    operation: "updateManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaCategoryFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaCategoryFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  upsert?: <T extends GassmaGassmaCategoryUpsertSingleData>(params: {
    model: "Category";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaCategoryFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaCategoryFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaCategoryDeleteSingleData>(params: {
    model: "Category";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaCategoryFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaCategoryFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "Category";
    operation: "deleteMany";
    args: GassmaGassmaCategoryDeleteData;
    query: (args: GassmaGassmaCategoryDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: <T extends GassmaGassmaCategoryCountData>(params: {
    model: "Category";
    operation: "count";
    args: T;
    query: (args: T) => GassmaGassmaCategoryCountResult<T>;
  }) => GassmaGassmaCategoryCountResult<T>;
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
  | GassmaGassmaTagUpdateManyAndReturnData
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
    query: (args: T) => GassmaGassmaTagFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaTagFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaTagFindFirstData>(params: {
    model: "Tag";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaTagFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaTagFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaTagFindManyData>(params: {
    model: "Tag";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaTagFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaTagFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaTagCreateData>(params: {
    model: "Tag";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaTagFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaTagFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
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
    query: (args: T) => GassmaGassmaTagFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaTagFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaTagUpdateSingleData>(params: {
    model: "Tag";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaTagFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaTagFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "Tag";
    operation: "updateMany";
    args: GassmaGassmaTagUpdateData;
    query: (args: GassmaGassmaTagUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: <T extends GassmaGassmaTagUpdateManyAndReturnData>(params: {
    model: "Tag";
    operation: "updateManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaTagFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaTagFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  upsert?: <T extends GassmaGassmaTagUpsertSingleData>(params: {
    model: "Tag";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaTagFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaTagFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaTagDeleteSingleData>(params: {
    model: "Tag";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaTagFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaTagFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "Tag";
    operation: "deleteMany";
    args: GassmaGassmaTagDeleteData;
    query: (args: GassmaGassmaTagDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: <T extends GassmaGassmaTagCountData>(params: {
    model: "Tag";
    operation: "count";
    args: T;
    query: (args: T) => GassmaGassmaTagCountResult<T>;
  }) => GassmaGassmaTagCountResult<T>;
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

export type GassmaGassmaSensorReadingQueryArgs =
  | GassmaGassmaSensorReadingFindFirstData
  | GassmaGassmaSensorReadingFindManyData
  | GassmaGassmaSensorReadingCreateData
  | GassmaGassmaSensorReadingCreateManyData
  | GassmaGassmaSensorReadingCreateManyAndReturnData
  | GassmaGassmaSensorReadingUpdateSingleData
  | GassmaGassmaSensorReadingUpdateData
  | GassmaGassmaSensorReadingUpdateManyAndReturnData
  | GassmaGassmaSensorReadingUpsertSingleData
  | GassmaGassmaSensorReadingDeleteSingleData
  | GassmaGassmaSensorReadingDeleteData
  | GassmaGassmaSensorReadingCountData
  | GassmaGassmaSensorReadingAggregateData
  | GassmaGassmaSensorReadingGroupByData;

export type GassmaGassmaSensorReadingQueryHooks<GO extends GassmaGassmaSensorReadingOmit = {}, O = {}> = {
  findFirst?: <T extends GassmaGassmaSensorReadingFindFirstData>(params: {
    model: "SensorReading";
    operation: "findFirst";
    args: T;
    query: (args: T) => GassmaGassmaSensorReadingFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaSensorReadingFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaSensorReadingFindFirstData>(params: {
    model: "SensorReading";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaSensorReadingFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaSensorReadingFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaSensorReadingFindManyData>(params: {
    model: "SensorReading";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaSensorReadingFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaSensorReadingFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaSensorReadingCreateData>(params: {
    model: "SensorReading";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaSensorReadingFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaSensorReadingFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  createMany?: (params: {
    model: "SensorReading";
    operation: "createMany";
    args: GassmaGassmaSensorReadingCreateManyData;
    query: (args: GassmaGassmaSensorReadingCreateManyData) => CreateManyReturn;
  }) => CreateManyReturn;
  createManyAndReturn?: <T extends GassmaGassmaSensorReadingCreateManyAndReturnData>(params: {
    model: "SensorReading";
    operation: "createManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaSensorReadingFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaSensorReadingFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaSensorReadingUpdateSingleData>(params: {
    model: "SensorReading";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaSensorReadingFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaSensorReadingFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "SensorReading";
    operation: "updateMany";
    args: GassmaGassmaSensorReadingUpdateData;
    query: (args: GassmaGassmaSensorReadingUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: <T extends GassmaGassmaSensorReadingUpdateManyAndReturnData>(params: {
    model: "SensorReading";
    operation: "updateManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaSensorReadingFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaSensorReadingFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  upsert?: <T extends GassmaGassmaSensorReadingUpsertSingleData>(params: {
    model: "SensorReading";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaSensorReadingFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaSensorReadingFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaSensorReadingDeleteSingleData>(params: {
    model: "SensorReading";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaSensorReadingFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaSensorReadingFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "SensorReading";
    operation: "deleteMany";
    args: GassmaGassmaSensorReadingDeleteData;
    query: (args: GassmaGassmaSensorReadingDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: <T extends GassmaGassmaSensorReadingCountData>(params: {
    model: "SensorReading";
    operation: "count";
    args: T;
    query: (args: T) => GassmaGassmaSensorReadingCountResult<T>;
  }) => GassmaGassmaSensorReadingCountResult<T>;
  aggregate?: <T extends GassmaGassmaSensorReadingAggregateData>(params: {
    model: "SensorReading";
    operation: "aggregate";
    args: T;
    query: (args: T) => GassmaGassmaSensorReadingAggregateResult<T>;
  }) => GassmaGassmaSensorReadingAggregateResult<T>;
  groupBy?: <T extends GassmaGassmaSensorReadingGroupByData>(params: {
    model: "SensorReading";
    operation: "groupBy";
    args: T;
    query: (args: T) => GassmaGassmaSensorReadingGroupByResult<T>[];
  }) => GassmaGassmaSensorReadingGroupByResult<T>[];
  $allOperations?: (params: {
    model: "SensorReading";
    operation: GassmaGassmaOperationName;
    args: GassmaGassmaSensorReadingQueryArgs;
    query: (args: GassmaGassmaSensorReadingQueryArgs) => unknown;
  }) => unknown;
};

export type GassmaGassmaTimeSlotQueryArgs =
  | GassmaGassmaTimeSlotFindFirstData
  | GassmaGassmaTimeSlotFindManyData
  | GassmaGassmaTimeSlotCreateData
  | GassmaGassmaTimeSlotCreateManyData
  | GassmaGassmaTimeSlotCreateManyAndReturnData
  | GassmaGassmaTimeSlotUpdateSingleData
  | GassmaGassmaTimeSlotUpdateData
  | GassmaGassmaTimeSlotUpdateManyAndReturnData
  | GassmaGassmaTimeSlotUpsertSingleData
  | GassmaGassmaTimeSlotDeleteSingleData
  | GassmaGassmaTimeSlotDeleteData
  | GassmaGassmaTimeSlotCountData
  | GassmaGassmaTimeSlotAggregateData
  | GassmaGassmaTimeSlotGroupByData;

export type GassmaGassmaTimeSlotQueryHooks<GO extends GassmaGassmaTimeSlotOmit = {}, O = {}> = {
  findFirst?: <T extends GassmaGassmaTimeSlotFindFirstData>(params: {
    model: "TimeSlot";
    operation: "findFirst";
    args: T;
    query: (args: T) => GassmaGassmaTimeSlotFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaTimeSlotFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaTimeSlotFindFirstData>(params: {
    model: "TimeSlot";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaTimeSlotFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaTimeSlotFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaTimeSlotFindManyData>(params: {
    model: "TimeSlot";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaTimeSlotFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaTimeSlotFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaTimeSlotCreateData>(params: {
    model: "TimeSlot";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaTimeSlotFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaTimeSlotFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  createMany?: (params: {
    model: "TimeSlot";
    operation: "createMany";
    args: GassmaGassmaTimeSlotCreateManyData;
    query: (args: GassmaGassmaTimeSlotCreateManyData) => CreateManyReturn;
  }) => CreateManyReturn;
  createManyAndReturn?: <T extends GassmaGassmaTimeSlotCreateManyAndReturnData>(params: {
    model: "TimeSlot";
    operation: "createManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaTimeSlotFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaTimeSlotFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaTimeSlotUpdateSingleData>(params: {
    model: "TimeSlot";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaTimeSlotFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaTimeSlotFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "TimeSlot";
    operation: "updateMany";
    args: GassmaGassmaTimeSlotUpdateData;
    query: (args: GassmaGassmaTimeSlotUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: <T extends GassmaGassmaTimeSlotUpdateManyAndReturnData>(params: {
    model: "TimeSlot";
    operation: "updateManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaTimeSlotFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaTimeSlotFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  upsert?: <T extends GassmaGassmaTimeSlotUpsertSingleData>(params: {
    model: "TimeSlot";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaTimeSlotFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaTimeSlotFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaTimeSlotDeleteSingleData>(params: {
    model: "TimeSlot";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaTimeSlotFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaTimeSlotFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "TimeSlot";
    operation: "deleteMany";
    args: GassmaGassmaTimeSlotDeleteData;
    query: (args: GassmaGassmaTimeSlotDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: <T extends GassmaGassmaTimeSlotCountData>(params: {
    model: "TimeSlot";
    operation: "count";
    args: T;
    query: (args: T) => GassmaGassmaTimeSlotCountResult<T>;
  }) => GassmaGassmaTimeSlotCountResult<T>;
  aggregate?: <T extends GassmaGassmaTimeSlotAggregateData>(params: {
    model: "TimeSlot";
    operation: "aggregate";
    args: T;
    query: (args: T) => GassmaGassmaTimeSlotAggregateResult<T>;
  }) => GassmaGassmaTimeSlotAggregateResult<T>;
  groupBy?: <T extends GassmaGassmaTimeSlotGroupByData>(params: {
    model: "TimeSlot";
    operation: "groupBy";
    args: T;
    query: (args: T) => GassmaGassmaTimeSlotGroupByResult<T>[];
  }) => GassmaGassmaTimeSlotGroupByResult<T>[];
  $allOperations?: (params: {
    model: "TimeSlot";
    operation: GassmaGassmaOperationName;
    args: GassmaGassmaTimeSlotQueryArgs;
    query: (args: GassmaGassmaTimeSlotQueryArgs) => unknown;
  }) => unknown;
};

export type GassmaGassmaReservationQueryArgs =
  | GassmaGassmaReservationFindFirstData
  | GassmaGassmaReservationFindManyData
  | GassmaGassmaReservationCreateData
  | GassmaGassmaReservationCreateManyData
  | GassmaGassmaReservationCreateManyAndReturnData
  | GassmaGassmaReservationUpdateSingleData
  | GassmaGassmaReservationUpdateData
  | GassmaGassmaReservationUpdateManyAndReturnData
  | GassmaGassmaReservationUpsertSingleData
  | GassmaGassmaReservationDeleteSingleData
  | GassmaGassmaReservationDeleteData
  | GassmaGassmaReservationCountData
  | GassmaGassmaReservationAggregateData
  | GassmaGassmaReservationGroupByData;

export type GassmaGassmaReservationQueryHooks<GO extends GassmaGassmaReservationOmit = {}, O = {}> = {
  findFirst?: <T extends GassmaGassmaReservationFindFirstData>(params: {
    model: "Reservation";
    operation: "findFirst";
    args: T;
    query: (args: T) => GassmaGassmaReservationFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaReservationFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaReservationFindFirstData>(params: {
    model: "Reservation";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaReservationFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaReservationFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaReservationFindManyData>(params: {
    model: "Reservation";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaReservationFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaReservationFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaReservationCreateData>(params: {
    model: "Reservation";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaReservationFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaReservationFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  createMany?: (params: {
    model: "Reservation";
    operation: "createMany";
    args: GassmaGassmaReservationCreateManyData;
    query: (args: GassmaGassmaReservationCreateManyData) => CreateManyReturn;
  }) => CreateManyReturn;
  createManyAndReturn?: <T extends GassmaGassmaReservationCreateManyAndReturnData>(params: {
    model: "Reservation";
    operation: "createManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaReservationFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaReservationFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaReservationUpdateSingleData>(params: {
    model: "Reservation";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaReservationFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaReservationFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "Reservation";
    operation: "updateMany";
    args: GassmaGassmaReservationUpdateData;
    query: (args: GassmaGassmaReservationUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: <T extends GassmaGassmaReservationUpdateManyAndReturnData>(params: {
    model: "Reservation";
    operation: "updateManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaReservationFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaReservationFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  upsert?: <T extends GassmaGassmaReservationUpsertSingleData>(params: {
    model: "Reservation";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaReservationFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaReservationFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaReservationDeleteSingleData>(params: {
    model: "Reservation";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaReservationFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaReservationFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "Reservation";
    operation: "deleteMany";
    args: GassmaGassmaReservationDeleteData;
    query: (args: GassmaGassmaReservationDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: <T extends GassmaGassmaReservationCountData>(params: {
    model: "Reservation";
    operation: "count";
    args: T;
    query: (args: T) => GassmaGassmaReservationCountResult<T>;
  }) => GassmaGassmaReservationCountResult<T>;
  aggregate?: <T extends GassmaGassmaReservationAggregateData>(params: {
    model: "Reservation";
    operation: "aggregate";
    args: T;
    query: (args: T) => GassmaGassmaReservationAggregateResult<T>;
  }) => GassmaGassmaReservationAggregateResult<T>;
  groupBy?: <T extends GassmaGassmaReservationGroupByData>(params: {
    model: "Reservation";
    operation: "groupBy";
    args: T;
    query: (args: T) => GassmaGassmaReservationGroupByResult<T>[];
  }) => GassmaGassmaReservationGroupByResult<T>[];
  $allOperations?: (params: {
    model: "Reservation";
    operation: GassmaGassmaOperationName;
    args: GassmaGassmaReservationQueryArgs;
    query: (args: GassmaGassmaReservationQueryArgs) => unknown;
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
  | GassmaGassmaProductUpdateManyAndReturnData
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
    query: (args: T) => GassmaGassmaProductFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaProductFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaProductFindFirstData>(params: {
    model: "Product";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaProductFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaProductFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaProductFindManyData>(params: {
    model: "Product";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaProductFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaProductFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaProductCreateData>(params: {
    model: "Product";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaProductFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaProductFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
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
    query: (args: T) => GassmaGassmaProductFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaProductFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaProductUpdateSingleData>(params: {
    model: "Product";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaProductFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaProductFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "Product";
    operation: "updateMany";
    args: GassmaGassmaProductUpdateData;
    query: (args: GassmaGassmaProductUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: <T extends GassmaGassmaProductUpdateManyAndReturnData>(params: {
    model: "Product";
    operation: "updateManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaProductFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaProductFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  upsert?: <T extends GassmaGassmaProductUpsertSingleData>(params: {
    model: "Product";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaProductFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaProductFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaProductDeleteSingleData>(params: {
    model: "Product";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaProductFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaProductFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "Product";
    operation: "deleteMany";
    args: GassmaGassmaProductDeleteData;
    query: (args: GassmaGassmaProductDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: <T extends GassmaGassmaProductCountData>(params: {
    model: "Product";
    operation: "count";
    args: T;
    query: (args: T) => GassmaGassmaProductCountResult<T>;
  }) => GassmaGassmaProductCountResult<T>;
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
  | GassmaGassmaOrderUpdateManyAndReturnData
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
    query: (args: T) => GassmaGassmaOrderFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaOrderFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaOrderFindFirstData>(params: {
    model: "Order";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaOrderFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaOrderFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaOrderFindManyData>(params: {
    model: "Order";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaOrderFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaOrderFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaOrderCreateData>(params: {
    model: "Order";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaOrderFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaOrderFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
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
    query: (args: T) => GassmaGassmaOrderFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaOrderFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaOrderUpdateSingleData>(params: {
    model: "Order";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaOrderFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaOrderFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "Order";
    operation: "updateMany";
    args: GassmaGassmaOrderUpdateData;
    query: (args: GassmaGassmaOrderUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: <T extends GassmaGassmaOrderUpdateManyAndReturnData>(params: {
    model: "Order";
    operation: "updateManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaOrderFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaOrderFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  upsert?: <T extends GassmaGassmaOrderUpsertSingleData>(params: {
    model: "Order";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaOrderFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaOrderFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaOrderDeleteSingleData>(params: {
    model: "Order";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaOrderFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaOrderFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "Order";
    operation: "deleteMany";
    args: GassmaGassmaOrderDeleteData;
    query: (args: GassmaGassmaOrderDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: <T extends GassmaGassmaOrderCountData>(params: {
    model: "Order";
    operation: "count";
    args: T;
    query: (args: T) => GassmaGassmaOrderCountResult<T>;
  }) => GassmaGassmaOrderCountResult<T>;
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
  | GassmaGassmaOrderItemUpdateManyAndReturnData
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
    query: (args: T) => GassmaGassmaOrderItemFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaOrderItemFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaOrderItemFindFirstData>(params: {
    model: "OrderItem";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaOrderItemFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaOrderItemFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaOrderItemFindManyData>(params: {
    model: "OrderItem";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaOrderItemFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaOrderItemFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaOrderItemCreateData>(params: {
    model: "OrderItem";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaOrderItemFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaOrderItemFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
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
    query: (args: T) => GassmaGassmaOrderItemFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaOrderItemFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaOrderItemUpdateSingleData>(params: {
    model: "OrderItem";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaOrderItemFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaOrderItemFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "OrderItem";
    operation: "updateMany";
    args: GassmaGassmaOrderItemUpdateData;
    query: (args: GassmaGassmaOrderItemUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: <T extends GassmaGassmaOrderItemUpdateManyAndReturnData>(params: {
    model: "OrderItem";
    operation: "updateManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaOrderItemFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaOrderItemFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  upsert?: <T extends GassmaGassmaOrderItemUpsertSingleData>(params: {
    model: "OrderItem";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaOrderItemFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaOrderItemFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaOrderItemDeleteSingleData>(params: {
    model: "OrderItem";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaOrderItemFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaOrderItemFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "OrderItem";
    operation: "deleteMany";
    args: GassmaGassmaOrderItemDeleteData;
    query: (args: GassmaGassmaOrderItemDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: <T extends GassmaGassmaOrderItemCountData>(params: {
    model: "OrderItem";
    operation: "count";
    args: T;
    query: (args: T) => GassmaGassmaOrderItemCountResult<T>;
  }) => GassmaGassmaOrderItemCountResult<T>;
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
  | GassmaGassmaFormulaCellUpdateManyAndReturnData
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
    query: (args: T) => GassmaGassmaFormulaCellFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaFormulaCellFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaFormulaCellFindFirstData>(params: {
    model: "FormulaCell";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaFormulaCellFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaFormulaCellFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaFormulaCellFindManyData>(params: {
    model: "FormulaCell";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaFormulaCellFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaFormulaCellFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaFormulaCellCreateData>(params: {
    model: "FormulaCell";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaFormulaCellFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaFormulaCellFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
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
    query: (args: T) => GassmaGassmaFormulaCellFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaFormulaCellFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaFormulaCellUpdateSingleData>(params: {
    model: "FormulaCell";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaFormulaCellFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaFormulaCellFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "FormulaCell";
    operation: "updateMany";
    args: GassmaGassmaFormulaCellUpdateData;
    query: (args: GassmaGassmaFormulaCellUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: <T extends GassmaGassmaFormulaCellUpdateManyAndReturnData>(params: {
    model: "FormulaCell";
    operation: "updateManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaFormulaCellFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaFormulaCellFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  upsert?: <T extends GassmaGassmaFormulaCellUpsertSingleData>(params: {
    model: "FormulaCell";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaFormulaCellFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaFormulaCellFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaFormulaCellDeleteSingleData>(params: {
    model: "FormulaCell";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaFormulaCellFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaFormulaCellFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "FormulaCell";
    operation: "deleteMany";
    args: GassmaGassmaFormulaCellDeleteData;
    query: (args: GassmaGassmaFormulaCellDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: <T extends GassmaGassmaFormulaCellCountData>(params: {
    model: "FormulaCell";
    operation: "count";
    args: T;
    query: (args: T) => GassmaGassmaFormulaCellCountResult<T>;
  }) => GassmaGassmaFormulaCellCountResult<T>;
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
  | GassmaGassmaNotificationUpdateManyAndReturnData
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
    query: (args: T) => GassmaGassmaNotificationFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaNotificationFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaNotificationFindFirstData>(params: {
    model: "Notification";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaNotificationFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaNotificationFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaNotificationFindManyData>(params: {
    model: "Notification";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaNotificationFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaNotificationFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaNotificationCreateData>(params: {
    model: "Notification";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaNotificationFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaNotificationFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
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
    query: (args: T) => GassmaGassmaNotificationFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaNotificationFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaNotificationUpdateSingleData>(params: {
    model: "Notification";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaNotificationFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaNotificationFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "Notification";
    operation: "updateMany";
    args: GassmaGassmaNotificationUpdateData;
    query: (args: GassmaGassmaNotificationUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: <T extends GassmaGassmaNotificationUpdateManyAndReturnData>(params: {
    model: "Notification";
    operation: "updateManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaNotificationFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaNotificationFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  upsert?: <T extends GassmaGassmaNotificationUpsertSingleData>(params: {
    model: "Notification";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaNotificationFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaNotificationFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaNotificationDeleteSingleData>(params: {
    model: "Notification";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaNotificationFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaNotificationFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "Notification";
    operation: "deleteMany";
    args: GassmaGassmaNotificationDeleteData;
    query: (args: GassmaGassmaNotificationDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: <T extends GassmaGassmaNotificationCountData>(params: {
    model: "Notification";
    operation: "count";
    args: T;
    query: (args: T) => GassmaGassmaNotificationCountResult<T>;
  }) => GassmaGassmaNotificationCountResult<T>;
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
  | GassmaGassmaOffsetNoteUpdateManyAndReturnData
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
    query: (args: T) => GassmaGassmaOffsetNoteFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaOffsetNoteFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaOffsetNoteFindFirstData>(params: {
    model: "OffsetNote";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaOffsetNoteFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaOffsetNoteFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaOffsetNoteFindManyData>(params: {
    model: "OffsetNote";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaOffsetNoteFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaOffsetNoteFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaOffsetNoteCreateData>(params: {
    model: "OffsetNote";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaOffsetNoteFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaOffsetNoteFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
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
    query: (args: T) => GassmaGassmaOffsetNoteFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaOffsetNoteFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaOffsetNoteUpdateSingleData>(params: {
    model: "OffsetNote";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaOffsetNoteFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaOffsetNoteFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "OffsetNote";
    operation: "updateMany";
    args: GassmaGassmaOffsetNoteUpdateData;
    query: (args: GassmaGassmaOffsetNoteUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: <T extends GassmaGassmaOffsetNoteUpdateManyAndReturnData>(params: {
    model: "OffsetNote";
    operation: "updateManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaOffsetNoteFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaOffsetNoteFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  upsert?: <T extends GassmaGassmaOffsetNoteUpsertSingleData>(params: {
    model: "OffsetNote";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaOffsetNoteFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaOffsetNoteFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaOffsetNoteDeleteSingleData>(params: {
    model: "OffsetNote";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaOffsetNoteFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaOffsetNoteFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "OffsetNote";
    operation: "deleteMany";
    args: GassmaGassmaOffsetNoteDeleteData;
    query: (args: GassmaGassmaOffsetNoteDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: <T extends GassmaGassmaOffsetNoteCountData>(params: {
    model: "OffsetNote";
    operation: "count";
    args: T;
    query: (args: T) => GassmaGassmaOffsetNoteCountResult<T>;
  }) => GassmaGassmaOffsetNoteCountResult<T>;
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
  | GassmaGassmaUserUpdateManyAndReturnData
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
    query: (args: T) => GassmaGassmaUserFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaUserFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaUserFindFirstData>(params: {
    model: "User";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaUserFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaUserFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaUserFindManyData>(params: {
    model: "User";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaUserFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaUserFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaUserCreateData>(params: {
    model: "User";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaUserFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaUserFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
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
    query: (args: T) => GassmaGassmaUserFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaUserFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaUserUpdateSingleData>(params: {
    model: "User";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaUserFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaUserFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "User";
    operation: "updateMany";
    args: GassmaGassmaUserUpdateData;
    query: (args: GassmaGassmaUserUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: <T extends GassmaGassmaUserUpdateManyAndReturnData>(params: {
    model: "User";
    operation: "updateManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaUserFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaUserFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  upsert?: <T extends GassmaGassmaUserUpsertSingleData>(params: {
    model: "User";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaUserFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaUserFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaUserDeleteSingleData>(params: {
    model: "User";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaUserFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaUserFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "User";
    operation: "deleteMany";
    args: GassmaGassmaUserDeleteData;
    query: (args: GassmaGassmaUserDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: <T extends GassmaGassmaUserCountData>(params: {
    model: "User";
    operation: "count";
    args: T;
    query: (args: T) => GassmaGassmaUserCountResult<T>;
  }) => GassmaGassmaUserCountResult<T>;
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
  | GassmaGassmaProfileUpdateManyAndReturnData
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
    query: (args: T) => GassmaGassmaProfileFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaProfileFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  findFirstOrThrow?: <T extends GassmaGassmaProfileFindFirstData>(params: {
    model: "Profile";
    operation: "findFirstOrThrow";
    args: T;
    query: (args: T) => GassmaGassmaProfileFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaProfileFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  findMany?: <T extends GassmaGassmaProfileFindManyData>(params: {
    model: "Profile";
    operation: "findMany";
    args: T;
    query: (args: T) => GassmaGassmaProfileFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaProfileFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  create?: <T extends GassmaGassmaProfileCreateData>(params: {
    model: "Profile";
    operation: "create";
    args: T;
    query: (args: T) => GassmaGassmaProfileFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaProfileFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
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
    query: (args: T) => GassmaGassmaProfileFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaProfileFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  update?: <T extends GassmaGassmaProfileUpdateSingleData>(params: {
    model: "Profile";
    operation: "update";
    args: T;
    query: (args: T) => GassmaGassmaProfileFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaProfileFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  updateMany?: (params: {
    model: "Profile";
    operation: "updateMany";
    args: GassmaGassmaProfileUpdateData;
    query: (args: GassmaGassmaProfileUpdateData) => UpdateManyReturn;
  }) => UpdateManyReturn;
  updateManyAndReturn?: <T extends GassmaGassmaProfileUpdateManyAndReturnData>(params: {
    model: "Profile";
    operation: "updateManyAndReturn";
    args: T;
    query: (args: T) => GassmaGassmaProfileFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  }) => GassmaGassmaProfileFindResultBase<T["select"], T["include"], T["omit"], GO, O>[];
  upsert?: <T extends GassmaGassmaProfileUpsertSingleData>(params: {
    model: "Profile";
    operation: "upsert";
    args: T;
    query: (args: T) => GassmaGassmaProfileFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  }) => GassmaGassmaProfileFindResultBase<T["select"], T["include"], T["omit"], GO, O>;
  delete?: <T extends GassmaGassmaProfileDeleteSingleData>(params: {
    model: "Profile";
    operation: "delete";
    args: T;
    query: (args: T) => GassmaGassmaProfileFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  }) => GassmaGassmaProfileFindResultBase<T["select"], T["include"], T["omit"], GO, O> | null;
  deleteMany?: (params: {
    model: "Profile";
    operation: "deleteMany";
    args: GassmaGassmaProfileDeleteData;
    query: (args: GassmaGassmaProfileDeleteData) => DeleteManyReturn;
  }) => DeleteManyReturn;
  count?: <T extends GassmaGassmaProfileCountData>(params: {
    model: "Profile";
    operation: "count";
    args: T;
    query: (args: T) => GassmaGassmaProfileCountResult<T>;
  }) => GassmaGassmaProfileCountResult<T>;
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
  | GassmaGassmaSensorReadingQueryArgs
  | GassmaGassmaTimeSlotQueryArgs
  | GassmaGassmaReservationQueryArgs
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
    args: GassmaGassmaPostFindFirstData | GassmaGassmaCommentFindFirstData | GassmaGassmaCategoryFindFirstData | GassmaGassmaTagFindFirstData | GassmaGassmaSensorReadingFindFirstData | GassmaGassmaTimeSlotFindFirstData | GassmaGassmaReservationFindFirstData | GassmaGassmaProductFindFirstData | GassmaGassmaOrderFindFirstData | GassmaGassmaOrderItemFindFirstData | GassmaGassmaFormulaCellFindFirstData | GassmaGassmaNotificationFindFirstData | GassmaGassmaOffsetNoteFindFirstData | GassmaGassmaUserFindFirstData | GassmaGassmaProfileFindFirstData;
    query: (args: GassmaGassmaPostFindFirstData | GassmaGassmaCommentFindFirstData | GassmaGassmaCategoryFindFirstData | GassmaGassmaTagFindFirstData | GassmaGassmaSensorReadingFindFirstData | GassmaGassmaTimeSlotFindFirstData | GassmaGassmaReservationFindFirstData | GassmaGassmaProductFindFirstData | GassmaGassmaOrderFindFirstData | GassmaGassmaOrderItemFindFirstData | GassmaGassmaFormulaCellFindFirstData | GassmaGassmaNotificationFindFirstData | GassmaGassmaOffsetNoteFindFirstData | GassmaGassmaUserFindFirstData | GassmaGassmaProfileFindFirstData) => unknown;
  }) => unknown;
  findFirstOrThrow?: (params: {
    model: GassmaGassmaModelName;
    operation: "findFirstOrThrow";
    args: GassmaGassmaPostFindFirstData | GassmaGassmaCommentFindFirstData | GassmaGassmaCategoryFindFirstData | GassmaGassmaTagFindFirstData | GassmaGassmaSensorReadingFindFirstData | GassmaGassmaTimeSlotFindFirstData | GassmaGassmaReservationFindFirstData | GassmaGassmaProductFindFirstData | GassmaGassmaOrderFindFirstData | GassmaGassmaOrderItemFindFirstData | GassmaGassmaFormulaCellFindFirstData | GassmaGassmaNotificationFindFirstData | GassmaGassmaOffsetNoteFindFirstData | GassmaGassmaUserFindFirstData | GassmaGassmaProfileFindFirstData;
    query: (args: GassmaGassmaPostFindFirstData | GassmaGassmaCommentFindFirstData | GassmaGassmaCategoryFindFirstData | GassmaGassmaTagFindFirstData | GassmaGassmaSensorReadingFindFirstData | GassmaGassmaTimeSlotFindFirstData | GassmaGassmaReservationFindFirstData | GassmaGassmaProductFindFirstData | GassmaGassmaOrderFindFirstData | GassmaGassmaOrderItemFindFirstData | GassmaGassmaFormulaCellFindFirstData | GassmaGassmaNotificationFindFirstData | GassmaGassmaOffsetNoteFindFirstData | GassmaGassmaUserFindFirstData | GassmaGassmaProfileFindFirstData) => unknown;
  }) => unknown;
  findMany?: (params: {
    model: GassmaGassmaModelName;
    operation: "findMany";
    args: GassmaGassmaPostFindManyData | GassmaGassmaCommentFindManyData | GassmaGassmaCategoryFindManyData | GassmaGassmaTagFindManyData | GassmaGassmaSensorReadingFindManyData | GassmaGassmaTimeSlotFindManyData | GassmaGassmaReservationFindManyData | GassmaGassmaProductFindManyData | GassmaGassmaOrderFindManyData | GassmaGassmaOrderItemFindManyData | GassmaGassmaFormulaCellFindManyData | GassmaGassmaNotificationFindManyData | GassmaGassmaOffsetNoteFindManyData | GassmaGassmaUserFindManyData | GassmaGassmaProfileFindManyData;
    query: (args: GassmaGassmaPostFindManyData | GassmaGassmaCommentFindManyData | GassmaGassmaCategoryFindManyData | GassmaGassmaTagFindManyData | GassmaGassmaSensorReadingFindManyData | GassmaGassmaTimeSlotFindManyData | GassmaGassmaReservationFindManyData | GassmaGassmaProductFindManyData | GassmaGassmaOrderFindManyData | GassmaGassmaOrderItemFindManyData | GassmaGassmaFormulaCellFindManyData | GassmaGassmaNotificationFindManyData | GassmaGassmaOffsetNoteFindManyData | GassmaGassmaUserFindManyData | GassmaGassmaProfileFindManyData) => unknown;
  }) => unknown;
  create?: (params: {
    model: GassmaGassmaModelName;
    operation: "create";
    args: GassmaGassmaPostCreateData | GassmaGassmaCommentCreateData | GassmaGassmaCategoryCreateData | GassmaGassmaTagCreateData | GassmaGassmaSensorReadingCreateData | GassmaGassmaTimeSlotCreateData | GassmaGassmaReservationCreateData | GassmaGassmaProductCreateData | GassmaGassmaOrderCreateData | GassmaGassmaOrderItemCreateData | GassmaGassmaFormulaCellCreateData | GassmaGassmaNotificationCreateData | GassmaGassmaOffsetNoteCreateData | GassmaGassmaUserCreateData | GassmaGassmaProfileCreateData;
    query: (args: GassmaGassmaPostCreateData | GassmaGassmaCommentCreateData | GassmaGassmaCategoryCreateData | GassmaGassmaTagCreateData | GassmaGassmaSensorReadingCreateData | GassmaGassmaTimeSlotCreateData | GassmaGassmaReservationCreateData | GassmaGassmaProductCreateData | GassmaGassmaOrderCreateData | GassmaGassmaOrderItemCreateData | GassmaGassmaFormulaCellCreateData | GassmaGassmaNotificationCreateData | GassmaGassmaOffsetNoteCreateData | GassmaGassmaUserCreateData | GassmaGassmaProfileCreateData) => unknown;
  }) => unknown;
  createMany?: (params: {
    model: GassmaGassmaModelName;
    operation: "createMany";
    args: GassmaGassmaPostCreateManyData | GassmaGassmaCommentCreateManyData | GassmaGassmaCategoryCreateManyData | GassmaGassmaTagCreateManyData | GassmaGassmaSensorReadingCreateManyData | GassmaGassmaTimeSlotCreateManyData | GassmaGassmaReservationCreateManyData | GassmaGassmaProductCreateManyData | GassmaGassmaOrderCreateManyData | GassmaGassmaOrderItemCreateManyData | GassmaGassmaFormulaCellCreateManyData | GassmaGassmaNotificationCreateManyData | GassmaGassmaOffsetNoteCreateManyData | GassmaGassmaUserCreateManyData | GassmaGassmaProfileCreateManyData;
    query: (args: GassmaGassmaPostCreateManyData | GassmaGassmaCommentCreateManyData | GassmaGassmaCategoryCreateManyData | GassmaGassmaTagCreateManyData | GassmaGassmaSensorReadingCreateManyData | GassmaGassmaTimeSlotCreateManyData | GassmaGassmaReservationCreateManyData | GassmaGassmaProductCreateManyData | GassmaGassmaOrderCreateManyData | GassmaGassmaOrderItemCreateManyData | GassmaGassmaFormulaCellCreateManyData | GassmaGassmaNotificationCreateManyData | GassmaGassmaOffsetNoteCreateManyData | GassmaGassmaUserCreateManyData | GassmaGassmaProfileCreateManyData) => unknown;
  }) => unknown;
  createManyAndReturn?: (params: {
    model: GassmaGassmaModelName;
    operation: "createManyAndReturn";
    args: GassmaGassmaPostCreateManyAndReturnData | GassmaGassmaCommentCreateManyAndReturnData | GassmaGassmaCategoryCreateManyAndReturnData | GassmaGassmaTagCreateManyAndReturnData | GassmaGassmaSensorReadingCreateManyAndReturnData | GassmaGassmaTimeSlotCreateManyAndReturnData | GassmaGassmaReservationCreateManyAndReturnData | GassmaGassmaProductCreateManyAndReturnData | GassmaGassmaOrderCreateManyAndReturnData | GassmaGassmaOrderItemCreateManyAndReturnData | GassmaGassmaFormulaCellCreateManyAndReturnData | GassmaGassmaNotificationCreateManyAndReturnData | GassmaGassmaOffsetNoteCreateManyAndReturnData | GassmaGassmaUserCreateManyAndReturnData | GassmaGassmaProfileCreateManyAndReturnData;
    query: (args: GassmaGassmaPostCreateManyAndReturnData | GassmaGassmaCommentCreateManyAndReturnData | GassmaGassmaCategoryCreateManyAndReturnData | GassmaGassmaTagCreateManyAndReturnData | GassmaGassmaSensorReadingCreateManyAndReturnData | GassmaGassmaTimeSlotCreateManyAndReturnData | GassmaGassmaReservationCreateManyAndReturnData | GassmaGassmaProductCreateManyAndReturnData | GassmaGassmaOrderCreateManyAndReturnData | GassmaGassmaOrderItemCreateManyAndReturnData | GassmaGassmaFormulaCellCreateManyAndReturnData | GassmaGassmaNotificationCreateManyAndReturnData | GassmaGassmaOffsetNoteCreateManyAndReturnData | GassmaGassmaUserCreateManyAndReturnData | GassmaGassmaProfileCreateManyAndReturnData) => unknown;
  }) => unknown;
  update?: (params: {
    model: GassmaGassmaModelName;
    operation: "update";
    args: GassmaGassmaPostUpdateSingleData | GassmaGassmaCommentUpdateSingleData | GassmaGassmaCategoryUpdateSingleData | GassmaGassmaTagUpdateSingleData | GassmaGassmaSensorReadingUpdateSingleData | GassmaGassmaTimeSlotUpdateSingleData | GassmaGassmaReservationUpdateSingleData | GassmaGassmaProductUpdateSingleData | GassmaGassmaOrderUpdateSingleData | GassmaGassmaOrderItemUpdateSingleData | GassmaGassmaFormulaCellUpdateSingleData | GassmaGassmaNotificationUpdateSingleData | GassmaGassmaOffsetNoteUpdateSingleData | GassmaGassmaUserUpdateSingleData | GassmaGassmaProfileUpdateSingleData;
    query: (args: GassmaGassmaPostUpdateSingleData | GassmaGassmaCommentUpdateSingleData | GassmaGassmaCategoryUpdateSingleData | GassmaGassmaTagUpdateSingleData | GassmaGassmaSensorReadingUpdateSingleData | GassmaGassmaTimeSlotUpdateSingleData | GassmaGassmaReservationUpdateSingleData | GassmaGassmaProductUpdateSingleData | GassmaGassmaOrderUpdateSingleData | GassmaGassmaOrderItemUpdateSingleData | GassmaGassmaFormulaCellUpdateSingleData | GassmaGassmaNotificationUpdateSingleData | GassmaGassmaOffsetNoteUpdateSingleData | GassmaGassmaUserUpdateSingleData | GassmaGassmaProfileUpdateSingleData) => unknown;
  }) => unknown;
  updateMany?: (params: {
    model: GassmaGassmaModelName;
    operation: "updateMany";
    args: GassmaGassmaPostUpdateData | GassmaGassmaCommentUpdateData | GassmaGassmaCategoryUpdateData | GassmaGassmaTagUpdateData | GassmaGassmaSensorReadingUpdateData | GassmaGassmaTimeSlotUpdateData | GassmaGassmaReservationUpdateData | GassmaGassmaProductUpdateData | GassmaGassmaOrderUpdateData | GassmaGassmaOrderItemUpdateData | GassmaGassmaFormulaCellUpdateData | GassmaGassmaNotificationUpdateData | GassmaGassmaOffsetNoteUpdateData | GassmaGassmaUserUpdateData | GassmaGassmaProfileUpdateData;
    query: (args: GassmaGassmaPostUpdateData | GassmaGassmaCommentUpdateData | GassmaGassmaCategoryUpdateData | GassmaGassmaTagUpdateData | GassmaGassmaSensorReadingUpdateData | GassmaGassmaTimeSlotUpdateData | GassmaGassmaReservationUpdateData | GassmaGassmaProductUpdateData | GassmaGassmaOrderUpdateData | GassmaGassmaOrderItemUpdateData | GassmaGassmaFormulaCellUpdateData | GassmaGassmaNotificationUpdateData | GassmaGassmaOffsetNoteUpdateData | GassmaGassmaUserUpdateData | GassmaGassmaProfileUpdateData) => unknown;
  }) => unknown;
  updateManyAndReturn?: (params: {
    model: GassmaGassmaModelName;
    operation: "updateManyAndReturn";
    args: GassmaGassmaPostUpdateManyAndReturnData | GassmaGassmaCommentUpdateManyAndReturnData | GassmaGassmaCategoryUpdateManyAndReturnData | GassmaGassmaTagUpdateManyAndReturnData | GassmaGassmaSensorReadingUpdateManyAndReturnData | GassmaGassmaTimeSlotUpdateManyAndReturnData | GassmaGassmaReservationUpdateManyAndReturnData | GassmaGassmaProductUpdateManyAndReturnData | GassmaGassmaOrderUpdateManyAndReturnData | GassmaGassmaOrderItemUpdateManyAndReturnData | GassmaGassmaFormulaCellUpdateManyAndReturnData | GassmaGassmaNotificationUpdateManyAndReturnData | GassmaGassmaOffsetNoteUpdateManyAndReturnData | GassmaGassmaUserUpdateManyAndReturnData | GassmaGassmaProfileUpdateManyAndReturnData;
    query: (args: GassmaGassmaPostUpdateManyAndReturnData | GassmaGassmaCommentUpdateManyAndReturnData | GassmaGassmaCategoryUpdateManyAndReturnData | GassmaGassmaTagUpdateManyAndReturnData | GassmaGassmaSensorReadingUpdateManyAndReturnData | GassmaGassmaTimeSlotUpdateManyAndReturnData | GassmaGassmaReservationUpdateManyAndReturnData | GassmaGassmaProductUpdateManyAndReturnData | GassmaGassmaOrderUpdateManyAndReturnData | GassmaGassmaOrderItemUpdateManyAndReturnData | GassmaGassmaFormulaCellUpdateManyAndReturnData | GassmaGassmaNotificationUpdateManyAndReturnData | GassmaGassmaOffsetNoteUpdateManyAndReturnData | GassmaGassmaUserUpdateManyAndReturnData | GassmaGassmaProfileUpdateManyAndReturnData) => unknown;
  }) => unknown;
  upsert?: (params: {
    model: GassmaGassmaModelName;
    operation: "upsert";
    args: GassmaGassmaPostUpsertSingleData | GassmaGassmaCommentUpsertSingleData | GassmaGassmaCategoryUpsertSingleData | GassmaGassmaTagUpsertSingleData | GassmaGassmaSensorReadingUpsertSingleData | GassmaGassmaTimeSlotUpsertSingleData | GassmaGassmaReservationUpsertSingleData | GassmaGassmaProductUpsertSingleData | GassmaGassmaOrderUpsertSingleData | GassmaGassmaOrderItemUpsertSingleData | GassmaGassmaFormulaCellUpsertSingleData | GassmaGassmaNotificationUpsertSingleData | GassmaGassmaOffsetNoteUpsertSingleData | GassmaGassmaUserUpsertSingleData | GassmaGassmaProfileUpsertSingleData;
    query: (args: GassmaGassmaPostUpsertSingleData | GassmaGassmaCommentUpsertSingleData | GassmaGassmaCategoryUpsertSingleData | GassmaGassmaTagUpsertSingleData | GassmaGassmaSensorReadingUpsertSingleData | GassmaGassmaTimeSlotUpsertSingleData | GassmaGassmaReservationUpsertSingleData | GassmaGassmaProductUpsertSingleData | GassmaGassmaOrderUpsertSingleData | GassmaGassmaOrderItemUpsertSingleData | GassmaGassmaFormulaCellUpsertSingleData | GassmaGassmaNotificationUpsertSingleData | GassmaGassmaOffsetNoteUpsertSingleData | GassmaGassmaUserUpsertSingleData | GassmaGassmaProfileUpsertSingleData) => unknown;
  }) => unknown;
  delete?: (params: {
    model: GassmaGassmaModelName;
    operation: "delete";
    args: GassmaGassmaPostDeleteSingleData | GassmaGassmaCommentDeleteSingleData | GassmaGassmaCategoryDeleteSingleData | GassmaGassmaTagDeleteSingleData | GassmaGassmaSensorReadingDeleteSingleData | GassmaGassmaTimeSlotDeleteSingleData | GassmaGassmaReservationDeleteSingleData | GassmaGassmaProductDeleteSingleData | GassmaGassmaOrderDeleteSingleData | GassmaGassmaOrderItemDeleteSingleData | GassmaGassmaFormulaCellDeleteSingleData | GassmaGassmaNotificationDeleteSingleData | GassmaGassmaOffsetNoteDeleteSingleData | GassmaGassmaUserDeleteSingleData | GassmaGassmaProfileDeleteSingleData;
    query: (args: GassmaGassmaPostDeleteSingleData | GassmaGassmaCommentDeleteSingleData | GassmaGassmaCategoryDeleteSingleData | GassmaGassmaTagDeleteSingleData | GassmaGassmaSensorReadingDeleteSingleData | GassmaGassmaTimeSlotDeleteSingleData | GassmaGassmaReservationDeleteSingleData | GassmaGassmaProductDeleteSingleData | GassmaGassmaOrderDeleteSingleData | GassmaGassmaOrderItemDeleteSingleData | GassmaGassmaFormulaCellDeleteSingleData | GassmaGassmaNotificationDeleteSingleData | GassmaGassmaOffsetNoteDeleteSingleData | GassmaGassmaUserDeleteSingleData | GassmaGassmaProfileDeleteSingleData) => unknown;
  }) => unknown;
  deleteMany?: (params: {
    model: GassmaGassmaModelName;
    operation: "deleteMany";
    args: GassmaGassmaPostDeleteData | GassmaGassmaCommentDeleteData | GassmaGassmaCategoryDeleteData | GassmaGassmaTagDeleteData | GassmaGassmaSensorReadingDeleteData | GassmaGassmaTimeSlotDeleteData | GassmaGassmaReservationDeleteData | GassmaGassmaProductDeleteData | GassmaGassmaOrderDeleteData | GassmaGassmaOrderItemDeleteData | GassmaGassmaFormulaCellDeleteData | GassmaGassmaNotificationDeleteData | GassmaGassmaOffsetNoteDeleteData | GassmaGassmaUserDeleteData | GassmaGassmaProfileDeleteData;
    query: (args: GassmaGassmaPostDeleteData | GassmaGassmaCommentDeleteData | GassmaGassmaCategoryDeleteData | GassmaGassmaTagDeleteData | GassmaGassmaSensorReadingDeleteData | GassmaGassmaTimeSlotDeleteData | GassmaGassmaReservationDeleteData | GassmaGassmaProductDeleteData | GassmaGassmaOrderDeleteData | GassmaGassmaOrderItemDeleteData | GassmaGassmaFormulaCellDeleteData | GassmaGassmaNotificationDeleteData | GassmaGassmaOffsetNoteDeleteData | GassmaGassmaUserDeleteData | GassmaGassmaProfileDeleteData) => unknown;
  }) => unknown;
  count?: (params: {
    model: GassmaGassmaModelName;
    operation: "count";
    args: GassmaGassmaPostCountData | GassmaGassmaCommentCountData | GassmaGassmaCategoryCountData | GassmaGassmaTagCountData | GassmaGassmaSensorReadingCountData | GassmaGassmaTimeSlotCountData | GassmaGassmaReservationCountData | GassmaGassmaProductCountData | GassmaGassmaOrderCountData | GassmaGassmaOrderItemCountData | GassmaGassmaFormulaCellCountData | GassmaGassmaNotificationCountData | GassmaGassmaOffsetNoteCountData | GassmaGassmaUserCountData | GassmaGassmaProfileCountData;
    query: (args: GassmaGassmaPostCountData | GassmaGassmaCommentCountData | GassmaGassmaCategoryCountData | GassmaGassmaTagCountData | GassmaGassmaSensorReadingCountData | GassmaGassmaTimeSlotCountData | GassmaGassmaReservationCountData | GassmaGassmaProductCountData | GassmaGassmaOrderCountData | GassmaGassmaOrderItemCountData | GassmaGassmaFormulaCellCountData | GassmaGassmaNotificationCountData | GassmaGassmaOffsetNoteCountData | GassmaGassmaUserCountData | GassmaGassmaProfileCountData) => unknown;
  }) => unknown;
  aggregate?: (params: {
    model: GassmaGassmaModelName;
    operation: "aggregate";
    args: GassmaGassmaPostAggregateData | GassmaGassmaCommentAggregateData | GassmaGassmaCategoryAggregateData | GassmaGassmaTagAggregateData | GassmaGassmaSensorReadingAggregateData | GassmaGassmaTimeSlotAggregateData | GassmaGassmaReservationAggregateData | GassmaGassmaProductAggregateData | GassmaGassmaOrderAggregateData | GassmaGassmaOrderItemAggregateData | GassmaGassmaFormulaCellAggregateData | GassmaGassmaNotificationAggregateData | GassmaGassmaOffsetNoteAggregateData | GassmaGassmaUserAggregateData | GassmaGassmaProfileAggregateData;
    query: (args: GassmaGassmaPostAggregateData | GassmaGassmaCommentAggregateData | GassmaGassmaCategoryAggregateData | GassmaGassmaTagAggregateData | GassmaGassmaSensorReadingAggregateData | GassmaGassmaTimeSlotAggregateData | GassmaGassmaReservationAggregateData | GassmaGassmaProductAggregateData | GassmaGassmaOrderAggregateData | GassmaGassmaOrderItemAggregateData | GassmaGassmaFormulaCellAggregateData | GassmaGassmaNotificationAggregateData | GassmaGassmaOffsetNoteAggregateData | GassmaGassmaUserAggregateData | GassmaGassmaProfileAggregateData) => unknown;
  }) => unknown;
  groupBy?: (params: {
    model: GassmaGassmaModelName;
    operation: "groupBy";
    args: GassmaGassmaPostGroupByData | GassmaGassmaCommentGroupByData | GassmaGassmaCategoryGroupByData | GassmaGassmaTagGroupByData | GassmaGassmaSensorReadingGroupByData | GassmaGassmaTimeSlotGroupByData | GassmaGassmaReservationGroupByData | GassmaGassmaProductGroupByData | GassmaGassmaOrderGroupByData | GassmaGassmaOrderItemGroupByData | GassmaGassmaFormulaCellGroupByData | GassmaGassmaNotificationGroupByData | GassmaGassmaOffsetNoteGroupByData | GassmaGassmaUserGroupByData | GassmaGassmaProfileGroupByData;
    query: (args: GassmaGassmaPostGroupByData | GassmaGassmaCommentGroupByData | GassmaGassmaCategoryGroupByData | GassmaGassmaTagGroupByData | GassmaGassmaSensorReadingGroupByData | GassmaGassmaTimeSlotGroupByData | GassmaGassmaReservationGroupByData | GassmaGassmaProductGroupByData | GassmaGassmaOrderGroupByData | GassmaGassmaOrderItemGroupByData | GassmaGassmaFormulaCellGroupByData | GassmaGassmaNotificationGroupByData | GassmaGassmaOffsetNoteGroupByData | GassmaGassmaUserGroupByData | GassmaGassmaProfileGroupByData) => unknown;
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
  "SensorReading"?: GassmaGassmaSensorReadingQueryHooks<O extends { "SensorReading": infer UO } ? UO extends GassmaGassmaSensorReadingOmit ? UO : {} : {}, O>;
  "TimeSlot"?: GassmaGassmaTimeSlotQueryHooks<O extends { "TimeSlot": infer UO } ? UO extends GassmaGassmaTimeSlotOmit ? UO : {} : {}, O>;
  "Reservation"?: GassmaGassmaReservationQueryHooks<O extends { "Reservation": infer UO } ? UO extends GassmaGassmaReservationOmit ? UO : {} : {}, O>;
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
  M extends "SensorReading" ? GassmaGassmaSensorReadingDefaultFindResult :
  M extends "TimeSlot" ? GassmaGassmaTimeSlotDefaultFindResult :
  M extends "Reservation" ? GassmaGassmaReservationDefaultFindResult :
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

export type GassmaGassmaResultComputedKeys<R_, CMap, M> =
  keyof Gassma.At<R_, M> | keyof Gassma.At<R_, "$allModels"> | keyof Gassma.At<CMap, M>;

export type GassmaGassmaResultComputedTypes<CMap, M> = Gassma.At<CMap, M>;

export type GassmaGassmaResultExtension<R_, CMap> = {
  [M in keyof R_]: {
    [F in keyof R_[M]]?: Gassma.ResultField<GassmaGassmaResultScalars<M>, R_[M][F], GassmaGassmaResultComputedKeys<R_, CMap, M>, GassmaGassmaResultComputedTypes<CMap, M>>;
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
  "SensorReading": Gassma.MergeShape<Gassma.At<CMap, "SensorReading">, Gassma.ComputedOf<R, "SensorReading">>;
  "TimeSlot": Gassma.MergeShape<Gassma.At<CMap, "TimeSlot">, Gassma.ComputedOf<R, "TimeSlot">>;
  "Reservation": Gassma.MergeShape<Gassma.At<CMap, "Reservation">, Gassma.ComputedOf<R, "Reservation">>;
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
  result?: GassmaGassmaResultExtension<R_, CMap> & R;
}) => GassmaGassmaExtendedClient<O, GassmaGassmaComputedMap<CMap, R>>;

export type GassmaGassmaExtendedClient<O extends GassmaGassmaGlobalOmitConfig = {}, CMap = {}> = {
  "Post": GassmaGassmaPostController<O extends { "Post": infer UO } ? UO extends GassmaGassmaPostOmit ? UO : {} : {}, O, CMap>;
  "Comment": GassmaGassmaCommentController<O extends { "Comment": infer UO } ? UO extends GassmaGassmaCommentOmit ? UO : {} : {}, O, CMap>;
  "Category": GassmaGassmaCategoryController<O extends { "Category": infer UO } ? UO extends GassmaGassmaCategoryOmit ? UO : {} : {}, O, CMap>;
  "Tag": GassmaGassmaTagController<O extends { "Tag": infer UO } ? UO extends GassmaGassmaTagOmit ? UO : {} : {}, O, CMap>;
  "SensorReading": GassmaGassmaSensorReadingController<O extends { "SensorReading": infer UO } ? UO extends GassmaGassmaSensorReadingOmit ? UO : {} : {}, O, CMap>;
  "TimeSlot": GassmaGassmaTimeSlotController<O extends { "TimeSlot": infer UO } ? UO extends GassmaGassmaTimeSlotOmit ? UO : {} : {}, O, CMap>;
  "Reservation": GassmaGassmaReservationController<O extends { "Reservation": infer UO } ? UO extends GassmaGassmaReservationOmit ? UO : {} : {}, O, CMap>;
  "Product": GassmaGassmaProductController<O extends { "Product": infer UO } ? UO extends GassmaGassmaProductOmit ? UO : {} : {}, O, CMap>;
  "Order": GassmaGassmaOrderController<O extends { "Order": infer UO } ? UO extends GassmaGassmaOrderOmit ? UO : {} : {}, O, CMap>;
  "OrderItem": GassmaGassmaOrderItemController<O extends { "OrderItem": infer UO } ? UO extends GassmaGassmaOrderItemOmit ? UO : {} : {}, O, CMap>;
  "FormulaCell": GassmaGassmaFormulaCellController<O extends { "FormulaCell": infer UO } ? UO extends GassmaGassmaFormulaCellOmit ? UO : {} : {}, O, CMap>;
  "Notification": GassmaGassmaNotificationController<O extends { "Notification": infer UO } ? UO extends GassmaGassmaNotificationOmit ? UO : {} : {}, O, CMap>;
  "OffsetNote": GassmaGassmaOffsetNoteController<O extends { "OffsetNote": infer UO } ? UO extends GassmaGassmaOffsetNoteOmit ? UO : {} : {}, O, CMap>;
  "User": GassmaGassmaUserController<O extends { "User": infer UO } ? UO extends GassmaGassmaUserOmit ? UO : {} : {}, O, CMap>;
  "Profile": GassmaGassmaProfileController<O extends { "Profile": infer UO } ? UO extends GassmaGassmaProfileOmit ? UO : {} : {}, O, CMap>;
  $extends: GassmaGassmaExtendsFn<O, CMap>;
};

export type GassmaGassmaExtension<O extends GassmaGassmaGlobalOmitConfig = {}> = {
  query?: GassmaGassmaQueryExtension<O>;
  result?: GassmaGassmaResultConfig;
};

/**
 * `GassmaClient` proxy available in interactive transactions.
 */
export type GassmaGassmaTransactionClient<O extends Gassma.StrictGlobalOmit<O, GassmaGassmaGlobalOmitConfig> = {}> = GassmaGassmaSheet<O> & {
  /**
   * Creates an extended client with additional behaviour.
   * Read more here: https://gassma.io/en/docs/reference/client-extensions/result
   * @example
   * ```
   * const extended = gassma.$extends({
   *   result: {
   *     // ... provide result extensions here
   *   }
   * })
   * ```
   */
  $extends: GassmaGassmaExtendsFn<O, {}>;
};
/**
 * ##  GASsma Client
 * 
 * Type-safe Google Sheets client for TypeScript & Google Apps Script
 * @example
 * ```
 * const gassma = new GassmaClient()
 * // Fetch zero or more Posts
 * const posts = gassma.Post.findMany()
 * ```
 * 
 * 
 * Read more in our [docs](https://gassma.io/en/docs/reference/basic).
 */
export interface GassmaClient<O extends Gassma.StrictGlobalOmit<O, GassmaGassmaGlobalOmitConfig> = {}> extends GassmaGassmaSheet<O> {
  /**
   * Creates an extended client with additional behaviour.
   * Read more here: https://gassma.io/en/docs/reference/client-extensions/result
   * @example
   * ```
   * const extended = gassma.$extends({
   *   result: {
   *     // ... provide result extensions here
   *   }
   * })
   * ```
   */
  $extends: GassmaGassmaExtendsFn<O, {}>;
  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * Read more here: https://gassma.io/en/docs/reference/transaction
   * @example
   * ```
   * const [alice, bob] = gassma.$transaction((tx) => {
   *   const alice = tx.Post.create({ data: { ... } })
   *   const bob = tx.Post.create({ data: { ... } })
   *   return [alice, bob]
   * })
   * ```
   */
  $transaction<T>(fn: (tx: GassmaGassmaTransactionClient<O>) => T, options?: Gassma.GassmaTransactionOptions): T;
}
/**
 * ##  GASsma Client
 * 
 * Type-safe Google Sheets client for TypeScript & Google Apps Script
 * @example
 * ```
 * const gassma = new GassmaClient()
 * // Fetch zero or more Posts
 * const posts = gassma.Post.findMany()
 * ```
 * 
 * 
 * Read more in our [docs](https://gassma.io/en/docs/reference/basic).
 */
export declare class GassmaClient<O extends Gassma.StrictGlobalOmit<O, GassmaGassmaGlobalOmitConfig> = {}> {
  /**
   * Creates a GASsma client.
   * @param {GassmaGassmaClientOptions} options - Spreadsheet id and model configuration.
   * @example
   * ```
   * const gassma = new GassmaClient()
   * ```
   * 
   * ```
   * const gassma = new GassmaClient({ id: "<spreadsheet id>" })
   * ```
   */
  constructor(options?: GassmaGassmaClientOptions<O>);
}

export declare const Role: {
  readonly admin: "ADMIN";
  readonly user: "USER";
  readonly moderator: "MODERATOR";
};
export type Role = (typeof Role)[keyof typeof Role];
