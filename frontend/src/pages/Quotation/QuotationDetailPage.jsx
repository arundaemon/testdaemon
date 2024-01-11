import {
  Box,
  Button,
  Divider,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import { Fragment, useEffect, useState } from "react";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { useStyles } from "../../css/Quotation-css";
import PercentIcon from "@mui/icons-material/Percent";
import {
  createQuotation,
  updateQuotation,
  updateQuotationStatus,
} from "../../config/services/quotationCRM";
import {
  CurrencySymbol,
  ProductQuoteType,
  QuotaionFormFields,
  QuoteType,
} from "../../constants/general";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { assignApprovalRequest } from "../../config/services/salesApproval";
import { CurrenncyFormatter } from "../../utils/utils";

const styles = {
  tableContainer: {
    backgroundColor: "#E2EBFF",
    margin: "30px auto",
    // width: "90%",
    borderRadius: "4px",
  },
  dividerLine: {
    marginLeft: "10px",
    width: "320%",
    borderWidth: "1px",
    borderColor: "#FFFFFF",
  },
  tableCell: {
    padding: "16px !important",
    border: "none",
  },
  footer: {
    display: "flex",
  },
  footerBox: {
    display: "flex",
    backgroundColor: "#FECB98",
    borderRadius: "10px",
    margin: "30px auto",
    padding: "20px",
    justifyContent: "space-between",
  },
  boxCss: {
    display: "flex",
    borderRight: "2px solid #FFFFFF !important",
  },
};

const QuotationDetailPage = ({
  softwareList,
  hardwareList,
  serviceList,
  schoolInfo,
  interestData,
  quotationMasterConfigId,
  quotationMaster,
  isUpdate,
  isQuoteType,
  quoteInterest,
}) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [softwareDataList, setSoftwareList] = useState([]);
  const [hardwareDataList, setHardwareList] = useState([]);
  const [serviceDataList, setServiceList] = useState([]);
  const [schoolData, setSchoolData] = useState(null);
  const [softwareKeyList, setSoftwareKeyList] = useState([]);
  const [shw_loader, setDisplayLoader] = useState(false);
  const [isTotalCost, setTotalCost] = useState({
    totalPrice: "",
    totalSaleprice: "",
    totalDiscount: "",
    totalDiscountPercentage: "",
  });

  const softwareHeading = softwareList[0]?.dependentFields.map(
    (software) => software.label
  );

  const softwareTableContent = softwareList[0].dependentFields;

  const getSoftwareHeading = (data) => {
    let Data = data?.[0]?.dependentFields
      ?.filter(
        (obj) => obj?.fieldName !== QuotaionFormFields["field9"]["fieldName"]
      )
      ?.map((software) => software.label);
    return Data;
  };

  const hardwareHeading = [
    "Type",
    "Product",
    "Variants",
    "MRP",
    "Quantity",
    "Cost",
    "Discount %",
    "Gross Value",
  ];

  const serviceHeading = [
    "Product Details",
    "Duration",
    "Cost",
    "Discount %",
    "Gross Value",
  ];

  let paramsObj = {
    quotationFor: isQuoteType,
    emailSendTo: "",
    emailSendCc: "",
    schoolId: schoolInfo?.leadId,
    schoolCode: schoolInfo?.schoolCode,
    schoolName: schoolInfo?.schoolName,
    schoolPinCode: schoolInfo?.schoolCode,
    schoolAddress: schoolInfo?.address,
    schoolEmailId: schoolInfo?.schoolEmailId,
    schoolCountryCode: schoolInfo?.countryCode,
    schoolCountryName: schoolInfo?.country,
    schoolType: "",
    schoolStateCode: schoolInfo?.stateCode,
    schoolStateName: schoolInfo?.state,
    schoolCityCode: "",
    schoolCityName: schoolInfo?.city,
    totalStudentForQuotation: "",
    totalTeacherForQuotation: "",
    approvalRequestRemark: "",
    quotationRemarks: "",
    quotationTypeDescription: "",
    quotationApprovalStatus: "",
    createdByName: getUserData("userData")?.name,
    createdByRoleName: getUserData("userData")?.crm_role,
    createdByProfileName: getUserData("userData")?.crm_profile,
    createdByEmpCode: getUserData("userData")?.username?.toUpperCase(),
    createdByUuid: getUserData("loginData")?.uuid,
    modifiedByName: getUserData("userData")?.name,
    modifiedByRoleName: getUserData("userData")?.crm_role,
    modifiedByProfileName: getUserData("userData")?.crm_profile,
    modifiedByEmpCode: getUserData("userData")?.username?.toUpperCase(),
    modifiedByUuid: getUserData("loginData")?.uuid,
  };

  let totalCost = 0;

  const getInterestgroupKey = () => {
    var Data = softwareDataList
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
    if (softwareDataList?.length) {
      getInterestgroupKey();
    }
  }, [softwareDataList]);

  const getSoftwareCost = (data) => {
    return data
      ?.map((obj) =>
        obj?.dependentFields
          ?.filter(
            (obj) =>
              obj?.fieldName === QuotaionFormFields["field2"]["fieldName"]
          )
          ?.map((obj) => obj?.value)
      )
      ?.reduce((acc, cost) => Number(acc) + Number(cost), 0);
  };

  softwareDataList?.map((obj) =>
    obj?.dependentFields
      ?.filter(
        (obj) => obj?.fieldName === QuotaionFormFields["field2"]["fieldName"]
      )
      ?.map((obj) => {
        totalCost = totalCost + Number(obj.value);
      })
  );

  const getHardwareTotalCost = hardwareDataList
    ?.map((obj) => obj?.cost)
    ?.reduce((acc, cost) => Number(acc) + Number(cost), 0);

  const getServiceTotalCost = serviceDataList
    ?.map((obj) => obj?.cost)
    ?.reduce((acc, cost) => Number(acc) + Number(cost), 0);

  const priceDisplayValue = (col) => {
    if (QuotaionFormFields?.field1?.fieldCode === col?.fieldCode) {
      return (
        <div className={classes.tableContainerBox}>
          <CurrencyRupeeIcon
            sx={{ position: "relative", top: "2px", fontSize: "14px" }}
          />
          {Number(col?.value)?.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })}
        </div>
      );
    }
    if (QuotaionFormFields?.field2?.fieldCode === col?.fieldCode) {
      return (
        <div className={classes.tableContainerBox}>
          <CurrencyRupeeIcon
            sx={{ position: "relative", top: "2px", fontSize: "14px" }}
          />
          {Number(col?.value)?.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })}
        </div>
      );
    }
    if (QuotaionFormFields?.field7?.fieldCode === col?.fieldCode) {
      return (
        <div className={classes.tableContainerBox}>
          <CurrencyRupeeIcon
            sx={{ position: "relative", top: "2px", fontSize: "14px" }}
          />
          {Number(col?.value)?.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })}
        </div>
      );
    }
    return typeof col.value === "object"
      ? col.value.label || "NA"
      : col.value || "NA";
  };

  const SoftwareQuotationTable = ({ type, header, content }) => {
    return (
      <div className="crm-school-quotation-contract-product">
        <Box className="crm-school-quotation-contract-product-header">
          <Typography component={"h3"}>Software</Typography>
          <Typography component={"p"}>{`${content?.[0]}`}</Typography>
        </Box>

        <TableContainer component={Paper} className="crm-table-container">
          <Table aria-label="customized table" sx={{ position: "relative" }}>
            <TableHead>
              <TableRow>
                {header.map((col, index) => (
                  <TableCell align="left" key={index} sx={styles.tableCell}>
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {content?.[1]?.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "& td": styles.tableCell,
                  }}
                >
                  {row?.dependentFields
                    ?.filter(
                      (obj) =>
                        obj?.fieldName !==
                        QuotaionFormFields["field9"]["fieldName"]
                    )
                    ?.map((col, index) => (
                      <TableCell align="left" key={index}>
                        {/* {typeof col.value === "object"
                        ? col.value.label || "NA"
                        : col.value || "NA"} */}
                        {priceDisplayValue(col)}
                      </TableCell>
                    ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box className="crm-school-quotation-contract-software-price">
          {
            <div>
              Total Price :{" "}
              <span>
                <CurrencyRupeeIcon
                  sx={{ position: "relative", top: "3px", fontSize: "18px" }}
                />
                {Number(getSoftwareCost(content?.[1]))?.toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits: 2,
                  }
                )}
                {/* {getSoftwareCost(content?.[1])} */}
              </span>
            </div>
          }
        </Box>
      </div>
    );
  };

  const QuotationHardwareTable = ({ type, header, content }) => {
    return (
      <Box className="crm-school-quotation-contract-hardware">
        <Typography className="crm-page-list-heading mb-2">{type}</Typography>
        <Box className="crm-school-quotation-contract-hardware-container">
          <TableContainer component={Paper} className="crm-table-container">
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  {header.map((col, index) => (
                    <TableCell align="left" key={index} sx={styles.tableCell}>
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {content.map((row, index) =>
                  row.variant === "Part" ? (
                    <TableRow
                      key={index}
                      sx={{
                        "& td": styles.tableCell,
                      }}
                    >
                      <TableCell align="left">{row?.variant}</TableCell>
                      <TableCell align="left">{row?.part_name}</TableCell>
                      <TableCell align="left">
                        {row?.part_variant_name}
                      </TableCell>
                      <TableCell align="left">
                        <div className={classes.tableContainerBox}>
                          <CurrencyRupeeIcon
                            sx={{
                              position: "relative",
                              top: "2px",
                              fontSize: "14px",
                            }}
                          />
                          {Number(row?.part_variant_mrp)?.toLocaleString(
                            "en-IN",
                            {
                              maximumFractionDigits: 2,
                            }
                          )}
                          {/* {row?.part_variant_mrp} */}
                        </div>
                        {/* {`${CurrencySymbol?.India}${row?.part_variant_mrp}`} */}
                      </TableCell>
                      <TableCell align="left">{row?.count}</TableCell>
                      <TableCell align="left">
                        {" "}
                        <div className={classes.tableContainerBox}>
                          <CurrencyRupeeIcon
                            sx={{
                              position: "relative",
                              top: "2px",
                              fontSize: "14px",
                            }}
                          />
                          {Number(row?.isTotalMRPCOST)?.toLocaleString(
                            "en-IN",
                            {
                              maximumFractionDigits: 2,
                            }
                          )}
                          {/* {row?.isTotalMRPCOST} */}
                        </div>
                        {/* {`${CurrencySymbol?.India}${row?.isTotalMRPCOST}`} */}
                      </TableCell>
                      <TableCell align="left">{row?.discount}</TableCell>
                      <TableCell align="left">
                        <div className={classes.tableContainerBox}>
                          <CurrencyRupeeIcon
                            sx={{
                              position: "relative",
                              top: "2px",
                              fontSize: "14px",
                            }}
                          />
                          {Number(row?.cost)?.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}
                          {/* {row?.cost} */}
                        </div>
                        {/* {`${CurrencySymbol?.India}${row?.cost}`} */}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow
                      sx={{
                        "& td": styles.tableCell,
                      }}
                    >
                      <TableCell align="left">{row?.variant}</TableCell>
                      <TableCell align="left">{row?.bundle_name}</TableCell>
                      <TableCell align="left">
                        {row?.bundle_variant_name}
                      </TableCell>
                      <TableCell align="left">
                        <div className={classes.tableContainerBox}>
                          <CurrencyRupeeIcon
                            sx={{
                              position: "relative",
                              top: "2px",
                              fontSize: "14px",
                            }}
                          />
                          {Number(row?.bundle_variant_mrp)?.toLocaleString(
                            "en-IN",
                            {
                              maximumFractionDigits: 2,
                            }
                          )}
                          {/* {row?.bundle_variant_mrp} */}
                        </div>
                        {/* {`${CurrencySymbol?.India}${row?.bundle_variant_mrp}`} */}
                      </TableCell>
                      <TableCell align="left">{row?.count}</TableCell>
                      <TableCell align="left">
                        <div className={classes.tableContainerBox}>
                          <CurrencyRupeeIcon
                            sx={{
                              position: "relative",
                              top: "2px",
                              fontSize: "14px",
                            }}
                          />
                          {Number(row?.isTotalMRPCOST)?.toLocaleString(
                            "en-IN",
                            {
                              maximumFractionDigits: 2,
                            }
                          )}
                          {/* {row?.isTotalMRPCOST} */}
                        </div>
                        {/* {`${CurrencySymbol?.India}${row?.isTotalMRPCOST}`} */}
                      </TableCell>
                      <TableCell align="left">{row?.discount}</TableCell>
                      <TableCell align="left">
                        <div className={classes.tableContainerBox}>
                          <CurrencyRupeeIcon
                            sx={{
                              position: "relative",
                              top: "2px",
                              fontSize: "14px",
                            }}
                          />
                          {Number(row?.cost)?.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}
                          {/* {row?.cost} */}
                        </div>
                        {/* {`${CurrencySymbol?.India}${row?.cost}`} */}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box className="crm-school-quotation-contract-hardware-price">
            {
              <div>
                Total Price :{" "}
                <span>
                  <CurrencyRupeeIcon
                    sx={{ position: "relative", top: "3px", fontSize: "18px" }}
                  />
                  {Number(getHardwareTotalCost)?.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                  {/* {getHardwareTotalCost} */}
                </span>
              </div>
            }
          </Box>
        </Box>
      </Box>
    );
  };

  const ServiceTable = ({ type, header, content }) => {
    return (
      <Box className="crm-school-quotation-contract-service">
        <Typography className="crm-page-list-heading mb-2">{type}</Typography>
        <Box className="crm-school-quotation-contract-service-container">
          <TableContainer component={Paper} className="crm-table-container">
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  {header.map((col, index) => (
                    <TableCell align="left" key={index} sx={styles.tableCell}>
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {content.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "& td": styles.tableCell,
                    }}
                  >
                    <TableCell align="left">{row?.service_name}</TableCell>
                    <TableCell align="left">{row?.duration}</TableCell>
                    <TableCell align="left">
                      <div className={classes.tableContainerBox}>
                        <CurrencyRupeeIcon
                          sx={{
                            position: "relative",
                            top: "2px",
                            fontSize: "14px",
                          }}
                        />
                        {Number(row?.isTotalMRPCOST)?.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                        {/* {row?.isTotalMRPCOST} */}
                      </div>
                      {/* {`${CurrencySymbol?.India}${row?.isTotalMRPCOST}`} */}
                    </TableCell>
                    <TableCell align="left">{row?.discount}</TableCell>
                    <TableCell align="left">
                      <div className={classes.tableContainerBox}>
                        <CurrencyRupeeIcon
                          sx={{
                            position: "relative",
                            top: "2px",
                            fontSize: "14px",
                          }}
                        />
                        {Number(row?.cost)?.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                        {/* {row?.cost} */}
                      </div>
                      {/* {`${CurrencySymbol?.India}${row?.cost}`} */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box className="crm-school-quotation-contract-service-price">
            {
              <div>
                Total Price :{" "}
                <span>
                  <CurrencyRupeeIcon
                    sx={{ position: "relative", top: "3px", fontSize: "18px" }}
                  />
                  {Number(getServiceTotalCost)?.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                  {/* {getServiceTotalCost} */}
                </span>
              </div>
            }
          </Box>
        </Box>
      </Box>
    );
  };

  const gethardwareData = () => {
    return hardwareDataList?.map((obj) => {
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
    return serviceDataList?.map((obj) => {
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

  const getSoftwareData = () => {
    const transformedArray = [];

    // Assuming softwareDataList is your original array
    softwareDataList?.forEach((obj) => {
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

  const getQuotationCost = () => {
    let isTotalPrice = [];
    let isTotalSaleprice = [];
    let isTotalDiscount = [];
    let isTotalDiscountPercentage = [];
    let isFinalCost;

    let data = [
      ...getSoftwareData(),
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

  const addQuotation = async () => {
    let data = [
      ...getSoftwareData()?.map((obj) => {
        return {
          ...obj,
          ...getQuotationCost(),
          ...paramsObj,
        };
      }),
      ...gethardwareData()?.map((obj) => {
        return {
          ...obj,
          ...getQuotationCost(),
          ...paramsObj,
        };
      }),
      ...getServiceData()?.map((obj) => {
        return {
          ...obj,
          ...getQuotationCost(),
          ...paramsObj,
        };
      }),
    ];

    const isQuoteInterestGroup = quoteInterest?.map(
      (obj) => obj?.learningProfileGroupCode
    )?.[0];

    const isInterestDataGroup = interestData?.map((obj) => obj?.groupCode)?.[0];

    let { createdByEmpCode, ...restParamsObj } = paramsObj;

    let params = {
      approvalType:
        isQuoteType === QuoteType?.isActual
          ? QuoteType?.isQuoationActual
          : QuoteType?.isQuoationDemo,
      groupCode: quoteInterest ? isQuoteInterestGroup : isInterestDataGroup,
      groupName: "",
      createdByRoleName: getUserData("userData")?.crm_role,
      referenceCode: "",

      data: {
        // createdByName: getUserData("userData")?.name,
        // createdByProfileName: getUserData("userData")?.crm_profile,
        // createdByEmpcode: getUserData("userData")?.employee_code,
        // createdByUuid: getUserData("loginData")?.uuid,
        ...restParamsObj,
        createdByEmpcode: createdByEmpCode,
        totalPrice: getQuotationCost()?.totalPrice,
        totalSaleprice: getQuotationCost()?.totalSaleprice,
        totalDiscount: getQuotationCost()?.totalDiscount,
        discountPercent: getQuotationCost()?.totalDiscountPercentage,
        approvalStatus: QuoteType?.isStatusPending,
        quotationDetail: data,
      },
    };

    let updateParams = {
      referenceCode: "",
      status: QuoteType?.isStatusDraft,
      // approvalStatus: QuoteType?.isStatusDraft,
      modifiedByName: getUserData("userData")?.name,
      modifiedByRoleName: getUserData("userData")?.crm_role,
      modifiedByProfileName: getUserData("userData")?.crm_profile,
      modifiedByEmpCode: getUserData("userData")?.employee_code,
      modifiedByUuid: getUserData("loginData")?.uuid,
    };

    let requestApprovalData;
    let approvalResponse;
    let isApprovalError;
    let isUpdateQuotationStatus;

    setDisplayLoader(true);

    try {
      let res = await createQuotation(data);
      if (res?.result?.length) {
        toast.success(res?.message);
        requestApprovalData = {
          ...params,
          referenceCode: res?.result?.[0]?.quotationCode,
          quotationCode: res?.result?.[0]?.quotationCode,
        };

        updateParams = {
          ...updateParams,
          referenceCode: res?.result?.[0]?.quotationCode,
        };

        approvalResponse = await assignApprovalRequest(requestApprovalData);
        if (approvalResponse?.data?.statusCode === 0) {
          isApprovalError =
            approvalResponse?.data?.error?.errorMessage ?? "Approval Error";
          toast.error(isApprovalError);
          isUpdateQuotationStatus = await updateQuotationStatus(updateParams);
        }
        setDisplayLoader(false);
        navigate("/authorised/quotation-list");
      }
    } catch (err) {
      setDisplayLoader(false);
      console.error(err);
    }
  };

  useEffect(() => {
    if (softwareList?.length) {
      setSoftwareList(softwareList);
    }
    if (hardwareList?.length) {
      setHardwareList(hardwareList);
    }
    if (serviceList?.length) {
      setServiceList(serviceList);
    }
    if (schoolInfo) {
      setSchoolData(schoolInfo);
    }
  }, [softwareList, hardwareList, serviceList, schoolInfo]);

  const currencySign = () => {
    return <CurrencyRupeeIcon fontSize="18px" sx={{ marginTop: "3px" }} />;
  };

  return (
    <Box className="123">
      <div>{shw_loader ? <LinearProgress /> : ""}</div>
      {Object.entries(softwareKeyList)?.length > 0 && (
        <>
          {Object.entries(softwareKeyList)?.map((obj) => {
            return (
              <SoftwareQuotationTable
                type={"Software"}
                header={getSoftwareHeading(obj?.[1])}
                content={obj}
              />
            );
          })}
        </>
      )}
      {hardwareList.length > 0 && (
        <QuotationHardwareTable
          type={"Hardware"}
          header={hardwareHeading}
          content={hardwareList}
        />
      )}
      {serviceList.length > 0 && (
        <ServiceTable
          type={"Service"}
          header={serviceHeading}
          content={serviceList}
        />
      )}
      <Box className="crm-school-quotation-contract-prices">
        <Box className="crm-school-quotation-contract-prices-container">
          <Box>
            <Box className="crm-school-quotation-contract-prices-info">
              Price : {"  "}
              <span>
                ₹
                {Number(totalCost)?.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
                /-
              </span>{" "}
              (Software) +{"   "}
              <span>
                ₹
                {Number(getHardwareTotalCost)?.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
                /-
              </span>{" "}
              (Hardware) +{"   "}
              <span>
                ₹
                {Number(getServiceTotalCost)?.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
                /-
              </span>{" "}
              (Services)
            </Box>
          </Box>
          <Box className="crm-school-quotation-contract-prices-list">
            <Typography className="crm-school-quotation-contract-prices-info">
              <span>Total MRP :</span>{" "}
              <span>
                {CurrenncyFormatter.format(getQuotationCost()?.totalPrice)}
              </span>
            </Typography>
            <Typography className="crm-school-quotation-contract-prices-info">
              <span>Total Discount :</span>{" "}
              <span>
                {Number(getQuotationCost()?.totalDiscountPercentage)
                  ?.toFixed(2)
                  .toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                <PercentIcon
                  sx={{
                    position: "relative",
                    top: "3px",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                />
                {/* {CurrenncyFormatter.format(
                  getQuotationCost()?.totalDiscountPercentage?.toFixed(2)
                )} */}
              </span>
            </Typography>
            <Typography className="crm-school-quotation-contract-prices-info">
              <span>Total Price :</span>{" "}
              <span>
                {CurrenncyFormatter.format(getQuotationCost()?.totalSaleprice)}
              </span>
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "30px",
        }}
      >
        {!shw_loader ? (
          <Button
            className={classes.approvalBtn}
            onClick={() => {
              addQuotation();
            }}
          >
            {!isUpdate ? "Submit" : "Update"}
          </Button>
        ) : (
          ""
        )}
      </Box>
    </Box>
  );
};

export default QuotationDetailPage;
