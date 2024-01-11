import {
  Table,
  TableCell,
  TableContainer,
  TableBody,
  TableHead,
  TableRow,
  Checkbox,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Tooltip } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useStyles } from '../../css/AddSchool-css'
import CubeDataset from "../../config/interface";

const SchoolLeadPipeline = (props) => {
  let { list, getLeadData, reportSchoolList } = props;

  console.log(reportSchoolList, 'reportSchoolList123')

  const classes = useStyles();

  return (
    <div>
      <TableContainer>
        <Table
          aria-label="customized table"
          className="custom-table datasets-table"
        >
          <TableHead>
            <TableRow className="cm_table_head">
              <TableCell style={{ width: "max-content" }}>
                <TableCell style={{ width: "max-content" }}>S.No</TableCell>
              </TableCell>
              <TableCell style={{ width: "max-content" }}>Owner</TableCell>
              <TableCell style={{ width: "max-content" }}>
                <div className="tableHeadCell">School Code</div>
              </TableCell>
              <TableCell style={{ width: "max-content" }}>
                School Name
              </TableCell>
              <TableCell style={{ width: "max-content" }}>Product</TableCell>
              <TableCell style={{ width: "max-content" }}>EDC</TableCell>
              <TableCell style={{ width: "max-content" }}>Stage</TableCell>
              <TableCell style={{ width: "max-content" }}>Status</TableCell>
              <TableCell style={{ width: "max-content" }}>Expected Contract Value</TableCell>
              <TableCell style={{ width: "", whiteSpace: 'pre-wrap !important' }}>Count of EDC Modified</TableCell>
              <TableCell style={{ width: "max-content" }}>View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportSchoolList && reportSchoolList?.length > 0
              ? reportSchoolList?.map((row, i) => (
                <TableRow
                  key={i}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    {i + 1}
                  </TableCell>
                  <TableCell>{row?.[CubeDataset?.Schools?.assignedToDisplayName] ?? "-"}</TableCell>
                  <TableCell>{row?.[CubeDataset.Schools.schoolCode] ?? "-"}</TableCell>
                  <TableCell>{row?.[CubeDataset.Schools.schoolName] ?? "-"}</TableCell>
                  <TableCell>{row?.[CubeDataset.Leadinterests.learningProfile] ?? "-"}</TableCell>
                  <TableCell>{row?.[CubeDataset.Leadinterests.learningProfile] ?? "-"}</TableCell>
                  <TableCell>{row?.[CubeDataset.Leadinterests.stageName] ?? "-"}</TableCell>
                  <TableCell>{row?.[CubeDataset.Leadinterests.statusName] ?? "-"}</TableCell>
                  <TableCell>{row?.[CubeDataset.Leadinterests.softwareContractValue] ?? "-"}</TableCell>
                  <TableCell>{row?.[CubeDataset.Leadinterests.edcCount] ?? "-"}</TableCell>
                  <TableCell>{
                    <Link
                      to={`/authorised/school-details/${row?.[CubeDataset.Schools.leadId]}`}
                    >
                      View
                    </Link>
                  }
                  </TableCell>
                </TableRow>
              ))
              : list &&
              list.length > 0 &&
              list?.map((row, i) => {
                return (
                  <TableRow
                    key={i}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      {i + 1}
                    </TableCell>
                    <TableCell>{row?.assignedTo_displayName}</TableCell>
                    <TableCell>{row?.schoolCode}</TableCell>
                    <TableCell>{row?.school}</TableCell>
                    <TableCell>{row?.learningProfile}</TableCell>
                    <TableCell>{row?.edc ? moment
                      .utc(row?.edc)
                      .local()
                      .format("DD/MM/YYYY") : "-"}</TableCell>
                    <TableCell>{row?.stageName}</TableCell>
                    <TableCell>{row?.statusName}</TableCell>
                    <TableCell>{row?.softwareContractValue ?? "-"}</TableCell>
                    <TableCell>{row?.edcCount ?? "-"}</TableCell>
                    <TableCell>{
                      <Link
                        to={`/authorised/interest-details/${row?.schoolId}/${row?.leadId}`}
                      >
                        View
                      </Link>
                    }
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SchoolLeadPipeline;
