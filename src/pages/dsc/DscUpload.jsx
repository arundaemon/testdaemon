import React, { useEffect, useState } from "react";
import Page from "../../components/Page";
import {
  TextField,
  InputAdornment,
  Button,
  Modal,
  Paper,
  IconButton,
  Input,
  Typography,
  ListItemText,
  MenuItem,
  Divider,
  Link,
  Select,
  FormControl,
  Grid,
  Box,
  TablePagination,
  Container,
  Checkbox,
} from "@mui/material";
import { TableContainer } from '@mui/material';
import Pagination from "../Pagination";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,

} from "@mui/material"
import ReactSelect from "react-select";
import GetAppIcon from '@mui/icons-material/GetApp';

import { makeStyles } from "@mui/styles";
import { getLoggedInRole } from "../../utils/utils";
import _ from "lodash";
import moment from "moment";
import { DisplayLoader } from "../../helper/Loader";
import { getAllChildRoles } from "../../config/services/hrmServices";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { DecryptData, EncryptData } from "../../utils/encryptDecrypt";
import { getSchoolList } from "../../config/services/school";
import { toast } from "react-hot-toast";
import { getLeadInterestData, getReportSchoolList } from '../../helper/DataSetFunction';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'; // Import the icon
import { addUpdateInvoiceDsc, listGeneratedInvoiceDsc } from "../../config/services/packageBundle";
import { uploadDscFile, uploadTdsFile } from "../../config/services/purchaseOrder"
import Papa from "papaparse";
import SelectWithRadio from "../../components/Pricing-Engine/RadioButton";
import FormDatePicker from "../../theme/form/theme2/FormDatePicker";
import { useNavigate } from "react-router-dom";







const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: '600px !important',
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,

};
const MenuProps = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
  getContentAnchorEl: null,
  style: { position: 'absolute', zIndex: 1000 },


};
const useStyles = makeStyles((theme) => ({


  submitBtn: {
    fontWeight: "400 !important",
    backgroundColor: "#f45e29",
    border: "1px solid #f45e29",
    borderRadius: "4px !important",
    color: "#ffffff !important",
    padding: "6px 16px !important",
    marginLeft: "10px",
    "&:hover": {
      color: "#f45e29 !important",
    },
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  uploaderFile: {
    display: "flex",
    width: "300px",
    height: "44px",
    alignItems: "center",
    justifyContent: "space-between",
    border: "1px solid #dedede",
    padding: "9px 20px",
    borderRadius: "8px",
    textAlign: "left",
    transition: "all .3s",
    marginLeft: "70px",
  },





  tableCell: {
    border: "1px solid black",
    padding: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

  },
  icon: {
    marginRight: theme.spacing(1),
    color: "green",
  },
  fileInput: {
    display: "none",
  },
  centeredRow: {
    textAlign: "center",
  },

}));

const DscUpload = () => {
  const classes = useStyles();
  const [productName, setProductName] = useState(""); // Initialize with an empty string or the default value you prefer
  const [startDate, setStartDate] = useState(null);
  const [timeIn, setTimeIn] = useState(null);
  const [isAccountValidated, setAccountValidated] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filepath, setFilepath] = useState("");
  const [imageDimensionsValid, setImageDimensionsValid] = useState(true);
  const navigate = useNavigate();
  const [fileInputKey, setFileInputKey] = useState(0); // Add a key for the input element
  const [displayedDate, setDisplayedDate] = useState(startDate);
  const [startDateKey, setStartDateKey] = useState(0);


  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid;


  const productOption = [
    { label: "Software", value: "SW" },
    { label: "Hardware", value: "HW" },
  ];



  const FormValidation = (formdata) => {

    let { invoice_type, dsc_date, dsc_file_path } = formdata

    if (!invoice_type) {
      toast.error('Invoice Type is Mandatory !')
      return false
    }
    else if (dsc_date == 'Invalid date') {
      toast.error('DSC Date is Mandatory !')
      return false
    }
    else if (dsc_file_path == "") {
      toast.error('Upload DSC is Mandatory !')
      return false
    }
    else {
      return true
    }


  }

  const handleFileUpload = () => {
    const fileInput = document.getElementById("file-upload");
    fileInput.click();
  };

  const handleFileChange = (event) => {

    const file = event.target.files[0];
    const fileName = event.target.files[0].name
    const fileExtension = fileName.replace(/^.*\./, "")

    if (!file) {
      console.error("No file selected.");
      return;
    }

    if (fileExtension !== 'jpeg' && fileExtension !== 'jpg' && fileExtension !== 'png') {
      toast.error('Invalid File Format')
      return;
    }
    else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          if (img.width <= 36000 && img.height <= 7000) {
            setSelectedFile(file.name);
            setImageDimensionsValid(true);
            const formData = new FormData();
            formData.append("image", file);
            uploadDscFile(formData)
              .then((response) => {
                if (response && response.result) {
                  const cloudPath = response.result;
                  setFilepath(cloudPath);
                  toast.success('Upload successfully')
                } else {
                  console.error(
                    "API response does not contain the expected 'result' property."
                  );
                }
              })
              .catch((error) => {
                console.error("Error during file upload:", error);
              });
          } else {
            setImageDimensionsValid(false);

            // Alert message for invalid image dimensions
            alert("Image dimensions exceed 360x70 pixels. Please select a valid image.");
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (selectedOption, type) => {
    if (type === "productName") {
      setProductName(selectedOption);
    }
  };


  const handleCheckboxChange = (event) => {
    setAccountValidated(event.target.checked);
  };



  const uploadFile = async () => {

    let params = {
      uuid: uuid,
      invoice_type: (productName.value).toString(),
      dsc_date: (moment(startDate).format("YYYY-MM-DD")).toString(),
      dsc_file_path: filepath.toString(),
      account_validated: "YES",
      status: "1"
    }

    if (FormValidation(params)) {
      await addUpdateInvoiceDsc(params)
        .then((res) => {
          console.log(params, 'testResponse');

          if (res.status === 200) {
            navigate('/authorised/DscList');
            toast.success("Sucessfully submitted ");
          } else {
            // Handle other response statuses if needed
            console.error('API response status:', res.status);
            toast.error("Not Uploaded properly");
          }
        })
        .catch((error) => {
          // Handle API request error
          console.error('API request error:', error);
          toast.error("Not Uploaded properly");
        });

    }

  }
  const resetForm = () => {
    setProductName("");
    setSelectedFile(null);
    setFilepath("");
    setStartDate(null);
    setImageDimensionsValid(true);
    setAccountValidated(false);
    setFileInputKey(fileInputKey + 1);
    setDisplayedDate("mm/dd/yyyy");
    setStartDateKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    setDisplayedDate(startDate || "mm/dd/yyyy");
  }, [startDate]);



  return (
    <Page
      title="Extramarks | DSC Upload"
      className="main-container myLeadPage datasets_container"
    >
      <div>
        <div className="tableCardContainer">
          <Paper>
            <Box className="crm-sd-heading">
              <Typography component="h2">DSC Details</Typography>
            </Box>
            <Grid container alignItems="center" spacing={2}>
              <Grid item md={4} xs={12}>
                <Typography className={classes.label}>
                  Invoice Type *
                </Typography>
                <SelectWithRadio
                  options={productOption}
                  value={productName}
                  onChange={handleChange}
                  type={"productName"}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <Typography className={classes.label}>
                  DSC Date *
                </Typography>
                <FormDatePicker
                  key={startDateKey}
                  value={startDate || null} // Use startDate with a fallback to null
                  minDateValue={new Date(new Date().setHours(0, 0, 0, 0))}
                  maxDateValue={new Date()}
                  handleSelectedValue={(newValue) => setStartDate(newValue)}
                  placeholder="mm/dd/yyyy" // Set the placeholder text
                />
              </Grid>

              <Grid item xs={6}>
                <Typography>Upload DSC* (jpg/png etc)</Typography>
                <input
                  key={fileInputKey} // Use a key to reset the input element
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  id="file-upload"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <TextField
                  fullWidth
                  placeholder={selectedFile ? selectedFile : 'No file selected'} // Use placeholder instead of label
                  variant="outlined"
                  style={{ width: '440px' }} // Set the width to your desired value
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button onClick={handleFileUpload}>Browse</Button>
                      </InputAdornment>
                    ),
                  }}
                  error={!imageDimensionsValid}
                  helperText={
                    !imageDimensionsValid
                      ? 'Please select an image with dimensions not exceeding 360x70 pixels.'
                      : ''
                  }
                />
              </Grid>


            </Grid>

          </Paper>
        </div>
        <Grid container justifyContent="flex-end" style={{ maxWidth: '98%' }}>
          <Grid item>
            <Button className={classes.submitBtn} onClick={resetForm}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button className={classes.submitBtn} onClick={() => uploadFile()}>
              Save
            </Button>
          </Grid>
        </Grid>

      </div>

    </Page>
  );

};

export default DscUpload;