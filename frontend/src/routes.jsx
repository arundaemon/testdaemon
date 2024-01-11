import { Navigate, Route, useRoutes } from "react-router-dom";
// import DashboardLayout from './layouts/dashboard';
import NotFound from "./pages/NotFound";
import NotAuthorised from "./pages/NotAuthorised";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Logout from "./pages/Logout";
import MenuManagement from "./pages/MenuManagement";
import RoleManagement from "./pages/RoleManagement";
import ProjectManagement from "./pages/ProjectManagement";
import DashboardLayout from "./layouts/dashboard";
import BannerManagement from "./pages/BannerManagement";
import ListingDetail from "./components/MyLeads/ListingDetail";
import ManageMatrix from "./pages/ManageMatrix";
import CycleManagement from "./pages/CycleManagement";
import CycleJourneyMapping from "./components/cycleManagement/CycleJourneyMapping";
import JourneyManagement from "./pages/JourneyManagement";
import CreateJourney from "./pages/CreateJourney";
// import JourneyUpdate from "./components/journey/JourneyUpdate";
// import MyLeads from "./pages/MyLeads";
import AddLead from "./components/MyLeads/AddLead";
import ActivityManagement from "./pages/ActivityManagement";
import CreateActivity from "./pages/CreateActivity";
import CreateEmployee from "./pages/CreateEmployee";
import CreateCustomer from "./pages/CreateCustomer";
import StatusManagement from "./pages/StatusManagement";
import { EditStatusPage } from "../src/components/statusManagement";
import StageManagement from "./pages/StageManagement";
import { EditStagePage } from "../src/components/stageManagement";
import BannerDetails from "./pages/BannerDetails";
import AddMatrix from "./pages/AddMatrix";
import SourceManagement from "./pages/sourceManagement";
import ActivityFormMappingManagement from "./pages/ActivityFormMappingManagement";
import {
  AddNewSourcePage,
  LeadSubSourceListing,
} from "./components/sourceManagement";
import { AddSubSource } from "./components/sourceManagement";
import RuleManagement from "./pages/ruleMangement/RuleManagement";
import RuleRoleMapping from "./pages/ruleMangement/RoleMapping";
import CreateRule from "./pages/ruleMangement/CreateRule";
import AddActivity from "./pages/AddActivity";
import UpdateActivity from "./pages/UpdateActivity";
import TargetIncentiveManagement from "./pages/TargetIncentiveManagement";
import EditMatrix from "./pages/EditMatrix";
import ActivityForm from "./pages/ActivityForm";
import AddTask from "./pages/TaskManagement/AddTask";
import ManageTask from "./pages/TaskManagement/ManageTask";
import CampaignManagement from "./pages/CampaignManagement";
import CreateCampaign from "./components/campaignManagement/CreateCampaign";
import UpdateCampaign from "./components/campaignManagement/UpdateCampaign";
import ManageStageStatus from "./pages/ManageStageStatus";
import RuleMapping from "./components/StageStatusManagement/RuleMapping";
import Revenue from "./pages/Revenue";
import MultipleUserTable from "./components/MyLeads/MultipleUserTable";
import MyCalendar from "./pages/calendarManagement/myCalendar";
import TaskActivityMapping from "./pages/TaskActivity/TaskActivityMapping";
import AddTaskActivity from "./pages/TaskActivity/AddTaskActivity";
import ShowALLTask from "./pages/Calendar/ShowAllTask";
import TaskDetails from "./pages/TaskDetails";
import PendingTask from "./pages/PendingTask";
import Dashboard from "./pages/dashboard/Dashboard";
import OrderDetails from "./pages/OrderDetails";
import ManageJourney from "./components/journey/ManageJourney.jsx";
import ApprovalRequestManagement from "./pages/ApprovalRequests/ApprovalRequestManagement";
import ApplyRequestPage from "./pages/ApprovalRequests/ApplyRequestPage";
import { RequestDetails } from "./components/approvalRequestManagement";
import CollectPayment from "./components/MyLeads/CollectPayment";
import CreateOrder from "./components/MyLeads/CreateOrder";
import ResetPassword from "./pages/ResetPassword";
import LeadAssignment from "./components/MyLeads/LeadAssignment";
import RouteAuthService from "./utils/RouteAuthService";
import SubjectManagement from "./pages/SubjectManagement";
import CustomerResManagement from "./pages/CustomerResManagement";
import ReasonForDisqualificationManagement from "./pages/reasonForDisqaulificationManagement";
import EventPendingTask from "./pages/Calendar/PendingTask";
import EventSummary from "./pages/Calendar/TaskSummary";
import OrderNumber from "./components/MyLeads/Accordion/OrderNumber";
import MobileDndManagement from "./pages/MobileDndManagement";
import ConfigDetails from "./components/configManagement/ConfigDetails";
import Mobile_BatchTable from "./components/campaignManagement/Mobile_BatchTable";
import MyOrders from "./pages/MyOrders";
import LeadName from "./components/MyLeads/LeadName";
import ViewTask from "./pages/bdmDashboard/ViewTask";
import LeadDetail from "./components/MyLeads/LeadDetail";
import LeadListing from "./components/MyLeads/LeadListing";
import RefurbishLeads from "./components/MyLeads/RefurbishLeads";
import TerritoryMappingManagement from "./pages/TerritoryMappingManagement";
import CreateOrEditTerritory from "./components/territoryMappingManagement/CreateOrEditTerritory";
import MyTeam from "./pages/MyTeam";
import CampaignTracking from "./components/MyLeads/CampaignTracking";
import ClaimMasterList from "./components/claims/ClaimMasterList";
import CreateOrEditClaimMaster from "./components/claims/CreateOrEditClaimMaster";
import MyClaim from "./components/claims/MyClaim";
import { AddSchool } from "./components/MyLeads/AddSchool";
import SchoolDetail from "./components/MyLeads/SchoolDetail";
import SchoolList from "./components/school/SchoolList";
import CoupanRequestModal from "./components/MyLeads/CoupanRequestModal";
import BulkCouponRequest from "./components/couponRequest/BulkCouponRequest";
import CreateApprovalMapping from "./components/approvalMapping/CreateApprovalMapping";
import ApprovalMappingManagement from "./pages/ApprovalMappingManagement";
import UserClaimFinance from "./components/claims/UserClaimFinance";
import CreateOrEditUserClaim from "./components/claims/CreateOrEditUserClaim";
import MyClaimsList from "./components/claims/MyClaimsList";
import CrmMasterManagement from "./pages/CrmMasterManagement";
import CrmFieldMasterManagement from "./pages/CrmFieldMasterManagement";
import { SchoolActivityForm } from "./components/MyLeads/SchoolActivity";
import B2BSchoolDashboard from "./pages/dashboard/B2BDashboard";
import LeadInterest from "./components/school/LeadInterest";
import { LogDayActivity } from "./components/SchoolDashboard/LogActivity";
import ClaimDashboard from "./pages/ClaimDashboard";
import PackageManagement from "./components/packageMangement/PackageManagement";
import ManagePackageHeader from "./components/packageMangement/ManagePackageHeader";
import TargetManagement from "./components/target/TargetManagement";
import TargetDetails from "./components/target/TargetDetails";
import TargetAssign from "./components/target/TargetAssign";
import HardwarePartList from "./components/Hardware Management/HardwarePartList";
import HardwarePartForm from "./components/Hardware Management/HardwarePartForm";
import HardwarePartVariantList from "./components/Hardware Management/HardwarePartVariantList";
import HardwareBundleList from "./components/Hardware Management/HardwareBundleList";
import HardwareBundleForm from "./components/Hardware Management/HardwareBundleForm";
import HardwarePartVariantForm from "./components/Hardware Management/HardwarePartVariantForm";
import { HardwareBundleVariantForm } from "./components/Hardware Management/HardwareBundleVariantForm";
import HardwareBundleVariantList from "./components/Hardware Management/HardwareBundleVariantList";
import FinanceDashboard from "./pages/FinanceDashboard";
import { PriceMatrix } from "./components/Pricing-Engine/PriceMatrix";
import { MatrixList } from "./components/Pricing-Engine/MatrixList";
import { EditPriceMatrix } from "./components/Pricing-Engine/EditPriceMatrix";
import SourceListing from "./pages/SourceListing";
import AddPriceMatrixSource from "./components/sourceListing/AddPriceMatrixSource";
import AddPriceMatrixSubSource from "./components/sourceListing/AddPriceMatrixSubSource";
import SubSourceListing from "./pages/SubSourceListing";
import MatrixCampaign from "./pages/MatrixCampaign";
import MatrixCampaignListing from "./pages/MatrixCampaignListing";
import QuotationMappingList from "./components/quotationMapping/QuotationMappingList";
import QuotationMappingForm from "./components/quotationMapping/QuotationMappingForm";
import AddQuotation from "./pages/Quotation";
import QuotationDetailPage from "./pages/Quotation/QuotationDetailPage";
import QuotationTable from "./pages/Quotation/QuotationTable";
import ServiceManagement from "./pages/ServiceManagment";
import ServiceManagementForm from "./pages/ServiceManagementForm";
import AddApprovalMatrix from "./components/approvalManagement/AddApprovalMatrix";
import ApprovalListing from "./components/approvalManagement/ApprovalListing";
import PurchaseOrderManagement from "./components/purchaseOrder/PurchaseOrderManagement";
import ImplementationForm from "./pages/implementationForm/ImplementationForm";
import QuotationDetailForm from "./pages/Quotation/QuotationDetailForm";
import EditQuotation from "./pages/Quotation/EditQuotation";
import SalesApprovalListing from "./components/salesApproval/SalesApprovalListing";
import ClaimList from "./components/SmartClaim/ClaimList";
import RaiseClaim from "./components/SchoolDashboard/RaiseClaim";
import ImplementationList from "./pages/implementationForm/ImplementationList";
import PurchaseOrderDetail from "./components/purchaseOrder/PurchaseOrderDetail";
import PurchaseOrderDetailManagement from "./components/purchaseOrder/PurchaseOrderDetailManagement";
import ImplementationDetailPage from "./pages/implementationForm/ImplementationDetailPage";
import SalesApprovalDetail from "./components/salesApproval/SalesApprovalDetail";
import AppliedList from "./components/appliedList/AppliedList";
import Tds from "./pages/UploadTds/Tds";
import { PricingEngineDetail, PricingEngineDetails } from "./components/Pricing-Engine/PricingEngineDetails";
import ImplementationSurveyDetail from "./pages/implementationForm/ImplementationSurvey";
import DscUpload from "./pages/dsc/DscUpload";
import SiteSurveyListing from "./pages/SiteSurvey/SiteSurveyListing";
import SiteSurveyDash from "./pages/SiteSurvey/SiteSurveyDash";
import SiteSurveyDetail from "./pages/SiteSurvey/SiteSurveyDetail";
import GenerateSchedule from "./pages/GenerateSchedule";
import VoucherManagement from "./components/voucherManagement/voucherManagement";
import VoucherForm from "./components/voucherManagement/voucherForm";
import { VoucherDetails } from "./components/voucherManagement/voucherDetails";
import { VoucherUpdate } from "./components/voucherManagement/voucherUpdate";
import CreateHardwareInvoices from "./components/Hardware Invoice Management/CreateHardwareInvoices.jsx";
import FillOrEditInvoiceDetails from "./components/Hardware Invoice Management/FillOrEditInvoiceDetails.jsx";
import GeneratedOrSavedHardwareInvoices from "./components/Hardware Invoice Management/GeneratedOrSavedHardwareInvoices.jsx";
import CancelledHardwareInvoices from "./components/Hardware Invoice Management/CancelledHardwareInvoices.jsx";
import GeneratedOrSavedOfficeInvoice from "./components/Hardware Invoice Management/GeneratedOrSavedOfficeInvoice.jsx";
import CancelledOfficeInvoices from "./components/Hardware Invoice Management/CancelledOfficeInvoices.jsx";
import CreateSchedule from "./pages/CreateSchedule";
import DscList from "./pages/dsc/DscList";
import QuotationDetail from './pages/Common/QuotationDetail'
import PurchaseOrder from "./pages/Common/PurchaseOrder";
import SiteSurveyActivityList from "./pages/SiteSurvey/SiteSurveyActivityList";
import GenerateInvoiceList from "./components/Software Invoice Management/GenerateInvoiceList";
import FailedInvoiceList from "./components/Software Invoice Management/FailedInvoiceList";
import GeneratedInvoiceList from "./components/Software Invoice Management/GeneratedInvoiceList";
import Ledgerlist from "./pages/ledger/ledgerlist";
import EditLedger from "./pages/ledger/editLedger"
import { MissedMeeting } from "./components/SchoolDashboard/MissedMeeting.jsx";
import { MissedMeetingsPage } from "./pages/MissedMeetingsPage.jsx";
import QuotationView from "./pages/Quotation/QuotationView.jsx";
import ScheduleList from "./pages/ScheduleList";
import ScheduleDetail from "./pages/ScheduleDetail.jsx";
import PendingTasks from "./components/Collection Process/PendingCollection.jsx";
import CollectionDetail from "./pages/Collection/CollectionDetail.jsx";
import CollectionNotification from "./pages/Collection/CollectionNotication.jsx";
import PendingCollectionList from "./components/Collection Process/PendingCollection.jsx";
import EditActivatedSchool from "./pages/ActivatedSchool/EditActivatedSchool.jsx";
import ActivatedSchoolTable from "./pages/ActivatedSchool/ActivatedSchoolTable.jsx";
import EditImplementation from "./pages/implementationForm/EditImplementation.jsx";
import HardwareVoucherManagement from "./components/hardwareVoucher/HardwareVoucherManagement.jsx";
import HardwareVoucherForm from "./components/hardwareVoucher/HardwareVoucherForm.jsx";
import { HardwareVoucherDetails } from "./components/hardwareVoucher/HardwareVoucherDetails.jsx";
import { HardwareVoucherUpdate } from "./components/hardwareVoucher/HardwareVoucherUpdate.jsx";
import PaymentListView from "./components/paymentManagement/PaymentListView.jsx";
import PaymentDetailsForm from "./components/paymentManagement/PaymentDetailsForm.jsx";
import PaymentAdjustmentForm from "./components/paymentManagement/PaymentAdjustmentForm.jsx";
import PendingApprovalListView from "./components/paymentManagement/PendingApprovalListView.jsx";
import PendingApprovalAdjustmentForm from "./components/paymentManagement/PendingApprovalAdjustmentForm.jsx";
import PaymentDepositCases from "./components/paymentManagement/PaymentDepositCases.jsx";
import CheckSheetDetail from "./pages/CheckSheet/CheckSheetDetail.jsx";
import { DoDInvoiced } from "./pages/CheckSheet/DODInvoiced.jsx";
import QcImplementForm from "./pages/QC Module/index.jsx";
import QcListing from "./pages/QC Module/QcListing.jsx";
import CheckSheetList from "./pages/CheckSheet/index.jsx";
import QcDetailView from "./pages/QC Module/QcDetailView.jsx";
import LedgerList from "./components/Ledger Management/LedgerList.jsx";
import LedgerListDetail from "./components/Ledger Management/LedgerList.jsx";
import HardwareQCList from "./pages/SiteSurvey/HardwareQCList.jsx";
import SiteApprovedList from "./pages/SiteSurvey/SIteSurveyApproved.jsx";
import SchoolLedgerDetail from "./components/Ledger Management/LedgerDetail.jsx";
import GenerateAddendum from "./components/Collection Process/GenerateAddendum.jsx";
import PendingAddendumList from "./components/Collection Process/PendingAddendumList.jsx";
import AddendumDetail from "./components/Collection Process/AddendumDetail.jsx";
import UpdateSoftwareInvoiceList from "./components/Software Invoice Management/UpdateSoftwareInvoiceList.jsx";
import UpdateSoftwareInvoiceForm from "./components/Software Invoice Management/UpdateSoftwareInvoiceForm.jsx";
import PurchaseOrderUpload from "./components/purchaseOrder/PurchaseOrderUpload.jsx";
import FinanceApprovalListView from "./components/paymentManagement/FinanceApprovalListView.jsx";
import FinanceApprovalAdjustmentForm from "./components/paymentManagement/FinanceApprovalAdjustmentForm.jsx";
import EditAddendumDetails from "./components/Collection Process/EditAddendumDetails.jsx";
import HardwareSiteSurveyList from "./pages/implementationForm/HardwareSurveyList.jsx";
import HardwareQualityList from "./pages/implementationForm/HardwareQualityList.jsx";
import InvoiceEmail from "./components/Software Invoice Management/InvoiceEmail.jsx";
import NpsListing from "./pages/NpsListing.jsx";
import AssignQCList from "./pages/SiteSurvey/AssignQCList.jsx";
import RejectedCases from "./components/paymentManagement/RejectedCases.jsx";
import SiteSurveyTask from "./pages/SiteSurvey/AssignedSSRTask.jsx";
import QualityCheckTask from "./pages/SiteSurvey/AssignedQCTask.jsx";
import SalesDashboard from "./components/salesApproval/SalesDashboard.jsx";
import RoleDashboard from "./components/roleDashboard/RoleDashboard.jsx";

export default function Router() {
  const checkLoggedIn = () => {
    let userData = localStorage.getItem("loginData");

    if (userData) return true;
    else return false;
  };

  return useRoutes([
    {
      path: "/authorised",
      element: checkLoggedIn() ? (
        <DashboardLayout />
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        {
          path: "my-crm",
          element: RouteAuthService({
            route: "/authorised/my-crm",
            component: <ManageJourney />,
          }),
        },
        {
          path: "menu-management",
          element: RouteAuthService({
            route: "/authorised/menu-management",
            component: <MenuManagement />,
          }),
        },
        {
          path: "journey-management",
          element: RouteAuthService({
            route: "/authorised/journey-management",
            component: <JourneyManagement />,
          }),
        },
        { path: "create-journey", element: <CreateJourney /> },
        { path: "update-journey/:id", element: <CreateJourney /> },

        {
          path: "banner-management",
          element: RouteAuthService({
            route: "/authorised/banner-management",
            component: <BannerManagement />,
          }),
        },
        { path: "banner-details", element: <BannerDetails /> },
        { path: "update-banner/:id", element: <BannerDetails /> },

        {
          path: "matrix-management",
          element: RouteAuthService({
            route: "/authorised/matrix-management",
            component: <ManageMatrix />,
          }),
        },
        { path: "add-matrix", element: <AddMatrix /> },
        { path: "update-matrix/:matrix_id", element: <EditMatrix /> },
        { path: "add-lead", element: <AddLead /> },
        //{ path: "all-leads", element:  <MyLeads /> },
        // { path: "all-leads", element: RouteAuthService({ route: '/authorised/all-leads', component: <MyLeads /> }) },
        {
          path: "lead-Assignment",
          element: RouteAuthService({
            route: "/authorised/lead-Assignment",
            component: <LeadAssignment />,
          }),
        },
        { path: "multiple-user", element: <MultipleUserTable /> },

        {
          path: "target-incentive",
          element: RouteAuthService({
            route: "/authorised/target-incentive",
            component: <TargetIncentiveManagement />,
          }),
        },

        { path: "role-management", element: <RoleManagement /> },
        {
          path: "project-management",
          element: RouteAuthService({
            route: "/authorised/project-management",
            component: <ProjectManagement />,
          }),
        },

        { path: "404", element: <NotFound /> },
        { path: "*", element: <Navigate to="/authorised/404" replace /> },

        {
          path: "cycle-management",
          element: RouteAuthService({
            route: "/authorised/cycle-management",
            component: <CycleManagement />,
          }),
        },
        {
          path: "journey-mapping/:cycle_name",
          element: <CycleJourneyMapping />,
        },
        {
          path: "journey-mapping/:cycle_name/:cycle_id",
          element: <CycleJourneyMapping />,
        },

        {
          path: "activity-management",
          element: RouteAuthService({
            route: "/authorised/activity-management",
            component: <ActivityManagement />,
          }),
        },
        { path: "create-activity", element: <CreateActivity /> },
        { path: "update-customer-activity/:id", element: <CreateCustomer /> },
        { path: "update-employee-activity/:id", element: <CreateEmployee /> },
        { path: "create-employee", element: <CreateEmployee /> },
        { path: "create-customer", element: <CreateCustomer /> },

        {
          path: "status-management",
          element: RouteAuthService({
            route: "/authorised/status-management",
            component: <StatusManagement />,
          }),
        },
        { path: "edit-status/:status_id", element: <EditStatusPage /> },

        {
          path: "stage-management",
          element: RouteAuthService({
            route: "/authorised/stage-management",
            component: <StageManagement />,
          }),
        },
        { path: "edit-stage/:stage_id", element: <EditStagePage /> },
        { path: "cycle-stage-mapping/:stage_name", element: <EditStagePage /> },

        {
          path: "rule-management",
          element: RouteAuthService({
            route: "/authorised/rule-management",
            component: <RuleManagement />,
          }),
        },
        { path: "rule-management/create-rule", element: <CreateRule /> },
        {
          path: "rule-management/update-rule/:ruleId",
          element: <CreateRule />,
        },
        { path: "rule-management/role-mapping", element: <RuleRoleMapping /> },

        {
          path: "campaign-management",
          element: RouteAuthService({
            route: "/authorised/campaign-management",
            component: <CampaignManagement />,
          }),
        },
        { path: "update/:campaignId", element: <UpdateCampaign /> },
        { path: "batch-table", element: <Mobile_BatchTable /> },
        { path: "listing-details/:leadId", element: <ListingDetail /> },
        {
          path: "source-management",
          element: RouteAuthService({
            route: "/authorised/source-management",
            component: <SourceManagement />,
          }),
        },
        { path: "add-source", element: <AddNewSourcePage /> },
        { path: "add-sub-source", element: <AddSubSource /> },

        {
          path: "source-listing",
          element: <SourceListing />,
        },
        { path: "add-pricematrix-source", element: <AddPriceMatrixSource /> },
        {
          path: "add-pricematrix-source/:id",
          element: <AddPriceMatrixSource />,
        },
        {
          path: "sub-source-listing",
          element: <SubSourceListing />,
        },
        {
          path: "add-pricematrix-sub-source",
          element: <AddPriceMatrixSubSource />,
        },
        {
          path: "add-pricematrix-sub-source/:id",
          element: <AddPriceMatrixSubSource />,
        },

        { path: "matrix-campaign", element: <MatrixCampaign /> },
        { path: "matrix-campaign/:id", element: <MatrixCampaign /> },
        { path: "matrix-campaign-list", element: <MatrixCampaignListing /> },

        { path: "service-management", element: <ServiceManagement /> },
        { path: "service-management-form", element: <ServiceManagementForm /> },

        {
          path: "lead-sub-source/:source_id",
          element: <LeadSubSourceListing />,
        },

        { path: "AddActivity/:id", element: <AddActivity /> },
        { path: "update-activity", element: <UpdateActivity /> },
        { path: "form/:id", element: <ActivityForm /> },

        {
          path: "task-management",
          element: RouteAuthService({
            route: "/authorised/task-management",
            component: <ManageTask />,
          }),
        },
        { path: "add-task", element: <AddTask /> },
        { path: "update-task/:id", element: <AddTask /> },
        { path: "revenue", element: <Revenue /> },
        { path: "task-details", element: <TaskDetails /> },
        { path: "pending-task", element: <PendingTask /> },
        { path: "manage-stage-status", element: <ManageStageStatus /> },
        { path: "manage-stage-rule-mapping", element: <RuleMapping /> },
        { path: "taskActivity-mapping", element: <TaskActivityMapping /> },
        { path: "add-taskActivity", element: <AddTaskActivity /> },
        { path: "my-calendar/events", element: <ShowALLTask /> },
        { path: "my-calendar", element: <MyCalendar /> },

        {
          path: "dashboard",
          element: RouteAuthService({
            route: "/authorised/dashboard",
            component: <Dashboard />,
          }),
        },
        { path: "order-details", element: <OrderDetails /> },
        { path: "apply-request-management", element: <ApplyRequestPage /> },
        {
          path: "approver-request-management",
          element: <ApprovalRequestManagement />,
        },
        { path: "request-details/:request_id", element: <RequestDetails /> },
        { path: "create-order", element: <CreateOrder /> },
        { path: "collect-payment", element: <CollectPayment /> },
        { path: "order-number", element: <OrderNumber /> },
        {
          path: "activity-form-mapping-management",
          element: <ActivityFormMappingManagement />,
        },
        { path: "subject-management", element: <SubjectManagement /> },
        {
          path: "customer-response-management",
          element: <CustomerResManagement />,
        },
        {
          path: "reason-for-disqualification-management",
          element: <ReasonForDisqualificationManagement />,
        },
        { path: "pending_events", element: <EventPendingTask /> },
        { path: "event_summary", element: <EventSummary /> },
        { path: "mobile-dnd", element: <MobileDndManagement /> },
        { path: "config-details", element: <ConfigDetails /> },
        { path: "myorders", element: <MyOrders /> },
        { path: "lead-detail", element: <LeadName /> },
        { path: "all-activity", element: <ViewTask /> },
        { path: "lead-view", element: <LeadDetail /> },
        { path: "lead-profile/:leadId", element: <LeadListing /> },
        { path: "refurbish-leads", element: <RefurbishLeads /> },
        { path: "territory-listing", element: <TerritoryMappingManagement /> },
        { path: "create-territory", element: <CreateOrEditTerritory /> },
        {
          path: "updateTerritory/:territoryId",
          element: <CreateOrEditTerritory />,
        },
        {
          path: "campaign-tracking/:leadId/:interest",
          element: <CampaignTracking />,
        },
        { path: "my-team", element: <MyTeam /> },
        {
          path: "campaign-tracking/:leadId/:interest",
          element: <CampaignTracking />,
        },
        { path: "add-school", element: <AddSchool /> },

        { path: "school-details/:school_id", element: <SchoolDetail /> },
        {
          path: "interest-details/:school_id/:interest_id",
          element: <SchoolDetail />,
        },
        { path: "school-list", element: <SchoolList /> },
        { path: "coupan-request/:leadId", element: <CoupanRequestModal /> },
        { path: "special-coupon-request", element: <BulkCouponRequest /> },
        { path: "approval-mapping", element: <ApprovalMappingManagement /> },
        { path: "create-approval-mapping", element: <CreateApprovalMapping /> },
        {
          path: "update-approval-mapping/:mappingId",
          element: <CreateApprovalMapping />,
        },
        { path: "claim-master-list", element: <ClaimMasterList /> },
        { path: "create-claim", element: <CreateOrEditClaimMaster /> },
        { path: "update-claim/:claimId", element: <CreateOrEditClaimMaster /> },
        { path: "user-claim-finance", element: <UserClaimFinance /> },
        {
          path: "user-claim-finance/:requestedBy",
          element: <UserClaimFinance />,
        },
        {
          path: "user-claim-finance/:requestedBy/:fromDate/:toDate",
          element: <UserClaimFinance />,
        },
        {
          path: "update-userClaim/:userClaimId",
          element: <CreateOrEditUserClaim />,
        },
        { path: "add-claim", element: <MyClaim /> },
        { path: "myClaim-list", element: <MyClaimsList /> },
        { path: "crm-master", element: <CrmMasterManagement /> },
        { path: "crm-field-master", element: <CrmFieldMasterManagement /> },
        { path: "add-activity", element: <SchoolActivityForm /> },
        { path: "claim-dashboard", element: <ClaimDashboard /> },
        { path: "target-management", element: <TargetManagement /> },
        { path: "targetDetails/:roleName/:range", element: <TargetDetails /> },
        { path: "user-details/:roleName/:range", element: <TargetDetails /> },
        { path: "add-price-matrix", element: <PriceMatrix /> },
        { path: "edit-matrix", element: <EditPriceMatrix /> },
        { path: "matrix-list", element: <MatrixList /> },
        { path: "matrix-details", element: <PricingEngineDetails /> },

        { path: "target-assign/:roleName/:range", element: <TargetAssign /> },

        { path: "finance-dashboard", element: <FinanceDashboard /> },

        {
          path: "approver-request-management/:requestedBy",
          element: <ApprovalRequestManagement />,
        },

        {
          path: "approver-request-management/:requestedBy/:fromDate/:toDate",
          element: <ApprovalRequestManagement />,
        },
        {
          path: "request-details/:request_id/:requestedBy",
          element: <RequestDetails />,
        },
        {
          path: "school-dashboard",
          element: RouteAuthService({
            route: "/authorised/school-dashboard",
            component: <B2BSchoolDashboard />,
          }),
        },
        { path: "missed-meetings", element: <MissedMeetingsPage layoutType="inner" /> },
        { path: "UploadTDS", element: <Tds /> },
        { path: "DscUpload", element: <DscUpload /> },
        { path: "DscList", element: <DscList /> },
        { path: "Ledgerlist", element: <Ledgerlist /> },
        { path: "EditLedger", element: <EditLedger /> },
        { path: "PendingTasks", element: <PendingTasks /> },



        { path: 'lead-interest', element: <LeadInterest /> },
        { path: 'logActivity', element: <LogDayActivity /> },
        { path: 'raise-claim', element: <RaiseClaim /> },
        { path: 'hardware-part-list', element: <HardwarePartList /> },
        { path: 'hardware-part-form', element: <HardwarePartForm /> },
        { path: 'hardware-part-form/:id', element: <HardwarePartForm /> },
        { path: 'hardware-part-variant-list', element: <HardwarePartVariantList /> },
        { path: 'hardware-part-variant-form', element: <HardwarePartVariantForm /> },
        { path: 'hardware-part-variant-form/:id', element: <HardwarePartVariantForm /> },
        { path: 'hardware-bundle-list', element: <HardwareBundleList /> },
        { path: 'hardware-bundle-form', element: <HardwareBundleForm /> },
        { path: 'hardware-bundle-form/:id', element: <HardwareBundleForm /> },
        { path: 'hardware-bundle-variant-form', element: <HardwareBundleVariantForm /> },
        { path: 'hardware-bundle-variant-form/:id', element: <HardwareBundleVariantForm /> },
        { path: 'hardware-bundle-variant-list', element: <HardwareBundleVariantList /> },
        { path: 'package-list', element: <ManagePackageHeader /> },
        { path: 'package-form', element: <PackageManagement /> },
        { path: 'package-form/:id', element: <PackageManagement /> },
        { path: 'purchase-order-list', element: <PurchaseOrderManagement /> },
        { path: 'purchase-order-details', element: <PurchaseOrderDetailManagement /> },

        { path: "quotation-mapping-list", element: <QuotationMappingList /> },
        { path: "quotation-mapping-form", element: <QuotationMappingForm /> },
        {
          path: "quotation-mapping-form/:id",
          element: <QuotationMappingForm />,
        },
        { path: "quotation-list", element: <QuotationTable /> },
        //  { path: "ImplementationSSRTeam", element: <ImplementationSSRTeam /> },

        { path: "quotation-detail", element: <QuotationDetailForm /> },
        { path: "quotation-upload-po", element: <PurchaseOrderUpload /> },

        { path: "add-approval", element: <AddApprovalMatrix /> },
        { path: "update-approval/:id", element: <AddApprovalMatrix /> },
        { path: "list-approvals", element: <ApprovalListing /> },
        { path: "sales-approval-list", element: <SalesApprovalListing /> },
        { path: "approval-dashboard", element: <SalesDashboard /> },
        { path: "sales-approval-details/:id", element: <SalesApprovalDetail /> },

        { path: "add-quotation", element: <AddQuotation /> },
        { path: "implementation-form", element: <ImplementationForm /> },
        { path: "implementationList", element: <ImplementationList /> },
        { path: "implementationDetail", element: <ImplementationDetailPage /> },
        { path: "site-survey/:impFormNumber", element: <ImplementationSurveyDetail /> },
        { path: "quotation-approval", element: <QuotationDetailPage /> },
        { path: 'claim-list', element: <ClaimList /> },
        { path: 'applied-list', element: <AppliedList /> },
        { path: 'site-survey-list', element: <SiteSurveyListing /> },
        { path: 'site-survey-detail/:siteSurveyCode', element: <SiteSurveyDetail /> },
        { path: 'site-survey-dash/:impFormNumber', element: <SiteSurveyDash /> },
        { path: 'generate-invoice-list', element: <GenerateInvoiceList /> },
        { path: 'failed-invoice-list', element: <FailedInvoiceList /> },
        { path: 'generated-invoice-list', element: <GeneratedInvoiceList /> },
        { path: "activated-school-list", element: <ActivatedSchoolTable /> },
        { path: "edit-activated-school", element: <EditActivatedSchool /> },
        { path: "edit-implementation-form", element: <EditImplementation /> },
        { path: 'generate-schedule', element: <GenerateSchedule /> },
        { path: 'create-schedule', element: <CreateSchedule /> },
        { path: 'edit-quotation', element: <EditQuotation /> },
        { path: 'voucher-list', element: <VoucherManagement /> },
        { path: 'add-voucher', element: <VoucherForm /> },
        { path: "voucher-details", element: <VoucherDetails /> },
        { path: "voucher-update", element: <VoucherUpdate /> },
        { path: 'generate-hardware-invoice', element: <CreateHardwareInvoices /> },
        { path: 'hardware-invoices-list-generated', element: <GeneratedOrSavedHardwareInvoices /> },
        { path: 'hardware-invoices-list-saved', element: <GeneratedOrSavedHardwareInvoices /> },
        { path: 'office-invoices-list-saved', element: <GeneratedOrSavedOfficeInvoice /> },
        { path: 'office-invoices-list-generated', element: <GeneratedOrSavedOfficeInvoice /> },
        { path: 'cancelled-hardware-invoices', element: <CancelledHardwareInvoices /> },
        { path: 'cancelled-office-invoices', element: <CancelledOfficeInvoices /> },
        { path: 'fill-hardware-invoice/:impFormCode', element: <FillOrEditInvoiceDetails /> },
        { path: 'fill-office-invoice', element: <FillOrEditInvoiceDetails /> },
        { path: 'update-invoice/:impFormCode', element: <FillOrEditInvoiceDetails /> },
        { path: 'update-office-invoice/:invoiceCode', element: <FillOrEditInvoiceDetails /> },
        { path: 'quotation', element: <QuotationDetail /> },
        { path: 'manage-payments', element: <PaymentListView /> },
        { path: 'manage-payments/details-form/:id', element: <PaymentDetailsForm /> },
        { path: 'manage-payments/adjustment-form/:id', element: <PaymentAdjustmentForm /> },
        { path: 'pending-collection-approval', element: <PendingApprovalListView /> },
        { path: 'pending-collection-approval/adjustment-form/:school_code/:deposit_auto_id', element: <PendingApprovalAdjustmentForm /> },
        { path: 'finance-payment-approval', element: <FinanceApprovalListView /> },
        { path: 'finance-payment-approval/adjustment-form/:school_code/:deposit_auto_id', element: <FinanceApprovalAdjustmentForm /> },
        { path: 'payment-deposit-cases', element: <PaymentDepositCases /> },
        { path: 'purchase-order', element: <PurchaseOrder /> },
        { path: 'site-survey-activity', element: <SiteSurveyActivityList /> },
        { path: 'collection-detail/:schoolCode', element: <CollectionDetail /> },
        { path: 'collection-notify/:id', element: <CollectionNotification /> },
        { path: 'quotation-detail/:id', element: <QuotationView /> },
        { path: 'schedule-list', element: <ScheduleList /> },
        { path: 'nps-list', element: <NpsListing /> },
        { path: 'pending-collection', element: <PendingCollectionList /> },

        { path: 'generate-addendum', element: <GenerateAddendum /> },
        { path: 'pending-addendum-list', element: <PendingAddendumList /> },
        { path: 'view-addendum-details/:id', element: <AddendumDetail /> },
        { path: 'edit-addendum-details/:id', element: <EditAddendumDetails /> },

        // { path: 'pending-addendum-list/:id', element: <AddendumDetail/> },

        { path: 'create-checksheet', element: <CheckSheetDetail /> },
        { path: 'invoiced-detail', element: <DoDInvoiced /> },
        { path: 'add-QC/:impCode', element: <QcImplementForm /> },
        { path: 'QC-List', element: <QcListing /> },
        { path: 'CheckSheet-List', element: <CheckSheetList /> },
        { path: 'schedule-detail', element: <ScheduleDetail /> },
        { path: 'QC-detail/:impCode', element: <QcDetailView /> },
        { path: 'ledger-list', element: <LedgerListDetail /> },
        { path: 'hardware-QCActivity', element: <HardwareQCList /> },
        { path: 'ssr-approved-list', element: <SiteApprovedList /> },
        { path: 'ledger-detail/:schoolCode', element: <SchoolLedgerDetail /> },
        { path: 'update-software-invoice', element: <UpdateSoftwareInvoiceList /> },
        { path: 'update-software-invoice/:id', element: <UpdateSoftwareInvoiceForm /> },
        { path: 'hardware-voucher-list', element: <HardwareVoucherManagement /> },
        { path: 'hardware-voucher-form', element: <HardwareVoucherForm /> },
        { path: 'hardware-voucher-details', element: <HardwareVoucherDetails /> },
        { path: 'hardware-voucher-update', element: <HardwareVoucherUpdate /> },
        { path: "hardware-ssr-list", element: <HardwareSiteSurveyList /> },
        { path: "hardware-qc-list", element: <HardwareQualityList /> },
        { path: 'software-invoice-email', element: <InvoiceEmail /> },
        { path: 'quality-list', element: <AssignQCList /> },
        { path: 'rejected-cases', element: <RejectedCases /> },
        { path: 'hardware-ssr-task', element: <SiteSurveyTask /> },
        { path: 'hardware-qc-task', element: <QualityCheckTask /> },
        { path: 'role-dashboard', element: <RoleDashboard />},
      ],
    },
    { path: "404", element: <NotFound /> },
    { path: "/login", element: <Login /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/reset-password", element: <ResetPassword /> },
    { path: "/unauthorised", element: <NotAuthorised isOpen={true} /> },
    { path: "/logout", element: <Logout /> },
    {
      path: "*",
      element: checkLoggedIn() ? (
        <Navigate to="/authorised/school-dashboard" replace />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
  ]);
}
