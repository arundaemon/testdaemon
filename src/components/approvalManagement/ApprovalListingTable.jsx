
import moment from 'moment';
import {Table, TableHead, TableRow, TableCell, TableBody, Tooltip} from '@mui/material';
import {useNavigate } from 'react-router-dom'
import _ from 'lodash';
import { toast } from 'react-hot-toast';
import { updateApprovalMatrix } from '../../config/services/approvalMatrix';


export default function ApprovalListingTable({approvalList, fetchApprovalList}) {
    const navigate = useNavigate()

    const handleTextClick = (row) => {
        navigate(`/authorised/update-approval/${row?._id}`, { state: { row: row } })
    }

    const handleStatusToggle = async(row) => {
        row.status = !row.status
        try{
              await updateApprovalMatrix(row)
              toast.success("Success!")
              fetchApprovalList()
          }catch(e){
          console.log('Error: ', e);
          toast.error("**Error**")
          }

    }
    return (
        <>
            <Table aria-label="customized table" className="custom-table datasets-table">
                <TableHead >
                    <TableRow className='cm_table_head'>
                        <TableCell >S.No.</TableCell>
                        <TableCell >Approval Type</TableCell>
                        <TableCell >Product</TableCell>
                        <TableCell >Rule</TableCell>
                        <TableCell >Create Date & By</TableCell>
                        <TableCell >Update Date & By</TableCell>
                        <TableCell >Status</TableCell>
                        <TableCell >Action</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>

                {approvalList && approvalList?.length > 0 && approvalList.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell>{(i + 1)}.</TableCell>
                            <TableCell>
                                <Tooltip title={row?.approvalType} arrow>
                                    <span>{row?.approvalType}</span>
                                </Tooltip>
                            </TableCell>
                            <TableCell>{row?.approvalGroupName}</TableCell>
                            <TableCell>{row?.approvalRuleType}</TableCell>
                               
                            <TableCell>{moment(row?.createdAt).format('DD-MM-YYYY')}, {row?.createdBy}</TableCell>
                            <TableCell>{moment(row?.updatedAt).format('DD-MM-YYYY')}, {row?.modifiedBy}</TableCell>
                            <TableCell style={{ cursor: 'pointer', textDecoration:'underline', color: row?.status === true ? 'green' : 'red' }} onClick={()=>handleStatusToggle(row)}>{row?.status === true? "Active":"Inactive"}</TableCell>
                            <TableCell>
                                <span
                                    style={{ cursor: 'pointer', textDecoration: 'underline', color: '#F45E29'}}
                                    onClick={() => handleTextClick(row)}
                                >
                                    View and Update
                                </span>
                            </TableCell>
                        </TableRow>
                        ))}
                </TableBody>
            </Table>
     

        </>
    )
}





