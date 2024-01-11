
import { toast } from 'react-hot-toast';
import moment from 'moment';
import { Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import EditIcon from "../../assets/icons/edit-icon.svg";
import DeleteIcon from "../../assets/icons/icon_trash.svg";
import { useNavigate } from 'react-router-dom'
import _ from 'lodash';
import { createPackageBundle } from '../../config/services/packageBundle';
import { getUserData } from '../../helper/randomFunction/localStorage';



export default function PackageBundleTable({ packageList, itemsPerPage, pageNo, mergedList, getPackageList }) {
    const navigate = useNavigate()
    const loginData= getUserData('loginData')
    const uuid =loginData?.uuid


    const handleEditClick = (row, type, index) => {

        if (type === 'edit')
            navigate(`/authorised/package-form/${row?.package_id}`, { state: { rowData: mergedList[index] } });

        if (type === 'delete') {
            let status = 3
            mergedList[index].package_status = status.toString()
            mergedList[index].package_id = row?.package_id
            mergedList[index].uuid= uuid
            createPackageBundle(mergedList[index])
                .then(res => {
                    if (res?.data?.status === 1) {
                        toast.success("Package deleted successfully!")
                        getPackageList()
                    }
                    else if (res?.data?.status === 0) {
                        let { errorMessage } = res?.data?.message
                        toast.error(errorMessage)
                    }
                    else {
                        console.error(res);
                    }
                })
        }
    };

    return (
        <Table aria-label="customized table" className="custom-table datasets-table">
            <TableHead >
                <TableRow className='cm_table_head'>
                    <TableCell >S.No.</TableCell>
                    <TableCell >Package Name</TableCell>
                    <TableCell >Status</TableCell>
                    <TableCell >Created By</TableCell>
                    <TableCell >Created Date</TableCell>
                    <TableCell >Updated Date</TableCell>
                    <TableCell >Action</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {packageList && packageList.length > 0 && packageList.map((row, i) => (
                    <TableRow key={i}>
                        <TableCell>{(i + 1) + ((pageNo - 1) * itemsPerPage)}.</TableCell>
                        <TableCell>{row?.package_name ?? '-'}</TableCell>
                        <TableCell>
                            {row?.package_status
                                === 1 && "Active"}
                            {row?.package_status
                                === 2 && "Inactive"}
                            {row?.package_status
                                === 3 && "Deleted"}
                        </TableCell>
                        <TableCell>{row?.package_created_by ?? '-'}</TableCell>
                        <TableCell>{moment(row?.package_created_on * 1000).format('DD-MM-YYYY (HH:mm A)')}</TableCell>
                        <TableCell>
                            {row?.package_modified_on
                                ? moment(row?.package_modified_on * 1000).format('DD-MM-YYYY (HH:mm A)')
                                : moment(row?.package_created_on * 1000).format('DD-MM-YYYY (HH:mm A)')}
                        </TableCell>
                        <TableCell className="edit-cell action-cell">
                            <Button className='form_icon' onClick={() => handleEditClick(row, 'edit', i)}><img src={EditIcon} alt='' /></Button>
                            <Button className='form_icon'
                                onClick={() => handleEditClick(row, 'delete', i)}><img src={DeleteIcon} alt='' /></Button>
                        </TableCell>
                    </TableRow>))}
            </TableBody>

        </Table>

    )

}



