import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom'
import moment from 'moment';
import { useEffect, useState } from 'react';
import EditIcon from "../../assets/icons/edit-icon.svg";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Switch } from '@mui/material';
import CubeDataset from '../../config/interface';


export default function ApprovalMappingTable({ list, sortObj, handleSort, pageNo, itemsPerPage, request = false, approve = false, ...other }) {
    const [mappingList, setMappingList] = useState(list);
    const navigate = useNavigate();

    const handleEdit = (id) => {
        navigate(`/authorised/update-approval-mapping/${id}`)
    }
    return (
        <TableContainer component={Paper} {...other}>

            <br />
            {list && list.length > 0 && (<Table aria-label="customized table" className="custom-table datasets-table">
                <TableHead >
                    <TableRow className='cm_table_head'>
                        <TableCell >S.No</TableCell>
                        <TableCell ><div className='tableHeadCell'>Type of Approval</div></TableCell>
                        <TableCell ><div className='tableHeadCell'>Approver Profile</div></TableCell>
                        <TableCell ><div className='tableHeadCell'>Last Modified By</div></TableCell>
                        <TableCell ><div className='tableHeadCell'>Action</div></TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {list.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell>{(i + 1) + ((pageNo - 1) * itemsPerPage)}.</TableCell>
                            <TableCell>{row?.approvalType ?? row?.[CubeDataset.Approvalmappings.approvalType] ?? "-"}</TableCell>
                            <TableCell>{row?.approverProfile ?? row?.[CubeDataset.Approvalmappings.approverProfile] ?? "-"}</TableCell>
                            <TableCell >{row?.modifiedBy ?? row?.[CubeDataset.Approvalmappings.modifiedBy] ?? "-"}<div>{row?.updatedAt ? moment(row?.updatedAt).format('DD-MM-YY (HH:mm A)') : moment(row?.[CubeDataset.Approvalmappings.updatedAt]).format('DD-MM-YY (HH:mm A)')}</div></TableCell>
                            <TableCell className="edit-cell action-cell">
                                <Button className='form_icon' onClick={() => handleEdit(row?._id ?? row?.[CubeDataset.Approvalmappings.Id])}><img src={EditIcon} alt='' /></Button>
                            </TableCell>
                        </TableRow>))}
                </TableBody>
            </Table>)
            }
        </TableContainer >
    )
}

ApprovalMappingTable.propTypes = {
    list: PropTypes.array.isRequired
}