import * as React from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CurrencySymbol } from "../../constants/general";

const PendingCollectionTable = ({
  list,
  pageNo,
  itemsPerPage,
  schoolDetails,
}) => {
  const navigate = useNavigate();

  const isRedirect = (schoolCode) => {
    navigate(`/authorised/collection-detail/${schoolCode}`);
  };

  const getSchoolName = (schoolCode) => {
    let data = schoolDetails?.find((obj) => obj?.schoolCode === schoolCode);

    if (data) {
      return data?.schoolName;
    }
  };

  return (
    <TableContainer component={Paper}  className="crm-table-container">
      <Table aria-label="simple table" className='crm-table-size-md' >
        <TableHead>
          <TableRow className="cm_table_head">
            <TableCell>S.No.</TableCell>
            <TableCell>School Code</TableCell>
            <TableCell>School Name</TableCell>
            <TableCell>Total Due Amount</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list &&
            list?.length > 0 &&
            list.map((row, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {i + 1 + (pageNo - 1) * itemsPerPage}
                </TableCell>
                <TableCell>{row?.school_code}</TableCell>
                <TableCell>{getSchoolName(row?.school_code)}</TableCell>
                <TableCell>
                  {/* {row?.total_due_amount} */}
                  {`${CurrencySymbol?.India}${Number(
                    row?.total_due_amount)
                  ?.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}`}
                </TableCell>
                <TableCell>{row?.collection_due_date}</TableCell>
                <TableCell align="right" >
                  <div onClick={() => isRedirect(row?.school_code)} className="crm-anchor crm-anchor-small">
                    View Details
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PendingCollectionTable;
