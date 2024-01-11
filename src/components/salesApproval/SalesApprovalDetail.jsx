import React, { useEffect, useState } from "react";
import Page from "../../components/Page";
import {
  Button,
  Grid,
  TextField,
  Box,
  Typography,
  Modal,
  Fade,
  Breadcrumbs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import QuotationDetailForm from "../../pages/Quotation/QuotationDetailForm";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { acceptApprovalRequest, rejectApprovalRequest, updateTypeStatus } from "../../config/services/salesApproval";
import toast from "react-hot-toast";
import PurchaseOrderDetail from "../purchaseOrder/PurchaseOrderDetail";
import ScheduleDetail from "../../pages/ScheduleDetail";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import { SchoolDetailBox } from "../Quotation/SchoolDetailBox";
import IconBreadcrumbArrow from "./../../assets/icons/icon-breadcrumb-arrow.svg";
import { ReactComponent as IconDropdown } from "./../../assets/icons/icon-dropdown-2.svg";
import EditAddendumDetails from "../Collection Process/EditAddendumDetails";
import { scheduleActions } from "../../redux/reducers/invoiceSchdeuler";


const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'auto'
  },
  modalPaper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #fff',
    boxShadow: '0px 0px 4px #0000001A',
    minWidth: '300px',
    borderRadius: '4px',
    textAlign: 'center',
    padding: "20px"
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginTop: "10px",
    marginBottom: "40px",
    textAlign: 'centre'
  },
  cusCard: {
    padding: "18px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
    margin: "0.5rem 1rem",
  },
  approvalBtn: {
    width: "200px",
    backgroundColor: "#f45e29",
    margin: "30px",
    border: "1px solid #f45e29",
    borderRadius: "4px !important",
    color: "#ffffff !important",
    padding: "6px 16px !important",
    textDecoration: 'none',
    "&:hover": {
      color: "#f45e29 !important",
      background: '#fff !important'
    },
  },
}));

const SalesApprovalDetail = () => {

  const classes = useStyles();
  const dispatch = useDispatch();
  const invoiceSchedule = useSelector((state) => state.invoiceSchedule);
  const navigate = useNavigate()
  const [approvalLevel, setApprovalLevel] = useState()
  const [rowData, setRowData] = useState()
  const [remarks, setRemarks] = useState([])
  const [newRemark, setNewRemark] = useState()
  const location = useLocation();
  let [isModel, setIsModel] = useState(false)
  const item = location.state;
  // const rowObj = item.rowData
  const { id } = useParams()
  const [currLevel, setCurrLevel] = useState()
  const [actionType, setActionType] = useState()
  const [isPending, setIsPending] = useState(false)
  const [adjustActive, setAdjustActive] = useState(false)
  const [approvalType, setApprovalType] = useState()
  const userData = JSON.parse(localStorage.getItem('userData'))
  const loginData = JSON.parse(localStorage.getItem('loginData'))
  const salesApprovalState = useSelector((state) => state.salesApprovalState)
  const [schoolDetails, setSchoolDetails] = useState(null);
  const approvalTypes = ["Invoice & Collection Schedule (Raise NPS)", "Generate Addendum"]
  const type = {
    "Quotation Actual": "Quotation",
    "Quotation Demo": "Quotation",
    "PO": "Purchase Order",
    "Invoice & Collection Schedule (Raise NPS)": "NPS"
  }

  useEffect(() => {
    if (item !== undefined) {
      const levelIndex = item?.approvalLevels.findIndex((obj) => obj.profileName === item?.rowData?.relevantId);
      const level = item?.approvalLevels[levelIndex]
      setCurrLevel(levelIndex)
      setApprovalLevel(level)
      const remarksArray = [item?.rowData?.remarks]
      setRemarks(remarksArray)
      setRowData(item?.rowData)
      const status = (item?.rowData?.status === "Pending") ? true : false
      setIsPending(!status)
      if (!status) setNewRemark(item?.rowData?.remarks[levelIndex])
      setApprovalType(item?.rowData?.approvalType)
    }
  }, [item])

  const handleAction = async (type) => {
    if(invoiceSchedule && invoiceSchedule?.type==='view' && type === 'Adjust'){
      dispatch(scheduleActions.updateType({ type: 'edit' }));
      setAdjustActive(true)
      return
    }
    setIsModel(true)
    setActionType(type)
  }

  const getSchoolData = (data) => {
    setSchoolDetails(data);
  };

  const handlePopupAction = async (type) => {

    if (type === 'cancel') {
      setIsModel(false)
      setNewRemark(null)
      return
    } else if (!newRemark) {
      toast.error("Please enter remark!")
      return
    }

    try {
      let response;
      switch (type) {
        case 'Approve':
          response = await acceptApprovalRequest({ approvalId: [id], remark: newRemark, uuid: loginData?.uuid, updatedObjectArray: [salesApprovalState.payloadObj] });
          break;
        case 'Reject':
          response = await rejectApprovalRequest({ approvalId: [id], remark: newRemark, uuid: loginData?.uuid, updatedObjectArray: [salesApprovalState.payloadObj] });
          break;
        case 'Adjust':
          if (item?.rowData?.approvalType === "Invoice & Collection Schedule (Raise NPS)") {
            response = await acceptApprovalRequest({ approvalId: [id], remark: newRemark, uuid: loginData?.uuid, updatedObjectArray: [salesApprovalState.payloadObj], adjust: true });
          }
          break;
        case 'Reassign':
          break;
        default:
          console.error('Invalid action type:', type);
          break;
      }

      if (response?.data?.status === 400) {
        toast.error(response?.data?.error?.errorMessage)
        navigate(-1)
      } else if (response?.data?.status === 1) {
        toast.success(response?.data?.responseData?.message)
        navigate('/authorised/sales-approval-list')
      }

    } catch (err) {
      console.log("Error :", err);
    }
  }

  const handleRemark = (e) => {
    setNewRemark(e.target.value)
  };


  useEffect(() => {
    if (item && approvalTypes.indexOf(item?.rowData?.approvalType) !== -1 && isEmpty(salesApprovalState.payloadObj)) {
      if(invoiceSchedule?.type === 'view') {
        setIsPending(false)
      }
      else if(invoiceSchedule?.type === 'edit') {
        setIsPending(true) 
      }
      else setIsPending(true)

    } else {
      setIsPending(false)
    }
  }, [salesApprovalState, invoiceSchedule?.type])
  
  return (
    <>
      <Page
        title="Sales Approval Detail | Extramarks"
        className="crm-page-wrapper crm-page-approvals-list"
      >
        <div className="crm-space-between mb-2">
          <div>
            <Breadcrumbs
              className="crm-breadcrumbs m-0"
              separator={<img src={IconBreadcrumbArrow} />}
              aria-label="breadcrumbs"
            >
              <Link
                underline="hover"
                key="1"
                color="inherit"
                to={`/authorised/school-details/${schoolDetails?.leadId}`}
                className="crm-breadcrumbs-item breadcrumb-link"
              >
                {rowData?.schoolName ?? rowData?.school_code}
              </Link>

              <Typography
                key="3"
                component="span"
                className="crm-breadcrumbs-item breadcrumb-active"
              >
                {type[rowData?.approvalType]}
              </Typography>
            </Breadcrumbs>
          </div>
          {/* <div className="align-right">
            <Button className="crm-btn crm-btn-outline mr-1"
              onClick={() => null}
              >Download Payment Proof</Button>
            <Button className="crm-btn"
              onClick={() => null}
              >Download PO</Button>
          </div> */}
        </div>

        <Box >

            <SchoolDetailBox
              schoolCode={rowData?.schoolCode?rowData?.schoolCode:rowData?.school_code}
              getSchoolData={getSchoolData}
            />

          <Box className="">
            <Accordion className="cm_collapsable crm-page-accordion-container">
              <AccordionSummary
                expandIcon={<IconDropdown className="" />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                className="table-header"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      display: "flex",
                      gap: "15px",
                    }}
                  >
                    {type[rowData?.approvalType]}
                  </Typography>

                </div>
              </AccordionSummary>
              <AccordionDetails className="listing-accordion-details">
                {(() => {
                  switch (approvalType) {
                    case 'PO':
                      return <PurchaseOrderDetail code={rowData?.referenceCode} />;
                    case 'Quotation Demo':
                    case 'Quotation Actual':
                      return <QuotationDetailForm isQuotationID={rowData?.referenceCode} />;
                    case 'Invoice & Collection Schedule (Raise NPS)':
                      return <ScheduleDetail rowObj={rowData} isApprovalFlow={true} />;
                    case 'Generate Addendum':
                      return <EditAddendumDetails rowData={rowData} isApprovalFlow={true} />;

                  }
                })()}
              </AccordionDetails>
            </Accordion>
          </Box>

          <Grid container spacing={2.5} >
            <Grid item xs={12}>

            </Grid>

            <Grid item xs={12} >
              <TextField
                className="crm-form-textarea"
                fullWidth
                value={newRemark ?? ''}
                onChange={handleRemark}
                placeholder="Enter remarks.."
                multiline
                minRows="3"
                disabled={isPending}
                InputProps={{
                  disableUnderline: true,
                  style: {
                    // boxShadow: "0px 0px 8px #00000029",
                    outline: 'none'
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "30px",
            gap: "20px",
          }}
        >

          {approvalLevel?.isReject && (
            <Button className="crm-btn crm-btn-outline crm-btn-lg" disabled={isPending} onClick={() => handleAction('Reject')} >
              Reject
            </Button>
          )}
          {approvalLevel?.isReassign && (
            <Button className="crm-btn crm-btn-outline  crm-btn-lg" disabled={isPending} onClick={() => handleAction('Reassign')}>
              Reassign
            </Button>
          )}
          {approvalLevel?.isAdjust && (
            <Button className={`crm-btn ${adjustActive ? 'crm-btn-lg' : 'crm-btn-outline crm-btn-lg'}`} disabled={isPending} onClick={()=>handleAction('Adjust')}>
              Adjust
            </Button>
          )}
          {approvalLevel?.isApprove && !adjustActive && (
            <Button className="crm-btn  crm-btn-lg" disabled={isPending} onClick={()=>handleAction('Approve')}>
              Approve
            </Button>
          )}
        </Box>

        {isModel && <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={isModel}
          closeAfterTransition
        >
          <Fade in={isModel}>
            <div className={classes.modalPaper + " modal-box modal-md"} id="transition-modal-title">
              <div>
                <div className="crm-modal-header-title align-center">Are you sure you want to {actionType} this  {type[rowData?.approvalType]}?</div>
                <div>
                  <TextField
                    fullWidth
                    value={newRemark}
                    onChange={handleRemark}
                    placeholder="Enter remarks.."
                    multiline
                    inputProps={{ maxLength: 250 }}
                    minRows="3"
                    InputProps={{
                      disableUnderline: true,
                      style: {
                        // boxShadow: "0px 0px 8px #00000029",
                        outline: 'none'
                      },
                    }}
                  />
                  <div style={{ marginBottom: 0, marginRight: 0 }} className="modal-footer align-right">
                    <Button onClick={() => handlePopupAction('cancel')} className="crm-btn crm-btn-outline mr-1" color="primary" variant="outlined">Cancel</Button>
                    <Button onClick={() => handlePopupAction(actionType)} color="primary" autoFocus className="crm-btn" variant="contained">{actionType}</Button>

                  </div>
                </div>
              </div>
            </div>
          </Fade>
        </Modal>}
      </Page>
    </>
  );
};

export default SalesApprovalDetail;
