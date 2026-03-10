const testRelations = {
  "Profile": {
    "user": {
      "type": "oneToOne",
      "to": "User",
      "field": "userId",
      "reference": "id"
    }
  },
  "User": {
    "profile": {
      "type": "oneToOne",
      "to": "Profile",
      "field": "id",
      "reference": "userId",
      "onDelete": "Cascade",
      "onUpdate": "Cascade"
    },
    "posts": {
      "type": "oneToMany",
      "to": "Post",
      "field": "id",
      "reference": "authorId",
      "onDelete": "Cascade",
      "onUpdate": "Cascade"
    },
    "comments": {
      "type": "oneToMany",
      "to": "Comment",
      "field": "id",
      "reference": "authorId",
      "onDelete": "Cascade",
      "onUpdate": "NoAction"
    },
    "orders": {
      "type": "oneToMany",
      "to": "Order",
      "field": "id",
      "reference": "userId",
      "onDelete": "Restrict",
      "onUpdate": "Restrict"
    }
  },
  "Post": {
    "author": {
      "type": "manyToOne",
      "to": "User",
      "field": "authorId",
      "reference": "id"
    },
    "category": {
      "type": "manyToOne",
      "to": "Category",
      "field": "categoryId",
      "reference": "id"
    },
    "comments": {
      "type": "oneToMany",
      "to": "Comment",
      "field": "id",
      "reference": "postId",
      "onDelete": "Cascade"
    },
    "tags": {
      "type": "manyToMany",
      "to": "Tag",
      "field": "id",
      "reference": "id",
      "through": {
        "sheet": "_PostToTag",
        "field": "postId",
        "reference": "tagId"
      }
    }
  },
  "Category": {
    "posts": {
      "type": "oneToMany",
      "to": "Post",
      "field": "id",
      "reference": "categoryId",
      "onDelete": "SetNull",
      "onUpdate": "SetNull"
    },
    "parent": {
      "type": "manyToOne",
      "to": "Category",
      "field": "parentId",
      "reference": "id"
    },
    "children": {
      "type": "oneToMany",
      "to": "Category",
      "field": "id",
      "reference": "parentId",
      "onDelete": "SetNull"
    }
  },
  "Comment": {
    "author": {
      "type": "manyToOne",
      "to": "User",
      "field": "authorId",
      "reference": "id"
    },
    "post": {
      "type": "manyToOne",
      "to": "Post",
      "field": "postId",
      "reference": "id"
    }
  },
  "Order": {
    "user": {
      "type": "manyToOne",
      "to": "User",
      "field": "userId",
      "reference": "id"
    },
    "items": {
      "type": "oneToMany",
      "to": "OrderItem",
      "field": "id",
      "reference": "orderId",
      "onDelete": "Cascade"
    }
  },
  "OrderItem": {
    "order": {
      "type": "manyToOne",
      "to": "Order",
      "field": "orderId",
      "reference": "id"
    },
    "product": {
      "type": "manyToOne",
      "to": "Product",
      "field": "productId",
      "reference": "id"
    }
  },
  "Product": {
    "orderItems": {
      "type": "oneToMany",
      "to": "OrderItem",
      "field": "id",
      "reference": "productId",
      "onDelete": "Restrict"
    }
  },
  "Tag": {
    "posts": {
      "type": "manyToMany",
      "to": "Post",
      "field": "id",
      "reference": "id",
      "through": {
        "sheet": "_PostToTag",
        "field": "tagId",
        "reference": "postId"
      }
    }
  }
};

const testDefaults = {
    "User": {
      "isActive": true,
      "createdAt": () => new Date()
    },
    "Post": {
      "published": false,
      "viewCount": 0,
      "createdAt": () => new Date()
    },
    "Comment": {
      "createdAt": () => new Date()
    },
    "Product": {
      "createdAt": () => new Date()
    },
    "Order": {
      "createdAt": () => new Date()
    }
  };

const testUpdatedAt = {
    "Post": ["updatedAt"],
    "Product": ["updatedAt"]
  };

const testIgnore = {
    "User": ["internalNote"],
    "Post": ["debugInfo"]
  };

class GassmaClient {
  constructor(options) {
    const mergedOptions = Object.assign({}, options, { relations: testRelations, defaults: testDefaults, updatedAt: testUpdatedAt, ignore: testIgnore });
    const client = new Gassma.GassmaClient(mergedOptions);
    this.sheets = client.sheets;
  }
}

exports.GassmaClient = GassmaClient;
