
import { Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import EditIcon from "../../assets/icons/edit-icon.svg";
import DeleteIcon from "../../assets/icons/icon_trash.svg";
import _ from 'lodash';

export default function HardwarePartVarientFormTable({recommended, handleDeleteRow, handleEditRow}) {
    
    const handleDelete = (row) => {
        handleDeleteRow(row)
    }

    const handleEdit = (row)  => {
        handleEditRow(row)
    }

    return (

        <Table aria-label="customized table" className="custom-table datasets-table">
            <TableHead >
                <TableRow className='cm_table_head'>
                    <TableCell >S.No.</TableCell>
                    <TableCell >Package Name</TableCell>
                    <TableCell >No. of Student</TableCell>
                    <TableCell >No. of Teacher</TableCell>
                    <TableCell >Mode Of Esc</TableCell>
                    <TableCell >Action</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {recommended && recommended?.length > 0 && recommended?.map((row, i) => (
                    <TableRow key={i}>
                        <TableCell>{i + 1}.</TableCell>
                        <TableCell>{row?.package_name}.</TableCell>
                        <TableCell>{row?.student_count}</TableCell>
                        <TableCell>{row?.teacher_count}</TableCell>
                        <TableCell>{row?.escplus_mode}</TableCell>
                        <TableCell className="edit-cell action-cell">
                            <Button className='form_icon' onClick={()=> handleEdit(row)}><img src={EditIcon} alt='' /></Button>
                            <Button className='form_icon' onClick={() => handleDelete(row)} ><img src={DeleteIcon} alt='' /></Button>
                        </TableCell>
                    </TableRow>))}
            </TableBody>
        </Table>



    )
}







