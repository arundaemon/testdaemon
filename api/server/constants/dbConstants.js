const DB_MODEL_REF = {
  USERS: 'Users',
  MENUS: 'Menus',
  PROJECTS: 'Projects',
  CYCLES: 'Cycles',
  STATUS: 'Status',
  JOURNEY: 'Journey',
  BANNER: 'Banner',
  LEADASSIGN: 'Leadassign',
  LEAD_OWNER: 'leadOwner',
  LEAD_OWNER_LOGS: 'leadOwnerLogs',
  RULE: 'Rule',
  ACTIVITIES: 'Activities',
  ROLE_BASED_ATTENDANCE_ACTIVITY_MODEL: 'RoleBasedAttendanceActivityModel',
  STAGES: 'Stage',
  SOURCES: 'Source',
  ATTENDANCE: 'Attendance',
  TASKS: 'Tasks',
  LEADS: 'Leads',
  LEAD_INTEREST: 'LeadInterest',
  Query: 'query',
  CAMPAIGN: 'Campaign',
  TARGET_INCENTIVE: 'TargetIncentive',
  TARGET: 'Target',
  TARGET_INCENTIVE_LOGS: 'TargetIncentiveLogs',
  ACTIVITYFORM: 'ActivitiesForm',
  BDEACTIVITIES: 'BdeActivities',
  SUBJECTMASTER: "subjectMaster",
  TASK_ACTIVITY_MAPPING: 'TaskActivityMapping',
  MANAGE_STAGE_STATUS_MAPPING: 'ManageStageStausMapping',
  Config: 'Config',
  ACTIVITY_FORM_MAPPING: 'activityformmapping',
  CATEGORY: 'Categories',
  APPROVAL_REQUEST: 'ApprovalRequest',
  POST_ACTIVITY: 'post_activity',
  LEAD_STAGE_STATUS: 'leadStageStatus',
  SUBJECT: 'Subject',
  CUSTOMER_RESPONSE: 'CustomerResponse',
  REASON_FOR_DISQUALIFICATION: 'reasonForDisqualification',
  ACTIVITY_TO_ACTIVITY_MAPPING: 'activitytoactivitymapping',
  FORM_TO_ACTIVITY_MAPPING: 'formtoactivitymapping',
  CUBE_BD_ACTIVITY: "CubeBdActivities",
  LEAD_LOGS: 'LeadLogs',
  BDE_COLLECT_PAYMENT: "bdeCollectPayment",
  BDE_COLLECT_PAYMENT: "bdeCollectPayment",
  LEAD_ASSIGN_LOGS: "LeadAssignLogs",
  CALL_LOGS: "call_logs",
  ALTERNATE_CONTACT: "alternateContacts",
  ORDER_LOGS: 'order_logs',
  REASON_FOR_PA_PENDING: 'reasonForPaPending',
  REASON_FOR_PA_REJECTED: 'reasonForPaRejected',
  REASON_FOR_OB_PENDING: 'reasonForObPending',
  REASON_FOR_OB_REJECTED: 'reasonForObRejected',
  REASON_FOR_FB_PENDING: 'reasonForFbPending',
  REASON_FOR_FB_REJECTED: 'reasonForFbRejected',
  REASON_FOR_ACK_PENDING: 'reasonForAckPending',
  REASON_FOR_ACK_REJECTED: 'reasonForAckRejected',
  SCHOOL: 'schools',
  SCHOOL_LOGS: 'schoolLogs',
  TERRITORY_MAPPING: 'territoryMapping',
  EXPENSE_TYPE_MAPPING: 'expenseTypeMapping',
  CLAIM_MASTER: 'claimMaster',
  USER_CLAIM: 'userClaim',
  COUPAN_REQUEST: 'CoupanRequest',
  APPROVAL_MAPPING: 'ApprovalMapping',
  CRM_MASTER: 'CrmMaster',
  CRM_FIELD_MASTER: 'CrmFieldMaster',
  PRODUCT_MASTER: 'ProductMaster',
  APPROVAL_MATRIX: 'ApprovalMatrix',
  PURCHASE_ORDER: 'PurchaseOrder',
  QUOTATION_CONFIG: 'QuotationConfig',
  QUOTATION: 'Quotation',
  SALES_APPROVAL: 'SalesApproval',
  IMPLEMENTATION_FORM: "ImplementationForm",
  IMPLEMENTATION_CONFIG: "ImplementationConfig",
  IMPLEMENTATION_SITE_SURVEY: "ImplementationSiteSurvey",
  ALERTNOTIFICATION: 'AlertNotification',
  IMPLEMENTATION_ASSIGNED_ENGINEER: 'ImplementationAssignedEngineer',
  IMPLEMENTATION_QC: 'ImplementationQc',
}

// ACTIVITIESFORMMAPPING
const SORT_TYPES = {
  ASC: "asc",
  DESC: "desc",
};

const USER_STATUS = {
  ACTIVE: 1,
  DEACTIVE: 0,
};

const BANNER_STATUS = {
  ACTIVE: 1,
  DEACTIVE: 0,
};

const MATRIX_TYPE = {
  PROFILE: "PROFILE",
  ROLE: "ROLE",
};

const REQUEST_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  DELETED: "DELETED",
  NEW: "NEW",
};
const JOURNEY_STATUS = {
  ACTIVE: 1,
  DEACTIVE: 0,
};

const CATEGORY_TYPE = {
  HOME_DEMO: "Home Demo",
  VIRTUAL_DEMO: "Virtual Demo",
  FOLLOW_UP: "Follow Up",
};

const CAMPAIGN_TYPE = {
  EMPTY: "",
  SEMINAR: "SEMINAR",
  WEBSITE: "WEBSITE",
  EMAIL: "EMAIL",
  REFERRAL_PROGRAM: "REFERRAL PROGRAM",
};

const CAMPAIGN_STATUS = {
  IN_PROGRESS: "IN PROGRESS",
  COMPLETED: "COMPLETED",
};

const BULK_UPLOAD_STATUS = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  FAILED: "Failed",
  UPLOADED: "Uploaded",
};

const CLAIM_STATUS = {
  PENDING_AT_BUH: "PENDING AT BUH",
  PENDING_AT_CBO: "PENDING AT CBO",
  PENDING_AT_FINANCE: "PENDING AT FINANCE",
  PENDING_AT_L1: "PENDING AT L1",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

const MIGRATION_STAGE_STATUS = {
  STAGE: "Data Migration",
  STATUS: "Migration Pending",
};

const FIELD_MASTER_TYPE = {
  INDEPENDENT: "INDEPENDENT",
  DEPENDENT: "DEPENDENT",
};

const QUOTATION_CONFIG_TYPE = {
  ACTUAL: "ACTUAL",
  DEMO: "DEMO",
};

const PRODUCT_CATEGORY = {
  HARDWARE: "Hardware",
  SOFTWARE: "Software",
  SERVICE: "Service",
  OTHERS: "Others",
};

const PRODUCT_TYPE = {
  ESCPLUS: 'ESC Plus',
  SIP: 'SIP',
  LEARNINGAPPLICATION: 'Learning Application',
  ASSESMENTCENTRE: 'Assesment Centre',
  TEACHINGAPP: 'Teaching App',
  CCT: 'CCT'
}

const APPROVAL_TYPE = {
  QUOTATION_ACTUAL: 'Quotation Actual',
  QUOTATION_DEMO: 'Quotation Demo',
  PO: 'PO',
  ICC: 'ICC',
  NPS: 'New Payment Schedule',
  TC: 'Terminate Contract',
  PS: 'Pause Subscription',
  SI: 'Implementation',
  CANCELLATION: 'Cancellation',
  RAISE_NPS: "Invoice & Collection Schedule (Raise NPS)",
  IMPLEMENTATION_SITE_SURVEY: 'Implementation Site Survey',
  ADDENDUM: 'Generate Addendum'
}

const APPROVAL_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  ADJUSTED: 'Adjusted',
}

const LEAD_TYPE = {
  INTEREST: 'INTEREST',
  IMPLEMENTATION: 'IMPLEMENTATION'
}

const IMPLEMENTATION_STATUS = {
  CHECKSHEET_SUBMITTED: 'Checksheet Submitted',
  READY_FOR_INSTALLATION: 'Ready for Installation',
  CANCELLED: 'Cancelled',
  PARTIAL_INSTALLATION: 'Partial Installation Completed',
  INSTALLATION_COMPLETED: 'Installation Completed',
}

const IMPLEMENTATION_STAGE = {
  SITE_SURVEY: 'Site Survey',
  HW_IMPLEMENTATION: 'H/W Implementation',
  HARDWARE_QC: 'Hardware QC'
}

const PO_ADVANCE_DETAILS_MODE = {
  PAYMENT_MODE: 'paymentMode',
  PAYMENT_DATE: 'paymentDate',
  PAYMENT_PROOF_URL: 'paymentProofUrl',
  RECIEVER_BANK_NAME: 'reciever_bank_name',
  RECIEVER_BANK_ACCOUNT_NUMBER: 'reciever_bank_name',
  ISSUE_BANK_NAME: 'issue_bank_name',
  ISUUE_BANK_ACCOUNT_NUMBER: 'issue_bank_name',
  ADVANCE_DETAILS_REF_NO: 'advanceDetailsRefNo',
  BANK_AMOUNT: 'bankAmount'
}

const QUOTATION_CATEGORY = {
  SOFTWARE: "Software",
  SERVICE: "Service"
}

const CRM_PROFILE = {
  FINANCE: 'Finance'
}



const TOKEN_EXPIRY = '1d'



// ========================== Export Module Start ==========================
module.exports = Object.freeze({
  DB_MODEL_REF,
  SORT_TYPES,
  USER_STATUS,
  REQUEST_STATUS,
  JOURNEY_STATUS,
  BANNER_STATUS,
  MATRIX_TYPE,
  CATEGORY_TYPE,
  CAMPAIGN_TYPE,
  CAMPAIGN_STATUS,
  TOKEN_EXPIRY,
  BULK_UPLOAD_STATUS,
  CLAIM_STATUS,
  FIELD_MASTER_TYPE,
  MIGRATION_STAGE_STATUS,
  QUOTATION_CONFIG_TYPE,
  PRODUCT_CATEGORY,
  PRODUCT_TYPE,
  APPROVAL_TYPE,
  APPROVAL_STATUS,
  LEAD_TYPE,
  IMPLEMENTATION_STATUS,
  IMPLEMENTATION_STAGE,
  PO_ADVANCE_DETAILS_MODE,
  CRM_PROFILE,
  QUOTATION_CATEGORY
});
// ========================== Export Module End ============================
