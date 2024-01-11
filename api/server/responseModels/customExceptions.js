// Load exceptions
var Exception = require("./Exception");
var constants = require("../constants/responseConstants");
//========================== Load Modules End =============================


//========================== Export Module Start ===========================
module.exports = {
    completeCustomException: (errcode, errMsg, error) => {
        if (error == false)
            return new Exception(errcode, errMsg);
        else
            return new Exception(errcode, errMsg, error);
    },
    intrnlSrvrErr: (err) => {
        return new Exception(1, constants.MESSAGES.INTERNAL_SERVER_ERROR, err);
    },
    unauthorizeAccess: (err) => {
        return new Exception(2, constants.MESSAGES.UNAUTHORIZED_ACCESS_EXCEPTION, err)
    },
    noTokenSupplied: (err) => {
        return new Exception(3, constants.MESSAGES.NO_TOKEN_SUPPLIED, err)
    },
    dataSetExist: (err) => {
        return new Exception(4, constants.MESSAGES.DATA_SET_EXIST, err)
    },
    dashbooardExist: (err) => {
        return new Exception(5, constants.MESSAGES.DASHBOARD_EXIST, err)
    },
    dataSetDoesNotExist: (err) => {
        return new Exception(6, constants.MESSAGES.DATASET_NOT_EXIST, err)
    },
    joinDoesNotExist: (err) => {
        return new Exception(7, constants.MESSAGES.JOIN_NOT_EXIST, err)
    },
    tableAliasExist: (err) => {
        return new Exception(8, constants.MESSAGES.TABLE_ALIAS_EXIST, err)
    },
    userTypeExist: (err) => {
        return new Exception(9, constants.MESSAGES.USER_TYPE_EXIST, err)
    },
    roleExist: (err) => {
        return new Exception(9, constants.MESSAGES.ROLE_EXIST, err)
    },
    folderExist: (err) => {
        return new Exception(10, constants.MESSAGES.FOLDER_EXIST, err)
    },
    maxFolderCount: (err) => {
        return new Exception(11, constants.MESSAGES.MAX_FOLDER_REACHED, err)
    },
    userUuidExist: (err) => {
        return new Exception(12, constants.MESSAGES.USER_UUID_EXIST, err)
    },
    userUuidDontExist: (err) => {
        return new Exception(13, constants.MESSAGES.UUID_DONT_EXIST, err)
    },
    wrongCredentials: (err) => {
        return new Exception(14, constants.MESSAGES.WRONG_CREDENTIALS, err)
    },
    userDeactivated: (err) => {
        return new Exception(15, constants.MESSAGES.USER_DEACTIVATED, err)
    },
    userKeyExist: (err) => {
        return new Exception(16, `User With This ${err} Already Exist`, err)
    },
    tokenExpired: (err) => {
        return new Exception(17, constants.MESSAGES.TOKEN_EXPIRED, err)
    },
    cycleExists: (err) => {
        return new Exception(18, constants.MESSAGES.CYCLE_EXISTS, err)
    },
    statusExists: (err) => {
        return new Exception(19, constants.MESSAGES.STATUS_EXISTS, err)
    },
    stageExists: (err) => {
        return new Exception(20, constants.MESSAGES.STAGE_EXISTS, err)
    },
    sourceExists: (err) => {
        return new Exception(21, constants.MESSAGES.SOURCE_EXISTS, err)

    },
    leadDoesNotExist: (err) => {
        return new Exception(22, constants.MESSAGES.LEAD_NOT_EXISTS, err)
    },
    wrongTemplate: (err) => {
        return new Exception(23, constants.MESSAGES.WRONG_TEMPLATE, err)
    },
    campaignExists: (err) => {
        return new Exception(24, constants.MESSAGES.CAMPAIGN_EXISTS, err)

    },
    territoryExists: (err) => {
        return new Exception(25, constants.MESSAGES.TERRITORY_EXISTS, err)

    },
    userExists: (err) => {
        return new Exception(26, constants.MESSAGES.USER_EXISTS, err)
    },
    duplicateCombination: (err) => {
        return new Exception(27, constants.MESSAGES.DUPLICATE_COMBINATION, err)
    },
    dndStatusActivated: (err) => {
        return new Exception(28, constants.MESSAGES.DND_STATUS_ACTIVATED, err)
    },
    dndStatusDeactivated: (err) => {
        return new Exception(29, constants.MESSAGES.DND_STATUS_DEACTIVATED, err)
    },
    duplicateRequest: (err) => {
        return new Exception(30, constants.MESSAGES.DUPLICATE_REQUEST, err)
    },
    duplicateClaimMaster: (err) => {
        return new Exception(31, constants.MESSAGES.DUPLICATE_CLAIM_MASTER, err)
    },
    duplicateCrmFieldMaster: (err) => {
        return new Exception(31, constants.MESSAGES.DUPLICATE_CRM_FIELD_MASTER, err)
    },
    duplicateSchool: (err) => {
        return new Exception(32, constants.MESSAGES.DUPLICATE_SCHOOL, err)
    },
    duplicateQuotationConfig: (err) => {
        return new Exception(33, constants.MESSAGES.DUPLICATE_QUOTATION_CONFIG, err)
    },
    duplicateApprovalMatrix: (err) => {
        return new Exception(34, constants.MESSAGES.DUPLICATE_APPROVAL_MATRIX, err)
    },
    purchaseOrderExists: (err) => {
        return new Exception(35, constants.MESSAGES.DUPLICATE_PURCHASE_ORDER, err)

    },
    consentFileRequired: (err) => {
        return new Exception(36, constants.MESSAGES.CONSENT_FILE_REQUIRED, err)
    }

};