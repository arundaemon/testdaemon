import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { useStyles } from "../../css/AddSchool-css";
import {
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  TextField,
  Typography,
  FormControlLabel,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {
  handleKeyDown,
  handleKeyTextDown,
  handlePaste,
  handleTextPaste,
} from "../../helper/randomFunction";
import ReactSelect from "react-select";
import { toast } from "react-hot-toast";
import CrossIcon from "../../assets/image/crossIcn.svg";
import { DesignationOptions } from "../../constants/general";
import { ReactComponent as DropDownIcon } from "../../assets/icons/icon-dropdown-2.svg";
import FormGroup from "@mui/material/FormGroup";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP + 60,
      width: 250,
    },
  },
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function MultipleSelectContact(props) {
  let {
    label,
    getInputData,
    type,
    data,
    addNewContact,
    isUpdated,
    isContactModal,
    contactData,
    productData,
    isDisabled,
    indexNo,
    schoolId,
    schoolActivityDate,
  } = props;

  const [personName, setPersonName] = useState([]);
  const [selectAll, setSelectAll] = useState(false); // State for "Select All" option
  const [selectedItems, setSelectedItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [isAddContact, setConatct] = useState(false);
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState({
    label: "Select Designation",
    value: "",
  });
  const [emailId, setEmailID] = useState("");
  const [mobileNumber, setMobileNum] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isContact, setValidContact] = useState(false);
  const [primaryContact, setPrimaryContact] = useState(false);


  const getDataList = () => {
    let resultList = [];

    if (type === "userContact") {
      resultList = data;
      return resultList;
    } else if (type === "productList") {
      resultList = data;
      return resultList;
    } else {
      return resultList;
    }
  };

  useEffect(() => {
    if (type === "userContact") {
      setSelectedItems(contactData);
    }
    if (type === "productList") {
      setSelectedItems(productData);
    }
  }, [data]);

  useEffect(() => {
    if (isDisabled) {
      setSelectedItems([]);
      setSelectAll(false);
    }
  }, [isDisabled]);

  // useEffect(() => {
  //   if (isUpdated) {
  //     setSelectedItems([])
  //     setSelectAll(false)
  //   }
  // }, [isUpdated])

  useEffect(() => {
    getInputData(indexNo, "contactDetail", selectedItems);
    // getInputData(selectedItems);
  }, [selectedItems]);

  const isValidateField = () => {
    let params;

    if (primaryContact == false) {
      if (name?.trim() === "") {
        toast.error("Please Add Name");
      } else if (!designation?.value) {
        toast.error("Please Select Designation");
      }

      params = {
        name: name,
        designation: designation?.value,
        mobileNumber: primaryContact === true ? mobileNumber : "",
        emailId: primaryContact === true ? emailId : "",
        isValid: true,
        isPrimary: primaryContact,
      };

      setSelectedItems([]);
      addNewContact(params, schoolId, indexNo);
      handleBodyStateToAuto();
    } else {
      if (name?.trim() === "") {
        toast.error("Please Add Name");
      } else if (!designation?.value) {
        toast.error("Please Select Designation");
      }
      if (!mobileNumber) {
        toast.error("Please Enter Mobile Number");
      } else if (!(Number(mobileNumber?.length) === 10)) {
        toast.error("Please Must be 10 Digit");
      } else if (!emailId) {
        toast.error("Please Enter Email ID");
      } else if (!isValidEmail) {
        toast.error("Please Enter Valid Email ID");
      }

      params = {
        name: name,
        designation: designation?.value,
        mobileNumber: primaryContact === true ? mobileNumber : "",
        emailId: primaryContact === true ? emailId : "",
        isValid: true,
        isPrimary: primaryContact,
      };

      setSelectedItems([]);
      addNewContact(params, schoolId, indexNo);
      handleBodyStateToAuto();
    }
  };

  const handleCloseDetail = () => {
    setConatct(false);
    handleBodyStateToAuto();
  };

  const handleBodyStateToAuto = () => {
    document.body.style.overflow = "auto";
  };

  const handleBodyStateToHidden = () => {
    document.body.style.overflow = "hidden";
  };

  useEffect(() => {
    if (isAddContact && !isUpdated) handleBodyStateToHidden();
  }, [isAddContact, isUpdated]);

  const classes = useStyles();

  const selectRef = useRef();

  const handleToggleItem = (item) => {
    const selectedIndex = selectedItems.indexOf(item);
    let newSelectedItems = [];

    if (selectedIndex === -1) {
      newSelectedItems = [...selectedItems, item];
    } else {
      newSelectedItems = selectedItems.filter(
        (selectedItem) => selectedItem !== item
      );
    }

    setSelectedItems(newSelectedItems);

    if (!(newSelectedItems?.length === getDataList()?.length)) {
      setSelectAll(false);
    }
  };

  useEffect(() => {
    setName("");
    setDesignation({
      label: "Select Designation",
      value: "",
    });
    setEmailID("");
    setMobileNum("");
  }, [getDataList()]);

  const options = [
    { value: "Principal", label: "Principal" },
    { value: "Teacher", label: "Teacher" },
    { value: "Employee", label: "Employee" },
    { value: "Reception", label: "Reception" },
    { value: "Other", label: "Other" },
  ];

  const handleToggleSelectAll = (data) => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(getDataList());
    }
    setSelectAll(!selectAll);
    return [];
  };

  const handleToggleReset = () => {
    setSelectedItems([]);
    setSelectAll(false);
  };

  const handleClose = () => {
    setOpen(false); // Close the options list by setting the open state variable to false
  };

  const handleOpen = () => {
    setOpen(true); // Open the options list by setting the open state variable to true
  };

  const handleEmailBlur = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailPattern.test(emailId);
    setIsValidEmail(isValid);
  };

  const removeFieldValue = (item) => {
    const updatedOptions = selectedItems.filter(
      (selectedItem) => selectedItem !== item
    );
    if (!(updatedOptions?.length === getDataList()?.length)) {
      setSelectAll(false);
    }
    setSelectedItems(updatedOptions);
  };

  // Function to handle scroll event
  const handleScroll = () => {
    handleClose();
  };

  useEffect(() => {
    // Add a scroll event listener to the window when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Remove the scroll event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function isObjectEqual(obj1, obj2) {
    const obj1Keys = Object.keys(obj1);
    const obj2Keys = Object.keys(obj2);

    if (obj1Keys.length !== obj2Keys.length) {
      return false;
    }

    for (const key of obj1Keys) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  }

  const handleCheckboxChange = (event) => {
    setPrimaryContact(event?.target?.checked);
  };

  return (
    <div>
      <Select
        labelId={`demo-multiple-checkbox-label ${label}`}
        id={`demo-multiple-checkbox ${label}`}
        className="crm-form-select2 medium-dark"
        multiple
        IconComponent={DropDownIcon}
        inputProps={{ MenuProps: { disableScrollLock: true } }}
        disabled={isDisabled}
        value={selectedItems}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <div className={classes.customRenderLabel}>
            {selected
              ?.map((obj) => (obj?.name ? obj?.name : obj?.profileName))
              ?.filter((name) => name)
              ?.join(",  ")}
          </div>
        )}
        // MenuProps={{
        //   ...MenuProps,
        //   classes: {
        //     paper: classes.customMenu, // Apply the custom class to the UL element
        //   },
        // }}
        MenuProps={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
          getContentAnchorEl: null,
        }}
        open={open}
        ref={selectRef}
        onOpen={handleOpen} // Call the handleOpen function to open the options list
        onClose={handleClose} // Call the handleClose function to close the options list
      >
        {getDataList()?.filter((obj) => Object.keys(obj).length !== 0).length >
        0 ? (
          <div key={"conversation-user-key"}>
            <MenuItem value="selectAll" className="crm-form-select2-menuitem">
              <div
                onClick={() => handleToggleSelectAll(getDataList())}
                style={{ display: "flex", width: "100%", alignItems: "center" }}
              >
                <Checkbox
                  checked={selectAll}
                  onChange={() => handleToggleSelectAll(getDataList())}
                />
                <ListItemText primary="Select All" />
              </div>
            </MenuItem>
            <div className={classes.contactBox}>
              {getDataList()
                ?.filter((obj) => Object.keys(obj).length !== 0)
                ?.filter((obj) => obj?.name)
                .map((obj) => {
                  return (
                    <MenuItem
                      className="crm-form-select2-menuitem"
                      key={obj?.name ? obj?.name : obj?.profileName}
                      value={obj?.name ? obj?.name : obj?.profileName}
                    >
                      <div
                        onClick={() => handleToggleItem(obj)}
                        style={{
                          display: "flex",
                          width: "100%",
                          alignItems: "center",
                        }}
                      >
                        <Checkbox
                          checked={selectedItems.some((item) =>
                            isObjectEqual(item, obj)
                          )}
                        />
                        <ListItemText
                          primary={obj?.name ? obj?.name : obj?.profileName}
                        />
                      </div>
                    </MenuItem>
                  );
                })}
            </div>
          </div>
        ) : (
          <MenuItem value="selectAll">
            <div style={{ padding: "20px" }}>
              <ListItemText primary="No Options" />
            </div>
          </MenuItem>
        )}
        <div className={classes.ContactbtnSection}>
          {!(type == "productList") ? (
            <Grid className={classes.btnSection}>
              <Button
                className={classes.submitBtn}
                onClick={() => {
                  setConatct(true);
                  isContactModal();
                }}
              >
                Add New
              </Button>
            </Grid>
          ) : (
            ""
          )}
          <Grid className={classes.btnSection}>
            <Button className={classes.submitBtn} onClick={handleToggleReset}>
              Reset
            </Button>
          </Grid>
          <Grid className={classes.btnSection}>
            <Button className={classes.submitBtn} onClick={handleClose}>
              Apply
            </Button>
          </Grid>
        </div>
      </Select>
      {/* <div
          style={{
            display: "flex",
            paddingTop: "10px",
            flexWrap: "wrap",
            marginRight: "20px",
          }}
        >
          {selectedItems?.filter(obj => Object.keys(obj).length !== 0)?.map((option, i) => {
            return (
              <div
                key={option?.name ? option?.name : option?.profileName}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "5px",
                  border: "1px solid #ccc",
                  marginRight: "15px",
                  borderRadius: "8px",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                <span style={{ marginRight: "10px", marginLeft: "10px" }} className={classes.customRenderLabel}>
                  {option?.name ? option?.name : option?.profileName}
                </span>
                <Divider
                  orientation="vertical"
                  flexItem
                  style={{
                    marginLeft: "10px",
                    marginRight: "10px",
                    fontWeight: "700",
                  }}
                />
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "black",
                  }}
                  onClick={() => removeFieldValue(option)}
                >
                  <img className={classes.iconWidth} src={CrossIcon} alt=""/>
                </button>
              </div>
            );
          })}
        </div> */}
      {isAddContact && !isUpdated && (
        <Modal
          open={isAddContact && !isUpdated}
          onOpen={() => (document.body.style.overflow = "hidden")}
          onClose={handleCloseDetail}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box className={classes.customContactModal}>
            <h2 id="child-modal-title" style={{ paddingBottom: "30px" }}>
              Add New Contact
            </h2>
            <Box id="child-modal-description">
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox />}
                  label={
                    <span style={{ fontSize: "15px" }}>
                      Is this your primary Contact ?
                    </span>
                  }
                  onChange={handleCheckboxChange}
                />
              </FormGroup>

              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <Typography className={classes.label}>Name*</Typography>
                  <TextField
                    className="crm-form-input dark"
                    autoComplete="off"
                    name={name}
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyTextDown}
                    onPaste={handleTextPaste}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Typography className={classes.label}>
                    Designation*
                  </Typography>
                  <ReactSelect
                    isSearchable={false}
                    classNamePrefix="select"
                    className="crm-form-input crm-react-select dark"
                    options={DesignationOptions}
                    value={designation}
                    onChange={(e) => {
                      setDesignation({
                        label: e.label,
                        value: e.value,
                      });
                    }}
                  />
                </Grid>

                {primaryContact && (
                  <>
                    <Grid item md={6} xs={12}>
                      <Typography className={classes.label}>
                        Mobile Number*
                      </Typography>
                      <TextField
                        className="crm-form-input dark"
                        autoComplete="off"
                        type="number"
                        placeholder="Enter Mobile Number"
                        value={mobileNumber}
                        onChange={(e) =>
                          setMobileNum(e.target.value?.slice(0, 10))
                        }
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                      />
                      {mobileNumber?.length > 10 && (
                        <p style={{ color: "red" }}>
                          Phone number should not exceed 10 digits
                        </p>
                      )}
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <Typography className={classes.label}>
                        Email ID*
                      </Typography>
                      <TextField
                        className="crm-form-input dark"
                        autoComplete="off"
                        type="text"
                        placeholder="Enter Email ID"
                        value={emailId}
                        onChange={(e) => setEmailID(e.target.value)}
                        onBlur={handleEmailBlur}
                      />
                      {!isValidEmail && (
                        <p style={{ color: "red" }}>
                          Please enter a valid email address
                        </p>
                      )}
                    </Grid>
                  </>
                )}

                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "right",
                    width: "100%",
                    paddingTop: "20px",
                  }}
                >
                  <Grid className={classes.btnSection}>
                    <Button
                      className="crm-btn crm-btn-outline"
                      onClick={() => {
                        setConatct(false);
                        handleBodyStateToAuto();
                      }}
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid className={classes.btnSection}>
                    <Button
                      className="crm-btn crm-btn-primary"
                      onClick={isValidateField}
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Modal>
      )}
    </div>
  );
}
