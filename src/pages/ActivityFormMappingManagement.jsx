import { useState, useEffect } from "react";
import {
  TextField,
  Modal,
  Button,
  Fade,
  Box,
  InputAdornment,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Page from "../components/Page";
import SearchIcon from "../assets/icons/icon_search.svg";
import _ from "lodash";
import {
  getActivityFormMappingList,
  createFormMappingProductArray,
  updateActivityFormMapping,
  createActivityFormMapping,
  deleteActivityFormMapping,
} from "../config/services/activityFormMapping";
import {
  MappingList,
  CreateMapping,
} from "../components/activityFormMappingManagement";
import { makeStyles } from "@mui/styles";
import { useRef } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import Pagination from "./Pagination";
import { getAllKeyValues } from "../config/services/crmMaster";
import { getAllProductList } from "../config/services/packageBundle";
import FilterIcon from "../assets/image/filterIcon.svg";
import MappingFilter from "../components/activityFormMappingManagement/MappingFilter";
import { getAllStatus } from "../config/services/status";
import { getAllStages } from "../config/services/stages";
import { getAllActivities } from "../config/services/activities";
import { DisplayLoader } from "../helper/Loader";

const useStyles = makeStyles((theme) => ({
  cusCard: {
    padding: "2px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
    height: "100%",
  },
  RevenueCard: {
    padding: "0px",
    overflow: "hidden",
  },
  filterSection: {
    display: "flex",
    alignItems: "center",
    marginTop: "-10px",
    marginBottom: "25px",
  },
  loaderVisible: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
    width: "100%",
  },
  noData: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 600,
    fontSize: 25,
  },
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  bgcolor: "background.paper",
  border: "2px solid #fff",
  boxShadow: "0px 0px 4px #0000001A",
  p: 4,
  borderRadius: "4px",
};

export default function ActivityFormMappingManagement() {
  const classes = useStyles();
  const [recordForEdit, setRecordForEdit] = useState({});
  const [createMapping, setCreateMapping] = useState(false);
  const [pageNo, setPagination] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearchValue] = useState("");
  const [sortObj, setSortObj] = useState({
    sortKey: "createdAt",
    sortOrder: "-1",
  });
  const [mappingList, setMappingList] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteObj, setDeleteObj] = useState({});
  const [lastPage, setLastPage] = useState(false);
  const [copyFormMapping, setCopyFormMapping] = useState(false);
  const [productList, setProductList] = useState([]);
  const [productListMultiSelect, setProductListMultiSelect] = useState([]);
  const [currentProduct, setCurrentProduct] = useState("");
  const [selectedRow, setSelectedRow] = useState([]);
  const [multipleProducts, setMultipleProducts] = useState([]);
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [allKeysResponse, setAllKeysReseponse] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [stageList, setStageList] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [filterRecords, setFilterRecords] = useState({});
  const [applyFilter, setApplyFilter] = useState(false);
  const [loader, setLoader] = useState(true);
  const divRef = useRef();
  const [uuid] = useState(
    JSON.parse(localStorage.getItem("userData"))?.lead_id
  );

  const navigate = useNavigate();

  const showCreateMapping = (cancelFlag = false) => {
    (!createMapping || cancelFlag) && setCreateMapping(!createMapping);
  };
  function handleClick() {
    setRecordForEdit({});
    showCreateMapping();
  }

  const handleUpdate = (row) => {
    let filledDetails = {};
    filledDetails.formId = row?.formId && {
      label: `${row.formId}`,
      value: `${row.formId}`,
    };
    filledDetails.type = row?.type && {
      label: `${row.type}`,
      value: `${row.type}`,
    };
    filledDetails.stageName = row?.stageId && {
      label: `${row.stageName}`,
      value: `${row.stageId}`,
    };
    filledDetails.statusName = row?.statusId && {
      label: `${row.statusName}`,
      value: `${row.statusId}`,
    };
    filledDetails.activityId = row?.activityId && {
      label: `${row.activityName}`,
      value: `${row.activityId}`,
    };
    filledDetails.futureActivityId = row?.futureActivityId && {
      label: `${row.futureActivityName}`,
      value: `${row.futureActivityId}`,
    };
    filledDetails.subject = row?.subject && {
      label: `${row.subject}`,
      value: `${row.subject}`,
    };
    filledDetails.customerResponse = row?.customerResponse && {
      label: `${row.customerResponse}`,
      value: `${row.customerResponse}`,
    };
    filledDetails.reasonForPaPending = row?.reasonForPaPending;
    filledDetails.reasonForPaRejected = row?.reasonForPaRejected;
    filledDetails.reasonForFbPending = row?.reasonForFbPending;
    filledDetails.reasonForFbRejected = row?.reasonForFbRejected;
    filledDetails.reasonForObPending = row?.reasonForObPending;
    filledDetails.reasonForObRejected = row?.reasonForObRejected;
    filledDetails.reasonForAckPending = row?.reasonForAckPending;
    filledDetails.reasonForAckRejected = row?.reasonForAckRejected;
    filledDetails.subjectPreFilled = row?.subjectPreFilled;
    filledDetails.reasonForDQ = row?.reasonForDQ;
    filledDetails.verifiedDoc = row?.verifiedDoc;
    filledDetails.featureExplained = row?.featureExplained;
    filledDetails._id = row?._id;
    filledDetails.product = {
      label: row?.product,
      value: row?.product,
      productCode: row?.productCode,
      refId: row?.refId,
      groupCode: row?.groupCode,
    };
    filledDetails.priority = { label: row?.priority, value: row?.priority };
    filledDetails.hardware = { label: row?.hardware, value: row?.hardware };
    filledDetails.meetingStatus = {
      label: row?.meetingStatus,
      value: row?.meetingStatus,
    };
    filledDetails.b2BFields = row?.dependentFields;
    filledDetails.isPriorityApplicable = row?.isPriorityApplicable;
    filledDetails.mappingType = { label: row?.mappingType, value: row?.mappingType }
    setRecordForEdit(filledDetails);
    showCreateMapping();
  };

  const validateAddMapping = (filledDetails) => {
    let { stageName, statusName, subject } = filledDetails;

    if (!stageName?.value) {
      toast.error("Please Select Stage");
      return false;
    } else if (!statusName?.value) {
      toast.error("Select Status");
      return false;
    } else if (!subject) {
      toast.error("Select Subject");
      return false;
    } else {
      return true;
    }
  };

  const addOrEdit = () => {
    if (validateAddMapping(recordForEdit)) {
      let paramsObj = {
        formId: recordForEdit?.formId?.value,
        type: recordForEdit?.type?.value,
        stageName:
          recordForEdit?.stageName?.stageName ??
          recordForEdit?.stageName?.label,
        stageId:
          recordForEdit?.stageName?._id ?? recordForEdit?.stageName?.value,
        statusName:
          recordForEdit?.statusName?.statusName ??
          recordForEdit?.statusName?.label,
        statusId:
          recordForEdit?.statusName?._id ?? recordForEdit?.statusName?.value,
        subject:
          recordForEdit?.subject?.subjectName ?? recordForEdit?.subject?.label,
        customerResponse:
          recordForEdit?.customerResponse?.customerResponse ??
          recordForEdit?.customerResponse?.label,
        activityId:
          recordForEdit?.activityId?.ID ?? recordForEdit?.activityId?.value,
        activityName:
          recordForEdit?.activityId?.activityName ??
          recordForEdit?.activityId?.label,
        futureActivityId:
          recordForEdit?.futureActivityId?.ID ??
          recordForEdit?.futurreActivityId?.value,
        futureActivityName:
          recordForEdit?.futureActivityId?.activityName ??
          recordForEdit?.futureActivityId?.label,
        subjectPreFilled: recordForEdit?.subjectPreFilled ?? false,
        reasonForDQ: recordForEdit?.reasonForDQ ?? false,
        featureExplained: recordForEdit?.featureExplained ?? false,
        verifiedDoc: recordForEdit?.verifiedDoc ?? false,
        reasonForPaPending: recordForEdit?.reasonForPaPending ?? false,
        reasonForPaRejected: recordForEdit?.reasonForPaRejected ?? false,
        reasonForFbPending: recordForEdit?.reasonForFbPending ?? false,
        reasonForFbRejected: recordForEdit?.reasonForFbRejected ?? false,
        reasonForObPending: recordForEdit?.reasonForObPending ?? false,
        reasonForObRejected: recordForEdit?.reasonForObRejected ?? false,
        reasonForAckPending: recordForEdit?.reasonForAckPending ?? false,
        reasonForAckRejected: recordForEdit?.reasonForAckRejected ?? false,
        product: recordForEdit?.product?.value,
        productCode: recordForEdit?.product?.productCode,
        refId: recordForEdit?.product?.refId,
        groupCode: recordForEdit?.product?.groupCode,
        priority: recordForEdit?.priority?.value,
        hardware: recordForEdit?.hardware?.value,
        meetingStatus: recordForEdit?.meetingStatus?.value,
        dependentFields: recordForEdit?.b2BFields,
        isPriorityApplicable: recordForEdit?.isPriorityApplicable,
        mappingType: recordForEdit?.mappingType?.value
      };

      if (recordForEdit?._id) {
        paramsObj._id = recordForEdit?._id;

        updateActivityFormMapping(paramsObj).then((res) => {
          if (res?.result) {
            fetchMappingList(true);
            toast.success(res?.message);
            setRecordForEdit({});
            showCreateMapping();
          } else if (res?.data?.statusCode === 0) {
            let { errorMessage } = res?.data?.error;
            toast.error(JSON.stringify(errorMessage));
          } else {
            console.error(res);
          }
        });
      } else {
        createActivityFormMapping(paramsObj)
          .then((res) => {
            if (res?.result) {
              fetchMappingList(true);
              toast.success(res?.message);
              setRecordForEdit({});
              showCreateMapping();
            } else if (res?.data?.statusCode === 0) {
              let { errorMessage } = res?.data?.error;
              toast.error(JSON.stringify(errorMessage));
            } else {
              console.error(res);
            }
          })
          .catch((err) => {
            console.log(err, ":::err");
          });
      }
    }
  };

  const handleSelectActivity = (newSelectValue) => {
    let filledDetails = _.cloneDeep(recordForEdit);
    filledDetails.activityId = newSelectValue;
    setRecordForEdit(filledDetails);
  };

  const handleSelectFutureActivity = (newSelectValue) => {
    let filledDetails = _.cloneDeep(recordForEdit);
    filledDetails.futureActivityId = newSelectValue;
    setRecordForEdit(filledDetails);
  };

  const handleSelectHardware = (newSelectValue) => {
    let filledDetails = _.cloneDeep(recordForEdit);
    filledDetails.hardware = newSelectValue;
    setRecordForEdit(filledDetails);
  };

  const handleSelectCustomerResponse = (newSelectValue) => {
    let filledDetails = _.cloneDeep(recordForEdit);
    filledDetails.customerResponse = newSelectValue;
    setRecordForEdit(filledDetails);
  };

  const handleSelectSubject = (newSelectValue) => {
    let filledDetails = _.cloneDeep(recordForEdit);
    filledDetails.subject = newSelectValue;
    setRecordForEdit(filledDetails);
  };

  const handleSelectProduct = (newSelectValue) => {
    let filledDetails = _.cloneDeep(recordForEdit);
    filledDetails.product = newSelectValue;
    setRecordForEdit(filledDetails);
  };

  const handleSelectPriority = (newSelectValue) => {
    let filledDetails = _.cloneDeep(recordForEdit);
    filledDetails.priority = newSelectValue;
    setRecordForEdit(filledDetails);
  };

  const handleSelectStage = (newSelectValue) => {
    let filledDetails = _.cloneDeep(recordForEdit);
    filledDetails.stageName = newSelectValue;
    setRecordForEdit(filledDetails);
  };

  const handleSelectStatus = (newSelectValue) => {
    let filledDetails = _.cloneDeep(recordForEdit);
    filledDetails.statusName = newSelectValue;
    setRecordForEdit(filledDetails);
  };

  const handleSelectForm = (newSelectValue) => {
    let filledDetails = _.cloneDeep(recordForEdit);
    filledDetails.formId = newSelectValue;
    setRecordForEdit(filledDetails);
  };

  const handleSelectType = (newSelectValue) => {
    let filledDetails = _.cloneDeep(recordForEdit);
    filledDetails.type = newSelectValue;
    setRecordForEdit(filledDetails);
  };

  const handleB2BDropDown = (newSelectValue) => {
    let filledDetails = _.cloneDeep(recordForEdit);
    filledDetails.b2BFields = newSelectValue;
    setRecordForEdit(filledDetails);
  };

  const handleSelectMeetingStatus = (newSelectValue) => {
    let filledDetails = _.cloneDeep(recordForEdit);
    filledDetails.meetingStatus = newSelectValue;
    setRecordForEdit(filledDetails);
  };

  const handlePriorityApplicable = (newSelectValue) => {
    let { value } = newSelectValue?.target;
    let filledDetails = _.cloneDeep(recordForEdit);
    filledDetails.isPriorityApplicable = value === "true" ? true : false;
    setRecordForEdit(filledDetails);
  };
  const handleMappingType = (newSelectValue) => {
    let filledDetails = _.cloneDeep(recordForEdit);
    filledDetails.mappingType = newSelectValue;
    setRecordForEdit(filledDetails);

  };

  const handleOnChange = (e) => {
    let { value, name, checked } = e.target;
    let filledDetails = _.cloneDeep(recordForEdit);
    if (name === "reasonForDQ") {
      filledDetails[name] = checked;
    }
    if (name === "subjectPreFilled") {
      filledDetails[name] = checked;
    }
    if (name === "verifiedDoc") {
      filledDetails[name] = checked;
    }
    if (name === "featureExplained") {
      filledDetails[name] = checked;
    }
    if (name === "reasonForPaPending") {
      filledDetails[name] = checked;
    }
    if (name === "reasonForPaRejected") {
      filledDetails[name] = checked;
    }
    if (name === "reasonForFbPending") {
      filledDetails[name] = checked;
    }
    if (name === "reasonForFbRejected") {
      filledDetails[name] = checked;
    }
    if (name === "reasonForObPending") {
      filledDetails[name] = checked;
    }
    if (name === "reasonForObRejected") {
      filledDetails[name] = checked;
    }
    if (name === "reasonForAckPending") {
      filledDetails[name] = checked;
    }
    if (name === "reasonForAckRejected") {
      filledDetails[name] = checked;
    }
    setRecordForEdit(filledDetails);
  };

  const handleSearch = (e) => {
    let { value } = e.target;
    setPagination(1);
    setSearchValue(value, () => setPagination(1));
  };

  const fetchMappingList = async (scrollFlag = false) => {
    let params = {
      pageNo: pageNo - 1,
      count: itemsPerPage,
      ...sortObj,
      search,
    };
    let filterItems = filterRecords;
    let filterObject = await handleFilterRecords(filterItems);
    // if (applyFilter)
    params = { ...params, ...filterObject };
    setLastPage(false);
    setLoader(true);
    getActivityFormMappingList(params)
      .then((res) => {
        let data = res?.result;
        setMappingList(data);
        if (data?.length < itemsPerPage) setLastPage(true);
        if (scrollFlag) {
          divRef.current.scrollIntoView();
        }
        setLoader(false);
      })
      .catch((err) => {
        console.log(err, "..error");
        setLoader(false);
      });
  };

  const deleteMappingObject = (params) => {
    setDeleteObj({ _id: params?._id });
    setDeletePopup(true);
  };

  const handleCancelDelete = () => {
    setDeletePopup(false);
    setDeleteObj({});
  };

  const submitDeleteMapping = () => {
    let { _id } = deleteObj;
    deleteActivityFormMapping({ _id }).then((res) => {
      if (res?.result) {
        handleCancelDelete();
        fetchMappingList();
        toast.success(res?.message);
      } else if (res?.data?.statusCode === 0) {
        let { errorMessage } = res?.data?.error;
        toast.error(errorMessage);
      } else {
        console.error(res);
      }
    });
  };

  const fetchAllStageList = () => {
    getAllStages({type: recordForEdit?.mappingType?.value ? recordForEdit?.mappingType?.value.toLowerCase() : undefined})
      .then((res) => {
        if (res?.result) {
          res?.result?.map((stageObj) => {
            stageObj.label = stageObj?.type ? `${stageObj?.stageName} (${stageObj?.type.charAt(0).toUpperCase()}${stageObj?.type.slice(1)})` : `${stageObj?.stageName}`;
            stageObj.value = stageObj._id;
            return stageObj;
          });
          setStageList(res?.result);
        }
      })
      .catch((err) => console.error(err));
  };

  const fetchAllStatusList = () => {
    getAllStatus({type: recordForEdit?.mappingType?.value ? recordForEdit?.mappingType?.value.toLowerCase() : undefined})
      .then((res) => {
        if (res?.result) {
          res?.result?.map((statusObj) => {
            statusObj.label = statusObj?.type ? `${statusObj?.statusName} (${statusObj?.type.charAt(0).toUpperCase()}${statusObj?.type.slice(1)})` : `${statusObj?.statusName}`;
            statusObj.value = statusObj._id;
            return statusObj;
          });
          setStatusList(res?.result);
        }
      })
      .catch((err) => console.error(err));
  };

  const fetchAllActivities = async () => {
    getAllActivities({ flag: true })
      .then((res) => {
        if (res?.result) {
          res?.result?.map((activityObj) => {
            activityObj.label = activityObj.activityName;
            activityObj.value = activityObj.ID;
            return activityObj;
          });
          setActivityList(res?.result);
        }
      })
      .catch((err) => console.error(err));
  };

  const createFormMapping = async () => {
    delete selectedRow.isDeleted;
    delete selectedRow.updatedAt;
    delete selectedRow.__v;
    delete selectedRow._id;
    if (
      !selectedRow?.product?.length > 0 ||
      selectedRow?.product === currentProduct
    ) {
      toast.error("Please Select Product");
      return;
    }

    let params = selectedRow;
    createFormMappingProductArray(params)
      .then((res) => {
        if (res?.result) {
          fetchMappingList(true);
          toast.success(res?.message);
          closeCopyFormMappingModal();
          setMultipleProducts([]);
        } else if (res?.data?.statusCode === 0) {
          let { errorMessage } = res?.data?.error;
          toast.error(JSON.stringify(errorMessage));
        }
      })
      .catch((err) => {
        console.log(
          err,
          "Error while creating Form Mapping with Product Array"
        );
      });
  };

  const getDuplicate = async (rowValue) => {
    let mappedProduct = [];
    for (let i = 0; i < mappingList?.length; i++) {
      const currentRow = mappingList?.[i];

      // Compare stageName and statusName of obj1 and activity2
      if (
        currentRow?.stageName === rowValue?.stageName &&
        currentRow?.statusName === rowValue?.statusName &&
        currentRow?.customerResponse === rowValue?.customerResponse &&
        currentRow?.hardware === rowValue?.hardware &&
        currentRow?.priority === rowValue?.priority
      ) {
        if (currentRow?.product) mappedProduct?.push(currentRow?.product);
      }
    }
    return mappedProduct;
  };

  const handleCopyFormMapping = async (rowValue) => {
    setCurrentProduct(rowValue?.product);
    // delete rowValue?.product

    let mappedProduct = [];
    mappedProduct = await getDuplicate(rowValue);

    let newProduct = productList?.filter(function (item) {
      return mappedProduct?.indexOf(item?.value) === -1;
    });

    setProductListMultiSelect(newProduct);
    setCopyFormMapping(!copyFormMapping);
    // rowValue.product = '';
    setSelectedRow(rowValue);
  };

  const getAllDropDownValues = () => {
    getAllKeyValues()
      .then((res) => {
        let data = res?.result;
        setAllKeysReseponse(data);
      })
      .catch((err) => {
        console.error(err, "Error while fetching all dropdown values");
      });
  };

  const getProductList = () => {
    let params = {
      status: [1],
      master_data_type: "package_products",
      uuid: uuid,
    };
    getAllProductList(params)
      .then((res) => {
        let list = res?.data?.master_data_list;
        let dataArray = list?.map((obj) => ({
          label: obj?.name,
          value: obj?.name,
          productCode: obj?.product_key,
          refId: obj?.id,
          groupCode: obj?.group_key,
        }));
        setProductList(dataArray);
      })
      .catch((err) => console.error(err));
  };

  const handleFilterRecords = async (data) => {
    let filterObject = {
      activityName: data?.activity?.label,
      customerResponse: data?.customerResponse?.value,
      product: data?.product?.value,
      stageName: data?.stageName?.stageName,
      statusName: data?.status?.statusName,
      subject: data?.subject?.value,
      futureActivityName: data?.futureActivityName?.label,
    };
    return filterObject;
  };

  const closeCopyFormMappingModal = () => {
    setMultipleProducts([]);
    setCopyFormMapping(!copyFormMapping);
  };

  const handleSelectedProducts = (products) => {
    setMultipleProducts(products);
    const updateKey = { ...selectedRow, product: products };
    setSelectedRow(updateKey);
  };

  const handleFilter = (e) => {
    setFilterAnchor(e.currentTarget);
  };
  useEffect(() => {
    getAllDropDownValues();
    fetchAllActivities();
    getProductList();
  }, []);

  useEffect(() => {
    if (recordForEdit?.mappingType){
      fetchAllStageList();
      fetchAllStatusList();
    }    
  },[recordForEdit])


  useEffect(() => {
    fetchMappingList();
  }, [search, sortObj, pageNo, itemsPerPage, applyFilter]);

  return (
    <>
      <Page
        title="Extramarks | Activity Form Mapping Management"
        className="main-container compaignManagenentPage datasets_container"
      >
        <div>
          <div>
            {createMapping && (
              <div className="createCampaign">
                <CreateMapping
                  handleSelectCustomerResponse={handleSelectCustomerResponse}
                  handleB2BDropDown={handleB2BDropDown}
                  handleSelectMeetingStatus={handleSelectMeetingStatus}
                  addOrEdit={addOrEdit}
                  recordForEdit={recordForEdit}
                  setRecordForEdit={setRecordForEdit}
                  handleSelectType={handleSelectType}
                  handleOnChange={handleOnChange}
                  handleSelectSubject={handleSelectSubject}
                  handleSelectStage={handleSelectStage}
                  handleSelectHardware={handleSelectHardware}
                  handleSelectForm={handleSelectForm}
                  handleSelectStatus={handleSelectStatus}
                  handleSelectActivity={handleSelectActivity}
                  handleSelectFutureActivity={handleSelectFutureActivity}
                  handleSelectProduct={handleSelectProduct}
                  handleSelectPriority={handleSelectPriority}
                  fetchMappingList={fetchMappingList}
                  showCreateMapping={showCreateMapping}
                  stageList={stageList}
                  statusList={statusList}
                  activityList={activityList}
                  productList={productList}
                  handlePriorityApplicable={handlePriorityApplicable}
                  handleMappingType={handleMappingType}
                />
              </div>
            )}
            {!createMapping && (
              <div style={{ textAlign: "right" }}>
                <div className="createNew_button" onClick={handleClick}>
                  Create New
                </div>
              </div>
            )}
          </div>
          <div className="tableCardContainer">
            <div ref={divRef}>
              <div className="contaienr">
                <h4 className="heading">Manage Activity Form Mapping</h4>
                <div className={classes.filterSection}>
                  <div style={{ width: "100%", height: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        className="filterContainer mt-1"
                        style={{
                          alignItems: "center",
                          border: "1px solid #dedede",
                          borderRadius: "4px",
                          color: "#85888a",
                          cursor: "pointer",
                          display: "flex",
                          fontSize: "14px",
                          height: "38px",
                          justifyContent: "center",
                          width: "100px",
                          marginBottom: "-10px",
                        }}
                        onClick={handleFilter}
                      >
                        <img
                          src={FilterIcon}
                          alt="FilterIcon"
                          style={{ marginRight: "5px" }}
                        />
                        <span>Filter</span>
                      </div>
                    </div>
                  </div>
                </div>
                <MappingFilter
                  filterAnchor={filterAnchor}
                  setFilterAnchor={setFilterAnchor}
                  dropDownResponse={allKeysResponse}
                  stageList={stageList}
                  productList={productList}
                  statusList={statusList}
                  activityList={activityList}
                  filterRecords={filterRecords}
                  setFilterRecords={setFilterRecords}
                  applyFilter={applyFilter}
                  setApplyFilter={setApplyFilter}
                  setPagination={setPagination}
                />
              </div>
              <TextField
                className={`inputRounded search-input`}
                type="search"
                placeholder="Search By name"
                onChange={handleSearch}
                InputLabelProps={{ style: { ...{ top: `${-7}px` } } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img src={SearchIcon} alt="" />
                    </InputAdornment>
                  ),
                }}
              />
              {!loader ? (
                mappingList?.length > 0 ? (
                  <MappingList
                    handleUpdate={handleUpdate}
                    deleteMappingObject={deleteMappingObject}
                    list={mappingList}
                    pageNo={pageNo}
                    itemsPerPage={itemsPerPage}
                    search={search}
                    handleCopyFormMapping={handleCopyFormMapping}
                  />
                ) : (
                  <div className={classes.noData}>
                    <p>No Data Available</p>
                  </div>
                )
              ) : (
                <div className={classes.loaderVisible}>{DisplayLoader()}</div>
              )}
              <div className="center cm_pagination">
                <Pagination
                  pageNo={pageNo}
                  setPagination={setPagination}
                  lastPage={lastPage}
                />
              </div>
              <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={deletePopup}
                closeAfterTransition
              >
                <Fade in={deletePopup}>
                  <Box
                    className={classes.modalPaper + " modal-box modal-md"}
                    id="transition-modal-title"
                  >
                    <div>
                      <Typography
                        variant="subtitle1"
                        className={classes.modalTitle}
                      >
                        {`Are you sure to delete this mapping ?`}
                      </Typography>
                    </div>
                    {/* <Box className="modal-content text-left"> */}
                    <Box
                      style={{ marginBottom: 0, marginRight: 0 }}
                      className="modal-footer text-right"
                    >
                      <Button
                        onClick={handleCancelDelete}
                        className={" report_form_ui_btn cancel mr-2"}
                        color="primary"
                        variant="outlined"
                      >
                        {" "}
                        Cancel{" "}
                      </Button>
                      <Button
                        onClick={submitDeleteMapping}
                        color="primary"
                        autoFocus
                        className={" report_form_ui_btn submit"}
                        variant="contained"
                      >
                        {" "}
                        Submit{" "}
                      </Button>
                    </Box>
                    {/* </Box> */}
                  </Box>
                </Fade>
              </Modal>
            </div>
          </div>
        </div>
        {copyFormMapping && (
          <Modal
            hideBackdrop={true}
            open={handleCopyFormMapping}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="targetModal1"
          >
            <Box
              sx={style}
              className="modalContainer"
              style={{ borderRadius: "8px", width: "30%" }}
            >
              <div
                style={{
                  fontSize: "x-large",
                  fontWeight: "500",
                  marginLeft: "85px",
                  marginTop: "-18px",
                  marginBottom: "10px",
                }}
              >
                Create Form Mapping
              </div>
              {productListMultiSelect.length === 0 ? (
                <p style={{ marginLeft: "90px", fontSize: "medium" }}>
                  Mapping for all products is created
                </p>
              ) : (
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="color"
                  options={productListMultiSelect}
                  isMulti
                  value={multipleProducts}
                  onChange={handleSelectedProducts}
                  closeMenuOnSelect={false}
                />
              )}
              <div
                style={{
                  float: "right",
                  marginTop: "20px",
                  marginBottom: "-10px",
                }}
              >
                <Button
                  style={{ marginRight: "20px", borderRadius: 4 }}
                  onClick={closeCopyFormMappingModal}
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button
                  style={{
                    borderRadius: 4,
                    background:
                      productListMultiSelect.length === 0 && "blanchedalmond",
                    cursor:
                      productListMultiSelect.length === 0
                        ? "not-allowed"
                        : "pointer",
                  }}
                  onClick={
                    productListMultiSelect.length > 0 ? createFormMapping : null
                  }
                  variant="contained"
                >
                  Create
                </Button>
              </div>
            </Box>
          </Modal>
        )}
      </Page>
    </>
  );
}
