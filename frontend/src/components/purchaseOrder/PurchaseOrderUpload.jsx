import {
    Box,
    Button,
    Grid,
    Typography,
    TextField,
    CircularProgress
} from "@mui/material";
import { useEffect, useState } from "react";
import {
    Link,
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";
import { getProductSalePriceSum, getQuotationDetails, getQuotationWithoutPO } from "../../config/services/quotationCRM";
import { createPurchaseOrder, receivingBankDetails, uploadPurchaseOrderFile } from "../../config/services/purchaseOrder";
import toast from "react-hot-toast";
import Page from "../Page";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { CurrenncyFormat, CurrenncyFormatter } from "../../utils/utils";

const PurchaseOrderUpload = ({ }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const quotationData = location.state?.quotationData;
    const [quoteValue, setQuoteValue] = useState();
    const [poAmount, setPOAmount] = useState();
    const [fileName, setFileName] = useState('Select attach file');
    const [pdfFile, setPdfFile] = useState('');
    const [loader1, setLoader1] = useState(false);
    const [uploadUrl, setUploadUrl] = useState([]);

    useEffect(() => {
        if (quotationData != null) {
            //getDropDownValues()
            //getBankDetails()
            //getDetailsMode()
            fetchProductSalePriceSum()
        }
    }, [quotationData])

    const fetchProductSalePriceSum = () => {
        let quotationId = quotationData?.quotationCode
        getProductSalePriceSum(quotationId)
            .then(res => {
                let data = res?.result
                setQuoteValue(data?.productItemSalePriceSum)
                //setContractValue(data?.productItemSalePriceSum)
                //setTenure(data?.maxProductItemDuration)
                //setHardwareCategoryPrice(data?.Hardware)
                //setSoftwareCategoryPrice(data?.Software)
            })
            .catch(err => {
                console.error(err, "Error while fetching getProductSum")
            })
    }


    function uploadPdf(e) {
        const fileName = e.target.files[0].name
        const fileExtension = fileName.replace(/^.*\./, "")
        const file = e.target?.files?.[0]

        if (fileExtension === 'pdf') {
            setPdfFile(e.target?.files?.[0]);
            setFileName(fileName)
            const formData = new FormData();
            formData.append("image", file);
            onFileUpload(formData)
        }
        else {
            toast.error('File format not supported')
            setFileName('')
            return false
        }
    }


    const onFileUpload = async (data) => {
        try {
            setLoader1(true)
            const response = await uploadPurchaseOrderFile(data);
            if (response?.result) {
                const fileUrl = response?.result;
                setUploadUrl(fileUrl)
                setLoader1(false)
                toast.success(response?.message)
            }
        } catch (error) {
            console.error(error);
            setLoader1(false)
            toast.error('Something went wrong')
        }
    };

    const emptyPdfFile = () => {
        setPdfFile();
        setFileName('Select attach file')
        setUploadUrl('')
    }

    const handlePOAmount = (e) => {
        let { value } = e.target
        setPOAmount(value)
    }

    const handleSubmit = () => {
        if (!poAmount) {
            toast.dismiss()
            toast.error('Enter PO Amount!')
            return
        }

        if (poAmount < 0) {
            toast.dismiss()
            toast.error('Enter Valid PO Amount!')
            return
        }

        if (uploadUrl?.length == 0) {
            toast.dismiss()
            toast.error('Select File')
            return
        }

        if (quoteValue != poAmount) {
            getEditQuotation()
            return;
        } else {
            getViewQuotation()
            return;
        }


    }

    const getEditQuotation = () => {
        navigate("/authorised/edit-quotation", {
            state: {
                schoolCode: quotationData?.schoolData?.schoolCode,
                quotationCode: quotationData?.quotationCode,
            },
        });
    }

    const getViewQuotation = () => {
        navigate(`/authorised/quotation-detail/${quotationData?.quotationCode}`, {
            state: {
                isQuotaion: true,
                isQuoteSchoolDetail: true,
                modal3Status: true,
                page1Details: { poAmount, uploadUrl, quoteValue }
            },
        });
    }


    return (

        <Page title="Upload PO | Extramarks" className="crm-page-wrapper" >
            <Box className="crm-contract-upload-po-wrapper">

                <Box className="crm-contract-upload-po-header">
                    <Box>
                        <Typography component={"h2"}> Upload File </Typography>
                    </Box>
                    <Box className="">
                        <Typography component={"p"}>Last Quote Value :  <span>₹{CurrenncyFormat(quoteValue, 0, false)}/-</span> </Typography>
                    </Box>
                </Box>

                <Grid container >
                    <Grid item xs={12} sm={6} md={4}>
                        <Box className="crm-contract-upload-po-formitem">
                            <label>PO Amount <span style={{ color: 'red' }}> *</span></label>
                            <TextField
                                autoComplete="off"
                                className="crm-form-input medium-dark"
                                placeholder="Enter here"
                                variant="outlined"
                                value={poAmount}
                                type="number"
                                onChange={(e) => handlePOAmount(e)}
                                onWheel={e => e.target.blur()}
                            />
                        </Box>
                    </Grid>
                </Grid>
                <Grid container >
                    <Grid item xs={12} sm={6} md={4}>
                        <Box className="crm-contract-upload-po-formitem">
                            <label >Upload file <span style={{ color: 'red' }}> *</span></label>
                            <div className={''} >
                                {!pdfFile ?
                                    <div className='crm-contract-upload-po-formitem-file' id="outlined-basic">
                                        <input
                                            style={{ display: 'none' }}
                                            id="lecture_note"
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => uploadPdf(e)}
                                        />
                                        <label className={'crm-contract-upload-po-formitem-file-label'}>{fileName}</label>
                                        <label className='' htmlFor="lecture_note">Browse</label>
                                    </div>
                                    :
                                    <Box className="crm-contract-upload-po-formitem-file-details">
                                        <label className={'crm-contract-upload-po-formitem-file-label'}>{fileName}</label>
                                        <Button className='crm-contract-upload-po-formitem-file-remove'
                                            onClick={emptyPdfFile}
                                        >
                                            {loader1 ?
                                                <CircularProgress style={{ width: '23px', height: '23px' }} /> :
                                                "X"
                                            }
                                        </Button>
                                    </Box>

                                }
                                {!pdfFile &&
                                    <span style={{
                                        fontSize: "12px",
                                        color: "#85888A",
                                        display: "block",
                                        marginTop: "5px"
                                    }} >Note: File must be in PDF format</span>
                                }

                            </div>
                        </Box>
                    </Grid>
                </Grid>


                <div style={{ display: "flex", float: "right", marginTop: "45px" }}>
                    <Button
                        onClick={() => { navigate(-1); }}
                        className={'crm-btn crm-btn-outline mr-1 crm-btn-lg'}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className={'crm-btn  crm-btn-lg'}
                    >
                        Save
                    </Button>

                </div>

            </Box>


        </Page>

    )
}


export default PurchaseOrderUpload;