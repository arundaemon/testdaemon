import { Box, Grid, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import { memo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getMonths } from "../../utils/utils"
import { withStyles } from "@material-ui/core/styles";

const ProductDetails = () => {
    let invoiceSchedule = useSelector(state => state.invoiceSchedule)
    let productList = invoiceSchedule.orderList

    const CustomTableCell = withStyles(theme => ({
        root: { 
          width: 'calc(100%/2)'
        }
    }))(TableCell);
      
    
    return (
        <Box className='crm-schedule-list-container crm-schedule-list-product-container'>
            <Table className="crm-table-container crm-border-none">
                <TableHead className="">
                    <TableRow>
                        <CustomTableCell>
                            Product Details
                        </CustomTableCell>
                        <CustomTableCell>
                            Total Units
                        </CustomTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        productList.map((record,index) => (
                            <TableRow key={`${index}-${record.productCode}`}>
                                <CustomTableCell>
                                    {record.productName ? record.productName + ' - ' + record.productItemName : `Service - ${record.productItemName}`}
                                </CustomTableCell>
                                <CustomTableCell>
                                    {record.implementedUnit ?? 0}
                                </CustomTableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </Box>
        
    )
}

export default memo(ProductDetails)