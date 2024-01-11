import React, { useEffect, useState } from "react";
import Page from "../../components/Page";
import {
    Button,
    Box
} from "@mui/material";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { ReactComponent as IconClose } from "./../../assets/icons/icon-modal-close.svg";

const PODialogueBox = ({ open, setOpen, purchaseOrderArray, getQuoteByPOCodeHandler }) => {

    useEffect(() => { }, [purchaseOrderArray])

    return (
        <Dialog 
            open={open} 
            onClose={() => setOpen(false)}
            className={`crm-dialog-container `+ (purchaseOrderArray?.length ? `crm-dialog-md ` : `crm-dialog-sm`) + (open ? ` crm-dialog-opened` : ``)}
        >
            
            <DialogContent className="crm-dialog-content">
                <Box className="width-100">
                    <Box className="crm-dialog-close" onClick={() => setOpen(false)}>
                        <IconClose />
                    </Box>
                </Box>
                <DialogTitle className="crm-quotes-prroduct-form-label p-0 mb-1">Purchase order list</DialogTitle>
                
                <Table>
                    <TableBody>
                        {purchaseOrderArray?.length ?
                            purchaseOrderArray?.map((item, index) => (
                                <TableRow key={index} className="crm-modal-purchase-order-listitem" sx={{ cursor: item.status === "Filled" ? 'not-allowed' : 'pointer' }} 
                                    onClick={() => item.status !== "Filled" && getQuoteByPOCodeHandler(item)}
                                >
                                    <TableCell>{item?.purchaseOrderCode}</TableCell>
                                    <TableCell>{item?.product[0]?.groupCode}</TableCell>
                                    <TableCell>{item?.status || 'New'}</TableCell>
                                </TableRow>
                            )) : <Box className="crm-dialog-no-results">{"No Purchase Order data is present"}</Box>

                        }
                        
                    </TableBody>
                </Table>
            </DialogContent>
            <DialogActions style={{ textAlign: 'right', display: 'block', marginBottom: "20px", marginRight: "20px" }}>
                <Button onClick={() => setOpen(false)} className="crm-btn">
                    Close
                </Button>
            </DialogActions>
        </Dialog>

    )
}

export default PODialogueBox