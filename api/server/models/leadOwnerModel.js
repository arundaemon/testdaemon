const mongoose = require('mongoose');
const { DB_MODEL_REF } = require('../constants/dbConstants');
let leadOwnerSchema = new mongoose.Schema({
  leadId: {
    type: String,
    trim: true,
    index: true
  },
  leadInterestId: {
    type: String,
    trim: true,
  },
  ownerType: {
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
  leadType: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    trim: true
  },
},
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = LeadOwner = mongoose.model(DB_MODEL_REF.LEAD_OWNER, leadOwnerSchema);