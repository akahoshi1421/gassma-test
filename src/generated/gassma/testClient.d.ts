export declare class GassmaClient<O extends GassmaTestGlobalOmitConfig = {}> {
  constructor(options?: GassmaTestClientOptions<O>);
  readonly sheets: GassmaTestSheet<O>;
}
