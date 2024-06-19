'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ZingMp3 extends Model {
    static associate(models) {
      ZingMp3.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  ZingMp3.init({
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ZingMp3',
    tableName: 'zing_mp3s',
  });

  ZingMp3.fieldDef = {
    song:{
      label: 'Song',
      type: 'string',
      listing: true,
      form: false,
      display: true,
      hidden: false,
      orderable: false,
      quick_edit: false,
      select: false,
      insert: false,
      relation: null,
    }
  }

  return ZingMp3;
};