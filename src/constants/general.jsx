export const USER_TYPE = [
  { id: 1, label: "STUDENT" },
  { id: 2, label: "PARENT" },
  { id: 3, label: "TEACHER" },
  { id: 4, label: "PRINCIPAL" },
  { id: 5, label: "SCHOOL ADMIN" },
  { id: 6, label: "SIP PRINCIPAL" },
  { id: 7, label: "GUEST" },
  { id: 10, label: "SUPER ADMIN" },
];

export const BOARDCLASS = [
  { value: "K-5", label: "K-5" },
  { value: "6-8", label: "6-8" },
  { value: "9-12", label: "9-12" },
  { value: "K-12", label: "K-12" },
];
export const VISITOPTIONS = [
  { label: "Cold Meeting", value: "Cold Meeting" },
  { label: "Follow-Up Meeting", value: "Follow-Up Meeting" },
  { label: "Sales Follow-Up Meeting", value: "Sales Follow-Up Meeting" },
  { label: "Demo Follow-Up Meeting", value: "Demo Follow-Up Meeting" },
  { label: "Product demo", value: "Product demo" },
  { label: "Proposal meeting", value: "Proposal meeting" },
  { label: "Negotiation meeting", value: "Negotiation meeting" },
  { label: "Collection meeting", value: "Collection meeting" },
  { label: "Service meeting", value: "Service meeting" },
];

export const DesignationOptions = [
  { value: "Director", label: "Director" },
  { value: "Account Executive", label: "Account Executive" },
  { value: "IT Head", label: "IT Head" },
  { value: "Chairman", label: "Chairman" },
  { value: "Principal", label: "Principal" },
  { value: "Teacher", label: "Teacher" },
  { value: "Employee", label: "Employee" },
  { value: "Reception", label: "Reception" },
  { value: "Other", label: "Other" },
];

export const BDEACTIVITYKEYLABEL = {
  customerResponse: "Customer Response",
  subject: "Subject",
  productInterest: "Product Interest",
  meetingDate: "Meeting Date",
  meetingType: "Meeting Type",
  priority: "Priority",
  callActivity: "Call Activity",
  activityName: "Activity Name",
  approvalActivity: "Approval Activity",
  category: "Category",
  edc: "EDC",
  meetingStatus: "Meeting Status",
  minutesOfMeeting: "Minutes of Meeting",
  contactDetails: "Conversation With",
  visitOutcome: "Outcome of visit",
  escUnit: "ESC Unit",
  contactDurationInMonths: "Contract Duration",
  ratePerStudent: "Rate Per Student",
  ratePerClassroom: "Rate Per Classroom",
  paymentSchedule: "Payment Schedule",
  monthlyInvoice: "Monthly Invoice",
  softwareContractValue: "Software Contract Value",
  hardware: "Hardware",
  hardwareProduct: "HardWare Product",
  hardwareContractValue: "HardWare Contract Value",
  studentUnit: "Student Unit",
  course: "Course",
  grade: "Grade",
  lectureDeliveryType: "Lecture Type",
  offeringType: "Offering Type",
  assessmentCenter: "Assessment Center",
  weeklyExclusiveDoubtSession: "Weekly Exclusive Doubt Session",
  numberOfStudent: "Number Of Student",
  numberOfBatches: "Number Of Batches",
  numberOfStudentsPerBatch: "Number Of Students Per Batch",
  testPrepPackageSellingPricePerStudent: "PrepPackage Selling Per Student",
  assessmentCentrePricePerStudent: "Assessment Centre Price Per Student",
  grossSellingPricePerStudent: "Gross Selling Price Per Student",
  duration: "Duration",
  grossContractValue: "Gross Contract Value",
  units: "Units",
  grades: "Grades",
  grossRatePerUnit: "Gross Rate Per Unit",
  netRatePerUnit: "Net Rate Per Unit",
  netMonthlyInvoicing: "Net Monthly Invoicing",
  totalContractValue: "Total Contract Value",
};

export const MATRIXTYPE = [
  { value: "Value Based", label: "Value Based" },
  { value: "Quantity Based", label: "Quantity Based" },
  { value: "Value & Quantity Based", label: "Value & Quantity Based" },
];

export const DETAILS_MODE = [
  { value: "Cheque", label: "Cheque" },
  { value: "Cash", label: "Cash" },
  { value: "Demand Draft", label: "Demand Draft" },
];

export const QuotaionFormFields = {
  field1: {
    fieldName: "ratePerMonth",
    label: "Rate per month (Incl.GST)",
    fieldCode: "ratePerUnit",
  },
  field2: {
    fieldName: "payCount",
    label: "Gross Value",
    fieldCode: "payCount",
  },
  field3: {
    fieldName: "productItemRefId",
    label: "Package",
    fieldCode: "productItemRefId",
  },
  field4: { fieldName: "board", label: "Board", fieldCode: "boardName" },
  field5: { fieldName: "class", label: "Class", fieldCode: "className" },
  field6: { fieldName: "discount", label: "Discount %", fieldCode: "discount" },
  field7: {
    fieldName: "productItemTotalPrice",
    label: "Cost",
    fieldCode: "productItemTotalPrice",
  },
  field8: {
    fieldName: "contractDuration",
    label: "Contract Duration",
    fieldCode: "contractDuration",
  },
  field9: {
    fieldName: "teritory",
    label: "Teritory",
    fieldCode: "",
  },
};

export const ProductQuoteType = {
  HARDWARE: "Hardware",
  SOFTWARE: "Software",
  SERVICE: "Service",
  OTHERS: "Others",
  BUNDLE: "Bundle",
  PART: "Part",
};

export const QUOTATIONSOFTWAREKEY = {
  "Net Rate per Unit": true,
  "Contact Duration (in months)": true,
  payCount: true,
  ratePerMonth: true,
  productItemName: true,
};
export const QuoteType = {
  isDemo: "DEMO",
  isActual: "ACTUAL",
  isQuoationActual: "Quotation Actual",
  isQuoationDemo: "Quotation Demo",
  isBundle: "Bundle",
  isPart: "Part",
  isStatusDraft: "Draft",
  isStatusNew: "New",
  isStatusPending: "Pending",
  isSSRType: "SSR",
  isNumberField: "Integer",
  isSSRIMPLEMENTATIONTYPE: "Implementation Site Survey",
  isSSRPENDING: "SSR Pending",
  isQCComplete: "QC Completed",
  isSSRSUBMITTED: 'SSR Submitted'
};

export const productType = {
  "ESC Plus": 199,
  SIP: 200,
};

export const processorOptionsStandalone = [
  { value: "Celeron", label: "Celeron" },
  { value: "DualCore", label: "Dual Core" },
  { value: "i3", label: "i3" },
  { value: "i5", label: "i5" },
  { value: "i7", label: "i7" },
  { value: "i9", label: "i9" },
  { value: "Xeon4Core", label: "Xeon 4 Core" },
  { value: "AMDRyzen", label: "AMD Ryzen" },
  { value: "IntelXeon", label: "Intel Xeon" },
];

export const generationOptionsStandalone = [
  { value: "2nd", label: "2nd" },
  { value: "3rd", label: "3rd" },
  { value: "4th", label: "4th" },
  { value: "5th", label: "5th" },
  { value: "6th", label: "6th" },
  { value: "7th", label: "7th" },
  { value: "8th", label: "8th" },
  { value: "9th", label: "9th" },
  { value: "10th", label: "10th" },
  { value: "11th", label: "11th" },
  { value: "12th", label: "12th" },
];

export const hddOptionsStandalone = [
  { value: "256GB", label: "256 GB", type: "HDD" },
  { value: "500GB", label: "500 GB", type: "HDD" },
  { value: "1TB", label: "1 TB", type: "HDD" },
  { value: "2TB", label: "2 TB", type: "HDD" },
  { value: "4TB", label: "4 TB", type: "HDD" },
  { value: "500GB+128GBSSD", label: "500 GB + 128 GB SSD", type: "Hybrid" },
  { value: "1TB+128GBSSD", label: "1 TB + 128 GB SSD", type: "Hybrid" },
];

export const ramOptionsStandalone = [
  { value: "2GB", label: "2 GB" },
  { value: "4GB", label: "4 GB" },
  { value: "8GB", label: "8 GB" },
  { value: "16GB", label: "16 GB" },
  { value: "32GB", label: "32 GB" },
];

export const osOptionsStandalone = [
  { value: "Ubuntu16.04-64bit", label: "Ubuntu 16.04 64 bit" },
  { value: "Ubuntu16.04-32bit", label: "Ubuntu 16.04 32 bit" },
  { value: "Ubuntu18.04", label: "Ubuntu 18.04" },
  { value: "Ubuntu20.04", label: "Ubuntu 20.04" },
  { value: "Ubuntu22.04", label: "Ubuntu 22.04" },
  { value: "Ubuntu23.04", label: "Ubuntu 23.04" },
  { value: "Windows7", label: "Windows 7" },
  { value: "Windows10", label: "Windows 10" },
  { value: "Windows11", label: "Windows 11" },
];

export const cpuCoreOptionsStandalone = [
  { value: "2", label: "2" },
  { value: "4", label: "4" },
  { value: "6", label: "6" },
  { value: "8", label: "8" },
  { value: "10", label: "10" },
];

export const internetOptionsStandalone = [
  { value: "2-5MBPS", label: "Yes 2-5 MBPS" },
  { value: "5-10MBPS", label: "Yes 5-10 MBPS" },
  { value: "10-20MBPS", label: "Yes 10-20 MBPS" },
  { value: "20-40MBPS", label: "Yes 20-40 MBPS" },
  { value: "40-100MBPS", label: "Yes 40-100 MBPS" },
  { value: ">100MBPS", label: "Yes >100 MBPS" },
  { value: "No", label: "No" },
];

export const osOptionsIFP = [
  { value: "Android8", label: "Android 8" },
  { value: "Android9", label: "Android 9" },
  { value: "Android10", label: "Android 10" },
  { value: "Android11", label: "Android 11" },
];

export const hddOptionsIFP = [
  { value: "16GB", label: "16 GB" },
  { value: "32GB", label: "32 GB" },
  { value: "64GB", label: "64 GB" },
  { value: "128GB", label: "128 GB" },
];

export const ramOptionsIFP = [
  { value: "2GB", label: "2 GB" },
  { value: "4GB", label: "4 GB" },
  { value: "8GB", label: "8 GB" },
  { value: "16GB", label: "16 GB" },
];

export const micOptionsIFP = [
  { value: "External", label: "Yes - External" },
  { value: "Inbuilt", label: "Yes - Inbuilt" },
  { value: "No", label: "No" },
];

export const fieldTab = {
  Quotation: "Quotation",
  PO: "PO",
  Implementation: "Implementation",
  Interest: "Interest",
  SSR: "SSR",
  SSRActivity: "SSRActivity",
  collection: "COLLECTION",
  interest: "INTEREST",
  implementation: "IMPLEMENTATION",
  isQC: "QC",
};

export const subjectType = {
  siteSurvey: "Site Survey",
};

export const siteSurveyConstant = {
  isMeeting: "Meeting Happened",
  isSSRCustomerResponse: "Site Visited",
  isQCCustomerResponse: "QC Completed",
};

export const isRadioCheck = {
  isTrue: "Yes",
  isFalse: "No",
  isBoolean: "true",
  isNotBoolean: "false",
};

export const FieldCode = {
  contractDuration: "contractDuration",
  duration: "duration",
};

export const voucherTab = {
  ActiveVoucher: "Active Voucher",
  CancelledVocuher: "Cancelled Voucher",
};

export const fieldKey = {
  Implementation: "implementation",
  Interest: "INTEREST",
};

export const QCOPTIONS = [
  { label: "Implemented", value: "Implemented" },
  { label: "Ready For Implementation", value: "Ready For Implementation" },
  { label: "Damaged", value: "Damaged" },
  { label: "Return", value: "Return" },
  { label: "On hold", value: "On hold" },
];

export const QCSTATUS = {
  isImplementReady: "Ready For Implementation",
  isReturn: "Return",
  isImplemented: "Implemented",
};

export const assignedEngineerType = {
  QC: "QC",
  SSR: "SSR",
  isSSREngineerStatus: "Site Survey Engineer Assigned",
  isQCEngineerStatus: "QC & Installation Engineer Assigned",
  status: "dispatched",
};

export const FieldLabel = {
  collectedAmount: "Did you collect any Amount?",
  interest: "interest",
};

export const CurrencySymbol = {
  India: "₹",
};
export const mappingType = [
  { label: "User", value: "User" },
  { label: "Interest", value: "Interest" },
  { label: "Implementation", value: "Implementation" },
];


// export const UserProfileCode = [
//   "PR0026",
//   "PR0011",
//   "PR0055",
//   "PR0069",
//   "PR0174",
//   "PR0006",
//   "PR0174",
//   "PR0151",
//   "PR0152"
// ];


export const UserProfileName = [
  "ASM-Collection School Sales",
  "Executive - Collection School Sales",
  "Manager - Collection School Sales",
  "Collection School Sales",
  "Manager - Collections",
  "ASM - Collections",
];


export const INVOICE_ACTIONS = {
  CREATE_IRN: "CREATE_IRN",
  CREATE_ZIP: "CREATE_ZIP",
  SEND_MAIL: "SEND_MAIL"
}


export const PAYMENTMODE = [
  { label: "Cheque", value: "Cheque" },
  { label: "Cash", value: "Cash" },
  { label: "Demand Draft", value: "Demand Draft" },
  { label: "Online Payment", value: "Online Payment" }
];


export const IndicatorBasedboardIds = [
  596,606
]

export const IndicatorUniqueboardIds = [
  167721222433965
]
