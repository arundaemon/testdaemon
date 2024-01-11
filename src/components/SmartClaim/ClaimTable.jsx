import {
  Box,
  Button,
  Checkbox,
  Fade,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControlLabel,
  TableSortLabel,
} from "@mui/material";
import CubeDataset from "../../config/interface";
import { MyClaimList } from "./ClaimListTable";
import { useEffect, useState } from "react";
import { useStyles } from "../../css/ClaimForm-css";
import Env_Config from "../../config/settings";

export const ClaimTable = (props) => {
  let {
    list,
    getParentRowData,
    setCheckedRows,
    checkedRows,
    isModel,
    actionType,
    remark,
    setRemark,
    handlePopupAction,
    successFlag,
    handleHasInternalData = null,
    filtersApplied,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder
  } = props;

  const [indexNo, setIndexNumber] = useState(null);
  const [reqStatus, setReqStatus] = useState();
  const [empCodeArray, setEmpCodeArray] = useState([]);
  const classes = useStyles();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [parentFlag, setParentFlag] = useState(false)
  const financeProfile = Env_Config.FINANCE_PROFILES;
  const [profileMatch, setProfileMatch] = useState(
    financeProfile.indexOf(userData?.crm_profile) > -1
  );
  const [selectedEmployCode, setSelectedEmployCode] = useState(null)

  const handleRowCheck = (event, row) => {
    const empCode = row[CubeDataset.UserClaim.requestByEmpCode];
    if(empCode === selectedEmployCode) setParentFlag(false)
    else setParentFlag(true)

    if (event.target.checked) {
      setCheckedRows([...checkedRows, row]);
      setEmpCodeArray([...empCodeArray, empCode]);
    } else {
      setCheckedRows(checkedRows.filter((checkedRow) => checkedRow !== row));
      setEmpCodeArray(empCodeArray.filter((item) => item !== empCode));
    }
  };
  const isChecked = (row) => {
    if (checkedRows.includes(row)) {
      return checkedRows.includes(row);
    } else {
      return false;
    }
  };

  const parentCheckedRow = (row) => {
    setParentFlag(true)
    setCheckedRows(row);
  }

  useEffect(() => {
    if (checkedRows?.length) {
      getParentRowData(checkedRows);
    } else {
      getParentRowData([]);
    }
  }, [checkedRows]);

  useEffect(() => {
    setEmpCodeArray([]);
    setCheckedRows([]);
  }, [successFlag]);

  const getClaimAmtList = (row, index, type) => {
    setParentFlag(false)
    setSelectedEmployCode(row[CubeDataset.UserClaim.requestByEmpCode])
    setIndexNumber(index);
    setReqStatus(type);
    handleHasInternalData(type);
  };

  const handleRemark = (e) => {
    setRemark(e.target.value);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
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
              <TableCell></TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === CubeDataset?.UserClaim.requestByEmpCode}
                  direction={sortBy === CubeDataset?.UserClaim.requestByEmpCode ? sortOrder : 'desc'}
                  onClick={() => handleSort(CubeDataset?.UserClaim.requestByEmpCode)}
                >
                  <div className="tableHeadCell">E code</div>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === CubeDataset?.UserClaim.requestByName}
                  direction={sortBy === CubeDataset?.UserClaim.requestByName ? sortOrder : 'desc'}
                  onClick={() => handleSort(CubeDataset?.UserClaim.requestByName)}
                >
                  <div className="tableHeadCell">E name</div>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === CubeDataset?.TblEmployee.cityName}
                  direction={sortBy === CubeDataset?.TblEmployee.cityName ? sortOrder : 'desc'}
                  onClick={() => handleSort(CubeDataset?.TblEmployee.cityName)}
                >
                  <div className="tableHeadCell">City</div>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === CubeDataset?.TblEmployee.stateName}
                  direction={sortBy === CubeDataset?.TblEmployee.stateName ? sortOrder : 'desc'}
                  onClick={() => handleSort(CubeDataset?.TblEmployee.stateName)}
                >
                  <div className="tableHeadCell">State</div>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === CubeDataset.UserClaim.visitDate}
                  direction={sortBy === CubeDataset.UserClaim.visitDate ? sortOrder : 'desc'}
                  onClick={() => handleSort(CubeDataset.UserClaim.visitDate)}
                >
                  <div className="tableHeadCell">Month</div>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === CubeDataset?.UserClaim.totalRecords}
                  direction={sortBy === CubeDataset?.UserClaim.totalRecords ? sortOrder : 'desc'}
                  onClick={() => handleSort(CubeDataset?.UserClaim.totalRecords)}
                >
                  <div className="tableHeadCell">Total Count</div>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === CubeDataset?.UserClaim.TotalClaimAmount}
                  direction={sortBy === CubeDataset?.UserClaim.TotalClaimAmount ? sortOrder : 'desc'}
                  onClick={() => handleSort(CubeDataset?.UserClaim.TotalClaimAmount)}
                >
                  <div className="tableHeadCell">Total<br />Claim amount</div>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === CubeDataset?.UserClaim.TotalPendingAmount}
                  direction={sortBy === CubeDataset?.UserClaim.TotalPendingAmount ? sortOrder : 'desc'}
                  onClick={() => handleSort(CubeDataset?.UserClaim.TotalPendingAmount)}
                >
                  <div className="tableHeadCell">Pending<br />Claim amount</div>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === CubeDataset?.UserClaim.TotalApprovedAmount}
                  direction={sortBy === CubeDataset?.UserClaim.TotalApprovedAmount ? sortOrder : 'desc'}
                  onClick={() => handleSort(CubeDataset?.UserClaim.TotalApprovedAmount)}
                >
                  <div className="tableHeadCell">Approved<br />Claim amount</div>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === CubeDataset?.UserClaim.TotalRejectedAmount}
                  direction={sortBy === CubeDataset?.UserClaim.TotalRejectedAmount ? sortOrder : 'desc'}
                  onClick={() => handleSort(CubeDataset?.UserClaim.TotalRejectedAmount)}
                >
                  <div className="tableHeadCell">Rejected<br />Claim amount</div>
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list &&
              list?.length &&
              list?.map((row, index) => {
                return (
                  <>
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      // style={{display: 'flex'}}
                    >
                      <TableCell className="crm-table-cell-checkbox">
                        <FormControlLabel
                          className="crm-form-input-checkbox p-0 m-0"
                          required
                          control={<Checkbox />}
                          label=""
                          checked={isChecked(row)}
                          onChange={(event) => handleRowCheck(event, row)}
                        />
                      </TableCell>
                      <TableCell>
                        {row?.[CubeDataset?.UserClaim.requestByEmpCode]}
                      </TableCell>
                      <TableCell>
                        {row?.[CubeDataset?.UserClaim.requestByName]}
                      </TableCell>
                      <TableCell>
                        {row?.[CubeDataset?.TblEmployee.cityName]}
                      </TableCell>
                      <TableCell>
                        {row?.[CubeDataset?.TblEmployee.stateName]}
                      </TableCell>
                      <TableCell>
                        {new Date(
                          row[CubeDataset.UserClaim.visitDate]
                        ).toLocaleString("default", { month: "long" })}
                      </TableCell>
                      <TableCell>
                        {row?.[CubeDataset?.UserClaim.totalRecords]}
                      </TableCell>
                      <TableCell
                        className="crm-sd-table-cell-anchor"
                        sx={{ textDecoration: "underline", cursor: "pointer" }}
                      >
                        <p
                          onClick={() =>
                            getClaimAmtList(
                              row,
                              index,
                              profileMatch ? "ALL" : undefined
                            )
                          }
                        >
                          {row?.[CubeDataset?.UserClaim.TotalClaimAmount]}
                        </p>
                      </TableCell>
                      <TableCell
                        className="crm-sd-table-cell-anchor"
                        sx={{ textDecoration: "underline", cursor: "pointer" }}
                      >
                        <p
                          onClick={() =>
                            getClaimAmtList(
                              row,
                              index,
                              profileMatch ? "PENDING" : "NEW"
                            )
                          }
                        >
                          {row?.[CubeDataset?.UserClaim.TotalPendingAmount]}
                        </p>
                      </TableCell>
                      <TableCell
                        className="crm-sd-table-cell-anchor"
                        sx={{ textDecoration: "underline", cursor: "pointer" }}
                      >
                        <p
                          onClick={() =>
                            getClaimAmtList(row, index, "APPROVED")
                          }
                        >
                          {row?.[CubeDataset?.UserClaim.TotalApprovedAmount]}
                        </p>
                      </TableCell>
                      <TableCell
                        className="crm-sd-table-cell-anchor"
                        sx={{ textDecoration: "underline", cursor: "pointer" }}
                      >
                        <p
                          onClick={() =>
                            getClaimAmtList(row, index, "REJECTED")
                          }
                        >
                          {row?.[CubeDataset?.UserClaim.TotalRejectedAmount]}
                        </p>
                      </TableCell>
                    </TableRow>
                    {index === indexNo ? (
                      <TableRow>
                        <MyClaimList
                          empCodeArray={empCodeArray}
                          setEmpCodeArray={setEmpCodeArray}
                          requestByEmpCode={
                            row?.[CubeDataset?.UserClaim?.requestByEmpCode]
                          }
                          reqDate={
                            row[`${CubeDataset.UserClaim.visitDate}.month`]
                          }
                          reqStatus={reqStatus}
                          successFlag={successFlag}
                          filtersApplied={filtersApplied}
                          checkedRowsParent={checkedRows}
                          parentCheckedRow={parentCheckedRow}
                          parentFlag={parentFlag}
                          setParentFlag={setParentFlag}
                        />
                      </TableRow>
                    ) : (
                      ""
                    )}
                  </>
                );
              })}
          </TableBody>
        </Table>

        {isModel && (
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={isModel}
            closeAfterTransition
          >
            <Fade in={isModel}>
              <div
                className={classes.modalPaper + " modal-box modal-md"}
                id="transition-modal-title"
              >
                <div>
                  <div className={classes.modalTitle}>
                    Are you sure you want to {actionType} the claims?
                  </div>
                  <div>
                    <TextField
                      fullWidth
                      value={remark}
                      onChange={handleRemark}
                      multiline
                      minRows="3"
                      InputProps={{
                        disableUnderline: true,
                        style: {
                          boxShadow: "0px 0px 8px #00000029",
                          outline: "none",
                        },
                      }}
                    />
                    <div
                      style={{
                        marginBottom: 0,
                        marginRight: 0,
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                      className="modal-footer"
                    >
                      <Button
                        onClick={() => handlePopupAction(actionType)}
                        color="primary"
                        autoFocus
                        className={classes.submitBtn}
                        variant="outlined"
                      >
                        {actionType}
                      </Button>
                      <Button
                        onClick={() => handlePopupAction("cancel")}
                        className={classes.submitBtn}
                        color="primary"
                        variant="outlined"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Fade>
          </Modal>
        )}
      </TableContainer>
    </>
  );
};
