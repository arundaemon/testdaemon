import React, { useEffect, useState } from "react";

import {
  Alert,
  Paper,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import _ from "lodash";
import QuotationMappingListTable from "./QuotationMappingListTable";
import { fetchQuotationList } from "../../config/services/quotationMapping";
import Loader from "../../pages/Loader";

const useStyles = makeStyles((theme) => ({
  cusCard: {
    padding: "2px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
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
}));

const QuotationMappingList = () => {

  const classes = useStyles()
  const [loader, setLoading] = useState(false)
  const [quotationList, setQuotationList] = useState([])

  const getAllQuotations = async() => {
    setLoading(true)
    try {
      const quotations = await fetchQuotationList()
      setQuotationList(quotations?.result)
      setLoading(false)
    } catch (err) {
      console.log("Error while fetching Quotations : " + err);
    }
  }

  useEffect(() => {
    getAllQuotations()
  }, [])


  return (
    <div className="tableCardContainer">
      <Paper>
        <div className="mainContainer">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 15,
              marginBottom: 15,
            }}
          >
            <div className="left">
              <h3>Quotation Mapping List</h3>
              <p>

              </p>
            </div>
            <div className="right">
              <Link to={"/authorised/quotation-mapping-form"}>
                <div className={classes.submitBtn}>Create</div>
              </Link>
            </div>
          </div>
          
          {loader && <Loader />}
          {quotationList?.length ? <QuotationMappingListTable quotationList={quotationList}/> :
          <Alert severity="error">No Content Available!</Alert>}
        </div>
      </Paper>
    </div>
  );
};

export default QuotationMappingList;
