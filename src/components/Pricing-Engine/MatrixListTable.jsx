import {
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";


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


export const MatrixTableList = ({ data, modifiyData, statusChange }) => {
  const classes = useStyles();
  const navigate = useNavigate()

  const editPriceMatrix = (Id) => {
    let fillerData = data?.find(obj => obj?.pricing_matrix_id === Id)
    navigate('/authorised/edit-matrix', { state: { data: fillerData } })
  };

  const getCloneData = (Id) => {
    let filterData = data?.find(obj => obj?.pricing_matrix_id === Id)
    modifiyData(filterData)
  }

  const onStatusChange = (Id) => {
    let filterData = data?.find(obj => obj?.pricing_matrix_id === Id)
    statusChange(filterData)
  }

  const redirectPricingEngine = async (obj) => {
    navigate("/authorised/matrix-details", {
      state: {
        data: obj,
      },
    });
  };




  return (
    <>
      <TableContainer>
        <Table
          aria-label="customized table"
          className="custom-table datasets-table"
        >
          <TableHead>
            <TableRow className="cm_table_head">
              <TableCell>S.No.</TableCell>
              <TableCell>Channel</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Matrix Name</TableCell>
              <TableCell>Clone</TableCell>
              <TableCell>View</TableCell>
              <TableCell
                sx={{
                  display: "block !important",
                  textAlign: "center !important",
                }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length
              ? data?.map((obj, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell sx={{ whiteSpace: "pre-line !important" }}>
                      {obj?.channel_details
                        ?.map((obj) => obj?.channel_name)
                        ?.join(", ")}
                    </TableCell>
                    <TableCell>{obj?.product_name ?? "null"}</TableCell>
                    <TableCell>{obj?.matrix_name ?? "null"}</TableCell>
                    <TableCell>
                      <img src="/cloneImg.svg" style={{ cursor: "pointer" }}
                        onClick={() => getCloneData(obj?.pricing_matrix_id)} />
                    </TableCell>
                    {/* <TableCell>

                      View
                    </TableCell> */}
                    <TableCell component="th" scope="row">
                      <p className={classes.quotationLink}
                        onClick={() =>
                          redirectPricingEngine(obj)
                        }>
                        View
                      </p>
                    </TableCell>

                    <TableCell>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "10px",
                          marginLeft: "20px",
                        }}
                      >
                        <img
                          src="/editImg.svg"
                          style={{ cursor: "pointer" }}
                          onClick={() => editPriceMatrix(obj?.pricing_matrix_id)}
                        />
                        <Switch checked={obj?.matrix_status === 1}
                          color="primary" onChange={() => onStatusChange(obj?.pricing_matrix_id)} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
              : ""}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
