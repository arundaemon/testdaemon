import React, { useEffect, useState, Fragment } from 'react'
import Page from "../../components/Page";
import ImplementationDetailPage from './ImplementationDetailPage';
import { getImplementationById, updateHardwareDetails } from '../../config/services/implementationForm';
import {
    Box,
    Divider,
    Grid,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    TableCell,
    TextField,
    Button
} from '@mui/material';
import { handleNumberKeyDown, handlePaste } from '../../helper/randomFunction';
import { toast } from "react-hot-toast";
import { getUserData } from '../../helper/randomFunction/localStorage';
import { updatePurchaseOrderStatus } from '../../config/services/purchaseOrder';

const styles = {
    tableContainer: {
        margin: "30px auto",
        borderRadius: "2px",
        boxShadow: "0px 3px 6px #00000029",
        paddingBottom: "20px",
    },
    dividerLine: {
        borderWidth: "1.4px",
        borderColor: "grey",
        width: "98%",
        margin: "20px 5px 20px 16px",
    },
    tableCell: {
        padding: "8px 0px 8px 16px !important",
        border: "none",
    },
    typo: {
        padding: "10px 16px",
        fontWeight: "700",
        fontSize: "18px",
        // textDecoration: "underline",
        backgroundColor: "#f45e29",
        color: "white"
    },
    dateSec: {
        borderRadius: "2px !important",
        boxShadow: "0px 3px 6px #00000029",
        paddingBottom: "50px",
        marginTop: "50px",
    },
    spocSec: {
        borderRadius: "2px !important",
        boxShadow: "0px 3px 6px #00000029",
        paddingBottom: "50px",
    },
    btnSec: {
        marginTop: "20px",
        textAlign: "center",
        marginBottom:"50px"
    },
    btn: { width: "150px", marginRight: "50px" },
};

const HardwareConstant = [
    {
        productKey: '',
        productName: 'Hardware Details',
        productDataList: [],
        productTable: [
            { field: "productItemName", isEditable: false, value: '', label: "Product Details" },
            { field: 'productType', isEditable: false, value: '', label: "Product Type" },
            { field: 'productItemQuantity', isEditable: false, value: '', label: "Total Units" },
            { field: 'implementedUnit', isEditable: true, type: 'number', value: '', label: "Units to be Implemented" },
        ]
    }
]
const EditImplementation = ({ impFormNumber }) => {
    let impFormCode = "IMP-PO011-010"

    const [impData, setImpData] = useState(null)
    const [hardwareDetails, setHardwareDetails] = useState([])

    let purchaseOrderCode = ""
    const getImplementationDetail = async (code) => {
        await getImplementationById(code)
            .then((res) => {
                setImpData(res?.result[0])
                purchaseOrderCode = res?.result[0].purchaseOrderCode
                let newProductArr = res?.result[0].hardwareDetails?.map((obj) => {
                    obj.prevImplementedUnit = obj.implementedUnit
                    return obj
                })
                HardwareConstant[0].productDataList = newProductArr
                setHardwareDetails(HardwareConstant)
            })
            .catch((e) => console.log(e));
    };

    const updatePurchaseOrderStatus = async () => {
        let updatePOData = {
            referenceCode: purchaseOrderCode,
            modifiedByName: getUserData("userData")?.name,
            modifiedByRoleName: getUserData("userData")?.crm_role,
            modifiedByProfileName: getUserData("userData")?.crm_profile,
            modifiedByEmpCode: getUserData("userData")?.employee_code,
            modifiedByUuid: getUserData("loginData")?.uuid,
            status: "Partially Implemented"
        }
        console.log(updatePOData)
        // await updatePurchaseOrderStatus(updatePOData).then((res) => console.log("Success")).catch((e) => console.log(e))

    }

    useEffect(async () => {
        await getImplementationDetail(impFormCode)
        await updatePurchaseOrderStatus()
    }, [])

    const handleImplementedUnit = (e, row, fieldName) => {
        let newArr = hardwareDetails.map((product) => {
            product?.productDataList?.map((obj) => {
                if (row.hardwareId === obj.hardwareId) {
                    if (Number(e.target.value) >= Number(obj.prevImplementedUnit)) {
                        toast.error(`Implemented Unit must be less than ${Number(obj?.prevImplementedUnit)}`);
                        return;
                    }
                    else {
                        obj[fieldName] = e.target.value;
                    }
                    return obj
                }
                return obj
            })
            return product
        })
        setHardwareDetails(newArr);
    };

    const submitHandler = async () => {
        let productDataListArr = hardwareDetails[0].productDataList
        let isSubmitted = false

        for (let i = 0; i < productDataListArr.length; i++) {
            if (Number(productDataListArr[i].prevImplementedUnit) !== Number(productDataListArr[i].implementedUnit)) {
                isSubmitted = true
            }
        }

        if (isSubmitted) {
            productDataListArr?.forEach((obj) => {
                obj.implementedUnit = Number(obj.implementedUnit)
                delete obj.prevImplementedUnit
                return obj
            })

            let updatedHardwareData = {
                impFormNumber: impFormCode,
                hardwareDetails: productDataListArr,
                modifiedByName: getUserData("userData")?.name,
                modifiedByRoleName: getUserData("userData")?.crm_role,
                modifiedByProfileName: getUserData("userData")?.crm_profile,
                modifiedByEmpCode: getUserData("userData")?.employee_code,
                modifiedByUuid: getUserData("loginData")?.uuid,
            }
            await updateHardwareDetails(updatedHardwareData)
        } else {
            toast.error("Please Edit the hardware details before submitting")
        }
    }

    return (
        <Page
            title="Extramarks | Quotation Table"
            className="main-container myLeadPage datasets_container"
        >
            <ImplementationDetailPage impFormCode={impFormCode} impData={impData} />

            <Box sx={{ padding: "0px 30px" }}>
                {hardwareDetails?.map((table) => {
                    return (
                        table?.productDataList?.length > 0 &&
                        <TableContainer component={Paper} sx={styles.tableContainer}>
                            <Typography
                                sx={{
                                    ...styles.typo,
                                    borderRadius: "2px 2px 0 0 !important",
                                }}
                            >{table.productName}</Typography>
                            <Table aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        {table.productTable.map((col, index) => (
                                            <TableCell
                                                align="left"
                                                key={index}
                                                sx={{ ...styles.tableCell, padding: "16px" }}
                                            >
                                                {col.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        table.productDataList.map((obj, index) => {
                                            return (
                                                <TableRow key={index}
                                                    sx={{
                                                        borderTop: "1px solid grey",
                                                        "& td": styles.tableCell,
                                                    }}
                                                >
                                                    {
                                                        table.productTable.map((row, indexNum) => {
                                                            return (
                                                                <Fragment key={`${index}` + `${indexNum}`}>
                                                                    {!row.isEditable ?
                                                                        <TableCell align="left">
                                                                            <Box sx={styles.productSec}>
                                                                                {obj[row['field']] ? obj[row['field']] : 0}
                                                                            </Box>
                                                                        </TableCell> :
                                                                        <TableCell>
                                                                            <TextField
                                                                                value={obj[row.field] || ""}
                                                                                // disabled={checkDisable(obj, 'hardware')}
                                                                                onChange={(e) => handleImplementedUnit(e, obj, row.field)}
                                                                                sx={styles.borderShadow}
                                                                                onKeyDown={handleNumberKeyDown}
                                                                                onPaste={handlePaste}
                                                                                autoComplete="off"
                                                                            // required={!checkDisable(obj, 'hardware')}
                                                                            />
                                                                        </TableCell>}

                                                                </Fragment>
                                                            )
                                                        })
                                                    }
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )
                })}
            </Box>

            <Box sx={styles.btnSec}>
                <Button variant="contained" sx={styles.btn} onClick={submitHandler}>{'Submit'}</Button>
                <Button variant="contained" sx={{ width: "150px" }} onClick={() => {
                    console.log("Cancel")
                }}>{'Cancel'}</Button>
            </Box>

        </Page>
    )
}

export default EditImplementation