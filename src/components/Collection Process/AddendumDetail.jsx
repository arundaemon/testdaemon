import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    Grid,
    Autocomplete,
    Table,
    Paper,
    Stack,
    TableBody,
    TableContainer,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Button,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from "../../assets/icons/icon_search.svg";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSchoolBySchoolCode } from '../../config/services/school';
import { getPOListBySchoolCode } from '../../config/services/purchaseOrder';
import { getUserData } from '../../helper/randomFunction/localStorage';
import { addUpdateAddendum, listReasonMaster } from '../../config/services/packageBundle';
import toast from 'react-hot-toast';
import { listAddendumDetail } from '../../config/services/paymentCollectionManagment'
import { downloadSampleTarget } from '../../config/services/target';




const heading = ["Sr. No.", "Total Due Amount", "Collection Dates", "Collection Amount", ""]
const styles = {
    borderShadow: {
        boxShadow: "0px 3px 6px #00000029",
        // borderRadius: "8px",
        width: "70%",
        "& input": { height: "0.5em !important" },
    },
    tableCell: {
        padding: "8px 0px 8px 16px !important",
        // border: "none",
    },
    tableContainer: {
        margin: "30px auto",
        // borderRadius: "8px",
        // boxShadow: "0px 3px 6px #00000029",
        paddingBottom: "20px",
    },
    loader: {
        height: "50vh",
        width: "90vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
}


const AddendumDetail = () => {
    const location = useLocation()
    const { addendum_auto_id } = location?.state
    let uuid = getUserData('loginData')?.uuid

    const [schoolDetail, setSchoolDetail] = useState(null)
    const [addendumDetails, setAddendumDetails] = useState(null)
    const [details, setDetails] = useState(null)
    const [collectionDetails, setCollectionDetails] = useState([])

    const getAddendumDetail = async () => {
        let detail = await listAddendumDetail({ uuid, addendum_auto_id })
        detail = detail?.data?.addendum_details[0]
        setAddendumDetails(detail)
        setCollectionDetails(detail?.collection_details)
        let school = await getSchoolBySchoolCode(detail?.school_code)
        school = school?.result
        setSchoolDetail(school?.result)
        setDetails({ ...detail, ...school })
    }

    useEffect(() => {
        getAddendumDetail()
    }, [])

    return (
        <Box>
            <Box sx={{ boxShadow: "0px 0px 8px #00000029", borderRadius: "8px", margin: "20px", padding: "20px" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box sx={{ color: "#202124", fontWeight: "600", fontSize: "19px" }}>{'Addendum Approvals'}</Box>
                    <TextField
                        sx={{ marginBottom: "20px", border: "1px solid #85888A", width: "100px", borderRadius: "4px" }}
                        className={`inputRounded search-input width-auto`}
                        type="search"
                        placeholder="Search"
                        // value={searchTextField}
                        // onChange={handleSearch}
                        InputLabelProps={{ style: { ...{ top: `${-7}px` } } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <img src={SearchIcon} alt="" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                <Grid container sx={{ marginTop: "20px" }}>
                    <Grid xs={2.9}>
                        <Box sx={{ fontWeight: '600', fontSize: "18px" }}>{'School Name'}</Box>
                        <Box sx={{ fontSize: "16px" }}>{details?.schoolName}</Box>
                    </Grid>
                    <Grid xs={2.9}>
                        <Box sx={{ fontWeight: '600', fontSize: "18px" }}>{'School Code'}</Box>
                        <Box sx={{ fontSize: "16px" }}>{details?.schoolCode}</Box>
                    </Grid>
                    <Grid xs={2.9}>
                        <Box sx={{ fontWeight: '600', fontSize: "18px" }}>{'Email'}</Box>
                        <Box sx={{ fontSize: "16px" }}>{details?.schoolEmailId}</Box>
                    </Grid>
                    <Grid xs={2.9}>
                        <Box sx={{ fontWeight: '600', fontSize: "18px" }}>{'Total Invoice'}</Box>
                        <Box sx={{ fontSize: "16px" }}>{addendumDetails?.total_due_amount}</Box>
                    </Grid>


                    <Grid xs={2.9} sx={{ marginTop: "30px" }}>
                        <Box sx={{ fontWeight: '600', fontSize: "18px" }}>{'Total Contract Value'}</Box>
                        <Box sx={{ fontSize: "16px" }}>{addendumDetails?.total_contract_value || 0}</Box>
                    </Grid>
                    <Grid xs={2.9} sx={{ marginTop: "30px" }}>
                        <Box sx={{ fontWeight: '600', fontSize: "18px" }}>{'Select Reason for Addendum'}</Box>
                        <Box sx={{ fontSize: "16px" }}>{addendumDetails?.reason_name || "NA"}</Box>
                    </Grid>
                    <Grid xs={2.9} sx={{ marginTop: "30px" }}>
                        <Box sx={{ fontWeight: '600', fontSize: "18px" }}>{'PO Selected'}</Box>
                        <Box sx={{ fontSize: "16px" }}>{addendumDetails?.po_code?.join(', ') || "NA"}</Box>
                    </Grid>
                    <Grid xs={2.9} sx={{ marginTop: "30px" }}>
                        <Box sx={{ fontWeight: '600', fontSize: "18px" }}>{'Download Proof'}</Box>
                        <Box sx={{ display: "flex" }}>
                            <Box sx={{ fontSize: "16px" }}>
                                {'Download Proof'}
                            </Box>
                            <a href={addendumDetails?.addendum_proof_file} target='_blank'>
                                <DownloadIcon sx={{ color: "#F45E29", fontWeight: "700", marginLeft: "10px", cursor: "pointer" }} />
                            </a>
                        </Box>
                    </Grid>

                </Grid>


                <Box>
                    <TableContainer component={Paper} sx={styles.tableContainer}>
                        <Table aria-label="customized table">
                            <TableHead>
                                <TableRow sx={{ borderTop: "1px solid #DEDEDE", borderBottom: "1px solid #DEDEDE", borderRadius: "0px !important" }}>
                                    {heading.map((col, index) => (
                                        <TableCell
                                            align="left"
                                            key={index}
                                            sx={{ ...styles.tableCell, padding: "16px", }}
                                        >
                                            {col}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    collectionDetails?.map((obj, index) => {
                                        return (
                                            <TableRow sx={{ borderBottom: "1px solid #DEDEDE", "& td": styles.tableCell }}>
                                                <TableCell align="left">
                                                    <Box sx={styles.productSec}>
                                                        {index === 0 && index + 1}
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Box sx={styles.productSec}>
                                                        {index === 0 && addendumDetails?.total_due_amount}
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Box sx={{ width: "50%" }}>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <Stack>
                                                                <DatePicker
                                                                    inputFormat="DD/MM/YYYY"
                                                                    value={obj?.collection_date}
                                                                    disabled={true}
                                                                    // onChange={(value) => {
                                                                    //     let updateRow = []
                                                                    //     collectionDetails?.map((item) => {
                                                                    //         if (item?.id == obj?.id) {
                                                                    //             item['collection_date'] = value
                                                                    //         }
                                                                    //         updateRow.push(item)
                                                                    //     })
                                                                    //     setCollectionDetails(updateRow)
                                                                    //     // const date = new Date(value);
                                                                    //     // console.log(date);
                                                                    //     // setAddendumData({ ...addendumData, collection_date: [...collection_date, {}] || [] })
                                                                    //     // setFieldValue("implementationEndDate", value)
                                                                    // }}
                                                                    renderInput={(params) => (
                                                                        <TextField {...params} required />
                                                                    )}
                                                                    InputProps={{
                                                                        endAdornment: (
                                                                            <IconButton>
                                                                                <CalendarTodayIcon />
                                                                            </IconButton>
                                                                        ),
                                                                    }}
                                                                />
                                                            </Stack>
                                                        </LocalizationProvider>
                                                    </Box>
                                                </TableCell>

                                                <TableCell align="left" sx={{ width: "20%" }}>
                                                    <Box sx={styles.productSec}>
                                                        <TextField value={obj?.collection_amount}
                                                            // onChange={(e) => {
                                                            //     let updateRow = []
                                                            //     collectionDetails?.map((item) => {
                                                            //         if (item?.id == obj?.id) {
                                                            //             item['collection_amount'] = Number(e.target.value)
                                                            //         }
                                                            //         updateRow.push(item)
                                                            //     })
                                                            //     setCollectionDetails(updateRow)
                                                            // }}
                                                            disabled={true}
                                                        />
                                                    </Box>
                                                </TableCell>

                                                {/* <TableCell align="right" sx={{ width: "20%" }}>
                                                    <Box sx={{ display: "flex" }}>
                                                        <RemoveIcon sx={{ color: "#F45E29", border: "2px solid #F45E29", borderRadius: "4px", cursor: "pointer" }} onClick={() => {
                                                            if (collectionDetails.length > 1) {
                                                                let removedRow = collectionDetails?.filter((item) => item.id !== obj.id)
                                                                let newCollectionData = []
                                                                for (let i = 0; i < removedRow.length; i++) {
                                                                    removedRow[i].id = i
                                                                    newCollectionData.push(removedRow[i])
                                                                }
                                                                setCollectionDetails(newCollectionData)
                                                            }
                                                        }} />
                                                        {
                                                            index === collectionDetails.length - 1 &&
                                                            <AddIcon sx={{ color: "#F45E29", border: "2px solid #F45E29", cursor: "pointer", borderRadius: "4px", marginLeft: "20px" }} onClick={() => {
                                                                setCollectionDetails([...collectionDetails, { id: index + 1, collection_date: "", collection_amount: "", total_due_amount: obj?.total_due_amount }])
                                                            }} />
                                                        }
                                                    </Box>
                                                </TableCell> */}
                                            </TableRow>
                                        )
                                    })
                                }

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                {/* <Box sx={{ display: "flex" }}>
                    <Box sx={{ width: "35%" }}>
                        <Box sx={{ fontWeight: "600", fontSize: "17px" }}>{'Select Reason for Addendum'}</Box>
                        <Autocomplete
                            disablePortal
                            // multiple
                            id="combo-box-demo"
                            options={reasonList}
                            getOptionLabel={(option) => option.reason}
                            onChange={(e, value) => {
                                setAddendumData({ ...addendumData, reason_id: value?.reason_id })
                            }}
                            // value={filterData?.product_code || ""}
                            sx={{
                                fontSize: "1rem",
                                padding: "8.8px 0",
                                width: "90%",
                                "& input": { height: "10px" }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    sx={{ "& fieldset": { borderRadius: "2px" } }}
                                    placeholder="Select"
                                />
                            )}
                        />
                    </Box>
                    <Box sx={{ width: "35%" }}>
                        <Box sx={{ fontWeight: "600", fontSize: "17px" }}>{'Upload Proof'}</Box>
                        <Box>
                            <input
                                style={{ width: "100%", height: "100%", marginTop: "15px" }}
                                type="file"
                                onChange={(e) => handleUploadFile(e)}
                                accept=".png,.jpg,.pdf,!.csv,!.xlsx"
                                required
                            />
                        </Box>
                    </Box>
                </Box> */}
                {/* <Box mt={3}>
                    <Box sx={{ fontWeight: "600", fontSize: "17px", marginBottom: "10px" }}>{'Reason for Rejection'}</Box>
                    <Box>
                        <TextField fullWidth placeholder="Add Remarks" id="fullWidth" sx={{ "& input": { border: "1px solid #85888A", borderRadius: "4px" } }} onChange={(e) => {
                            // setAddendumData({ ...addendumData, addendum_comment: e.target.value })
                        }} />
                    </Box>
                </Box> */}
            </Box>
            {/* <Box sx={{ margin: "20px", display: "flex", flexDirection: "row-reverse" }}>
                <Button variant='outlined' sx={{
                    borderRadius: "4px", width: "100px", borderWidth: "2px", padding: "5px 20px", fontSize: "18px", fontWeight: '550',
                    "&:hover": {
                        color: "#fff",
                        backgroundColor: "#f45e29 !important",
                    },
                }}>{'Reject'}</Button>
                <Button variant='outlined' sx={{
                    borderRadius: "4px", width: "100px", borderWidth: "2px", padding: "5px 20px", fontSize: "18px", fontWeight: '550', marginRight: "15px",
                    "&:hover": {
                        color: "#fff",
                        backgroundColor: "#f45e29 !important",
                    },
                }}
                    onClick={async () => {
                        // let collectionData = []
                        // for (let i = 0; i < collectionDetails.length; i++) {
                        //     collectionData.push({ collection_amount: collectionDetails[i].collection_amount, collection_date: new Date(collectionDetails[i]?.collection_date).toLocaleDateString().split('/').reverse().join('-') })
                        // }
                        // let submitData = {
                        //     school_code: data?.school_code,
                        //     uuid: uuid,
                        //     po_code: addendumData?.po_code,
                        //     total_due_amount: data?.total_contract_amount,
                        //     collection_details: collectionData,
                        //     addendum_proof_file: addendumData?.addendum_proof_file,
                        //     approval_status_id: 1,
                        //     addendum_comment: addendumData?.addendum_comment,
                        //     reason_id: addendumData?.reason_id,
                        // }
                        // let res = await addUpdateAddendum(submitData)
                        // navigate("/authorised/pending-addendum-list", { state: { pendingList: "arjit" } })
                    }}
                >{'Approve'}</Button>
            </Box> */}
        </Box>
    )
}

export default AddendumDetail