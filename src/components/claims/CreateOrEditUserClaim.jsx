import React, { useEffect, useState } from "react";
import {
  getUserClaimDetails,
  updateUserClaim,
} from "../../config/services/userClaim";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import DownloadIcon from "../../assets/image/downloadIcon.svg";
import _ from "lodash";
import { toast } from "react-hot-toast";
import moment from "moment";
import { Button, Fade, Grid, Modal, TextField, Typography } from "@mui/material";
import { useStyles } from "../../css/ClaimForm-css";
import { handleKeyDown, handlePaste } from "../../helper/randomFunction";

const CreateOrEditUserClaim = () => {
  const [schoolCode, setSchoolCode] = useState("");
  const [dataToAdd, setDataToAdd] = useState({});
  const [schoolName, setSchoolName] = useState("");
  const [visitNumber, setVisitNumber] = useState("");
  const [purposeOfVisit, setPurposeOfVisit] = useState("");
  const [dateOfVisit, setDateOfVisit] = useState(null);
  const [timeIn, setTimeIn] = useState("");
  const [timeOut, setTimeout] = useState("");
  const [typeOfExpense, setTypeOfExpense] = useState("");
  const [amount, setAmount] = useState("");
  const [uploadBill, setUploadBill] = useState("NA");
  const [uploadBillUrl, setUploadBillUrl] = useState("");
  const [approvedAmount, setApprovedAmount] = useState("");
  const [unit, setUnit] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isModel,  setIsModel] = useState(false);
  const [modifiedBy] = useState(
    JSON.parse(localStorage.getItem("userData"))?.username
  );
  const { userClaimId } = useParams();
  const navigate = useNavigate();
  const classes = useStyles();
  const location = useLocation();
  const urlString = location?.state?.url;
  const item = location.state?.row;
  const [actionType, setActionType] = useState('')

  useEffect(() => {
    console.log(item)
    if(item){
      let index = item?.billFile?.lastIndexOf("/");
        setSchoolCode(item?.School_Code);
        setSchoolName(item?.School_Name);
        setVisitNumber(item?.Visit_Number);
        setPurposeOfVisit(item?.Visit_Purpose);
        setDateOfVisit(moment.utc(item?.Visit_Date).format("DD-MM-YYYY"));
        setTimeIn(moment.utc(item?.Visit_Time_In).format("HH:mm A"));
        setTimeout(moment.utc(item?.Visit_Time_Out).format("HH:mm A"));
        setTypeOfExpense(item?.Expense_type);
        setUnit(item?.Unit);
        setAmount(item?.Claim_Amount);
        setUploadBillUrl(item?.billFile);
        setApprovedAmount(item?.Claim_Amount);
        if (index !== -1) {
          setUploadBill(item?.billFile?.substring(index + 1));
        }
    }
  }, [item]);

  const getUserClaimDetail = async () => {
    try {
      const res = await getUserClaimDetails(userClaimId);
      if (res?.result?.length > 0) {
        const data = res.result[0];
        let billUrl = data?.billFile;
        let index = billUrl?.lastIndexOf("/");
        setSchoolCode(data?.schoolCode);
        setSchoolName(data?.schoolName);
        setVisitNumber(data?.visitNumber);
        setPurposeOfVisit(data?.visitPurpose);
        setDateOfVisit(moment.utc(data?.visitDate).format("DD-MM-YYYY"));
        setTimeIn(moment.utc(data?.visitTimeIn).format("HH:mm A"));
        setTimeout(moment.utc(data?.visitTimeOut).format("HH:mm A"));
        setTypeOfExpense(data?.expenseType);
        setUnit(data?.unit);
        setAmount(data?.claimAmount);
        setUploadBillUrl(data?.billFile);
        setApprovedAmount(data?.approvedAmount);
        if (index !== -1) {
          setUploadBill(billUrl?.substring(index + 1));
        }
      }
    } catch (error) {
      console.error(error, "error while fetching claim details");
    }
  };

  const handleApprovedAmount = (e) => {
    setApprovedAmount(e.target.value);
  };

  const handleDownload = (e) => {
    toast.success("Bill downloaded successfully");
  };

  const handleUrl = () => {
    let indexOfAuthorised = urlString?.indexOf('/authorised')
    let urlSubString = urlString?.substring(indexOfAuthorised)
    if (urlSubString) {
      return urlSubString
    }
    else
      navigate(-1)
      //return "/authorised/user-claim-finance"
  }

  const handleCancel = () => {
    let backUrl = handleUrl()
    navigate(backUrl)
  };

  const handleUpdate = (type) => {
    if (!approvedAmount && type==='APPROVE') {
      toast.error("Fill Approved Amount");
      return;
    }
    if (approvedAmount > amount && type==='APPROVE') {
      toast.error('Approved amount can not be greater than claim amount')
      return
    }
    if (approvedAmount > amount && type==='APPROVE') {
      toast.error("Approved Amount can not be greater than Claim Amount")
      return
    }
    setIsModel(true)
    setActionType(type)
  }

  const handlePopupAction = (type) => {
    if(type === 'CANCEL') {
      setIsModel(false)
      setRemarks('')
      return 
    }
    let filledDetails = _.cloneDeep(dataToAdd)
    filledDetails._id = userClaimId
    filledDetails.approvedAmount = approvedAmount ?? 0;
    filledDetails.modifiedBy = modifiedBy;
    filledDetails.approvedDate = new Date();
    filledDetails.remarks = remarks
    filledDetails.claimStatus = type==='APPROVE' ? "APPROVED" : "REJECTED";
    filledDetails.claimId = item?.claimId
    editUserClaim(filledDetails);
  };


  const editUserClaim = async (data) => {
    try {
      const res = await updateUserClaim(data);
      let backUrl = handleUrl();
      toast.success(res?.message);
      navigate('/authorised/claim-list')
    } catch (err) {
      console.error(err, "...error");
      toast.error("An error occurred. Please try again later.");
    }
  };

  const handleRemark = (e) => {
    setRemarks(e.target.value)
  };

  useEffect(() => {
    getUserClaimDetail();
  }, []);

  return (
    <>
      <Grid className={classes.cusCard}>
        <Grid container spacing={3} sx={{ pt: "8px", pb: "24px" }}>
          <Grid item xs={12}>
            <Typography className={classes.title}>My Claims</Typography>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>School Code</Typography>
              <input
                className={classes.inputStyle}
                type="text"
                value={schoolCode}
                readOnly={true}
              />
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>School Name</Typography>
              <input
                className={classes.inputStyle}
                type="text"
                value={schoolName}
                readOnly={true}
              />
            </Grid>
          </Grid>
          {!item && <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>Visit Number</Typography>
              <input
                className={classes.inputStyle}
                type="text"
                value={visitNumber}
                readOnly={true}
              />
            </Grid>
          </Grid>}
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>Purpose of Visit</Typography>
              <input
                className={classes.inputStyle}
                type="text"
                value={purposeOfVisit}
                readOnly={true}
              />
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>Date of Visit</Typography>
              <input
                className={classes.inputStyle}
                type="text"
                value={dateOfVisit}
                readOnly={true}
              />
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>Time (In)</Typography>
              <input
                className={classes.inputStyle}
                type="text"
                value={timeIn}
                readOnly={true}
              />
            </Grid>
          </Grid>
          {!item && <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>Time (Out)</Typography>
              <input
                className={classes.inputStyle}
                type="text"
                value={timeOut}
                readOnly={true}
              />
            </Grid>
          </Grid>}
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>Type Of Expense</Typography>
              <input
                className={classes.inputStyle}
                type="text"
                value={typeOfExpense}
                readOnly={true}
              />
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>Amount</Typography>
              <input
                className={classes.inputStyle}
                type="text"
                value={amount}
                readOnly={true}
              />
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>Unit</Typography>
              <input
                className={classes.inputStyle}
                type="text"
                value={unit}
                readOnly={true}
              />
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>Upload Bill</Typography>
              <input
                className={classes.inputStyle}
                type="text"
                value={uploadBill}
                readOnly={true}
              />
              {uploadBill != 'NA' &&
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10pxp' }}>
                  <img className='dndIcon' src={DownloadIcon} alt="" style={{ width: '20px', height: '20px' }} />
                  <a style={{
                    cursor: 'pointer', color: 'rgb(68, 130, 255)', lineHeight: '19px', fontSize: '17px', whiteSpace: 'nowrap', fontWeight: '600', textDecorationColor: 'rgb(68, 130, 255)', marginRight: '5px', marginLeft: '10px'
                  }} href={uploadBillUrl} target='_blank' onClick={handleDownload}>Download</a>
                </div>
              }
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>Approved Amount</Typography>
              <input
                className={classes.inputStyle}
                type="number"
                value={approvedAmount}
                onChange={handleApprovedAmount}
                placeholder='Enter Approved Amount'
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <div style={{ display: 'flex', justifyContent: 'right' }}>
        <Grid className={classes.btnSection}>
          <Button className={classes.submitBtn} onClick={handleCancel} style={{marginRight: '10px'}}>Cancel</Button>
        </Grid>
        <Grid className={classes.btnSection}>
          <Button className={classes.submitBtn} onClick={() => handleUpdate('APPROVE')} style={{marginRight: '10px'}}>Approve</Button>
        </Grid>
        <Grid className={classes.btnSection}>
          <Button className={classes.submitBtn} onClick={() => handleUpdate('REJECT')} style={{marginRight: '15px'}}>Reject</Button>
        </Grid>
      </div>

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
                            <div className={classes.modalTitle}>Are you sure you want to {actionType} the claims?</div>
                            <div>
                                <TextField
                                fullWidth
                                value={remarks} 
                                onChange={handleRemark} 
                                multiline
                                minRows="3"
                                InputProps={{
                                  disableUnderline: true,
                                  style: {
                                    boxShadow: "0px 0px 8px #00000029",
                                    outline: 'none'
                                  },
                                }}
                                />
                                <div style={{ marginBottom: 0, marginRight: 0, display:"flex", justifyContent:"space-around" }} className="modal-footer">
                                    <Button onClick={()=> handlePopupAction(actionType)} color="primary" autoFocus className={classes.submitBtn } variant="outlined">{actionType}</Button>
                                    <Button onClick={()=> handlePopupAction('CANCEL')} className={classes.submitBtn} color="primary" variant="outlined">Cancel</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fade>
            </Modal>}
    </>
  );
};

export default CreateOrEditUserClaim;
