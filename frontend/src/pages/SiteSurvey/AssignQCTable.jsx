import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { fieldTab } from "../../constants/general";
import { useStyles } from "../../css/SiteSurvey-css";

const AssignQCTable = ({ siteSurveyList }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const handleClick = (code) => {
    navigate(`/authorised/QC-detail/${code}`, {
      state: {
        linkType: fieldTab?.isQC,
      },
    });
  };


  const handleCheckSheet = (data) => {
    navigate(`/authorised/create-checksheet/`, {
      state: {
        linkType: fieldTab?.checkSheet,
        implementationCode: data?.implementationCode,
        schoolCode: data?.schoolCode

      },
    });
  };


  return (
    <>
      <Box className="crm-table-container">
        <TableContainer component={Paper}>
          <Table
            aria-label="simple table"
            className="custom-table datasets-table crm-sd-claims-table crm-table-header-left-aligned"
          >
            <TableHead>
              <TableRow className="cm_table_head">
                <TableCell>
                  {/* {" "} */}
                  <div className="tableHeadCell">Implementation No</div>
                </TableCell>
                <TableCell>
                  {/* {" "} */}
                  <div className="tableHeadCell">QC No</div>
                </TableCell>
                <TableCell>
                  {/* {" "} */}
                  <div className="tableHeadCell">Item Name</div>
                </TableCell>
                <TableCell>
                  {/* {" "} */}
                  <div className="tableHeadCell">Variant Name</div>
                </TableCell>
                <TableCell>
                  {/* {" "} */}
                  <div className="tableHeadCell">Remarks</div>
                </TableCell>
                <TableCell>
                  {/* {" "} */}
                  <div className="tableHeadCell">Status</div>
                </TableCell>
                <TableCell>
                  {/* {" "} */}
                  <div className="tableHeadCell">Created By</div>
                </TableCell>
                <TableCell>
                  {/* {" "} */}
                  <div className="tableHeadCell">Created Date</div>
                </TableCell>
                <TableCell>
                  
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {siteSurveyList?.map((row, index) => (
                <TableRow
                  key={index}
                  // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell onClick={() => handleClick(row?.implementationCode)}>
                    <a>
                      <div style={{ cursor: "pointer" }}>
                        {row?.implementationCode}
                      </div>
                    </a>
                  </TableCell>
                  <TableCell>{row?.qcCode}</TableCell>
                  <TableCell>{row?.itemName}</TableCell>
                  <TableCell>{row?.itemVariantName}</TableCell>
                  <TableCell>{row?.remarks}</TableCell>
                  <TableCell>{row?.status}</TableCell>
                  <TableCell>{row?.createdByName}</TableCell>
                  <TableCell>{row?.createdAt}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default AssignQCTable;
