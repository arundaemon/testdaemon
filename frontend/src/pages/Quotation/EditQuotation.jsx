import { Box, Breadcrumbs, Button, Grid, Typography } from "@mui/material";
import Page from "../../components/Page";
import { useStyles } from "../../css/Quotation-css";
import { Link, useLocation } from "react-router-dom";
import BredArrow from "../../assets/image/bredArrow.svg";
import { SchoolDetailBox } from "../../components/Quotation/SchoolDetailBox";
import { SoftwareDetail } from "../../components/Quotation/SoftwareDetail";
import { Fragment, useEffect, useState } from "react";
import HardwareDetail from "../../components/Quotation/HardwareDetail";
import ServiceDetails from "../../components/Quotation/ServiceDetails";
import { useNavigate } from "react-router-dom";
import {
  fetchQuotationListDetails,
  fetchSingleQuotation,
} from "../../config/services/quotationMapping";
import { getAllKeyValues } from "../../config/services/crmMaster";
import { getPackageName } from "../../config/services/packageBundle";
import { getBoardList, getChildList } from "../../config/services/lead";
import { ProductQuoteType, QuotaionFormFields } from "../../constants/general";
import QuotationDetailPage from "./QuotationDetailPage";
import { toast } from "react-hot-toast";
import { getRecommendHardware } from "../../config/services/hardwareManagement";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { EditSoftwareDetail } from "../../components/Quotation/EditSoftwareDetail";
import { getQuotationDetails } from "../../config/services/quotationCRM";
import { getSchoolBySchoolCode } from "../../config/services/school";

const EditQuotation = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [softwareTableData, setSoftwareTableData] = useState([]);
  const [quotation, setQuotation] = useState([]);
  const [producTypes, setProducTypes] = useState([]);
  const [rowCount, setRowCount] = useState(1);
  const [thOption, setTablehdOptions] = useState([]);
  const [openHardware, setOpenHardware] = useState(false);
  const [openService, setOpenService] = useState(false);
  const [hideHardwareBtn, setHideHardwareBtn] = useState(false);
  const [hideServiceBtn, setHideServiceBtn] = useState(false);
  const [softwareList, setSoftwareList] = useState([]);
  const [packageOption, setPackageOption] = useState([]);
  const [boardSelectData, setBoardSelectData] = useState([]);
  const [classSelectData, setClassSelectData] = useState([]);
  const [hardwareList, setHardwareList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [showApproval, setShowApproval] = useState(true);
  const [recommendHardware, setRecommendHardware] = useState([]);
  const [quotationMasterConfigId, setQuotationMasterConfigId] = useState("");
  const [quotationMaster, setQuotationMasterConfig] = useState("");
  let location = useLocation();
  const [softwareQuoteID, setSoftwareID] = useState(null);
  const [hardwareFillDetail, setHardwareDetail] = useState([]);
  const [serviceFillDetail, setServiceDetail] = useState([]);
  const loginData = getUserData("loginData");
  const uuid = loginData?.uuid;
  const [quoteSoftwareData, setQuoteSofwareData] = useState([]);
  const [quoteHardwareData, setQuoteHardwareData] = useState([]);
  const [quoteServicesData, setQuoteServicesData] = useState([]);
  const [quoteProductCode, setProductCode] = useState([]);
  const [softwareKeyList, setSoftwareKeyList] = useState([]);
  const [isSoftwareValid, setSoftwareValid] = useState(false);
  const [isQuotationType, setQuotationType] = useState(null);
  const [quotationData, setQuotationData] = useState([]);
  const [schoolDetails, setSchoolDetails] = useState(null);

  const packageID = softwareList
    ?.flat()
    ?.map((obj) =>
      obj?.dependentFields?.filter(
        (obj) => obj?.fieldName === QuotaionFormFields["field3"]["fieldName"]
      )
    )
    ?.flat()
    ?.map((obj) => obj?.value?.value)
    ?.filter((obj) => obj);

  let { schoolCode, quotationCode } = location?.state ? location?.state : {};

  // useEffect(() => {
  //   if (!location?.state?.interest) {
  //     toast.error("You Cannot Access Without Product");
  //     navigate("/authorised/school-list");
  //   }
  // }, []);

  useEffect(() => {
    if (quotationData?.length) {
      getExistQuoteData();
      let softwareData = quotationData?.filter(
        (obj) => obj?.productItemCategory === ProductQuoteType?.SOFTWARE
      );
      let hardwareData = quotationData?.filter(
        (obj) => obj?.productItemCategory === ProductQuoteType?.HARDWARE
      );
      let serviceData = quotationData?.filter(
        (obj) => obj?.productItemCategory === ProductQuoteType?.SERVICE
      );

      let quoteType = quotationData?.map((obj) => obj?.quotationFor)?.[0];

      setQuoteSofwareData(softwareData);
      setQuoteHardwareData(hardwareData);
      setQuoteServicesData(serviceData);
      setQuotationType(quoteType);
    }
  }, [quotationData]);

  const getQuotationData = async (data) => {
    try {
      let res = await getQuotationDetails(data);
      if (res?.result?.length) {
        setQuotationData(res?.result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getQuotations = async (data) => {
    let { productCode, quotationFor } = data;

    let params = {
      productCode: productCode,
      quotationFor: quotationFor,
    };

    try {
      const quotations = await fetchQuotationListDetails(params);
      return {
        masterData: quotations,
      };
    } catch (err) {
      console.error(err);
    }
  };

  const getExistQuoteData = () => {
    let masterDataArray = [];

    let data = quotationData
      ?.filter((obj) => obj?.productItemCategory === ProductQuoteType?.SOFTWARE)
      ?.map((obj) => {
        return {
          productCode: obj?.productCode,
          quotationFor: obj?.quotationFor,
        };
      });

    try {
      Promise.all(
        data?.map(async (obj) => {
          let { masterData } = await getQuotations(obj);
          masterDataArray.push(masterData);
          setQuotation(masterDataArray);
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (quotationCode) {
      getQuotationData(quotationCode);
    }
  }, [quotationCode]);

  const getOptionsData = async () => {
    try {
      let res = await getAllKeyValues();
      if (res?.result?.length > 0) {
        setProducTypes(res?.result);
      } else {
        setProducTypes([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getProductCode = (data) => {
    let Data = data
      ?.map((obj) => obj?.quotationMasterConfigJson)
      ?.flat()
      ?.map((obj) => {
        return {
          productCode: obj?.productCode,
          productName: obj?.productName,
        };
      });

    const uniqueArray = new Set();
    const uniqueRecords = Data?.filter((obj) => {
      const productCode = obj.productCode;
      if (!uniqueArray.has(productCode)) {
        uniqueArray.add(productCode);
        return true;
      }
      return false;
    });

    if (uniqueRecords?.length) {
      setProductCode(uniqueRecords);
    }
  };

  const getPackageData = async (data) => {
    let { productCode, productName } = data;

    let params = {
      status: [1],
      search_by: "product_key",
      search_val: productCode,
      uuid: uuid,
    };

    let res = await getPackageName(params);

    if (res?.data?.package_list_details) {
      let data = res?.data?.package_list_details?.map((obj) => {
        return {
          label: obj?.package_information?.package_name,
          value: obj?.package_information?.package_id,
          isDisabled: false,
          productName: productName,
        };
      });
      return data;
    }
  };

  const getBoardListHandler = async () => {
    let params = { params: { boardStage: 1, sapVisibility: 1 } };
    getBoardList(params)
      .then((res) => {
        let boardFormattedData = [];
        res?.data?.data?.forEach((element) => {
          boardFormattedData.push({
            value: element.board_id,
            label: element.name,
            isDisabled: false,
          });
          setBoardSelectData(boardFormattedData);
        });
      })
      .catch((err) => {
        if (err.response.status == 401) {
          getBoardListHandler();
        }
        console.error(err?.response);
      });
  };

  const getChildListHandler = async () => {
    let params = { params: { boardId: 180, syllabusId: 180 } };
    getChildList(params)
      .then((res) => {
        let classFormattedData = [];
        return res?.data?.data?.child_list.forEach((element) => {
          classFormattedData.push({
            value: element.syllabus_id,
            label: element.name,
            isDisabled: false,
          });
          setClassSelectData(classFormattedData);
        });
      })
      .catch((err) => {
        if (err.response.status == 401) {
          getChildListHandler();
        }
        console.error(err?.response);
      });
  };

  const getBundleAttr = (obj, index) => {
    let params = {
      bundle_id: obj?.productSelectTypeID,
      bundle_name: obj?.productItemName,
      bundle_variant_description: "",
      bundle_variant_hsn_code: "",
      bundle_variant_id: "",
      bundle_variant_mop: obj?.productItemMop,
      bundle_variant_mrp: obj?.productItemMrp,
      bundle_variant_name: obj?.itemVariantName,
      variant: obj?.hardwareItemProductType,
      cost: obj?.productItemSalePrice,
      count: obj?.productItemQuantity,
      packageName: "",
      hardwareBundleID: obj?._id,
      isTotalMRPCOST: obj?.productItemTotalPrice,
      isTotalMOPCOST: obj?.productItemMop,
      discount: obj?.productItemDiscountPercentage,
      message: "",
    };
    return params;
  };

  const getPartAttr = (obj, index) => {
    let params = {
      part_id: obj?.productSelectTypeID,
      part_name: obj?.productItemName,
      part_variant_description: "",
      part_variant_hsn_code: "",
      variant_id: obj?.productSelectVariantID,
      part_variant_mop: obj?.productItemMop,
      part_variant_mrp: obj?.productItemMrp,
      part_variant_name: obj?.itemVariantName,
      variant: obj?.hardwareItemProductType,
      cost: obj?.productItemSalePrice,
      count: obj?.productItemQuantity,
      packageName: "",
      hardwarePartID: obj?._id,
      isTotalMRPCOST: obj?.productItemTotalPrice,
      isTotalMOPCOST: obj?.productItemMop,
      discount: obj?.productItemDiscountPercentage,
      message: "",
    };
    return params;
  };

  const getServiceAttr = (obj, index) => {
    let params = {
      service_id: "",
      service_name: obj?.productItemName,
      duration: "",
      hsn_code: "",
      variant_id: "",
      service_mop: obj?.productItemMop,
      service_mrp: obj?.productItemMrp,
      service_description: "",
      package_details: "",
      cost: obj?.productItemSalePrice,
      duration: obj?.productItemDuration,
      serviceID: obj?._id,
      isTotalMRPCOST: obj?.productItemTotalPrice,
      isTotalMOPCOST: obj?.productItemMop,
      discount: obj?.productItemDiscountPercentage,
      quantity: obj?.productItemQuantity,
      message: "",
    };
    return params;
  };

  const getHardwareParams = () => {
    let params = quoteHardwareData?.map((obj) => {
      if (obj?.hardwareItemProductType === ProductQuoteType?.BUNDLE) {
        return getBundleAttr(obj);
      } else {
        return getPartAttr(obj);
      }
    });
    if (params?.length) {
      setHardwareDetail(params);
    }
  };

  const getServiceParams = () => {
    let params = quoteServicesData?.map((obj) => getServiceAttr(obj));

    if (params?.length) {
      setServiceDetail(params);
    }
  };

  const getRecommendBundleAttr = (obj, index) => {
    let params = {
      bundle_id: obj?.bundle_id,
      bundle_name: obj?.bundle_name,
      bundle_variant_description: obj?.bundle_variant_description,
      bundle_variant_hsn_code: obj?.bundle_variant_hsn_code,
      bundle_variant_id: obj?.bundle_variant_id,
      bundle_variant_mop: obj?.bundle_variant_mop,
      bundle_variant_mrp: obj?.bundle_variant_mrp,
      bundle_variant_name: obj?.bundle_variant_name,
      isTotalMRPCOST: obj?.bundle_variant_mrp,
      isTotalMOPCOST: obj?.bundle_variant_mop,
      discount: 0,
      message: "",
      variant: "Bundle",
      cost: obj?.bundle_variant_mrp,
      count: 1,
      packageName: obj?.package_name,
    };
    return params;
  };

  const getREcommendPartAttr = (obj, index) => {
    let params = {
      part_id: obj?.part_id,
      part_name: obj?.part_name,
      part_variant_description: obj?.part_variant_description,
      part_variant_hsn_code: obj?.part_variant_hsn_code,
      variant_id: obj?.part_variant_id,
      part_variant_mop: obj?.part_variant_mop,
      part_variant_mrp: obj?.part_variant_mrp,
      part_variant_name: obj?.part_variant_name,
      isTotalMRPCOST: obj?.part_variant_mrp,
      isTotalMOPCOST: obj?.part_variant_mop,
      variant: "Part",
      discount: 0,
      message: "",
      cost: obj?.part_variant_mrp,
      count: 1,
      packageName: obj?.package_name,
    };
    return params;
  };

  const getHardwareList = async () => {
    let params = {
      status: [1],
      search_by: "package_id",
      search_val: packageID,
      uuid: uuid,
    };

    let res = await getRecommendHardware(params);

    if (res?.data) {
      let bundleRecommend = res?.data?.bundle_recommendation?.map((obj) =>
        getRecommendBundleAttr(obj)
      );
      let partRecommend = res?.data?.part_recommendation?.map((obj) =>
        getREcommendPartAttr(obj)
      );
      let recommendData = [...bundleRecommend, ...partRecommend];
      if (recommendData?.length) {
        setRecommendHardware(recommendData);
      } else {
        setOpenHardware(true);
      }
    }
  };

  useEffect(() => {
    getOptionsData();
    getBoardListHandler();
    getChildListHandler();
  }, []);

  const getPackageOption = async (data) => {
    let productOption = [];
    Promise.all(
      data?.map(async (obj) => {
        let data = await getPackageData(obj);
        productOption.push(data);
        let Data = productOption?.flat()?.filter((obj) => obj);
        setPackageOption(Data);
      })
    );
  };

  const getInterestgroupKey = () => {
    var Data = quoteSoftwareData
      ?.filter((obj) => obj?.productName)
      ?.reduce((group, data) => {
        let date_value = data?.productName;
        group[date_value] = group[date_value] ?? [];
        group[date_value].push(data);
        return group;
      }, {});
    setSoftwareKeyList(Data);
  };

  useEffect(() => {
    if (quoteProductCode?.length) {
      getPackageOption(quoteProductCode);
    }
  }, [quoteProductCode]);

  useEffect(() => {
    if (quoteSoftwareData?.length) {
      getProductCode(quoteSoftwareData);
      getInterestgroupKey(quoteSoftwareData);
    }
  }, [quoteSoftwareData]);

  const getCustomKeyValue = (packageData, boardData, classData) => {
    let data = [
      { key: QuotaionFormFields["field3"]["label"], value: packageOption },
      { key: QuotaionFormFields["field4"]["label"], value: boardSelectData },
      { key: QuotaionFormFields["field5"]["label"], value: classSelectData },
    ];
    return data;
  };

  useEffect(() => {
    getCustomKeyValue(packageOption, boardSelectData, classSelectData);
  }, [packageOption, boardSelectData, classSelectData]);

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      to={`/authorised/quotation-list`}
      className={classes.breadcrumbsClass}
    >
      Quotation List
    </Link>,
    <Typography key="3" color="text.primary" fontWeight="600" fontSize="14px">
      {schoolDetails ? schoolDetails?.schoolName : ""}
    </Typography>,
  ];

  const getSoftwareData = (data, indexNo) => {
    if (data) {
      let newFields = [...softwareList];
      newFields[indexNo] = data;
      setSoftwareList(newFields);
    }
  };
  const getHardwareDataForApproval = (data) => {
    if (data) {
      setHardwareList(data);
    }
  };
  const getServiceDataForApproval = (data) => {
    if (data) {
      setServiceList(data);
    }
  };

  const checkFieldValidate = () => {
    let isSoftwareField = [];
    let isHardwareField = [];
    let isServiceField = [];

    softwareList?.flat()?.map((obj) =>
      obj?.dependentFields
        ?.filter(
          (obj) => obj?.fieldName !== QuotaionFormFields["field6"]["fieldName"]
        )
        ?.filter(
          (obj) => obj?.fieldName !== QuotaionFormFields["field9"]["fieldName"]
        )
        ?.map((obj) => {
          if (obj?.value === "") {
            isSoftwareField.push(true);
          } else {
            isSoftwareField.push(false);
          }
          return isSoftwareField;
        })
    );

    if (isSoftwareField?.includes(true)) {
      toast.error("Please Add Software fields");
      return;
    }

    if (serviceList?.length > 0) {
      for (const obj of serviceList) {
        if (obj?.quantity === "") {
          toast.error(`Please Add Quantity of ${obj?.service_name} Service`);
          isServiceField.push(true);
          break;
        }

        if (obj?.duration === "") {
          toast.error(`Please Add Duration of ${obj?.service_name} Service`);
          isServiceField.push(true);
          break;
        }
      }
    }

    if (isServiceField?.includes(true) && isServiceField?.length > 0) {
      return;
    }

    setShowApproval(false);
  };

  useEffect(() => {
    if (!(quoteHardwareData?.length === hardwareFillDetail?.length)) {
      getHardwareParams();
    }

    if (!(quoteServicesData?.length === serviceFillDetail?.length)) {
      getServiceParams();
    }
  }, [quoteHardwareData, quoteServicesData]);

  const getSoftwareValCheck = () => {
    setSoftwareValid(false);
  };

  const getSchoolDetails = () => {
    getSchoolBySchoolCode(schoolCode)
      .then((res) => {
        let details = res?.result;
        setSchoolDetails(details);
      })
      .catch((err) => console.error(err));
  };

  const showHardware = () => {
    if (quotation?.length) {
      let isHardwareExist = quotation
        ?.map((obj) => obj?.result)
        ?.flat()
        ?.map((obj) => obj?.isHardware);

      if (isHardwareExist?.includes(true)) {
        return true;
      }
    }
    return false;
  };

  const showServices = () => {
    if (quotation?.length) {
      let isServiceExist = quotation
        ?.map((obj) => obj?.result)
        ?.flat()
        ?.map((obj) => obj?.isServices);

      if (isServiceExist?.includes(true)) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (schoolCode) {
      getSchoolDetails();
    }
  }, [schoolCode]);

  return (
    <Page
      title="Edit Quotation | Extramarks"
      className="crm-page-wrapper crm-page-quotation"
    >
      <Breadcrumbs
        className={`listing-breadcrumbs ${classes.breadcrumbsBar}`}
        separator={<img src={BredArrow} />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
      <Grid sx={{ paddingBottom: "70px !important" }}>
        <SchoolDetailBox schoolCode={schoolCode} />

        {showApproval && (
          <Fragment>
            <Box className="crm-contract-software-container">
              {/* <Typography className={classes.heading}>SOFTWARE</Typography> */}
              {Object.entries(softwareKeyList)?.length > 0
                ? Object.entries(softwareKeyList)?.map((obj, index) => {
                    return (
                      <div key={index}>
                        <EditSoftwareDetail
                          softwareTableData={obj?.[1]}
                          productKey={producTypes}
                          getSoftwareData={getSoftwareData}
                          selectedInterest={obj?.[0]}
                          getCustomKeyValue={getCustomKeyValue()}
                          // isHardwareValid={isHardwareValid}
                          // isSoftwareValid={isSoftwareValid}
                          // isServiceValid={isServiceValid}
                          getSoftwareValCheck={getSoftwareValCheck}
                          indexNo={index}
                          packageOption={packageOption?.filter(
                            (data) => data?.productName === obj?.[0]
                          )}
                        />
                      </div>
                    );
                  })
                : ""}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "50px",
              }}
            >
              {!(hardwareFillDetail?.length > 0)
                ? !recommendHardware?.length
                  ? showHardware() &&
                    !hideHardwareBtn &&
                    packageID?.length > 0 && (
                      <Button
                        className={classes.hardwareBtn}
                        onClick={() => getHardwareList()}
                      >
                        Add Hardware
                      </Button>
                    )
                  : ""
                : ""}
              {!(serviceFillDetail?.length > 0)
                ? showServices() &&
                  !hideServiceBtn && (
                    <Button
                      className={classes.serviceBtn}
                      onClick={() => setOpenService(true)}
                    >
                      Add Service
                    </Button>
                  )
                : ""}
            </Box>
            <Box className={`crm-contract-hardware-container`}>
              {/* {hardwareList?.length > 0 && (
                <Typography className={classes.heading}>HARDWARE</Typography>
              )} */}
              <HardwareDetail
                open={openHardware}
                setOpen={setOpenHardware}
                setHideBtn={setHideHardwareBtn}
                recommendHardware={recommendHardware}
                getHardwareDataForApproval={getHardwareDataForApproval}
                hardwareFillDetail={hardwareFillDetail}
              />
            </Box>
            <Box className="crm-contract-service-container">
              <ServiceDetails
                open={openService}
                setOpen={setOpenService}
                setHideBtn={setHideServiceBtn}
                getServiceDataForApproval={getServiceDataForApproval}
                serviceFillDetail={serviceFillDetail}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "30px",
              }}
            >
              <Button
                className={classes.approvalBtn}
                onClick={() => {
                  checkFieldValidate();
                  // navigate("/authorised/add-quotation/quotation-detail-page")
                }}
              >
                Send for approval
              </Button>
            </Box>
          </Fragment>
        )}
        {!showApproval && (
          <QuotationDetailPage
            softwareList={softwareList?.flat()}
            hardwareList={hardwareList}
            serviceList={serviceList}
            schoolInfo={schoolDetails}
            interestData={softwareList?.flat()}
            quotationMasterConfigId={quotationMasterConfigId}
            quotationMaster={quotationMaster}
            isQuoteType={isQuotationType}
            isUpdate={true}
          />
        )}
      </Grid>
    </Page>
  );
};

export default EditQuotation;
