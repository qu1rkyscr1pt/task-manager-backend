'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Task.belongsTo(models.User, { foreignKey: 'assignedTo' , as: 'user' });
          Task.hasMany(models.Document, { foreignKey: 'taskId', as: 'documents' });
    }
  }
  Task.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: DataTypes.STRING,
    priority: DataTypes.STRING,
    dueDate: DataTypes.DATE,
    assignedTo: {type: DataTypes.INTEGER, allowNull: true},

  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};