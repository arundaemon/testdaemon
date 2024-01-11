import {
  Box,
  Button,
  Paper,
  Table,
  TextField,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Autocomplete,
  Grid,
} from "@mui/material";
import React, { Fragment, useState, useEffect, useRef } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
  listHardwareBundleVariants,
  listHardwarePartVariants,
} from "../../config/services/hardwareManagement";

import { useStyles } from "../../css/Quotation-css";
import { getUserData } from "../../helper/randomFunction/localStorage";
import toast from "react-hot-toast";
import { QuoteType } from "../../constants/general";
import { handleKeyDown, handlePaste } from "../../helper/randomFunction";
import { ReactComponent as DropDownIcon } from "../../assets/icons/icon-dropdown-2.svg";
import { ReactComponent as IconClose } from "./../../assets/icons/icon-modal-close.svg";
import { ReactComponent as IconRecordDelete } from "../../assets/icons/icon-quotation-row-delete.svg";
import { ReactComponent as IconRecordAdd } from "../../assets/icons/icon-quotation-row-add.svg";

const styles = {
  tableContainer: { borderRadius: "4px", paddingBottom: "60px" },
  tableCellHead: { border: "none", padding: "14px !important" },
  textField: {
    width: 150,
    borderRadius: "8px",
    boxShadow: "0px 3px 5px #00000029",
    "& input": {
      height: "0px !important",
      textAlign: "center",
    },
  },
  counterBox: {
    border: "1px solid red",
    width: "100%",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "space-between",
    padding: "0 10px",
  },
  addMore: { textAlign: "right", paddingRight: "10px", cursor: "pointer" },
  dialog: {
    display: "block !important",
    "& .MuiDialog-container": {
      "& .MuiPaper-root": {
        width: "100%",
        maxWidth: "900px",
      },
    },
  },
  flex: { display: "flex", justifyContent: "space-between" },
  dialogAct: { justifyContent: "center !important", marginBottom: "15px" },
  tableCounter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    width: 150,
    borderRadius: "8px",
    marginRight: "20px",
    boxShadow: "0px 3px 5px #00000029",
  },
  autoCompleteCss: {
    width: 200,
    marginRight: "20px",
    borderRadius: "8px",
    padding: "0px !important",
    boxShadow: "0px 3px 5px #00000029",
    "& .MuiInputBase-input": {
      height: "0.1rem !important",
    },
  },
  typoCss: { width: "22%", marginBottom: "5px", textAlign: "center" },
  submitBtn: {
    position: "relative",
    float: "right",
    backgroundColor: "#f45e29",
    border: "1px solid #f45e29",
    borderRadius: "4px !important",
    color: "#ffffff !important",
    marginTop: "10px",
    padding: "6px 16px !important",
    "&:hover": {
      color: "#f45e29 !important",
    },
  },
  addBtn: {
    width: "100px",
    backgroundColor: "#f45e29",
    border: "1px solid #f45e29",
    borderRadius: "4px !important",
    color: "#ffffff !important",
    padding: "6px 16px !important",
    "&:hover": {
      color: "#f45e29 !important",
    },
  },
  textNewField: {
    width: 150,
    borderRadius: "8px",
    marginTop: "40px",
    boxShadow: "0px 3px 5px #00000029",
    "& input": {
      height: "0px !important",
      textAlign: "center",
    },
  },
  isError: {
    color: "red",
    fontSize: "12px",
    width: "100%",
    whiteSpace: "pre",
    marginTop: "5px",
    display: "block",
  },
};

const HardwareDetail = ({
  open,
  setOpen,
  setHideBtn,
  getHardwareDataForApproval,
  recommendHardware,
  hardwareFillDetail,
}) => {
  const [selectedHardwareType, setSelectedHardwareType] = useState("Part");
  const [partNameList, setPartNameList] = useState([]);
  const [partVariantNameList, setPartVariantNameList] = useState([]);
  const [bundleNameList, setBundleNameList] = useState([]);
  const [bundleVariantNameList, setBundleVariantNameList] = useState([]);
  const [count, setCount] = useState(1);
  const [singleHandwareData, setSingleHandwareData] = useState(null);
  const [singleHandwareBundleData, setSingleHandwareBundleData] =
    useState(null);

  const [hardwareTableData, setHardwareTableData] = useState([]);
  const [hardwareRecommend, setRecommendHardware] = useState([]);
  const loginData = getUserData("loginData");
  const uuid = loginData?.uuid;
  const debounceTimerRef = useRef(null);
  const [openHardwareList, setOpenHardwareList] = useState(null);

  const handleClickOpen = () => {
    setCount(1);
    setOpen(true);
  };

  const classes = useStyles();

  const hardwareType = ["Part", "Bundle"];

  const hardwareHeading = [
    { label: "S.no.", fieldType: "text" },
    { label: "Product", fieldType: "text" },
    { label: "Type", fieldType: "text" },
    { label: "Variants", fieldType: "text" },
    { label: "MRP", fieldType: "text" },
    { label: "Cost", fieldType: "input" },
    { label: "Discount %", fieldType: "input" },
    { label: "Gross Value", fieldType: "input" },
    { label: "Quantity", fieldType: "input" },
  ];

  const isPartCostHandler = (val, row) => {
    clearTimeout(debounceTimerRef.current);
    let newArr;
    debounceTimerRef.current = setTimeout(() => {
      if (Number(val) > row?.isTotalMOPCOST) {
        newArr = hardwareTableData.map((hardware) => {
          if (row.part_id === hardware.part_id) {
            let isMRPPrice = row?.isTotalMRPCOST;
            let value = ((isMRPPrice - val) / isMRPPrice) * 100;
            value = value.toFixed(2);
            if (value > 0) {
              hardware["cost"] = val;
              hardware["discount"] = value;
              hardware["message"] = "";
            } else {
              hardware["cost"] = val;
              hardware["discount"] = 0;
              hardware["message"] = "";
            }
          }
          return hardware;
        });
        setHardwareTableData([...newArr]);
      } else {
        newArr = hardwareTableData.map((hardware) => {
          if (row.part_id === hardware.part_id) {
            let isMRPPrice = row?.isTotalMRPCOST;
            let value = ((isMRPPrice - val) / isMRPPrice) * 100;
            value = value.toFixed(2);
            hardware["cost"] = val;
            hardware["discount"] = value;
            hardware["message"] = "Your Monthly Cost is less from MOP Cost";
          }
          return hardware;
        });
        setHardwareTableData([...newArr]);
      }
    }, 2000);

    newArr = hardwareTableData.map((hardware) => {
      if (row.part_id === hardware.part_id) {
        hardware["cost"] = val;
        hardware["discount"] = 0;
        hardware["message"] = "";
      }
      return hardware;
    });
    setHardwareTableData([...newArr]);
  };

  const isBundleCostHandler = (val, row) => {
    clearTimeout(debounceTimerRef.current);
    let newArr;
    debounceTimerRef.current = setTimeout(() => {
      if (Number(val) > row?.isTotalMOPCOST) {
        newArr = hardwareTableData.map((hardware) => {
          if (row.bundle_id === hardware.bundle_id) {
            let isMRPPrice = row?.isTotalMRPCOST;
            let value = ((isMRPPrice - val) / isMRPPrice) * 100;
            value = value.toFixed(2);
            if (value > 0) {
              hardware["cost"] = val;
              hardware["discount"] = value;
              hardware["message"] = "";
            } else {
              hardware["cost"] = val;
              hardware["discount"] = 0;
              hardware["message"] = "";
            }
          }
          return hardware;
        });
        setHardwareTableData([...newArr]);
      } else {
        newArr = hardwareTableData.map((hardware) => {
          if (row.bundle_id === hardware.bundle_id) {
            let isMRPPrice = row?.isTotalMRPCOST;
            let value = ((isMRPPrice - val) / isMRPPrice) * 100;
            value = value.toFixed(2);
            hardware["cost"] = val;
            hardware["discount"] = value;
            hardware["message"] = "Your Monthly Cost is less from MOP Cost";
          }
          return hardware;
        });
        setHardwareTableData([...newArr]);
      }
    }, 2000);

    newArr = hardwareTableData.map((hardware) => {
      if (row.bundle_id === hardware.bundle_id) {
        hardware["cost"] = val;
        hardware["discount"] = 0;
        hardware["message"] = "";
      }
      return hardware;
    });
    setHardwareTableData([...newArr]);
  };

  const hardwareTypeHandler = (selectedItem) => {
    setSelectedHardwareType(selectedItem);
    let params = {
      page_offset: 0,
      search_val: "",
      status: [1],
      uuid: uuid,
    };
    if (selectedItem === "Part") {
      listHardwarePartVariants(params)
        .then((res) => {
          //console.log("888", res?.data?.part_variants)
          setPartNameList(res?.data?.part_variants);
        })
        .catch((err) => console.error(err));
    }
    if (selectedItem === "Bundle") {
      listHardwareBundleVariants(params)
        .then((res) => {
          setBundleNameList(res?.data?.hardware_bundles);
        })
        .catch((err) => console.error(err));
    }
  };
  if (hardwareTableData.length > 0) {
    setHideBtn(true);
  }
  if (hardwareTableData.length === 0) {
    setHideBtn(false);
  }

  useEffect(() => {
    if (hardwareTableData?.length) {
      getHardwareDataForApproval(hardwareTableData);
    }
  }, [hardwareTableData]);

  useEffect(() => {
    if (recommendHardware?.length) {
      setRecommendHardware(recommendHardware);
    }
  }, [recommendHardware]);

  const Card = ({
    heading,
    leftTextOne,
    leftTextSecond,
    button,
    description,
  }) => {
    return (
      <Box
        sx={{
          width: "48%",
          boxShadow: "0px 6px 8px #00000029",
          borderRadius: "10px",
        }}
      >
        <Typography
          style={{
            backgroundColor: "#F45E29",
            borderRadius: "20px",
            textAlign: "center",
            color: "#FFFFFF",
          }}
        >
          {heading}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 15px",
          }}
        >
          <Box>
            <Typography>{leftTextOne}</Typography>
            <Typography>{leftTextSecond}</Typography>
          </Box>
          <Box
            sx={{
              marginRight: "25px",
              borderRadius: "15px",
              textAlign: "center",
              fontWeight: "600",
              color: "#707070",
              padding: "10px",
              background: "#F8F8F8 0% 0% no-repeat padding-box",
            }}
          >
            {button ? <Button>Add</Button> : "BUTTON"}
          </Box>
        </Box>
        <Typography sx={{ padding: "0 15px 10px 15px" }}>
          {description}
        </Typography>
      </Box>
    );
  };

  const getHardwareName = (obj) => {
    if (obj?.variant === "Bundle") {
      return obj?.bundle_name;
    } else {
      return obj?.part_name;
    }
  };

  const getHardwareDesc = (obj) => {
    if (obj?.variant === "Bundle") {
      return obj?.bundle_variant_description;
    } else {
      return obj?.part_variant_description;
    }
  };

  const isAddHardware = (obj) => {
    const bundleID = hardwareTableData
      ?.filter((obj) => obj?.variant === QuoteType?.isBundle)
      ?.map((obj) => obj?.bundle_id);
    const partID = hardwareTableData
      ?.filter((obj) => obj?.variant === QuoteType?.isPart)
      ?.map((obj) => obj?.part_id);
    if (bundleID?.includes(obj?.bundle_id) || partID?.includes(obj?.part_id)) {
      toast.error("This Package is Already Selected");
      return;
    }
    setHardwareTableData([...hardwareTableData, obj]);
  };

  const isCheckHardwareExist = (obj) => {
    if (hardwareTableData?.length > 0) {
      const bundleID = hardwareTableData
        ?.filter((obj) => obj?.variant === QuoteType?.isBundle)
        ?.map((obj) => obj?.bundle_variant_id);
      const partID = hardwareTableData
        ?.filter((obj) => obj?.variant === QuoteType?.isPart)
        ?.map((obj) => obj?.variant_id);
      if (
        bundleID?.includes(obj?.bundle_variant_id) ||
        partID?.includes(obj?.variant_id)
      ) {
        toast.error("This Hardware Variant is Selected");
        return false;
      } else {
        return true;
      }
    }
    return true;
  };

  useEffect(() => {
    if (hardwareFillDetail?.length) {
      setHardwareTableData(hardwareFillDetail);
    }
  }, [hardwareFillDetail]);

  const handleOpenHardwareList = (index) => {
    if (index === openHardwareList) {
      setOpenHardwareList(null);
    } else {
      setOpenHardwareList(index);
    }
  };

  return (
    <Box
      className={
        hardwareRecommend.length || hardwareTableData.length
          ? `crm-contract-list-has-item`
          : ``
      }
    >
      {hardwareRecommend?.length ? (
        <Box className="crm-contract-hardware-recommended-list">
          <Typography component={"h2"}>Recommended Hardware !</Typography>
          <Grid container spacing={2.5}>
            {hardwareRecommend?.map((obj, index) => {
              return (
                <Grid item md={4} xs={12}>
                  <Box
                    className={
                      `crm-contract-hardware-recommended-listitem ` +
                      (openHardwareList === index
                        ? ` crm-contract-hardware-list-opened`
                        : ``)
                    }
                  >
                    <Box className="crm-contract-hardware-recommended-listitem-content">
                      <Box className="crm-contract-hardware-recommended-listitem-title">
                        {obj?.packageName ? (
                          <Box className="crm-contract-hardware-recommended-listitem-title-content">
                            <Typography component={"h4"}>
                              {obj?.packageName}
                            </Typography>
                            <Typography component={"p"}>Description</Typography>
                          </Box>
                        ) : (
                          ""
                        )}
                        <Box
                          className="crm-contract-hardware-recommended-listitem-icon"
                          onClick={() => handleOpenHardwareList(index)}
                        >
                          <DropDownIcon />
                        </Box>
                      </Box>
                      <div>
                        <Button
                          className={"crm-btn crm-btn-outline"}
                          onClick={() => isAddHardware(obj)}
                        >
                          Add
                        </Button>
                      </div>
                    </Box>
                    {/* <div>
                      <Box>
                        <Typography className={classes.label}>
                          {getHardwareName(obj)}
                        </Typography>
                        <p className={classes.paraStyle}>
                          <b>Description</b>:{getHardwareDesc(obj)}
                        </p>
                      </Box>
                    </div> */}

                    <Box className="crm-contract-hardware-recommended-listitem-list">
                      {getHardwareDesc(obj)?.map((item, i) => {
                        return (
                          <Box className="crm-contract-hardware-recommended-listitem-listitem">
                            {item}
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ) : (
        ""
      )}
      {hardwareTableData.length > 0 && (
        <>
          <Box>
            <Typography component={"h2"}>Hardware</Typography>
            <TableContainer component={Paper} className="crm-table-container">
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {hardwareHeading.map((col, index) => (
                      <TableCell
                        align="left"
                        key={index}
                        sx={styles.tableCellHead}
                        // className={
                        //   col?.fieldType === "input" ? "width-100px" : ``
                        // }
                      >
                        {col?.label}
                      </TableCell>
                    ))}
                    <TableCell align="left" sx={styles.tableCellHead} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hardwareTableData.map((row, index) => {
                    return (
                      <Fragment key={index}>
                        {row.variant === "Part" ? (
                          <TableRow
                            key={index}
                            sx={{
                              "& td": styles.tableCellHead,
                            }}
                          >
                            <TableCell align="left">{index + 1}</TableCell>
                            <TableCell align="left">{row.part_name}</TableCell>
                            <TableCell align="left">{row.variant}</TableCell>
                            <TableCell align="left">
                              {row.part_variant_name}
                            </TableCell>
                            <TableCell align="left">
                              {row.part_variant_mrp}
                            </TableCell>
                            <TableCell
                              align="left"
                              // className={`width-100px`}
                            >
                              <input
                                className={classes.inputStyle}
                                name="isTotalMRPCOST"
                                type="Number"
                                placeholder="Cost"
                                value={row.isTotalMRPCOST}
                                onKeyDown={handleKeyDown}
                                onPaste={handlePaste}
                                readOnly={true}
                              />
                              {/* <TextField
                                value={row.isTotalMRPCOST}
                                readOnly={true}
                                sx={styles.textField}
                              /> */}
                            </TableCell>
                            <TableCell
                              align="left"
                              //  className={`width-100px`}
                            >
                              <input
                                className={classes.inputStyle}
                                name="discount"
                                type="Number"
                                placeholder="Discount"
                                value={row.discount}
                                readOnly={true}
                                onKeyDown={handleKeyDown}
                                onPaste={handlePaste}
                              />
                              {/* <TextField
                                value={row.discount}
                                readOnly={true}
                                sx={styles.textField}
                              /> */}
                            </TableCell>
                            <TableCell
                              // className="width-100px"
                              align="left"
                              sx={
                                row?.message
                                  ? {
                                      position: "relative",
                                      top: "10px",
                                    }
                                  : ""
                              }
                            >
                              <input
                                className={classes.inputStyle}
                                name="cost"
                                type="Number"
                                placeholder="Cost"
                                value={row.cost}
                                onKeyDown={handleKeyDown}
                                onPaste={handlePaste}
                                onChange={(e) => {
                                  isPartCostHandler(e.target.value, row);
                                }}
                              />
                              {/* <TextField
                                value={row.cost}
                                onChange={(e) => {
                                  isPartCostHandler(e.target.value, row);
                                }}
                                sx={
                                  !row?.message
                                    ? styles.textField
                                    : styles.textNewField
                                }
                              /> */}
                              {row?.message && (
                                <div style={styles.isError}>{row.message}</div>
                              )}
                            </TableCell>
                            <TableCell
                              // className={`width-100px`}
                              align="left"
                            >
                              <Box
                                className="crm-form-counter"
                                sx={styles.counterBox}
                              >
                                <Box
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => {
                                    if (row.count > 1) {
                                      let newArr = hardwareTableData.map(
                                        (hardware) => {
                                          if (
                                            row.part_id === hardware.part_id
                                          ) {
                                            hardware["count"] =
                                              hardware.count - 1;
                                            hardware["cost"] =
                                              hardware.count *
                                              hardware.part_variant_mrp;
                                            hardware["isTotalMRPCOST"] =
                                              hardware.count *
                                              hardware.part_variant_mrp;
                                            hardware["isTotalMOPCOST"] =
                                              hardware.count *
                                              hardware.part_variant_mop;
                                            hardware["discount"] = 0;
                                            hardware["message"] = "";
                                          }
                                          return hardware;
                                        }
                                      );
                                      setHardwareTableData([...newArr]);
                                    }
                                  }}
                                >
                                  -
                                </Box>
                                {row.count}
                                <Box
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => {
                                    let newArr = hardwareTableData.map(
                                      (hardware) => {
                                        if (row.part_id === hardware.part_id) {
                                          hardware["count"] =
                                            hardware.count + 1;
                                          hardware["cost"] =
                                            hardware.count *
                                            hardware.part_variant_mrp;
                                          hardware["isTotalMRPCOST"] =
                                            hardware.count *
                                            hardware.part_variant_mrp;
                                          hardware["isTotalMOPCOST"] =
                                            hardware.count *
                                            hardware.part_variant_mop;
                                          hardware["discount"] = 0;
                                          hardware["message"] = "";
                                        }
                                        return hardware;
                                      }
                                    );
                                    setHardwareTableData([...newArr]);
                                  }}
                                >
                                  +
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="left">
                              <Box display={"flex"}>
                                <IconRecordDelete
                                  className="mr-1 cursor-pointer"
                                  sx={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    let newHardwareList =
                                      hardwareTableData.filter(
                                        (hardware) =>
                                          hardware?.part_id !== row?.part_id
                                      );
                                    setHardwareTableData(newHardwareList);
                                  }}
                                />
                                {hardwareTableData?.length - 1 === index ? (
                                  <IconRecordAdd
                                    className="cursor-pointer"
                                    sx={{ cursor: "pointer" }}
                                    onClick={handleClickOpen}
                                  />
                                ) : null}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ) : (
                          <TableRow
                            key={index}
                            sx={{
                              "& td": styles.tableCellHead,
                            }}
                          >
                            <TableCell align="left">{index + 1}</TableCell>
                            <TableCell align="left">
                              {row.bundle_name}
                            </TableCell>
                            <TableCell align="left">{row.variant}</TableCell>
                            <TableCell align="left">
                              {row.bundle_variant_name}
                            </TableCell>
                            <TableCell align="left">
                              {row.bundle_variant_mrp}
                            </TableCell>
                            <TableCell align="left" className={`width-100px`}>
                              <input
                                className={classes.inputStyle}
                                name="isTotalMRPCOST"
                                type="Number"
                                placeholder="Cost"
                                value={row.isTotalMRPCOST}
                                onKeyDown={handleKeyDown}
                                onPaste={handlePaste}
                                readOnly={true}
                              />
                              {/* <TextField
                                value={row.isTotalMRPCOST}
                                readOnly={true}
                                sx={styles.textField}
                              /> */}
                            </TableCell>
                            <TableCell align="left" className={`width-100px`}>
                              <input
                                className={classes.inputStyle}
                                name="Discount"
                                type="Number"
                                placeholder="Discount"
                                value={row.discount}
                                onKeyDown={handleKeyDown}
                                onPaste={handlePaste}
                                readOnly={true}
                              />
                              {/* <TextField
                                value={row.discount}
                                readOnly={true}
                                sx={styles.textField}
                              /> */}
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={
                                row?.message
                                  ? {
                                      position: "relative",
                                      top: "10px",
                                    }
                                  : ""
                              }
                              className={`width-100px`}
                            >
                              <input
                                className={classes.inputStyle}
                                name="Cost"
                                type="Number"
                                placeholder="Enter Value"
                                value={row.cost}
                                onKeyDown={handleKeyDown}
                                onPaste={handlePaste}
                                onChange={(e) => {
                                  isBundleCostHandler(e.target.value, row);
                                }}
                              />
                              {row?.message && (
                                <div style={styles.isError}>{row.message}</div>
                              )}
                            </TableCell>
                            <TableCell align="left" className={`width-100px`}>
                              <Box
                                className="crm-form-counter"
                                sx={styles.counterBox}
                              >
                                <Box
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => {
                                    if (row.count > 1) {
                                      let newArr = hardwareTableData.map(
                                        (hardware) => {
                                          if (
                                            row.bundle_id === hardware.bundle_id
                                          ) {
                                            hardware["count"] =
                                              hardware.count - 1;
                                            hardware["cost"] =
                                              hardware.count *
                                              hardware.bundle_variant_mrp;
                                            hardware["isTotalMRPCOST"] =
                                              hardware.count *
                                              hardware.bundle_variant_mrp;
                                            hardware["isTotalMOPCOST"] =
                                              hardware.count *
                                              hardware.bundle_variant_mop;
                                            hardware["discount"] = 0;
                                            hardware["message"] = "";
                                          }
                                          return hardware;
                                        }
                                      );
                                      setHardwareTableData([...newArr]);
                                    }
                                  }}
                                >
                                  -
                                </Box>
                                {row.count}
                                <Box
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => {
                                    let newArr = hardwareTableData.map(
                                      (hardware) => {
                                        if (
                                          row.bundle_id === hardware.bundle_id
                                        ) {
                                          hardware["count"] =
                                            hardware.count + 1;
                                          hardware["cost"] =
                                            hardware.count *
                                            hardware.bundle_variant_mrp;
                                          hardware["isTotalMRPCOST"] =
                                            hardware.count *
                                            hardware.bundle_variant_mrp;
                                          hardware["isTotalMOPCOST"] =
                                            hardware.count *
                                            hardware.bundle_variant_mop;
                                          hardware["discount"] = 0;
                                          hardware["message"] = "";
                                        }
                                        return hardware;
                                      }
                                    );
                                    setHardwareTableData([...newArr]);
                                  }}
                                >
                                  +
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="left">
                              <IconRecordDelete
                                className="mr-1 cursor-pointer"
                                sx={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  let newHardwareList =
                                    hardwareTableData.filter(
                                      (hardware) =>
                                        hardware?.bundle_id !== row?.bundle_id
                                    );
                                  setHardwareTableData(newHardwareList);
                                }}
                              />
                              {hardwareTableData?.length - 1 === index ? (
                                <IconRecordAdd
                                  className="cursor-pointer"
                                  sx={{ cursor: "pointer" }}
                                  onClick={handleClickOpen}
                                />
                              ) : null}
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={`crm-dialog-container ` + (open ? ` crm-dialog-opened` : ``)}
      >
        <DialogContent className="crm-dialog-content">
          <Box className="width-100">
            <Box className="crm-dialog-close" onClick={() => setOpen(false)}>
              <IconClose />
            </Box>
          </Box>
          <Box className="crm-dialog-header">
            <Typography component={"h2"}>Add Hardware</Typography>
          </Box>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <Box className="crm-hardware-detail-modal-formitem">
                <Typography component={"h3"}>Hardware Type</Typography>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={hardwareType}
                  onChange={(event, value) => hardwareTypeHandler(value)}
                  sx={styles.autoCompleteCss}
                  renderInput={(params) => (
                    <TextField
                      className="crm-form-input medium-dark"
                      {...params}
                    />
                  )}
                  popupIcon={<DropDownIcon />}
                  disableClearable
                  classes={{
                    listbox: "crm-form-autocomplete-menuitem",
                  }}
                />
              </Box>
            </Grid>
            {selectedHardwareType === "Part" && (
              <Fragment key="hardware-unit-part">
                <Grid item xs={12} md={6}>
                  <Box className="crm-hardware-detail-modal-formitem">
                    <Typography component={"h3"}>Hardware Name</Typography>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo1"
                      options={partNameList}
                      getOptionLabel={(option) => option.part_name}
                      onChange={(e, val) => {
                        let data = partNameList.filter(
                          (item) => item.part_name === val.part_name
                        );
                        setPartVariantNameList(data);
                      }}
                      disableClearable
                      // renderOption={(props, option) => {
                      //   return (
                      //     <li {...props} key={option.part_id}>
                      //       {option.part_name}
                      //     </li>
                      //   );
                      // }}
                      sx={styles.autoCompleteCss}
                      renderInput={(params) => (
                        <TextField
                          className="crm-form-input medium-dark"
                          {...params}
                        />
                      )}
                      popupIcon={<DropDownIcon />}
                      classes={{
                        listbox: "crm-form-autocomplete-menuitem",
                      }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box className="crm-hardware-detail-modal-formitem">
                    <Typography component={"h3"}>Variant</Typography>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo2"
                      options={partVariantNameList}
                      getOptionLabel={(option) => option.part_variant_name}
                      sx={styles.autoCompleteCss}
                      onChange={(e, val) => setSingleHandwareData(val)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          className="crm-form-input medium-dark"
                        />
                      )}
                      popupIcon={<DropDownIcon />}
                      disableClearable
                      classes={{
                        listbox: "crm-form-autocomplete-menuitem",
                      }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box className="crm-hardware-detail-modal-formitem">
                    <Typography component={"h3"}>Quantity</Typography>
                    <Box className="crm-form-input crm-form-input-custom medium-dark">
                      <Box
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          if (count > 1) setCount(count - 1);
                        }}
                      >
                        -
                      </Box>
                      {count}
                      <Box
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          setCount(count + 1);
                        }}
                      >
                        +
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Fragment>
            )}

            {selectedHardwareType === "Bundle" && (
              <Fragment key="hardware-unit-bundle">
                <Grid item xs={12} md={6}>
                  <Box className="crm-hardware-detail-modal-formitem">
                    <Typography component={"h3"}>Hardware Name</Typography>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo3"
                      options={bundleNameList}
                      getOptionLabel={(option) => option.bundle_name}
                      onChange={(e, val) => {
                        let data = bundleNameList.filter(
                          (item) =>
                            item.bundle_variant_name === val.bundle_variant_name
                        );
                        setBundleVariantNameList(data);
                      }}
                      sx={styles.autoCompleteCss}
                      renderInput={(params) => (
                        <TextField
                          className="crm-form-input medium-dark"
                          {...params}
                        />
                      )}
                      popupIcon={<DropDownIcon />}
                      disableClearable
                      classes={{
                        listbox: "crm-form-autocomplete-menuitem",
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box className="crm-hardware-detail-modal-formitem">
                    <Typography component={"h3"}>Variant</Typography>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo4"
                      options={bundleVariantNameList}
                      getOptionLabel={(option) => option.bundle_variant_name}
                      onChange={(e, val) => setSingleHandwareBundleData(val)}
                      sx={{
                        width: 150,
                        borderRadius: "8px",
                        marginRight: "20px",
                        padding: "0px !important",
                        boxShadow: "0px 3px 5px #00000029",
                        "& .MuiInputBase-input": {
                          height: "0.1rem !important",
                        },
                      }}
                      renderInput={(params) => (
                        <TextField
                          className="crm-form-input medium-dark"
                          {...params}
                        />
                      )}
                      popupIcon={<DropDownIcon />}
                      disableClearable
                      classes={{
                        listbox: "crm-form-autocomplete-menuitem",
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box className="crm-hardware-detail-modal-formitem">
                    <Typography component={"h3"}>Quantity</Typography>
                    <Box className="crm-form-input crm-form-input-custom medium-dark">
                      <Box
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          if (count > 1) setCount(count - 1);
                        }}
                      >
                        -
                      </Box>
                      {count}
                      <Box
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          setCount(count + 1);
                        }}
                      >
                        +
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Fragment>
            )}
          </Grid>
        </DialogContent>
        {selectedHardwareType === "Part" ? (
          <DialogActions sx={styles.dialogAct}>
            {/* <Button
              className="crm-btn crm-btn-outline"
              onClick={() => {
                setCount(1);
                setOpen(false);
              }}
            >
              Cancel
            </Button> */}
            <Button
              className="crm-btn crm-btn-md"
              onClick={() => {
                if (isCheckHardwareExist(singleHandwareData)) {
                  setPartNameList([]);
                  setPartVariantNameList([]);
                  setHardwareTableData([
                    ...hardwareTableData,
                    {
                      ...singleHandwareData,
                      count: count,
                      variant: selectedHardwareType,
                      cost: count * singleHandwareData.part_variant_mrp,
                      isTotalMRPCOST:
                        count * singleHandwareData.part_variant_mrp,
                      isTotalMOPCOST:
                        count * singleHandwareData.part_variant_mop,
                      discount: 0,
                      message: "",
                    },
                  ]);
                  setCount(1);
                  setOpen(false);
                  setSingleHandwareData(null);
                }
              }}
            >
              Add
            </Button>
          </DialogActions>
        ) : (
          <DialogActions sx={styles.dialogAct}>
            <Button
              sx={styles.addBtn}
              onClick={() => {
                if (isCheckHardwareExist(singleHandwareBundleData)) {
                  setBundleNameList([]);
                  setBundleVariantNameList([]);
                  setHardwareTableData([
                    ...hardwareTableData,
                    {
                      ...singleHandwareBundleData,
                      count: count,
                      variant: selectedHardwareType,
                      cost: count * singleHandwareBundleData.bundle_variant_mrp,
                      isTotalMRPCOST:
                        count * singleHandwareBundleData.bundle_variant_mrp,
                      isTotalMOPCOST:
                        count * singleHandwareBundleData.bundle_variant_mop,
                      discount: 0,
                      message: "",
                    },
                  ]);
                  setCount(1);
                  setOpen(false);
                  setSingleHandwareBundleData(null);
                }
              }}
            >
              Add
            </Button>
            <Button
              sx={styles.addBtn}
              onClick={() => {
                setCount(1);
                setOpen(false);
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
};

export default HardwareDetail;
