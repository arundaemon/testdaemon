import React, { useEffect, useState } from "react";
import Page from "../../components/Page";
import {
  TextField,
  InputAdornment,
  Button,
  Modal,
  Paper,
  Typography,
  ListItemText,
  MenuItem,
  Divider,
  Select,
  FormControl,
  Container,

  Grid,
  Box,
  TablePagination,
  Checkbox,
} from "@mui/material";
import GetAppIcon from '@mui/icons-material/GetApp';
import ImageIcon from "../../assets/icons/image_icon.svg"
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

import { makeStyles } from "@mui/styles";
import { getLoggedInRole } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import FilterIcon from "../../assets/image/filterIcon.svg";
import SearchIcon from "../../assets/icons/icon_search.svg";
import _ from "lodash";
import moment from "moment";
import { fetchImplementationList } from "../../config/services/implementationForm";
import { DisplayLoader } from "../../helper/Loader";
import { getAllChildRoles } from "../../config/services/hrmServices";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { DecryptData, EncryptData } from "../../utils/encryptDecrypt";
import { getSchoolList } from "../../config/services/school";
import { assignedEngineer } from "../../config/services/leadassign";
import { toast } from "react-hot-toast";
import { getLeadInterestData, getReportSchoolList } from '../../helper/DataSetFunction';
import { addUpdateInvoiceDsc, listInvoiceDsc } from "../../config/services/packageBundle";
import Pagination from "../../pages/Pagination";

import useMediaQuery from "@mui/material/useMediaQuery";
import DeleteIcon from "../../assets/icons/icon_trash.svg";



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
  cusCard: {
    padding: "18px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
    margin: "0.5rem 1rem",
  },
  RevenueCard: {
    padding: "0px",
    overflow: "hidden",
  },
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
  cusSelect: {
    width: "100%",
    fontSize: "14px",
    marginLeft: "1rem",
    borderRadius: "4px",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  mbForMob: {
    [theme.breakpoints.down("md")]: {
      marginBottom: "1rem",
    },
  },
  filterSection: {
    display: "flex",
    alignItems: "center",
  },
  noData: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 600,
    fontSize: 25,
  },
  loader: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  noData: {
    /* Add your styling for the message here */
    color: "red",
    fontWeight: "bold",
  },
  noDataTable: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 600,
    fontSize: 25
  },
  customBorder: {
    padding: "10px 16px",
    border: "1px solid #eee",
    fontSize: "15px",
  },
  quotationLink: {
    cursor: "pointer",
    color: "#f45e29",
    textDecoration: "underline",
  },
}));

const DscList = () => {
  const classes = useStyles();
  const [searchTextField, setSearchTextField] = useState("");
  const [search, setSearchValue] = useState("");
  const [searchBy, setSearchBy] = useState('dsc_date')

  const userRole = getLoggedInRole();
  const navigate = useNavigate();
  const [implementationData, setImplementationData] = useState([]);
  const [invalidSearch, setInvalidSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectUserModal, setSelectUserModal] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const [checkedRows, setCheckedRows] = useState([]);
  //const [empName,setEmpName] = useState("")
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid


  const [openDialog, setOpenDialog] = useState(false);  // Set the initial state to false
  const [lastPage, setLastPage] = useState(false)
  const [dscList, setDscList] = useState([])
  const [pageNo, setPagination] = useState(1);
  const [loader, setLoading] = useState(false);
  const [itemsPerPage] = useState(10);
  let serialNumber = 0;

  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const [checkboxStates, setCheckboxStates] = useState({});

  const isChecked = (row) => {
    return checkedRows.includes(row);
  };
  const handleRowCheck = (event, row) => {
    if (event.target.checked) {
      setCheckedRows([...checkedRows, row]);
    } else {
      setCheckedRows(checkedRows.filter((checkedRow) => checkedRow !== row));
    }
  };

  const getListDsc = async () => {
    let params = {
      status: [1, 2], // Only select status 1 and 2
      page_offset: pageNo - 1,
      page_size: itemsPerPage,
      order_by: "dsc_auto_id",
      order: "ASC",
      uuid: uuid,
    };

    if (search.trim() !== "") {
      params.search_by = "dsc_date";
      params.search_val = search;
    }

    setLastPage(false);

    let res = await listInvoiceDsc(params);
    // console.log(".................responds", res?.data?.dsc_details);
    let data = res?.data?.dsc_details.filter((item) => item.status !== 3); // Filter out status 3
    setDscList(data);

    if (data?.length < itemsPerPage) setLastPage(true);
    setLoading(false);
  };



  const handleSearch = _.debounce((e) => {
    let { value } = e.target;
    value = value.trim();
    if (value !== '') {
      setPagination(1);
      setSearchValue(value, () => setPagination(1));
    } else {
      setSearchValue("");
    }
  }, 700)




  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const toggleSelectUserModal = () => {
    setSelectUserModal(!selectUserModal);
  };

  const toggleChangeOwnerModal = () => {
    setSelectUserModal(!selectUserModal);
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

  const handleSelectClick = (event, item) => {
    if (event.target.checked) {
      setSelectedItems((prevSelected) => [...prevSelected, item?.dsc_auto_id]);
      // setItemsToDelete((prevSelected) => [...prevSelected, item?.dsc_auto_id]); // Update itemsToDelete
    } else {
      setSelectedItems((prevSelected) =>
        prevSelected.filter((code) => code !== item?.dsc_auto_id)
      );
      setItemsToDelete((prevSelected) =>
        prevSelected.filter((code) => code !== item?.dsc_auto_id)
      ); // Remove the item from itemsToDelete
    }
  };

  const handleSelectAllCheckbox = () => {
    setSelectAllChecked(!selectAllChecked); // Toggle the selectAllChecked state

    if (!selectAllChecked) {
      // If "Select All" is checked, select all items
      const allItemIds = dscList.map((item) => item.dsc_auto_id);
      setCheckedRows(allItemIds);
    } else {
      // If "Select All" is unchecked, clear all selections
      setCheckedRows([]);
    }
  };



  const handleDelete = async () => {

    const dscAutoIds = checkedRows.map(row => row.dsc_auto_id);
    const joinedString = dscAutoIds.join(', ');
    const invoicetype = checkedRows.map(row => row.invoice_type)
    const invoice_tye = invoicetype.join()
    const dscdate = checkedRows.map(row => row.dsc_date)
    const dsc_date = dscdate.join()
    const filepath = checkedRows.map(row => row.dsc_file_path)
    const dsc_file_path = filepath.join()

    let params = {
      uuid: uuid,

      dsc_auto_id: parseFloat(joinedString),
      invoice_type: invoice_tye,

      dsc_date: dsc_date,

      dsc_file_path: dsc_file_path,

      account_validated: "YES",




      status: "3"
    }



    await addUpdateInvoiceDsc(params)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Sucessfully submitted ");
          setCheckedRows([]);
          getListDsc()

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
  const isSelectAllCheckedN = () => {
    return (
      (dscList?.length > 0 && dscList.length === checkedRows.length)
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      // setCheckedRows(dscList.map((item) => item.dsc_auto_id));
      setCheckedRows(dscList)
    } else {
      setCheckedRows([]);
    }
  };

  const deleteDsc = async (row) => {
    let params = {
      uuid: uuid,
      dsc_auto_id: row?.dsc_auto_id,
      invoice_type: row?.invoice_type,
      dsc_date: row?.dsc_date,
      dsc_file_path: row?.dsc_file_path,
      account_validated: row?.account_validated,
      status: "3"
    }
    await addUpdateInvoiceDsc(params)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Sucessfully submitted ");
          getListDsc()

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




  useEffect(() => {
    getListDsc()
  }, [pageNo, search])

  return (
    <Page
      title="Extramarks | DSC Table"
      className="main-container myLeadPage datasets_container"
    >
      <div className="tableCardContainer">
        <Paper>
          <Box className="crm-sd-heading">
            <Typography component="h2">DSC List</Typography>
          </Box>
          <div className="mainContainer">
            <div className="right" justifyContent="flex-end">
              <form>
                <TextField
                  className={`inputRounded search-input width-auto`}
                  type="search"
                  placeholder="Search"
                  // value={searchTextField}
                  onChange={handleSearch}

                  InputLabelProps={{ style: { top: `${-7}px` } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <img src={SearchIcon} alt="" />
                      </InputAdornment>
                    ),
                  }}
                />
              </form>
            </div>
          </div>
          <div className={classes.filterSection}>
            <div style={{ width: "100%", height: "100%" }}>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >

              </div>
            </div>
            <div className="right">
              <Button
                className={classes.submitBtn}
                style={{ width: '150px', height: '50px' }}
                onClick={() => {
                  navigate("/authorised/DscUpload");
                }}

              >
                Create New
              </Button>
            </div>

            <div className="right">
              {checkedRows.length > 0 && (
                <Button
                  className={classes.submitBtn}
                  style={{ width: "150px", height: "50px" }}
                  onClick={() => handleDelete()}
                >
                  Delete
                </Button>
              )}
            </div>

          </div>

          <Container className='table_max_width'>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sr. no..</TableCell>
                  <TableCell>Invoice Type.</TableCell>
                  <TableCell>DSC Date</TableCell>
                  <TableCell>DSC Image</TableCell>
                  <TableCell>Create Date</TableCell>
                  <TableCell >Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dscList.map((item, index) => (
                  <TableRow key={item.id} >
                    <TableCell>
                    {index + 1 + (pageNo - 1) * itemsPerPage}
                    </TableCell>
                    <TableCell>
                      {item?.invoice_type === "SW" ? "Software" : item?.invoice_type === "HW" ? "Hardware" : "NA"}
                    </TableCell>
                    <TableCell>{item?.dsc_date || "NA"}</TableCell>

                    <TableCell>
                      {item?.dsc_file_path ? (
                        <img src={item.dsc_file_path} alt="DSC Image" onClick={() => handleDownload(item.dsc_file_path)} style={{ cursor: "pointer", maxWidth: "100px" }} />
                      ) : (
                        "NA"
                      )}
                    </TableCell>
                    <TableCell>{item?.created_on ? moment.unix(item.created_on).format('YYYY-MM-DD') : "NA"}</TableCell>
                    <TableCell className="edit-cell action-cell">

                      <Button className='form_icon' onClick={() => deleteDsc(item)}><img src={DeleteIcon} alt='' /></Button>
                    </TableCell>


                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Container>

        </Paper>
      </div>
      <div className='center cm_pagination'>
        <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} />
      </div>
    </Page>
  );
};

export default DscList;
