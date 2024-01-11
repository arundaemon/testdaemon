const mongoose = require('mongoose');
const { DB_MODEL_REF, USER_STATUS } = require('../constants/dbConstants');

const schoolModelSchema = new mongoose.Schema({
  leadId: {
    type: String,
    trim: true,
    index: true,
    unique: true
  },
  geoTagId: {
    type: String,
    unique: true,
    trim: true
  },
  schoolCode: {
    type: String,
    trim: true,
    index: true,
    unique: true
  },
  oldSchoolCode: {
    type: String,
    trim: true,
  },
  schoolName: {
    type: String,
    trim: true,
    // unique: true,
    required: true
  },
  type: {
    type: String,
    trim: true,
  },
  assignedTo_userId: {
    type: String,
    trim: true
  },
  assignedTo_userName: {
    type: String,
    trim: true
  },
  assignedTo_displayName: {
    type: String,
    trim: true
  },

  assignedTo_assignedOn: { type: Date },

  assignedTo_role_id: {
    type: String,
    trim: true
  },
  assignedTo_role_code: {
    type: String,
    trim: true
  },
  assignedTo_role_name: {
    type: String,
    trim: true
  },

  assignedTo_profile_id: {
    type: String,
    trim: true
  },
  assignedTo_profile_code: {
    type: String,
    trim: true
  },
  assignedTo_profile_name: {
    type: String,
    trim: true
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
    trim: true
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
    required: true
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
    required: true
  },
  city: {
    type: String,
    trim: true,
    // required: true
  },
  address: {
    type: String,
    trim: true,
    required: true
  },
  contactDetails: [{
    name: { type: String },
    designation: { type: String },
    mobileNumber: { type: Number },
    emailId: { type: String },
    isPrimary: { type: Boolean }
  }],
  /*interestShown: {
    type: Array
  },*/
  sourceName: {
    type: String,
    trim: true
  },
  subSourceName: {
    type: String,
    trim: true
  },
  gstNumber: {
    type: String,
    trim: true
  },
  tanNumber: {
    type: String,
    trim: true
  },
  status: { type: Number, enum: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVE], default: USER_STATUS.ACTIVE },

},

  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  });

const School = mongoose.model(DB_MODEL_REF.SCHOOL, schoolModelSchema);
module.exports = School