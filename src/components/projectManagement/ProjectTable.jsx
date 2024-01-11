import PropTypes from 'prop-types';
import moment from 'moment';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import EditIcon from "../../assets/icons/edit-icon.svg";
import DeleteIcon from "../../assets/icons/icon_trash.svg";
import UpArrow from '../../assets/image/arrowUp.svg';
import DownArrow from '../../assets/image/arrowDown.svg';

export default function ProjectTable({ list, openInPopup, deleteUserType, pageNo, itemsPerPage,handleSort,sortObj, ...other }) {

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

    return (
        <TableContainer className='table-container' component={Paper} {...other}>
             <div className='journey-list-heading'>
                <h4>Project list</h4>
            </div>
            <Table aria-label="customized table" className="custom-table datasets-table">
                <TableHead >
                    <TableRow className='cm_table_head'>
                        <TableCell >S. No.</TableCell>
                        <TableCell ><div className='tableHeadCell'>Project{handleSortIcons('projectName')}</div></TableCell>
                        <TableCell ><div className='tableHeadCell'>Description{handleSortIcons('description')}</div></TableCell>
                        <TableCell ><div className='tableHeadCell'>Created At{handleSortIcons('createdAt')}</div></TableCell>
                        <TableCell ><div className='tableHeadCell'>Modified At{handleSortIcons('updatedAt')}</div></TableCell>
                        <TableCell align='right'>Action</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {list && list.length > 0 && list.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell>{(i + 1) + ((pageNo - 1) * itemsPerPage)}.</TableCell>
                            <TableCell>{row.projectName ?? '-'}</TableCell>
                            <TableCell>{row?.projectDescription ?? '-'}</TableCell>
                            <TableCell> {moment(row?.createdAt).format('DD/MMM/YY')} </TableCell>
                            <TableCell> {moment(row?.updatedAt).format('DD/MMM/YY')} </TableCell>
                            <TableCell className="edit-cell action-cell">
                                <Button className='form_icon' onClick={() => openInPopup(row)}><img src={EditIcon} alt='' /></Button>
                                <Button className='form_icon' onClick={() => deleteUserType(row)}><img src={DeleteIcon} alt='' /></Button>
                            </TableCell>
                        </TableRow>))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

ProjectTable.propTypes = {
    list: PropTypes.array.isRequired
}