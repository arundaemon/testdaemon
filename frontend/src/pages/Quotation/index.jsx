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
import {
  ProductQuoteType,
  QuotaionFormFields,
  QuoteType,
  productType,
} from "../../constants/general";
import QuotationDetailPage from "./QuotationDetailPage";

import { toast } from "react-hot-toast";
import { getRecommendHardware } from "../../config/services/hardwareManagement";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { DisplayLoader } from "../../helper/Loader";
import IconBreadcrumbArrow from "./../../assets/icons/icon-breadcrumb-arrow.svg";
import { getTerritory } from "../../config/services/territoryMapping";
import { getApprovalMatrix } from "../../config/services/approvalMatrix";

const AddQuotation = () => {
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
  const loginData = getUserData("loginData");
  const uuid = loginData?.uuid;
  let location = useLocation();
  const [isSoftwareValid, setSoftwareValid] = useState(false);
  const [isHardwareValid, setHardwareValid] = useState(false);
  const [isServiceValid, setServiceValid] = useState(false);
  const [isHardwareShw, setHardwareShow] = useState(false);
  const [isServiceShw, setServiceShow] = useState(false);
  const [packageID, setPackageID] = useState([]);
  const [schoolDetails, setSchoolDetails] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [schoolInfo, setSchoolInfo] = useState(null);

  let { data, interest, quotationData, isQuoteType } = location?.state
    ? location?.state
    : {};

  // useEffect(() => {
  //   if (!location?.state?.interest) {
  //     toast.error("You Cannot Access Without Product");
  //     navigate("/authorised/school-list");
  //   }
  // }, []);

  const getQuotations = async (data) => {
    var { interestCode, activityData } = data;
    let isTeritoryResponse;
    let query = {
      stateCode: schoolInfo?.stateCode,
      cityName: schoolInfo?.cityName,
    };

    let params = {
      productCode: interestCode,
      quotationFor: isQuoteType,
    };

    try {
      const quotations = await fetchQuotationListDetails(params);

      let productName = interest?.find(
        (obj) => obj?.learningProfileCode === interestCode
      )?.learningProfile;

      if (!(quotations?.result?.length > 0)) {
        toast.error(`Quotaion Config is Not Created ${productName}`);
      }
      let tableHeading = quotations?.result[0].dependentFields;

      const calculatedField = quotations?.result[0].calculatedFields?.map(
        (obj) => obj?.fieldCode
      );

      const fieldApplicableFor = quotations?.result[0].dependentFields?.map(
        (obj) => {
          if (obj?.fieldApplicableFor) return obj;
        }
      );

      let arr = [];
      for (let item of tableHeading) {
        if (activityData?.length) {
          if (item["fieldCode"] in activityData[0]) {
            item["value"] = activityData[0][item["fieldCode"]];
            arr.push(item);
          } else {
            item["value"] = "";
            arr.push(item);
          }
        } else {
          item["value"] = "";
          arr.push(item);
        }
      }

      if (schoolInfo?.stateCode) {
        isTeritoryResponse = await getTerritory(query);
      }

      const finalArray = [
        {
          fieldName: QuotaionFormFields["field4"]["fieldName"],
          fieldCode: QuotaionFormFields["field4"]["fieldCode"],
          fieldType: "customSelectTag",
          isCalculated: false,
          label: QuotaionFormFields["field4"]["label"],
          value: "",
          required: true,
          isPackageBasedOption: [],
          isPriceAttribute: false,
        },
        {
          fieldName: QuotaionFormFields["field5"]["fieldName"],
          fieldCode: QuotaionFormFields["field5"]["fieldCode"],
          fieldType: "customSelectTag",
          isCalculated: false,
          label: QuotaionFormFields["field5"]["label"],
          value: "",
          required: true,
          isPackageBasedOption: [],
          isPriceAttribute: false,
        },
        {
          fieldName: QuotaionFormFields["field1"]["fieldName"],
          fieldCode: QuotaionFormFields["field1"]["fieldCode"],
          fieldType: "Integer",
          isCalculated: false,
          label: QuotaionFormFields["field1"]["label"],
          value: "",
          required: true,
          isReadOnly: true,
          isPriceAttribute: false,
        },
        {
          fieldName: QuotaionFormFields["field7"]["fieldName"],
          fieldCode: QuotaionFormFields["field7"]["fieldCode"],
          fieldType: "Integer",
          isCalculated: false,
          label: QuotaionFormFields["field7"]["label"],
          value: "",
          required: true,
          isReadOnly: true,
          isPriceAttribute: false,
        },
        {
          fieldName: QuotaionFormFields["field6"]["fieldName"],
          fieldCode: QuotaionFormFields["field6"]["fieldCode"],
          fieldType: "Integer",
          isCalculated: false,
          label: QuotaionFormFields["field6"]["label"],
          value: "",
          required: true,
          isReadOnly: true,
          isPriceAttribute: false,
        },
        {
          fieldName: QuotaionFormFields["field2"]["fieldName"],
          fieldCode: QuotaionFormFields["field2"]["fieldCode"],
          fieldType: "Integer",
          isCalculated: false,
          label: QuotaionFormFields["field2"]["label"],
          value: "",
          required: true,
          isPriceAttribute: false,
        },
        {
          fieldName: QuotaionFormFields["field3"]["fieldName"],
          fieldCode: QuotaionFormFields["field3"]["fieldCode"],
          fieldType: "customSelectTag",
          isCalculated: false,
          label: QuotaionFormFields["field3"]["label"],
          value: "",
          required: true,
          isPriceAttribute: false,
        },
        {
          fieldName: QuotaionFormFields["field9"]["fieldName"],
          fieldCode: isTeritoryResponse?.result?.territoryCode,
          fieldType: "hiddenField",
          isCalculated: false,
          label: QuotaionFormFields["field9"]["label"],
          value: "",
          required: true,
          isPriceAttribute: false,
        },
      ];

      finalArray?.forEach((obj) => {
        let lastIndex = arr?.length - 1;

        if (obj?.fieldName === QuotaionFormFields["field3"]["fieldName"]) {
          arr.unshift(obj);
        } else {
          arr.push(obj);
        }
      });

      let newObj = {
        rowID: rowCount,
        MOP: "",
        MRP: "",
        isUnitMRP: "",
        isUnitMOP: "",
        isUpdatedMop: "",
        isUpdatedMRP: "",
        message: "",
        productName: interest?.find(
          (obj) => obj?.learningProfileCode === interestCode
        )?.learningProfile,
        productCode: interest?.find(
          (obj) => obj?.learningProfileCode === interestCode
        )?.learningProfileCode,
        groupCode: interest?.find(
          (obj) => obj?.learningProfileCode === interestCode
        )?.learningProfileGroupCode,
        leadId: interest?.find(
          (obj) => obj?.learningProfileCode === interestCode
        )?.leadId,
        productId: interest?.find(
          (obj) => obj?.learningProfileCode === interestCode
        )?.learningProfileRefId,
        quotationMasterConfigId: quotations?.result?.[0]?._id,
        quotationMasterConfigJson: "",
        fieldApplicableFor: fieldApplicableFor,
        dependentFields: arr?.map((obj) => {
          if (calculatedField?.includes(obj?.fieldCode)) {
            return {
              ...obj,
              isCalculated: true,
            };
          } else {
            return {
              ...obj,
              isCalculated: false,
            };
          }
        }),
      };

      let tableHeadOptions = arr?.map((obj) => obj?.label);
      setTablehdOptions(tableHeadOptions);
      // setQuotation(quotations?.result[0]);

      let Data = {
        masterData: quotations,
        interestedProduct: newObj,
      };
      return Data;
      // setSoftwareTableData([...softwareTableData, newObj]);
    } catch (err) {
      console.log("Error while fetching Quotations : " + err);
    }
  };

  const addQuotaionField = async (data) => {
    let quotationData = [];
    let masterDataArray = [];
    try {
      Promise.all(
        data?.map(async (obj) => {
          let { masterData, interestedProduct } = await getQuotations(obj);
          quotationData.push(interestedProduct);
          masterDataArray.push(masterData);
          setQuotation(masterDataArray);
          setSoftwareTableData(quotationData);
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getPackageID = () => {
    let packageID = softwareList
      ?.flat()
      ?.map((obj) =>
        obj?.dependentFields?.filter(
          (obj) => obj?.fieldName === QuotaionFormFields["field3"]["fieldName"]
        )
      )
      ?.flat()
      ?.map((obj) => obj?.value?.value)
      ?.filter((obj) => obj);

    setPackageID(packageID);
  };

  useEffect(() => {
    if (schoolInfo) {
      addQuotaionField(quotationData);
    }
  }, [quotationData, schoolInfo]);

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

  const getPackageData = async (selectedProduct) => {
    let params = {
      status: [1],
      search_by: "product_key",
      search_val: selectedProduct?.learningProfileCode,
      uuid: uuid,
    };

    setLoading(true);

    try {
      let res = await getPackageName(params);

      if (res?.data?.package_list_details) {
        let data = res?.data?.package_list_details?.map((obj) => {
          return {
            label: obj?.package_information?.package_name,
            value: obj?.package_information?.package_id,
            isDisabled: false,
            productName: selectedProduct?.learningProfile,
          };
        });
        setLoading(false);
        return data;
      }
    } catch (err) {
      setLoading(true);
      console.error(err);
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
    let params = { params: { boardId: "180", syllabusId: "180" } };
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

  const getPartAttr = (obj, index) => {
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
      search_val: packageID?.map((obj) => obj),
      uuid: uuid,
    };

    try {
      let res = await getRecommendHardware(params);

      if (res?.data) {
        let bundleRecommend = res?.data?.bundle_recommendation?.map((obj) =>
          getBundleAttr(obj)
        );
        let partRecommend = res?.data?.part_recommendation?.map((obj) =>
          getPartAttr(obj)
        );
        let recommendData = [...bundleRecommend, ...partRecommend];
        if (recommendData?.length) {
          setRecommendHardware(recommendData);
        } else {
          if (!hideHardwareBtn) setOpenHardware(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (packageID?.length && hideHardwareBtn) {
      getHardwareList();
    }
  }, [packageID]);

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

  useEffect(() => {
    getPackageOption(interest);
  }, [interest]);

  useEffect(() => {
    getOptionsData();
    getBoardListHandler();
    getChildListHandler();
  }, []);

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

  useEffect(() => {
    if (softwareList?.flat()?.length) {
      getPackageID();
    }
  }, [softwareList]);

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      to={`/authorised/school-details/${data?.leadId}`}
      className={classes.breadcrumbsClass}
    >
      {data?.schoolName}
    </Link>,
    <Typography key="3" color="text.primary" fontWeight="600" fontSize="14px">
      Contract
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

  const redirectApprovalRequest = () => {
    if (softwareList?.length && serviceList?.length && hardwareList?.length)
      navigate("/authorised/quotation-approval", {
        state: {
          softwareList: softwareList?.flat(),
          hardwareList: hardwareList,
          serviceList: serviceList,
          schoolInfo: data,
          interestData: quotationData,
          quotationMasterConfigId: quotationMasterConfigId,
          quotationMaster: quotationMaster,
          isQuoteType: isQuoteType,
          quoteInterest: interest,
        },
      });
  };

  // const customCheckValidate = () => {
  //   let isSoftwareField = [];
  //   let isHardwareField = [];
  //   let isServiceField = [];

  //   softwareList?.flat()?.map((obj) =>
  //     obj?.dependentFields
  //       ?.filter(
  //         (obj) => obj?.fieldName !== QuotaionFormFields["field6"]["fieldName"]
  //       )
  //       ?.filter(
  //         (obj) => obj?.fieldName !== QuotaionFormFields["field9"]["fieldName"]
  //       )
  //       ?.map((obj) => {
  //         if (obj?.value === "") {
  //           isSoftwareField.push(true);
  //         } else {
  //           isSoftwareField.push(false);
  //         }
  //         return isSoftwareField;
  //       })
  //   );

  //   // hardwareList?.map((obj) => {
  //   //   if (obj?.cost === "") {
  //   //     isHardwareField.push(true);
  //   //   } else {
  //   //     isHardwareField.push(false);
  //   //   }
  //   // });

  //   // serviceList?.map((obj) => {
  //   //   if (obj?.cost === "") {
  //   //     isServiceField.push(true);
  //   //   } else {
  //   //     isServiceField.push(false);
  //   //   }
  //   // });

  //   if (isSoftwareField?.includes(true)) {
  //     setSoftwareValid(true);
  //     toast.error("Please enter the value of software fields");
  //     return;
  //   }

  //   // if (!hardwareList?.length && showHardware()) {
  //   //   toast.error("Please Add Hardware");
  //   //   return;
  //   // }

  //   // if (isHardwareField?.includes(true)) {
  //   //   setHardwareValid(true);
  //   //   toast.error("Please Add Cost In Hardware fields");
  //   //   return;
  //   // }

  //   // if (!serviceList?.length && showServices()) {
  //   //   toast.error("Please Add Services");
  //   //   return;
  //   // }

  //   // if (isServiceField?.includes(true)) {
  //   //   setServiceValid(true);
  //   //   toast.error("Please Add Cost In Service fields");
  //   //   return;
  //   // }

  //   // setShowApproval(false);
  // }
  
  
  const checkFieldValidate = async () => {
    let isSoftwareField = [];
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
      setSoftwareValid(true);
      toast.error("Please enter the value of software fields");
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

    let isPercentageResponse = await getApprovalPercentage();

    if (
      Number(isPercentageResponse?.max) >=
      Number(getQuotationCost()?.totalDiscountPercentage)
    ) {
      setShowApproval(false);
    } else {
      toast.error(
        `Discount should not be Greater than ${Number(
          isPercentageResponse?.max
        )} Percent`
      );
    }
  };

  const getApprovalPercentage = async () => {
    let params = {
      type:
        isQuoteType === QuoteType?.isActual
          ? QuoteType?.isQuoationActual
          : QuoteType?.isQuoationDemo,

      groupCode: interest?.map((obj) => obj?.learningProfileGroupCode)?.[0],
    };
    try {
      let res = await getApprovalMatrix(params);
      if (res?.result?.length) {
        let data = res?.result?.[0]?.approvalLevels;
        return data[data?.length - 1];
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getSoftwareValCheck = () => {
    setSoftwareValid(false);
  };

  const getSchoolData = (data) => {
    setSchoolDetails(data);
  };

  useEffect(() => {
    if (data) {
      setSchoolInfo(data);
    }
  }, [data]);

  const getSoftwareParams = () => {
    const transformedArray = [];

    // Assuming softwareDataList is your original array
    softwareList?.flat()?.forEach((obj) => {
      const dependentFields = obj?.dependentFields?.reduce((acc, field) => {
        if (
          field?.fieldCode === "boardName" ||
          field?.fieldCode === "className"
        ) {
          acc[field?.fieldCode] =
            typeof field?.value === "object"
              ? field?.value?.label
              : field?.fieldType === QuoteType?.isNumberField
              ? Number(field?.value)
              : field?.value;
        } else {
          acc[field?.fieldCode] =
            typeof field?.value === "object"
              ? field?.value?.value
              : field?.fieldType === QuoteType?.isNumberField
              ? Number(field?.value)
              : field?.value;
        }
        return acc;
      }, {});

      const fieldApplicableFor = obj?.fieldApplicableFor?.reduce(
        (acc, field) => {
          let fieldValue = obj?.dependentFields?.find(
            (obj) => obj?.fieldCode === field?.fieldCode
          );

          acc[field?.fieldApplicableFor] =
            typeof fieldValue?.value === "object"
              ? fieldValue?.value?.label
              : Number(fieldValue?.value);
          return acc;
        },
        {}
      );

      const productItemSalePrice = obj?.dependentFields
        ?.filter(
          (field) =>
            field?.fieldName === QuotaionFormFields["field2"]["fieldName"]
        )
        ?.reduce((acc, field) => acc + (Number(field?.value) || 0), 0);

      const resultObj = {
        productItemName: obj?.dependentFields?.find(
          (field) =>
            field?.fieldName === QuotaionFormFields["field3"]["fieldName"]
        )?.value?.label,
        productItemMrp: obj?.isUnitMRP,
        productItemMop: obj?.isUnitMOP,
        productItemTotalPrice: obj?.MRP,
        productItemSalePrice,
        productItemDiscount:
          Number(obj?.MRP) > Number(productItemSalePrice)
            ? Number(obj?.MRP) - Number(productItemSalePrice)
            : 0,
        productItemDiscountPercentage: Number(
          obj?.dependentFields?.find(
            (field) =>
              field?.fieldName === QuotaionFormFields["field6"]["fieldName"]
          )?.value
        ),
        productItemDuration: obj?.dependentFields?.find(
          (field) =>
            field?.fieldCode === QuotaionFormFields["field8"]["fieldName"]
        )?.value,
        productItemCategory: ProductQuoteType?.SOFTWARE,
        productCode: obj?.productCode,
        groupCode: obj?.groupCode,
        productName: obj?.productName,
        leadId: obj?.leadId,
        quotationMasterConfigId: obj?.quotationMasterConfigId,
        quotationMasterConfigJson: { ...obj, message: "" },
        boardID: obj?.dependentFields?.find(
          (field) =>
            field?.fieldName === QuotaionFormFields["field4"]["fieldName"]
        )?.value?.value,
        classID: obj?.dependentFields?.find(
          (field) =>
            field?.fieldName === QuotaionFormFields["field5"]["fieldName"]
        )?.value?.value,
        approvalStatus: QuoteType?.isStatusPending,
        status: QuoteType?.isStatusNew,
        ...fieldApplicableFor,
        ...dependentFields,
      };
      transformedArray.push(resultObj);
    });

    return transformedArray?.map((obj) => {
      return {
        ...obj,
        schoolBoardName: obj?.boardName,
        schoolBoardClasses: obj?.className,
      };
    });
  };

  const gethardwareData = () => {
    return hardwareList?.map((obj) => {
      const resultObj = {
        id:
          obj?.variant === QuoteType?.isBundle
            ? obj?.hardwareBundleID ?? null
            : obj?.hardwarePartID ?? null,
        productItemName:
          obj?.variant === QuoteType?.isBundle
            ? obj?.bundle_name
            : obj?.part_name,
        itemVariantName:
          obj?.variant === QuoteType?.isBundle
            ? obj?.bundle_variant_name
            : obj?.part_variant_name,
        productItemMrp:
          obj?.variant === QuoteType?.isBundle
            ? obj?.bundle_variant_mrp
            : obj?.part_variant_mrp,
        productItemMop:
          obj?.variant === QuoteType?.isBundle
            ? obj?.bundle_variant_mop
            : obj?.part_variant_mop,
        productItemQuantity: Number(obj?.count),
        productItemSalePrice: Number(obj?.cost),
        productItemTotalPrice: Number(obj?.isTotalMRPCOST),
        productItemDiscountPercentage: Number(obj?.discount),
        productItemDiscount:
          Number(obj?.isTotalMRPCOST) > Number(obj?.cost)
            ? Number(obj?.isTotalMRPCOST) - Number(obj?.cost)
            : 0,
        productItemCategory: ProductQuoteType?.HARDWARE,
        hardwareItemProductType: obj?.variant,
        productSelectTypeID:
          obj?.variant === QuoteType?.isBundle ? obj?.bundle_id : obj?.part_id,
        productSelectVariantID:
          obj?.variant === QuoteType?.isBundle
            ? obj?.bundle_variant_id
            : obj?.variant_id,
        ratePerUnit:
          obj?.variant === QuoteType?.isBundle
            ? obj?.bundle_variant_mrp
            : obj?.part_variant_mrp,
        approvalStatus: QuoteType?.isStatusPending,
        status: QuoteType?.isStatusNew,
        productItemRefId:
          obj?.variant === QuoteType?.isBundle
            ? obj?.bundle_variant_id
            : obj?.variant_id,
      };

      return resultObj;
    });
  };

  const getServiceData = () => {
    return serviceList?.map((obj) => {
      const resultObj = {
        serviceID: obj?.service_id ? obj?.service_id : null,
        productItemName: obj?.service_name,
        productItemMrp: obj?.service_mrp,
        ratePerUnit: obj?.service_mrp,
        productItemMop: obj?.service_mop,
        productItemDuration: Number(obj?.duration),
        productItemQuantity: Number(obj?.quantity),
        productItemSalePrice: Number(obj?.cost),
        productItemTotalPrice: Number(obj?.isTotalMRPCOST),
        productItemDiscountPercentage: Number(obj?.discount),
        productItemDiscount:
          Number(obj?.isTotalMRPCOST) > Number(obj?.cost)
            ? Number(obj?.isTotalMRPCOST) - Number(obj?.cost)
            : 0,
        productItemCategory: ProductQuoteType?.SERVICE,
        approvalStatus: QuoteType?.isStatusPending,
        productItemRefId: obj?.service_id,
        status: QuoteType?.isStatusNew,
      };
      return resultObj;
    });
  };

  const getQuotationCost = () => {
    let isTotalPrice = [];
    let isTotalSaleprice = [];
    let isTotalDiscount = [];
    let isTotalDiscountPercentage = [];
    let isFinalCost;

    let data = [
      ...getSoftwareParams(),
      ...gethardwareData(),
      ...getServiceData(),
    ];

    data?.map((obj) => {
      if (obj?.productItemTotalPrice) {
        isTotalPrice.push(obj?.productItemTotalPrice);
      }
      if (obj?.productItemSalePrice) {
        isTotalSaleprice.push(obj?.productItemSalePrice);
      }
      if (obj?.productItemDiscount) {
        isTotalDiscount.push(obj?.productItemDiscount);
      }
      if (obj?.productItemDiscountPercentage) {
        isTotalDiscountPercentage.push(obj?.productItemDiscountPercentage);
      }
    });

    isTotalPrice = isTotalPrice?.reduce(
      (acc, cost) => Number(acc) + Number(cost),
      0
    );

    isTotalSaleprice = isTotalSaleprice?.reduce(
      (acc, cost) => Number(acc) + Number(cost),
      0
    );

    isTotalDiscount = isTotalDiscount?.reduce(
      (acc, cost) => Number(acc) + Number(cost),
      0
    );

    if (!(isTotalPrice > isTotalSaleprice)) {
      isTotalDiscount = 0;
    }

    if (isTotalPrice > isTotalSaleprice) {
      isTotalDiscountPercentage =
        ((isTotalPrice - isTotalSaleprice) / isTotalPrice) * 100;
    } else {
      isTotalDiscountPercentage = 0;
    }

    isFinalCost = {
      totalPrice: isTotalPrice,
      totalSaleprice: isTotalSaleprice,
      totalDiscount: isTotalDiscount,
      totalDiscountPercentage: isTotalDiscountPercentage,
    };
    return isFinalCost;
  };

  return (
    <Page
      title="Add Quotation | Extramarks"
      className="crm-page-wrapper crm-page-quotation"
    >
      <Breadcrumbs
        className="crm-breadcrumbs"
        separator={<img src={IconBreadcrumbArrow} />}
        aria-label="breadcrumbs"
      >
        <Link
          underline="hover"
          key="1"
          color="inherit"
          to={`/authorised/school-details/${data?.leadId}`}
          className="crm-breadcrumbs-item breadcrumb-link"
        >
          {data?.schoolName}
        </Link>

        <Typography
          key="2"
          component="span"
          className="crm-breadcrumbs-item breadcrumb-active"
        >
          {" "}
          Contract{" "}
        </Typography>
      </Breadcrumbs>
      {!isLoading ? (
        <Grid
          // className={classes.cusCard}
          sx={{ paddingBottom: "70px !important" }}
        >
          <SchoolDetailBox
            schoolCode={data?.schoolCode}
            getSchoolData={getSchoolData}
          />

          {showApproval && (
            <Fragment>
              <Box className="crm-contract-software-container">
                {/* <Typography component={"h2"}>Software</Typography> */}
                {softwareTableData?.length > 0
                  ? softwareTableData?.map((obj, index) => {
                      return (
                        <div key={index}>
                          <SoftwareDetail
                            softwareTableData={obj}
                            productKey={producTypes}
                            attributeID={obj?.rowID}
                            thOption={thOption}
                            getSoftwareData={getSoftwareData}
                            selectedInterest={obj?.productName}
                            getCustomKeyValue={getCustomKeyValue()}
                            isHardwareValid={isHardwareValid}
                            isSoftwareValid={isSoftwareValid}
                            isServiceValid={isServiceValid}
                            getSoftwareValCheck={getSoftwareValCheck}
                            indexNo={index}
                            packageOption={packageOption?.filter(
                              (data) => data?.productName === obj?.productName
                            )}
                          />
                        </div>
                      );
                    })
                  : ""}
              </Box>

              <Box className={`crm-contract-hardware-container`}>
                <HardwareDetail
                  open={openHardware}
                  setOpen={setOpenHardware}
                  setHideBtn={setHideHardwareBtn}
                  recommendHardware={recommendHardware}
                  getHardwareDataForApproval={getHardwareDataForApproval}
                />
              </Box>
              <Box className="crm-contract-service-container">
                <ServiceDetails
                  open={openService}
                  setOpen={setOpenService}
                  setHideBtn={setHideServiceBtn}
                  getServiceDataForApproval={getServiceDataForApproval}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
                className={
                  `crm-contract-actions-list ` +
                  ((!recommendHardware?.length &&
                    showHardware() &&
                    !hideHardwareBtn &&
                    packageID?.length > 0) ||
                  softwareTableData?.length ||
                  (showServices() && !hideServiceBtn)
                    ? `crm-contract-action-has-item`
                    : ``)
                }
              >
                {softwareTableData?.length > 0 ? (
                  <Button
                    className="crm-btn crm-btn-outline crm-btn-md mr-1"
                    onClick={() => {
                      checkFieldValidate();
                      // navigate("/authorised/add-quotation/quotation-detail-page")
                    }}
                  >
                    Send for approval
                  </Button>
                ) : (
                  ""
                )}
                {!recommendHardware?.length
                  ? showHardware() &&
                    !hideHardwareBtn &&
                    packageID?.length > 0 && (
                      <Button
                        className="crm-btn crm-btn-outline crm-btn-md mr-1"
                        onClick={() => getHardwareList()}
                      >
                        Add Hardware
                      </Button>
                    )
                  : ""}
                {showServices() && !hideServiceBtn && (
                  <Button
                    className="crm-btn crm-btn-lg"
                    onClick={() => setOpenService(true)}
                  >
                    Add Services
                  </Button>
                )}
              </Box>
            </Fragment>
          )}

          {!showApproval && (
            <QuotationDetailPage
              softwareList={softwareList?.flat()}
              hardwareList={hardwareList}
              serviceList={serviceList}
              schoolInfo={data}
              quotationMasterConfigId={quotationMasterConfigId}
              quotationMaster={quotationMaster}
              isQuoteType={isQuoteType}
              quoteInterest={interest}
            />
          )}
        </Grid>
      ) : (
        <div className={classes.loader}>{DisplayLoader()}</div>
      )}
    </Page>
  );
};

export default AddQuotation;
