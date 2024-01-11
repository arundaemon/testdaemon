const mongoose = require('mongoose');
const { DB_MODEL_REF } = require('../constants/dbConstants');

let querySchema = new mongoose.Schema({
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
      dynamicKey: [
        {
            member : "",
            key: "",
            type : ""
        }        
      ],
      dynamicFlag: {
        type: Boolean
      }
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });
    //querySchema.index({updatedAt:-1},{unique:false})
module.exports = Query = mongoose.model(DB_MODEL_REF.Query, querySchema);
