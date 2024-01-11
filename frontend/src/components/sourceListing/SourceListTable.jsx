import PropTypes from "prop-types";
import moment from "moment";
import { useNavigate, Link } from "react-router-dom";
import { TableSortLabel, Tooltip } from "@mui/material";
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
import UpArrow from "../../assets/image/arrowUp.svg";
import DownArrow from "../../assets/image/arrowDown.svg";
import EditIcon from "../../assets/icons/edit-icon.svg";
import DeleteIcon from "../../assets/icons/icon_trash.svg";
import { updateSource } from "../../config/services/matrixSource";
import { toast } from "react-hot-toast";
import { makeStyles } from "@mui/styles";


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

export default function SourceListTable({
  list,
  openInPopup,
  handleSort,
  sortObj,
  deleteStageObject,
  pageNo,
  itemsPerPage,
  handleStatusToggle,
  fetchSourceList,
  ...other
}) {
  const [sourceList, setSourceList] = useState(list);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteObj, setDeleteObj] = useState("");
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

  const handleButtonClick = async (row, type) => {
    if (type === "delete") {
      let obj = {
        uuid: loggedInUser,
        source_id: row?.source_id,
        source_name: row?.source_name,
        source_description: row?.source_description,
        status: 3,
      };
      try {
        const response = await updateSource(obj);
        response.data.status === 1
          ? toast.success("Entry deleted successfully!")
          : toast.error(response?.data.message);
        fetchSourceList();
      } catch (err) {
        console.log("error in updateCampaign: ", err);
        toast.error("***Error***");
      }
    } else if (type === "edit") {
      navigate(`/authorised/add-pricematrix-source/${row?.source_id}`, {
        state: { row: row },
      });
    }
  };

  const handleChangeStatus = async (id, status) => {
    let obj = {
      source_id: parseInt(id),
      status: status === 1 ? 2 : 1,
    };
    try {
      const response = await updateSource(obj);
      if (response.data.status === 1) {
        toast.dismiss()
        toast.success("Status Changed");
        fetchSourceList()
      } else {
        toast.error(response?.data.message);
      }
    }
    catch (err) {
      console.log("error in updateSource: ", err);
      toast.error("***Error***");
    }

  }
  useEffect(() => setSourceList([...list]), [list]);

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
                  <TableCell sx={{ width: '20%' }}>
                    <div className="tableHeadCell" >Source Name</div>
                  </TableCell>
                  <TableCell sx={{ paddingLeft: '30px' }}>
                    <div className="tableHeadCell">Source Code</div>
                  </TableCell>
                  <TableCell>
                    <div className="tableHeadCell">Created By & Date</div>
                  </TableCell>
                  <TableCell>
                    <div className="tableHeadCell">Last Modified By & Date</div>
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
                      {/* <TableCell>{row?.source_name ?? "-"}</TableCell> */}
                      <Tooltip title={row?.source_name} placement="top-start">
                        <TableCell>
                          {/* <Link
                          to={{
                            pathname: `/authorised/add-pricematrix-source/${row?.source_id}`,
                            state: { row: row },
                          }}
                        > */}
                          <div style={{ color: '#f45e29', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => handleButtonClick(row, "edit")}>
                            {row?.source_name}
                          </div>
                        </TableCell>
                      </Tooltip>


                      <TableCell>{row?.source_code ?? "-"}</TableCell>

                      <TableCell>
                        {row?.created_by}
                        <div>
                          {moment(row?.created_on * 1000).format(
                            "DD-MM-YYYY (HH:mm A)"
                          )}
                        </div>

                      </TableCell>
                      <TableCell>
                        {row?.modified_by ? row?.modified_by : row?.created_by}
                        <div>
                          {row?.modified_on ? moment(row?.modified_on * 1000).format("DD-MM-YYYY (HH:mm A)")
                            : moment(row?.created_on * 1000).format("DD-MM-YYYY (HH:mm A)")}
                        </div>

                      </TableCell>

                      <TableCell>
                        <span onClick={() => handleChangeStatus(row?.source_id, row?.status)} className={row.status === 1 ? "cm_active" : "cm_inactive"}>
                          {row?.status === 1 && "Active"}
                          {row?.status === 2 && "Inactive"}
                          {row?.status === 3 && "Deleted"}
                        </span>
                      </TableCell>
                      <TableCell className="edit-cell action-cell">
                        <Button className="form_icon">
                          <img
                            src={EditIcon}
                            alt=""
                            onClick={() => handleButtonClick(row, "edit")}
                          />
                        </Button>
                        <Button className="form_icon">
                          <img
                            src={DeleteIcon}
                            alt=""
                            onClick={() => handleModelView(row)}
                          />
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

SourceListTable.propTypes = {
  list: PropTypes.array.isRequired,
};
