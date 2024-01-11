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
import React, { useEffect, useRef, useState } from 'react'
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
import { uploadAddendumProof } from '../../config/services/paymentCollectionManagment';
import { handleNumberKeyDown, handlePaste } from '../../helper/randomFunction';
import { assignApprovalRequest } from '../../config/services/salesApproval';




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

const GenerateAddendum = () => {

    const location = useLocation();
    const { data } = location?.state

    const [schoolDetail, setSchoolDetail] = useState(null)
    const [purchaseOrderList, setPurchaseOrderList] = useState([])
    const [reasonList, setReasonList] = useState([])
    const [collectedAmt, setCollectedAmt] = useState(0)
    const [addendumData, setAddendumData] = useState({
        po_code: [],
        collection_details: [],
        addendum_comment: "",
        addendum_proof_file: "",
        reason_id: "",
    })

    const [collectionDetails, setCollectionDetails] = useState([])

    const getSchoolDetail = async (schoolCode) => {
        let school = await getSchoolBySchoolCode(schoolCode)
        setSchoolDetail(school?.result)
        setCollectionDetails([...collectionDetails, { id: 0, collection_date: "", collection_amount: "", total_due_amount: data?.total_outstanding_amount }])
    }

    const getPOList = async (schoolCode) => {
        let poList = await getPOListBySchoolCode(schoolCode)
        setPurchaseOrderList(poList?.result)
    }

    const loginData = getUserData('loginData')
    const uuid = loginData?.uuid

    const getReasonList = async () => {
        let params = {
            uuid: uuid,
            reason_type: ["ADDENDUM_REASON"],
            status: [1],
        }
        let reasonList = await listReasonMaster(params)
        reasonList = reasonList?.data?.reason_details
        setReasonList(reasonList)
    }

    const fileInputRef = useRef(null);

    const handleButtonClick = (e) => {
        fileInputRef.current.click();
    };

    useEffect(async () => {
        await getSchoolDetail(data?.school_code)
        await getPOList(data?.school_code)
        await getReasonList()
    }, [])

    const [selectedFileName, setSelectedFileName] = useState(null);


    const handleUploadFile = async (e) => {
        if (e.target.files[0]?.type === 'application/vnd.ms-excel' || e.target.files[0]?.type === 'text/csv') {
            // file is invalid, do not upload
            toast.error('Invalid file type');
            setAddendumData({ ...addendumData, addendum_proof_file: null })
        }
        else {
            const formData = new FormData();
            formData.append('file', e.target.files[0]);
            setSelectedFileName(e.target.files[0].name);
            let file_path = await uploadAddendumProof(formData)
            setAddendumData({ ...addendumData, addendum_proof_file: file_path?.result })
            // setAddendumData({ ...addendumData, addendum_proof_file: e.target.files[0] })

        }
    }

    const navigate = useNavigate();


    return (
        <Box>
            <Box sx={{ boxShadow: "0px 0px 8px #00000029", borderRadius: "8px", margin: "20px", padding: "20px" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box sx={{ color: "#202124", fontWeight: "600", fontSize: "19px" }}>{'Generate Addendum'}</Box>
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
                    <Grid xs={2.4}>
                        <Box sx={{ fontWeight: '600', fontSize: "18px" }}>{'School Name'}</Box>
                        <Box sx={{ fontSize: "16px" }}>{schoolDetail?.schoolName}</Box>
                    </Grid>
                    <Grid xs={2.4}>
                        <Box sx={{ fontWeight: '600', fontSize: "18px" }}>{'School Code'}</Box>
                        <Box sx={{ fontSize: "16px" }}>{schoolDetail?.schoolCode}</Box>
                    </Grid>
                    <Grid xs={2.4}>
                        <Box sx={{ fontWeight: '600', fontSize: "18px" }}>{'Email'}</Box>
                        <Box sx={{ fontSize: "16px" }}>{schoolDetail?.schoolEmailId}</Box>
                    </Grid>
                    <Grid xs={2.4}>
                        <Box sx={{ fontWeight: '600', fontSize: "18px" }}>{'Total Invoice'}</Box>
                        <Box sx={{ fontSize: "16px" }}>{data?.total_invoice_amount}</Box>
                    </Grid>
                    <Grid xs={2.4}>
                        <Box sx={{ fontWeight: '600', fontSize: "18px" }}>{'Total Contract Value'}</Box>
                        <Box sx={{ fontSize: "16px" }}>{data?.total_contract_amount || 0}</Box>
                    </Grid>

                </Grid>
                <Box>
                    <Box sx={{ fontSize: "17px", fontWeight: "600", marginTop: "20px" }}>{'Select PO'}</Box>
                    <Autocomplete
                        disablePortal
                        multiple
                        id="combo-box-demo"
                        options={purchaseOrderList}
                        getOptionLabel={(option) => option.purchaseOrderCode}
                        onChange={(e, value) => {
                            setAddendumData({ ...addendumData, po_code: [...addendumData?.po_code, value[0]?.purchaseOrderCode] || [] })
                        }}
                        // value={filterData?.product_code || ""}
                        sx={{
                            fontSize: "1rem",
                            padding: "8.8px 0",
                            width: "25%",
                            "& input": { height: "10px" },
                            "& div": { borderRadius: "8px" }, "& fieldset": { borderColor: "#202124 !important" }
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
                                                        {index === 0 && obj?.total_due_amount}
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Box sx={{ width: "50%" }}>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <Stack>
                                                                <DatePicker
                                                                    inputFormat="DD/MM/YYYY"
                                                                    value={obj?.collection_date}
                                                                    minDate={new Date()}
                                                                    onChange={(value) => {
                                                                        let updateRow = []
                                                                        collectionDetails?.map((item) => {
                                                                            if (item?.id == obj?.id) {
                                                                                item['collection_date'] = value
                                                                            }
                                                                            updateRow.push(item)
                                                                        })
                                                                        setCollectionDetails(updateRow)
                                                                        // const date = new Date(value);
                                                                        // console.log(date);
                                                                        // setAddendumData({ ...addendumData, collection_date: [...collection_date, {}] || [] })
                                                                        // setFieldValue("implementationEndDate", value)
                                                                    }}
                                                                    renderInput={(params) => (
                                                                        <TextField {...params} required sx={{ "& div": { borderRadius: "4px" }, "& fieldset": { borderColor: "#202124 !important" } }} />
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
                                                        <TextField value={obj?.collection_amount} onChange={(e) => {
                                                            let sum = 0
                                                            let dueAmt = collectionDetails?.filter((item) => item.id != obj?.id)
                                                            for (let i = 0; i < dueAmt.length; i++) {
                                                                sum += dueAmt[i].collection_amount
                                                            }
                                                            if (data?.total_outstanding_amount < Number(e.target.value) + Number(sum)) {
                                                                toast.error('Amount exceeded')
                                                                return;
                                                            } else {
                                                                let updateRow = []
                                                                collectionDetails?.map((item) => {
                                                                    if (item?.id == obj?.id) {
                                                                        item['collection_amount'] = Number(e.target.value)
                                                                    }
                                                                    updateRow.push(item)
                                                                })
                                                                setCollectionDetails(updateRow)
                                                            }
                                                        }}
                                                            onKeyDown={handleNumberKeyDown}
                                                            onPaste={handlePaste}
                                                            sx={{ "& div": { borderRadius: "4px" }, "& fieldset": { borderColor: "#202124 !important" } }}
                                                        />
                                                    </Box>
                                                </TableCell>

                                                <TableCell align="right" sx={{ width: "20%" }}>
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
                                                                let addNewRow = true
                                                                let sum = 0
                                                                for (let i = 0; i < collectionDetails.length; i++) {
                                                                    sum += collectionDetails[i].collection_amount
                                                                }
                                                                if (data?.total_outstanding_amount <= Number(sum)) {
                                                                    toast.error('Amount filled')
                                                                    addNewRow = false
                                                                    return;
                                                                }
                                                                for (let i = 0; i < collectionDetails.length; i++) {
                                                                    if (!collectionDetails[i].collection_date || !collectionDetails[i].collection_amount) {
                                                                        toast.error('Fill all the empty fields')
                                                                        addNewRow = false
                                                                        break;
                                                                    }
                                                                }
                                                                if (addNewRow) {
                                                                    // let sum = 0
                                                                    // for (let i = 0; i < collectionDetails.length; i++) {
                                                                    //     sum += collectionDetails[i].collection_amount
                                                                    // }
                                                                    setCollectionDetails([...collectionDetails, { id: index + 1, collection_date: "", collection_amount: "", total_due_amount: obj?.total_due_amount }])
                                                                    // setCollectedAmt(sum)
                                                                }

                                                            }} />}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                                {/* <TableRow sx={{ borderBottom: "1px solid #DEDEDE", "& td": styles.tableCell }}>
                                    <TableCell align="left">
                                        <Box sx={styles.productSec}>
                                            {'1'}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="left">
                                        <Box sx={styles.productSec}>
                                            {data?.total_contract_amount}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="left">
                                        <Box sx={{ width: "50%" }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <Stack>
                                                    <DatePicker
                                                        inputFormat="DD/MM/YYYY"
                                                        // value={values.implementationEndDate}
                                                        onChange={(value) => {
                                                            console.log(value)
                                                            setAddendumData({ ...addendumData, collection_date: [...collection_date, {}] || [] })
                                                            // setFieldValue("implementationEndDate", value)
                                                        }}
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
                                            <TextField />
                                        </Box>
                                    </TableCell>

                                    <TableCell align="right" sx={{ width: "20%" }}>
                                        <Box sx={{ display: "flex" }}>
                                            <RemoveIcon sx={{ color: "#F45E29", border: "2px solid #F45E29", borderRadius: "4px" }} />
                                            <AddIcon sx={{ color: "#F45E29", border: "2px solid #F45E29", borderRadius: "4px", marginLeft: "20px" }} />
                                        </Box>
                                    </TableCell>
                                </TableRow> */}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                <Box sx={{ display: "flex" }}>
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
                                "& input": { height: "10px" },
                                "& div": { borderRadius: "4px" }, "& fieldset": { borderColor: "#202124 !important" }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    sx={{ "& fieldset": { borderRadius: "4px" } }}
                                    placeholder="Select"
                                />
                            )}
                        />
                    </Box>
                    <Box sx={{ width: "35%" }}>
                        <Box sx={{ fontWeight: "600", fontSize: "17px" }}>{'Upload Proof'}</Box>
                        <Box sx={{ border: '1px solid #202124', borderRadius: "4px", marginTop: "8px", width: "80%", height: "42px", }}>
                            <input
                                type="file"
                                style={{ display: "none" }}
                                ref={fileInputRef}
                                onChange={(e) => handleUploadFile(e)}
                                accept=".png,.jpg,.pdf,!.csv,!.xlsx"
                                required
                            />
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Box sx={{ textAlign: "left", margin: "auto 0", marginLeft: "10px" }}>
                                    {selectedFileName}
                                </Box>
                                <Button sx={{ textAlign: "right", color: "#4482FF !important" }} onClick={(e) => handleButtonClick(e)}>{'Browse'}</Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box mt={3}>
                    <Box sx={{ fontWeight: "600", fontSize: "17px", marginBottom: "10px" }}>{'Comments'}</Box>
                    <Box>
                        <TextField fullWidth placeholder="Enter comment here" id="fullWidth" sx={{ "& input": { border: "1px solid #202124", borderRadius: "4px" } }} onChange={(e) => {
                            setAddendumData({ ...addendumData, addendum_comment: e.target.value })
                        }} />
                    </Box>
                </Box>
            </Box>
            <Box sx={{ margin: "20px", display: "flex", flexDirection: "row-reverse" }}>
                <Button variant='outlined' sx={{
                    borderRadius: "4px", width: "100px", borderWidth: "2px", padding: "5px 20px", fontSize: "18px", fontWeight: '550',
                    "&:hover": {
                        color: "#fff",
                        backgroundColor: "#f45e29 !important",
                    },
                }}>{'Cancel'}</Button>
                <Button variant='outlined' sx={{
                    borderRadius: "4px", width: "100px", borderWidth: "2px", padding: "5px 20px", fontSize: "18px", fontWeight: '550', marginRight: "15px",
                    "&:hover": {
                        color: "#fff",
                        backgroundColor: "#f45e29 !important",
                    },
                }}
                    onClick={async () => {
                        let collectionData = []
                        for (let i = 0; i < collectionDetails.length; i++) {
                            collectionData.push({ collection_amount: collectionDetails[i].collection_amount, collection_date: new Date(collectionDetails[i]?.collection_date).toLocaleDateString().split('/').reverse().join('-') })
                        }
                        let submitData = {
                            school_code: data?.school_code,
                            uuid: uuid,
                            po_code: addendumData?.po_code,
                            total_due_amount: data?.total_contract_amount,
                            collection_details: collectionData,
                            addendum_proof_file: addendumData?.addendum_proof_file,
                            approval_status_id: 1,
                            addendum_comment: addendumData?.addendum_comment,
                            reason_id: addendumData?.reason_id,
                        }
                        let res = await addUpdateAddendum(submitData)
                        if (res?.data?.status == 1) {
                            let params = {
                                approvalType: 'Generate Addendum',
                                groupCode: "addendum",
                                groupName: "",
                                createdByRoleName: getUserData("userData")?.crm_role,
                                referenceCode: `ADM-${res?.data?.addendum_auto_id}`,
                                statusUpdate: false,
                                data: {
                                    createdByName: getUserData("userData")?.name,
                                    createdByProfileName: getUserData("userData")?.crm_profile,
                                    createdByEmpcode: getUserData("userData")?.employee_code,
                                    createdByUuid: getUserData("loginData")?.uuid,
                                    schoolCode: submitData?.school_code,
                                    approvalStatusId: submitData?.approval_status_id,
                                    addendumComment: submitData?.addendum_comment,
                                    reasonId: submitData?.reason_id,
                                    addendumProfileFile: submitData?.addendum_proof_file,
                                    totalDueAmount: submitData?.total_due_amount,
                                    poCode: submitData?.po_code?.join(", "),
                                    collectionDetails: submitData?.collection_details,
                                }
                            }
                            await assignApprovalRequest(params)
                        }
                        navigate("/authorised/pending-addendum-list")
                    }}
                >{'Submit'}</Button>
            </Box>
        </Box>
    )
}

export default GenerateAddendum

