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
    username: {
      label: 'Username',
      type: 'string',
      listing: true,
      form: true,
      display: true,
      hidden: false,
      orderable: true,
      quick_edit: true,
      select: true,
      insert: true,
      relation: null,
    },
    email: {
      label: 'Email',
      type: 'string',
      listing: true,
      form: true,
      display: true,
      hidden: false,
      orderable: true,
      quick_edit: true,
      select: true,
      insert: true,
      relation: null,
    },
    password: {
      label: 'Password',
      type: 'string',
      listing: true,
      form: true,
      display: false,
      hidden: false,
      orderable: false,
      quick_edit: false,
      select: true,
      insert: true,
      relation: null,
    },
    roles: {
      label: 'Roles',
      type: 'relation',
      listing: true,
      form: true,
      select: true,
      insert: false,
      relation: {
        type: 'belongsToMany',
        alias: 'roles_name',
      },
    },
    company: {
      label: 'Company',
      type: 'integer',
      listing: true,
      form: true,
      select: true,
      insert: true,
      relation: {
        type: 'belongsTo',
        alias: 'company_name'
      },
    },
  };

  User.module = 'user';

  return User;
};
