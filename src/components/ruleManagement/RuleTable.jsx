import PropTypes from 'prop-types';
import moment from 'moment';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import EditIcon from "../../assets/icons/edit-icon.svg";
import DeleteIcon from "../../assets/icons/icon_trash.svg";
import UpArrow from '../../assets/image/arrowUp.svg'
import DownArrow from '../../assets/image/arrowDown.svg'

export default function RuleTable({ list, openInPopup, deleteUserType, pageNo, itemsPerPage, handleEditRule, handleSort, sortObj, ...other }) {

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
                <h4>Rule list</h4>
                {/* <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p> */}
            </div>
            <Table aria-label="customized table" className="custom-table datasets-table">
                <TableHead >
                    <TableRow className='cm_table_head'>
                        <TableCell sx={{width:'2%'}}>S.No.</TableCell>
                        <TableCell sx={{width:'50%'}}><div className='tableHeadCell'>Rule Name {handleSortIcons('ruleName')}</div></TableCell>
                        <TableCell ><div className='tableHeadCell'>Created By & Date{handleSortIcons('createdAt')}</div></TableCell>
                        <TableCell ><div className='tableHeadCell'>Modified By & Date{handleSortIcons('updatedAt')}</div></TableCell>
                        <TableCell >Action</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {list?.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell>{(i + 1) + ((pageNo - 1) * itemsPerPage)}.</TableCell>
                            <TableCell >{row?.ruleName ?? '-'}</TableCell>
                            <TableCell>{row?.createdBy ?? '-'}<div>{moment(row?.createdAt).format('DD-MM-YY (HH:mm A)')}</div></TableCell>
                            <TableCell>{row?.modifiedBy ?? '-'}<div>{moment(row?.updatedAt).format('DD-MM-YY (HH:mm A)')}</div></TableCell>
                            <TableCell className="edit-cell action-cell">
                                <Button className='form_icon' onClick={() => handleEditRule(row?._id)}><img src={EditIcon} alt='' /></Button>
                                <Button className='form_icon' onClick={() => deleteUserType(row)}><img src={DeleteIcon} alt='' /></Button>
                            </TableCell>
                        </TableRow>))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

RuleTable.propTypes = {
    list: PropTypes.array.isRequired
}