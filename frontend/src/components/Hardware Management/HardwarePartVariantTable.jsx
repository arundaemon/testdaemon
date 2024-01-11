import { toast } from 'react-hot-toast';
import moment from 'moment';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Typography,
    Fade,
    Box,
    Modal,
  } from "@mui/material";import EditIcon from "../../assets/icons/edit-icon.svg";
import DeleteIcon from "../../assets/icons/icon_trash.svg";
import { useNavigate } from 'react-router-dom'
import _ from 'lodash';
import { createHardwarePartVariant } from '../../config/services/hardwareManagement';
import { useState } from "react";
import { makeStyles } from "@mui/styles";
import { getUserData } from '../../helper/randomFunction/localStorage';

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

export default function HardwarePartVariantListTable({ hardwarePartVariantList, itemsPerPage, pageNo, getHardwareVariantList }) {
    const navigate = useNavigate()
    const classes = useStyles();
    const [deletePopup, setDeletePopup] = useState(false);
    const [deleteObj, setDeleteObj] = useState("")
    const loginData = getUserData('loginData')
    const uuid =loginData?.uuid

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
        handleEditClick(row, 'delete')
    }
    

    const handleEditClick = (row, type) => {
        if (type === 'edit')
            navigate(`/authorised/hardware-part-variant-form/${row?.variant_id}`, { state: { rowData: row } });
        if (type === 'delete') {
            row.status = 3
            row.uuid=uuid
            createHardwarePartVariant(row)
                .then(res => {
                    if (res?.data?.status === 1) {
                        toast.success("Entry deleted successfully!")
                        getHardwareVariantList()

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
        <>
        <Table aria-label="customized table" className="custom-table datasets-table">
            <TableHead >
                <TableRow className='cm_table_head'>
                    <TableCell >S.No.</TableCell>
                    <TableCell >Part Name</TableCell>
                    <TableCell >Part Variant</TableCell>
                    <TableCell >MRP</TableCell>
                    <TableCell >MOP</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell >Created By</TableCell>
                    <TableCell >Created Date</TableCell>
                    <TableCell >Updated Date</TableCell>
                    <TableCell >Action</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {hardwarePartVariantList && hardwarePartVariantList.length > 0 && hardwarePartVariantList.map((row, i) => (
                    <TableRow key={i}>
                        <TableCell>{(i + 1) + ((pageNo - 1) * itemsPerPage)}.</TableCell>
                        <TableCell>{row?.part_name ?? '-'}</TableCell>
                        <TableCell>{row?.part_variant_name ?? '-'}</TableCell>
                        <TableCell>{row?.part_variant_mrp ?? '-'}</TableCell>
                        <TableCell>{row?.part_variant_mop ?? '-'}</TableCell>
                        <TableCell>
                            {row?.status === 1 && "Active"}
                            {row?.status === 2 && "Inactive"}
                            {row?.status === 3 && "Deleted"}
                        </TableCell>
                        <TableCell>{row?.created_by ?? '-'}</TableCell>
                        <TableCell>{moment(row?.created_on * 1000).format('DD-MM-YYYY (HH:mm A)')}</TableCell>
                        <TableCell>{row?.modified_on
                                ? moment(row?.modified_on * 1000).format('DD-MM-YYYY (HH:mm A)')
                                : moment(row?.created_on * 1000).format('DD-MM-YYYY (HH:mm A)')}</TableCell>
                        <TableCell className="edit-cell action-cell">
                            <Button className='form_icon' onClick={() => handleEditClick(row, 'edit')}><img src={EditIcon} alt='' /></Button>
                            <Button className='form_icon'
                                onClick={() => handleModelView(row)}><img src={DeleteIcon} alt='' /></Button>
                        </TableCell>
                    </TableRow>))}
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





