var mongoose = require("mongoose");
const {
  DB_MODEL_REF,
  USER_STATUS,
  QUOTATION_CONFIG_TYPE,
  PRODUCT_CATEGORY,
  PRODUCT_TYPE,
} = require("../constants/dbConstants");
let Quotation;
let Schema = mongoose.Schema;

var quotationSchema = new Schema(
  {
    quotationCode: {
      type: String,
      trim: true,
      required: true,
      // unique: true
    },
    quotationFor: {
      type: String,
      enum: [QUOTATION_CONFIG_TYPE.ACTUAL, QUOTATION_CONFIG_TYPE.DEMO], //enum
      trim: true,
      required: true
    },
    quotationMasterConfigId: {
      type: String,
      trim: true,
    },
    quotationMasterConfigJson: [
      {
        type: Object,
      },
    ],
    leadId: {
      type: String,
      trim: true,
    },
    productName: {
      type: String,
      trim: true,
    },
    productCode: {
      type: String,
      trim: true
    },
    groupCode: {
      type: String,
      trim: true
    },
    groupName: {
      type: String,
      trim: true
    },
    productItemCategory: {
      type: String,
      enum: [
        PRODUCT_CATEGORY.HARDWARE,
        PRODUCT_CATEGORY.SOFTWARE,
        PRODUCT_CATEGORY.SERVICE,
      ],
      required: true
    },
    quotationTypeDescription: {
      type: String,
      trim: true,
    },
    quotationRemarks: {
      type: String,
      trim: true,
    },
    approvalRequestRemark: {
      type: String,
      trim: true,
    },
    productItemCode: {
      type: String,
      trim: true,
    },
    productItemName: {
      type: String,
      trim: true,
      required: true
    },
    productItemDuration: {
      type: Number,
      trim: true,
    },
    productItemMrp: {
      type: Number,
      trim: true,
      required: true
    },
    productItemMop: {
      type: Number,
      trim: true,
      required: true
    },
    productItemSalePrice: {
      type: Number,
      trim: true,
      required: true
    },
    productItemQuantity: {
      type: Number,
      trim: true,
    },
    productItemBoardName: {
      type: String,
      trim: true,
    },
    productItemClassName: {
      type: String,
      trim: true,
    },
    modeOfEsc: {
      type: String,
      trim: true,
    },
    hardwareItemProductType: {
      type: String,
      trim: true,
    },
    itemVariantName: {
      type: String,
      trim: true,
    },
    emailSendTo: {
      type: String,
      trim: true,
    },
    emailSendCc: {
      type: String,
      trim: true,
    },
    productPriceParameters: [
      {
        type: Object,
      },
    ],
    schoolId: {
      // school info
      type: String,
      trim: true,
      // required: true
    },
    schoolCode: {
      type: String,
      trim: true,
      required: true
    },
    schoolName: {
      type: String,
      trim: true,
      // required: true
    },
    schoolPinCode: {
      type: String,
      trim: true,
      // required: true
    },
    schoolAddress: {
      type: String,
      trim: true,
      // required: true
    },
    schoolEmailId: {
      type: String,
      trim: true,
      // required:true
    },
    schoolCountryCode: {
      type: String,
      trim: true,
      // required: true
    },
    schoolCountryName: {
      type: String,
      trim: true,
      // required: true
    },
    schoolType: {
      type: String,
      trim: true,
    },
    schoolStateCode: {
      type: String,
      trim: true,
      // required: true
    },
    schoolStateName: {
      type: String,
      trim: true,
      // required: true
    },
    schoolCityCode: {
      type: String,
      trim: true,
      // required:true
    },
    schoolCityName: {
      type: String,
      trim: true,
      // required: true
    },
    schoolBoardName: {
      type: String,
      trim: true,
    },
    schoolBoardClasses: {
      type: String,
      trim: true,
    },
    totalStudentForQuotation: {
      type: String,
      trim: true
    },
    totalTeacherForQuotation: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      trim: true,
    },
    approvalStatus: {
      type: String,
      trim: true,
    },
    createdByName: {
      type: String,
      trim: true,
      required: true
    },
    createdByRoleName: {
      type: String,
      trim: true,
      required: true
    },
    createdByProfileName: {
      type: String,
      trim: true,
      required: true
    },
    createdByEmpCode: {
      type: String,
      trim: true,
      required: true
    },
    createdByUuid: {
      type: String,
      trim: true,
      required: true
    },
    modifiedByName: {
      type: String,
      trim: true,
      required: true
    },
    modifiedByRoleName: {
      type: String,
      trim: true,
      required: true
    },
    modifiedByProfileName: {
      type: String,
      trim: true,
      required: true
    },
    modifiedByEmpCode: {
      type: String,
      trim: true,
      required: true
    },
    modifiedByUuid: {
      type: String,
      trim: true,
      required: true
    },
    isDeleted: { 
      type: Boolean, 
      default: false 
    },
    isPoGenerated: { 
      type: Boolean, 
      default: false 
    },
    totalPrice: {
      type: Number,
      trim: true
    },
    totalSaleprice: {
      type: Number,
      trim: true
    },
    totalDiscount: {
      type: Number,
      trim: true
    },
    totalDiscountPercentage: {
      type: Number,
      trim: true
    },
    productItemDiscount: {
      type: Number,
      trim: true
    },
    productItemDiscountPercentage: {
      type: Number,
      trim: true
    }

  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    strict: false,
  }
);

module.exports = Quotation = mongoose.model(
  DB_MODEL_REF.QUOTATION,
  quotationSchema
);
