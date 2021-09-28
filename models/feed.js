const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Feed extends Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        content: {
          type: DataTypes.STRING(1000),
          allowNull: false,
        },
        imagePath: {
          type: DataTypes.STRING(500),
        },
      },

      {
        modelName: "Feed",
        tableName: "feeds",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        sequelize,
      }
    );
  }

  static associate(db) {
    db.Feed.belongsTo(db.User);
  }
};
