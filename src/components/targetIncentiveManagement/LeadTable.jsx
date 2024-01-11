import { TableContainer, Paper, Table, TableBody, TableRow, TableCell, TableHead } from "@mui/material";
import UpArrow from '../../assets/image/arrowUp.svg'
import DownArrow from '../../assets/image/arrowDown.svg'
import moment from "moment";
import { CSVLink } from 'react-csv'

const LeadTable = (props) => {
    let { list, pageNo, itemsPerPage, sortObj, handleSort } = props;
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

    const fileHeader = [
        { label: 'Employee Name', key: 'empName'},
        { label: 'Employee Code' , key: 'empCode'},
        { label: 'Role Name', key: 'role_name' },
        { label: 'Profile Name', key: 'profile_name' },
        { label: 'Target', key: 'target' },
        { label: 'Error', key: 'errorMessage' }
    ]


    let downloadErrorExcel = (data) => {
        const errorExcel = {
            filename: 'Error.csv',
            headers: fileHeader,
            data
        }

        if (!data?.length) {
            return 0
        }

        return <CSVLink {...errorExcel}>{data?.length}</CSVLink>
    }

    let downloadSuccessExcel = (data) => {
        const successExcel = {
            filename: 'Success.csv',
            headers: fileHeader,
            data
        }

        if (!data?.length) {
            return 0
        }

        return <CSVLink {...successExcel}>{data?.length}</CSVLink>
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table aria-label="simple table" className="custom-table datasets-table">
                    <TableHead >
                        <TableRow className="cm_table_head">
                            <TableCell><div className='tableHeadCell'>Sr.No</div></TableCell>
                            {/* <TableCell><div className='tableHeadCell'>Type {handleSortIcons('type')}</div></TableCell> */}
                            <TableCell><div className='tableHeadCell'>File Name {handleSortIcons('fileName')} </div></TableCell>
                            <TableCell><div className='tableHeadCell'>Created At {handleSortIcons('createdAt')}</div></TableCell>
                            <TableCell><div className='tableHeadCell'>Uploaded by</div></TableCell>
                            <TableCell><div className='tableHeadCell'>Success file {handleSortIcons('successFile')}</div></TableCell>
                            <TableCell><div className='tableHeadCell'>Error file {handleSortIcons('errorFile')}</div></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list && list.length > 0 &&
                            list.map((row, i) => (
                                <TableRow
                                    key={i}
                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {(i + 1) + ((pageNo - 1) * itemsPerPage)}
                                    </TableCell>
                                    {/* <TableCell >{row.type}</TableCell> */}
                                    <TableCell >{row.fileName}</TableCell>
                                    <TableCell >{moment(row?.createdAt).format('DD-MM-YYYY (HH:mm A)')}</TableCell>
                                    <TableCell >{row.createdBy}</TableCell>
                                    <TableCell >{downloadSuccessExcel(row?.successFile)}</TableCell>
                                    <TableCell >{downloadErrorExcel(row?.errorFile)}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
export default LeadTable;
