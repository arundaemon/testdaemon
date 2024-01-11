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
import moment from 'moment';
import EditIcon from "../assets/icons/edit-icon.svg";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'

const BasicTable = (props) => {
  let { list, handleStatusToggle, pageNo, itemsPerPage, attendanceMatrixType } = props;
  const navigate = useNavigate();

  const handleNavigation = (row) => {
    let url = `/authorised/update-matrix/${row._id}`
    navigate(url)
  }


  const hyperLink = (route) => {
    navigate(route)
  }




  return (
    <TableContainer component={Paper}>
      <div className='journey-list-heading'>
        <h4>Manage Matrix</h4>
        {/* <p>Loremispum Loremispum Loremispum</p> */}
      </div>
      <Table
        aria-label="customized table"
        className="custom-table datasets-table"
      >
        <TableHead>
          <TableRow className="cm_table_head">
            <TableCell>S.No.</TableCell>
            <TableCell>Profile / Role</TableCell>
            <TableCell>Min. Target</TableCell>
            <TableCell>Max. Target</TableCell>
            <TableCell>Created By & Date</TableCell>
            <TableCell>Last Modify & Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {list &&
            list.length > 0 &&
            list.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{(i + 1) + ((pageNo - 1) * itemsPerPage)}.</TableCell>
                <TableCell>
                  <Link
                    style={{ color: "#4482FF" }}
                    to={{ pathname: `/authorised/AddActivity/${row?._id}` }}
                    state={{ manageMatrixData: row }}
                  >
                    {row.attendanceMatrixType === 'PROFILE' ? row?.profile_name : row?.role_name}
                  </Link>
                </TableCell>
                <TableCell >{row.minTarget} </TableCell>
                <TableCell >{row.maxTarget}</TableCell>
                <TableCell>{row?.createdBy ?? '-'}<div>{moment(row?.createdAt).format('DD-MM-YY (HH:mm A)')}</div></TableCell>
                <TableCell>{row?.modifiedBy ?? '-'}<div>{moment(row?.updatedAt).format('DD-MM-YY (HH:mm A)')}</div></TableCell>
                <TableCell>
                  <span onClick={(e) => handleStatusToggle(e, row)} className={row.status === 1 ? "cm_active" : "cm_inactive"}>{row.status === 1 ? "Active" : "Inactive"}</span>
                </TableCell>
                <TableCell className="edit-cell action-cell">
                  <Button className="form_icon" onClick={() => handleNavigation(row)}>
                    <img src={EditIcon} alt="edit icon" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BasicTable;







