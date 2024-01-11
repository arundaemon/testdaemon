const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS, } = require('../constants/dbConstants');

const territoryMappingModelSchema = new mongoose.Schema({
  territoryCode: {
    type: String,
    trim: true,
    required: true
  },

  territoryName: {
    type: String,
    trim: true,
    required: true
  },
  status: { type: Number, enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE },
  regionalSPOC: {
    type: Object,
    required: true
  },
  buHead1: {
    type: Object,
    required: true
  },
  buHead2: {
    type: Object,
    required: true
  },
  retailHead: {
    type: Object,
    required: true
  },
  countryName: {
    type: String,
    required: true,
  },
  countryCode: {
    type: String,
    required: true
  },
  stateCode: {
    type: String,
    required: true
  },
  stateName: {
    type: String,
    required: true
  },
  cityName: {
    type: String,
    required: true
  },
  cityCode: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    trim: true,
    required: true
  },
  modifiedBy: {
    type: String,
    trim: true,
    required: true
  },
},
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  });

const TerritoryMapping = mongoose.model(DB_MODEL_REF.TERRITORY_MAPPING, territoryMappingModelSchema);
module.exports = TerritoryMapping