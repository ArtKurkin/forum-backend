const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Topic = sequelize.define("topic", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    unique: { msg: "Заголовок должен быть уникальным" },
    allowNull: false,
  },
  content: { type: DataTypes.TEXT, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false },
});

const Category = sequelize.define("category", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, unique: true, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false },
});

const Forum = sequelize.define("forum", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, unique: true, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false },
});

const User = sequelize.define("users", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  refreshToken: { type: DataTypes.STRING },
  slug: { type: DataTypes.STRING, allowNull: false },
});

const Post = sequelize.define("posts", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  content: { type: DataTypes.TEXT, allowNull: false },
});

const Role = sequelize.define(
  "role",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, defaultValue: "user" },
  },
  {
    timestamps: false,
  }
);

const PostsUsers = sequelize.define(
  "postsusers",
  {
    ratingValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[1, -1]],
      },
    },
  },
  {
    timestamps: false,
  }
);

const TopicsUsers = sequelize.define(
  "topicsusers",
  {
    ratingValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[1, -1]],
      },
    },
  },
  {
    timestamps: false,
  }
);
Role.hasOne(User, {
  foreignKey: {
    allowNull: false,
    defaultValue: 1,
  },
});
User.belongsTo(Role);

User.hasMany(Topic, {
  foreignKey: {
    allowNull: false,
  },
});
Topic.belongsTo(User);

User.hasMany(Post, {
  foreignKey: {
    allowNull: false,
  },
});
Post.belongsTo(User);

Topic.belongsToMany(User, {
  through: TopicsUsers,
  timestamps: false,
});
User.belongsToMany(Topic, {
  through: TopicsUsers,
  timestamps: false,
});

User.belongsToMany(Post, {
  through: PostsUsers,
  timestamps: false,
});
Post.belongsToMany(User, {
  through: PostsUsers,
  timestamps: false,
});

Topic.hasMany(Post, {
  foreignKey: {
    allowNull: false,
  },
});
Post.belongsTo(Topic);

Category.hasMany(Forum, {
  foreignKey: {
    allowNull: false,
  },
});
Forum.belongsTo(Category);

Forum.hasMany(Topic, {
  foreignKey: {
    allowNull: false,
  },
});
Topic.belongsTo(Forum);

module.exports = {
  Category,
  Forum,
  Topic,
  Post,
  User,
  Role,
  PostsUsers,
  TopicsUsers,
};
