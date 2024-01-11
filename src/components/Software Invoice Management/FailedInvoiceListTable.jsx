import React, { useEffect, useState } from 'react'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Modal, Fade, TextField, Typography, Grid, Button } from '@mui/material';
import { useStyles } from "../../css/ClaimForm-css";
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { updateInvoiceDetails } from '../../config/services/packageBundle';
import { getUserData } from '../../helper/randomFunction/localStorage';
import toast from 'react-hot-toast';


const FailedInvoiceListTable = ({ list, pageNo, itemsPerPage, fetchFailedInvoices }) => {
    const classes = useStyles()
    const [isModelReason, setIsModelReason] = useState(false)
    const [isModelAction, setIsModelAction] = useState(false)
    const [reason, setReason] = useState()
    const [updateInfo, setUpdateInfo] = useState()
    const loginData = getUserData('loginData')
    const uuid = loginData?.uuid

    const handleClick = (type, row) => {
        if (type === 'action') {
            console.log('action')
            setUpdateInfo(row)
            setIsModelAction(true)
        }
        else if (type === 'reason') {
            console.log('reason')
            console.log(row)
            setReason(row?.api_error_message)
            setIsModelReason(true)
        }
    }

    const handleChange = (key, type, value) => {
        const update = { ...updateInfo }
        if (type && type?.length > 0)
            update[type][key] = value
        else update[key] = value
        setUpdateInfo(update)
    }

    const handleSave = async () => {
        setIsModelAction(false)
        try {
            let params = {
                uuid,
                invoice_auto_id: updateInfo?.invoice_auto_id,
                invoice_status: "1",
                school_code: updateInfo?.school_code,
                school_pincode: updateInfo?.school_pincode,
            };

            const res = await updateInvoiceDetails(params);
            let { message, status } = res?.data
            if (status == 1) {
                toast.dismiss()
                toast.success(message)
                fetchFailedInvoices()
            }
            else if (status == 0) {
                toast.dismiss()
                toast.error(message)
            }
        } catch (err) {
            console.error('An error occurred:', err);
        }

    }


    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table" className="custom-table datasets-table" >
                <TableHead>
                    <TableRow className="cm_table_head">

                        <TableCell align='left'>Sr.No.</TableCell>
                        <TableCell align='left'>Implementation ID</TableCell>
                        <TableCell align='left'>School Name</TableCell>
                        <TableCell align='left'>School Code</TableCell>
                        <TableCell align='left'>Address</TableCell>
                        <TableCell align='left'>Pin Code</TableCell>
                        <TableCell align='left'>GSTIN</TableCell>
                        <TableCell align='left'>State Code</TableCell>
                        <TableCell align='left'>Reason</TableCell>
                        <TableCell align='left'>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {list?.length > 0 &&
                        list.map((row, i) => (
                            <TableRow
                                key={i}
                            >
                                <TableCell >{(i + 1) + ((pageNo - 1) * itemsPerPage)}</TableCell>
                                <TableCell >{row?.implementation_form_id}</TableCell>
                                <TableCell >{row?.schoolDetails?.schoolName}</TableCell>
                                <TableCell >{row?.school_code}</TableCell>
                                <TableCell >{row?.schoolDetails?.address}</TableCell>
                                <TableCell >{row?.school_pincode}</TableCell>
                                <TableCell >{row?.school_gstin}</TableCell>
                                <TableCell >{row?.state_code}</TableCell>
                                <TableCell ><div style={{ cursor: 'pointer', color: 'blue' }} onClick={() => handleClick('reason', row)}>View</div></TableCell>
                                <TableCell ><div style={{ cursor: 'pointer', color: 'blue' }} onClick={() => handleClick('action', row)}>Update</div></TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={isModelReason}
                // onClose={() => setIsModelReason(false)} 
                closeAfterTransition
            >
                <Fade in={isModelReason}>
                    <div className={classes.modalPaper + " modal-box modal-md"} id="transition-modal-title">
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', cursor: 'pointer' }} onClick={() => setIsModelReason(false)}>
                                <CloseSharpIcon />
                            </div>
                            <div className={classes.modalTitle}>View Reason</div>
                            <div>
                                <Typography variant='subtitle1' mb={1} display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>Reason</Typography>
                                <TextField
                                    fullWidth
                                    value={reason}
                                    multiline
                                    minRows="3"
                                    InputProps={{
                                        disableUnderline: true,
                                        style: {
                                            border: "1px solid #00000069",
                                            outline: 'none'
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </Fade>
            </Modal>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={isModelAction}
                // onClose={() => setIsModelAction(false)} 
                closeAfterTransition
            >
                <Fade in={isModelAction}>
                    <div className={classes.modalPaper + " modal-box modal-md"} id="transition-modal-title">
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', cursor: 'pointer' }} onClick={() => setIsModelAction(false)}>
                                <CloseSharpIcon />
                            </div>
                            <div className={classes.modalTitle}>Update Details</div>
                            <div>
                                <Grid container spacing={2} mt={2}>

                                    <Grid item md={6}>
                                        <Typography mb={1} variant='subtitle1' display='flex' justifyContent='flex-start'>Address</Typography>
                                        <TextField
                                            id="outlined-basic"
                                            className={`crm-form-input`}
                                            placeholder="Address"
                                            variant="outlined"
                                            value={updateInfo?.schoolDetails?.address}
                                            onChange={(event) => handleChange('address', "schoolDetails", event.target.value)}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item md={6}>
                                        <Typography mb={1} variant='subtitle1' display='flex' justifyContent='flex-start'>Pin Code</Typography>
                                        <TextField
                                            id="outlined-basic"
                                            className={`crm-form-input`}
                                            placeholder="Pincode"
                                            variant="outlined"
                                            value={updateInfo?.school_pincode}
                                            onChange={(event) => handleChange('school_pincode', "", event.target.value)}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item md={6}>
                                        <Typography mb={1} variant='subtitle1' display='flex' justifyContent='flex-start'>GSTIN</Typography>
                                        <TextField
                                            id="outlined-basic"
                                            className={`crm-form-input`}
                                            placeholder="GSTIN"
                                            variant="outlined"
                                            value={updateInfo?.school_gstin}
                                            onChange={(event) => handleChange('school_gstin', "", event.target.value)}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item md={6}>
                                        <Typography mb={1} variant='subtitle1' display='flex' justifyContent='flex-start'>State Code</Typography>
                                        <TextField
                                            id="outlined-basic"
                                            className={`crm-form-input`}
                                            placeholder="State Code"
                                            variant="outlined"
                                            value={updateInfo?.state_code}
                                            onChange={(event) => handleChange('state_code', "", event.target.value)}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item md={6}>
                                        <Typography mb={1} variant='subtitle1' display='flex' justifyContent='flex-start'>TAN No.</Typography>
                                        <TextField
                                            id="outlined-basic"
                                            className={`crm-form-input`}
                                            placeholder="TAN No."
                                            variant="outlined"
                                            value={updateInfo?.schoolDetails?.tanNumber}
                                            onChange={(event) => handleChange('tanNumber', "schoolDetails", event.target.value)}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', margin: '0px' }} className="modal-footer">
                                    <Button variant='contained' size='medium' type='submit' sx={{ borderRadius: '5px !important', padding: '8px 40px' }} onClick={handleSave}>Submit</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fade>
            </Modal>

        </TableContainer >
    );
}

export default FailedInvoiceListTable