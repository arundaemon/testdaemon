
import { Box, Grid, Modal, Button } from "@mui/material";
import React from "react";
import { useEffect, useState, useRef } from "react";
import { POModalStyle, useStyles } from "../../css/SchoolDetail-css";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { getschoolLedgerDetails } from "../../config/services/packageBundle";
import { SchoolInvoiceDetail } from "./schoolInvoiceDetail";
import { savePDF } from "../../modifiedlibraries/pdfExport/react-to-pdf-converter";
import { DisplayLoader } from "../../helper/Loader";
import { CSVLink } from 'react-csv';
import CubeDataset from "../../config/interface";
import { saveAs } from "file-saver";
import * as XLSX from 'xlsx';




const LedgerViewModal = ({ ledgerDetails }) => {
    const containerRef = useRef(null);
    const classes = useStyles();
    const loginData = getUserData("loginData");
    const uuid = loginData?.uuid;
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false)


    const getLedgerDetails = async () => {
        let params = {
            uuid,
            school_code: ledgerDetails?.[CubeDataset?.Ledger.schoolCode],
            product_code: [],
        };
        setLoading(true)
        await getschoolLedgerDetails(params)
            .then((res) => {
                if (res?.data) {
                    let data = res?.data;
                    setList(data);
                    setLoading(false)
                }
            })
            .catch((err) => {
                setLoading(false);
                console.error(err, "Error while fetching Pending Tasks");
            });
    };


    useEffect(() => {
        if (ledgerDetails?.[CubeDataset?.Ledger.schoolCode]) getLedgerDetails();
    }, [ledgerDetails]);

    const handlePrint = () => {
        window.print();
    };

    const downloadLedgerHandler = () => {
        let quoteName = new Date().toLocaleTimeString().split(":").join("");
        let element = containerRef.current;
        savePDF(
            element,
            {
                paperSize: "auto",
                margin: 40,
                fileName: `Ledger${quoteName}`,
            },
            () => {
                window.close();
            }
        );
    };

    const exportToExcel = () => {
        const excelData = {
            invoiceDetails: list?.school_ledger_details[0]?.ledger_voucher_details,
        };
        const ws = XLSX.utils.json_to_sheet(excelData.invoiceDetails);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Invoice Details');
        XLSX.writeFile(wb, 'exported_data.xlsx');
    };



    return (
        <div>
            <Modal
                open={true}
                hideBackdrop={true}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="targetModal1 crm-contract-license-modal"

            >
                <>
                    <Box
                        className="modalContainer"
                        sx={{
                            ...POModalStyle,
                            borderRadius: "8px",
                            width: "min-content",
                            width: '90%',
                            overflow: 'auto',
                            height: '90%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center', // Center the items horizontally
                            justifyContent: 'flex-start',
                        }}
                    >
                        {!loading ?
                            <>
                                <div style={{ display: "flex", justifyContent: 'center', margin: "auto", marginTop: "30px", marginRight: "0px" }}>
                                    <Button
                                        onClick={handlePrint}
                                        className="crm-btn crm-btn-outline crm-btn-small mr-1"
                                    >
                                        Print
                                    </Button>
                                    <Button
                                        className="crm-btn crm-btn-outline crm-btn-small mr-1"
                                        onClick={() => downloadLedgerHandler()}
                                    >
                                        Download Pdf
                                    </Button>
                                    <Button
                                        className="crm-btn crm-btn-outline crm-btn-small"
                                        onClick={exportToExcel}                                        
                                    >
                                        Export Excel
                                    </Button>
                                </div>

                                <div ref={containerRef} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center', // Center the items horizontally
                                    justifyContent: 'flex-start',
                                }}>
                                    <Grid item xs={8} sx={{ padding: '16px', }}>
                                        <b>{list?.company_name + ' FY ' + list?.ledger_start_date + ' To ' + list?.ledger_end_date}</b>
                                    </Grid>

                                    <Grid item xs={8} sx={{ padding: '0 16px', }}>
                                        <p>D-180 Lower ground Floor,</p>
                                        <p style={{ textAlign: "center" }}>Sector 63,</p>
                                        <p style={{ textAlign: "center", textDecoration: "underline" }}>Noida</p>

                                    </Grid>

                                    <Grid item xs={8} sx={{ padding: '16px', }}>
                                        {/* <b>{ledgerDetails?.[CubeDataset?.Ledger.schoolCode]}</b> */}
                                        <b>{ledgerDetails?.[CubeDataset?.Ledger.schoolName]}</b>
                                    </Grid>

                                    <Grid item xs={8} sx={{ padding: '0 16px', }}>
                                        <p>Ledger Account</p>
                                    </Grid>

                                    <Grid item xs={8} sx={{ padding: '0 16px', }}>
                                        <p>{ledgerDetails?.[CubeDataset?.Ledger.address] + ' - Pincode - ' + ledgerDetails?.[CubeDataset?.Ledger.pinCode]} </p>
                                    </Grid>

                                    <Grid item xs={8} sx={{ padding: '16px 16px 36px 16px', }}>
                                        <p>{list?.ledger_start_date + ' To ' + list?.ledger_end_date}</p>

                                    </Grid>

                                    <SchoolInvoiceDetail
                                        data={list}
                                    />

                                </div>

                                <div style={{ display: "flex", justifyContent: 'center', margin: "auto", marginTop: "30px", marginRight: "0px" }}>
                                    <Button
                                        onClick={handlePrint}
                                        className="crm-btn crm-btn-outline crm-btn-small mr-1"
                                    >
                                        Print
                                    </Button>
                                    <Button
                                        className="crm-btn crm-btn-outline crm-btn-small mr-1"
                                        onClick={() => downloadLedgerHandler()}
                                    >
                                        Download Pdf
                                    </Button>
                                    <Button
                                        className="crm-btn crm-btn-outline crm-btn-small"
                                        onClick={exportToExcel}
                                    >
                                        Export Excel
                                    </Button>
                                </div>


                            </>
                            :
                            <div className={classes.loader}>
                                {DisplayLoader()}
                            </div>
                        }
                    </Box>
                </>
            </Modal>


        </div>
    )
}

export default LedgerViewModal
