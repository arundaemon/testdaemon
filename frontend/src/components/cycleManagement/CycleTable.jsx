import PropTypes from 'prop-types';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Switch } from '@mui/material';
import EditIcon from "../../assets/icons/edit-icon.svg";
import DeleteIcon from "../../assets/icons/icon_trash.svg";
import Chip from '@mui/material/Chip';
import UpArrow from '../../assets/image/arrowUp.svg'
import DownArrow from '../../assets/image/arrowDown.svg'
import { changeStatus } from '../../config/services/cycles';

export default function CycleTable({ list, openInPopup, sortObj, handleSort, deleteCycleObject, pageNo, itemsPerPage, handleStatusToggle, toggleCycleModal, handleSubmit, ...other }) {
    const [cycleList, setCycleList] = useState(list);


    const handleSortIcons = (key) => {

        return (
            <div className="arrowFilterDesign">
                <div className="upArrow" onClick={() => handleSort(key)}>
                    {sortObj?.sortKey !== key || sortObj?.sortOrder === "-1" ? <img src={UpArrow} alt="" /> : null}
                </div>
                <div className="downArrow" onClick={() => handleSort(key)}>
                    {sortObj?.sortKey !== key || sortObj?.sortOrder === "1" ? <img src={DownArrow} alt="" /> : null}
                </div>
            </div>
        );
    }

    useEffect(() => setCycleList([...list]), [list])

    // console.log(list,'.............list')

    return (
        <TableContainer className='table-container' component={Paper} {...other}>
            <div className='journey-list-heading'>
                <h4>Cycle List</h4>
                {/* <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p> */}
            </div>
            {cycleList && cycleList.length > 0 && (<Table aria-label="customized table" className="custom-table datasets-table">
                <TableHead >
                    <TableRow className='cm_table_head'>
                        <TableCell >S.No</TableCell>
                        <TableCell ><div className='tableHeadCell'>Cycle Name{handleSortIcons('cycleName')}</div></TableCell>
                        <TableCell ><div className='tableHeadCell'> Journey Name{handleSortIcons('journeyName')}</div></TableCell>
                        {/* <TableCell >Linked Cycles</TableCell> */}
                        <TableCell ><div className='tableHeadCell'>Created By & Date{handleSortIcons('createdAt')}</div></TableCell>
                        <TableCell ><div className='tableHeadCell'>Last Modified By & Date{handleSortIcons('updatedAt')}</div> </TableCell>
                        <TableCell >Status</TableCell>
                        <TableCell >Action</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {cycleList.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell>{(i + 1) + ((pageNo - 1) * itemsPerPage)}.</TableCell>
                            <TableCell>{row.cycleName}</TableCell>
                            <TableCell>{row?.journeyId?.journeyName ?? '-'}</TableCell>
                            {/* <TableCell>{row?.linkedCycle?.map(item => <Chip label={item.cycleName} />) ?? '-'}</TableCell> */}
                            <TableCell>{row?.createdBy ?? '-'}<div>{moment(row?.createdAt).format('DD-MM-YY (HH:mm A)')}</div></TableCell>
                            <TableCell >{row?.modifiedBy ?? '-'}<div>{moment(row?.updatedAt).format('DD-MM-YY (HH:mm A)')}</div></TableCell>
                            <TableCell>
                                <span onClick={(e) => { handleSubmit(e, row); toggleCycleModal() }} className={row.status === 1 ? "cm_active" : "cm_inactive"}>{row.status === 1 ? "Active" : "Inactive"}</span>
                            </TableCell>
                            <TableCell className="edit-cell action-cell">
                                {row.status === 1 ?
                                    <Button className='form_icon' onClick={() => openInPopup(row)}><img src={EditIcon} alt='' /></Button>
                                    :
                                    <Button className='form_icon disAbleCursor' ><img src={EditIcon} alt='' /></Button>
                                }
                                <Button className='form_icon' onClick={() => deleteCycleObject(row)}><img src={DeleteIcon} alt='' /></Button>
                            </TableCell>
                        </TableRow>))}
                </TableBody>
            </Table>)}
        </TableContainer>
    )
}

CycleTable.propTypes = {
    list: PropTypes.array.isRequired
}