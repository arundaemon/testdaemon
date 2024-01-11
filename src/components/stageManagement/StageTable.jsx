import PropTypes from 'prop-types';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { TableSortLabel } from '@mui/material';
import { useState, useEffect } from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Switch } from '@mui/material';
import EditIcon from "../../assets/icons/edit-icon.svg";
import DeleteIcon from "../../assets/icons/icon_trash.svg";
import Chip from '@mui/material/Chip';
import UpArrow from '../../assets/image/arrowUp.svg'
import DownArrow from '../../assets/image/arrowDown.svg'
export default function StageTable({ list, openInPopup, handleSort, sortObj, deleteStageObject, pageNo, itemsPerPage, handleSubmit, toggleStatusModal, ...other }) {
    const [stageList, setStageList] = useState(list);
    const navigate = useNavigate();

    const handleEditIcon = (row) => {
        let url = `/authorised/edit-stage/${row._id}`;
        navigate(url);
    }

    // console.log(list,'..............list')
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


    useEffect(() => setStageList([...list]), [list]);

    return (
        <>
            <TableContainer className='table-container' component={Paper} {...other}>
                <div className='journey-list-heading'>
                    <h4>Stage List</h4>
                    {/* <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p> */}
                </div>
                {stageList && stageList.length > 0 && (<Table aria-label="customized table" className="custom-table datasets-table">
                    <TableHead >
                        <TableRow className='cm_table_head'>
                            <TableCell >S.No</TableCell>
                            <TableCell ><div className='tableHeadCell'>Stage Name{handleSortIcons('stageName')}</div></TableCell>
                            <TableCell ><div className='tableHeadCell'>Cycle Name</div></TableCell>
                            <TableCell ><div className='tableHeadCell'>Created By & Date{handleSortIcons('createdAt')}</div></TableCell>
                            <TableCell ><div className='tableHeadCell'>Last Modified By & Date{handleSortIcons('updatedAt')}</div></TableCell>
                            <TableCell ><div className='tableHeadCell'>Status</div></TableCell>
                            <TableCell ><div className='tableHeadCell'>Action</div></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stageList.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell>{(i + 1) + ((pageNo - 1) * itemsPerPage)}.</TableCell>
                                <TableCell >{row.stageName}</TableCell>
                                <TableCell>{row?.cycleId?.cycleName ?? '-'}</TableCell>
                                {/* <TableCell>{row?.linkedCycle?.map(item => <Chip label={item.cycleName} />) ?? '-'}</TableCell> */}
                                <TableCell>{row?.createdBy ?? '-'}<div>{moment(row?.createdAt).format('DD-MM-YY (HH:mm A)')}</div></TableCell>
                                <TableCell>{row?.modifiedBy ?? '-'}<div>{moment(row?.updatedAt).format('DD-MM-YY (HH:mm A)')}</div></TableCell>
                                <TableCell>
                                    <span onClick={(e) => { handleSubmit(e, row); toggleStatusModal() }} className={row.status === 1 ? "cm_active" : "cm_inactive"}>{row.status === 1 ? "Active" : "Inactive"}</span>
                                </TableCell>
                                <TableCell className="edit-cell action-cell">
                                    <Button className='form_icon' onClick={() => openInPopup(row)}><img src={EditIcon} alt='' /></Button>
                                    <Button className='form_icon' onClick={() => deleteStageObject(row)}><img src={DeleteIcon} alt='' /></Button>
                                </TableCell>
                            </TableRow>))}
                    </TableBody>
                </Table>)}
            </TableContainer>
        </>
    )
}

StageTable.propTypes = {
    list: PropTypes.array.isRequired
}