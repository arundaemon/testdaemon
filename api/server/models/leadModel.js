const mongoose = require("mongoose");
const { DB_MODEL_REF, USER_STATUS } = require("../constants/dbConstants");
let Leads;
let leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    nameLower: {
      type: String,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    board: {
      type: String,
      trim: true,
    },
    class: {
      type: String,
      trim: true,
    },
    school: {
      type: String,
      trim: true,
    },
    schoolCode: {
      type: String,
      trim: true,
    },
    pinCode: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DB_MODEL_REF.CAMPAIGN,
    },
    campaignName: {
      type: String,
      trim: true,
    },
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DB_MODEL_REF.SOURCES,
    },
    sourceName: {
      type: String,
      trim: true,
    },
    subSourceName: {
      type: String,
      trim: true,
    },
    subSourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DB_MODEL_REF.SOURCES,
    },
    userType: {
      type: String,
      trim: true,
    },
    learningProfile: {
      type: String,
      trim: true,
    },
    reference: {
      type: String,
      trim: true,
    },
    countryCode: {
      type: String,
      trim: true,
      default: "01",
    },
    status: {
      type: Number,
      enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE],
      default: USER_STATUS.ACTIVE,
    },
    createdBy: {
      type: String,
      trim: true,
    },
    modifiedBy: {
      type: String,
      trim: true,
    },
    createdBy_Uuid: {
      type: String,
      trim: true,
    },
    modifiedBy_Uuid: {
      type: String,
      trim: true,
    },

    assignedTo_userId: {
      type: String,
      trim: true,
    },
    assignedTo_userName: {
      type: String,
      trim: true,
    },
    assignedTo_displayName: {
      type: String,
      trim: true,
    },

    assignedTo_assignedOn: { type: Date },

    assignedTo_role_id: {
      type: String,
      trim: true,
    },
    assignedTo_role_code: {
      type: String,
      trim: true,
    },
    assignedTo_role_name: {
      type: String,
      trim: true,
    },

    assignedTo_profile_id: {
      type: String,
      trim: true,
    },
    assignedTo_profile_code: {
      type: String,
      trim: true,
    },
    assignedTo_profile_name: {
      type: String,
      trim: true,
    },

    registrationDate: { type: Date },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
//leadSchema.index({updatedAt:-1},{unique:false})
module.exports = Leads = mongoose.model(DB_MODEL_REF.LEADS, leadSchema);
