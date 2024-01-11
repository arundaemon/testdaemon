import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getSiteSurveyActivities } from "../../config/services/bdeActivities";
import { Link, useNavigate } from "react-router-dom";
import { fieldTab } from "../../constants/general";
import { getPrevSsrFormData } from "../../config/services/siteSurvey";
import moment from "moment";
import { useStyles } from "../../css/Implementation-css";

const SiteSurveyTaskTable = ({ data }) => {
  const navigate = useNavigate();
  const classes = useStyles();

  const isRedirect = (obj) => {
    let implementationCode = obj?.implementationCode;
    let referenceType = obj?.type;
    if (referenceType === fieldTab?.SSR) {
      navigate(`/authorised/site-survey/${implementationCode}`, {
        state: {
          linkType: fieldTab?.Implementation,
          isShowSSRForm: true,
        },
      });
    }

    if (referenceType === fieldTab?.isQC) {
      navigate(`/authorised/QC-detail/${implementationCode}`, {
        state: {
          linkType: fieldTab?.SSR,
          isShowSSRForm: true,
        },
      });
    }
  };
  return (
    <>
      <TableContainer component={Paper}>
        <Table
          aria-label="simple table"
          className="custom-table datasets-table crm-sd-claims-table crm-table-header-left-aligned"
        >
          <TableHead>
            <TableRow className="cm_table_head">
              <TableCell>
                <div className="tableHeadCell">S.No</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">Implementation Code</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">Employee Code</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">Assigned Engineer</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">Created By</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">CreatedBy Code</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">Created Date</div>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length > 0
              ? data?.map((obj, index) => {
                  return (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <p
                          onClick={() => isRedirect(obj)}
                          className={classes.quotationLink}
                        >
                          {obj?.implementationCode ?? "NA"}
                        </p>
                      </TableCell>
                      <TableCell>
                        {obj?.assignedEngineerEmpCode ?? "NA"}
                      </TableCell>
                      <TableCell>{`${
                        obj?.assignedEngineerName ?? "NA"
                      }`}</TableCell>
                      <TableCell>{obj?.createdByName ?? "NA"}</TableCell>
                      <TableCell>{obj?.createdByEmpCode ?? "NA"}</TableCell>
                      <TableCell>
                        {obj?.createdAt
                          ? moment(obj?.createdAt).format("DD-MM-YYYY")
                          : "NA"}
                      </TableCell>
                      <TableCell />
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

export default SiteSurveyTaskTable;
