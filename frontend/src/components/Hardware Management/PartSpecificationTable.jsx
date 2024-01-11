import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import EditIcon from "../../assets/icons/edit-icon.svg";
import DeleteIcon from "../../assets/icons/icon_trash.svg";
import _ from 'lodash';



export default function PartSpecificationTable({specification, handleDeleteRow, handleEditRow}) {
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
                        <TableCell >Part Name</TableCell>
                        <TableCell >Part Variant</TableCell>
                        <TableCell >Action</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    
                    {specification && specification?.length > 0 && specification.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell>{(i + 1)}.</TableCell>
                            <TableCell>{row?.part_name }</TableCell>
                            <TableCell>{row?.variant_name}</TableCell>
                            <TableCell className="edit-cell action-cell">
                                <Button className='form_icon' onClick={()=> handleEdit(row)}><img src={EditIcon} alt='' /></Button>
                                <Button className='form_icon' onClick={() => handleDelete(row)} ><img src={DeleteIcon} alt='' /></Button>
                            </TableCell>
                        </TableRow>))}
                </TableBody>
            </Table>

        // </TableContainer>

    )
}

// JourneyList.propTypes = {
//     list: PropTypes.array.isRequired
// }





