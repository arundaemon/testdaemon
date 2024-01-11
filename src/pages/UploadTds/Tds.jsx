import React, { useEffect, useState, useRef } from "react";
import Page from "../../components/Page";
import {
  TextField,
  InputAdornment,
  Button,
  Modal,
  Paper,
  Input,
  Typography,
  ListItemText,
  MenuItem,
  Divider,
  Select,
  FormControl,
  Grid,
  Box,
  TablePagination,
  Container,
  Checkbox,
} from "@mui/material";
import { TableContainer } from '@mui/material';
import Pagination from "../../pages/Pagination";

import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import FileUploadIcon from '@mui/icons-material/FileUpload';

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
//import ExcelIcon from '@mui/icons-material/Excel';

import { makeStyles } from "@mui/styles";
import { getLoggedInRole } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
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
import { addSchoolTdsDetail, listSchoolTdsDetail } from "../../config/services/packageBundle";
import { uploadTdsFile, getSchoolsByCode } from "../../config/services/purchaseOrder"
import Papa from "papaparse";
import { Toast } from "react-bootstrap";





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

const Tds = () => {
  const classes = useStyles();
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid
  const [amount, setAmount] = useState("");
  const [datetds, setDatetds] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [uploadData, setUploadData] = useState("");
  const [filepath, setFilepath] = useState("");
  const [lastPage, setLastPage] = useState(false)
  const [tdsList, setTdsList] = useState([])
  const [pageNo, setPagination] = useState(1);
  const [loader, setLoading] = useState(false);
  const [itemsPerPage] = useState(10);
  let serialNumber = 0;
  const [fileInputValue, setFileInputValue] = useState("");

  const [invalidSchoolCodesToastShown, setInvalidSchoolCodesToastShown] = useState(false);
  const [invalidSchoolCodes, setInvalidSchoolCodes] = useState([]);



  const downloadSampleFile = () => {
    const csvContent = "Date(YYYY-MM-DD),School Code,Amount";

    const blob = new Blob([csvContent], { type: 'text/csv' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'sample_file.csv';

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.error("No file selected.");
      return;
    }
    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();

    if (fileExtension !== 'csv') {
      toast.error("Please select a valid CSV file.");
      return;
    }
    setFileInputValue(file.name);

    const formData = new FormData();
    formData.append("image", file);

    try {
      // Upload the file and get the cloud path
      const response = await uploadTdsFile(formData);

      const cloudPath = response.result;

      setFilepath(cloudPath);

      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target.result;
        const parsedData = Papa.parse(content, { header: true }).data;

        const filteredData = parsedData.filter(
          (item) => item["Date(YYYY-MM-DD)"] !== ""
        );

        const validProcessedData = [];
        const invalidSchoolCodes = []; // Store invalid school codes here

        for (const item of filteredData) {
          const formattedDate = new Date(
            item["Date(YYYY-MM-DD)"]
          ).toISOString().split("T")[0];

          const rowData = {
            school_code: item["School Code"],
            tds_date: formattedDate,
            tds_amount: item.Amount, // Use the correct column name from your Excel data
          };

          try {
            const schoolExists = await checkSchoolCodes([rowData.school_code]);

            if (schoolExists[0]) {
              validProcessedData.push(rowData);
            } else {
              console.error(`School with code ${rowData.school_code} not found.`);
              invalidSchoolCodes.push(rowData.school_code); // Add the invalid school code to the list
            }
          } catch (error) {
            console.error("Error checking school codes:", error);
            // Handle the error appropriately, e.g., show an error message to the user.
          }
        }

        if (invalidSchoolCodes.length > 0) {
          // Display a single toast message with the combined list of invalid school codes
          toast.error(
            `The following school codes are not valid: ${invalidSchoolCodes.join(", ")}. Please enter valid school codes.`
          );
        }

        console.log("Processed Data:", validProcessedData);
        setUploadData(validProcessedData);
      };

      reader.readAsText(file);
    } catch (error) {
      console.error("Error during file upload:", error);
      // Handle the error appropriately, e.g., show an error message to the user.
    }
  };

  const checkSchoolCodes = async (schoolCodeList) => {
    try {
      const params = {
        schoolCodeList,
      };

      const schoolData = await getSchoolsByCode(params);

      const invalidSchoolCodes = [];

      const existsArray = schoolCodeList.map((schoolCode) => {
        // Check if the school code exists in the response
        const exists = schoolData?.result.some((school) => school.schoolCode === schoolCode);
        // console.log(`School Code ${schoolCode} exists: ${exists}`);
        if (!exists) {
          invalidSchoolCodes.push(schoolCode);
        }
        return exists;
      });


      // Check if any school codes were not found
      if (invalidSchoolCodes.length > 0) {
        const invalidCodesMessage = invalidSchoolCodes.join(", ");
        // Display a single toast message
        // toast.error(
        //   `The following school codes are not valid: ${invalidCodesMessage}. Please enter valid school codes.`
        // );
      }

      return existsArray;
    } catch (error) {
      console.error("Error while checking school codes:", error);
      return schoolCodeList.map(() => false);
    }
  };

  // console.log(".................schoolCode", uploadData);
  // console.log(".................path", filepath);




  const uploadFile = async () => {

    let params = {
      uuid: uuid,

      upload_type: "TDS",

      file_path: filepath.toString(),

      status: 1,

      tds_uploaded_data: uploadData,
    }



    await addSchoolTdsDetail(params)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Sucessfully submitted ");
          getListTds()

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

    console.log(params, 'testResponse')
  }

  const getListTds = async () => {
    let params = {
      status: [1, 2],
      upload_type: "TDS",
      page_offset: (pageNo - 1),
      page_size: itemsPerPage,
      order_by: "created_on",
      order: "DESC",
      uuid: uuid,
    };

    setLastPage(false);
    let res = await listSchoolTdsDetail(params);
    let data = res?.data?.tds_uploaded_details;

    const schoolCodes = data.map((item) => item.school_code);
    const schoolNames = await fetchSchoolNames(schoolCodes);

    data.forEach((item) => {
      item.school_name = schoolNames[item.school_code] || "NA";
    });

    setTdsList(data);

    if (data?.length < itemsPerPage) setLastPage(true);
    setLoading(false);
  };

  const fetchSchoolNames = async (schoolCodes) => {
    const schoolNameMap = {};

    try {
      const params = {
        schoolCodeList: schoolCodes,
      };

      const schoolData = await getSchoolsByCode(params);
      schoolData?.result.forEach((school) => {
        schoolNameMap[school.schoolCode] = school.schoolName;
      });

      return schoolNameMap;
    } catch (error) {
      console.error("Error while fetching school names:", error);
      return schoolNameMap;
    }
  };

  const handleDownload = (filePath) => {

    const link = document.createElement('a');
    link.href = filePath;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.download = filePath.split('/').pop();


    try {
      link.click();
      console.log('Click event triggered successfully.');
    } catch (error) {
      console.error('Error during click event:', error);
    }
  };

  useEffect(() => {
    getListTds()
  }, [pageNo])
  const fileInputRef = useRef(null);


  return (

    <Page
      title="Extramarks | Upload TDS"
      className="main-container myLeadPage datasets_container"
    >
      <div className="tableCardContainer">
        <Paper>
          <Box className="crm-sd-heading">
            <Typography component="h2">Upload TDS</Typography>
          </Box>
          <TableContainer component={Paper}>
            <div style={{ display: 'inline-block' }}>
              <Typography component="h2" style={{ fontWeight: 'bold', textDecoration: 'underline', marginRight: '40px' }}>TDS</Typography>
            </div>
            <div style={{ display: 'inline-block', marginRight: '20px' }}>
              <Button
                onClick={downloadSampleFile}
                variant="contained"
                color="white"
                endIcon={<><InsertDriveFileIcon />
                  <GetAppIcon sx={{ color: 'black' }} />
                </>} // Add both icons within <></>

                style={{
                  color: 'green',
                  '&:hover': {
                    boxShadow: 'rgba(169, 169, 169, 0.8) 0px 3px 5px 0px', // Adjust shadow color
                  }
                }}


              >
                <span style={{ color: 'black', fontWeight: 'normal' }}>Download Sample Excel File  </span>
              </Button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
              <div style={{ flex: '1', padding: '5px' }}>
                <b>Upload TDS File:</b>
              </div>

              <div style={{ flex: '2', padding: '5px', display: 'flex', alignItems: 'center' }}>
                <Input
                  style={{ display: 'none' }}
                  type="file"
                  accept=".csv"
                  id="file-upload-input"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                />
                <label htmlFor="file-upload-input">
                  <TextField
                    value={fileInputValue}
                    readOnly
                    placeholder="Upload a file"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FileUploadIcon style={{ cursor: "pointer" }} onClick={() => fileInputRef.current.click()} />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    sx={{ borderRadius: 0 }}
                    style={{ border: 'none', outline: 'none' }}
                  />
                </label>
              </div>

              <div style={{ flex: '2', padding: '5px', marginRight: '500px' }}>
                {/* <Button variant="outlined"
                  
                  style={{ color: 'black', padding: '16px 16px',border: '1px solid #ccc' }}
                  onClick={() => uploadFile()}></Button> */}
                <Button className={classes.submitBtn} onClick={() => uploadFile()}>
                  Upload
                </Button>
              </div>
            </div>

          </TableContainer>
        </Paper>
      </div>
      <Container className='table_max_width'>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No.</TableCell>
              <TableCell>School Name</TableCell>
              <TableCell>School Code</TableCell>
              <TableCell>Date of Uploading</TableCell>
              <TableCell>Download File</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tdsList.map((item) => (
              <TableRow key={item.id} >

                <TableCell>

                  {++serialNumber}
                </TableCell>
                <TableCell>{item.school_name || "NA"}</TableCell>
                <TableCell>{item?.school_code || "NA"}</TableCell>
                <TableCell>{item?.created_on ? moment.unix(item.created_on).format('YYYY-MM-DD') : "NA"}</TableCell>
                <TableCell>
                  {item?.file_path ? (

                    <GetAppIcon onClick={() => handleDownload(item.file_path)} style={{ cursor: "pointer" }} />
                  ) : (
                    "NA"
                  )}
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>

      <div className='center cm_pagination'>
        <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} />
      </div>

    </Page>

  );
};

export default Tds;