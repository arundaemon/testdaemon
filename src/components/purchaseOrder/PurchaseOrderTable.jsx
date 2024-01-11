import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment";
import * as React from "react";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

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

const PurchaseOrderTable = ({ list, selectedRows, handleSelectClick }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const redirectPurchaseDetail = async (row) => {
    navigate("/authorised/purchase-order-details", {
      state: {
        data: row,
      },
    });
  };

  const getUniqueProductName = (obj) => {
    let uniqueSet;
    let uniqueProductArray;
    let productName;

    productName = obj?.product?.map((obj) => obj?.productName);
    uniqueSet = new Set(productName);
    uniqueProductArray = Array.from(uniqueSet);
    return uniqueProductArray;
  };

  const renderProductList = (data) => {
    return (
      <ul style={{ listStyle: "none" }}>
        {getUniqueProductName(data)?.map((obj, index) => {
          const isLastItem = index === getUniqueProductName(data)?.length - 1;
          return (
            <li style={{ paddingBottom: 6 }}>{`${obj}${
              isLastItem ? "" : ","
            }`}</li>
          );
        })}
      </ul>
    );
  };

  return (
    <TableContainer component={Paper} className="crm-table-container">
      <Table aria-label="simple table" className="crm-table-size-md">
        <TableHead>
          <TableRow className="cm_table_head">
            {/* <TableCell> <div className='tableHeadCell' ></div></TableCell> */}
            <TableCell> <div className='tableHeadCell' > PO No. </div></TableCell>
            <TableCell> <div className='tableHeadCell' > Quotation Code </div></TableCell>
            <TableCell> <div className='tableHeadCell'>School Code </div></TableCell>
            <TableCell> <div className='tableHeadCell'>School Name </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Product </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Status</div></TableCell>
            <TableCell> <div className='tableHeadCell'> Approval Status</div></TableCell>
            <TableCell> <div className='tableHeadCell'> Created date </div></TableCell>
            <TableCell> <div className='tableHeadCell'> Created by </div></TableCell>
            <TableCell align='right'> <div className='tableHeadCell' > Total PO Value </div></TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {list &&
            list?.length > 0 &&
            list?.map((row, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {/* <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(row?._id)}
                    onChange={(event) => handleSelectClick(event, row?._id)}
                  />
                </TableCell> */}
                <TableCell component="th" scope="row">
                  <p
                    className={`crm-anchor crm-anchor-small`}
                    onClick={() => redirectPurchaseDetail(row)}
                  >
                    {row?.purchaseOrderCode}
                  </p>
                </TableCell>
                <TableCell>{row?.quotationCode ?? "NA"}</TableCell>
                <TableCell>{row?.schoolCode ?? "NA"}</TableCell>
                <TableCell>{row?.schoolName ?? "NA"}</TableCell>

                <TableCell sx={{ minWidth: "150px" }}>
                  {(row?.product?.length && renderProductList(row)) ?? "NA"}
                </TableCell>
                <TableCell>{row?.status ?? "NA"}</TableCell>
                <TableCell>{row?.approvalStatus ?? "NA"}</TableCell>
                <TableCell>{(row?.createdAt && moment(row?.createdAt).format('DD-MM-YYYY')) ?? "NA"}</TableCell>
                <TableCell>{row?.createdByName ?? "NA"}</TableCell>
                <TableCell align="right">
                  <CurrencyRupeeIcon
                    sx={{ position: "relative", top: "2px", fontSize: "14px" }}
                  />
                  {Number(row?.poAmount)?.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PurchaseOrderTable;
