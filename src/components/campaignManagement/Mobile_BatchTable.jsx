import { TableContainer, Paper, Table, TableBody, TableRow, TableCell, Typography } from "@mui/material";
import { CSVLink } from 'react-csv'
import TableHead from "@mui/material/TableHead";
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getLogsList } from "../../config/services/lead";

const useStyles = makeStyles({
    cusCard1: {
        padding: "10px 10px 10px 35px",
        height: '180px',
        width: '100%',
        boxShadow: "0px 0px 8px #00000029",
        marginBottom: '10px',
        position: 'relative'
    },
    cusCheckbox: {
        position: "absolute",
        top: '10px',
        left: '8px',
        padding: '0',
    },
    title: {
        fontWeight: "600",
        marginBottom: "6px",
        textTransform: "capitalize",
        fontSize: '14px',
        "& a": {
            textDecoration: "none",
        }
    },
    disc: {
        fontSize: "14px",
    }
});

export default function Mobile_BatchTable() {
    const classes = useStyles();
    const location = useLocation();
    const campaignName = location?.state?.campaignName;
    const [batchList, setBatchList] = useState([]);

    const fetchLogs = () => {
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


    const fileHeader = [
        { label: 'Name', key: 'name' },
        { label: 'Mobile', key: 'mobile' },
        { label: 'Email', key: 'email' },
        { label: 'State', key: 'state' },
        { label: 'City', key: 'city' },
        { label: 'Reference', key: 'reference' },
        { label: 'User_Type', key: 'userType' },
        { label: 'Error Message', key: 'errorMessage' }
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

    useEffect(() => fetchLogs(), [])

    return (
        <div style={{ height: '100%' }}>
            {batchList && batchList.length > 0 &&
                batchList.map((row, i) => (
                    <div key={i} className={classes.cusCard1}>
                        <Typography className={classes.title}>Batch: {row?.batch}</Typography>
                        <Typography className={classes.title}>File Name: {row?.fileName}</Typography>
                        <Typography className={classes.title}>Status: {row?.batchStatus} </Typography>
                        <Typography className={classes.title}>Success: {downloadSuccessExcel(row?.successFile)}</Typography>
                        <Typography className={classes.title}>Error: {downloadErrorExcel(row?.errorFile)}</Typography>
                        <Typography className={classes.title}>Uploaded On: {moment(row?.createdAt).format('DD-MM-YYYY (HH:mm A)')}</Typography>
                    </div>
                ))}
        </div >
    );
}
