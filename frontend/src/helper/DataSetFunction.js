import CubeSocket, { CubeQuery } from "./CubeSocket";
import { getUserData } from "./randomFunction/localStorage";
import CubeDataset from "../config/interface";
import { DecryptData } from "../utils/encryptDecrypt";
import { getBookingDate, handleStartMonth } from "./randomFunction";
import settings from "../config/settings";
import moment from "moment";

export const LeadData = (
  itemsPerPage,
  search,
  pageNo,
  sortObj,
  filtersApplied
) => {
  const query = [
    {
      measures: [],
      order: { [sortObj?.sortLeadKey]: sortObj?.sortOrder },
      limit: itemsPerPage ?? 100,
      offset: Number((pageNo - 1) * itemsPerPage),
      dimensions: [
        CubeDataset.Leads.name,
        CubeDataset.Leads.createdAt,
        CubeDataset.Leads.sourceName,
        CubeDataset.Leads.subSourceName,
        CubeDataset.Leads.assignedToRoleName,
        CubeDataset.Leads.Id,
        CubeDataset.Leads.city,
        CubeDataset.Leads.updatedAt,
      ],
      timezone: "UTC",
      timeDimensions: [
        {
          dimension: CubeDataset.Leads.createdAt,
          dateRange: "This Year",
          granularity: "week",
        },
      ],
      filters: [],
      renewQuery: true,
    },
    {
      measures: [],
      order: { [sortObj?.sortUserKey]: sortObj?.sortOrder },
      dimensions: [
        CubeDataset.OnlineLeads.username,
        CubeDataset.OnlineLeads.createTime,
        CubeDataset.OnlineLeads.uuid,
        CubeDataset.OnlineLeads.city,
        CubeDataset.OnlineLeads.updatedOn,
      ],
      limit: itemsPerPage ?? 100,
      offset: Number((pageNo - 1) * itemsPerPage),
      timezone: "UTC",
      timeDimensions: [
        {
          dimension: CubeDataset.OnlineLeads.createTime,
          dateRange: "This Year",
          granularity: "week",
        },
      ],
      filters: [],
      renewQuery: true,
    },
  ];

  if (search) {
    query[0]["filters"] = [
      {
        or: [
          {
            member: CubeDataset.Leads.name,
            operator: "contains",
            values: [search],
          },
          {
            member: CubeDataset.Leads.mobile,
            operator: "contains",
            values: [search],
          },
        ],
      },
    ];

    query[1]["filters"] = [
      {
        or: [
          {
            member: CubeDataset.OnlineLeads.username,
            operator: "contains",
            values: [search],
          },
          {
            member: CubeDataset.OnlineLeads.mobile,
            operator: "contains",
            values: [search.toString()],
          },
        ],
      },
    ];
  }

  if (filtersApplied?.length) {
    filtersApplied?.map((filterObj) => {
      let filterQueryObj = {};

      if (filterObj?.dataset?.dataSetName === "Leads") {
        filterQueryObj[
          "member"
        ] = `${filterObj?.dataset?.dataSetName}.${filterObj?.field?.name}`;
        filterQueryObj["operator"] = `${filterObj?.operator?.value}`;
        filterQueryObj["values"] = filterObj?.filterValue;
        query[0]["filters"]?.push(filterQueryObj);
        query[1]["limit"] = 1;
      } else if (filterObj?.dataset?.dataSetName === CubeDataset.OnlineLeads) {
        filterQueryObj[
          "member"
        ] = `${filterObj?.dataset?.dataSetName}.${filterObj?.field?.name}`;
        filterQueryObj["operator"] = `${filterObj?.operator?.value}`;
        filterQueryObj["values"] = filterObj?.filterValue;
        query[1]["filters"]?.push(filterQueryObj);
        query[0]["limit"] = 1;
      }
    });
  }
  return CubeQuery({ query });
};

export const getUserClaimFinance = (props) => {
  let {
    itemsPerPage,
    search,
    pageNo,
    sortObj,
    status,
    filtersApplied,
    userName,
  } = props;

  const query = {
    measures: [],
    order: {
      [CubeDataset.EmployeeClaim.updatedAt]: "desc",
    },
    limit: itemsPerPage ?? 100,
    offset: Number((pageNo - 1) * itemsPerPage),
    dimensions: [
      CubeDataset.EmployeeClaim.claimId,
      CubeDataset.EmployeeClaim.MongoID,

      CubeDataset.EmployeeClaim.requestByEmpCode,
      CubeDataset.EmployeeClaim.visitDate,
      CubeDataset.EmployeeClaim.billFile,
      CubeDataset.EmployeeClaim.visitNumber,

      CubeDataset.EmployeeClaim.requestByName,
      CubeDataset.EmployeeClaim.schoolName,
      CubeDataset.EmployeeClaim.expenseType,
      CubeDataset.EmployeeClaim.claimStatus,
      CubeDataset.EmployeeClaim.approvedDate,
      CubeDataset.EmployeeClaim.approvedAmount,
      CubeDataset.EmployeeClaim.claimAmount,
      CubeDataset.EmployeeClaim.updatedAt,
      CubeDataset.EmployeeClaim.createdAt,
    ],
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.EmployeeClaim.createdAt,
        dateRange: "from 365 days ago to now",
        granularity: "day",
      },
    ],
    filters: [],
    renewQuery: true,
  };

  if (search && !query["filters"]?.find((obj) => obj["or"])) {
    query?.["filters"]?.push(
      // {
      //     or:
      //         [
      //             { "member": CubeDataset.EmployeeClaim.requestByName, "operator": "contains", "values": [search] },
      //             { "member": CubeDataset.EmployeeClaim.schoolName, "operator": "contains", "values": [search] },
      //             { "member": CubeDataset.EmployeeClaim.expenseType, "operator": "contains", "values": [search] }
      //         ]
      // }
      {
        member: CubeDataset.EmployeeClaim.schoolName,
        operator: "contains",
        values: [search],
      }
    );
  }

  if (status) {
    query?.["filters"]?.push({
      member: CubeDataset.EmployeeClaim.claimStatus,
      operator: "equals",
      values: status,
    });
  }

  if (filtersApplied?.length) {
    filtersApplied?.map((filterObj) => {
      let filterQueryObj = {};
      // if (filterObj?.dataset?.dataSetName === 'LeadassignsBq') {
      filterQueryObj[
        "member"
      ] = `${filterObj?.dataset?.dataSetName}.${filterObj?.field?.name}`;
      filterQueryObj["operator"] = `${filterObj?.operator?.value}`;
      filterQueryObj["values"] = filterObj?.filterValue;
      query?.["filters"]?.push(filterQueryObj);
      // }
    });
  }

  if (userName) {
    query?.["filters"].push({
      member: CubeDataset.EmployeeClaim.requestByEmpCode,
      operator: "equals",
      values: [userName],
    });
  }

  return CubeQuery({ query });
};

export const getReportSchoolList = async (props) => {
  let {
    itemsPerPage,
    search,
    pageNo,
    filtersApplied,
    priority,
    childRoleNames,
  } = props;
  let roleName = getUserData("userData")?.crm_role;

  const query = {
    measures: [
      //CubeDataset.Leadinterests.EdcCountSum,
      //CubeDataset.Leadinterests.MaxEdc,
      //CubeDataset.Leadinterests.LearningProfileGroupedName,
    ],
    order: {
      [CubeDataset.Schools.updatedAt]: "desc",
    },
    dimensions: [
      CubeDataset.Schools.leadId,
      CubeDataset.Schools.schoolCode,
      CubeDataset.Schools.schoolName,
      CubeDataset.Schools.interestShown,
      CubeDataset.Schools.address,
      CubeDataset.Schools.createdAt,
      CubeDataset.Schools.updatedAt,
      CubeDataset.Schools.assignedToDisplayName,
      //CubeDataset.Leadinterests.learningProfile,
      //CubeDataset.Leadinterests.statusName,
      //CubeDataset.Leadinterests.stageName,
      CubeDataset.Leadinterests.sourceName,
      CubeDataset.Leadinterests.subSourceName,
      //CubeDataset.Leadinterests.edc,
      //CubeDataset.Leadinterests.edcCount,
      //CubeDataset.Leadinterests.softwareContractValue,
    ],
    limit: itemsPerPage ?? 100,
    offset: Number((pageNo - 1) * itemsPerPage),
    timezone: "UTC",
    timeDimensions: [
      /* {
        dimension: CubeDataset.Schools.createdAt,
        dateRange: "This Year",
        granularity: "week",
      }, */
    ],
    filters: [],
    renewQuery: true,
  };

  if (filtersApplied?.length > 0) {
    filtersApplied?.map((filterObj) => {
      let filterQueryObj = {};
      filterQueryObj[
        "member"
      ] = `${filterObj?.dataset?.dataSetName}.${filterObj?.field?.name}`;
      filterQueryObj["operator"] = `${filterObj?.operator?.value}`;
      filterQueryObj["values"] = filterObj?.filterValue;
      query?.["filters"]?.push(filterQueryObj);
      // }
    });
  }

  if (priority) {
    query?.["filters"].push({
      member: CubeDataset.Leadinterests.priority,
      operator: "equals",
      values: [priority],
    });
  }

  if (search && !query["filters"]?.find((obj) => obj["or"])) {
    query?.["filters"]?.push(
      // {
      //     or:
      //         [
      //             { "member": CubeDataset.School.schoolCode, "operator": "contains", "values": [search] },
      //             { "member": CubeDataset.School.schoolName, "operator": "contains", "values": [search] },
      //         ]
      // }
      {
        member: CubeDataset.Schools.schoolName,
        operator: "contains",
        values: [search],
      }
    );
  }

  if (settings.ADMIN_ROLES.indexOf(roleName) < 0 && childRoleNames?.length > 0) {
    query?.["filters"].push({
      member: CubeDataset.Schools.assignedToRoleName,
      operator: "equals",
      values: childRoleNames,
    });
  }

  return CubeQuery({ query });
};

export const getReportSchoolListMobile = async (props) => {
  let {
    itemsPerPage,
    search,
    pageNo,
    filtersApplied,
    priority,
    childRoleNames,
  } = props;

  const query = {
    measures: [
      CubeDataset.Leadinterests.EdcCountSum,
      CubeDataset.Leadinterests.MaxEdc,
      CubeDataset.Leadinterests.LearningProfileGroupedName,
    ],
    order: {
      [CubeDataset.Schools.updatedAt]: "desc",
    },
    dimensions: [
      CubeDataset.Schools.leadId,
      CubeDataset.Schools.schoolCode,
      CubeDataset.Schools.schoolName,
      CubeDataset.Schools.interestShown,
      CubeDataset.Schools.address,
      CubeDataset.Schools.createdAt,
      CubeDataset.Schools.updatedAt,
      CubeDataset.Schools.assignedToDisplayName,
      //CubeDataset.Leadinterests.learningProfile,
      //CubeDataset.Leadinterests.statusName,
      //CubeDataset.Leadinterests.stageName,
      CubeDataset.Leadinterests.sourceName,
      CubeDataset.Leadinterests.subSourceName,
      //CubeDataset.Leadinterests.edc,
      //CubeDataset.Leadinterests.edcCount,
      //CubeDataset.Leadinterests.softwareContractValue,
    ],
    limit: itemsPerPage ?? 100,
    offset: Number((pageNo - 1) * itemsPerPage),
    timezone: "UTC",
    timeDimensions: [
      /* {
        dimension: CubeDataset.Schools.createdAt,
        dateRange: "This Year",
        granularity: "week",
      }, */
    ],
    filters: [],
    renewQuery: true,
  };

  if (filtersApplied?.length > 0) {
    filtersApplied?.map((filterObj) => {
      let filterQueryObj = {};
      filterQueryObj[
        "member"
      ] = `${filterObj?.dataset?.dataSetName}.${filterObj?.field?.name}`;
      filterQueryObj["operator"] = `${filterObj?.operator?.value}`;
      filterQueryObj["values"] = filterObj?.filterValue;
      query?.["filters"]?.push(filterQueryObj);
      // }
    });
  }

  if (priority) {
    query?.["filters"].push({
      member: CubeDataset.Leadinterests.priority,
      operator: "equals",
      values: [priority],
    });
  }

  if (search && !query["filters"]?.find((obj) => obj["or"])) {
    query?.["filters"]?.push(
      // {
      //     or:
      //         [
      //             { "member": CubeDataset.School.schoolCode, "operator": "contains", "values": [search] },
      //             { "member": CubeDataset.School.schoolName, "operator": "contains", "values": [search] },
      //         ]
      // }
      {
        member: CubeDataset.Schools.schoolName,
        operator: "contains",
        values: [search],
      }
    );
  }

  if (childRoleNames) {
    query?.["filters"].push({
      member: CubeDataset.Schools.assignedToRoleName,
      operator: "equals",
      values: childRoleNames,
    });
  }

  return CubeQuery({ query });
};

export const getBdeActivitiesData = (props) => {
  let { leadId, filtersApplied } = props;
  const query = {
    measures: [],
    dimensions: [
      CubeDataset.Bdeactivities.subject,
      CubeDataset.Bdeactivities.createdAt,
      CubeDataset.Bdeactivities.contactDetails,
      // CubeDataset.Bdeactivities.createdAt,
      CubeDataset.Bdeactivities.name,
      CubeDataset.Bdeactivities.createdByName,
    ],
    limit: 10,
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.Bdeactivities.createdAt,
        dateRange: "This Year",
        granularity: "week",
      },
    ],
    filters: [],
    renewQuery: true,
  };

  if (leadId) {
    query?.["filters"].push({
      member: CubeDataset.Bdeactivities.leadId,
      operator: "equals",
      values: [leadId],
    });
  }

  if (filtersApplied?.length > 0) {
    filtersApplied?.map((filterObj) => {
      let filterQueryObj = {};
      filterQueryObj[
        "member"
      ] = `${filterObj?.dataset?.dataSetName}.${filterObj?.field?.name}`;
      filterQueryObj["operator"] = `${filterObj?.operator?.value}`;
      filterQueryObj["values"] = filterObj?.filterValue;
      query?.["filters"]?.push(filterQueryObj);
      // }
    });
  }

  return CubeQuery({ query });
};

export const getLeadInterestData = (leadIds) => {
  const query = {
    measures: [],
    order: {},
    dimensions: [
      CubeDataset.Leadinterests.stageName,
      CubeDataset.Leadinterests.sourceName,
      CubeDataset.Leadinterests.subSourceName,
      CubeDataset.Leadinterests.assignedToDisplayName,
      CubeDataset.Leadinterests.schoolId,
    ],
    // "limit": itemsPerPage ?? 100, "offset": Number((pageNo - 1) * itemsPerPage),
    timezone: "UTC",
    timeDimensions: [],
    filters: [
      {
        member: CubeDataset.Leadinterests.schoolId,
        operator: "equals",
        values: leadIds,
      },
    ],
    renewQuery: true,
  };
  return CubeQuery({ query });
};

export const getReportApprovalMappingList = (props) => {
  let { itemsPerPage, search, pageNo, filtersApplied } = props;

  const query = {
    measures: [],
    order: {
      [CubeDataset.Approvalmappings.updatedAt]: "desc",
    },
    dimensions: [
      CubeDataset.Approvalmappings.Id,
      CubeDataset.Approvalmappings.approvalType,
      CubeDataset.Approvalmappings.approverProfile,
      CubeDataset.Approvalmappings.modifiedBy,
      CubeDataset.Approvalmappings.updatedAt,
    ],
    limit: itemsPerPage ?? 100,
    offset: Number((pageNo - 1) * itemsPerPage),
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.Approvalmappings.createdAt,
        dateRange: "This Year",
        granularity: "week",
      },
    ],
    filters: [],
    renewQuery: true,
  };

  if (filtersApplied?.length > 0) {
    filtersApplied?.map((filterObj) => {
      let filterQueryObj = {};
      filterQueryObj[
        "member"
      ] = `${filterObj?.dataset?.dataSetName}.${filterObj?.field?.name}`;
      filterQueryObj["operator"] = `${filterObj?.operator?.value}`;
      filterQueryObj["values"] = filterObj?.filterValue;
      query?.["filters"]?.push(filterQueryObj);
    });
  }

  if (search) {
    query?.["filters"]?.push(
      // {
      //     or:
      //         [
      //             { "member": CubeDataset.School.schoolCode, "operator": "contains", "values": [search] },
      //             { "member": CubeDataset.School.schoolName, "operator": "contains", "values": [search] },
      //         ]
      // }
      {
        member: CubeDataset.Approvalmappings.approvalType,
        operator: "contains",
        values: [search],
      }
    );
  }

  return CubeQuery({ query });
};

export const getReportApprovalRequestList = (props) => {
  let { itemsPerPage, search, pageNo, filtersApplied, roleName, reqStatus } =
    props;

  const query = {
    measures: [],
    order: {
      [CubeDataset.ApprovalRequest.createdAt]: "desc",
    },
    dimensions: [
      CubeDataset.ApprovalRequest.requestNumber,
      CubeDataset.ApprovalRequest.requestId,
      CubeDataset.ApprovalRequest.requestByName,
      CubeDataset.ApprovalRequest.requestType,
      CubeDataset.ApprovalRequest._id,
      CubeDataset.ApprovalRequest.approverName,
      CubeDataset.ApprovalRequest.requestByEmpCode,
      CubeDataset.ApprovalRequest.createdAt,
      CubeDataset.ApprovalRequest.shortDescription,
      CubeDataset.ApprovalRequest.approverRoleName,
      CubeDataset.ApprovalRequest.approverEmpCode,
    ],
    limit: itemsPerPage ?? 100,
    offset: Number((pageNo - 1) * itemsPerPage),
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.ApprovalRequest.createdAt,
        dateRange: "This Year",
        granularity: "week",
      },
    ],
    filters: [],
    renewQuery: true,
  };

  if (filtersApplied?.length > 0) {
    filtersApplied?.map((filterObj) => {
      let filterQueryObj = {};
      filterQueryObj[
        "member"
      ] = `${filterObj?.dataset?.dataSetName}.${filterObj?.field?.name}`;
      filterQueryObj["operator"] = `${filterObj?.operator?.value}`;
      filterQueryObj["values"] = filterObj?.filterValue;
      query?.["filters"]?.push(filterQueryObj);
    });
  }

  if (roleName) {
    query?.["filters"]?.push({
      member: CubeDataset.ApprovalRequest.approverRoleName,
      operator: "equals",
      values: [roleName],
    });
  }

  if (reqStatus) {
    query?.["filters"]?.push({
      member: CubeDataset.ApprovalRequest.requestStatus,
      operator: "equals",
      values: [reqStatus],
    });
  }

  if (search) {
    query?.["filters"]?.push({
      member: CubeDataset.ApprovalRequest.requestId,
      operator: "contains",
      values: [search],
    });
  }

  return CubeQuery({ query });
};

export const fetchLeadScore = (id) => {
  const query = {
    measures: [CubeDataset.LeadActivity.LeadScore],
    order: {
      [CubeDataset.LeadActivity.LeadScore]: "desc",
    },
    dimensions: [],
    timezone: "UTC",
    timeDimensions: [],
    filters: [
      {
        member: CubeDataset.LeadActivity.userId,
        operator: "equals",
        values: [id],
      },
    ],
    renewQuery: true,
  };

  return CubeQuery({ query });
};

export const fetchLeadData = (id) => {
  const query = {
    measures: [],
    order: {
      [CubeDataset.Leads.updatedAt]: "desc",
    },
    dimensions: [
      CubeDataset.Leads.name,
      CubeDataset.Leads.Id,
      CubeDataset.Leads.createdAt,
      CubeDataset.Leads.userType,
      CubeDataset.Leads.city,
      CubeDataset.Leads.mobile,
      CubeDataset.Leads.sourceName,
      CubeDataset.Leads.subSourceName,
      CubeDataset.Leads.updatedAt,
      CubeDataset.Leads.userType,
      CubeDataset.Leads.board,
      CubeDataset.Leads.email,
      CubeDataset.Leads.countryCode,
      CubeDataset.Leads.state,
    ],
    timezone: "UTC",
    timeDimensions: [],
    filters: [
      {
        member: CubeDataset.Leads.Id,
        operator: "equals",
        values: [id],
      },
    ],
    renewQuery: true,
  };
  return CubeSocket({ query });
};

export const fetchUserData = (id) => {
  const query = {
    measures: [],
    order: { [CubeDataset.OnlineLeads.uuid]: "asc" },
    dimensions: [
      CubeDataset.OnlineLeads.username,
      CubeDataset.OnlineLeads.displayName,
      CubeDataset.OnlineLeads.city,
      CubeDataset.OnlineLeads.schoolName,
      CubeDataset.OnlineLeads.parentId,
      CubeDataset.OnlineLeads.age,
      CubeDataset.OnlineLeads.createTime,
      CubeDataset.OnlineLeads.stateName,
      CubeDataset.OnlineLeads.stateCode,
      CubeDataset.OnlineLeads.mobile,
      CubeDataset.OnlineLeads.uuid,
      CubeDataset.OnlineLeads.platform,
      CubeDataset.OnlineLeads.email,
      CubeDataset.OnlineLeads.createdOn,
      CubeDataset.OnlineLeads.countryName,
      CubeDataset.OnlineLeads.userType,
      CubeDataset.OnlineLeads.stateName,
    ],
    timezone: "UTC",
    timeDimensions: [],
    filters: [
      {
        member: CubeDataset.OnlineLeads.uuid,
        operator: "equals",
        values: [id],
      },
    ],
    renewQuery: true,
  };
  return CubeSocket({ query });
};

export const fetchLeadOwner = (id) => {
  const query = {
    measures: [],
    order: {
      [CubeDataset.Leadassigns.assignedToRoleName]: "asc",
    },
    dimensions: [
      CubeDataset.Leadassigns.leadId,
      CubeDataset.Leadassigns.mobile,
      CubeDataset.Leadassigns.email,
      CubeDataset.Leadassigns.assignedToRoleName,
      CubeDataset.Leadassigns.createdAt,
      CubeDataset.Leadassigns.name,
      CubeDataset.Leadassigns.city,
      CubeDataset.Leadassigns.state,
      CubeDataset.Leadassigns.userType,
      CubeDataset.Leadassigns.leadId,
      CubeDataset.Leadassigns.type,
      CubeDataset.Leadassigns.registrationDate,
    ],
    limit: 1000,
    timezone: "UTC",
    timeDimensions: [],
    filters: [
      {
        member: CubeDataset.Leadassigns.leadId,
        operator: "equals",
        values: [id],
      },
    ],
    renewQuery: true,
  };

  return CubeQuery({ query });
};

export const fetchInterestList = () => {
  const query = {
    dimensions: [
      CubeDataset.LearningProfileMaster.profileName,
      CubeDataset.LearningProfileMaster.userTypeId,
    ],
    renewQuery: true,
  };
  return CubeQuery({ query });
};

export const fetchStepperList = (id) => {
  const query = {
    measures: [],
    order: {
      [CubeDataset.LeadStageStatus.createdAt]: "asc",
    },
    dimensions: [CubeDataset.LeadStageStatus.stageName],
    limit: 1000,
    timezone: "UTC",
    timeDimensions: [],
    filters: [
      {
        member: CubeDataset.LeadStageStatus.leadId,
        operator: "equals",
        values: [id],
      },
    ],
    renewQuery: true,
  };

  return CubeQuery({ query });
};

export const leadAssignmentData = (props) => {
  let {
    userRole: roleName,
    search,
    itemsPerPage,
    pageNo,
    sortObj,
    filtersApplied,
    childRoles,
    campaignId,
  } = props;
  let childRoleNames = childRoles?.map((roleObj) => roleObj?.roleName);
  //childRoleNames = childRoleNames
  const query = {
    measures: [],
    order: {
      [sortObj?.sortKey]: sortObj?.sortOrder,
    },
    limit: itemsPerPage ?? 100,
    offset: Number((pageNo - 1) * itemsPerPage),
    dimensions: [
      CubeDataset.LeadassignsBq.assignedToRoleName,
      CubeDataset.LeadassignsBq.assignedToDisplayName,
      CubeDataset.LeadassignsBq.name,
      CubeDataset.LeadassignsBq.createdAt,
      CubeDataset.LeadassignsBq.updatedAt,
      CubeDataset.LeadassignsBq.leadId,
      CubeDataset.LeadassignsBq.Id,
      CubeDataset.LeadassignsBq.city,
      CubeDataset.LeadassignsBq.mobile,
      CubeDataset.LeadassignsBq.email,
      CubeDataset.LeadassignsBq.sourceName,
      CubeDataset.LeadassignsBq.subSourceName,
      CubeDataset.LeadassignsBq.stageName,
      CubeDataset.LeadassignsBq.statusName,
    ],
    timezone: "UTC",
    filters: [],
    renewQuery: true,
  };
  if (settings.ADMIN_ROLES.indexOf(roleName) < 0) {
    query?.["filters"].push({
      member: CubeDataset.LeadassignsBq.assignedToRoleName,
      operator: "equals",
      values: [roleName, ...childRoleNames],
    });
  }

  if (campaignId) {
    query?.["filters"]?.push({
      member: CubeDataset.LeadassignsBq.campaignId,
      operator: "equals",
      values: [campaignId],
    });
  }

  if (search && !query["filters"]?.find((obj) => obj["or"])) {
    query?.["filters"]?.push({
      or: [
        {
          member: CubeDataset.LeadassignsBq.name,
          operator: "contains",
          values: [search],
        },
        {
          member: CubeDataset.LeadassignsBq.mobile,
          operator: "contains",
          values: [search],
        },
        {
          member: CubeDataset.LeadassignsBq.leadId,
          operator: "contains",
          values: [search],
        },
      ],
    });
  }

  if (filtersApplied?.length) {
    filtersApplied?.map((filterObj) => {
      let filterQueryObj = {};
      // if (filterObj?.dataset?.dataSetName === 'LeadassignsBq') {
      filterQueryObj[
        "member"
      ] = `${filterObj?.dataset?.dataSetName}.${filterObj?.field?.name}`;
      filterQueryObj["operator"] = `${filterObj?.operator?.value}`;
      filterQueryObj["values"] = filterObj?.filterValue;
      query?.["filters"]?.push(filterQueryObj);
      // }
    });
  }
  return CubeQuery({ query });
};

export const leadAssignCount = (roleName, childRoles) => {
  let childRoleNames = childRoles?.map((roleObj) => roleObj?.roleName);
  //childRoleNames = childRoleNames.slice(0, 501)
  const query = {
    measures: [CubeDataset.Leadassigns.count],
    order: {
      [CubeDataset.Leadassigns.count]: "desc",
    },
    dimensions: [],
    timezone: "UTC",
    timeDimensions: [],
    filters: [],
    renewQuery: true,
  };
  if (settings.ADMIN_ROLES.indexOf(roleName) < 0) {
    query.filters.push({
      member: CubeDataset.Leadassigns.assignedToRoleName,
      operator: "equals",
      values: [roleName, ...childRoleNames],
    });
  }

  return CubeQuery({ query });
};

export const ActivityData = () => {
  const role_name = getUserData("userData")?.crm_role;

  const query = {
    measures: [],
    order: {
      [CubeDataset.Bdeactivities.name]: "asc",
      [CubeDataset.Bdeactivities.activityName]: "asc",
      [CubeDataset.Bdeactivities.subject]: "asc",
      [CubeDataset.Bdeactivities.leadId]: "asc",
      [CubeDataset.Bdeactivities.createdAt]: "desc",
      [CubeDataset.Bdeactivities.startDateTime]: "desc",
      [CubeDataset.Bdeactivities.endDateTime]: "desc",
      [CubeDataset.Bdeactivities.status]: "asc",
      [CubeDataset.Bdeactivities.count]: "desc",
      [CubeDataset.Bdeactivities.category]: "asc",
    },
    dimensions: [
      CubeDataset.Bdeactivities.Id,
      CubeDataset.Bdeactivities.name,
      CubeDataset.Bdeactivities.activityName,
      CubeDataset.Bdeactivities.subject,
      CubeDataset.Bdeactivities.leadId,
      CubeDataset.Bdeactivities.createdAt,
      CubeDataset.Bdeactivities.startDateTime,
      CubeDataset.Bdeactivities.endDateTime,
      CubeDataset.Bdeactivities.status,
      CubeDataset.Bdeactivities.category,
    ],
    limit: 5000,
    timezone: "UTC",
    timeDimensions: [],
    filters: [
      {
        member: CubeDataset.Bdeactivities.createdByRoleName,
        operator: "equals",
        values: [role_name],
      },
      {
        member: CubeDataset.Bdeactivities.status,
        operator: "equals",
        values: ["Pending", "Complete"],
      },
    ],
    renewQuery: true,
  };

  return CubeSocket({ query });
};

export const CalendarActivityData = (startDate, endDate) => {
  const role_name = getUserData("userData")?.crm_role;
  const query = {
    measures: [],
    order: {
      [CubeDataset.Bdeactivities.name]: "asc",
      [CubeDataset.Bdeactivities.activityName]: "asc",
      [CubeDataset.Bdeactivities.subject]: "asc",
      [CubeDataset.Bdeactivities.leadId]: "asc",
      [CubeDataset.Bdeactivities.createdAt]: "desc",
      [CubeDataset.Bdeactivities.startDateTime]: "desc",
      [CubeDataset.Bdeactivities.endDateTime]: "desc",
      [CubeDataset.Bdeactivities.status]: "asc",
      [CubeDataset.Bdeactivities.count]: "desc",
      [CubeDataset.Bdeactivities.category]: "asc",
    },
    dimensions: [
      CubeDataset.Bdeactivities.Id,
      CubeDataset.Bdeactivities.name,
      CubeDataset.Bdeactivities.activityName,
      CubeDataset.Bdeactivities.subject,
      CubeDataset.Bdeactivities.leadId,
      CubeDataset.Bdeactivities.createdAt,
      CubeDataset.Bdeactivities.startDateTime,
      CubeDataset.Bdeactivities.endDateTime,
      CubeDataset.Bdeactivities.status,
      CubeDataset.Bdeactivities.category,
    ],
    limit: 1000,
    timezone: "UTC",
    timeDimensions: [],
    filters: [
      {
        member: CubeDataset.Bdeactivities.createdByRoleName,
        operator: "equals",
        values: [role_name],
      },
      {
        member: CubeDataset.Bdeactivities.startDateTime,
        operator: "inDateRange",
        values: [startDate, endDate],
      },
    ],
    renewQuery: true,
  };

  return CubeSocket({ query });
};

export const JourneyFilterList = async (value, filterMember, search) => {
  const query = {
    measures: [],
    dimensions: [value],
    filters: [{
      member: filterMember,
      operator: 'set'
    },
    {
      member: filterMember,
      operator: 'notEquals',
      values: ['', ' ']
    }],
    limit: 1000,
    renewQuery: true,
  };

  if (search) {
    query?.["filters"]?.push({
      member: filterMember,
      operator: "contains",
      values: [search],
    });
  }

  return CubeQuery({ query });
};

export const getActivityCount = (startDate, endDate) => {
  const role_name = getUserData("userData")?.crm_role;
  console.log("Role", role_name);
  const query = {
    measures: [CubeDataset.Bdeactivities.count],
    order: {
      [CubeDataset.Bdeactivities.activityName]: "asc",
      [CubeDataset.Bdeactivities.count]: "desc",
      [CubeDataset.Bdeactivities.category]: "asc",
    },
    dimensions: [
      CubeDataset.Bdeactivities.activityName,
      CubeDataset.Bdeactivities.category,
      CubeDataset.Bdeactivities.status,
    ],
    limit: 1000,
    timezone: "UTC",
    timeDimensions: [],
    filters: [
      {
        member: CubeDataset.Bdeactivities.createdByRoleName,
        operator: "equals",
        values: [role_name],
      },
      {
        member: CubeDataset.Bdeactivities.startDateTime,
        operator: "inDateRange",
        values: [startDate, endDate],
      },
    ],
    renewQuery: true,
  };

  return CubeSocket({ query });
};

export const getAttendanceData = () => {
  const roleName = getUserData("userData")?.crm_role;
  const profileName = getUserData("userData")?.crm_profile;

  const query = [
    {
      measures: [],
      order: {
        [CubeDataset.Attendances.minTarget]: "desc",
        [CubeDataset.Attendances.maxTarget]: "desc",
        [CubeDataset.Attendances.attendanceMatrixType]: "asc",
      },
      dimensions: [
        CubeDataset.Attendances.attendanceMatrixType,
        CubeDataset.Attendances.minTarget,
        CubeDataset.Attendances.maxTarget,
      ],
      limit: 1000,
      timezone: "UTC",
      timeDimensions: [
        {
          dimension: CubeDataset.Attendances.updatedAt,
          granularity: "quarter",
        },
      ],
      filters: [
        {
          member: CubeDataset.Attendances.profileName,
          operator: "equals",
          values: [profileName],
        },
        {
          member: CubeDataset.Attendances.status,
          operator: "equals",
          values: ["1"],
        },
        {
          member: CubeDataset.Attendances.attendanceMatrixType,
          operator: "equals",
          values: ["PROFILE"],
        },
      ],
      renewQuery: true,
    },

    {
      measures: [],
      order: {
        [CubeDataset.Attendances.minTarget]: "desc",
        [CubeDataset.Attendances.maxTarget]: "desc",
      },
      dimensions: [
        CubeDataset.Attendances.minTarget,
        CubeDataset.Attendances.maxTarget,
      ],
      limit: 1000,
      timezone: "UTC",
      timeDimensions: [
        {
          dimension: CubeDataset.Attendances.updatedAt,
          granularity: "quarter",
        },
      ],
      filters: [
        {
          member: CubeDataset.Attendances.roleName,
          operator: "equals",
          values: [roleName],
        },
        {
          member: CubeDataset.Attendances.status,
          operator: "equals",
          values: ["1"],
        },
        {
          member: CubeDataset.Attendances.attendanceMatrixType,
          operator: "equals",
          values: ["ROLE"],
        },
      ],
      renewQuery: true,
    },
  ];

  return CubeSocket({ query });
};

export const getTaskDate = async (task) => {
  const role_name = getUserData("userData")?.crm_role;
  let taskValue = task?.value ? task?.value : "Today";

  const query = {
    measures: [
      CubeDataset.BdeactivitiesBq.count,
      CubeDataset.BdeactivitiesBq.buAverage,
      CubeDataset.BdeactivitiesBq.nationalAverage,
    ],
    order: {
      [CubeDataset.BdeactivitiesBq.activityName]: "asc",
      [CubeDataset.BdeactivitiesBq.count]: "asc",
      [CubeDataset.BdeactivitiesBq.buAverage]: "desc",
      [CubeDataset.BdeactivitiesBq.activityId]: "asc",
      [CubeDataset.BdeactivitiesBq.nationalAverage]: "desc",
    },
    dimensions: [
      CubeDataset.BdeactivitiesBq.activityName,
      CubeDataset.BdeactivitiesBq.activityId,
      CubeDataset.BdeactivitiesBq.createdByRoleName,
      CubeDataset.BdeactivitiesBq.buh,
      CubeDataset.BdeactivitiesBq.inHead,
      CubeDataset.BdeactivitiesBq.status,
    ],
    limit: 1000,
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.BdeactivitiesBq.startDateTime,
        dateRange: taskValue,
        granularity: null,
      },
    ],
    filters: [
      {
        member: CubeDataset.BdeactivitiesBq.taskActivity,
        operator: "equals",
        values: ["1"],
      },
      {
        member: CubeDataset.BdeactivitiesBq.createdByRoleName,
        operator: "equals",
        values: [role_name],
      },
      {
        member: CubeDataset.BdeactivitiesBq.status,
        operator: "equals",
        values: ["Complete"],
      },
    ],
    renewQuery: true,
  };

  return CubeQuery({ query });
};

export const getBdeActivitiesList = (leadUuid, days) => {
  const query = {
    measures: [],
    order: {
      [CubeDataset.Bdeactivities.startDateTime]: "desc",
      [CubeDataset.Bdeactivities.activityName]: "asc",
      [CubeDataset.Bdeactivities.customerResponse]: "asc",
      [CubeDataset.Bdeactivities.conversationWith]: "asc",
      [CubeDataset.Bdeactivities.callDuration]: "desc",
      [CubeDataset.Bdeactivities.callStatus]: "desc",
      [CubeDataset.Bdeactivities.reasonForDQ]: "asc",
      [CubeDataset.Bdeactivities.interestedIn]: "asc",
    },
    dimensions: [
      CubeDataset.Bdeactivities.activityName,
      CubeDataset.Bdeactivities.customerResponse,
      CubeDataset.Bdeactivities.conversationWith,
      CubeDataset.Bdeactivities.callDuration,
      CubeDataset.Bdeactivities.callRecording,
      CubeDataset.Bdeactivities.callStatus,
      CubeDataset.Bdeactivities.reasonForDQ,
      CubeDataset.Bdeactivities.interestedIn,
      CubeDataset.Bdeactivities.name,
      CubeDataset.Bdeactivities.comments,
      CubeDataset.Bdeactivities.startDateTime,
      CubeDataset.Bdeactivities.createdByName,
      CubeDataset.Bdeactivities.createdByProfileName,
      CubeDataset.Bdeactivities.paymentUrl,
      CubeDataset.Bdeactivities.paymentAmount,
      CubeDataset.Bdeactivities.createdAt,
      CubeDataset.Bdeactivities.knownLanguages,
    ],
    timeDimensions: [
      {
        dimension: CubeDataset.Bdeactivities.startDateTime,
        dateRange: `from ${days} days ago to now`,
        granularity: null,
      },
    ],
    filters: [
      {
        member: CubeDataset.Bdeactivities.leadId,
        operator: "equals",
        values: [leadUuid],
      },
      {
        member: CubeDataset.Bdeactivities.status,
        operator: "equals",
        values: ["Complete"],
      },
    ],
    //ungrouped: true,
    renewQuery: true,
  };

  return CubeQuery({ query });
};

export const monthActivityData = () => {
  const role_name = getUserData("userData")?.crm_role;
  console.log("Role", role_name);
  const query = {
    measures: [],
    order: {
      [CubeDataset.Bdeactivities.activityName]: "asc",
      [CubeDataset.Bdeactivities.name]: "asc",
      [CubeDataset.Bdeactivities.status]: "desc",
      [CubeDataset.Bdeactivities.startDateTime]: "desc",
      [CubeDataset.Bdeactivities.subject]: "asc",
      [CubeDataset.Bdeactivities.category]: "asc",
      [CubeDataset.Bdeactivities.leadId]: "asc",
      [CubeDataset.Bdeactivities.Id]: "asc",
    },
    dimensions: [
      CubeDataset.Bdeactivities.activityName,
      CubeDataset.Bdeactivities.name,
      CubeDataset.Bdeactivities.status,
      CubeDataset.Bdeactivities.startDateTime,
      CubeDataset.Bdeactivities.subject,
      CubeDataset.Bdeactivities.category,
      CubeDataset.Bdeactivities.leadId,
      CubeDataset.Bdeactivities.Id,
      CubeDataset.Bdeactivities.endDateTime,
    ],
    limit: 1000,
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.Bdeactivities.startDateTime,
        granularity: "day",
      },
    ],
    filters: [
      {
        member: CubeDataset.Bdeactivities.createdByRoleName,
        operator: "equals",
        values: [role_name],
      },
    ],
    //ungrouped: true,
    renewQuery: true,
  };

  return CubeSocket({ query });
};

export const getAddendancePoint = async () => {
  const role_name = getUserData("userData")?.crm_role;

  const query = {
    measures: [CubeDataset.BdeactivitiesBq.totalActivityScore],
    order: {
      [CubeDataset.BdeactivitiesBq.totalActivityScore]: "desc",
      [CubeDataset.BdeactivitiesBq.activityId]: "asc",
    },
    dimensions: [CubeDataset.BdeactivitiesBq.activityId],
    limit: 1000,
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.BdeactivitiesBq.startDateTime,
        dateRange: "Today",
        granularity: "day",
      },
    ],
    filters: [
      {
        member: CubeDataset.BdeactivitiesBq.status,
        operator: "equals",
        values: ["Complete"],
      },
      {
        member: CubeDataset.BdeactivitiesBq.createdByRoleName,
        operator: "equals",
        values: [role_name],
      },
    ],
    //ungrouped: true,
    renewQuery: true,
  };

  return CubeQuery({ query });
};

export const getActivityMaxScore = async () => {
  const query = {
    measures: [],
    order: {
      [CubeDataset.ActivitiesBq.name]: "asc",
    },
    dimensions: [
      CubeDataset.ActivitiesBq.Id,
      CubeDataset.ActivitiesBq.maxScore,
    ],
    limit: 1000,
    timezone: "UTC",
    timeDimensions: [],
    filters: [
      {
        member: CubeDataset.ActivitiesBq.userType,
        operator: "equals",
        values: ["Employee"],
      },
      {
        member: CubeDataset.ActivitiesBq.status,
        operator: "equals",
        values: ["1"],
      },
      {
        member: CubeDataset.ActivitiesBq.isDeleted,
        operator: "equals",
        values: ["0"],
      },
    ],
    renewQuery: true,
  };

  return CubeQuery({ query });
};

export const getCallTarget = async (dateRange) => {
  const profileName = getUserData("userData")?.crm_profile;

  const roleName = getUserData("userData")?.crm_role;

  const query = [
    {
      dimensions: [
        CubeDataset.RolebasedattendanceactivitymodelsBq.activityName,
        CubeDataset.RolebasedattendanceactivitymodelsBq.dailyTarget,
        CubeDataset.RolebasedattendanceactivitymodelsBq.weeklyTarget,
        CubeDataset.RolebasedattendanceactivitymodelsBq.monthlyTarget,
        CubeDataset.RolebasedattendanceactivitymodelsBq.activityId,
        CubeDataset.RolebasedattendanceactivitymodelsBq.status,
      ],
      order: {
        [CubeDataset.RolebasedattendanceactivitymodelsBq.activityName]: "asc",
      },
      filters: [
        {
          member: CubeDataset.RolebasedattendanceactivitymodelsBq.roleName,
          operator: "equals",
          values: [roleName],
        },
        {
          member: CubeDataset.RolebasedattendanceactivitymodelsBq.status,
          operator: "equals",
          values: ["1"],
        },
      ],
      timeDimensions: [
        {
          dimension: CubeDataset.RolebasedattendanceactivitymodelsBq.updatedAt,
          granularity: "year",
          dateRange: "from 360 days ago to now",
        },
      ],
      renewQuery: true,
    },
    {
      dimensions: [
        CubeDataset.RolebasedattendanceactivitymodelsBq.activityName,
        CubeDataset.RolebasedattendanceactivitymodelsBq.dailyTarget,
        CubeDataset.RolebasedattendanceactivitymodelsBq.weeklyTarget,
        CubeDataset.RolebasedattendanceactivitymodelsBq.monthlyTarget,
        CubeDataset.RolebasedattendanceactivitymodelsBq.activityId,
        CubeDataset.RolebasedattendanceactivitymodelsBq.status,
      ],
      order: {
        [CubeDataset.RolebasedattendanceactivitymodelsBq.activityName]: "asc",
      },
      filters: [
        {
          member: CubeDataset.RolebasedattendanceactivitymodelsBq.profileName,
          operator: "equals",
          values: [profileName],
        },
        {
          member: CubeDataset.RolebasedattendanceactivitymodelsBq.status,
          operator: "equals",
          values: ["1"],
        },
      ],
      timeDimensions: [
        {
          dimension: CubeDataset.RolebasedattendanceactivitymodelsBq.updatedAt,
          granularity: "year",
          dateRange: "from 360 days ago to now",
        },
      ],
      renewQuery: true,
    },
  ];

  return CubeQuery({ query });
};

export const getRelatedToList = (mobileNumber, id) => {
  const query = {
    measures: [],
    order: {
      [CubeDataset.OnlineLeads.phone]: "asc",
      [CubeDataset.OnlineLeads.stateName]: "asc",
      [CubeDataset.OnlineLeads.city]: "asc",
      [CubeDataset.OnlineLeads.displayName]: "asc",
    },
    dimensions: [
      CubeDataset.OnlineLeads.phone,
      CubeDataset.OnlineLeads.stateName,
      CubeDataset.OnlineLeads.city,
      CubeDataset.OnlineLeads.displayName,
    ],
    timeDimensions: [],
    filters: [
      {
        member: CubeDataset.OnlineLeads.mobile,
        operator: "equals",
        values: [mobileNumber],
      },
      {
        member: CubeDataset.OnlineLeads.uuid,
        operator: "notEquals",
        values: [id],
      },
    ],
    renewQuery: true,
  };
  // console.log('getRelatedToList',query)
  return CubeQuery({ query });
};

export const getProductPurchasedList = (lUuid) => {
  const query = {
    measures: [],
    dimensions: [
      CubeDataset.EmployeeLeadsOrder.eName,
      CubeDataset.EmployeeLeadsOrder.lUuid,
      CubeDataset.EmployeeLeadsOrder.Ordno,
      CubeDataset.EmployeeLeadsOrder.Orderdate,
      CubeDataset.EmployeeLeadsOrder.orderStatus,
      CubeDataset.EmployeeLeadsOrder.Createdon,
    ],
    order: {
      [CubeDataset.EmployeeLeadsOrder.updatedOn]: "desc",
    },
    timeDimensions: [],
    limit: 10,
    filters: [
      {
        member: CubeDataset.EmployeeLeadsOrder.lUuid,
        operator: "equals",
        values: [lUuid],
      },
    ],
    renewQuery: true,
  };
  //console.log('Order', query)
  return CubeQuery({ query });
};

export const getRevenueData = async (employeeId) => {
  const emp_id = getUserData("userData")?.employee_code;

  let roleList = localStorage.getItem("childRoles")
    ? DecryptData(localStorage.getItem("childRoles"))
    : [];
  //console.log(roleList)
  let empList = roleList ? roleList?.map((obj) => obj.userName) : [];
  let empCodes = [emp_id];
  if (empList.length > 0) {
    empCodes = [...empList];
  }
  const query = {
    measures: [
      CubeDataset.OMSOrders.netOfInvoice,
      CubeDataset.OMSOrders.punched,
      //CubeDataset.OMSOrders.count
    ],
    order: {
      [CubeDataset.OMSOrders.eEmpid]: "asc",
      [CubeDataset.OMSOrders.netOfInvoice]: "desc",
      [CubeDataset.OMSOrders.punched]: "desc",
    },
    dimensions: [
      //CubeDataset.OMSOrders.orderId,
      //CubeDataset.OMSOrders.eName,
    ],
    limit: 1000,
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.OMSOrders.Createdon,
        dateRange: "This Month",
        granularity: "month",
      },
    ],
    filters: [
      {
        member: CubeDataset.OMSOrders.eEmpid,
        operator: "equals",
        values: empCodes,
      },
    ],
    renewQuery: true,
  };
  return { rawData: () => [] };

  return CubeQuery({ query });
};

export const getRevenueDatatest = () => {
  const query = {
    measures: [
      CubeDataset.OMSOrders.netOfInvoice,
      CubeDataset.OMSOrders.punched,
      CubeDataset.OMSOrders.count,
    ],
    order: {
      [CubeDataset.OMSOrders.eEmpid]: "asc",
      [CubeDataset.OMSOrders.netOfInvoice]: "desc",
      [CubeDataset.OMSOrders.punched]: "desc",
    },
    dimensions: [CubeDataset.OMSOrders.orderId, CubeDataset.OMSOrders.eName],
    limit: 1000,
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.OMSOrders.updatedOn,
        dateRange: "This Month",
        granularity: "month",
      },
    ],
    filters: [],
    renewQuery: true,
  };

  return CubeSocket({ query });
};

export const getActivityPoint = async (activity_id, task) => {
  const role_name = getUserData("userData")?.crm_role;
  let taskValue = task ? task?.value : "Today";

  const query = {
    measures: [
      CubeDataset.BdeactivitiesBq.buAverage,
      CubeDataset.BdeactivitiesBq.count,
      CubeDataset.BdeactivitiesBq.nationalAverage,
    ],
    order: {
      [CubeDataset.BdeactivitiesBq.buAverage]: "desc",
      [CubeDataset.BdeactivitiesBq.count]: "desc",
      [CubeDataset.BdeactivitiesBq.activityId]: "asc",
      [CubeDataset.BdeactivitiesBq.startDateTime]: "asc",
      [CubeDataset.BdeactivitiesBq.category]: "asc",
      [CubeDataset.BdeactivitiesBq.nationalAverage]: "desc",
      [CubeDataset.BdeactivitiesBq.activityName]: "asc",
    },
    dimensions: [
      CubeDataset.BdeactivitiesBq.activityId,
      CubeDataset.BdeactivitiesBq.category,
      CubeDataset.BdeactivitiesBq.activityName,
      CubeDataset.BdeactivitiesBq.createdByRoleName,
      CubeDataset.BdeactivitiesBq.buh,
      CubeDataset.BdeactivitiesBq.inHead,
      CubeDataset.BdeactivitiesBq.status,
    ],
    limit: 1000,
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.BdeactivitiesBq.startDateTime,
        dateRange: taskValue,
        granularity: null,
      },
    ],
    filters: [
      {
        member: CubeDataset.BdeactivitiesBq.activityId,
        operator: "equals",
        values: activity_id?.length > 0 ? activity_id : [""],
      },
      {
        member: CubeDataset.BdeactivitiesBq.createdByRoleName,
        operator: "equals",
        values: [role_name],
      },
      {
        member: CubeDataset.BdeactivitiesBq.status,
        operator: "equals",
        values: ["Complete"],
      },
    ],
    //ungrouped: true,
    renewQuery: true,
  };

  return CubeQuery({ query });
};

export const getTrialTakenActivities = (uuid) => {
  const query = {
    measures: [],
    order: {
      [CubeDataset.TblUserfreetrial.utfProductname]: "asc",
      [CubeDataset.TblUserfreetrial.createdon]: "asc",
      [CubeDataset.TblUserfreetrial.utfExpiryDate]: "asc",
    },
    dimensions: [
      CubeDataset.TblUserfreetrial.utfProductname,
      CubeDataset.TblUserfreetrial.createdon,
      CubeDataset.TblUserfreetrial.utfExpiryDate,
    ],
    limit: 1000,
    timezone: "UTC",
    timeDimensions: [],
    filters: [
      {
        member: CubeDataset.TblUserfreetrial.uftUuid,
        operator: "equals",
        values: [uuid],
      },
    ],
    renewQuery: true,
  };
  return CubeQuery({ query });
};

export const LeadDetailsInterest = (leadId) => {
  const query = {
    measures: [],
    order: {
      [CubeDataset.Leadinterests.learningProfile]: "asc",
      [CubeDataset.Leadinterests.sourceName]: "desc",
      [CubeDataset.Leadinterests.subSourceName]: "desc",
      [CubeDataset.Leadinterests.school]: "desc",
      //[CubeDataset.Leadinterests.campaignName]: "desc",
      [CubeDataset.Leadinterests.board]: "desc",
    },
    dimensions: [
      CubeDataset.Leadinterests.sourceName,
      CubeDataset.Leadinterests.subSourceName,
      //CubeDataset.Leadinterests.campaignName,
      CubeDataset.Leadinterests.learningProfile,
      CubeDataset.Leadinterests.board,
      CubeDataset.Leadinterests.school,
      CubeDataset.Leadinterests.class,
      CubeDataset.Leadinterests.updatedAt,
      CubeDataset.Leadinterests.createdAt,
      CubeDataset.Leadinterests.Id,
    ],
    limit: 1000,
    timezone: "UTC",
    timeDimensions: [],
    filters: [
      {
        operator: "equals",
        values: [leadId],
        member: CubeDataset.Leadinterests.leadId,
      },
    ],
    renewQuery: true,
  };
  return CubeQuery({ query });
};

export const leadRelatedTo = (mobileNumber, leadId) => {
  const query = {
    measures: [],
    order: {
      [CubeDataset.Leadassigns.leadId]: "asc",
      [CubeDataset.Leadassigns.name]: "asc",
      [CubeDataset.Leadassigns.city]: "asc",
      [CubeDataset.Leadassigns.mobile]: "asc",
      [CubeDataset.Leadassigns.state]: "asc",
    },
    dimensions: [
      CubeDataset.Leadassigns.leadId,
      CubeDataset.Leadassigns.name,
      CubeDataset.Leadassigns.city,
      CubeDataset.Leadassigns.state,
    ],
    limit: 1000,
    timezone: "UTC",
    timeDimensions: [],
    filters: [
      {
        member: CubeDataset.Leadassigns.leadId,
        operator: "notEquals",
        values: [leadId],
      },
      {
        member: CubeDataset.Leadassigns.mobile,
        operator: "contains",
        values: [mobileNumber],
      },
    ],
    renewQuery: true,
  };

  return CubeQuery({ query });
};

export const activityFormInterestData = (leadId, interest) => {
  const query = {
    measures: [],
    order: {
      [CubeDataset.Leadinterests.board]: "asc",
      [CubeDataset.Leadinterests.class]: "asc",
      [CubeDataset.Leadinterests.school]: "asc",
    },
    dimensions: [
      CubeDataset.Leadinterests.board,
      CubeDataset.Leadinterests.school,
      CubeDataset.Leadinterests.class,
    ],
    limit: 1000,
    timezone: "UTC",
    timeDimensions: [],
    filters: [
      {
        member: CubeDataset.Leadinterests.learningProfile,
        operator: "equals",
        values: [interest],
      },
      {
        member: CubeDataset.Leadinterests.leadId,
        operator: "equals",
        values: [leadId],
      },
    ],
    renewQuery: true,
  };

  return CubeQuery({ query });
};

export const getLaedAssignData = (phone, student_name) => {
  const query = {
    measures: [],
    order: {
      [CubeDataset.Leadassigns.Id]: "asc",
      [CubeDataset.Leadassigns.mobile]: "asc",
      [CubeDataset.Leadassigns.userType]: "asc",
      [CubeDataset.Leadassigns.board]: "asc",
      [CubeDataset.Leadassigns.class]: "asc",
      [CubeDataset.Leadassigns.email]: "asc",
    },
    dimensions: [
      CubeDataset.Leadassigns.Id,
      CubeDataset.Leadassigns.mobile,
      CubeDataset.Leadassigns.userType,
      CubeDataset.Leadassigns.board,
      CubeDataset.Leadassigns.class,
      CubeDataset.Leadassigns.email,
    ],
    limit: 1000,
    timezone: "UTC",
    timeDimensions: [],
    filters: [
      {
        member: CubeDataset.Leadassigns.mobile,
        operator: "contains",
        values: [phone],
      },
      {
        member: CubeDataset.Leadassigns.userType,
        operator: "contains",
        values: [student_name],
      },
    ],
    renewQuery: true,
  };

  return CubeQuery({ query });
};

export const getStateData = () => {
  const query = {
    measures: [],
    order: {
      [CubeDataset.CountryCityStateMapping.stateName]: "asc",
      [CubeDataset.CountryCityStateMapping.stateCode]: "asc",
      [CubeDataset.CountryCityStateMapping.countryCode]: "asc",
      [CubeDataset.CountryCityStateMapping.countryName]: "asc",
    },
    dimensions: [
      CubeDataset.CountryCityStateMapping.stateName,
      CubeDataset.CountryCityStateMapping.stateCode,
      CubeDataset.CountryCityStateMapping.countryCode,
      CubeDataset.CountryCityStateMapping.countryName,
    ],
    //"limit": 10000,
    //"timezone": "UTC",
    //"timeDimensions": [],
    filters: [
      {
        member: CubeDataset.CountryCityStateMapping.countryCode,
        operator: "contains",
        values: ["01"],
      },
    ],
    renewQuery: true,
  };

  return CubeQuery({ query });
};

export const getCityData = (stateName, cityName) => {
  // var cityName = `${Env_Config.COUNTRY_CITY.key}.${Env_Config.COUNTRY_CITY.cityName}`

  const query = {
    measures: [],
    order: {
      [CubeDataset.CountryCityStateMapping.cityName]: "asc",
      [CubeDataset.CountryCityStateMapping.cityCode]: "asc",
    },
    dimensions: [
      CubeDataset.CountryCityStateMapping.cityName,
      CubeDataset.CountryCityStateMapping.cityCode,
    ],
    limit: 1000,
    //"timezone": "UTC",
    //"timeDimensions": [],
    filters: [
      {
        member: CubeDataset.CountryCityStateMapping.countryCode,
        operator: "contains",
        values: ["01"],
      },
      {
        member: CubeDataset.CountryCityStateMapping.stateName,
        operator: "equals",
        values: [stateName],
      },
    ],
    renewQuery: true,
  };
  if (cityName) {
    query.filters.push({
      member: CubeDataset.CountryCityStateMapping.cityName,
      operator: "contains",
      values: [cityName],
    });
  }

  return CubeQuery({ query });
};

export const getUserOnlineLead = async (params) => {
  let { mobile, userType, name } = params;

  const query = {
    measures: [],
    order: {
      [CubeDataset.OnlineLeads.mobile]: "asc",
      [CubeDataset.OnlineLeads.uuid]: "asc",
      [CubeDataset.OnlineLeads.userType]: "asc",
    },
    dimensions: [
      CubeDataset.OnlineLeads.mobile,
      CubeDataset.OnlineLeads.uuid,
      CubeDataset.OnlineLeads.userType,
      CubeDataset.OnlineLeads.createdOn,
    ],
    limit: 1000,
    timezone: "UTC",
    timeDimensions: [],
    filters: [
      {
        member: CubeDataset.OnlineLeads.userType,
        operator: "contains",
        values: [userType],
      },
      {
        member: CubeDataset.OnlineLeads.mobile,
        operator: "contains",
        values: [mobile],
      },
    ],
    renewQuery: true,
  };

  return CubeQuery({ query });
};

export const getLearningProfile = async (params) => {
  const query = {
    measures: [],
    order: {
      [CubeDataset.LearningProfileMaster.profileName]: "asc",
    },
    dimensions: [CubeDataset.LearningProfileMaster.profileName],
    limit: 1000,
    timezone: "UTC",
    timeDimensions: [],
    filters: [
      {
        member: CubeDataset.LearningProfileMaster.userTypeId,
        operator: "equals",
        values: ["1"],
      },
    ],
    renewQuery: true,
  };

  return CubeQuery({ query });
};

export const getMyOrdersList = (props) => {
  let { search, itemsPerPage, pageNo, sortObj } = props;

  const emp_id = getUserData("userData")?.employee_code;
  let roleList = localStorage.getItem("childRoles")
    ? DecryptData(localStorage.getItem("childRoles"))
    : [];
  let empList = roleList ? roleList?.map((obj) => obj.userName) : [];
  let empCodes = [emp_id];
  if (empList.length > 0) {
    empCodes = [...empCodes, ...empList];
  }

  const query = {
    measures: [],
    order: {
      [sortObj?.sortKey]: sortObj?.sortOrder,
    },
    limit: itemsPerPage ?? 100,
    offset: Number((pageNo - 1) * itemsPerPage),
    dimensions: [
      CubeDataset.EmployeeLeadsOrder.eName,
      CubeDataset.EmployeeLeadsOrder.Ordno,
      CubeDataset.EmployeeLeadsOrder.orderTotalAmount,
      CubeDataset.EmployeeLeadsOrder.updatedOn,
      CubeDataset.EmployeeLeadsOrder.lUuid,
      CubeDataset.EmployeeLeadsOrder.orderStatus,
      CubeDataset.EmployeeLeadsOrder.lStudentName,
      CubeDataset.EmployeeLeadsOrder.eEmpid,
    ],
    timezone: "UTC",
    timeDimensions: [],
    filters: [
      {
        member: CubeDataset.EmployeeLeadsOrder.eEmpid,
        operator: "equals",
        values: empCodes,
      },
    ],
    renewQuery: true,
  };
  if (search && !query["filters"]?.find((obj) => obj["or"])) {
    query?.["filters"]?.push({
      or: [
        {
          member: CubeDataset.EmployeeLeadsOrder.lStudentName,
          operator: "contains",
          values: [search],
        },
        {
          member: CubeDataset.EmployeeLeadsOrder.Ordno,
          operator: "contains",
          values: [search],
        },
      ],
    });
  }

  return CubeQuery({ query });
};

export const getBookingData = (data, bookView) => {
  let roleName = data;

  const query = {
    measures: [CubeDataset.BdeactivitiesBq.count],
    order: {
      [CubeDataset.BdeactivitiesBq.leadStage]: "asc",
      [CubeDataset.BdeactivitiesBq.leadStatus]: "asc",
      [CubeDataset.BdeactivitiesBq.name]: "asc",
      [CubeDataset.BdeactivitiesBq.count]: "desc",
      [CubeDataset.BdeactivitiesBq.createdByRoleName]: "asc",
      [CubeDataset.BdeactivitiesBq.createdByName]: "asc",
    },
    dimensions: [
      CubeDataset.BdeactivitiesBq.leadStage,
      CubeDataset.BdeactivitiesBq.leadStatus,
      CubeDataset.BdeactivitiesBq.createdByName,
      CubeDataset.BdeactivitiesBq.createdByRoleName,
    ],
    limit: 1000,
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.BdeactivitiesBq.startDateTime,
        dateRange: bookView,
        granularity: null,
      },
    ],
    filters: [
      {
        member: CubeDataset.BdeactivitiesBq.createdByRoleName,
        operator: "equals",
        values: roleName,
      },
      {
        member: CubeDataset.BdeactivitiesBq.leadStatus,
        operator: "equals",
        values: ["Re Scheduled", "Demo Scheduled"],
      },
      {
        member: CubeDataset.BdeactivitiesBq.leadStage,
        operator: "equals",
        values: ["Demo"],
      },
    ],
    renewQuery: true,
  };

  return CubeQuery({ query });
};

export const getBookingSchedule = (data, taskView) => {
  let { value } = taskView;
  let { startDate, endDate } = getBookingDate(value);
  let roleName = data;

  const query = {
    measures: [CubeDataset.BdeactivitiesBq.count],
    order: {
      [CubeDataset.BdeactivitiesBq.activityName]: "asc",
      [CubeDataset.BdeactivitiesBq.count]: "desc",
      [CubeDataset.BdeactivitiesBq.name]: "asc",
      [CubeDataset.BdeactivitiesBq.createdByName]: "asc",
    },
    dimensions: [
      CubeDataset.BdeactivitiesBq.activityName,
      CubeDataset.BdeactivitiesBq.createdByName,
      CubeDataset.BdeactivitiesBq.startDateTime,
    ],
    limit: 1000,
    timezone: "UTC",
    timeDimensions: [],
    filters: [
      {
        member: CubeDataset.BdeactivitiesBq.startDateTime,
        operator: "inDateRange",
        values: [startDate, endDate],
      },
      {
        member: CubeDataset.BdeactivitiesBq.leadStatus,
        operator: "equals",
        values: ["Re Scheduled", "Demo Scheduled"],
      },
      {
        member: CubeDataset.BdeactivitiesBq.leadStage,
        operator: "equals",
        values: ["Demo"],
      },
      {
        member: CubeDataset.BdeactivitiesBq.createdByRoleName,
        operator: "equals",
        values: roleName,
      },
    ],
    renewQuery: true,
  };

  return CubeQuery({ query });
};

export const getPendingBooking = (data) => {
  let roleName = data;

  const query = {
    measures: [CubeDataset.BdeactivitiesBq.count],
    order: {
      [CubeDataset.BdeactivitiesBq.subject]: "asc",
      [CubeDataset.BdeactivitiesBq.count]: "desc",
      [CubeDataset.BdeactivitiesBq.followUpDateTime]: "desc",
      [CubeDataset.BdeactivitiesBq.name]: "asc",
      [CubeDataset.BdeactivitiesBq.createdByName]: "asc",
    },
    dimensions: [
      CubeDataset.BdeactivitiesBq.subject,
      CubeDataset.BdeactivitiesBq.createdByName,
    ],
    limit: 1000,
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.BdeactivitiesBq.startDateTime,
        dateRange: "This Week",
        granularity: null,
      },
    ],
    filters: [
      {
        member: CubeDataset.BdeactivitiesBq.subject,
        operator: "equals",
        values: ["Follow Up Call", "Demo Call"],
      },
      {
        member: CubeDataset.BdeactivitiesBq.createdByRoleName,
        operator: "equals",
        values: roleName,
      },
      {
        member: CubeDataset.BdeactivitiesBq.startDateTime,
        operator: "beforeDate",
        values: [moment.utc(), moment.utc()],
      },
    ],
    renewQuery: true,
  };

  return CubeQuery({ query });
};

export const getAllBDEBooking = (data) => {
  let roleName = data;

  const query = {
    measures: [CubeDataset.BdeactivitiesBq.count],
    order: {
      [CubeDataset.BdeactivitiesBq.subject]: "asc",
      [CubeDataset.BdeactivitiesBq.count]: "desc",
      [CubeDataset.BdeactivitiesBq.followUpDateTime]: "desc",
      [CubeDataset.BdeactivitiesBq.name]: "asc",
      [CubeDataset.BdeactivitiesBq.createdByName]: "asc",
    },
    dimensions: [
      CubeDataset.BdeactivitiesBq.leadStage,
      CubeDataset.BdeactivitiesBq.createdByName,
    ],
    limit: 1000,
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.BdeactivitiesBq.startDateTime,
        dateRange: "This Week",
        granularity: null,
      },
    ],
    filters: [
      {
        member: CubeDataset.BdeactivitiesBq.leadStage,
        operator: "equals",
        values: ["Enquiry", "Demo", "Payment", "Order"],
      },
      {
        member: CubeDataset.BdeactivitiesBq.createdByRoleName,
        operator: "equals",
        values: roleName,
      },
    ],
    renewQuery: true,
  };

  return CubeQuery({ query });
};

export const getTeamActivity = async (roleName, empID) => {
  const query = {
    measures: [
      CubeDataset.OMSOrders.netOfInvoice,
      CubeDataset.OMSOrders.punched,
      CubeDataset.OMSOrders.totalOrder,
    ],
    order: {
      [CubeDataset.OMSOrders.netOfInvoice]: "desc",
      [CubeDataset.OMSOrders.punched]: "desc",
      [CubeDataset.OMSOrders.eName]: "asc",
      [CubeDataset.OMSOrders.updatedOn]: "asc",
      [CubeDataset.OMSOrders.totalOrder]: "desc",
    },
    dimensions: [CubeDataset.OMSOrders.eName, CubeDataset.OMSOrders.eEmpid],
    limit: 1000,
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.OMSOrders.updatedOn,
        dateRange: "This Month",
        granularity: "month",
      },
    ],
    filters: [
      {
        member: CubeDataset.OMSOrders.eEmpid,
        operator: "equals",
        values: empID,
      },
    ],
    renewQuery: true,
  };

  return CubeQuery({ query });
};

export const getMonthlyBooking = async ({ data, search, count, pageNo }) => {
  let roleName = data;

  const query = {
    measures: [CubeDataset.BdeactivitiesBq.count],
    order: {
      [CubeDataset.BdeactivitiesBq.leadStage]: "asc",
      [CubeDataset.BdeactivitiesBq.leadStatus]: "asc",
      [CubeDataset.BdeactivitiesBq.name]: "asc",
      [CubeDataset.BdeactivitiesBq.count]: "desc",
      [CubeDataset.BdeactivitiesBq.createdByRoleName]: "asc",
      [CubeDataset.BdeactivitiesBq.createdByName]: "asc",
      [CubeDataset.BdeactivitiesBq.createdAt]: "desc",
      [CubeDataset.BdeactivitiesBq.startDateTime]: "desc",
    },
    dimensions: [
      CubeDataset.BdeactivitiesBq.leadStage,
      CubeDataset.BdeactivitiesBq.leadStatus,
      CubeDataset.BdeactivitiesBq.name,
      CubeDataset.BdeactivitiesBq.createdByRoleName,
      CubeDataset.BdeactivitiesBq.createdByName,
      CubeDataset.BdeactivitiesBq.createdAt,
      CubeDataset.BdeactivitiesBq.startDateTime,
    ],
    limit: count ?? 100,
    offset: Number((pageNo - 1) * count),
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.BdeactivitiesBq.startDateTime,
        dateRange: "This Month",
        granularity: "month",
      },
    ],
    filters: [
      {
        member: CubeDataset.BdeactivitiesBq.leadStatus,
        operator: "equals",
        values: ["Re Scheduled", "Demo Scheduled"],
      },
      {
        member: CubeDataset.BdeactivitiesBq.leadStage,
        operator: "equals",
        values: ["Demo"],
      },
      {
        member: CubeDataset.BdeactivitiesBq.createdByRoleName,
        operator: "equals",
        values: roleName,
      },
    ],
    renewQuery: true,
  };

  if (search && !query["filters"]?.find((obj) => obj["or"])) {
    query?.["filters"]?.push({
      or: [
        {
          member: CubeDataset.BdeactivitiesBq.name,
          operator: "contains",
          values: [search],
        },

        {
          member: CubeDataset.BdeactivitiesBq.createdByName,
          operator: "contains",
          values: [search],
        },
      ],
    });
  }

  return CubeQuery({ query });
};

export const getMonthlyMissed = async ({ data, search, count, pageNo }) => {
  let roleName = data;

  const query = {
    measures: [CubeDataset.BdeactivitiesBq.count],
    order: {
      [CubeDataset.BdeactivitiesBq.subject]: "asc",
      [CubeDataset.BdeactivitiesBq.name]: "asc",
      [CubeDataset.BdeactivitiesBq.count]: "desc",
      [CubeDataset.BdeactivitiesBq.createdByRoleName]: "asc",
      [CubeDataset.BdeactivitiesBq.createdByName]: "asc",
      [CubeDataset.BdeactivitiesBq.createdAt]: "desc",
      [CubeDataset.BdeactivitiesBq.startDateTime]: "desc",
    },
    dimensions: [
      CubeDataset.BdeactivitiesBq.subject,
      CubeDataset.BdeactivitiesBq.name,
      CubeDataset.BdeactivitiesBq.createdByRoleName,
      CubeDataset.BdeactivitiesBq.createdByName,
      CubeDataset.BdeactivitiesBq.createdAt,
      CubeDataset.BdeactivitiesBq.startDateTime,
    ],
    limit: count ?? 100,
    offset: Number((pageNo - 1) * count),
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.BdeactivitiesBq.startDateTime,
        dateRange: "This Month",
        granularity: "month",
      },
    ],
    filters: [
      {
        member: CubeDataset.BdeactivitiesBq.subject,
        operator: "equals",
        values: ["Follow Up Call", "Demo Call"],
      },
      {
        member: CubeDataset.BdeactivitiesBq.createdByRoleName,
        operator: "equals",
        values: roleName,
      },
      {
        member: CubeDataset.BdeactivitiesBq.startDateTime,
        operator: "beforeDate",
        values: [moment.utc(), moment.utc()],
      },
    ],
    renewQuery: true,
  };

  if (search && !query["filters"]?.find((obj) => obj["or"])) {
    query?.["filters"]?.push({
      or: [
        {
          member: CubeDataset.BdeactivitiesBq.name,
          operator: "contains",
          values: [search],
        },

        {
          member: CubeDataset.BdeactivitiesBq.createdByName,
          operator: "contains",
          values: [search],
        },
      ],
    });
  }

  return CubeQuery({ query });
};

export const getRealisedData = async (employeeId) => {
  const emp_id = getUserData("userData")?.employee_code;

  let roleList = localStorage.getItem("childRoles")
    ? DecryptData(localStorage.getItem("childRoles"))
    : [];
  //console.log(roleList)
  let empList = roleList ? roleList?.map((obj) => obj.userName) : [];
  let empCodes = [emp_id];
  if (empList.length > 0) {
    empCodes = [...empList];
  }

  const query = {
    measures: [CubeDataset.EmployeeLeadsOrderBq.realised],
    order: {
      [CubeDataset.EmployeeLeadsOrderBq.eEmpid]: "asc",
      [CubeDataset.EmployeeLeadsOrderBq.realised]: "desc",
    },
    dimensions: [
      //CubeDataset.EmployeeLeadsOrderBq.eEmpid,
    ],
    limit: 1000,
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.EmployeeLeadsOrderBq.Createdon,
        dateRange: "This Month",
        granularity: "month",
      },
    ],
    filters: [
      {
        member: CubeDataset.EmployeeLeadsOrderBq.eEmpid,
        operator: "equals",
        values: empCodes,
      },
    ],
    renewQuery: true,
  };
  return { rawData: () => [] };
  return CubeQuery({ query });
};

export const getCountryData = () => {
  const query = {
    measures: [],
    order: {
      [CubeDataset.CountryCityStateMapping.countryName]: "asc",
      [CubeDataset.CountryCityStateMapping.countryId]: "desc",
    },
    dimensions: [
      CubeDataset.CountryCityStateMapping.countryName,
      CubeDataset.CountryCityStateMapping.countryId,
      CubeDataset.CountryCityStateMapping.countryCode,
    ],

    renewQuery: true,
  };

  return CubeQuery({ query });
};

export const getTerritoryData = (countryName) => {
  const query = {
    measures: [],
    order: {
      [CubeDataset.Territorymappings.territoryName]: "asc",
      [CubeDataset.Territorymappings.territoryCode]: "desc",
    },
    dimensions: [
      CubeDataset.Territorymappings.territoryName,
      CubeDataset.Territorymappings.territoryCode,
    ],
    filters: [
      {
        member: CubeDataset.Territorymappings.countryName,
        operator: "equals",
        values: [countryName],
      },
    ],

    renewQuery: true,
  };

  return CubeQuery({ query });

};

export const getTerritoryByCityState = (city, state) => {
  const query = {
    measures: [],
    order: {
      [CubeDataset.Territorymappings.territoryName]: "asc",
      [CubeDataset.Territorymappings.territoryCode]: "desc",
    },
    dimensions: [
      CubeDataset.Territorymappings.territoryName,
      CubeDataset.Territorymappings.territoryCode,
    ],
    filters: [
      {
        member: CubeDataset.Territorymappings.cityName,
        operator: "equals",
        values: [city],
      },
      {
        member: CubeDataset.Territorymappings.stateName,
        operator: "equals",
        values: [state],
      },
    ],

    renewQuery: true,
  };

  return CubeQuery({ query });
}

export const getStateDataAccordingToRegion = (countryName, territoryName) => {

  const query = {
    measures: [],
    order: {
      [CubeDataset.CountryCityStateMapping.stateName]: "asc",
      [CubeDataset.CountryCityStateMapping.stateCode]: "desc",
      [CubeDataset.CountryCityStateMapping.stateId]: "desc",

    },
    dimensions: [
      CubeDataset.CountryCityStateMapping.stateName,
      CubeDataset.CountryCityStateMapping.stateCode,
      CubeDataset.CountryCityStateMapping.stateId

    ],
    filters: [],

    renewQuery: true,
  };

  if (territoryName === null) {
    query["filters"].push({
      member: CubeDataset.CountryCityStateMapping.countryName,
      operator: "equals",
      values: [countryName],
    });
  }
  else {
    query["filters"].push({
      member: CubeDataset.CountryCityStateMapping.territoryName,
      operator: "equals",
      values: [territoryName],
    },
      {
        member: CubeDataset.CountryCityStateMapping.countryName,
        operator: "equals",
        values: [countryName],
      });
  }

  return CubeQuery({ query });

};

export const getCountryStateData = (countryID) => {
  const query = {
    measures: [],
    order: {
      [CubeDataset.CountryCityStateMapping.stateName]: "asc",
      [CubeDataset.CountryCityStateMapping.countryName]: "asc",
      [CubeDataset.CountryCityStateMapping.stateId]: "desc",
    },
    dimensions: [
      CubeDataset.CountryCityStateMapping.stateName,
      CubeDataset.CountryCityStateMapping.countryName,
      CubeDataset.CountryCityStateMapping.stateId,
      CubeDataset.CountryCityStateMapping.stateCode,
    ],
    //"limit": 10000,
    //"timezone": "UTC",
    //"timeDimensions": [],
    filters: [
      {
        member: CubeDataset.CountryCityStateMapping.countryId,
        operator: "equals",
        values: [countryID],
      },
    ],
    renewQuery: true,
  };

  return CubeQuery({ query });
};

export const getCountryCityData = (stateName, countryID) => {


  const query = {
    measures: [],
    order: {
      [CubeDataset.CountryCityStateMapping.cityName]: "asc",
      [CubeDataset.CountryCityStateMapping.cityId]: "desc",
    },
    dimensions: [
      CubeDataset.CountryCityStateMapping.cityName,
      CubeDataset.CountryCityStateMapping.cityCode,
      CubeDataset.CountryCityStateMapping.cityId,
    ],
    limit: 1000,
    //"timezone": "UTC",
    //"timeDimensions": [],
    filters: [
      {
        member: CubeDataset.CountryCityStateMapping.countryId,
        operator: "equals",
        values: [countryID],
      },
      {
        member: CubeDataset.CountryCityStateMapping.stateName,
        operator: "contains",
        values: [stateName],
      },
    ],
    renewQuery: true,
  };


  return CubeQuery({ query });
};

export const getClaimList = (props) => {
  const roleName = getUserData("userData")?.crm_role;
  const query = {
    measures: [
      CubeDataset.EmployeeClaim.TotalApprovedAmount,
      CubeDataset.ApprovalRequest.totalRecords,
      CubeDataset.EmployeeClaim.TotalRejectedAmount,
      CubeDataset.EmployeeClaim.TotalClaimAmount,
      CubeDataset.EmployeeClaim.TotalPendingAmount,
    ],
    order: {
      [CubeDataset.EmployeeClaim.visitDate]: "desc",
    },
    dimensions: [
      CubeDataset.EmployeeClaim.requestByName,
      CubeDataset.EmployeeClaim.requestByEmpCode,
      CubeDataset.EmployeeClaim.cityName,
      CubeDataset.EmployeeClaim.stateName,
    ],
    limit: props?.itemsPerPage ?? 100,
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.EmployeeClaim.visitDate,
        dateRange: "This Year",
        granularity: "month",
      },
    ],
    filters: [
      {
        member: CubeDataset.ApprovalRequest.approverRoleName,
        operator: "equals",
        values: [roleName],
      },
    ],
    renewQuery: true,
    offset: Number((props?.pageNo - 1) * props?.itemsPerPage)
  };

  if (props?.filtersApplied?.length > 0) {
    props?.filtersApplied?.map((filterObj) => {
      let filterQueryObj = {};
      filterQueryObj[
        "member"
      ] = `${filterObj?.dataset?.dataSetName}.${filterObj?.field?.name}`;
      filterQueryObj["operator"] = `${filterObj?.operator?.value}`;
      filterQueryObj["values"] = filterObj?.filterValue;
      query?.["filters"]?.push(filterQueryObj);
    });
  }

  if (props?.search) {
    query?.["filters"]?.push({
      member: CubeDataset.EmployeeClaim.requestByEmpCode,
      operator: "contains",
      values: [props?.search],
    });
  }

  return CubeQuery({ query });

};


export const getClaimListNew = (props) => {
  const roleName = getUserData("userData")?.crm_role;
  const profileName = getUserData("userData")?.crm_profile;
  const query = {
    measures: [
      CubeDataset.UserClaim.TotalApprovedAmount,
      CubeDataset.UserClaim.totalRecords,
      CubeDataset.UserClaim.TotalRejectedAmount,
      CubeDataset.UserClaim.TotalClaimAmount,
      CubeDataset.UserClaim.TotalPendingAmount
    ],
    order: {
      //[CubeDataset.UserClaim.claimId]: 'asc',
      // [CubeDataset.UserClaim.visitDate]: "desc",
      [props?.sortBy]: props?.sortOrder
    },
    dimensions: [
      CubeDataset.UserClaim.requestByName,
      CubeDataset.UserClaim.requestByEmpCode,
      CubeDataset.TblEmployee.cityName,
      CubeDataset.TblEmployee.stateName,
      //CubeDataset.UserClaim.claimId
    ],
    limit: props?.itemsPerPage ?? 100,
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.UserClaim.visitDate,
        dateRange: "This Year",
        granularity: "month",
      },
    ],
    filters: [
      /* {
        member: CubeDataset.UserClaim.requestByEmpCode,
        operator: "equals",
        values:['E833']
      } */
    ],
    renewQuery: true,
    offset: Number((props?.pageNo - 1) * props?.itemsPerPage)
  };

  if (settings.FINANCE_PROFILES.indexOf(profileName) > -1) {
    query?.["filters"]?.push({
      member: CubeDataset.UserClaim.claimStatus,
      operator: "equals",
      values: ['PENDING AT FINANCE', 'APPROVED', 'REJECTED'],
    });
  } else {
    /* query?.["filters"]?.push({
      member: CubeDataset.ApprovalRequest.requestStatus,
      operator: "equals",
      values: ['NEW'],
    }); */
    query.filters.push({
      member: CubeDataset.ApprovalRequest.approverRoleName,
      operator: "equals",
      values: [roleName],
    })
  }

  if (props?.filtersApplied?.length > 0) {
    props?.filtersApplied?.map((filterObj) => {
      let filterQueryObj = {};
      filterQueryObj[
        "member"
      ] = `${filterObj?.dataset?.dataSetName}.${filterObj?.field?.name}`;
      filterQueryObj["operator"] = `${filterObj?.operator?.value}`;
      filterQueryObj["values"] = filterObj?.filterValue;
      query?.["filters"]?.push(filterQueryObj);
    });
  }

  if (props?.search) {
    query?.["filters"]?.push({
      member: CubeDataset.UserClaim.requestByEmpCode,
      operator: "contains",
      values: [props?.search],
    });
  }

  return CubeQuery({ query });

};
export const getClaimListDropdownNew = (props) => {
  const roleName = getUserData("userData")?.crm_role;
  const profileName = getUserData("userData")?.crm_profile;
  const query = {
    measures: [],
    order: {
      // [CubeDataset.UserClaim.visitDate]: "desc",
      [props?.sortBy]: props?.sortOrder
    },
    dimensions: [
      CubeDataset.UserClaim.requestByEmpCode,
      CubeDataset.UserClaim.schoolName,
      CubeDataset.UserClaim.schoolCode,
      CubeDataset.UserClaim.expenseType,
      CubeDataset.UserClaim.unitLabel,
      CubeDataset.UserClaim.claimAmount,
      CubeDataset.UserClaim.claimRemarks,
      CubeDataset.UserClaim.claimStatus,
      CubeDataset.UserClaim.unit,
      CubeDataset.UserClaim.visitDate,
      CubeDataset.UserClaim.billFile,
      CubeDataset.UserClaim.claimId,
      CubeDataset.UserClaim.MongoID,
      CubeDataset.UserClaim.visitNumber,
      CubeDataset.UserClaim.visitPurpose,
      CubeDataset.UserClaim.visitTimeOut,
      CubeDataset.UserClaim.visitTimeIn,
      // CubeDataset.TblEmployee.cityName,
      // CubeDataset.TblEmployee.stateName,
    ],
    limit: props?.itemsPerPage ?? 100,
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.UserClaim.visitDate,
        dateRange: "This Year",
        granularity: "month",
      },
    ],
    filters: [
      {
        member: CubeDataset.UserClaim.requestByEmpCode,
        operator: "equals",
        values: [props?.requestByEmpCode]
      }
    ],
    renewQuery: true,
    offset: Number((props?.listPageNo - 1) * props?.itemsPerPage)
  };

  if ((settings.FINANCE_PROFILES.indexOf(profileName) > -1)) {

    if (props?.reqStatus === undefined) {
      query?.["filters"]?.push({
        member: CubeDataset.UserClaim.claimStatus,
        operator: "equals",
        values: ['PENDING AT FINANCE', 'APPROVED', 'REJECTED'],
      });
    } else if (props?.reqStatus === 'NEW') {
      query?.["filters"]?.push({
        member: CubeDataset.UserClaim.claimStatus,
        operator: "equals",
        values: ['PENDING AT FINANCE'],
      });
    } else {
      query?.["filters"]?.push({
        member: CubeDataset.UserClaim.claimStatus,
        operator: "equals",
        values: [props?.reqStatus],
      });
    }

  } else {

    if (props?.reqStatus === undefined) {

    } else if (props?.reqStatus === 'NEW') {
      query?.["filters"]?.push({
        member: CubeDataset.UserClaim.claimStatus,
        operator: "equals",
        values: ["PENDING AT BUH", "PENDING AT CBO", "PENDING AT FINANCE", "PENDING AT L1"],
      });
    } else {
      query?.["filters"]?.push({
        member: CubeDataset.UserClaim.claimStatus,
        operator: "equals",
        values: [props?.reqStatus],
      });
    }

    query.filters.push({
      member: CubeDataset.ApprovalRequest.approverRoleName,
      operator: "equals",
      values: [roleName],
    })

  }

  if (props?.filtersApplied?.length > 0) {
    props?.filtersApplied?.map((filterObj) => {
      let filterQueryObj = {};
      filterQueryObj[
        "member"
      ] = `${filterObj?.dataset?.dataSetName}.${filterObj?.field?.name}`;
      filterQueryObj["operator"] = `${filterObj?.operator?.value}`;
      filterQueryObj["values"] = filterObj?.filterValue;
      query?.["filters"]?.push(filterQueryObj);
    });
  }
  console.log(query, '------------query')

  return CubeQuery({ query });

};

export const appliedClaimList = (props) => {
  const empCode = getUserData("userData")?.username?.toUpperCase();
  const roleName = getUserData("userData")?.crm_role;
  const profileName = getUserData("userData")?.crm_profile;
  const query = {
    measures: [
      CubeDataset.UserClaim.TotalApprovedAmount,
      CubeDataset.UserClaim.totalRecords,
      CubeDataset.UserClaim.TotalRejectedAmount,
      CubeDataset.UserClaim.TotalClaimAmount,
      CubeDataset.UserClaim.TotalPendingAmount,
    ],
    order: {
      [CubeDataset.UserClaim.visitDate]: "desc",
    },
    dimensions: [
      CubeDataset.UserClaim.requestByName,
      CubeDataset.UserClaim.requestByEmpCode,
      CubeDataset.TblEmployee.cityName,
      CubeDataset.TblEmployee.stateName,
    ],
    limit: props?.itemsPerPage ?? 100,
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.UserClaim.visitDate,
        dateRange: "This Year",
        granularity: "month",
      },
    ],
    filters: [
      {
        member: CubeDataset.ApprovalRequest.requestByEmpCode,
        operator: "equals",
        values: [empCode],
      },
      // {
      //   member: CubeDataset.ApprovalRequest.requestId,
      //   operator: "set"
      // }
    ],
    renewQuery: true,
    offset: Number((props?.pageNo - 1) * props?.itemsPerPage)
  };

  // if(settings.FINANCE_PROFILES.indexOf(profileName) > -1){
  //   query?.["filters"]?.push({
  //     member: CubeDataset.UserClaim.claimStatus,
  //     operator: "equals",
  //     values: ['PENDING AT FINANCE'],
  //   });
  // }else{
  //   query?.["filters"]?.push({
  //     member: CubeDataset.ApprovalRequest.requestStatus,
  //     operator: "equals",
  //     values: ['NEW'],
  //   });
  // }

  if (props?.filtersApplied?.length > 0) {
    props?.filtersApplied?.map((filterObj) => {
      let filterQueryObj = {};
      filterQueryObj[
        "member"
      ] = `${filterObj?.dataset?.dataSetName}.${filterObj?.field?.name}`;
      filterQueryObj["operator"] = `${filterObj?.operator?.value}`;
      filterQueryObj["values"] = filterObj?.filterValue;
      query?.["filters"]?.push(filterQueryObj);
    });
  }

  if (props?.search) {
    query?.["filters"]?.push({
      member: CubeDataset.UserClaim.requestByEmpCode,
      operator: "contains",
      values: [props?.search],
    });
  }

  return CubeQuery({ query });

};

export const getSalesApproval = (props) => {
  let {
    itemsPerPage,
    searchValue,
    pageNo,
    sortObj,
    filtersApplied,
    userName,
    displayFields
  } = props;

  const datasetName = filtersApplied?.[0]?.dataset?.dataSetName

  const query = {
    measures: [],
    order: {},
    limit: itemsPerPage ?? 100,
    offset: Number((pageNo - 1) * itemsPerPage),
    dimensions: [],
    timezone: "UTC",
    timeDimensions: [],
    filters: [],
    renewQuery: true,
  };

  for (const field of displayFields) {
    const modifiedFieldName = `${datasetName}.${field.fieldName}`;
    query['dimensions'].push(modifiedFieldName);
  }

  if (filtersApplied?.length > 0) {
    filtersApplied?.map((filterObj) => {
      let filterQueryObj = {};
      filterQueryObj[
        "member"
      ] = `${filterObj?.dataset?.dataSetName}.${filterObj?.field?.name}`;
      filterQueryObj["operator"] = `${filterObj?.operator?.value}`;
      filterQueryObj["values"] = filterObj?.filterValue;
      query?.["filters"]?.push(filterQueryObj);
    });
  }

  return CubeQuery({ query });
};

export const getTarget = ({ dateRange, roleName }) => {
  const query = {
    measures: [CubeDataset.Targets.TotalTargetAmount],
    order: {},
    dimensions: [],
    limit: 1000,
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.Targets.targetMonth,
        dateRange: dateRange,
        granularity: null
      }
    ],
    filters: [
      {
        member: CubeDataset.Targets.roleName,
        operator: "equals",
        values: [roleName],
      },
    ],
    renewQuery: true,
  };
  return CubeQuery({ query });
};


export const getCountryName = (countryId, stateId, cityId) => {


  const query = {
    measures: [],
    order: {
      [CubeDataset.CountryCityStateMapping.countryName]: "asc",
      [CubeDataset.CountryCityStateMapping.stateName]: "asc",
      [CubeDataset.CountryCityStateMapping.cityName]: "asc",
    },
    dimensions: [
      CubeDataset.CountryCityStateMapping.countryName,
      CubeDataset.CountryCityStateMapping.stateName,
      CubeDataset.CountryCityStateMapping.cityName


    ],
    limit: 1000,

    filters: [


    ],
    renewQuery: true,
  };

  if (countryId?.length !== 0) {
    query?.["filters"]?.push({
      member: CubeDataset.CountryCityStateMapping.countryId,
      operator: "equals",
      values: countryId,
    });
  }


  if (stateId?.length !== 0) {
    query?.["filters"]?.push({
      member: CubeDataset.CountryCityStateMapping.stateId,
      operator: "equals",
      values: stateId,
    });
  }

  if (cityId?.length !== 0) {
    query?.["filters"]?.push({
      member: CubeDataset.CountryCityStateMapping.cityId,
      operator: "equals",
      values: cityId,
    });
  }

  return CubeQuery({ query });
};

export const getRegionData = (territoryCode) => {
  const query = {
    measures: [],
    order: {
      [CubeDataset.Territorymappings.territoryName]: "asc",

    },
    dimensions: [
      CubeDataset.Territorymappings.territoryName,

    ],
    filters: [
      {
        member: CubeDataset.Territorymappings.territoryCode,
        operator: "equals",
        values: territoryCode,
      },
    ],

    renewQuery: true,
  };
  return CubeQuery({ query });
};

export const getReportPurchaseOrderList = (props) => {
  const roleName = getUserData("userData")?.crm_role;
  const query = {
    measures: [],
    order: {},
    offset: Number((props?.pageNo - 1) * props?.itemsPerPage),

    dimensions: [
      CubeDataset.Purchaseorders.purchaseOrderCode,
      CubeDataset.Purchaseorders.quotationCode,
      CubeDataset.Purchaseorders.schoolCode,
      CubeDataset.Purchaseorders.schoolName,
      CubeDataset.Purchaseorders.product,
      CubeDataset.Purchaseorders.status,
      CubeDataset.Purchaseorders.createdByName,
      CubeDataset.Purchaseorders.poAmount,
      CubeDataset.Purchaseorders.createdAt
    ],
    limit: props?.itemsPerPage ?? 100,
    timezone: "UTC",
    timeDimensions: [],
    filters: [],
    renewQuery: true,
  };

  if (props?.filtersApplied?.length > 0) {
    props?.filtersApplied?.map((filterObj) => {
      let filterQueryObj = {};
      filterQueryObj[
        "member"
      ] = `${filterObj?.dataset?.dataSetName}.${filterObj?.field?.name}`;
      filterQueryObj["operator"] = `${filterObj?.operator?.value}`;
      filterQueryObj["values"] = filterObj?.filterValue;
      query?.["filters"]?.push(filterQueryObj);
    });
  }

  if (props?.childRoleNames && settings.ADMIN_ROLES.indexOf(roleName) < 0) {
    query?.["filters"].push({
      member: CubeDataset.Purchaseorders.createdByRoleName,
      operator: "equals",
      values: props?.childRoleNames,
    });
  }

  if (props?.search) {
    query?.["filters"]?.push({
      member: CubeDataset.Purchaseorders.purchaseOrderCode,
      operator: "contains",
      values: [props?.search],
    });
  }

  return CubeQuery({ query });

};

export const getReportQuotationList = (props) => {
  const roleName = getUserData("userData")?.crm_role;
  const query = {
    measures: [CubeDataset.Quotations.productItemSalePriceSum],
    order: {
      [CubeDataset.Quotations.updatedAt]: "desc"
    },
    offset: Number((props?.pageNo - 1) * props?.itemsPerPage),

    dimensions: [
      CubeDataset.Quotations.quotationCode,
      CubeDataset.Quotations.schoolCode,
      CubeDataset.Quotations.schoolName,
      CubeDataset.Quotations.createdAt,
      CubeDataset.Quotations.approvalStatus,
      CubeDataset.Quotations.createdByName,
    ],
    limit: props?.itemsPerPage ?? 100,
    timezone: "UTC",
    timeDimensions: [],
    filters: [],
    renewQuery: true,
  };

  if (props?.filtersApplied?.length > 0) {
    props?.filtersApplied?.map((filterObj) => {
      let filterQueryObj = {};
      filterQueryObj[
        "member"
      ] = `${filterObj?.dataset?.dataSetName}.${filterObj?.field?.name}`;
      filterQueryObj["operator"] = `${filterObj?.operator?.value}`;
      filterQueryObj["values"] = filterObj?.filterValue;
      query?.["filters"]?.push(filterQueryObj);
    });
  }

  if (props?.childRoleNames && settings.ADMIN_ROLES.indexOf(roleName) < 0) {
    query?.["filters"].push({
      member: CubeDataset.Quotations.createdByRoleName,
      operator: "equals",
      values: props?.childRoleNames,
    });
  }

  if (props?.search) {
    query?.["filters"]?.push({
      member: CubeDataset.Quotations.quotationCode,
      operator: "contains",
      values: [props?.search],
    });
  }

  return CubeQuery({ query });

};


export const getCountryNameData = (countryId) => {

  const query = {
    measures: [],
    order: {
      [CubeDataset.CountryCityStateMapping.countryName]: "asc",

    },
    dimensions: [
      CubeDataset.CountryCityStateMapping.countryName,

    ],
    filters: [
      {
        member: CubeDataset.CountryCityStateMapping.countryId,
        operator: "equals",
        values: countryId,
      },
    ],

    renewQuery: true,
  };

  return CubeQuery({ query });

};




export const getReportImplementationList = (props) => {
  const roleName = getUserData("userData")?.crm_role;
  const query = {
    measures: [],
    order: {
      [CubeDataset.Implementationforms.createdAt]: "desc",
    },
    offset: Number((props?.pageNo - 1) * props?.itemsPerPage),

    dimensions: [
      CubeDataset.Implementationforms.impFormNumber,
      CubeDataset.Implementationforms.purchaseOrderCode,
      CubeDataset.Implementationforms.quotationCode,
      CubeDataset.Implementationforms.schoolCityName,
      CubeDataset.Implementationforms.schoolStateName,
      CubeDataset.Implementationforms.schoolCode,
      CubeDataset.Implementationforms.schoolName,
      CubeDataset.Implementationforms.productDetails,
      CubeDataset.Implementationforms.createdByName,
      CubeDataset.Implementationforms.assignedEngineerName,
      CubeDataset.Implementationforms.createdAt
    ],
    limit: props?.itemsPerPage ?? 100,
    timezone: "UTC",
    timeDimensions: [],
    filters: [],
    renewQuery: true,
  };

  if (props?.filtersApplied?.length > 0) {
    props?.filtersApplied?.map((filterObj) => {
      let filterQueryObj = {};
      filterQueryObj[
        "member"
      ] = `${filterObj?.dataset?.dataSetName}.${filterObj?.field?.name}`;
      filterQueryObj["operator"] = `${filterObj?.operator?.value}`;
      filterQueryObj["values"] = filterObj?.filterValue;
      query?.["filters"]?.push(filterQueryObj);
    });
  }

  if (props?.childRoleNames && settings.ADMIN_ROLES.indexOf(roleName) < 0) {
    query?.["filters"].push({
      member: CubeDataset.Implementationforms.createdByRoleName,
      operator: "equals",
      values: props?.childRoleNames,
    });
  }

  return CubeQuery({ query });

};



export const fetchClassFromBoard = (boardId) => {


  const query = {
    measures: [],
    order: {
      [CubeDataset.SyllabusBoardClassMaster.syllabusOrder]: "asc",
      [CubeDataset.SyllabusBoardClassMaster.boardId]: "desc",
      [CubeDataset.SyllabusBoardClassMaster.classId]: "desc",
      [CubeDataset.SyllabusBoardClassMaster.className]: "asc",
      [CubeDataset.SyllabusBoardClassMaster.boardName]: "asc",
    },
    dimensions: [
      CubeDataset.SyllabusBoardClassMaster.syllabusOrder,
      CubeDataset.SyllabusBoardClassMaster.classId,
      CubeDataset.SyllabusBoardClassMaster.className,
      CubeDataset.SyllabusBoardClassMaster.boardId

    ],
    limit: 1000,

    filters: [],
    renewQuery: true,
  };

  if (boardId?.length > 0 && !boardId?.includes(null)) {
    query?.["filters"]?.push({
      member: CubeDataset.SyllabusBoardClassMaster.boardId,
      operator: "equals",
      values: boardId,
    });
  }



  return CubeQuery({ query });
};



export const statusWiseClaimReport = (filterValue) => {
  let dateRange = handleStartMonth(filterValue)
  //console.log(dateRange)
  const query = {
    measures: [
      CubeDataset.UserClaim.TotalClaimAmount,
    ],
    order: {},

    dimensions: [
      CubeDataset.UserClaim.claimStatus,
    ],
    limit: 20,
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.UserClaim.createdAt,
        dateRange: dateRange,
        granularity: null
      }
    ],
    filters: [

    ],
    renewQuery: true,
  };
  let roles = getUserData('userRoles')
  if (roles && roles.length > 0) {
    query?.["filters"]?.push({
      member: CubeDataset.UserClaim.requestByRoleName,
      operator: "equals",
      values: roles,
    });
  }
  return CubeQuery({ query });

};

export const totalBaseSchool = (filterValue) => {
  let dateRange = handleStartMonth(filterValue)
  const query = {
    measures: [
      CubeDataset.Bdeactivities.UniqueSchools,
    ],
    order: {
      [CubeDataset.Bdeactivities.UniqueSchools]: "asc"
    },

    dimensions: [],
    //limit: 10,
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.Bdeactivities.createdAt,
        dateRange: dateRange,
        granularity: null
      }
    ],
    filters: [
      {
        member: CubeDataset.Bdeactivities.PriorityNew,
        operator: "equals",
        values: ['Base School', 'Base+School', 'NA'],
      },
      {
        member: CubeDataset.Bdeactivities.status,
        operator: "equals",
        values: ['Complete'],
      },
    ],
    renewQuery: true,
  };
  let roles = getUserData('userRoles')
  if (roles && roles.length > 0) {
    query?.["filters"]?.push({
      member: CubeDataset.Bdeactivities.createdByRoleName,
      operator: "equals",
      values: roles,
    });
  }
  return CubeQuery({ query });

};

export const schoolVisited = (filterValue) => {
  let dateRange = handleStartMonth(filterValue)
  const query = {
    measures: [
      CubeDataset.Bdeactivities.UniqueSchools,
    ],
    order: {
      [CubeDataset.Bdeactivities.UniqueSchools]: "desc",
      [CubeDataset.Bdeactivities.createdAt]: 'desc'
    },

    dimensions: [],
    //limit: 100,
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.Bdeactivities.createdAt,
        dateRange: dateRange,
        granularity: null
      }
    ],
    filters: [
      {
        member: CubeDataset.Bdeactivities.status,
        operator: "equals",
        values: ['Complete'],
      },
    ],
    renewQuery: true,
  };
  let roles = getUserData('userRoles')
  if (roles && roles.length > 0) {
    query?.["filters"]?.push({
      member: CubeDataset.Bdeactivities.createdByRoleName,
      operator: "equals",
      values: roles,
    });
  }
  return CubeQuery({ query });

};

export const expectedConversions = (filterValue) => {
  let dateRange = handleStartMonth(filterValue)
  const query = {
    measures: [
      CubeDataset.Bdeactivities.totalRecords,
      CubeDataset.Bdeactivities.TotalCV
    ],
    dimensions: [
      CubeDataset.Bdeactivities.name
    ],
    order: {
      [CubeDataset.Bdeactivities.name]: "asc"
    },

    //limit: 100,
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.Bdeactivities.createdAt,
        dateRange: dateRange,
        granularity: null
      }
    ],
    filters: [
      {
        member: CubeDataset.Bdeactivities.status,
        operator: "equals",
        values: ['Complete'],
      },
    ],
    renewQuery: true,
  };
  let roles = getUserData('userRoles')
  if (roles && roles.length > 0) {
    query?.["filters"]?.push({
      member: CubeDataset.Bdeactivities.createdByRoleName,
      operator: "equals",
      values: roles,
    });
  }
  return CubeQuery({ query });

};

export const schoolsConverted = (filterValue) => {
  let dateRange = handleStartMonth(filterValue)
  const query = {
    measures: [
      CubeDataset.Purchaseorders.totalRecords,
      CubeDataset.Quotations.TotalSalePrice,
    ],
    dimensions: [
      CubeDataset.Quotations.productName
    ],
    order: {
      [CubeDataset.Quotations.productName]: "asc"
    },

    limit: 100,
    timezone: "UTC",
    timeDimensions: [
      {
        dimension: CubeDataset.Quotations.createdat,
        dateRange: dateRange,
        granularity: null
      }
    ],
    filters: [
      {
        member: CubeDataset.Purchaseorders.approvalStatus,
        operator: "equals",
        values: ['Approved'],
      },
    ],
    renewQuery: true,
  };
  let roles = getUserData('userRoles')
  if (roles && roles.length > 0) {
    query?.["filters"]?.push({
      member: CubeDataset.Purchaseorders.createdByRoleName,
      operator: "equals",
      values: roles,
    });
  }
  return CubeQuery({ query });

};

export const fetchSchoolList = (filterValue) => {

  const query = {
    measures: [
      CubeDataset.Leadinterests.EdcCountSum,
      CubeDataset.Leadinterests.MaxEdc,
      CubeDataset.Leadinterests.LearningProfileGroupedName
    ],
    dimensions: [
      CubeDataset.Schools.schoolName,
      CubeDataset.Leadowners.assignedToProfileName,
      CubeDataset.Leadowners.assignedToRoleName,
      CubeDataset.Schools.leadId,
    ],
    order: {
      [CubeDataset.Schools.createdAt]: "asc"
    },
    limit: 100,
    timezone: "UTC",
    timeDimensions: [],
    filters: [],
    renewQuery: true,
  };

  if (filterValue && filterValue.length > 0) {
    query?.["filters"]?.push({
      member: CubeDataset.Leadowners.assignedToRoleName,
      operator: "equals",
      values: filterValue,
    });
  }
  return CubeQuery({ query });

};


export const getClaimNumber = (startDate, endDate, roleName) => {

  const query = {
    measures: [CubeDataset.Bdeactivities.totalRecords],
    dimensions: [
      CubeDataset.Bdeactivities.startDateTime,

    ],
    order: {
      [CubeDataset.Bdeactivities.totalRecords]: "desc",
    },
    // limit: 10,
    timezone: "UTC",
    timeDimensions: [],
    filters: [
      {
        member: CubeDataset.Bdeactivities.raisedClaim,
        operator: "equals",
        values: ["1"],
      },
      {
        member: CubeDataset.Bdeactivities.createdByRoleName,
        operator: "equals",
        values: [roleName],
      },
      {
        member: CubeDataset.Bdeactivities.startDateTime,
        operator: "inDateRange",
        values: [startDate, endDate],
      }
    ],
    renewQuery: true,

  };


  return CubeQuery({ query });

};


export const getClaimNumberFromUserClaim = (startDate, endDate, roleName) => {

  const query = {
    measures: [CubeDataset.UserClaim.totalRecords],
    dimensions: [
      CubeDataset.UserClaim.visitDate,
    ],
    order: {
      [CubeDataset.UserClaim.totalRecords]: "desc",
      [CubeDataset.UserClaim.visitDate]: "desc",

    },
    // limit: 100,
    timezone: "UTC",
    timeDimensions: [],
    filters: [
      {
        member: CubeDataset.UserClaim.requestByRoleName,
        operator: "equals",
        values: [roleName],
      },
      {
        member: CubeDataset.UserClaim.visitDate,
        operator: "inDateRange",
        values: [startDate, endDate],
      }
    ],
    renewQuery: true,
  };



  return CubeQuery({ query });

};

export const fetchRoleList = (filterValue) => {

  const query = {
    measures: [],
    dimensions: [
      CubeDataset.TblEmployee.uuid,
    ],
    order: {
    },
    limit: 700,
    timezone: "UTC",
    timeDimensions: [],
    filters: [
    ],
    renewQuery: true,
  };

  if (filterValue && filterValue.length > 0) {
    query?.["filters"]?.push({
      member: CubeDataset.TblEmployee.eCode,
      operator: "equals",
      values: filterValue,
    });
  }
  return CubeQuery({ query });
};

export const fetchEmpCode = (filterValue) => {

  const query = {
    measures: [],
    dimensions: [
      CubeDataset.TblEmployee.eCode,
    ],
    order: {
    },
    limit: 700,
    timezone: "UTC",
    timeDimensions: [],
    filters: [
    ],
    renewQuery: true,
  };

  if (filterValue && filterValue.length > 0) {
    query?.["filters"]?.push({
      member: CubeDataset.TblEmployee.uuid,
      operator: "equals",
      values: filterValue,
    });
  }
  return CubeQuery({ query });
};


export const fetchProfileList = (filterValue) => {

  const query = {
    measures: [],
    dimensions: [
      CubeDataset.TblEmployee.roleName,
      CubeDataset.TblEmployee.profileName,
    ],
    order: {
    },
    limit: 700,
    timezone: "UTC",
    timeDimensions: [],
    filters: [
    ],
    renewQuery: true,
  };

  if (filterValue && filterValue.length > 0) {
    query?.["filters"]?.push({
      member: CubeDataset.TblEmployee.roleName,
      operator: "equals",
      values: filterValue,
    });
  }
  return CubeQuery({ query });
};


export const getCityByTerritory = (territoryCode) => {


  const query = {
    measures: [],
    order: {
      [CubeDataset.Territorymappings.cityCode]: "asc",
      [CubeDataset.Territorymappings.cityName]: "asc",
      [CubeDataset.Territorymappings.territoryCode]: "asc",
      [CubeDataset.Territorymappings.territoryName]: "asc",

    },

    dimensions: [
      CubeDataset.Territorymappings.cityName,
      CubeDataset.Territorymappings.cityCode,
      CubeDataset.Territorymappings.territoryCode,
      CubeDataset.Territorymappings.territoryName
    ],
    // limit: 1000,
    //"timezone": "UTC",
    //"timeDimensions": [],
    filters: [
      {
        member: CubeDataset.Territorymappings.territoryCode,
        operator: "equals",
        values: territoryCode,
      },

    ],
    renewQuery: true,
  };


  return CubeQuery({ query });
};


export const getLedgerData = (props) => {

  const query = {
    measures: [
      CubeDataset.Ledger.totalRecords,
    ],
    order: {
      [CubeDataset.Ledger.totalRecords]: "desc",
      [CubeDataset.Ledger.osAmount]: "desc",
      [CubeDataset.Ledger.osMonths]: "desc",
      [CubeDataset.Ledger.totalContractValue]: "desc",
      [CubeDataset.Ledger.businessUnit]: "asc",
      [CubeDataset.Ledger.product]: "asc",
      [CubeDataset.Ledger.schoolCode]: "asc",
      [CubeDataset.Ledger.schoolName]: "asc",
      [CubeDataset.Ledger.city]: "asc",
      [CubeDataset.Ledger.cityCode]: "asc",
      [CubeDataset.Ledger.pinCode]: "asc",
      [CubeDataset.Ledger.address]: "asc",


    },
    offset: Number((props?.pageNo - 1) * props?.itemsPerPage),
    dimensions: [
      CubeDataset.Ledger.osAmount,
      CubeDataset.Ledger.osMonths,
      CubeDataset.Ledger.totalContractValue,
      CubeDataset.Ledger.businessUnit,
      CubeDataset.Ledger.product,
      CubeDataset.Ledger.schoolCode,
      CubeDataset.Ledger.schoolName,
      CubeDataset.Ledger.city,
      CubeDataset.Ledger.cityCode,
      CubeDataset.Ledger.pinCode,
      CubeDataset.Ledger.address

    ],
    limit: props?.itemsPerPage ?? 10,
    timezone: "UTC",
    timeDimensions: [],
    filters: [],
    renewQuery: true,
  };

  if (props?.businessUnit && props?.businessUnit?.length > 0) {
    query?.["filters"]?.push({
      member: CubeDataset.Ledger.businessUnit,
      operator: "equals",
      values: props?.businessUnit,
    });
  }
  if (props?.city && props?.city?.length > 0) {
    query?.["filters"]?.push({
      member: CubeDataset.Ledger.cityCode,
      operator: "equals",
      values: props?.city,
    });
  }
  if (props?.school && props?.school?.length > 0) {
    query?.["filters"]?.push({
      member: CubeDataset.Ledger.schoolCode,
      operator: "equals",
      values: props?.school,
    });
  }
  if (props?.product && props?.product?.length > 0) {
    query?.["filters"]?.push({
      member: CubeDataset.Ledger.product,
      operator: "equals",
      values: props?.product,
    });
  }



  return CubeQuery({ query });
};


export const getProductsFromSchool = (schoolCode) => {

  const query = {
    measures: [],
    order: {

      [CubeDataset.Ledger.product]: "asc",
      [CubeDataset.Ledger.schoolCode]: "asc",
      [CubeDataset.Ledger.schoolName]: "asc",
      [CubeDataset.Ledger.productName]: "asc",


    },

    dimensions: [
      CubeDataset.Ledger.product,
      CubeDataset.Ledger.productName,
      CubeDataset.Ledger.schoolCode,
      CubeDataset.Ledger.schoolName,

    ],
    // limit: 100,
    timezone: "UTC",
    timeDimensions: [],
    filters: [
      {
        member: CubeDataset.Ledger.schoolCode,
        operator: "equals",
        values: schoolCode,
      },
    ],
    renewQuery: true,
  };


  return CubeQuery({ query });
};


export const getSchoolsByCity = (props) => {

  const query = {
    measures: [],
    order: {
      [CubeDataset.Ledger.schoolCode]: "asc",
      [CubeDataset.Ledger.schoolName]: "asc",
      [CubeDataset.Ledger.city]: "asc",
    },


    dimensions: [
      CubeDataset.Ledger.schoolCode,
      CubeDataset.Ledger.schoolName,
      CubeDataset.Ledger.city,
    ],
    // limit: 1000,
    timezone: "UTC",
    timeDimensions: [],
    filters: [
      {
        member: CubeDataset.Ledger.city,
        operator: "equals",
        values: props,
      }
    ],
    renewQuery: true,
  };

  return CubeQuery({ query });
}









