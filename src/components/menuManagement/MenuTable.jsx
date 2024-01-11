import PropTypes from "prop-types";
import moment from "moment";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import EditIcon from "../../assets/icons/edit-icon.svg";
import DeleteIcon from "../../assets/icons/icon_trash.svg";
// import Chip from '@mui/material/Chip';

export default function MenuTable({
  list,
  openInPopup,
  deleteUserType,
  pageNo,
  itemsPerPage,
  ...other
}) {
  console.log(list, '............list')
  return (
    <TableContainer className="table-container" component={Paper} {...other}>
      <Table
        aria-label="customized table"
        className="custom-table datasets-table"
      >
        <TableHead>
          <TableRow className="cm_table_head">
            <TableCell>S.No.</TableCell>
            <TableCell>Menu</TableCell>
            <TableCell>Route</TableCell>
            <TableCell>Parent Menu</TableCell>
            <TableCell>Project</TableCell>
            <TableCell>OTp Verify</TableCell>
            <TableCell>Icon</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {list &&
            list.length > 0 &&
            list.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{i + 1 + (pageNo - 1) * itemsPerPage}</TableCell>
                <TableCell className="datasetname-cell">{row.name}</TableCell>
                <TableCell>{row?.route ?? "-"}</TableCell>
                <TableCell>{row?.parentMenu?.name ?? "-"}</TableCell>
                <TableCell>{row?.projectId?.projectName ?? "-"}</TableCell>
                <TableCell>
                  {row?.otpVerify === true ? "Active" : "Inactive"}
                </TableCell>
                <TableCell>
                  <img
                    className="menu-table-icon"
                    src={row?.iconUrl}
                    alt="menu icon"
                  />
                </TableCell>
                <TableCell>
                  {" "}
                  {moment(row?.createdAt).format("DD/MMM/YY")}{" "}
                </TableCell>
                <TableCell className="edit-cell action-cell">
                  <Button
                    className="form_icon"
                    onClick={() => openInPopup(row)}
                  >
                    <img src={EditIcon} alt="" />
                  </Button>
                  <Button
                    className="form_icon"
                    onClick={() => deleteUserType(row)}
                  >
                    <img src={DeleteIcon} alt="" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

MenuTable.propTypes = {
  list: PropTypes.array.isRequired,
};
