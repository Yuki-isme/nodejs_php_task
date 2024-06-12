'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Role, {
        through: 'user_role',
        foreignKey: 'user_id',
        otherKey: 'role_id',
      });
      User.belongsTo(models.Company, { foreignKey: 'company_id' });
    }
  }

  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    company_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  });

  User.fieldDef = {
    username: {label: 'Username', type: 'string',  display: true,  hidden: false, orderable: true, listing: true, select: true, insert: true, quick_edit: true, relation: false, validate: false},
    email:    {label: 'Email',    type: 'string',  display: true,  hidden: false, orderable: true, listing: true, select: true, insert: true, quick_edit: true, relation: false, validate: false},
    password: {label: 'Password', type: 'string',  display: false, hidden: true,  orderable: true, listing: true, select: true, insert: true, quick_edit: true, relation: false, validate: false},
    roles:    {label: 'Roles',    type:  null,     display: false, hidden: true,  orderable: true, listing: true, select: true, insert: true, quick_edit: true, relation: {type: 'many', alias: 'roles_name'}, validate: false},
    company:  {label: 'Password', type: 'integer', display: false, hidden: true,  orderable: true, listing: true, select: true, insert: true, quick_edit: true, relation: {type: 'one',  alias: 'company_name'}, validate: false},
  };

  User.module = 'user';

  return User;
};
