import { Table, TableCell, TableContainer, TableBody, TableHead, TableRow, Checkbox, Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Tooltip } from '@material-ui/core';
import { Link } from 'react-router-dom';
import CubeDataset from '../../config/interface';
import useMediaQuery from "@mui/material/useMediaQuery";

const SchoolListTable = (props) => {

  let { list, getLeadData, reportSchoolList } = props;
  const [checkedRows, setCheckedRows] = useState([]);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const handleRowCheck = (event, row) => {
    if (event.target.checked) {
      setCheckedRows([...checkedRows, row]);
    } else {
      setCheckedRows(checkedRows.filter((checkedRow) => checkedRow !== row));
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setCheckedRows(list);
    } else {
      setCheckedRows([]);
    }
  };

  const isChecked = (row) => {
    return checkedRows.includes(row);
  };

  const isSelectAllChecked = () => {
    return (
      (list?.length > 0 && list.length === checkedRows.length) ||
      (reportSchoolList?.length > 0 &&
        reportSchoolList.length === checkedRows.length)
    );
  };

  useEffect(() => {
    getLeadData(checkedRows);
  }, [checkedRows]);

  return (
    <div>
      
      {
        (!isMobile)
          ? <TableContainer>
            <Table
              aria-label="customized table"
              className="custom-table datasets-table"
            >
              <TableHead>
                <TableRow className="cm_table_head">
                  <TableCell style={{ width: "max-content" }}>
                    <Checkbox
                      checked={isSelectAllChecked()}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell style={{ width: "max-content" }}>
                    <div className="tableHeadCell">School Code</div>
                  </TableCell>
                  <TableCell style={{ width: "max-content" }}>
                    School Name
                  </TableCell>
                  <TableCell style={{ width: "max-content" }}>Address</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Sub Source</TableCell>
                  {/* <TableCell>Interest Product</TableCell> */}
                  <TableCell>Last Updated Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(reportSchoolList && reportSchoolList.length > 0) ?
                  reportSchoolList.map((row, i) => (
                    <TableRow key={i} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell>
                        <Checkbox
                          checked={isChecked(row)}
                          onChange={(event) => handleRowCheck(event, row)}
                        />
                      </TableCell>
                      <TableCell>
                        {row['Schools.schoolCode']}
                      </TableCell>
                      <TableCell
                        style={{
                          color: '#488109',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                        }}
                      >
                        <Tooltip title={row[CubeDataset.Schools.schoolName]} placement="top-start">
                          <Link to={`/authorised/school-details/${row[CubeDataset.Schools.leadId]}`}>
                            {row[CubeDataset.Schools.schoolName] ?? "-"}
                          </Link>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{row[CubeDataset.Schools.address] ?? "-"}</TableCell>
                      {/* <TableCell>{row[CubeDataset.Leadinterests.stageName] ?? "-"}</TableCell> */}
                      <TableCell>{row[CubeDataset.Schools.assignedToDisplayName] || "-"}</TableCell>
                      <TableCell>{row[CubeDataset.Leadinterests.sourceName] || "-"}</TableCell>
                      <TableCell>{row[CubeDataset.Leadinterests.subSourceName] || "-"}</TableCell>
                      {/* <TableCell>
                        {row[CubeDataset.Schools.interestShown] ? JSON.parse(row[CubeDataset.Schools.interestShown])?.join(', ') : '-'}
                      </TableCell> */}
                      <TableCell>{moment.utc(row[CubeDataset.Schools.updatedAt]).local().format('DD-MM-YYYY (hh:mm A)') ?? "-"}</TableCell>
                    </TableRow>
                  )) :
                  (list && list.length > 0) &&
                  list.map((row, i) => (
                    <TableRow key={i} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell>
                        <Checkbox
                          checked={isChecked(row)}
                          onChange={(event) => handleRowCheck(event, row)}
                        />
                      </TableCell>
                      <TableCell>
                        {row?.school_info?.schoolCode}
                      </TableCell>
                      <TableCell
                        style={{
                          color: '#488109',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                        }}
                      >
                        <Tooltip title={row?.school_info?.schoolName} placement="top-start">
                          <Link to={`/authorised/school-details/${row?.school_info?.leadId}`}>
                            {row?.school_info?.schoolName}
                          </Link>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{row?.school_info?.address}</TableCell>
                      <TableCell>{row?.school_info?.assignedTo_displayName}</TableCell>
                      <TableCell>{row?.school_info?.sourceName}</TableCell>
                      <TableCell>{row?.school_info?.subSourceName}</TableCell>
                      {/* <TableCell>{Array.isArray(row?.school_info?.interestShown) ? row?.school_info?.interestShown?.join()
                          : ""}
                        </TableCell> */}
                      <TableCell>
                        {moment
                          .utc(row?.school_info?.updatedAt)
                          .local()
                          .format("DD-MM-YYYY (hh:mm A)")}
                      </TableCell>
                    </TableRow>
                  ))
                }

              </TableBody>
            </Table>
          </TableContainer>

          : <Box className='crm-sd-schools-list'>
            {(reportSchoolList && reportSchoolList.length > 0) ?
              reportSchoolList.map((row, i) => (
                <Link key={i} to={`/authorised/school-details/${row[CubeDataset.Schools.leadId]}`} className='crm-decoration-none'>
                  <Box className="crm-sd-schools-list-item">
                    <Box className='crm-sd-schools-list-item-label'>Owner : {row[CubeDataset.Leadinterests.assignedToDisplayName] ?? " - "}</Box>
                    <Box className='crm-sd-schools-list-item-content'>
                      School Name: {row[CubeDataset.Schools.schoolName]} | School Code: {row[CubeDataset.Schools.schoolCode]} | Source: {row[CubeDataset.Leadinterests.sourceName] ?? " - "} | Sub Source: {row[CubeDataset.Leadinterests.subSourceName] ?? "-"} | Updated Date: {moment.utc(row[CubeDataset.Schools.updatedAt]).local().format('DD-MM-YYYY (hh:mm A)') ?? "-"} | Address: {row[[CubeDataset.Schools.address]] ?? " - "}
                    </Box>
                  </Box>
                </Link>
              ))
              : null
            }
            {(list && list.length > 0) ?
              list.map((row, i) => (
                <Link  key={i} to={`/authorised/school-details/${row?.school_info?.leadId}`} className='crm-decoration-none'>
                  <Box className="crm-sd-schools-list-item">
                    <Box className='crm-sd-schools-list-item-label'>Owner : {row?.school_info?.assignedTo_displayName}</Box>
                    <Box className='crm-sd-schools-list-item-content'>
                      School Name: {row?.school_info?.schoolName} | School Code: {row?.school_info?.schoolCode} | Source: {row?.school_info?.sourceName ?? " - "} | Sub Source: {row?.school_info?.subSourceName ?? "-"} | Updated Date: {moment.utc(row?.school_info?.updatedAt).local().format('DD-MM-YYYY (hh:mm A)') ?? "-"}  | Address: {row?.school_info?.address ?? " - "}
                    </Box>
                  </Box>
                </Link>

              ))
              : null
            }
          </Box>


      }

    </div>
  );
};

export default SchoolListTable;
