import PropTypes from "prop-types";
import moment from "moment";
import { useNavigate, Link } from "react-router-dom";
import { TableSortLabel } from "@mui/material";
import { useState, useEffect } from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Switch,
  Modal,
  Fade,
  Box,
  Typography,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import UpArrow from "../assets/image/arrowUp.svg";
import DownArrow from "../assets/image/arrowDown.svg";
import EditIcon from "../assets/icons/edit-icon.svg";
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import DeleteIcon from "../assets/icons/icon_trash.svg";
import { updateCampaign } from "../config/services/campaign";
import { toast } from "react-hot-toast";
import { makeStyles } from "@mui/styles";
import { updateService } from "../config/services/packageBundle";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "auto",
  },
  modalPaper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #fff",
    boxShadow: "0px 0px 4px #0000001A",
    minWidth: "300px",
    borderRadius: "4px",
    textAlign: "center",
  },
  modalTitle: {
    fontSize: "18px",
  },
  outlineButton: {
    color: "#85888A",
    fontSize: "14px",
    border: "1px solid #DEDEDE",
    borderRadius: "4px",
    fontWeight: "normal",
    marginRight: "10px",
    padding: "0.5rem 1.5rem",
  },
  containedButton: {
    color: "#fff",
    fontSize: "14px",
    border: "1px solid #F45E29",
    borderRadius: "4px",
    fontWeight: "normal",
    padding: "0.5rem 1.5rem",
  },
}));

export default function ServiceManagementTable({
  list,
  openInPopup,
  handleSort,
  sortObj,
  deleteStageObject,
  pageNo,
  itemsPerPage,
  handleStatusToggle,
  fetchCampaignList,
  ...other
}) {
  const [sourceList, setSourceList] = useState(list);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteObj, setDeleteObj] = useState("");
  const [editObj, setEditObj] = useState("");
  const [loggedInUser] = useState(
    JSON.parse(localStorage.getItem("loginData"))?.uuid
  );
  const navigate = useNavigate();
  const classes = useStyles();
  const handleCancelDelete = () => {
    setDeletePopup(false);
    setDeleteObj({});
  };

  const handleModelView = (row) => {
    setDeletePopup(true);
    setDeleteObj(row);
  };

  const submitDeleteStatus = (row) => {
    setDeletePopup(false);
    handleButtonClick(row, "delete");
  };
  const handleChange = async (row) => {
    console.log(row, "rowww");
    
    const updatedRow = { ...row, status: row.status === 1 ? 2 : 1, package_id: row.package_details.map(pkg => pkg.package_id) };
    setEditObj(updatedRow);
    await handleButtonClick(updatedRow, "edit");
  };

  const handleButtonClick = async (row, type) => {
    console.log(row,"row")
    if (type === "delete") {
      let obj = {
        uuid:loggedInUser,
        service_id: parseInt(row?.service_id),
        service_name: row?.service_name,
        service_desciption: row?.service_desciption,
        status: 3,
        hsn_code:row?.hsn_code,
        service_mrp:row?.service_mrp,
        service_mop:row?.service_mop,
      };
      try {
        const response = await updateService(obj);
        response.data.status === 1
          ? toast.success("Entry deleted successfully!")
          : toast.error(response?.data.message);
        fetchCampaignList();
      } catch (err) {
        console.log("error in updateCampaign: ", err);
        toast.error("***Error***");
      }
    } else if (type === "edit") {
      console.log(row,"rowww")
      let obj = {
        uuid:loggedInUser,
        service_id: row?.service_id,
        service_name: row?.service_name,
        service_description: row?.service_description,
        status: row?.status,
        hsn_code:row?.hsn_code,
        service_mrp:row?.service_mrp,
        service_mop:row?.service_mop,
        package_id: row?.package_id,
      };
      console.log(obj,"object")
      try {
        const response = await updateService(obj);
        // response.data.status === 1
        //   ? toast.success("Entry deleted successfully!")
        //   : toast.error(response?.data.message);
        fetchCampaignList();
      } catch (err) {
        console.log("error in updateCampaign: ", err);
        toast.error("***Error***");
      }
    }
  };

  useEffect(() => setSourceList([...list]), [list]);

  console.log(sourceList, "source");
  return (
    <>
      <TableContainer className="table-container" component={Paper} {...other}>
        {/* <div className='journey-list-heading'>
                    <h4>Campaign Management</h4>
                    
                </div> */}
        {sourceList && sourceList.length > 0 && (
          <>
            <Table
              aria-label="customized table"
              className="custom-table datasets-table"
            >
              <TableHead>
                <TableRow className="cm_table_head">
                  <TableCell>
                    <div className="tableHeadCell">Sr. No.</div>
                  </TableCell>
                  <TableCell>
                    <div className="tableHeadCell">Service Name</div>
                  </TableCell>
                  <TableCell>
                    <div className="tableHeadCell">MRP</div>
                  </TableCell>
                  <TableCell>
                    <div className="tableHeadCell">MOP/Cut Price</div>
                  </TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                  {/* <TableCell >Action</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {sourceList &&
                  sourceList.length > 0 &&
                  sourceList.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        {i + 1 + (pageNo - 1) * itemsPerPage}.
                      </TableCell>
                      <TableCell>{row?.service_name ?? "-"}</TableCell>
                      <TableCell>{row?.service_mrp ?? "-"}</TableCell>

                      <TableCell>
                      {row?.service_mop ?? "-"}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={row.status === 1}
                          onChange={() => handleChange(row)}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      </TableCell>
                      <TableCell className="edit-cell action-cell">
                        <Button className="form_icon" onClick={() => handleModelView(row)}>
                        <DisabledByDefaultIcon />
                        
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              className={classes.modal}
              open={deletePopup}
              closeAfterTransition
            >
              <Fade in={deletePopup}>
                <Box
                  className={classes.modalPaper + " modal-box modal-md"}
                  id="transition-modal-title"
                >
                  <Box className="modal-header p-1">
                    <Typography
                      variant="subtitle1"
                      className={classes.modalTitle + " modal-header-title"}
                    >
                      {`Are you sure you want to delete this row ?`}
                    </Typography>
                  </Box>
                  {/* <Box className="modal-content text-left"> */}
                  <Box className="modal-footer text-right">
                    <Button
                      onClick={handleCancelDelete}
                      className={" report_form_ui_btn cancel mr-2"}
                      color="primary"
                      variant="outlined"
                    >
                      {" "}
                      Cancel{" "}
                    </Button>
                    <Button
                      onClick={() => submitDeleteStatus(deleteObj)}
                      color="primary"
                      autoFocus
                      className={" report_form_ui_btn submit"}
                      variant="contained"
                    >
                      {" "}
                      Delete{" "}
                    </Button>
                  </Box>
                  {/* </Box> */}
                </Box>
              </Fade>
            </Modal>
          </>
        )}
      </TableContainer>
    </>
  );
}

ServiceManagementTable.propTypes = {
  list: PropTypes.array.isRequired,
};
