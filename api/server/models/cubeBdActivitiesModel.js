const mongoose = require('mongoose');
const { DB_MODEL_REF } = require('../constants/dbConstants');
let CubeBdActivities;
let cubeBdActivitiesSchema = new mongoose.Schema({
    key: {
      type: String,
      trim: true
    },
    measure: {
      type: Array
    },
    dimensions: {
      type: Array
    },
    timeDimensions: {
      type: Array
    },
    filters : {
      type: Array
    },
    dynamicKey: {
      type: [
        {
          "member" : "",
          "ArgumentKey": "",
          "type" : ""
        }
      ]
    },
    dynamicFlag: {
      type: Boolean
    }
  },
  {
    timestamps: { 
      createdAt: 'createdAt', 
      updatedAt: 'updatedAt' 
    }
  }
);
//cubeBdActivitiesSchema.index({updatedAt:-1},{unique:false})
module.exports = CubeBdActivities = mongoose.model(DB_MODEL_REF.CUBE_BD_ACTIVITY, cubeBdActivitiesSchema);