
import { Table, TableHead, TableRow, TableCell, TableBody, Checkbox, TableContainer, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';



export default function SalesApprovalListingTable({approvalLevels,filtersApplied, approvalList, displayFields, approvalIDs, handleUpdateApprovalId}) {
    const navigate = useNavigate()
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    // const dataset = filtersApplied?.[0]?.dataset?.dataSetName
    const handleSelectAll = (event) => {
        const isChecked = event.target.checked;
        setSelectAll(isChecked);
    
        if (isChecked) {
          setSelectedRows(approvalList);
          handleUpdateApprovalId(approvalList);
        } else {
          setSelectedRows([]);
          handleUpdateApprovalId([]);
        }
      };
        
    const handleCheckboxChange = (event, rowData) => {
        if (event.target.checked) {
        setSelectedRows([...selectedRows, rowData]);
        handleUpdateApprovalId([...selectedRows, rowData]);
        } else {
        setSelectedRows(selectedRows.filter((row) => row !== rowData));
        handleUpdateApprovalId(selectedRows.filter((id) => id.approvalId !== rowData.approvalId));
        }
    }

    const handleClick = (row) => {
        navigate(`/authorised/sales-approval-details/${row.approvalId}`, { state: { approvalLevels: approvalLevels, rowData: row } });
    };

    const isCDNLink = (value) => {
        return typeof value === 'string' && value.startsWith('https://');
    };

    const isValidDate = (dateString) => {
        if (!isNaN(dateString)) {
          return false;
        }
        const timestamp = Date.parse(dateString);
      
        if (!isNaN(timestamp)) {
          return true;
        } else {
          return false;
        }
    }
    
    const renderFieldContent = (value) => {

        if (isValidDate(value)) {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        } else if (isCDNLink(value)) {
          return (
            <a href={value} target="" rel="">
              View File
            </a>
          );
        } else if (typeof value === 'boolean') {
          return <span>{value ? 'True' : 'False'}</span>;
        } else if (value) {
          return <span>{value}</span>;
        } else {
          return <span>NA</span>;
        }
    }
      
    return (

        <TableContainer className='crm-table-container'>
            {displayFields &&<Table aria-label="customized table" className='crm-table-size-md'>
            <TableHead>
                <TableRow className='cm_table_head'>
                    <TableCell>
                        <Checkbox
                        checked={selectAll}
                        onChange={handleSelectAll}
                        />
                    </TableCell>
                    <TableCell>approvalID</TableCell>   
                    {displayFields?.map((col, index) => (
                    <TableCell key={index}>{col.fieldName}</TableCell>
                    ))}
                    <TableCell>Status</TableCell>   

                </TableRow>
            </TableHead>


                <TableBody>

                        {approvalList && approvalList?.length > 0 && approvalList.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedRows.includes(row)}
                                            onChange={(event) => handleCheckboxChange(event, row)}
                                        />
                                    </TableCell>
                                    <Tooltip title={row.referenceCode} arrow>
                                        <TableCell className='crm-no-wrap'>
                                            <div onClick={() => handleClick(row)} className='crm-anchor crm-anchor-small'>{row.referenceCode}</div>
                                        </TableCell>
                                    </Tooltip>
                                {displayFields?.map((field, colIndex) => (
                                    <TableCell key={colIndex}>
                                        {renderFieldContent(row[field.fieldName])}
                                    </TableCell>
                                ))}

                                    <TableCell>{row.status} at {row.assignedToProfileName}</TableCell>
                                </TableRow>
                            ))}
                </TableBody>
            </Table>}
            

        </TableContainer>
    )
}





