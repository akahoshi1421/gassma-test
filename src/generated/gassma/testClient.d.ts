export declare class GassmaClient<O extends GassmaTestGlobalOmitConfig = {}> {
  constructor(options?: GassmaTestClientOptions<O>);
  readonly sheets: GassmaTestSheet<O>;
}

export declare const Role: {
  readonly admin: "ADMIN";
  readonly user: "USER";
  readonly moderator: "MODERATOR";
};
export type Role = (typeof Role)[keyof typeof Role];
