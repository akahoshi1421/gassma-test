const testRelations = {
  "Profile": {
    "user": {
      "type": "oneToOne",
      "to": "User",
      "field": "userId",
      "reference": "id",
      "onDelete": "Cascade"
    }
  },
  "User": {
    "profile": {
      "type": "oneToOne",
      "to": "Profile",
      "field": "id",
      "reference": "userId"
    },
    "posts": {
      "type": "oneToMany",
      "to": "Post",
      "field": "id",
      "reference": "authorId"
    },
    "comments": {
      "type": "oneToMany",
      "to": "Comment",
      "field": "id",
      "reference": "authorId"
    },
    "orders": {
      "type": "oneToMany",
      "to": "Order",
      "field": "id",
      "reference": "userId"
    }
  },
  "Post": {
    "author": {
      "type": "manyToOne",
      "to": "User",
      "field": "authorId",
      "reference": "id",
      "onDelete": "Cascade",
      "onUpdate": "Cascade"
    },
    "category": {
      "type": "manyToOne",
      "to": "Category",
      "field": "categoryId",
      "reference": "id",
      "onDelete": "SetNull"
    },
    "comments": {
      "type": "oneToMany",
      "to": "Comment",
      "field": "id",
      "reference": "postId"
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
      "reference": "categoryId"
    },
    "parent": {
      "type": "oneToOne",
      "to": "Category",
      "field": "id",
      "reference": "parentId"
    },
    "children": {
      "type": "manyToMany",
      "to": "Category",
      "field": "id",
      "reference": "id",
      "through": {
        "sheet": "_CategoryToCategory",
        "field": "categoryId",
        "reference": "categoryId"
      }
    }
  },
  "Comment": {
    "author": {
      "type": "manyToOne",
      "to": "User",
      "field": "authorId",
      "reference": "id",
      "onDelete": "Cascade"
    },
    "post": {
      "type": "manyToOne",
      "to": "Post",
      "field": "postId",
      "reference": "id",
      "onDelete": "Cascade"
    }
  },
  "Order": {
    "user": {
      "type": "manyToOne",
      "to": "User",
      "field": "userId",
      "reference": "id",
      "onDelete": "Restrict"
    },
    "items": {
      "type": "oneToMany",
      "to": "OrderItem",
      "field": "id",
      "reference": "orderId"
    }
  },
  "OrderItem": {
    "order": {
      "type": "manyToOne",
      "to": "Order",
      "field": "orderId",
      "reference": "id",
      "onDelete": "Cascade"
    },
    "product": {
      "type": "manyToOne",
      "to": "Product",
      "field": "productId",
      "reference": "id",
      "onDelete": "Restrict"
    }
  },
  "Product": {
    "orderItems": {
      "type": "oneToMany",
      "to": "OrderItem",
      "field": "id",
      "reference": "productId"
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

class GassmaClient {
  constructor(options) {
    const mergedOptions = Object.assign({}, options, { relations: testRelations });
    const client = new Gassma.GassmaClient(mergedOptions);
    this.sheets = client.sheets;
  }
}

exports.GassmaClient = GassmaClient;
