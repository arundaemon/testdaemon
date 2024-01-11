import React, { useEffect, useState, useCallback } from 'react';
import { makeStyles } from '@mui/styles';
import { TextField, Pagination, Grid, InputAdornment, Modal, Box, Typography, Link, Fade, CircularProgress, TablePagination } from "@mui/material";
import { getLogsList } from '../../config/services/lead';
import BatchTable from './BatchTable';
import CrossIcon from "../../assets/image/crossIcn.svg"

const style = {
    height: "400px",
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    bgcolor: 'background.paper',
    border: '2px solid #fff',
    boxShadow: '0px 0px 4px #0000001A',
    p: 4,
    borderRadius: '8px',
    "&:focus-visible": {
        outline: 'none',
    },

};

export default function BatchListModal(props) {
    let { batchModal, campaignName, handleBatchModal } = props;
    const [batchList, setBatchList] = useState([]);

    const fetchLogs = async () => {
        let params = { campaignName, sortKey: 'createdAt', sortOrder: -1 };
        getLogsList(params)
            .then(res => {
                if (res?.result) {
                    setBatchList(res?.result);
                }
            })
            .catch(err => {
                console.log(err, '...error inside catch');
            })
    }

    useEffect(() => {
        fetchLogs()
    }, [])

    return (
        <>
            <Modal
                open={batchModal}
                //onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}
                >
                    <Typography display='flex' justifyContent="flex-end">
                        <img onClick={handleBatchModal} className='crossIcon' src={CrossIcon} alt="" />
                    </Typography>
                    <Typography id="modal-modal-title" variant="h6" component="h2" alignContent="center">
                        Campaign Details
                    </Typography>
                    {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                    </Typography> */}
                    <BatchTable batchList={batchList} />
                </Box>
            </Modal>
        </>
    )

}