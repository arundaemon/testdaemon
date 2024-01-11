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
    TablePagination,
} from '@mui/material'
import { DecryptData } from '../../utils/encryptDecrypt'
import { fetchImplementationList } from '../../config/services/implementationForm'
import { getLoggedInRole } from '../../utils/utils'
import { getAllProductList } from '../../config/services/packageBundle'
import { getUserData } from '../../helper/randomFunction/localStorage'
import { getSchoolBySchoolCode, getSchoolCodeList } from '../../config/services/school'
import { useStyles } from '../../css/ClaimForm-css'
import EditIcon from '@mui/icons-material/Edit';
import PauseIcon from '@mui/icons-material/Pause';
import ClearIcon from '@mui/icons-material/Clear';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNavigate } from 'react-router-dom';
import { activatedPackageDetails, listActivatedSchool } from '../../config/services/activatedPackage'
import { DisplayLoader } from '../../helper/Loader'



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
        marginTop: "30px",
        borderRadius: "8px",
        // boxShadow: "0px 3px 6px #00000029",
        // paddingBottom: "20px",
    },
    loader: {
        height: "50vh",
        width: "90vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
}

const heading = ["Sr. No.", "School Name", "School Code", "Implementation ID", "Product Name", "Last Updated On", "Action"]

const ActivatedSchoolTable = () => {
    const navigate = useNavigate();
    const classes = useStyles();

    const [pageNo, setPagination] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [lastPage, setLastPage] = useState();


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
        product_code: [],
        schoolName: "",
        school_code: "",
        implementation_form_id: []
    })

    const [searchFilterData, setSearchFilterData] = useState(null)
    const [activatedData, setActivatedData] = useState(null)
    const [schoolData, setSchoolData] = useState(null)

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

    const handlePagination = (e, pageNumber) => {
        setPagination(pageNumber);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPagination(1);
        setItemsPerPage(event.target.value);
    };

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
                setImpFormID(impArr)
            }

        } catch (err) {
            console.error(err)
        }
        // setLoading(false)
    }

    const pausedProduct = async (impFormNumber, schoolCode) => {
        let activatedPackageParams = {
            uuid: uuid,
            school_code: schoolCode,
            implementation_form_id: impFormNumber
        }

        let activatedPackage = await activatedPackageDetails(activatedPackageParams)

        activatedPackage = activatedPackage?.data?.activated_package_details

        let package_activation_status = 1

        for (let i = 0; i < activatedPackage.length; i++) {
            let packageData = activatedPackage[i].product_package_details
            for (let j = 0; j < packageData.length; j++) {
                if (packageData[j].activation_status === 1) {
                    package_activation_status = 0
                    break;
                }
            }
        }
        return package_activation_status


    }

    const deletedProduct = async (impFormNumber, schoolCode) => {

        let activatedPackageParams = {
            uuid: uuid,
            school_code: schoolCode,
            implementation_form_id: impFormNumber
        }

        let activatedPackage = await activatedPackageDetails(activatedPackageParams)

        activatedPackage = activatedPackage?.data?.activated_package_details

        let package_activation_status = 2

        for (let i = 0; i < activatedPackage.length; i++) {
            let packageData = activatedPackage[i].product_package_details
            for (let j = 0; j < packageData.length; j++) {
                if (packageData[j].activation_status == 1 || packageData[j].activation_status == 0) {
                    package_activation_status = 0
                    break;
                }
            }
        }
        return package_activation_status
    }

    const getSchoolCode = (data) => {
        setSchoolList([])
        setSchoolCode(data?.schoolCode)
        setSchoolName(data?.schoolName)
        searchHandler('school', data, data?.schoolCode)
        // setLoading(false)
    }

    useEffect(async () => {
        setLoading(true)
        await getProductList()
        await getAllImpList()
        let activatedParams = {
            uuid: uuid,
            page_offset: pageNo - 1,
            page_size: itemsPerPage,
            product_code: searchFilterData?.product_code || [],
            school_code: searchFilterData?.school_code || "",
            implementation_form_id: searchFilterData?.implementation_form_id || [],
            order: "ASC",
        }
        setLastPage(false);
        let activatedList = await listActivatedSchool(activatedParams)
        activatedList = activatedList?.data
        let activatedSchoolData = []
        if (activatedList.status == 1) {
            let list = activatedList.activated_school_details
            for (let i = 0; i < list.length; i++) {
                let school = await getSchoolBySchoolCode(list[i]?.school_code)
                school = school?.result
                activatedSchoolData.push({ ...school, ...list[i] })
                // if (list[i]?.school_code !== "EM46105") {
                //     let deleted_package_activation_status = await deletedProduct(list[i]?.implementation_form_id, list[i]?.school_code)

                //     if (deleted_package_activation_status != 2) {
                //         let package_activation_status = await pausedProduct(list[i]?.implementation_form_id, list[i]?.school_code)
                //     }

                // }
            }
        }
        setActivatedSchoolList(activatedSchoolData)
        if (activatedList?.activated_school_details?.length < itemsPerPage) setLastPage(true)
        setLoading(false)
    }, [pageNo, rowsPerPage, searchFilterData])

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
        // setLoading(false)
    }

    useEffect(() => {
        const getData = setTimeout(() => {
            if (search) {
                getAllSchList()
            }
        }, 500)
        return () => clearTimeout(getData)
    }, [search]);

    let product_ID = []
    let impId = []
    let schoolCodeId = ""

    const searchHandler = (type, value) => {

        if (type === 'product') {
            if (value?.length) {
                value?.map((obj) => {
                    product_ID.push(obj.productCode)
                })
                // setFilterData({ ...filterData, product_code: product_ID })
            } else {
                product_ID = []
                setFilterData({ ...filterData, product_code: [] })
            }
        }
        if (type === 'implementation') {
            if (value?.length) {
                value?.map((obj) => {
                    impId.push(obj)
                })
                setFilterData({ ...filterData, implementation_form_id: impId })
            } else {
                impId = []
                setFilterData({ ...filterData, implementation_form_id: [] })
            }

        }
        if (type === 'school') {
            schoolCodeId = value?.schoolCode
            setFilterData({ ...filterData, school_code: value?.schoolCode, schoolName: value?.schoolName })
        }

        // filterData?.product_code?.map((obj) => {
        //     if (!product_ID.includes(obj.productCode)) {
        //         product_ID.push(obj.productCode)
        //     }
        // })

        // filterData?.implementation_form_id?.map((obj) => {
        //     if (!impId.includes(obj)) {
        //         impId.push(obj)
        //     }
        // })

        let searchData = {
            product_code: product_ID,
            school_code: schoolCodeId != "" ? schoolCodeId : filterData?.school_code,
            implementation_form_id: impId
        }
        setSearchFilterData(searchData)
    }


    return (
        <Page
            title="Extramarks | Quotation Table"
            className="main-container myLeadPage datasets_container"
        >
            <Box sx={{ margin: "20px", borderRadius: "8px", boxShadow: "0px 0px 8px #00000029", padding: "16px" }}>
                <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>{"Manage Activated school View"}</Typography>
                <Grid container sx={{ marginTop: "30px" }} >
                    {/* <Grid xs={1} sx={{ display: "grid", alignItems: "center" }}></Grid> */}
                    <Grid xs={4}>
                        <Box sx={{ fontWeight: "600", fontSize: "18px", color: "#85888A" }}>{"Product"}</Box>
                        <Box>
                            <Autocomplete
                                disablePortal
                                multiple
                                id="combo-box-demo"
                                options={productList}
                                getOptionLabel={(option) => option.label}
                                onChange={(e, value) => {
                                    setFilterData({ ...filterData, product_code: value || "" })
                                    searchHandler("product", value)
                                }}
                                value={filterData?.product_code || ""}
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
                    </Grid>
                    {/* <Grid xs={1} sx={{ display: "grid", alignItems: "center" }}>{"School Name"}</Grid> */}

                    <Grid xs={4} sx={{ display: "grid", alignItems: "center" }}>
                        <Box sx={{ fontWeight: "600", fontSize: "18px", color: "#85888A" }}>{'School Name'}</Box>
                        <Box>

                            <input
                                style={{
                                    fontSize: "1rem",
                                    padding: "8.8px",
                                    width: "80%",
                                    height: "45px",
                                    borderRadius: "2px",
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
                                width: "23%",
                                padding: "10px 20px",
                                zIndex: "9999",
                                // [theme.breakpoints.down('md')]: {
                                // width: "80%",
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
                        </Box>

                    </Grid>


                    {/* <Grid xs={1} sx={{ display: "grid", alignItems: "center" }}>{"School Code"}</Grid> */}
                    <Grid xs={4} sx={{ display: "grid", alignItems: "center" }}>
                        <Box sx={{ fontWeight: "600", fontSize: "18px", color: "#85888A" }}>{'School Code'}</Box>
                        <Box>
                            <input
                                style={{
                                    fontSize: "1rem",
                                    padding: "8.8px",
                                    width: "80%",
                                    height: "45px",
                                    borderRadius: "2px",
                                    marginTop: "5px",
                                    border: '1px solid #DEDEDE',
                                }}
                                disabled={true}
                                name="schoolName"
                                type="text"
                                placeholder="School Code"
                                value={schoolCode}
                            // onChange={() => {
                            //     console.log(schoolCode,"+++++++++++")
                            //     if (schoolCode) {
                            //         searchHandler('school', schoolCode)
                            //     }
                            // }}
                            />
                        </Box>
                    </Grid>

                    {/* <Grid xs={1.5} sx={{ marginTop: "20px", display: "grid", alignItems: "center" }}>{"Implementation ID"}</Grid> */}
                    <Grid xs={4} sx={{ marginTop: "20px" }}>
                        <Box sx={{ fontWeight: "600", fontSize: "18px", color: "#85888A" }}>{'Implementation ID'}</Box>
                        <Box>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                multiple
                                options={impFormID}
                                getOptionLabel={(option) => option}
                                onChange={(e, value) => {
                                    setFilterData({ ...filterData, implementation_form_id: value || "" })
                                    searchHandler("implementation", value)

                                }}
                                value={filterData?.implementation_form_id || ""}
                                sx={{
                                    fontSize: "1rem",
                                    padding: "8.8px 0",
                                    width: "90%",
                                    "& input": { height: "10px" }
                                }}
                                // renderOption={renderClassOption}
                                // disabled={checkDisable(obj, 'class')}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        sx={{ "& fieldset": { borderRadius: "2px" } }}
                                        placeholder="Select"
                                    // required={!checkDisable(obj, 'class')}
                                    />
                                )}
                            />

                        </Box>
                    </Grid>
                </Grid>
                {/* <Grid xs={12} sx={{ marginTop: "20px", padding: "0 20px" }}>
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
                            let product_ID = []
                            filterData?.product_code?.map((obj) => {
                                if (!product_ID.includes(obj.productCode)) {
                                    product_ID.push(obj.productCode)
                                }
                            })
                            let searchData = {
                                product_code: product_ID,
                                school_code: schoolCode || "",
                                implementation_form_id: filterData?.implementation_form_id
                            }
                            setSearchFilterData(searchData)
                        }}
                    >{"Filter"}</Button>
                </Grid> */}
                {
                    (!loading ? (activatedSchoolList?.length > 0 ?
                        <TableContainer component={Paper} sx={{ ...styles.tableContainer }}>
                            <Table aria-label="customized table">
                                <TableHead>
                                    <TableRow sx={{ borderTop: "1px solid #DEDEDE", "& td": styles.tableCell }}>
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
                                    {/* <TableRow sx={{ borderTop: "1px solid grey", "& td": styles.tableCell }}> */}
                                    {
                                        activatedSchoolList?.map((row, index) => {
                                            return (
                                                <TableRow sx={{ borderTop: "1px solid #DEDEDE", "& td": styles.tableCell }} key={index}>
                                                    <TableCell align="left">
                                                        <Box sx={styles.productSec}>
                                                            {index + 1}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Box sx={styles.productSec}>
                                                            {row?.schoolName}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Box sx={styles.productSec}>
                                                            {row?.school_code}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Box sx={styles.productSec}>
                                                            {row?.implementation_form_id}
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
                                                            <Box sx={{ cursor: "pointer", color: "#4482FB", fontWeight: 700, fontSize: "16px", textDecoration: "underline" }} onClick={() => {
                                                                navigate("/authorised/edit-activated-school", {
                                                                    state: { impFormNumber: row?.implementation_form_id, schoolCode: row?.school_code, subscribe: "edit" },
                                                                });
                                                            }}>{"Edit"}</Box>


                                                            {/* {
                                                                row?.package_activation_status == 0 ?
                                                                    <Box sx={{ cursor: "pointer", color: "#4482FB", fontWeight: 700, fontSize: "16px", textDecoration: "underline", margin: "0 10px" }} onClick={() => {
                                                                        navigate("/authorised/edit-activated-school", {
                                                                            state: { impFormNumber: row?.implementation_form_id, schoolCode: row?.school_code, subscribe: "pause" },
                                                                        });
                                                                    }}>{"Pause"}</Box>
                                                                    :
                                                                    <Box sx={{ cursor: "pointer", color: "#4482FB", fontWeight: 700, fontSize: "16px", textDecoration: "underline", margin: "0 10px" }} onClick={() => {
                                                                        navigate("/authorised/edit-activated-school", {
                                                                            state: { impFormNumber: row?.implementation_form_id, schoolCode: row?.school_code, subscribe: "play" },
                                                                        });
                                                                    }}>{"Play"}</Box>
                                                            } */}

                                                            <Box sx={{ cursor: "pointer", color: "#4482FB", fontWeight: 700, fontSize: "16px", textDecoration: "underline", marginLeft: "20px" }} onClick={() => {
                                                                navigate("/authorised/edit-activated-school", {
                                                                    state: { impFormNumber: row?.implementation_form_id, schoolCode: row?.school_code, subscribe: "manage" },
                                                                });
                                                            }}>{"Manage"}</Box>

                                                            {/* <ClearIcon sx={{ width: "30px", height: "30px", padding: "4px", cursor: "pointer", color: "white", border: "1px solid red", borderRadius: "50%", backgroundColor: "#f45e29" }} onClick={() => {
                                                            navigate("/authorised/edit-activated-school", {
                                                                state: { impFormNumber: row?.implementation_form_id, schoolCode: row?.school_code, subscribe: "delete" },
                                                            });
                                                        }} /> */}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                    {/* </TableRow> */}
                                </TableBody>
                            </Table>
                        </TableContainer> :
                        <Typography sx={{ fontSize: "20px", fontWeight: "600", textAlign: "center", margin: "50px 0" }}> {'NO DATA FOUND'}</Typography>
                    ) : <div style={styles.loader}>
                        {DisplayLoader()}
                    </div>
                    )
                }
            </Box>
            <div className="center cm_pagination">
                <TablePagination
                    component="div"
                    page={pageNo}
                    onPageChange={handlePagination}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[10, 50, 100, 500, 1000]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelDisplayedRows={({ page }) => {
                        return `Page: ${page}`;
                    }}
                    backIconButtonProps={{
                        disabled: pageNo === 1,
                    }}
                    nextIconButtonProps={{
                        disabled: lastPage,
                    }}
                />
            </div>
        </Page>
    )
}

export default ActivatedSchoolTable