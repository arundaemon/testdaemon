import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { TableContainer, Table, TableCell, TableHead, TableRow, TableBody, Checkbox } from '@mui/material';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import UpArrow from '../../assets/image/arrowUp.svg'
import DownArrow from '../../assets/image/arrowDown.svg'
import CubeDataset from "../../config/interface";
import { Tooltip } from '@material-ui/core';

export default function LeadViewTable(props) {
    let { filtersApplied, getRowIds, pageNo, itemsPerPage, list, handleSort, sortObj, rolesList, handleCheckedData, checkedLeads } = props
    const dataSetIndex = filtersApplied.length > 0 ? CubeDataset.LeadassignsBq : CubeDataset.Leadassigns
    const [checkedList, setCheckedList] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const userRole = JSON.parse(localStorage.getItem('userData'))?.crm_role
    const userName = JSON.parse(localStorage.getItem('userData'))?.name

    const fetchDisplayName = (roleName) => {
        if (roleName === userRole) return userName
        let displayNameArray = rolesList?.filter(res => res?.roleName === roleName)
        return displayNameArray[0]?.displayName
    }


    const handleSortIcons = (key) => {
        return (
            <div className="arrowFilterDesign">
                <div className="upArrow" onClick={() => handleSort(key)}>
                    {filtersApplied?.length > 0 ?
                        (sortObj?.sortKey !== key || sortObj?.sortOrder === "desc" ? <img src={UpArrow} alt="" /> : null)
                        :
                        (sortObj?.sortKey !== key || sortObj?.sortOrder === "-1" ? <img src={UpArrow} alt="" /> : null)

                    }
                </div>

                <div className="downArrow" onClick={() => handleSort(key)}>
                    {filtersApplied?.length === 0 ?
                        (sortObj?.sortKey !== key || sortObj?.sortOrder === "1" ? <img src={DownArrow} alt="" /> : null)
                        :
                        (sortObj?.sortKey !== key || sortObj?.sortOrder === "asc" ? <img src={DownArrow} alt="" /> : null)
                    }
                </div>
            </div>
        );
    }

    useEffect(() => {
        getRowIds(checkedList)
    }, [checkedList])


    return (
        <div>
            <TableContainer>
                <Table
                    aria-label="customized table"
                    className="custom-table datasets-table"
                >
                    <TableHead>
                        <TableRow className="cm_table_head">
                            <TableCell>Sr.No</TableCell>
                            <TableCell style={{ width: 'max-content' }}>Name</TableCell>
                            <TableCell style={{ width: 'max-content' }}>Owner</TableCell>
                            <TableCell >Source</TableCell>
                            <TableCell >Sub Source</TableCell>
                            <TableCell >Stage</TableCell>
                            <TableCell >Status</TableCell>
                            <TableCell>City</TableCell>
                            <TableCell style={{ width: '14%' }}>
                                <div className="tableHeadCell">
                                    Created Date {filtersApplied?.length > 0 ? handleSortIcons(dataSetIndex.createdAt) : handleSortIcons("createdAt")}
                                </div>
                            </TableCell>
                            <TableCell style={{ width: '14%' }}>
                                <div className="tableHeadCell">
                                    Last Modified Date {filtersApplied?.length > 0 ? handleSortIcons(dataSetIndex.updatedAt) : handleSortIcons("updatedAt")}
                                </div>
                            </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list && list.length > 0 &&
                            list?.map((row, i) => {
                                return <TableRow key={i}
                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }} >
                                    <TableCell>
                                     { (i + 1)}
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            color: '#488109', cursor: 'pointer',
                                            fontWeight: 'bold',
                                        }}>
                                        <Tooltip title={row?.[dataSetIndex.name]} placement="top-start">
                                            {<Link to={`/authorised/lead-profile/${row?.[dataSetIndex.leadId]}`}>
                                                {row?.[dataSetIndex.name]}</Link>}
                                        </Tooltip>
                                    </TableCell>
                                    {/* <TableCell>{//fetchDisplayName(row?.[dataSetIndex.assignedToRoleName]) ? fetchDisplayName(row?.[dataSetIndex.assignedToRoleName]) : row?.[dataSetIndex.assignedToRoleName]}</TableCell> */}
                                    <TableCell>{row?.[dataSetIndex.assignedToDisplayName] ?? (fetchDisplayName(row?.[dataSetIndex.assignedToRoleName]) ? fetchDisplayName(row?.[dataSetIndex.assignedToRoleName]) : row?.[dataSetIndex.assignedToRoleName])}</TableCell>
                                    <TableCell>{row?.[dataSetIndex.sourceName]}</TableCell>
                                    <TableCell>{row?.[dataSetIndex.subSourceName]}</TableCell>
                                    <TableCell>{row?.[dataSetIndex.stageName]}</TableCell>
                                    <TableCell>{row?.[dataSetIndex.statusName]}</TableCell>
                                    <TableCell>{row?.[dataSetIndex.city]}</TableCell>
                                    <TableCell>{moment.utc(row[dataSetIndex.createdAt]).local().format('DD-MM-YYYY (hh:mm A)')}</TableCell>
                                    <TableCell>{moment.utc(row[dataSetIndex.updatedAt]).local().format('DD-MM-YYYY (hh:mm A)')}</TableCell>
                                </TableRow>
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
