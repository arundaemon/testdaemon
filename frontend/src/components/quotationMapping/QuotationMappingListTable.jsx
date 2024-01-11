import moment from "moment";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link, useNavigate } from "react-router-dom";
import _ from "lodash";

export default function QuotationMappingListTable({ quotationList }) {
  const navigate = useNavigate();

  const handleTextClick = (row) => {
    navigate(`/authorised/quotation-mapping-form/${row?._id}`, {
      state: { row: row },
    });
  };

  return (
    <>
      <Table
        aria-label="customized table"
        className="custom-table datasets-table"
      >
        <TableHead>
          <TableRow className="cm_table_head">
            <TableCell>S.No.</TableCell>
            <TableCell>Product Name</TableCell>
            <TableCell>Quotation For</TableCell>
            <TableCell>Hardware</TableCell>
            <TableCell>Service</TableCell>
            <TableCell>Software</TableCell>
            <TableCell>Created Date & By</TableCell>
            <TableCell>Last Updated & By</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {quotationList &&
            quotationList?.length > 0 &&
            quotationList.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{i + 1}.</TableCell>
                <TableCell>{row?.productName}</TableCell>
                <TableCell>{row?.quotationFor}</TableCell>
                <TableCell>{row?.isHardware ? "Yes" : "No"}</TableCell>
                <TableCell>{row?.isService ? "Yes" : "No"}</TableCell>
                <TableCell>{row?.isSoftware ? "Yes" : "No"}</TableCell>
                <TableCell>
                  {row?.createdByName}
                  <div>{moment(row?.createdAt).format("DD-MM-YYYY")}</div>
                </TableCell>

                <TableCell>
                  {row?.modifiedByName
                    ? row?.modifiedByName
                    : row?.createdByName}
                  <div>{moment(row?.updatedAt).format("DD-MM-YYYY")}</div>
                </TableCell>

                <TableCell
                  style={{ color: row?.status === 1 ? "green" : "red" }}
                >
                  {row?.status === 1 ? "Active" : "Inactive"}
                </TableCell>
                <TableCell>
                  <span
                    style={{
                      cursor: "pointer",
                      textDecoration: "underline",
                      color: "#F45E29",
                    }}
                    onClick={() => handleTextClick(row)}
                  >
                    View and Update
                  </span>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
}
