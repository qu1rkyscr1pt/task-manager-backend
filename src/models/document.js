'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Document.associate = (models) => {
    Document.belongsTo(models.Task, { foreignKey: 'taskId' });
  };

    }
  }
  Document.init({
    filename: DataTypes.STRING,
    originalName: DataTypes.STRING,
    mimeType: DataTypes.STRING,
    size: DataTypes.INTEGER,
    taskId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Document',
    tableName: 'documents',
  });
  return Document;
};