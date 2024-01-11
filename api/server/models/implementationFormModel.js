const mongoose = require("mongoose");
const { DB_MODEL_REF, APPROVAL_STATUS } = require("../constants/dbConstants");

const ImplementationFormSchema = new mongoose.Schema(
  {
    impFormNumber: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    purchaseOrderCode: {
      type: String,
      trim: true,
      required: true,
    },
    implementationDate: {
      type: Date,
      trim: true,
    },

    // contractSigningdate: {
    //   type: Date,
    //   trim: true,
    // },
    // billingDate: {
    //   type: Date,
    //   trim: true,
    // },

    implementationStartDate: {
      type: Date,
      trim: true,
    },
    implementationEndDate: {
      type: Date,
      trim: true,
    },

    isSchoolAdminSPOCFromMaster: {
      type: Boolean,
      default: true,
    },
    schoolAdminSPOCName: {
      type: String,
      trim: true,
    },
    schoolAdminSPOCPhnNo: {
      type: String,
      trim: true,
    },
    schoolAdminSPOCEmail: {
      type: String,
      trim: true,
    },

    isSchoolImplementationSPOCFromMaster: {
      type: Boolean,
      default: true,
    },
    schoolImplementationSPOCName: {
      type: String,
      trim: true,
    },
    schoolImplementationSPOCPhnNo: {
      type: String,
      trim: true,
    },
    schoolImplementationSPOCEmail: {
      type: String,
      trim: true,
    },

    isSchoolPaymentFromSPOCMaster: {
      type: Boolean,
      default: true,
    },
    schoolPaymentSPOCName: {
      type: String,
      trim: true,
    },
    schoolPaymentSPOCPhnNo: {
      type: String,
      trim: true,
    },
    schoolPaymentSPOCEmail: {
      type: String,
      trim: true,
    },

    noOfCordinators: {
      type: Number,
      trim: true,
    },

    schoolId: {
      type: String,
      trim: true,
    },
    schoolCode: {
      type: String,
      trim: true,
    },
    schoolName: {
      type: String,
      trim: true,
    },
    schoolPinCode: {
      type: String,
      trim: true,
    },
    schoolAddress: {
      type: String,
      trim: true,
    },
    schoolEmailId: {
      type: String,
      trim: true,
    },
    schoolCountryCode: {
      type: String,
      trim: true,
    },
    schoolCountryName: {
      type: String,
      trim: true,
    },
    schoolType: {
      type: String,
      trim: true,
    },
    schoolStateCode: {
      type: String,
      trim: true,
    },
    schoolStateName: {
      type: String,
      trim: true,
    },
    schoolCityCode: {
      type: String,
      trim: true,
    },
    schoolCityName: {
      type: String,
      trim: true,
    },

    quotationCode: {
      type: String,
    },
    totalContractAmount: {
      type: Number,
      trim: true,
    },
    totalSoftwareContractAmount: {
      type: Number,
      trim: true,
    },
    totalHardwareContractAmount: {
      type: Number,
      trim: true,
    },
    totalServicesContractAmount: {
      type: Number,
      trim: true,
    },
    productDetails: [],
    hardwareDetails: [],
    hardwareContentDetails: [],
    serviceDetails: [],
    activationResponse: [],

    createdByName: {
      type: String,
      trim: true,
    },
    createdByRoleName: {
      type: String,
      trim: true,
    },
    createdByProfileName: {
      type: String,
      trim: true,
    },
    createdByEmpCode: {
      type: String,
      trim: true,
    },
    createdByUuid: {
      type: String,
      trim: true,
    },
    modifiedByName: {
      type: String,
      trim: true,
    },
    modifiedByRoleName: {
      type: String,
      trim: true,
    },
    modifiedByProfileName: {
      type: String,
      trim: true,
    },
    modifiedByEmpCode: {
      type: String,
      trim: true,
    },
    modifiedByUuid: {
      type: String,
      trim: true,
    },
    isDeleted: { type: Boolean, default: false },

    approvalStatus: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      trim: true,
    },
    stage: {
      type: String,
      trim: true,
    },
    scheduleStatus:{
      type: String,
      enum: ['Pending', 'Generated'],
      default: 'Pending'
    },
    packageActivation: {
      type: Boolean,
      default: false
    },
    assignedEngineerName: {
      type: String,
      trim: true,
    },
    assignedEngineerEmpCode: {
      type: String,
      trim: true,
    },
    assignedEngineerRoleName: {
      type: String,
      trim: true,
    },
    assignedEngineerProfileName: {
      type: String,
      trim: true,
    },
    journey: {
      type: String,
      trim: true
    },
    cycle: {
      type: String,
      trim: true
    },
    stage: {
      type: String,
      trim: true
    },
    qcEngineerAssigned: {
      type: Boolean,
      trim: true
    },
    ssrEngineerAssigned: {
      type: Boolean,
      trim: true
    }
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    strict: false,
  }
);

const ImplementationForm = mongoose.model(
  DB_MODEL_REF.IMPLEMENTATION_FORM,
  ImplementationFormSchema
);

module.exports = ImplementationForm;
