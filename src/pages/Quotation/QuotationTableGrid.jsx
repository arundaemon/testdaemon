import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useStyles } from "../../css/Quotation-css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { CurrencySymbol, QuoteType } from "../../constants/general";
import moment from "moment";

export const QuotationTableGrid = ({ data, getSelectedItem }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);

  const redirectQuotationView = async (quotationCode) => {
    navigate(`/authorised/quotation-detail/${quotationCode}`, {
      state: {
        isQuotaion: true,
        isQuoteSchoolDetail: true,
      },
    });
  };

  const getQuoteData = async (data) => {
    navigate("/authorised/edit-quotation", {
      state: {
        schoolCode: data?.schoolCode,
        quotationCode: data?.quotationCode,
      },
    });
  };

  const handleSelectClick = (event, item) => {
    let quotationCode = item?.quotationCode;

    if (item?.approvalStatus === QuoteType?.isStatusPending) {
      if (event.target.checked) {
        setSelectedItems((prevSelected) => [...prevSelected, quotationCode]);
      } else {
        setSelectedItems((prevSelected) =>
          prevSelected.filter((code) => code !== quotationCode)
        );
      }
    } else {
      toast.dismiss();
      toast.error(`This Quotation ${quotationCode} Can't be selected`);
      return;
    }
  };

  useEffect(() => {
    getSelectedItem(selectedItems);
  }, [selectedItems]);

  return (
    <TableContainer component={Paper}>
      <Table
        aria-label="simple table"
        className="custom-table datasets-table crm-sd-claims-table crm-table-header-left-aligned"
      >
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Quotation Code</TableCell>
            <TableCell>School Code</TableCell>
            <TableCell>School Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Approval Status</TableCell>
            <TableCell>Created date</TableCell>
            <TableCell>Created by</TableCell>
            <TableCell>Total Contract Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <Checkbox
                  checked={selectedItems.includes(item.quotationCode)}
                  onChange={(event) => handleSelectClick(event, item)}
                />
              </TableCell>
              <TableCell sx={{ minWidth: "150px" }}>
                <p
                  onClick={
                    () => 
                    redirectQuotationView(item?.quotationCode)
                    //  getQuoteData(item)
                  }
                  className={classes.quotationLink}
                >
                  {item?.quotationCode ?? "NA"}
                </p>
              </TableCell>
              <TableCell>{item?.schoolCode ?? "NA"}</TableCell>
              <TableCell>{item?.schoolName ?? "NA"}</TableCell>
              <TableCell>{item?.status ?? "NA"}</TableCell>
              <TableCell>{item?.approvalStatus ?? "NA"}</TableCell>
              <TableCell>
                {(item?.createdAt &&
                  moment(item?.createdAt).format("DD-MM-YYYY")) ??
                  "NA"}
              </TableCell>

              <TableCell>{item?.createdByName ?? "NA"}</TableCell>
              <TableCell>
                {`${CurrencySymbol?.India}${Number(
                  item.productItemSalePriceSum
                )?.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}`}
                {/* {item.productItemSalePriceSum ?? "NA"} */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
