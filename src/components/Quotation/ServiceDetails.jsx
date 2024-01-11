import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import React, { useEffect, useRef, useState } from "react";
import { getServiceManagementList } from "../../config/services/packageBundle";
import { useStyles } from "../../css/Quotation-css";
import { getUserData } from "../../helper/randomFunction/localStorage";
import toast from "react-hot-toast";
import { handleKeyDown, handleNumKeyDown, handlePaste } from "../../helper/randomFunction";
import CancelIcon from "@mui/icons-material/Cancel";
import { ReactComponent as IconClose } from "./../../assets/icons/icon-modal-close.svg";
import { ReactComponent as DropDownIcon } from "../../assets/icons/icon-dropdown-2.svg";
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
    width: "50%",
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
        maxWidth: "400px",
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
    width: "100%",
    marginRight: "20px",
    borderRadius: "8px",
    padding: "0px !important",
    boxShadow: "0px 3px 5px #00000029",
    "& .MuiInputBase-input": {
      height: "0.1rem !important",
    },
  },
  typoCss: { width: "100%", padding: "0 0 20px 0", fontWeight: "600" },
  submitBtn: {
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
    marginTop: "35px",
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
  },
};
const ServiceDetails = ({
  open,
  setOpen,
  setHideBtn,
  getServiceDataForApproval,
  serviceFillDetail,
}) => {
  const sreviceHeading = [
    { label: "S.no.", fieldType: "Text" },
    { label: "Type", fieldType: "Text" },
    { label: "Quantity", fieldType: "input" },
    { label: "Duration", fieldType: "input" },
    { label: "Cost", fieldType: "input" },
    { label: "Discount %", fieldType: "input" },
    { label: "Gross Value", fieldType: "input" },
  ];
  const [serviceList, setServiceList] = useState([]);
  const [serviceListForTable, setServiceListForTable] = useState([]);
  const [singleService, setSingleService] = useState(null);
  const [edit, setEdit] = useState(false);
  const debounceTimerRef = useRef(null);
  const quantityTimeRef = useRef(null);
  const durationTimeRef = useRef(null);

  const classes = useStyles();

  const getServiceDataList = async () => {
    let params = {
      uuid: getUserData("loginData")?.uuid,
      status: [1],
    };

    let res = await getServiceManagementList(params);
    if (res?.data?.service_list) {
      setServiceList(res?.data?.service_list);
    }
  };
  useEffect(() => {
    getServiceDataList();
  }, []);

  const durationHandler = (e, row) => {
    if (e.target.value)
      if (durationTimeRef.current.value == 0) durationTimeRef.current.value = 1;
    let newArr = serviceListForTable.map((service) => {
      if (row.service_id === service.service_id) {
        service["duration"] = e.target.value;
        service["cost"] =
          Number(e.target.value) *
          Number(row.service_mrp) *
          Number(row?.quantity);
        service["isTotalMRPCOST"] =
          Number(e.target.value) *
          Number(row.service_mrp) *
          Number(row?.quantity);
        service["isTotalMOPCOST"] =
          Number(e.target.value) *
          Number(row.service_mrp) *
          Number(row?.quantity);
        service["discount"] = 0;
      }
      return service;
    });
    setServiceListForTable([...newArr]);
  };

  const quantityHandler = (e, row) => {
    if (e.target.value)
      if (quantityTimeRef.current.value == 0) quantityTimeRef.current.value = 1;
    let newArr = [];
    newArr = serviceListForTable.map((service) => {
      if (row.service_id === service.service_id) {
        service["quantity"] = e.target.value;
        service["cost"] =
          Number(e.target.value) *
          Number(row.service_mrp) *
          Number(row?.duration);
        service["isTotalMRPCOST"] =
          Number(e.target.value) *
          Number(row.service_mrp) *
          Number(row?.duration);
        service["isTotalMOPCOST"] =
          Number(e.target.value) *
          Number(row.service_mrp) *
          Number(row?.duration);
        service["discount"] = 0;
      }
      return service;
    });
    setServiceListForTable([...newArr]);
  };

  const costHandler = (e, row) => {
    clearTimeout(debounceTimerRef.current);
    let newArr;

    debounceTimerRef.current = setTimeout(() => {
      let eventValue = e.target.value;
      if (Number(eventValue) > Number(row?.isTotalMOPCOST)) {
        newArr = serviceListForTable.map((service) => {
          if (row.service_id === service.service_id) {
            let isMRPPrice = Number(row?.isTotalMRPCOST);
            let value = ((isMRPPrice - Number(eventValue)) / isMRPPrice) * 100;
            value = value.toFixed(2);

            if (value > 0) {
              service["cost"] = eventValue;
              service["discount"] = value;
              service["message"] = "";
            } else {
              service["cost"] = eventValue;
              service["discount"] = 0;
              service["message"] = "";
            }
          }
          return service;
        });
        setServiceListForTable([...newArr]);
      } else {
        newArr = serviceListForTable.map((service) => {
          if (row.service_id === service.service_id) {
            let isMRPPrice = row?.isTotalMRPCOST;
            let value = ((isMRPPrice - eventValue) / isMRPPrice) * 100;
            value = value.toFixed(2);
            service["cost"] = eventValue;
            service["discount"] = value;
            service["message"] = "Your Monthly Cost is less from MOP Cost";
          }
          return service;
        });
        setServiceListForTable([...newArr]);
      }
    }, 2000);

    newArr = serviceListForTable.map((service) => {
      if (row.service_id === service.service_id) {
        service["cost"] = e.target.value;
        service["discount"] = 0;
        service["message"] = "";
      }
      return service;
    });
    setServiceListForTable([...newArr]);
  };

  if (serviceListForTable.length > 0) {
    setHideBtn(true);
  }

  if (!(serviceListForTable.length > 0)) {
    setHideBtn(false);
  }

  useEffect(() => {
    getServiceDataForApproval(serviceListForTable);
  }, [serviceListForTable]);

  useEffect(() => {
    if (serviceFillDetail?.length) {
      setServiceListForTable(serviceFillDetail);
    }
  }, [serviceFillDetail]);

  const isCheckHardwareExist = (obj) => {
    if (serviceListForTable?.length > 0) {
      const serviceID = serviceListForTable?.map((obj) => obj?.service_id);

      if (serviceID?.includes(obj?.service_id)) {
        toast.error("This Service is Already Added");
        return false;
      } else {
        return true;
      }
    }
    return true;
  };

  return (
    <Box
      className={serviceListForTable.length ? `crm-contract-list-has-item` : ``}
    >
      {serviceListForTable?.length > 0 && (
        <Box>
          <Typography component={"h2"}>Services</Typography>
          <TableContainer component={Paper} className="crm-table-container">
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  {sreviceHeading.map((col, index) => (
                    <TableCell
                      align="left"
                      key={index}
                      sx={styles.tableCellHead}
                      // className={(col?.fieldType === 'input') ? 'width-100px': ``}
                    >
                      {col?.label}
                    </TableCell>
                  ))}
                  <TableCell align="left" sx={styles.tableCellHead} />
                </TableRow>
              </TableHead>
              <TableBody>
                {serviceListForTable?.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "& td": styles.tableCellHead,
                    }}
                  >
                    <TableCell align="left">{index + 1}</TableCell>
                    <TableCell align="left">{row?.service_name}</TableCell>
                    <TableCell
                      align="left"
                      //  className={`width-100px`}
                    >
                      <input
                        className={classes.inputStyle}
                        ref={quantityTimeRef}
                        name="quantity"
                        type="Number"
                        placeholder="Quantity"
                        value={row?.quantity}
                        onKeyDown={handleNumKeyDown}
                        onPaste={handleNumKeyDown}
                        onChange={(e) => {
                          quantityHandler(e, row);
                        }}
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      // className={`width-100px`}
                    >
                      <input
                        className={classes.inputStyle}
                        name="duration"
                        type="Number"
                        placeholder="Duration"
                        value={row?.duration}
                        onKeyDown={handleNumKeyDown}
                        onPaste={handleNumKeyDown}
                        ref={durationTimeRef}
                        onChange={(e) => durationHandler(e, row)}
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      // className={`width-100px`}
                    >
                      <input
                        className={classes.inputStyle}
                        name="isTotalMRPCOST"
                        type="Number"
                        placeholder="TotalMRPCOST"
                        value={row?.isTotalMRPCOST}
                        readOnly={true}
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      // className={`width-100px`}
                    >
                      <input
                        className={classes.inputStyle}
                        name="discount"
                        type="Number"
                        placeholder="Discount"
                        value={row?.discount}
                        readOnly={true}
                      />
                    </TableCell>
                    <TableCell
                      // className={`width-100px`}
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
                        value={row?.cost}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        onChange={(e) => costHandler(e, row)}
                      />
                      {/* <TextField
                        value={row.cost || ""}
                        onChange={(e) => costHandler(e, row)}
                        sx={
                          !row?.message ? styles.textField : styles.textNewField
                        }
                      /> */}
                      {row?.message && (
                        <div style={styles.isError}>{row.message}</div>
                      )}
                    </TableCell>
                    <TableCell align="left">
                      <Box display={"flex"}>
                        <IconRecordDelete
                          className="mr-1 cursor-pointer"
                          sx={{ cursor: "pointer" }}
                          onClick={(e) => {
                            let newServiceList = serviceListForTable.filter(
                              (obj) => obj?.service_id !== row?.service_id
                            );
                            setServiceListForTable(newServiceList);
                          }}
                        />
                        {serviceListForTable?.length - 1 === index ? (
                          <IconRecordAdd
                            className="cursor-pointer"
                            sx={{ cursor: "pointer" }}
                            onClick={() => setOpen(true)}
                          />
                        ) : null}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Grid className={classes.btnSection}>
              <p
                className={classes.linkColor}
                onClick={() => {
                  setOpen(true);
                }}
              >
                Add More
              </p>
            </Grid>
          </Box> */}
        </Box>
      )}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={
          `crm-dialog-container crm-dialog-sm` +
          (open ? ` crm-dialog-opened` : ``)
        }
      >
        <DialogContent className="crm-dialog-content ">
          <Box className="width-100">
            <Box className="crm-dialog-close" onClick={() => setOpen(false)}>
              <IconClose />
            </Box>
          </Box>
          <Box className="crm-contract-service-selection">
            <Box className="crm-dialog-header">
              <Typography component={"h2"}>Add Service</Typography>
            </Box>
            <Box className="crm-hardware-detail-modal-formitem mx-2">
              <Typography component={"h3"}>Service Type</Typography>
              <Box sx={styles.flex}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={serviceList}
                  getOptionLabel={(option) => option.service_name}
                  onChange={(event, value) => setSingleService(value)}
                  sx={styles.autoCompleteCss}
                  renderInput={(params) => (
                    <TextField
                      className="crm-form-input medium-dark"
                      {...params}
                    />
                  )}
                  classes={{
                    listbox: "crm-form-autocomplete-menuitem",
                  }}
                  popupIcon={<DropDownIcon />}
                  componentsProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "flip",
                          enabled: false,
                        },
                        {
                          name: "preventOverflow",
                          enabled: false,
                        },
                      ],
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={styles.dialogAct}>
          {/* <Button className="crm-btn crm-btn-outline" onClick={() => setOpen(false)}>
            Cancel
          </Button> */}
          <Button
            className="crm-btn crm-btn-md"
            onClick={() => {
              if (isCheckHardwareExist(singleService)) {
                setServiceListForTable([
                  ...serviceListForTable,
                  {
                    ...singleService,
                    duration: 1,
                    quantity: 1,
                    cost: singleService.service_mrp,
                    isTotalMRPCOST: singleService.service_mrp,
                    isTotalMOPCOST: singleService.service_mop,
                    discount: 0,
                    message: "",
                  },
                ]);
                setOpen(false);
                setSingleService(null);
              }
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServiceDetails;
