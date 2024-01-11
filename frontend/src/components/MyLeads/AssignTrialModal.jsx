import React, { useState, useEffect } from "react";
import { Grid, Modal, Box, Typography, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ReactSelect from "react-select";
import md5 from "md5";
import _ from 'lodash';
import toast from "react-hot-toast";
import LoadingButton from '@mui/lab/LoadingButton';
import CrossIcon from "../../assets/image/crossIcn.svg";
import BredArrow from "../../assets/icons/icon-folder-remove.svg";
import FileIcon from "../../assets/icons/trial-file-icon.svg";
import FileError from "../../assets/icons/trial-file-error.svg";
import IconGreenTick from "../../assets/icons/trial-tick-icon.svg";
import { getBoardList, getChildList, getProductList, getBatchList, trialFormSubmit } from "../../config/services/lead";
import settings from "../../config/settings";
import { createRequest } from "../../config/services/approvalRequest";
import CubeDataset from "../../config/interface"

const useStyles = makeStyles((theme) => ({
  label: {
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "6px",
  },
  inputStyle: {
    fontSize: "1rem",
    padding: "8.8px",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid #DEDEDE",
  },
  submitBtn: {
    backgroundColor: "#f45e29",
    border: "1px solid #f45e29",
    borderRadius: "4px !important",
    color: "#ffffff !important",
    padding: "6px 16px !important",
    marginTop: "1.5rem",
    "&:hover": {
      color: "#f45e29 !important",
    },
  },
  crossIcon: {
    position: "absolute",
    top: "12px",
    right: "12px",
    cursor: "pointer",
  },
  iconStyle: {
    width: "3rem",
    margin: "16px auto 6px auto",
  },
}));

const ModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "calc(100% - 16px)",
  bgcolor: "background.paper",
  border: "2px solid #fff",
  boxShadow: "0px 0px 4px #0000001A",
  p: 3,
  borderRadius: "8px",
};

export default function AssignTrialModal(props) {
  const { assignModal, setAssignModal,leadObj = {}, leadProfileData, isBulk = false, bulkLeads = [] } = props;

  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("userData")));
  const [loginData, setLoginData] = useState(JSON.parse(localStorage.getItem("loginData")));
  const [alertModal, setAlertModal] = useState(false);
  const [boardList, setBoardList] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState({});
  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState({});
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [languageList, setLanguageList] = useState([])
  const [batchList, setBatchList] = useState([]);
  const [selectedbatch, setSelectedbatch] = useState({})
  const [batchData, setBatchData] = useState({})
  const [selectedLanguage, setSelectedLanguage] = useState({});
  const [freeTrialAlertDetailsMessage, setFreeTrialAlertDetails] = useState('');
  const [HidebatchAndLanguageFields, setHidebatchAndLanguageFields] = useState(true);
  const [approvalFlag, setApprovalFlag] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [noMoreTrialFlag, setNoMoreTrialFlag] = useState(false);

  const classes = useStyles();
  let selectedLeads = [];

  const { employee_code: empCode, crm_role: requestBy_roleId, name: requestBy_name, crm_profile: requestBy_ProfileName } = userData;
  const { uuid:requestBy_uuid } = loginData;
  const { TRIAL_ACTIVATION_ACTION, API_GATEWAY_API_KEY, API_GATEWAY_SALT_KEY } = settings;

  const handleOnChange = (data, name) => {
    switch (name) {
      case 'board':
        setSelectedBoard(data);
        setSelectedClass({});
        setSelectedProduct({});
        setSelectedLanguage({});
        setSelectedbatch({});
        break;
      case 'class':
        setSelectedClass(data);
        setSelectedProduct({});
        setSelectedLanguage({});
        setSelectedbatch({});
        break;
      case 'product':
        if (data?.live_class === '0') {
          setHidebatchAndLanguageFields(false);
        } else {
          setHidebatchAndLanguageFields(true)
        }
        setSelectedProduct(data);
        setSelectedLanguage({});
        setSelectedbatch({});
        break;
      case 'language':
        setSelectedLanguage(data);
        setBatchList(batchData[data?.label]);
        setSelectedbatch({});
        break;
      case 'batch':
        setSelectedbatch(data);
        break;
    }
  }

  const trialInfoCreator  = () =>{
    return {
      requestBy_roleId,
      requestBy_name,
      requestBy_uuid,
      requestBy_ProfileName,
      requestBy_empCode: empCode
    }
  }

  const handleSubmit = () => {
    if (isBulk) {
      handleBulkFormSubmit();
    } else {
      onSubmitHandler();
    }
  }

  // to reset fields values
  const resetFieldValues = () =>{
    setSelectedBoard({});
    setSelectedClass({});
    setSelectedProduct({});
    setSelectedLanguage({});
    setSelectedbatch({});
  }

  const createMetaInfo = () =>{
    return{
        Name: !isBulk ? leadObj?.name : "",
        Class: selectedClass.label,
        Board: selectedBoard.label,
        Product: selectedProduct.label,
        BatchDate: selectedbatch.label,
        BatchLanguage: selectedLanguage.label
    }
  }

  const handleBulkFormSubmit = async() =>{
    setButtonLoader(true);
    const checkSumUpdated = md5(`${API_GATEWAY_API_KEY}:${API_GATEWAY_SALT_KEY}:${empCode}`);
    let data1 = JSON.stringify({
      empcode: empCode,
      checksum: checkSumUpdated,
      action: TRIAL_ACTIVATION_ACTION,
      apikey: API_GATEWAY_API_KEY,
      trial_activation_request: createTrialActivationRequest(bulkLeads)
    });

    let new_data =  {
          trialCreatorDetails: trialInfoCreator(),
          // requestBy_roleId: requestBy_roleId,
          requestBy_empCode: empCode,
          // requestBy_name: requestBy_name,
          trialType: "bulk",
          requestType:"Trial",
          trialData: data1,
          remarks: "",
          requestStatus: "NEW",
          metaInfo: createMetaInfo(),
          selectedLeads
    }

    createRequest(new_data)
    .then((result) =>{
      if(result?.message){
        setApprovalFlag(true);
        setAlertModal(true);
      }
    })
    .catch((error) =>{
      console.error(error);
    })
    .finally(() =>{
      setAssignModal(false);
      resetFieldValues();
      setButtonLoader(false);
    })
  }

  const createTrialActivationRequest = (bulkLeads) => {
    let trialActivationBody = [];

    bulkLeads?.forEach((item) =>{
          let createdBody ={
            uuid: item?.[CubeDataset.Leadassigns.leadId],
            email: item?.[CubeDataset.Leadassigns.email] ?? "default@gmail.com",
            mobile: `+91-${item?.[CubeDataset.Leadassigns.mobile]?.slice(-10)}` ??  "",
            name: item?.[CubeDataset.Leadassigns.name],
            board_id: selectedBoard?.value ?? "",
            syllabus_id: selectedClass?.value ?? "",
            product_id: selectedProduct?.value ?? "",
            city: item?.[CubeDataset.Leadassigns.city] ?? "",
            state: item?.[CubeDataset.Leadassigns.state] ?? "",
            batch_id: selectedbatch?.batchId ?? "",
            isapproval: "No"
        }
        trialActivationBody.push(createdBody);
        selectedLeads.push(item?.[CubeDataset.Leadassigns.leadId])
    })
    return trialActivationBody;
  }

  const onSubmitHandler = () => {

            setButtonLoader(true);
            const fieldsToValidate = {
              selectedBoard,
              selectedClass,
              selectedProduct
            }
            if(validatetrialModal(fieldsToValidate)){

              let trialLeadReqBody = {
                empcode: empCode,
                action: TRIAL_ACTIVATION_ACTION,
                apikey: API_GATEWAY_API_KEY,
                trialCreatorDetails: trialInfoCreator(),
                metaInfo: createMetaInfo(),
                trialType:"single",
                trial_activation_request: [
                  {
                    uuid: leadObj?.leadId ,
                    email: leadObj?.email ?? "default@gmail.com",
                    mobile: `+91-${leadObj?.actualMobile?.slice(-10)}`?? "",
                    name: leadObj?.name,
                    board_id: selectedBoard?.value,
                    syllabus_id: selectedClass?.value,
                    product_id: selectedProduct?.value,
                    city: leadObj?.city ?? "",
                    state: leadObj?.state ?? "",
                    batch_id: selectedbatch?.batchId,
                    isapproval: "No"
                }
                ],
            };

            trialFormSubmit(trialLeadReqBody)
            .then((res) => {
               
               // this handle failed case 

                if(res?.data?.responseData?.data_array?.[0]?.msg === 'Free Trial Failed'){
                  toast.error("Free Trial Failed");
                  return
                }

                // it handles show error if trial more than 3

                if(res?.data?.error?.message){
                  setFreeTrialAlertDetails(res?.data?.error?.message);
                  setAlertModal(true);
                  setNoMoreTrialFlag(true);
                  return;
                }

                if(res?.data?.responseData){
                          // toast.success(res?.data?.responseData?.mesagges);
                          if(res?.data?.responseData?.data_array?.[0]){
                            setFreeTrialAlertDetails(res?.data?.responseData?.data_array?.[0]?.msg)
                          }

                          if(res?.data?.responseData?.message){
                            setFreeTrialAlertDetails(res?.data?.responseData?.message);
                            setApprovalFlag(true)
                          }
                          setAlertModal(true);
                }else if(res?.data?.error){
                          let message;

                          if(res?.data?.error?.errorMessage){
                            message = res?.data?.error?.errorMessage;
                          }

                          if(res?.data?.error?.errorMessage?.message){
                            message = res?.data?.error?.errorMessage?.message;
                          }

                          if(res?.data?.error?.output){
                            message = res?.data?.error?.output;
                          }
                }
              })
              .catch((err) => {
                    console.log(err, "..error");
              })
              .finally(() =>{
                setAssignModal(false);
                resetFieldValues();
                setButtonLoader(false);
              })
          }else{
             setButtonLoader(false);
          }
        
  };
  
  const validatetrialModal = (filledDetails) => {
    let { selectedBoard, selectedClass, selectedProduct } = filledDetails;

    if (_.isEmpty(selectedBoard)) {
      toast.error('Fill Board Fields!')
      return false
    }
    else if (_.isEmpty(selectedClass)) {
      toast.error('Fill Conversation Fields!')
      return false
    }
    else {
      return true;
    }
  }

  const checkDisability = (fieldName) => {

    if (fieldName === 'class') {
      if (_.isEmpty(selectedBoard)) {
        return true
      }
      return false
    }

    if (fieldName === 'product') {
      if (_.isEmpty(selectedBoard) || _.isEmpty(selectedClass)) {
        return true
      }
      return false
    }

    if (fieldName === 'selectedLanguage') {
      if (_.isEmpty(selectedLanguage)) {
        return true
      }
      return false
    }
  }

  const handleModal = () =>{
    setAlertModal(!alertModal);
    setApprovalFlag(false);
    setNoMoreTrialFlag(false);
  }

  const AlertModal = () => {
    let message = '';
    let icon = null;

    if(approvalFlag){
      message = 'Your request has been submitted for approval.';
      icon = FileIcon;
    }

    if(noMoreTrialFlag){
      message = freeTrialAlertDetailsMessage;
      icon = FileError;
    }

    if( !approvalFlag && !noMoreTrialFlag){
      if( freeTrialAlertDetailsMessage === "Free trial package already activated."){
        message = freeTrialAlertDetailsMessage;
        icon = BredArrow;
      }else{
        message = "TR-001 Successfully given";
        icon = IconGreenTick;
      }
    }


    return (
      <Modal
        hideBackdrop={true}
        open={alertModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="targetModal1"
      >
        <Box
          sx={ModalStyle}
          style={{ width: 450, padding: "40px 10px" }}
          className="modalContainer"
        >
          <img
            onClick={handleModal}
            className={classes.crossIcon}
            src={CrossIcon}
            alt="crossIcon"
          />
          <Grid className="text-center">
            <img
              className={classes.iconStyle}
              src={icon}
              alt="crossIcon"
            />
            <Typography variant="body2">
                  <Typography sx={{color: "#202124"}}>
                    {message}
                  </Typography>
            </Typography>
          </Grid>
        </Box>
      </Modal>
    )
  }

  //initially fetch data no dependency
  const getBoardListHandler = async () => {
    let params = { params: { boardStage: 1, sapVisibility: 1 } };
    getBoardList(params)
      .then((res) => {
        let boardFormattedData = [];
        res?.data?.data?.forEach((element) => {
          boardFormattedData.push({
            value: element.board_id,
            label: element.name,
          });
          setBoardList(boardFormattedData);
        });
      })
      .catch((err) => {
        if(err.response.status == 401){
          getBoardListHandler(params)
        }
        console.log(err, "..error");
      });
  };

  // it depends upon selected class
  const getClassListHandler = async () => {
    let params = { params: { boardId: selectedBoard.value, syllabusId: selectedBoard.value } }
    getChildList(params)
      .then((res) => {
        let classFormattedData = [];
        res?.data?.data?.child_list.forEach((element) => {
          classFormattedData.push({
            value: element.syllabus_id,
            label: element.name,
          });
          setClassList(classFormattedData);
        });
      })
      .catch((err) => {
        if(err.response.status == 401){
          getClassListHandler()
        }
        console.log(err, "..error");
      });
  };

  // it depends upon selected board and class
  const getProductListHandler = async () => {
    let body = {
      empcode: empCode,
      board_id: selectedBoard.value,
      subscription_type: "free",
      class_syllabus_id: selectedClass.value,
    };
    getProductList(body)
      .then((res) => {
        let productFormattedData = [];
        res?.data?.responseData?.data_array?.product_list?.forEach(
          (element) => {
            productFormattedData.push({
              value: element.product_id,
              label: element.product_name,
              live_class: element.live_class
            });
            setProductList(productFormattedData);
          }
        );
      })
      .catch((err) => {
        console.log(err, "..error");
      });
  };

  const getBatchListHandler = async () => {

    let body = {
      empcode: empCode,
      board_id: selectedBoard?.value,
      syllabus_id: selectedClass?.value,
      product_id: selectedProduct?.value,
    };

    getBatchList(body)
      .then((res) => {
        let languages = [];
        let batchDates = {}

        res?.data?.responseData?.data_array?.forEach((element) => {

          let checkDuplicates = languages.filter(language => language.value === element.section_language);
          if (checkDuplicates.length === 0) {
            languages.push({
              label: element.section_language,
              value: element.section_language
            })
          }

          if (batchDates[element.section_language]) {
            batchDates[element.section_language] = [
              ...batchDates[element.section_language],
              { label: element.section_start_date, value: element.section_start_date, batchId: element.id }
            ]
          } else {
            batchDates[element.section_language] = [{ label: element.section_start_date, value: element.section_start_date, batchId: element.id }]
          }
        });
        setLanguageList(languages);
        setBatchData(batchDates);
      })
      .catch((err) => {
        console.log(err, "..error");
      });
  };

  useEffect(() => {
    getBoardListHandler();
  }, []);

  useEffect(() => {
    if (!_.isEmpty(selectedBoard)) {
      getClassListHandler();
    }
  }, [selectedBoard.value]);

  useEffect(() => {
    if (!_.isEmpty(selectedBoard) && !_.isEmpty(selectedClass)) {
      getProductListHandler();
    }
  }, [selectedBoard.value, selectedClass.value]);

  useEffect(() => {
    if (!_.isEmpty(selectedBoard) && !_.isEmpty(selectedClass) && !_.isEmpty(selectedProduct)) {
      getBatchListHandler();
    }
  }, [selectedBoard.value, selectedClass.value, selectedProduct.value]);

  return (
    <>
      {assignModal && (
        <Modal
          hideBackdrop={true}
          open={assignModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="targetModal1"
        >
          <Box
            sx={ModalStyle}
            style={{ width: 700 }}
            className="modalContainer"
          >
            <Box align="right">
              <img
                onClick={() => setAssignModal(!assignModal)}
                className="crossIcon"
                src={CrossIcon}
                alt="crossIcon"
              />
            </Box>
            <form>
            <Typography variant="h6" className="text-center">
              Assign Free Trial
            </Typography>
            <Grid container spacing={2} sx={{ pt: "32px", pb: "24px" }}>
              {!isBulk && <Grid item md={6} xs={12}>
                <Grid>
                  <Typography className={classes.label}>Name</Typography>
                  <input
                    className={classes.inputStyle}
                    name="name"
                    type="text"
                    placeholder="Name"
                    value={leadObj?.name}
                    disabled
                  />
                </Grid>
              </Grid>
              }
              <Grid item md={6} xs={12}>
                <Grid>
                  <Typography className={classes.label}>Board</Typography>
                  <ReactSelect
                    classNamePrefix="select"
                    options={boardList}
                    value={selectedBoard}
                    onChange={(data) => handleOnChange(data, 'board')}
                  />
                </Grid>
              </Grid>
              <Grid item md={6} xs={12}>
                <Grid>
                  <Typography className={classes.label}>Class</Typography>
                  <ReactSelect
                    classNamePrefix="select"
                    options={classList}
                    value={selectedClass}
                    onChange={(data) => handleOnChange(data, 'class')}
                    isDisabled={checkDisability('class')}
                  />
                </Grid>
              </Grid>
              <Grid item md={6} xs={12}>
                <Grid>
                  <Typography className={classes.label}>Product</Typography>
                  <ReactSelect
                    classNamePrefix="select"
                    options={productList}
                    value={selectedProduct}
                    onChange={(data) => handleOnChange(data, 'product')}
                    isDisabled={checkDisability('product')}
                  />
                </Grid>
              </Grid>
              {HidebatchAndLanguageFields &&
                <>
                  <Grid item md={6} xs={12}>
                    <Grid>
                      <Typography className={classes.label}>Language</Typography>
                      <ReactSelect
                        classNamePrefix="select"
                        options={languageList}
                        value={selectedLanguage}
                        onChange={(data) => handleOnChange(data, 'language')}
                      />
                    </Grid>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Grid>
                      <Typography className={classes.label}>Batch date</Typography>
                      <ReactSelect
                        classNamePrefix="select"
                        options={batchList}
                        value={selectedbatch}
                        onChange={(data) => handleOnChange(data, 'batch')}
                        // selectedLanguage
                        isDisabled={checkDisability('selectedLanguage')}
                      />
                    </Grid>
                  </Grid>
                </>
              }
            </Grid>
            <Grid className="text-center">        
               <LoadingButton
                  // className={classes.submitBtn}
                  onClick={() => handleSubmit()}
                  loading = {buttonLoader}
                  variant="contained"
                  type="submit"
                >
                  Submit
              </LoadingButton>
            </Grid>
            </form>
          </Box>
        </Modal>
      )}
      {alertModal && <AlertModal />}
    </>
  );
}

