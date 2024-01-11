const mongoose = require('mongoose');
const { DB_MODEL_REF } = require('../constants/dbConstants');

const schoolLogsModelSchema = new mongoose.Schema({
  schoolCode: {
    type: String,
    trim: true,
    index: true,
    unique: true
  },
  schoolName: {
    type: String,
    trim: true,
    // unique: true,
    required: true
  },
 
  territoryCode: {
    type: String,
    trim: true,
  },

  territoryName: {
    type: String,
    trim: true,
  },
  board: {
    type: String,
    required: true
  },
  classes: {
    type: Array,
    required: true
  },
  schoolEmailId: {
    type: String,
    trim: true,
    // required: true
  },
  typeOfInstitute: {
    type: String,
    required: true
  },
  competitorName: {
    type: String,
    trim: true,
  },
  totalTeacher: {
    type: Number,
    // required: true
  },

  totalStudent: {
    type: Number,
    // required: true
  },
  associateInstitute: {
    type: String,
    trim: true,
  },
  schoolWebsite: {
    type: Array,
    trim: true
  },
  subjectOffered: {
    type: Array,
    trim: true,
    // required: true
  },
  admissionFee: {
    type: Number
  },
  tutionFee: {
    type: Number
  },
  internet: {
    type: String,
    required: true
  },
  country: {
    type: String,
    trim: true,
    required: true
  },
  countryCode: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
    // required: true
  },
  stateCode: {
    type: String,
    trim: true,
    // required: true
  },
  pinCode: {
    type: Number,
    // required: true
  },
  city: {
    type: String,
    trim: true,
    // required: true
  },
  address: {
    type: String,
    trim: true,
    // required: true
  },
  gstNumber: {
    type: String,
    trim: true
  },
  tanNumber: {
    type: String,
    trim: true
  },
  contactDetails: [{
    name: { type: String },
    designation: { type: String },
    mobileNumber: { type: Number },
    emailId: { type: String }
  }],
 /* interestShown: {
    type: Array,
    // required: true
  },*/
},
  {
    timestamps: {
      createdAt: 'createdAt',
    }
  });

const SchoolLogs = mongoose.model(DB_MODEL_REF.SCHOOL_LOGS, schoolLogsModelSchema);
module.exports = SchoolLogs