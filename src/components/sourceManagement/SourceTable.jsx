import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DownArrow from '../../assets/image/arrowDown.svg';
import UpArrow from '../../assets/image/arrowUp.svg';

export default function SourceTable({ list, openInPopup, handleSort, sortObj, deleteStageObject, pageNo, itemsPerPage, handleStatusToggle, ...other }) {
    const [sourceList, setSourceList] = useState(list);




    const handleSortIcons = (key) => {

        return (
            <div className="arrowFilterDesign">
                <div className="upArrow" onClick={() => handleSort(key)}>
                    {sortObj?.sortKey !== key || sortObj?.sortOrder === "DESC" ? <img src={UpArrow} alt="" /> : null}
                </div>
                <div className="downArrow" onClick={() => handleSort(key)}>
                    {sortObj?.sortKey !== key || sortObj?.sortOrder === "ASC" ? <img src={DownArrow} alt="" /> : null}
                </div>
            </div>
        );


    }

    useEffect(() => setSourceList([...list]), [list]);


    return (
        <>
            <TableContainer className='table-container' component={Paper} {...other}>
                <div className='journey-list-heading'>
                    <h4>Source List</h4>
                </div>
                {sourceList && sourceList.length > 0 && (<Table aria-label="customized table" className="custom-table datasets-table">
                    <TableHead >
                        <TableRow className='cm_table_head'>
                            <TableCell ><div className='tableHeadCell'>Lead Source ID{handleSortIcons('source_id')}</div></TableCell>
                            <TableCell ><div className='tableHeadCell'>Lead Source Name{handleSortIcons('source_name')}</div></TableCell>
                            <TableCell ><div className='tableHeadCell'>Created By & Date {handleSortIcons('created_on')}</div></TableCell>
                            <TableCell ><div className='tableHeadCell'>Last Modified By & Date
                            {handleSortIcons('modified_on')}</div></TableCell>
                            <TableCell >Status</TableCell>
                            {/* <TableCell >Action</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sourceList.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell>{row?.source_id ? row?.source_id: "NA"}
                                </TableCell>
                                <TableCell>
                                    <Link style={{ textDecoration: "underline", color: "rgb(68, 130, 255)" }} to={`/authorised/lead-sub-source/${row?.source_id}`}>
                                        {row?.source_name ?? '-'}
                                    </Link>
                                </TableCell>

                                <TableCell>{row?.created_by ?? '-'}<div>{moment(row?.created_on * 1000).format(
                                    "DD-MM-YYYY (HH:mm A)"
                                )}</div></TableCell>
                                <TableCell>{row?.modified_by
                                    ? row?.modified_by : row?.created_by}<div>{row?.modified_on ? moment(row?.modified_on * 1000).format("DD-MM-YYYY (HH:mm A)")
                                        : moment(row?.created_on * 1000).format("DD-MM-YYYY (HH:mm A)")}</div></TableCell>
                                <TableCell>

                                    <span onClick={(e) => handleStatusToggle(e, row)} className={row.status === 1 ? "cm_active" : "cm_inactive"}>{row.status === 1 ? "Active" : "Inactive"}</span>
                                </TableCell>

                            </TableRow>))}
                    </TableBody>
                </Table>)}
            </TableContainer>
        </>
    )
}

SourceTable.propTypes = {
    list: PropTypes.array.isRequired
}