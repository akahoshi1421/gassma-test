const gassmaRelations = {
  "Post": {
    "author": {
      "type": "manyToOne",
      "to": "User",
      "field": "authorId",
      "reference": "id",
      "ownsFk": true
    },
    "category": {
      "type": "manyToOne",
      "to": "Category",
      "field": "categoryId",
      "reference": "id",
      "ownsFk": true
    },
    "comments": {
      "type": "oneToMany",
      "to": "Comment",
      "field": "id",
      "reference": "postId",
      "ownsFk": false,
      "onDelete": "Cascade"
    },
    "tags": {
      "type": "manyToMany",
      "to": "Tag",
      "field": "id",
      "reference": "id",
      "ownsFk": false,
      "through": {
        "sheet": "_PostToTag",
        "field": "postId",
        "reference": "tagId"
      }
    }
  },
  "User": {
    "posts": {
      "type": "oneToMany",
      "to": "Post",
      "field": "id",
      "reference": "authorId",
      "ownsFk": false,
      "onDelete": "Cascade",
      "onUpdate": "Cascade"
    },
    "comments": {
      "type": "oneToMany",
      "to": "Comment",
      "field": "id",
      "reference": "authorId",
      "ownsFk": false,
      "onDelete": "Cascade",
      "onUpdate": "NoAction"
    },
    "orders": {
      "type": "oneToMany",
      "to": "Order",
      "field": "id",
      "reference": "userId",
      "ownsFk": false,
      "onDelete": "Restrict",
      "onUpdate": "Restrict"
    },
    "profile": {
      "type": "oneToOne",
      "to": "Profile",
      "field": "id",
      "reference": "userId",
      "ownsFk": false,
      "onDelete": "Cascade",
      "onUpdate": "Cascade"
    }
  },
  "Category": {
    "posts": {
      "type": "oneToMany",
      "to": "Post",
      "field": "id",
      "reference": "categoryId",
      "ownsFk": false,
      "onDelete": "SetNull",
      "onUpdate": "SetNull"
    },
    "parent": {
      "type": "manyToOne",
      "to": "Category",
      "field": "parentId",
      "reference": "id",
      "ownsFk": true
    },
    "children": {
      "type": "oneToMany",
      "to": "Category",
      "field": "id",
      "reference": "parentId",
      "ownsFk": false,
      "onDelete": "SetNull"
    }
  },
  "Comment": {
    "author": {
      "type": "manyToOne",
      "to": "User",
      "field": "authorId",
      "reference": "id",
      "ownsFk": true
    },
    "post": {
      "type": "manyToOne",
      "to": "Post",
      "field": "postId",
      "reference": "id",
      "ownsFk": true
    }
  },
  "Order": {
    "user": {
      "type": "manyToOne",
      "to": "User",
      "field": "userId",
      "reference": "id",
      "ownsFk": true
    },
    "items": {
      "type": "oneToMany",
      "to": "OrderItem",
      "field": "id",
      "reference": "orderId",
      "ownsFk": false,
      "onDelete": "Cascade"
    }
  },
  "OrderItem": {
    "order": {
      "type": "manyToOne",
      "to": "Order",
      "field": "orderId",
      "reference": "id",
      "ownsFk": true
    },
    "product": {
      "type": "manyToOne",
      "to": "Product",
      "field": "productId",
      "reference": "id",
      "ownsFk": true
    }
  },
  "Product": {
    "orderItems": {
      "type": "oneToMany",
      "to": "OrderItem",
      "field": "id",
      "reference": "productId",
      "ownsFk": false,
      "onDelete": "Restrict"
    }
  },
  "Profile": {
    "user": {
      "type": "oneToOne",
      "to": "User",
      "field": "userId",
      "reference": "id",
      "ownsFk": true
    }
  },
  "Tag": {
    "posts": {
      "type": "manyToMany",
      "to": "Post",
      "field": "id",
      "reference": "id",
      "ownsFk": false,
      "through": {
        "sheet": "_PostToTag",
        "field": "tagId",
        "reference": "postId"
      }
    }
  }
};

const gassmaDefaults = {
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
    },
    "AuditLog": {
      "createdAt": () => new Date()
    },
    "Notification": {
      "isRead": false
    },
    "User": {
      "isActive": true,
      "createdAt": () => new Date()
    }
  };

const gassmaUpdatedAt = {
    "Post": ["updatedAt"],
    "Product": ["updatedAt"]
  };

const gassmaIgnore = {
    "Post": ["debugInfo"],
    "User": ["internalNote"]
  };

const gassmaMap = {
    "Order": {
      "totalAmount": "total_amount"
    }
  };

const gassmaIgnoreSheets = ["AuditLog"];

const gassmaMapSheets = {
    "Notification": "notifications"
  };

const gassmaAutoincrement = {
    "Post": "id",
    "Comment": "id",
    "Category": "id",
    "Tag": "id",
    "Product": "id",
    "Order": "id",
    "OrderItem": "id",
    "AuditLog": "id",
    "Notification": "id",
    "User": "id",
    "Profile": "id"
  };

class GassmaClient {
  constructor(options) {
    const mergedOptions = Object.assign({}, options, { id: "14yKHbIKdclxxYKkpvB9V04Ovpe8V7I_nHBnfbPmOqyU", relations: gassmaRelations, defaults: gassmaDefaults, updatedAt: gassmaUpdatedAt, ignore: gassmaIgnore, map: gassmaMap, ignoreSheets: gassmaIgnoreSheets, mapSheets: gassmaMapSheets, autoincrement: gassmaAutoincrement });
    const client = new Gassma.GassmaClient(mergedOptions);
    Object.assign(this, client);
  }
}

exports.GassmaClient = GassmaClient;

const Role = {
  admin: "ADMIN",
  user: "USER",
  moderator: "MODERATOR"
};
exports.Role = Role;
