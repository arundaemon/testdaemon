import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import {
  TableContainer,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Checkbox,
} from "@mui/material";
import { Link } from "react-router-dom";
import _ from "lodash";
import UpArrow from "../../assets/image/arrowUp.svg";
import DownArrow from "../../assets/image/arrowDown.svg";
import CubeDataset from "../../config/interface";
import { Tooltip } from "@material-ui/core";

export default function LeadAssignmentTable(props) {
  let {
    filtersApplied,
    getRowIds,
    pageNo,
    itemsPerPage,
    list,
    handleSort,
    sortObj,
    rolesList,
    handleCheckedData,
    checkedLeads,
    showRefurbish,
  } = props;
  const dataSetIndex =
    filtersApplied.length > 0
      ? CubeDataset.LeadassignsBq
      : CubeDataset.Leadassigns;
  const [checkedList, setCheckedList] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const userRole = JSON.parse(localStorage.getItem("userData"))?.crm_role;
  const userName = JSON.parse(localStorage.getItem("userData"))?.name;
  const [items, setItems] = useState(list);
  const [isShiftDown, setIsShiftDown] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [lastSelectedItem, setLastSelectedItem] = useState(null);
  const listEl = useRef(null);

  const fetchDisplayName = (roleName) => {
    if (roleName === userRole) return userName;
    let displayNameArray = rolesList?.filter(
      (res) => res?.roleName === roleName
    );
    return displayNameArray[0]?.displayName;
  };

  const handleChange = (e, data) => {
    // handleSelectItem(data?.[CubeDataset.LeadassignsBq.Id])
    if (!e.target.checked) {
      if (!selectAll) {
        let newFilteredArray = checkedLeads.filter(
          (item) => item[dataSetIndex.Id] != data[dataSetIndex.Id]
        );
        setCheckedList([...newFilteredArray]);
        handleCheckedData([...newFilteredArray]);
      }
      if (selectAll) {
        let newFilteredArray = list.filter(
          (item) => item[dataSetIndex.Id] != data[dataSetIndex.Id]
        );
        setCheckedList([...newFilteredArray]);
        handleCheckedData([...newFilteredArray]);
        setSelectAll(false);
      }
    } else {
      // handleSelectItem(data?.[CubeDataset.LeadassignsBq.Id])
      setCheckedList([...checkedLeads, data]);
      handleCheckedData([...checkedLeads, data]);
    }
  };

  const handleChangeSelectAll = (e) => {
    if (e.target.checked) {
      setSelectAll(true);
      setCheckedList([...list]);
      handleCheckedData([...list]);
    } else {
      setSelectAll(false);
      setCheckedList([]);
      setSelectedItems([]);
      setLastSelectedItem(null);
      handleCheckedData([]);
    }
  };

  const getChecked = (data, index) => {
    let filterredArray = checkedLeads.filter(
      (item, index) => item[dataSetIndex.Id] == data[dataSetIndex.Id]
    );
    if (filterredArray.length == 0) {
      return false;
    } else {
      return true;
    }
  };

  const getIncludeID = (leadId) => {
    let data = selectedItems?.map(
      (item) => item?.[CubeDataset.LeadassignsBq.Id]
    );

    if (data?.includes(leadId)) {
      return true;
    } else {
      return false;
    }
  };

  const handleSortIcons = (key) => {
    return (
      <div className="arrowFilterDesign">
        <div className="upArrow" onClick={() => handleSort(key)}>
          {filtersApplied?.length > 0 ? (
            sortObj?.sortKey !== key || sortObj?.sortOrder === "desc" ? (
              <img src={UpArrow} alt="" />
            ) : null
          ) : sortObj?.sortKey !== key || sortObj?.sortOrder === "-1" ? (
            <img src={UpArrow} alt="" />
          ) : null}
        </div>

        <div className="downArrow" onClick={() => handleSort(key)}>
          {filtersApplied?.length === 0 ? (
            sortObj?.sortKey !== key || sortObj?.sortOrder === "1" ? (
              <img src={DownArrow} alt="" />
            ) : null
          ) : sortObj?.sortKey !== key || sortObj?.sortOrder === "asc" ? (
            <img src={DownArrow} alt="" />
          ) : null}
        </div>
      </div>
    );
  };

  useEffect(() => {
    getRowIds(checkedList);
  }, [checkedList]);

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === "Shift" && isShiftDown) {
        setIsShiftDown(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Shift" && !isShiftDown) {
        setIsShiftDown(true);
      }
    };
    const handleSelectStart = (e) => {
      if (isShiftDown) {
        e.preventDefault();
      }
    };
    document?.addEventListener("keyup", handleKeyUp, false);
    document?.addEventListener("keydown", handleKeyDown, false);
    listEl?.current?.addEventListener("selectstart", handleSelectStart, false);
    return () => {
      document?.removeEventListener("keyup", handleKeyUp);
      document?.removeEventListener("keydown", handleKeyDown);
      listEl?.current?.removeEventListener("selectstart", handleSelectStart);
    };
  }, [isShiftDown]);

  const handleSelectItem = (data) => {
    const nextValue = getNextValue(data);
    setSelectedItems(nextValue);
    setCheckedList(nextValue);
    handleCheckedData(nextValue);
    setLastSelectedItem(data);
  };

  const getNextValue = (value) => {
    let dataList = selectedItems?.map(
      (item) => item?.[CubeDataset.LeadassignsBq.Id]
    );
    let leadID = value?.[CubeDataset.LeadassignsBq.Id];
    const hasBeenSelected = !dataList.includes(leadID);
    if (isShiftDown) {
      const newSelectedItems = getNewSelectedItems(value);
      const selections = [...new Set([...selectedItems, ...newSelectedItems])];
      if (!hasBeenSelected) {
        return selections.filter((item) => !newSelectedItems.includes(item));
      }
      return selections;
    }

    return dataList.includes(leadID)
      ? selectedItems.filter((item) => item !== value)
      : [...selectedItems, value];
  };

  const getNewSelectedItems = (value) => {
    let lastItemIndex = lastSelectedItem?.[CubeDataset.LeadassignsBq.Id];

    let leadID = value?.[CubeDataset.LeadassignsBq.Id];

    const currentSelectedIndex = items.findIndex(
      (item) => item?.[CubeDataset.LeadassignsBq.Id] === leadID
    );
    const lastSelectedIndex = items.findIndex(
      (item) => item?.[CubeDataset.LeadassignsBq.Id] === lastItemIndex
    );
    return items
      .slice(
        Math.min(lastSelectedIndex, currentSelectedIndex),
        Math.max(lastSelectedIndex, currentSelectedIndex) + 1
      )
      .map((item) => item);
  };

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
                <div className="tableHeadCell">
                  <Checkbox
                    className="inputCheckBox"
                    name="allSelect"
                    checked={selectAll ? selectAll : false}
                    onChange={handleChangeSelectAll}
                    sx={{
                      color: "#85888A",
                      "&.Mui-checked": {
                        color: "#F45E29",
                      },
                    }}
                  />
                  Sr.No
                </div>
              </TableCell>
              <TableCell style={{ width: "max-content" }}>Name</TableCell>
              <TableCell style={{ width: "max-content" }}>Owner</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Sub Source</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>City</TableCell>
              {showRefurbish && <TableCell>Refurbished</TableCell>}
              <TableCell style={{ width: "14%" }}>
                <div className="tableHeadCell">
                  Created Date{" "}
                  {filtersApplied?.length > 0
                    ? handleSortIcons(dataSetIndex.createdAt)
                    : handleSortIcons("createdAt")}
                </div>
              </TableCell>
              <TableCell style={{ width: "14%" }}>
                <div className="tableHeadCell">
                  Last Modified Date{" "}
                  {filtersApplied?.length > 0
                    ? handleSortIcons(dataSetIndex.updatedAt)
                    : handleSortIcons("updatedAt")}
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list &&
              list.length > 0 &&
              list?.map((row, i) => {
                let Id = row?.[CubeDataset.LeadassignsBq.Id];
                return (
                  <TableRow
                    key={i}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      <div className="tableHeadCell">
                        <Checkbox
                          className="inputCheckBox"
                          name={row[dataSetIndex.name]}
                          // checked={selectedItems.includes(Id)}
                          // checked={selectAll ? selectAll : getChecked(row)}
                          onChange={(e) => handleSelectItem(row)}
                          checked={selectAll ? selectAll : getIncludeID(Id)}
                          // onChange={(e) => handleChange(e, row)}
                          sx={{
                            color: "#85888A",
                            "&.Mui-checked": {
                              color: "#F45E29",
                            },
                          }}
                        />{" "}
                        {i + 1 + (pageNo - 1) * itemsPerPage}
                      </div>
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#488109",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      <Tooltip
                        title={row?.[dataSetIndex.name]}
                        placement="top-start"
                      >
                        {
                          <Link
                            to={`/authorised/listing-details/${
                              row?.[dataSetIndex.leadId]
                            }`}
                          >
                            {row?.[dataSetIndex.name]}
                          </Link>
                        }
                      </Tooltip>
                    </TableCell>
                    {/* <TableCell>{//fetchDisplayName(row?.[dataSetIndex.assignedToRoleName]) ? fetchDisplayName(row?.[dataSetIndex.assignedToRoleName]) : row?.[dataSetIndex.assignedToRoleName]}</TableCell> */}
                    <TableCell>
                      {row?.[dataSetIndex.assignedToDisplayName] ??
                        (fetchDisplayName(
                          row?.[dataSetIndex.assignedToRoleName]
                        )
                          ? fetchDisplayName(
                              row?.[dataSetIndex.assignedToRoleName]
                            )
                          : row?.[dataSetIndex.assignedToRoleName])}
                    </TableCell>
                    <TableCell>{row?.[dataSetIndex.sourceName]}</TableCell>
                    <TableCell>{row?.[dataSetIndex.subSourceName]}</TableCell>
                    <TableCell>{row?.[dataSetIndex.stageName]}</TableCell>
                    <TableCell>{row?.[dataSetIndex.statusName]}</TableCell>
                    <TableCell>{row?.[dataSetIndex.city]}</TableCell>
                    {showRefurbish && (
                      <TableCell>
                        {row?.[dataSetIndex.isRefurbished] === true
                          ? "Yes"
                          : "No"}
                      </TableCell>
                    )}
                    <TableCell>
                      {moment
                        .utc(row[dataSetIndex.createdAt])
                        .local()
                        .format("DD-MM-YYYY (hh:mm A)")}
                    </TableCell>
                    <TableCell>
                      {moment
                        .utc(row[dataSetIndex.updatedAt])
                        .local()
                        .format("DD-MM-YYYY (hh:mm A)")}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
