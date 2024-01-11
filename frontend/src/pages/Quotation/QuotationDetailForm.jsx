import {
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import { Fragment, useEffect, useRef, useState } from "react";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PercentIcon from "@mui/icons-material/Percent";
import { useStyles } from "../../css/Quotation-css";
import {
  createQuotation,
  getQuotationDetails,
  updateQuotationStatus,
} from "../../config/services/quotationCRM";
import {
  BDEACTIVITYKEYLABEL,
  CurrencySymbol,
  ProductQuoteType,
  QUOTATIONSOFTWAREKEY,
  QuotaionFormFields,
  QuoteType,
} from "../../constants/general";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { SchoolDetailBox } from "../../components/Quotation/SchoolDetailBox";
import ReactSelect from "react-select";
import { getSchoolBySchoolCode } from "../../config/services/school";
import { savePDF } from "../../modifiedlibraries/pdfExport/react-to-pdf-converter";
import { PurchaseOrderModal } from "../../components/purchaseOrder/PurchaseOrderModal";
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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
};

const QuotationDetailForm = ({
  isQuotationID,
  isQuotaion,
  isQuoteSchoolDetail,
}) => {
  const classes = useStyles();
  const navigate = useNavigate();
  let location = useLocation();

  let {
    softwareList,
    hardwareList,
    serviceList,
    schoolInfo,
    quotationCode,
    checkQuotation,
    routeType,
    modal3Status,
    page1Details,
  } = location?.state ? location?.state : [];

  const containerRef = useRef(null);
  const [softwareDataList, setSoftwareList] = useState([]);
  const [hardwareDataList, setHardwareList] = useState([]);
  const [serviceDataList, setServiceList] = useState([]);
  const [schoolData, setSchoolData] = useState(null);
  const [isContact, setContact] = useState(null);
  const [contactOption, setContactOption] = useState([]);
  const [isModal, setContactModal] = useState(false);
  const [schoolDetails, setSchoolDetails] = useState({});
  const [poModal, setPoModal] = useState(false);
  const [poDetails, setPoDetails] = useState();
  const [approveStatusCheck, setApproveStatusCheck] = useState(false);

  const [softwareKeyList, setSoftwareKeyList] = useState([]);

  const [quotationList, setQuotationList] = useState([]);
  const [shw_loader, setDisplayLoader] = useState(false);

  const softwareHeading = [
    "Product Details",
    "Units",
    "Duration",
    "Cost",
    "Total Price",
  ];

  const hardwareHeading = [
    "Product Details",
    "Units",
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

  let totalCost = 0;

  totalCost = softwareDataList
    ?.map((obj) => obj?.payCount)
    ?.reduce((acc, cost) => Number(acc) + Number(cost), 0);

  const getHardwareTotalCost = hardwareDataList
    ?.map((obj) => obj?.productItemSalePrice)
    ?.reduce((acc, cost) => Number(acc) + Number(cost), 0);

  const getServiceTotalCost = serviceDataList
    ?.map((obj) => obj?.productItemSalePrice)
    ?.reduce((acc, cost) => Number(acc) + Number(cost), 0);

  const getSoftwareCost = (data) => {
    return data
      ?.map((obj) =>
        obj?.quotationMasterConfigJson?.[0]?.dependentFields
          ?.filter(
            (obj) =>
              obj?.fieldName === QuotaionFormFields["field2"]["fieldName"]
          )
          ?.map((obj) => obj?.value)
      )
      ?.reduce((acc, cost) => Number(acc) + Number(cost), 0);
  };

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

  const SoftwareQuotationTable = ({ type, header, content, indexNo }) => {
    return (
      <div className="crm-school-quotation-contract-product">
        <Box className="crm-school-quotation-contract-product-header">
          {indexNo === 0 && <Typography component={"h3"}>Software</Typography>}
          <Typography component={"p"}>{`${content?.[0]}`}</Typography>
        </Box>
        <TableContainer component={Paper} className="crm-table-container">
          <Table aria-label="customized table" sx={{ position: "relative" }}>
            <TableHead>
              <TableRow>
                {header?.map((col, index) => (
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
                  {row?.quotationMasterConfigJson?.[0]?.dependentFields
                    ?.filter(
                      (obj) =>
                        obj?.fieldName !==
                        QuotaionFormFields["field9"]["fieldName"]
                    )
                    ?.map((col, index) => {
                      return (
                        <TableCell align="left" key={index}>
                          {/* {typeof col.value === "object"
                        ? col.value.label || "NA"
                        : col.value || "NA"} */}
                          {priceDisplayValue(col)}
                        </TableCell>
                      );
                    })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box className="crm-school-quotation-contract-software-price">
          {
            <div className="crm-contract-view-list-price">
              Total Price :{" "}
              <span>
                <CurrencyRupeeIcon
                  sx={{ position: "relative", top: "3px", fontSize: "18px" }}
                />
                {Number(getSoftwareCost(content?.[1])) > 0
                  ? Number(getSoftwareCost(content?.[1]))?.toLocaleString(
                      "en-IN",
                      {
                        maximumFractionDigits: 2,
                      }
                    )
                  : 0}
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
                  {header?.map((col, index) => (
                    <TableCell align="left" key={index} sx={styles.tableCell}>
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {content?.map((row, index) =>
                  row?.hardwareItemProductType === "Part" ? (
                    <TableRow
                      key={index}
                      sx={{
                        "& td": styles.tableCell,
                      }}
                    >
                      <TableCell align="left">{row?.productItemName}</TableCell>
                      <TableCell align="left">
                        {row?.productItemQuantity}
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
                          {Number(row?.productItemTotalPrice)?.toLocaleString(
                            "en-IN",
                            {
                              maximumFractionDigits: 2,
                            }
                          )}
                          {/* {row?.productItemTotalPrice} */}
                        </div>
                        {/* {`${CurrencySymbol?.India}${row?.productItemTotalPrice}`} */}
                      </TableCell>
                      <TableCell align="left">
                        {row?.productItemDiscountPercentage > 0
                          ? row?.productItemDiscountPercentage
                          : 0}
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
                          {Number(row?.productItemSalePrice)?.toLocaleString(
                            "en-IN",
                            {
                              maximumFractionDigits: 2,
                            }
                          )}
                          {/* {row?.productItemSalePrice} */}
                        </div>
                        {/* {`${CurrencySymbol?.India}${row?.productItemSalePrice}`} */}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow
                      sx={{
                        "& td": styles.tableCell,
                      }}
                    >
                      <TableCell align="left">{row?.productItemName}</TableCell>
                      <TableCell align="left">
                        {row?.productItemQuantity}
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
                          {Number(row?.productItemTotalPrice)?.toLocaleString(
                            "en-IN",
                            {
                              maximumFractionDigits: 2,
                            }
                          )}
                          {/* {row?.productItemTotalPrice} */}
                        </div>
                        {/* {`${CurrencySymbol?.India}${row?.productItemTotalPrice}`} */}
                      </TableCell>
                      <TableCell align="left">
                        {row?.productItemDiscountPercentage > 0
                          ? row?.productItemDiscountPercentage
                          : 0}
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
                          {Number(row?.productItemSalePrice)?.toLocaleString(
                            "en-IN",
                            {
                              maximumFractionDigits: 2,
                            }
                          )}
                          {/* {row?.productItemSalePrice} */}
                        </div>
                        {/* {`${CurrencySymbol?.India}${row?.productItemSalePrice}`} */}
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
                  {header?.map((col, index) => (
                    <TableCell align="left" key={index} sx={styles.tableCell}>
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {content?.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "& td": styles.tableCell,
                    }}
                  >
                    <TableCell align="left">{row?.productItemName}</TableCell>
                    <TableCell align="left">
                      {row?.productItemDuration}
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
                        {Number(row?.productItemTotalPrice)?.toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 2,
                          }
                        )}
                        {/* {row?.productItemTotalPrice} */}
                      </div>
                      {/* {`${CurrencySymbol?.India}${row?.productItemTotalPrice}`} */}
                    </TableCell>
                    <TableCell align="left">
                      {row?.productItemDiscountPercentage > 0
                        ? row?.productItemDiscountPercentage
                        : 0}
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
                        {Number(row?.productItemSalePrice)?.toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 2,
                          }
                        )}
                        {/* {row?.productItemSalePrice} */}
                      </div>
                      {/* {`${CurrencySymbol?.India}${row?.productItemSalePrice}`} */}
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

  const isContactDetail = () => {
    setContactModal(true);
  };

  const handleClose = () => {
    setContactModal(false);
  };

  useEffect(() => {
    getQuotationList(isQuotationID || quotationCode);
  }, [isQuotationID]);

  const getSchoolParams = (data) => {
    let params = {
      schoolName: data?.schoolName,
      schoolCode: data?.schoolCode,
      leadId: data?.leadId,
      typeOfInstitute: "",
      schoolEmailId: data?.schoolEmailId,
      country: data?.schoolCountryName,
      state: data?.schoolStateName,
      city: data?.schoolCityName,
      pinCode: data?.schoolPinCode,
      address: data?.schoolAddress,
      totalStudent: "",
      totalTeacher: "",
      board: "",
      classes: "",
    };
    setSchoolData(params);
  };

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

  const getSoftwareHeading = (data) => {
    let Data = data?.[0]?.quotationMasterConfigJson?.[0]?.dependentFields
      ?.filter(
        (obj) => obj?.fieldName !== QuotaionFormFields["field9"]["fieldName"]
      )
      ?.map((software) => software.label);
    return Data;
  };

  useEffect(() => {
    if (softwareDataList?.length) {
      getInterestgroupKey();
    }
  }, [softwareDataList]);

  const getQuotationList = async (isQuotationID) => {
    try {
      let res = await getQuotationDetails(isQuotationID);
      if (res?.result?.length) {
        let data = res?.result;
        setQuotationList(data);
        let softwareData = res?.result?.filter(
          (obj) => obj?.productItemCategory === ProductQuoteType?.SOFTWARE
        );
        let hardwareData = res?.result?.filter(
          (obj) => obj?.productItemCategory === ProductQuoteType?.HARDWARE
        );
        let serviceData = res?.result?.filter(
          (obj) => obj?.productItemCategory === ProductQuoteType?.SERVICE
        );

        let schoolDetail = res?.result?.[0];

        //PO Details
        if (schoolDetail) {
          let productDetails = [];
          for (let i = 0; i < data?.length; i++) {
            let item = data?.[i];
            let status = item?.approvalStatus?.toLowerCase();
            if (status === "approved") setApproveStatusCheck(true);
            if (
              status === "approved" &&
              !item?.isPoGenerated &&
              item?.productItemCategory?.toLowerCase() == "software"
            ) {
              productDetails.push({
                productCode: item?.productCode,
                productName: item?.productName,
                groupCode: item?.groupCode,
                groupName: item?.groupName,
              });
            }
          }
          let schoolData = {
            schoolCode: schoolDetail?.schoolCode,
            schoolName: schoolDetail?.schoolName,
          };

          setPoDetails({
            quotationCode: isQuotationID,
            createdDate: data?.[0]?.createdAt,
            productDetails,
            schoolData,
          });
        }

        if (schoolDetail) {
          getSchoolParams(schoolDetail);
        }

        if (softwareData?.length) {
          setSoftwareList(softwareData);
        }
        if (hardwareData?.length) {
          setHardwareList(hardwareData);
        }
        if (serviceData?.length) {
          setServiceList(serviceData);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  let paramsObj = {
    quotationFor: softwareDataList?.[0]?.quotationFor,
    emailSendTo: softwareDataList?.[0]?.emailSendTo,
    emailSendCc: softwareDataList?.[0]?.emailSendCc,
    schoolId: softwareDataList?.[0]?.schoolId,
    schoolCode: softwareDataList?.[0]?.schoolCode,
    schoolName: softwareDataList?.[0]?.schoolName,
    schoolPinCode: softwareDataList?.[0]?.schoolPinCode,
    schoolAddress: softwareDataList?.[0]?.schoolAddress,
    schoolEmailId: softwareDataList?.[0]?.schoolEmailId,
    schoolCountryCode: softwareDataList?.[0]?.schoolCountryCode,
    schoolCountryName: softwareDataList?.[0]?.schoolCountryName,
    schoolType: softwareDataList?.[0]?.schoolType,
    schoolStateCode: softwareDataList?.[0]?.schoolStateCode,
    schoolStateName: softwareDataList?.[0]?.schoolStateName,
    schoolCityCode: softwareDataList?.[0]?.schoolCityCode,
    schoolCityName: softwareDataList?.[0]?.schoolCityName,
    totalStudentForQuotation: softwareDataList?.[0]?.totalStudentForQuotation,
    totalTeacherForQuotation: softwareDataList?.[0]?.totalTeacherForQuotation,
    approvalRequestRemark: softwareDataList?.[0]?.approvalRequestRemark,
    quotationRemarks: softwareDataList?.[0]?.quotationRemarks,
    quotationTypeDescription: softwareDataList?.[0]?.quotationTypeDescription,
    quotationApprovalStatus: softwareDataList?.[0]?.quotationApprovalStatus,
    createdByName: softwareDataList?.[0]?.createdByName,
    createdByRoleName: softwareDataList?.[0]?.createdByRoleName,
    createdByProfileName: softwareDataList?.[0]?.createdByProfileName,
    createdByEmpCode: softwareDataList?.[0]?.createdByEmpCode,
    createdByUuid: softwareDataList?.[0]?.createdByUuid,
    modifiedByName: softwareDataList?.[0]?.modifiedByName,
    modifiedByRoleName: softwareDataList?.[0]?.modifiedByRoleName,
    modifiedByProfileName: softwareDataList?.[0]?.modifiedByProfileName,
    modifiedByEmpCode: softwareDataList?.[0]?.modifiedByEmpCode,
    modifiedByUuid: softwareDataList?.[0]?.modifiedByUuid,
    totalPrice: softwareDataList?.[0]?.totalPrice,
    totalSaleprice: softwareDataList?.[0]?.totalSaleprice,
    totalDiscount: softwareDataList?.[0]?.totalDiscount,
    discountPercent: softwareDataList?.[0]?.totalDiscountPercentage,
  };

  const isApprovalRequest = async () => {
    let item = softwareDataList?.[0];
    let quoteItem = quotationList
      ?.map((obj) => obj?.data)
      ?.flat()
      ?.filter((obj) => obj?.quotationCode === item?.quotationCode);

    let referenceCode = item?.quotationCode;
    let isQuoteType =
      item?.quotationFor === QuoteType?.isActual
        ? QuoteType?.isQuoationActual
        : QuoteType?.isQuoationDemo;
    let isGroupCode = item?.groupCode;
    let isGroupName = item?.groupName;
    let approvalResponse;
    let isApprovalError;
    let isUpdateQuotationStatus;

    let { createdByEmpCode, ...restParamsObj } = paramsObj;
    let params = {
      approvalType: isQuoteType,
      groupCode: isGroupCode,
      groupName: isGroupName,
      createdByRoleName: getUserData("userData")?.crm_role,
      referenceCode: referenceCode,
      quotationCode: referenceCode,

      data: {
        ...restParamsObj,
        createdByEmpcode: createdByEmpCode,
        quotationDetail: item,
      },
    };

    let updateParams = {
      referenceCode: referenceCode,
      status: QuoteType?.isStatusDraft,
      approvalStatus: QuoteType?.isStatusDraft,
      modifiedByName: getUserData("userData")?.name,
      modifiedByRoleName: getUserData("userData")?.crm_role,
      modifiedByProfileName: getUserData("userData")?.crm_profile,
      modifiedByEmpCode: getUserData("userData")?.employee_code,
      modifiedByUuid: getUserData("loginData")?.uuid,
    };

    setDisplayLoader(true);
    try {
      approvalResponse = await assignApprovalRequest(params);

      if (approvalResponse?.data?.statusCode === 0) {
        setDisplayLoader(false);
        isApprovalError =
          approvalResponse?.data?.error?.errorMessage ?? "Approval Error";
        toast.error(isApprovalError);
        isUpdateQuotationStatus = await updateQuotationStatus(updateParams);
        if (isUpdateQuotationStatus) {
          navigate("/authorised/quotation-list");
          window.location.reload(false);
        }
      } else {
        setDisplayLoader(false);
        let isUpadeParams = {
          ...updateParams,
          status: QuoteType?.isStatusNew,
          approvalStatus: QuoteType?.isStatusNew,
        };
        isUpdateQuotationStatus = await updateQuotationStatus(isUpadeParams);
        if (isUpdateQuotationStatus) {
          navigate("/authorised/quotation-list");
        }
      }
    } catch (err) {
      setDisplayLoader(false);
      console.error(err);
    }
  };

  const getSchoolDetails = (data) => {
    data = data?.schoolCode;
    getSchoolBySchoolCode(data)
      .then((res) => {
        let details = res?.result;
        setSchoolDetails(details);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getSchoolDetails(schoolData);
  }, [schoolData]);

  const getContactOptions = () => {
    let option = schoolDetails?.contactDetails
      ?.map((obj) => {
        return {
          label: obj?.name,
          value: obj?.emailId,
        };
      })
      ?.filter((obj) => obj?.label);
    return option;
  };

  const downloadQuotationHandler = () => {
    let quoteName = new Date().toLocaleTimeString().split(":").join("");
    let element = containerRef.current;
    let fieldName = softwareDataList?.[0]?.quotationCode
      ? `Quotation-${softwareDataList?.[0]?.quotationCode}-${quoteName}`
      : `Quotation-${quoteName}`;
    savePDF(
      element,
      {
        paperSize: "auto",
        margin: 40,
        fileName: fieldName,
      },
      () => {
        window.close();
      }
    );
  };

  const handleUploadPO = () => {
    if (!approveStatusCheck) {
      toast.dismiss();
      toast.error("Quotation is not Approved!");
      return;
    }
    if (poDetails?.productDetails?.length == 0) {
      toast.dismiss();
      toast.error("Purchase order already generated for this quotation");
      return;
    }

    navigate("/authorised/quotation-upload-po", {
      state: {
        quotationData: poDetails,
      },
    });
    //setPoModal(!poModal);
  };

  const getQuotationCost = () => {
    let isTotalPrice = [];
    let isTotalSaleprice = [];
    let isTotalDiscount = [];
    let isTotalDiscountPercentage = [];
    let isFinalCost;

    let data = [...softwareDataList, ...hardwareDataList, ...serviceDataList];

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
    <>
      {poDetails?.productDetails?.length > 0 && (
        <PurchaseOrderModal
          quotationData={poDetails}
          modal2={poModal}
          setModal2={setPoModal}
          page1Details={page1Details}
        />
      )}

      {modal3Status != null ? (
        <PurchaseOrderModal
          quotationData={poDetails}
          modal3Status={modal3Status}
          page1Details={page1Details}
        />
      ) : null}
      <Box
        className={routeType === "page" ? "crm-quotation-detail-wrapper" : ""}
      >
        <div ref={containerRef} data-info={modal3Status}>
          {schoolData && isQuoteSchoolDetail && (
            <SchoolDetailBox schoolCode={schoolData?.schoolCode} />
          )}

          {Object.entries(softwareKeyList)?.length > 0 && (
            <>
              {Object.entries(softwareKeyList)?.map((obj, index) => {
                return (
                  <SoftwareQuotationTable
                    type={"Software"}
                    header={getSoftwareHeading(obj?.[1])}
                    content={obj}
                    indexNo={index}
                    key={index}
                  />
                );
              })}
            </>
          )}
          {hardwareDataList?.length > 0 && (
            <QuotationHardwareTable
              type={"Hardware"}
              header={hardwareHeading}
              content={hardwareDataList}
            />
          )}
          {serviceDataList?.length > 0 && (
            <ServiceTable
              type={"Service"}
              header={serviceHeading}
              content={serviceDataList}
            />
          )}
          {/* <Box sx={styles.footerBox}>
            <Box sx={styles.footer}>
              <Box
                className={classes.label}
              >{`TOTAL : ${totalCost} (Software) + ${getHardwareTotalCost} (Hardware) + ${getServiceTotalCost} (Services) = Total Price : `}</Box>
              <CurrencyRupeeIcon fontSize="18px" sx={{ marginTop: "3px" }} />
              <Typography className={classes.label}>
                {totalCost + getHardwareTotalCost + getServiceTotalCost}
              </Typography>
            </Box>
           
          </Box> */}
          <Box className="crm-school-quotation-contract-prices">
            <Box className="crm-school-quotation-contract-prices-container">
              <Box>
                <Box className="crm-school-quotation-contract-prices-info">
                  <div>
                    Price :
                    <span>
                      <CurrencyRupeeIcon
                        sx={{
                          position: "relative",
                          top: "3px",
                          fontSize: "18px",
                        }}
                      />
                      {Number(totalCost)?.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                      / -{" "}
                    </span>
                    (Software) +
                    <span>
                      <CurrencyRupeeIcon
                        sx={{
                          position: "relative",
                          top: "3px",
                          fontSize: "18px",
                        }}
                      />
                      {Number(getHardwareTotalCost)?.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                      / -{" "}
                    </span>
                    (Hardware) +
                    <span>
                      <CurrencyRupeeIcon
                        sx={{
                          position: "relative",
                          top: "3px",
                          fontSize: "18px",
                        }}
                      />
                      {Number(getServiceTotalCost)?.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                      / -{" "}
                    </span>
                    (Services)
                  </div>
                  {/* + <span>₹{`${getHardwareTotalCost}`}/-</span>{" "}
                  (Hardware) + <span>₹{`${getServiceTotalCost}`}/-</span>{" "}
                  (Services) */}
                </Box>
              </Box>
              <Box>
                <Box className="crm-school-quotation-contract-prices-list">
                  <Typography className="crm-school-quotation-contract-prices-info">
                    Total MRP :
                    <span>
                      <CurrencyRupeeIcon
                        sx={{
                          position: "relative",
                          top: "3px",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      />
                      {/* {getQuotationCost()?.totalPrice} */}
                      {Number(getQuotationCost()?.totalPrice)?.toLocaleString(
                        "en-IN",
                        {
                          maximumFractionDigits: 2,
                        }
                      )}
                    </span>
                  </Typography>
                  <Typography className="crm-school-quotation-contract-prices-info">
                    Total Discount :
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
                      {/* {getQuotationCost()?.totalDiscountPercentage?.toFixed(2)} */}
                    </span>
                  </Typography>
                  <Typography className="crm-school-quotation-contract-prices-info">
                    Total Price :
                    <span>
                      <CurrencyRupeeIcon
                        sx={{
                          position: "relative",
                          top: "3px",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      />
                      {Number(
                        getQuotationCost()?.totalSaleprice
                      )?.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                      {/* {CurrenncyFormatter.format(
                        getQuotationCost()?.totalSaleprice
                      )} */}
                    </span>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </div>

        {!(softwareDataList?.[0]?.status === QuoteType?.isStatusDraft) ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "30px",
              gap: "10px",
            }}
          >
            {(isQuotaion || checkQuotation) && (
              <Button className={classes.approvalBtn} onClick={handleUploadPO}>
                Upload PO
              </Button>
            )}
            {(isQuotaion || checkQuotation) &&
              getContactOptions()?.length > 0 && (
                <Button
                  className={classes.approvalBtn}
                  onClick={() => isContactDetail()}
                >
                  E-Mail
                </Button>
              )}
            {(isQuotaion || checkQuotation) && (
              <Button
                className={classes.approvalBtn}
                onClick={() => downloadQuotationHandler()}
              >
                Download
              </Button>
            )}
          </Box>
        ) : (
          <Box className={classes.btnSection}>
            <Button
              className={classes.approvalBtn}
              onClick={() => isApprovalRequest()}
            >
              Send For Approval
            </Button>
          </Box>
        )}
      </Box>
      {isModal && (
        <Modal
          open={isModal}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              className={classes.label}
              sx={{ padding: "25px 20px 0 20px" }}
            >
              Send email to
            </Typography>
            <Grid sx={{ py: "8px" }}>
              <Grid item md={12} xs={12}>
                <Divider />
              </Grid>
              <Grid item md={12} xs={12} sx={{ p: "20px" }}>
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <Typography className={classes.label}>Contacts :</Typography>
                  <div style={{ width: "60%" }}>
                    <ReactSelect
                      classNamePrefix="select"
                      options={getContactOptions()}
                      value={isContact}
                      onChange={(e) =>
                        setContact({
                          label: e.label,
                          value: e.value,
                        })
                      }
                    />
                  </div>
                </div>
              </Grid>
              <Grid item md={12} xs={12} sx={{ p: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    width: "80%",
                    margin: "0 auto",
                    gap: "10px",
                  }}
                >
                  <a
                    href={`mailto:${isContact?.value}`}
                    className={
                      isContact?.value
                        ? classes.approvalBtn
                        : classes.disableContact
                    }
                    target="_blank"
                  >
                    Send
                  </a>
                  <Button
                    className={classes.approvalBtn}
                    onClick={() => handleClose()}
                  >
                    Cancel
                  </Button>
                </div>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default QuotationDetailForm;
