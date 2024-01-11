import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useStyles } from "../../css/Quotation-css";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { Fragment, useEffect, useRef, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { fetchSingleQuotation } from "../../config/services/quotationMapping";
import { getAllKeyValues } from "../../config/services/crmMaster";
import { getBdeActivity } from "../../config/services/school";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import {
  handleKeyDown,
  handleKeyTextDown,
  handlePaste,
  handleTextPaste,
} from "../../helper/randomFunction";
import moment from "moment";
import ReactSelect from "react-select";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  FieldCode,
  QuotaionFormFields,
  productType,
} from "../../constants/general";
import { toast } from "react-hot-toast";
import { getUserData } from "../../helper/randomFunction/localStorage";
import {
  getPackagePrice,
  getPackagePriceAttribute,
  listPackageBundles,
} from "../../config/services/packageBundle";
import { getChildList } from "../../config/services/lead";
import { ReactComponent as DropDownIcon } from "../../assets/icons/icon-dropdown-2.svg";
import { ReactComponent as IconRecordDelete } from "../../assets/icons/icon-quotation-row-delete.svg";

export const SoftwareDetail = ({
  softwareTableData,
  productKey,
  attributeID,
  thOption,
  getSoftwareData,
  selectedInterest,
  getCustomKeyValue,
  softwareData,
  isHardwareValid,
  isSoftwareValid,
  isServiceValid,
  packageOption,
  getSoftwareValCheck,
  indexNo,
}) => {
  const classes = useStyles();
  const [rowCount, setRowCount] = useState(1);
  const [softwareDetail, setSoftwareDetail] = useState([]);
  const [isFieldValid, setFieldValid] = useState("");
  const [isRowAdded, setRowAdd] = useState(false);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "170px",
    }),
    // ... other style overrides
  };

  const isErrorStyles = {
    control: (provided) => ({
      ...provided,
      width: "170px", // Adjust the width here as per your requirement
      border: "1px solid red",
      // Add any other custom styling you want
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 1000, // Adjust the z-index value as needed
    }),
    // ... other style overrides
  };

  const [formData, setFormData] = useState({});
  const [productCode, setProductCode] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [productId, setProductID] = useState("");
  const [leadID, setLeadID] = useState("");
  const [productName, setProductName] = useState("");
  const debounceTimerRef = useRef(null);
  const getPackageTimesRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quotationMasterConfigId, setMasterConfigID] = useState("");
  const [quotationMasterConfigData, setMasterConfigData] = useState("");

  const handleMenuOpen = () => {
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const getOptionData = (key) => {
    let option = productKey
      ? productKey?.filter((obj) => obj?.key === key)?.[0]?.value
      : [];
    if (option?.length > 0) {
      option = option?.map((obj) => ({
        label: obj,
        value: obj,
      }));
      return option;
    }
    return option;
  };

  useEffect(() => {
    if (softwareTableData) {
      addCommonDetail(softwareTableData);
    }
  }, [softwareTableData]);

  const addCommonDetail = (data) => {
    setProductCode(data?.productCode);
    setGroupCode(data?.groupCode);
    setProductID(data?.productId);
    setLeadID(data?.leadId);
    setProductName(data?.productName);
    setMasterConfigID(data?.quotationMasterConfigId);
    setMasterConfigData(data?.quotationMasterConfigJson);
  };

  function isValueDuplicated(arr, value) {
    const filteredArray = arr.filter((item) => item === value);
    return filteredArray?.length > 1;
  }

  const getPackageListBundle = async (key, obj, rowIndex, fieldIndex) => {
    var newFields = [...formData];
    var ClassIds = [];

    const packageData = newFields[rowIndex].dependentFields?.find(
      (obj) => obj.fieldName === QuotaionFormFields["field3"]["fieldName"]
    );

    const isBoardDataOption = getCustomKeyValue
      ? getCustomKeyValue?.filter(
          (obj) => obj?.key === QuotaionFormFields["field4"]["label"]
        )?.[0]?.value
      : [];

    let params = {
      uuid: getUserData("loginData")?.uuid,
      search_by: "package_id",
      search_val: packageData?.value?.value,
      status: [1],
    };

    let boardData = newFields[rowIndex].dependentFields?.find(
      (obj) => obj.fieldName === QuotaionFormFields["field4"]["fieldName"]
    );


    try {
      let res = await listPackageBundles(params);
     
      if (res?.data?.package_list_details[0]?.package_contents?.length > 0) {
        const boardIds = res.data.package_list_details[0].package_contents
          .map((item) => item.board_id)
          ?.filter((obj) => obj != null);
          

        if (boardIds?.length > 0) {
          let uniqueSet = new Set(boardIds);
          let uniqueArray = Array.from(uniqueSet);
          let isBoardOption = isBoardDataOption?.filter(
            (option) => uniqueArray?.includes(option.value)
          );
          boardData["isPackageBasedOption"] = isBoardOption;
        }

        if(!boardIds?.length > 0) {
          boardData["isPackageBasedOption"] =  isBoardDataOption
        }

        setFormData(newFields);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getChildListHandler = async (rowIndex) => {
    var newFields = [...formData];
    var boardID;

    let boardData = newFields[rowIndex].dependentFields?.find(
      (obj) => obj.fieldName === QuotaionFormFields["field4"]["fieldName"]
    );

    let classData = newFields[rowIndex].dependentFields?.find(
      (obj) => obj.fieldName === QuotaionFormFields["field5"]["fieldName"]
    );

    boardID = boardData?.value?.value;
    let params = { params: { boardId: boardID, syllabusId: boardID } };

    let classFormattedData = [];
    try {
      let res = await getChildList(params);
      res?.data?.data?.child_list.forEach((element) => {
        classFormattedData.push({
          value: element.syllabus_id,
          label: element.name,
          isDisabled: false,
        });
        classData["isPackageBasedOption"] = classFormattedData;
        setFormData(newFields);
      });
      return classFormattedData;
    } catch (err) {
      console.error(err);
    }
  };


  const getCustomOption = (key, rowIndex, isPackageOption) => {
    let newFields = [...formData];
    let hasDuplicateValue;
    var isSelectedBoard;
    
    // let option = getCustomKeyValue
    //   ? getCustomKeyValue?.filter((obj) => obj?.key === key)?.[0]?.value
    //   : [];

    let option = isPackageOption?.length ? isPackageOption : [];

    if (key === QuotaionFormFields["field5"]["label"]) {
      isSelectedBoard = newFields[rowIndex]?.dependentFields?.find(
        (obj) => obj.fieldName === QuotaionFormFields["field4"]["fieldName"]
      )?.value?.label;

      var isAddedBoard = formData
        ?.map((obj) => obj?.dependentFields)
        ?.flat()
        .filter(
          (obj) => obj?.fieldName === QuotaionFormFields["field4"]["fieldName"]
        )
        ?.map((obj) => obj?.value?.label)
        ?.filter((obj) => obj);

      if (isAddedBoard?.length && isSelectedBoard) {
        hasDuplicateValue = isValueDuplicated(isAddedBoard, isSelectedBoard);
      }
    }

    let isExistOption = [];
    if (key === QuotaionFormFields["field5"]["label"] && hasDuplicateValue) {
      isExistOption = formData
        ?.map((obj) => obj?.dependentFields)
        ?.flat()
        ?.filter((obj) => obj?.label === key)
        ?.map((obj) => obj?.value)
        ?.filter((obj) => obj);

      isExistOption = isExistOption
        ?.filter((obj) => obj?.boardLabel === isSelectedBoard)
        ?.map((obj) => obj?.label);

      option = option?.map((obj) => {
        if (isExistOption?.includes(obj?.label)) {
          return {
            ...obj,
            isDisabled: true,
          };
        } else {
          return obj;
        }
      });
    }

    if (option?.length > 0) {
      return option;
    }
    return option;
  };

  const handleChange = (key, data, e, rowIndex, fieldIndex) => {
    if (data?.fieldType === "Pick-list") {
      let newFields = [...formData];
      newFields[rowIndex].dependentFields[fieldIndex]["value"] = e.value;
      setFormData(newFields);
    } else if (data?.fieldType === "customSelectTag") {
      let newFields = [...formData];
      let boardData = newFields[rowIndex].dependentFields?.find(
        (obj) => obj.fieldName === QuotaionFormFields["field4"]["fieldName"]
      );
      if (key === QuotaionFormFields["field5"]["label"]) {
        newFields[rowIndex].dependentFields[fieldIndex]["value"] = {
          ...e,
          boardLabel: boardData?.value?.label,
        };
      } else {
        newFields[rowIndex].dependentFields[fieldIndex]["value"] = e;
      }
      setFormData(newFields);
    } else if (data?.fieldType === "Date") {
      let date = moment(new Date(e)).format("YYYY-MM-DD");
      let newFields = [...formData];
      newFields[rowIndex].dependentFields[fieldIndex]["value"] = date;
      setFormData(newFields);
    } else {
      let newFields = [...formData];
      newFields[rowIndex].dependentFields[fieldIndex]["value"] = e.target.value;
      setFormData(newFields);
    }
  };

  const renderSelectTag = (key, obj, rowIndex, fieldIndex) => {
    let labelText = obj.label?.replace("*", "")?.trim();
    return (
        <Select
          className="width-100px crm-form-input crm-form-select2 dark"
          //classNamePrefix="select"
          //options={getOptionData(labelText)}
          value={{ label: obj?.value, value: obj?.value } || ""}
          onChange={(e) => {
            handleChange(key, obj, e.target.value, rowIndex, fieldIndex);
            getPackageAttribute(key, obj, e.target.value, rowIndex, fieldIndex);
            if (formData?.length) var newFields = [...formData];
            newFields[rowIndex].message = "";
            let ratePerMonthField = newFields[rowIndex].dependentFields?.find(
              (obj) =>
                obj.fieldName === QuotaionFormFields["field1"]["fieldName"]
            );

            let costPerMonthField = newFields[rowIndex].dependentFields?.find(
              (obj) =>
                obj.fieldName === QuotaionFormFields["field2"]["fieldName"]
            );
            ratePerMonthField["value"] = "";
            costPerMonthField["value"] = "";
            setFormData(newFields);
            
          }}
          renderValue={(selected => selected?.value)}
          styles={!isFieldValid ? { ...customStyles } : { ...isErrorStyles }}
          IconComponent={DropDownIcon}
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left"
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left"
            },
            classes: { paper: 'crm-contract-software-select' }
          }}
        >
          {getOptionData(labelText).map((obj) => (
            <MenuItem  key={obj.value} value={obj} className={`crm-contract-software-select-menuitem ` + (obj?.isDisabled ? `Mui-disabled`: ``)}>
              <ListItemText primary={obj.label} />
          </MenuItem>
        ))}

        </Select>
    );
  };

  const renderCustomSelectTag = (key, obj, rowIndex, fieldIndex) => {
    let labelText = obj.label?.replace("*", "")?.trim();
    let isPackageOption = obj?.isPackageBasedOption?.map((obj) => obj?.value);
    return (
        <Select
          className="width-100px crm-form-input crm-form-select2 dark"
          //classNamePrefix="select"
          // options={
          //   obj.fieldName === QuotaionFormFields["field3"]["fieldName"]
          //     ? packageOption
          //     : getCustomOption(labelText, rowIndex)?.filter((option) =>
          //         isPackageOption?.includes(option?.value)
          //       )?.length > 0
          //     ? getCustomOption(labelText, rowIndex)?.filter((option) =>
          //         isPackageOption?.includes(option?.value)
          //       )
          //     : getCustomOption(labelText, rowIndex)
          // }
          
          // value={
          //   obj?.value === "object"
          //     ? obj.value
          //     : getCustomOption(labelText)?.find(
          //         (data) => data?.value === obj?.value
          //       )
          // }
          value={obj?.value}
          renderValue={selected => selected?.label}
          onChange={(e) => {
            handleChange(key, obj, e, rowIndex, fieldIndex);
            getCustomOption(labelText, rowIndex, isPackageOption);
            getPackageAttribute(key, obj, e, rowIndex, fieldIndex);
            if (formData?.length) var newFields = [...formData];
            newFields[rowIndex].message = "";
            let ratePerMonthField = newFields[rowIndex]?.dependentFields?.find(
              (obj) =>
                obj.fieldName === QuotaionFormFields["field1"]["fieldName"]
            );

            let costPerMonthField = newFields[rowIndex]?.dependentFields?.find(
              (obj) =>
                obj.fieldName === QuotaionFormFields["field2"]["fieldName"]
            );
            ratePerMonthField["value"] = "";
            costPerMonthField["value"] = "";
            setFormData(newFields);
            if (obj.fieldName === QuotaionFormFields["field3"]["fieldName"]) {
              let boardData = newFields[rowIndex].dependentFields?.find(
                (obj) =>
                  obj.fieldName === QuotaionFormFields["field4"]["fieldName"]
              );

              let classData = newFields[rowIndex].dependentFields?.find(
                (obj) =>
                  obj.fieldName === QuotaionFormFields["field5"]["fieldName"]
              );
              boardData["value"] = "";
              classData["value"] = "";
              setFormData(newFields);
              getPackageListBundle(key, obj, rowIndex, fieldIndex);
            }
            if (obj.fieldName === QuotaionFormFields["field4"]["fieldName"]) {
              getChildListHandler(rowIndex);
            }
          }}
          styles={
            !isFieldValid || obj?.value
              ? { ...customStyles }
              : { ...isErrorStyles }
          }
          IconComponent={DropDownIcon}
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left"
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left"
            },
            classes: { paper: 'crm-contract-software-select' }
          }}
        >
          {
            (obj.fieldName === QuotaionFormFields["field3"]["fieldName"]
              ? packageOption
              : getCustomOption(labelText, rowIndex)?.filter((option) =>
                  isPackageOption?.includes(option?.value)
                )?.length > 0
              ? getCustomOption(labelText, rowIndex)?.filter((option) =>
                  isPackageOption?.includes(option?.value)
                )
              : getCustomOption(labelText, rowIndex)
            )
            .map((obj) => (
                <MenuItem key={obj.value} value={obj} className={`crm-contract-software-select-menuitem ` + (obj?.isDisabled ? `Mui-disabled`: ``)}>
                  {obj.label}
              </MenuItem>
            ))
          }
        </Select>
    );
  };

  const renderTextField = (key, obj, rowIndex, fieldIndex) => {
    return (
          <input
            className={`width-100px ` +
              !obj?.isReadOnly
                ? !isFieldValid || obj?.value
                  ? classes.inputStyle
                  : classes.inputBorderStyle
                : classes.inputStyle
            }
            name="name"
            type="text"
            placeholder={!obj?.isReadOnly ? "Enter Value" : ""}
            value={obj?.value || ""}
            onChange={(e) => {
              handleChange(key, obj, e, rowIndex, fieldIndex);
              getPackageAttribute(key, obj, e, rowIndex, fieldIndex);
              if (formData?.length) var newFields = [...formData];
              newFields[rowIndex].message = "";
              let ratePerMonthField = newFields[rowIndex].dependentFields?.find(
                (obj) =>
                  obj.fieldName === QuotaionFormFields["field1"]["fieldName"]
              );

              let costPerMonthField = newFields[rowIndex].dependentFields?.find(
                (obj) =>
                  obj.fieldName === QuotaionFormFields["field2"]["fieldName"]
              );
              ratePerMonthField["value"] = "";
              costPerMonthField["value"] = "";
              setFormData(newFields);
            }}
            readOnly={obj?.isReadOnly ? true : false}
            onKeyDown={handleKeyTextDown}
            onPaste={handleTextPaste}
          />
    );
  };

  const renderNumberField = (key, obj, rowIndex, fieldIndex) => {
    var newFields = [...formData];
    return (
      <>
          <input
            className={`crm-form-input dark width-80px ` +
              (!obj?.isReadOnly
                ? !isFieldValid || obj?.value
                  ? classes.inputStyle
                  : classes.inputBorderStyle
                : classes.inputStyle)
            }
            name="name"
            type="number"
            placeholder={!obj?.isReadOnly ? "" : ""}
            value={obj?.value || ""}
            readOnly={obj?.isReadOnly ? true : false}
            onChange={(e) => {
              handleChange(key, obj, e, rowIndex, fieldIndex);
              isPriceCalculate(key, obj, e, rowIndex, fieldIndex);
              newFields[rowIndex].message = "";
              if (
                obj?.fieldName === QuotaionFormFields["field2"]["fieldName"]
              ) {
                isCostCheck(key, obj, e, rowIndex, fieldIndex);
              }
              if (
                !(obj?.fieldName === QuotaionFormFields["field2"]["fieldName"])
              ) {
                getPackageAttribute(key, obj, e, rowIndex, fieldIndex);

                let ratePerMonthField = newFields[
                  rowIndex
                ].dependentFields?.find(
                  (obj) =>
                    obj.fieldName === QuotaionFormFields["field1"]["fieldName"]
                );

                let costPerMonthField = newFields[
                  rowIndex
                ].dependentFields?.find(
                  (obj) =>
                    obj.fieldName === QuotaionFormFields["field2"]["fieldName"]
                );
                ratePerMonthField["value"] = "";
                costPerMonthField["value"] = "";
                setFormData(newFields);
              }
            }}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
          />
          {obj?.fieldName === QuotaionFormFields["field2"]["fieldName"] &&
            newFields[rowIndex]?.message && (
              <span className={classes.isError}>
                {newFields[rowIndex]?.message}
              </span>
            )}
      </>
    );
  };

  const renderDateField = (key, obj, rowIndex, fieldIndex) => {
    return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                className="customDatePicker width-100px"
                value={obj?.value || ""}
                inputProps={{ readOnly: true }}
                onChange={(e) => {
                  handleChange(key, obj, e, rowIndex, fieldIndex);
                  getPackageAttribute(key, obj, e, rowIndex, fieldIndex);
                  if (formData?.length) var newFields = [...formData];
                  let ratePerMonthField = newFields[
                    rowIndex
                  ].dependentFields?.find(
                    (obj) =>
                      obj.fieldName ===
                      QuotaionFormFields["field1"]["fieldName"]
                  );

                  let costPerMonthField = newFields[
                    rowIndex
                  ].dependentFields?.find(
                    (obj) =>
                      obj.fieldName ===
                      QuotaionFormFields["field2"]["fieldName"]
                  );
                  ratePerMonthField["value"] = "";
                  costPerMonthField["value"] = "";
                  setFormData(newFields);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
          </LocalizationProvider>
    );
  };

  const renderView = (key, data, rowIndex, fieldIndex) => {
    if (data?.fieldType === "Pick-list") {
      return renderSelectTag(key, data, rowIndex, fieldIndex);
    } else if (data?.fieldType === "Integer") {
      return renderNumberField(key, data, rowIndex, fieldIndex);
    } else if (data?.fieldType === "Date") {
      return renderDateField(key, data, rowIndex, fieldIndex);
    } else if (data?.fieldType === "customSelectTag") {
      return renderCustomSelectTag(key, data, rowIndex, fieldIndex);
    } else if (data?.fieldType === "hiddenField") {
      return <></>;
    } else {
      return renderTextField(key, data, rowIndex, fieldIndex);
    }
  };

  useEffect(() => {
    if (Object.keys(softwareTableData ? softwareTableData : {})?.length > 0) {
      setFormData([softwareTableData]);
    }
  }, [softwareTableData]);

  const addNewRow = () => {
    if (formData?.length > 0) {
      let data = formData?.[0]?.dependentFields;
      data = data?.map((obj) => {
        return {
          ...obj,
          value: "",
        };
      });

      let newRowID = rowCount + 1;
      setRowCount(newRowID);

      let newRowObj = {
        MOP: "",
        MRP: "",
        isUnitMRP: "",
        isUnitMOP: "",
        message: "",
        rowID: newRowID,
        groupCode: groupCode,
        leadId: leadID,
        productCode: productCode,
        productId: productId,
        productName: productName,
        quotationMasterConfigId: quotationMasterConfigId,
        quotationMasterConfigJson: quotationMasterConfigData,
        ID: "",
        dependentFields: data,
      };
      setFieldValid(false);
      getSoftwareValCheck(false);
      // getSoftwareData(newRowObj);
      setFormData([...formData, newRowObj]);
    }
  };

  const addRow = (key) => {
    if (formData?.length > 0) {
      let data = formData?.[0]?.dependentFields;

      data = data?.map((obj) => {
        return {
          ...obj,
          value: key[obj["fieldCode"]],
        };
      });

      let newRowID = rowCount + 1;
      setRowCount(newRowID);

      let newRowObj = {
        rowID: newRowID,
        ID: key?._id,
        dependentFields: data,
      };

      setFormData([...formData, newRowObj]);
    }
    return true;
  };

  const addNewObj = () => {
    if (!(softwareData?.length < formData?.length)) {
      softwareData?.map((obj) => {
        if (!(softwareData?.length === formData?.length - 1)) {
          addRow(obj);
        }
      });
    }
  };

  useEffect(() => {
    if (softwareData?.length) {
      addNewObj();
    }
  }, [softwareData]);

  const removeRow = (rowID) => {
    let data = formData?.filter((obj) => obj?.rowID != rowID);
    setFormData(data);
  };

  const isPriceCalculate = (key, obj, event, rowIndex, fieldIndex) => {
    let newFields = [...formData];
    if (newFields[rowIndex].dependentFields[fieldIndex]["isCalculated"]) {
      let isMOPPrice = newFields[rowIndex]["MOP"];
      let isMRPPrice = newFields[rowIndex]["MRP"];
      let fieldValue = newFields[rowIndex].dependentFields[fieldIndex]["value"];
      let ratePerMonthField = newFields[rowIndex].dependentFields?.find(
        (obj) => obj.fieldName === QuotaionFormFields["field1"]["fieldName"]
      );

      let costPerMonthField = newFields[rowIndex].dependentFields?.find(
        (obj) => obj.fieldName === QuotaionFormFields["field2"]["fieldName"]
      );

      let monthlyDiscount = newFields[rowIndex].dependentFields?.find(
        (obj) => obj.fieldName === QuotaionFormFields["field6"]["fieldName"]
      );
      if (fieldValue) {
        if (ratePerMonthField) {
          ratePerMonthField["value"] = fieldValue * isMRPPrice;
          costPerMonthField["value"] = fieldValue * isMRPPrice;
        }
      }
    }
    setFormData(newFields);
  };

  const isCostCheck = (key, obj, event, rowIndex, fieldIndex) => {
    clearTimeout(debounceTimerRef.current);

    // Set a new timer to execute the function after a delay
    debounceTimerRef.current = setTimeout(() => {
      let newFields = [...formData];
      let eventVal = event.target.value;
      let isMOPPrice = newFields[rowIndex]["MOP"];
      let isMRPPrice = newFields[rowIndex]["MRP"];

      let isUpdatedMOP = newFields[rowIndex]["isUpdatedMop"];
      let isUpdatedMRP = newFields[rowIndex]["isUpdatedMRP"];

      let ratePerMonthField = newFields[rowIndex].dependentFields?.find(
        (obj) => obj.fieldName === QuotaionFormFields["field1"]["fieldName"]
      );

      let monthlyDiscount = newFields[rowIndex].dependentFields?.find(
        (obj) => obj.fieldName === QuotaionFormFields["field6"]["fieldName"]
      );

      if (monthlyDiscount) {
        if (!(Number(eventVal) > isMRPPrice)) {
          if (Number(eventVal) < isMOPPrice) {
            // toast.error("Your Monthly Cost is less MOP Cost");
            let value = ((isMRPPrice - eventVal) / isMRPPrice) * 100;
            monthlyDiscount["value"] = value.toFixed(2);
            newFields[rowIndex].message =
              "Your Monthly Cost is less from MOP Cost";
          } else {
            let value = ((isMRPPrice - eventVal) / isMRPPrice) * 100;
            monthlyDiscount["value"] = value.toFixed(2);
            newFields[rowIndex].message = "";
          }
        } else {
          monthlyDiscount["value"] = "0";
          newFields[rowIndex].message = "";
        }
      }
      setFormData(newFields);
    }, 2000); // Adjust the debounce delay as needed
  };

  const getMonthlyPrice = async (
    key,
    obj,
    event,
    rowIndex,
    fieldIndex,
    params
  ) => {
    try {
      let res = await getPackagePrice(params);

      let newFields = [...formData];

      let ratePerMonthField = newFields[rowIndex].dependentFields?.find(
        (obj) => obj.fieldName === QuotaionFormFields["field1"]["fieldName"]
      );

      let costPerMonthField = newFields[rowIndex].dependentFields?.find(
        (obj) => obj.fieldName === QuotaionFormFields["field2"]["fieldName"]
      );

      let monthlyDiscount = newFields[rowIndex].dependentFields?.find(
        (obj) => obj.fieldName === QuotaionFormFields["field6"]["fieldName"]
      );

      let productItemTotalPrice = newFields[rowIndex].dependentFields?.find(
        (obj) => obj.fieldName === QuotaionFormFields["field7"]["fieldName"]
      );

      if (res?.data?.package_price_details) {
        let isMRPPrice = res?.data?.package_price_details?.package_mrp;
        let isMOPPrice = res?.data?.package_price_details?.package_mop;

        if (isMOPPrice && isMRPPrice) {
          newFields[rowIndex]["MOP"] = isMOPPrice;
          newFields[rowIndex]["MRP"] = isMRPPrice;
          newFields[rowIndex]["isUnitMRP"] = isMRPPrice;
          newFields[rowIndex]["isUnitMOP"] = isMOPPrice;
        }

        let isCalculatedVal = newFields[rowIndex].dependentFields
          ?.filter((obj) => obj?.isCalculated)
          ?.map((obj) => obj?.value)
          ?.reduce((acc, cost) => {
            const currentValueAsNumber = parseFloat(cost);
            return acc * currentValueAsNumber;
          }, 1);

        ratePerMonthField = newFields[rowIndex].dependentFields?.find(
          (obj) => obj.fieldName === QuotaionFormFields["field1"]["fieldName"]
        );

        productItemTotalPrice = newFields[rowIndex].dependentFields?.find(
          (obj) => obj.fieldName === QuotaionFormFields["field7"]["fieldName"]
        );

        costPerMonthField = newFields[rowIndex].dependentFields?.find(
          (obj) => obj.fieldName === QuotaionFormFields["field2"]["fieldName"]
        );

        if (ratePerMonthField && isMRPPrice && isMRPPrice) {
          if (!isCalculatedVal) {
            ratePerMonthField["value"] = isMRPPrice;
            costPerMonthField["value"] = isMRPPrice;
            productItemTotalPrice["value"] = isMRPPrice;
            monthlyDiscount["value"] = "0";
          } else {
            ratePerMonthField["value"] = isMRPPrice;
            productItemTotalPrice["value"] =
              isMRPPrice * Number(isCalculatedVal);
            costPerMonthField["value"] = isMRPPrice * Number(isCalculatedVal);
            newFields[rowIndex]["MOP"] = isMOPPrice * Number(isCalculatedVal);
            newFields[rowIndex]["MRP"] = isMRPPrice * Number(isCalculatedVal);
            monthlyDiscount["value"] = "0";
          }
        }
        setFormData(newFields);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getPackageAttribute = async (key, obj, event, rowIndex, fieldIndex) => {
    clearTimeout(getPackageTimesRef.current);

    getPackageTimesRef.current = setTimeout(async () => {
      var newFields = [...formData];

      const packageData = newFields[rowIndex].dependentFields?.find(
        (obj) => obj.fieldName === QuotaionFormFields["field3"]["fieldName"]
      );

      let params = {
        uuid: getUserData("loginData")?.uuid,
        package_id: packageData?.value?.value,
      };

      let isFieldCheck = newFields[rowIndex]?.dependentFields
        ?.filter(
          (obj) => obj?.fieldName !== QuotaionFormFields["field1"]["fieldName"]
        )
        ?.filter(
          (obj) => obj?.fieldName !== QuotaionFormFields["field2"]["fieldName"]
        )
        ?.filter(
          (obj) => obj?.fieldName !== QuotaionFormFields["field6"]["fieldName"]
        )
        ?.filter(
          (obj) => obj?.fieldName !== QuotaionFormFields["field7"]["fieldName"]
        )
        ?.filter(
          (obj) => obj?.fieldName !== QuotaionFormFields["field9"]["fieldName"]
        )
        ?.every((field) => field.value !== "");

      if (!isFieldCheck) {
        return;
      }

      try {
        let res = await getPackagePriceAttribute(params);

        if (res?.data?.attribute_details) {
          let response = res?.data?.attribute_details;

          let xFieldValue = newFields[rowIndex].dependentFields?.find(
            (obj) => obj.fieldCode === response?.x_axis_attribute_code
          );

          let yFieldValue = newFields[rowIndex].dependentFields?.find(
            (obj) => obj.fieldCode === response?.y_axis_attribute_code
          );

          if (xFieldValue) {
            xFieldValue["isPriceAttribute"] = true;
          }
          if (yFieldValue) {
            yFieldValue["isPriceAttribute"] = true;
          }

          setFormData(newFields);

          params = {
            ...params,
            product_id: productId,
            status: [1],
            search_by: {
              package_id: packageData?.value?.value,
              product_key: productCode,
              x_axis_attribute_id: response?.x_axis_attribute_id
                ? response?.x_axis_attribute_id
                : "",
              y_axis_attribute_id: response?.y_axis_attribute_id
                ? response?.y_axis_attribute_id
                : "",
              x_axis_sub_attribute_id: response?.x_sub_attribute_id
                ? response?.x_sub_attribute_id
                : "",
              y_axis_sub_attribute_id: response?.y_sub_attribute_id
                ? response?.y_sub_attribute_id
                : "",
              x_axis_value: xFieldValue?.value
                ? typeof xFieldValue === "object"
                  ? xFieldValue?.value?.value
                  : xFieldValue?.value
                : "",
              y_axis_value: yFieldValue?.value
                ? typeof yFieldValue === "object"
                  ? yFieldValue?.value?.value
                  : yFieldValue?.value
                : "",
            },
          };

          getMonthlyPrice(key, obj, event, rowIndex, fieldIndex, params);
        }
      } catch (err) {
        console.error(err);
      }
    }, 500);
  };

  useEffect(() => {
    if (formData?.length) {
      getSoftwareData(formData, indexNo);
    }
  }, [formData]);

  useEffect(() => {
    setFieldValid(isSoftwareValid);
  }, [isSoftwareValid]);

  return (
    <Box className={(formData.length) ? `crm-contract-list-has-item` : ``}>
      {formData.length > 0 && (
        <div>
          <Box className="crm-space-between">
            <Box className="">
              <Typography component={"h2"}>Software</Typography>
              <Typography className={classes.subText} sx={{mb: 2 }}>
                {`Product: ${selectedInterest}`}
              </Typography>
            </Box>
            <Button className="crm-btn crm-btn-outline" onClick={() => addNewRow()} >Add Product</Button>
          </Box>
          <TableContainer
            component={Paper}
            sx={{
              // border: "1px solid #eee",
              overflowX: "auto",
            }}
            className="crm-table-container"
          >
            <Table
              sx={{ minWidth: 700, overflowX: "auto" }}
              aria-label="customized table"
            >
              <TableHead>
                <TableRow>
                  {softwareTableData?.dependentFields?.map((col, index) => (
                    <TableCell
                      align="left"
                      key={index}
                      sx={{
                        border: "none",
                        padding: "14px !important",
                        maxWidth: "2  00px", // Adjust this value as needed
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                      // data-info={softwareTableData?.dependentFields[index].fieldType}
                      className={(softwareTableData?.dependentFields[index].fieldType === "Integer") ? 'width-100px': `width-120px`}
                    >
                      {col?.fieldCode === FieldCode?.contractDuration ||
                      col?.fieldCode === FieldCode?.duration
                        ? `${col.label} (In Month)`
                        : col.label}
                    </TableCell>
                  ))}

                  <TableCell
                    key={`last-2-cell`}
                    align="left"
                    sx={{
                      border: "none",
                      padding: "14px !important",
                      maxWidth: "200px", // Adjust this value as needed
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  />
                  <TableCell
                    align="left"
                    key="last-1-cell"
                    // sx={{
                    //   border: "none",
                    //   padding: "14px !important",
                    //   position: "sticky",
                    //   right: 0,
                    // }}
                  />
                </TableRow>
              </TableHead>
              <TableBody>
                {formData?.length > 0 &&
                  formData?.map((data, rowIndex) => {
                    return (
                      <TableRow
                      key={rowIndex}
                        sx={{
                          "& td": {
                            border: 0,
                            padding: "14px !important",
                          },
                        }}
                      >
                        {data?.dependentFields?.map((obj, fieldIndex) => {
                          return (
                              <TableCell
                                align="left"
                                key={fieldIndex}
                                sx={{
                                  border: "none",
                                  padding: "14px !important",
                                  maxWidth: "200px", // Adjust this value as needed
                                  // overflow: "hidden",
                                  // whiteSpace: "nowrap",
                                  // textOverflow: "ellipsis",
                                }}
                                className={(obj?.fieldType === "Integer") ? 'width-100px': `width-120px`}
                              >
                                {renderView(
                                  obj?.label,
                                  obj,
                                  rowIndex,
                                  fieldIndex
                                )}
                              </TableCell>
                          );
                        })}

                        {rowIndex != 0 ? (
                          <TableCell
                            align="left"
                            sx={{
                              position: "sticky",
                              right: 0,
                              cursor: "pointer",
                              background: "#fff",
                            }}
                          >
                            <IconRecordDelete
                              sx={{ cursor: "pointer" }}
                              onClick={() => removeRow(data?.rowID)}
                            />
                          </TableCell>
                        ) : (
                          <TableCell></TableCell>
                        )}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          
        </div>
      )}
    </Box>
  );
};
