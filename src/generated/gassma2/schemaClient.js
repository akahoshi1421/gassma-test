const schemaRelations = {};

const schemaAutoincrement = {
    "Item": "id"
  };

class GassmaClient {
  constructor(options) {
    const mergedOptions = Object.assign({}, options, { id: "1CiagfKt_56T3j0EcGXm45pK9dmXH-r1FsHc3mjmtBpI", relations: schemaRelations, autoincrement: schemaAutoincrement });
    const client = new Gassma.GassmaClient(mergedOptions);
    this.sheets = client.sheets;
  }
}

exports.GassmaClient = GassmaClient;
