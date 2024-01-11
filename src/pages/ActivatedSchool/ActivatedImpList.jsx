import React, { useEffect, useState } from 'react'
import Page from '../../components/Page'
import {
    Box,
    Divider,
    Grid,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableCell,
    TableHead,
    TableRow,
    Stack,
    Typography,
    TextField,
    Autocomplete,
    Button,
} from '@mui/material'
import { DecryptData } from '../../utils/encryptDecrypt'
import { fetchImplementationList, getActivatedImplementationList, listActivatedSchool } from '../../config/services/implementationForm'
import { getLoggedInRole } from '../../utils/utils'
import { getAllProductList } from '../../config/services/packageBundle'
import { getUserData } from '../../helper/randomFunction/localStorage'
import { getSchoolBySchoolCode, getSchoolCodeList } from '../../config/services/school'
import { useStyles } from '../../css/ClaimForm-css'
import EditIcon from '@mui/icons-material/Edit';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';



const styles = {
    borderShadow: {
        boxShadow: "0px 3px 6px #00000029",
        borderRadius: "8px",
        width: "70%",
        "& input": { height: "0.5em !important" },
    },
    tableCell: {
        padding: "8px 0px 8px 16px !important",
        border: "none",
    },
    tableContainer: {
        margin: "30px auto",
        borderRadius: "8px",
        boxShadow: "0px 3px 6px #00000029",
        paddingBottom: "20px",
    },
}

const heading = ["Sr. No.", "School Name", "School Code", "Implementation ID", "Product Name", "Last Updated On", "Action"]

const ActivatedImpList = () => {
    const navigate = useNavigate();


    const classes = useStyles();
    const [pageNo, setPagination] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    // const [search, setSearchValue] = useState("");
    const [rolesList, setRoleslist] = useState([]);
    const [roleNameList, setRoleName] = useState([]);
    const [activatedImpList, setActivatedImpList] = useState([])
    const [activatedSchoolList, setActivatedSchoolList] = useState([])

    const userRole = getLoggedInRole();
    const [schoolList, setSchoolList] = useState([]);
    const [schoolDetail, setSchoolDetail] = useState([])

    const [productList, setProductList] = useState([])

    const [impFormID, setImpFormID] = useState([])


    // MY CLAIM
    const [search, setSearch] = useState('')
    const [leadId, setLeadID] = useState('')
    const [schoolCode, setSchoolCode] = useState('')
    const [schoolName, setSchoolName] = useState('')
    // 

    const [loading, setLoading] = useState(true)

    const loginData = getUserData('loginData')
    const uuid = loginData?.uuid


    const [filterData, setFilterData] = useState({
        product: "",
        schoolName: "",
        schoolCode: "",
        impFormCode: ""
    })

    const [searchFilterData, setSearchFilterData] = useState(null)

    const getProductList = async () => {
        let params = {
            status: [1],
            uuid: uuid,
            master_data_type: 'package_products'
        }
        await getAllProductList(params)
            .then(res => {
                let data = res?.data?.master_data_list
                let tempArray = data?.map(obj => ({
                    label: obj?.name,
                    value: obj?.name,
                    groupkey: obj?.group_key,
                    groupName: obj?.group_name,
                    productID: obj?.id,
                    productCode: obj?.product_key
                }))
                setProductList(tempArray)

            })
            .catch(err => {
                console.error(err, 'Error while fetching product list')
            })
    }

    const getAllSchList = async () => {
        let params = {
            childRoleNames: roleNameList,
            search,
            count: 500
        }
        try {
            let res = await getSchoolCodeList(params);
            if (res?.result) {
                setSchoolList(res?.result)
            }

        } catch (err) {
            console.error(err)
        }
        setLoading(false)
    }

    const getAllImpList = async () => {
        let impArr = []
        let params = {
            childRoleNames: roleNameList,
            search,
            page: 0,
            count: 100
        }
        try {
            let implementationList = await fetchImplementationList(params);
            if (implementationList?.result) {
                implementationList = implementationList?.result
                for (let i = 0; i < implementationList?.length; i++) {
                    if (!impArr.includes(implementationList[i].impFormNumber)) {
                        impArr.push(implementationList[i].impFormNumber)
                    }
                }
                console.log(impArr)
                setImpFormID(impArr)
            }

        } catch (err) {
            console.error(err)
        }
        setLoading(false)
    }

    useEffect(() => {
        const getData = setTimeout(() => {
            if (search) {
                getAllSchList()
            }
        }, 500)
        return () => clearTimeout(getData)
    }, [search]);


    const getSchoolCode = (data) => {
        setSchoolList([])
        setSchoolCode(data?.schoolCode)
        setSchoolName(data?.schoolName)
    }

    useEffect(async () => {
        await getProductList()
        const applyFilter = DecryptData(localStorage?.getItem("implementationFilters"));
        let childRoleNames = DecryptData(localStorage?.getItem("childRoles"))
        setRoleslist(childRoleNames)
        childRoleNames = childRoleNames?.map((roleObj) => roleObj?.roleName)
        childRoleNames.push(userRole)
        setRoleName(childRoleNames)

        let params = {
            pageNo: pageNo - 1,
            count: itemsPerPage,
            search,
            childRoleNames,
            searchFilterData,
            product: searchFilterData?.product || "",
            schoolName: searchFilterData?.schoolName || "",
            schoolCode: searchFilterData?.schoolCode || "",
            impFormCode: searchFilterData?.impFormCode || "",
        };

        let activatedImp = await getActivatedImplementationList(params)
        activatedImp = activatedImp?.result

        await getAllImpList()
        setActivatedImpList(activatedImp)

        let activatedParams = {
            uuid: uuid,
            page_offset: 0,
            page_size: 25,
            order: "ASC",
        }

        let activatedList = await listActivatedSchool(activatedParams)
        activatedList = activatedList?.data

        let activatedSchoolData = []

        if (activatedList.status == 1) {
            let list = activatedList.activated_school_details
            for (let i = 0; i < list.length; i++) {
                let school = await getSchoolBySchoolCode("AP0001" || list[i].school_code)
                school = school?.result
                activatedSchoolData.push({ ...school, ...list[i] })
            }
        }

        setActivatedSchoolList(activatedSchoolData)
    }, [searchFilterData])

    return (
        <Page
            title="Extramarks | Quotation Table"
            className="main-container myLeadPage datasets_container"
        >
            <Typography sx={{ margin: "16px", fontSize: "20px", fontWeight: "600" }}>{"Manage Activated school View"}</Typography>
            <Grid container sx={{ marginTop: "30px", padding: "0 20px" }}>
                <Grid xs={1} sx={{ display: "grid", alignItems: "center" }}>{"Product"}</Grid>
                <Grid xs={3}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={productList}
                        onChange={(e, value) => {
                            setFilterData({ ...filterData, product: value || "" })
                        }}
                        value={filterData?.product?.label || ""}
                        sx={{
                            fontSize: "1rem",
                            padding: "8.8px",
                            width: "80%",
                            borderRadius: "4px",

                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Select"
                            />
                        )}
                    />
                </Grid>
                <Grid xs={1} sx={{ display: "grid", alignItems: "center" }}>{"School Name"}</Grid>

                <Grid xs={3} sx={{ display: "grid", alignItems: "center" }}>
                    <input
                        style={{
                            fontSize: "1rem",
                            padding: "8.8px",
                            width: "80%",
                            height: "6vh",
                            borderRadius: "8px",
                            marginTop: "5px",
                            border: '1px solid #DEDEDE',
                        }}
                        name="schoolName"
                        type="text"
                        placeholder="School Name"
                        value={schoolName}
                        onChange={(e, value) => {
                            setSearch(e.target.value)
                            setSchoolName(e.target.value)
                            setSchoolList([])
                            setSchoolCode('')
                        }}
                    />
                    <Box sx={schoolList?.length > 0 && {
                        height: "100px",
                        overflow: "scroll",
                        position: "absolute",
                        background: "rgb(238, 238, 238)",
                        width: "20%",
                        padding: "10px 20px",
                        zIndex: "9999",
                        // [theme.breakpoints.down('md')]: {
                        //     width: "80%",
                        // }
                    }}>
                        {schoolList?.map((obj, key) => {
                            return (
                                <div
                                    onClick={() => getSchoolCode(obj)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {`${obj?.schoolCode}-${obj?.schoolName}`}
                                </div>
                            )
                        })
                        }
                    </Box>
                </Grid>


                <Grid xs={1} sx={{ display: "grid", alignItems: "center" }}>{"School Code"}</Grid>
                <Grid xs={3} sx={{ display: "grid", alignItems: "center" }}>
                    <input
                        style={{
                            fontSize: "1rem",
                            padding: "8.8px",
                            width: "80%",
                            height: "6vh",
                            borderRadius: "8px",
                            marginTop: "5px",
                            border: '1px solid #DEDEDE',
                        }}
                        disabled={true}
                        name="schoolName"
                        type="text"
                        placeholder="School Name"
                        value={schoolCode}
                    />
                </Grid>
                <Grid xs={1.5} sx={{ marginTop: "20px", display: "grid", alignItems: "center" }}>{"Implementation ID"}</Grid>
                <Grid xs={4} sx={{ marginTop: "20px" }}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={impFormID}
                        getOptionLabel={(option) => option}
                        onChange={(e, value) => {
                            setFilterData({ ...filterData, impFormCode: value || "" })
                        }}
                        value={filterData?.impFormCode || ""}
                        sx={{
                            fontSize: "1rem",
                            padding: "8.8px",
                            width: "80%",
                            borderRadius: "4px",

                        }}
                        // renderOption={renderClassOption}
                        // disabled={checkDisable(obj, 'class')}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Select"
                            // required={!checkDisable(obj, 'class')}
                            />
                        )}
                    />
                </Grid>
            </Grid>
            <Grid xs={12} sx={{ marginTop: "20px", padding: "0 20px" }}>
                <Button sx={{
                    backgroundColor: "#f45e29",
                    border: "1px solid #f45e29",
                    borderRadius: "4px !important",
                    color: "#ffffff !important",
                    padding: "6px 16px !important",
                    "&:hover": {
                        color: "#f45e29 !important",
                    },
                }}
                    onClick={() => {
                        let searchData = {
                            product: filterData?.product?.groupkey || "",
                            schoolName: schoolName || "",
                            schoolCode: schoolCode || "",
                            impFormCode: filterData?.impFormCode || ""
                        }
                        setSearchFilterData(searchData)
                    }}
                >{"Filter"}</Button>
            </Grid>
            {
                activatedSchoolList?.length > 0 ? <TableContainer component={Paper} sx={styles.tableContainer}>
                    <Table aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                {heading.map((col, index) => (
                                    <TableCell
                                        align="left"
                                        key={index}
                                        sx={{ ...styles.tableCell, padding: "16px" }}
                                    >
                                        {col}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow sx={{ borderTop: "1px solid grey", "& td": styles.tableCell }}>
                                {
                                    activatedSchoolList?.map((row, index) => {
                                        return (
                                            <>
                                                <TableCell align="left">
                                                    <Box sx={styles.productSec}>
                                                        {index + 1}
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Box sx={styles.productSec}>
                                                        {row.schoolName}
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Box sx={styles.productSec}>
                                                        {row.schoolCode}
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Box sx={styles.productSec}>
                                                        {row.implementation_form_id}
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Box sx={styles.productSec}>
                                                        {row?.product_details[0]?.product_name || "NA"}
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Box sx={styles.productSec}>
                                                        {row?.updatedAt || "NA"}
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="left" >
                                                    <Box sx={{ display: "flex", width: "70%", justifyContent: "space-between" }}>
                                                        <EditIcon sx={{ cursor: "pointer" }} onClick={() => {
                                                            navigate("/authorised/edit-activated-imp", {
                                                                state: { impFormNumber: row.impFormNumber },
                                                            });
                                                        }} />
                                                        <PauseCircleFilledIcon />
                                                        <ClearIcon />
                                                    </Box>
                                                </TableCell>
                                            </>
                                        )
                                    })
                                }
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer> : <Typography sx={{ fontSize: "20px", fontWeight: "600", textAlign: "center", margin: "50px 0" }}> {'NO DATA FOUND'}</Typography>
            }


        </Page>
    )
}

export default ActivatedImpList