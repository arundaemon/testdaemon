
import moment from 'moment';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Fade, Box, Typography, Modal } from '@mui/material';
import EditIcon from "../../assets/icons/edit-icon.svg";
import { makeStyles } from '@mui/styles'
import DeleteIcon from "../../assets/icons/icon_trash.svg";
import { Link, useNavigate } from 'react-router-dom'
import _ from 'lodash';
import { updateHardwarePart } from '../../config/services/hardwareBundleAndPart';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { getUserData } from '../../helper/randomFunction/localStorage';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #fff',
    boxShadow: '0px 0px 4px #0000001A',
    p: 4,
    borderRadius: '4px',

};

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto'
    },
    modalPaper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #fff',
        boxShadow: '0px 0px 4px #0000001A',
        minWidth: '300px',
        borderRadius: '4px',
        textAlign: 'center',
    },
    modalTitle: {
        fontSize: '18px',
    },
    outlineButton: {
        color: '#85888A',
        fontSize: '14px',
        border: '1px solid #DEDEDE',
        borderRadius: '4px',
        fontWeight: 'normal',
        marginRight: '10px',
        padding: '0.5rem 1.5rem'
    },
    containedButton: {
        color: '#fff',
        fontSize: '14px',
        border: '1px solid #F45E29',
        borderRadius: '4px',
        fontWeight: 'normal',
        padding: '0.5rem 1.5rem'
    }
}));



export default function HardwarePartTable(props) {
    const navigate = useNavigate()
    const classes = useStyles();
    const [deletePopup, setDeletePopup] = useState(false);
    const [deleteObj, setDeleteObj] = useState("")
    const loginData = getUserData('loginData')
    const uuid = loginData?.uuid

    const { response, pageNo, itemsPerPage, getHardwarePartList } = props

    const handleCancelDelete = () => {
        setDeletePopup(false)
        setDeleteObj({})
    }

    const handleModelView = (row) => {
        setDeletePopup(true)
        setDeleteObj(row)
    }

    const submitDeleteStatus = (row) => {
        setDeletePopup(false)
        handleButtonClick(row, 'delete')
    }

    const handleButtonClick = async (row, type) => {
        if (type === 'delete') {
            let obj = {
                part_id: parseInt(row?.part_id),
                part_name: row?.part_name,
                part_description: row?.part_description,
                uuid:uuid,
                status: 3
            }
            try {
                const response = await updateHardwarePart(obj)
                response.data.status === 1 ? toast.success('Entry deleted successfully!') : toast.error(response?.data.message)
                getHardwarePartList()
            }
            catch (err) {
                console.log("error in updateHardwarePart: ", err);
                toast.error("***Error***");

            }
        }
        else if (type === 'edit') {
            navigate(`/authorised/hardware-part-form/${row?.part_id}`, { state: { row: row } })
        }

    }
    return (

        <>
            <Table aria-label="customized table" className="custom-table datasets-table">
                <TableHead >
                    <TableRow className='cm_table_head'>
                        <TableCell >S.No.</TableCell>
                        <TableCell >Part Name</TableCell>
                        <TableCell >Created By</TableCell>
                        <TableCell >Created Date</TableCell>
                        <TableCell >Updated Date</TableCell>
                        <TableCell >Status</TableCell>
                        <TableCell >Action</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>

                    {response && response?.length > 0 && response.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell>{(i + 1) + ((pageNo - 1) * itemsPerPage)}.</TableCell>

                            <TableCell>{row?.part_name}</TableCell>
                            <TableCell>{row?.created_by}</TableCell>
                            <TableCell>{moment(row?.created_on * 1000).format('DD-MM-YYYY (HH:mm A)')}</TableCell>
                            <TableCell>{row?.modified_on
                                ? moment(row?.modified_on * 1000).format('DD-MM-YYYY (HH:mm A)')
                                : moment(row?.created_on * 1000).format('DD-MM-YYYY (HH:mm A)')}</TableCell>
                            <TableCell>{row?.status === 1 ? "Active" : "Deleted"}</TableCell>
                            <TableCell className="edit-cell action-cell">
                                <Button className='form_icon' onClick={() => handleButtonClick(row, 'edit')}><img src={EditIcon} alt='' /></Button>
                                <Button className='form_icon' onClick={() => handleModelView(row)}><img src={DeleteIcon} alt='' /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={deletePopup}
                closeAfterTransition
            >
                <Fade in={deletePopup}>
                    <Box className={classes.modalPaper + " modal-box modal-md"} id="transition-modal-title">
                        <Box className="modal-header p-1" >
                            <Typography variant="subtitle1" className={classes.modalTitle + " modal-header-title"} >
                                {`Are you sure you want to delete this row ?`}
                            </Typography>
                        </Box>
                        {/* <Box className="modal-content text-left"> */}
                        <Box className="modal-footer text-right" >
                            <Button onClick={handleCancelDelete} className={" report_form_ui_btn cancel mr-2"} color="primary" variant="outlined" > Cancel </Button>
                            <Button onClick={() => submitDeleteStatus(deleteObj)} color="primary" autoFocus className={" report_form_ui_btn submit"} variant="contained"> Delete </Button>
                        </Box>
                        {/* </Box> */}
                    </Box>
                </Fade>
            </Modal>

        </>
    )
}





