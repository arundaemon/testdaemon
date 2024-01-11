import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Breadcrumbs, Button, Grid, LinearProgress, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import React, { useEffect, useState } from 'react';
import { toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BredArrow from '../../assets/image/bredArrow.svg';
import { createPackageBundle, listEntityFeatures } from '../../config/services/packageBundle';
import { useStyles } from '../../css/PackageManagement-css';
import { getUserData } from "../../helper/randomFunction/localStorage";
import Page from '../Page';
import ContentInformation from './ContentInformation';
import PackageInformation from './PackageInformation';
import UserType from './TeacherUserType';



const PackageManagement = () => {
    const classes = useStyles();
    const [activeAccordion, setActiveAccordion] = useState(0);
    const [shw_loader, setDisplayLoader] = useState(false)
    const [userTypeInfo, setuserTypeInfo] = useState({})
    const [durationTypeList, setDurationTypeList] = useState([])
    const [packageInformationData, setpackageInformationData] = useState({})
    const [updatePackageInformationData, setUpdatePackageInformationData] = useState({})
    const [packageContentData, setPackageContentData] = useState([])
    const [updatePackageContentData, setUpdatePackageContentData] = useState([])
    const [updateUserType, setUpdateUserType] = useState({})
    const [userTypeList, setuserTypeList] = useState([])
    const [featureList, setFeatureList] = useState([])
    const [newFeatureList, setNewFeatureList] = useState([])
    const [isUpdate, setisUpdate] = useState(false)
    const loginData = getUserData('loginData')
    const uuid = loginData?.uuid
    let userTypeAccordions = [];
    const navigate = useNavigate();
    const location = useLocation()
    const updateData = location.state?.rowData;



    const packageCancelHandler = () => {
        navigate("/authorised/package-list");
    };



    const FormValidation = (formdata) => {
        let { package_information, package_contents, entity_user_type_details } = formdata


        const hasUndefinedFeatureDurationTypeId = entity_user_type_details?.entity_user_types?.some(userType => {
            return userType?.user_type_details.some(detail => detail?.feature_duration_type_id === undefined);
        });


        if (!package_information?.package_name) {
            toast.error('Package Name is Mandatory !')
            return false
        }
        else if (!package_information?.package_hsn_code) {
            toast.error('HSN code is Mandatory !')
            return false
        }
        else if (package_information?.package_channels?.length === 0) {
            toast.error('Package Channels is Mandatory !')
            return false
        }
        else if (!package_information?.package_duration_type_id) {
            toast.error('Package Duration Type is Mandatory !')
            return false
        }
        else if (!package_information?.package_value) {
            toast.error('Package Value is Mandatory !')
            return false
        }

        else if (!package_information?.package_mrp) {
            toast.error('MRP is Mandatory !')
            return false
        }
        else if (!package_information?.package_mop) {
            toast.error('MOP is Mandatory !')
            return false
        }
        else if (parseFloat(package_information?.package_mrp) < parseFloat(package_information?.package_mop)) {
            toast.error('MRP should be greater than MOP !')
            return false
        }
        else if (package_contents?.length === 0) {
            toast.error('Please select & save Board Indicator')
            return false
        }
        else if (entity_user_type_details?.entity_user_types?.length === 0) {
            toast.error('UserType Form is Mandatory')
            return false
        }
        else if (hasUndefinedFeatureDurationTypeId) {
            toast.error('Remove Features that are not required in User Type Form')
            return false
        }
        else {
            return true
        }


    }



    const userTypeData = (data) => {
        setuserTypeInfo(data)
    }

    const durationTypeData = (data) => {
        setDurationTypeList(data)
    }

    const packageData = (data) => {
        setpackageInformationData(data)
    }

    const contentData = (data) => {
        if (data?.length > 0) {
            const outputArray = data?.map(item => {
                const package_content_classes = item?.class_id?.map(classId => ({
                    "class_id": String(classId)
                }));

                return {
                    "board_indicator_id": String(item.board_indicator_id),
                    "board_id": item?.board_id ? String(item.board_id) : "",
                    "package_content_classes": package_content_classes?.length > 0 ? package_content_classes : []
                };
            });
            setPackageContentData(outputArray)
        } else {
            setPackageContentData([])
        }


    }




    const getuserTypeList = (data) => {

        if (data?.length > 0) {
            let obj = {
                user_type_id: data[0]?.userTypeId,
                user_type_details: data.map(({ userTypeId, ...rest }) => rest)
            }
            const existingIndex = userTypeList.findIndex((element) =>
                element.user_type_id === obj.user_type_id
            );

            if (existingIndex !== -1) {
                // If an object with the same user_type_id exists, update it
                setuserTypeList((prevState) => {
                    const newList = [...prevState];
                    newList[existingIndex] = obj;
                    return newList;
                });

            } else {
                // If the object doesn't exist, push it to userTypeList
                setuserTypeList((prevState) => [...prevState, obj]);

            }
        } else {
            setuserTypeList([])
        }
    }


    const getListEntityFeatures = () => {
        let params = {
            uuid: uuid,
            status: [1],
            search_by: {
                entity_id: userTypeInfo?.entity_id,
                user_type_id: userTypeInfo?.user_type_id
            }
        }
        listEntityFeatures(params)
            .then((res) => {
                let id = res?.data?.entity_feature_list?.[0]?.user_type_id
                let list = res?.data?.entity_feature_list?.[0]?.feature_details
                
                
                setNewFeatureList(res?.data?.entity_feature_list)
                if (userTypeInfo?.user_type_id?.includes(id) && list?.length > 0) {
                    setFeatureList(list)
                }

            }).catch(err => console.error(err))

    }

    useEffect(() => {
        if (Object.keys(userTypeInfo).length > 0) {
            getListEntityFeatures()
        }
    }, [userTypeInfo]);

    if (newFeatureList?.length > 0) {
        userTypeAccordions = newFeatureList?.map((obj, index) => ({
            title: `User Type - ${obj?.user_type_name}`,
            detail: <UserType userTypeInfo={userTypeInfo} durationTypeList={durationTypeList} userTypeId={obj?.user_type_id} getuserTypeList={getuserTypeList} updateUserType={updateUserType} featureList={obj?.feature_details} setFeatureList={setFeatureList} />,
        }));
    }


    const accordionData = [
        {
            title: "Information",
            detail: <PackageInformation durationTypeData={durationTypeData} packageData={packageData}
                updatePackageInformationData={updatePackageInformationData}
            />,
        },
        {
            title: "Content",
            detail: <ContentInformation userTypeData={userTypeData} contentData={contentData} updatePackageContentData={updatePackageContentData} updateUserType={updateUserType} isUpdate={isUpdate} />,
        },
        ...userTypeAccordions,
    ];


    const breadcrumbs = [
        <Link
            underline="hover"
            key="1"
            color="inherit"
            to="/authorised/package-list"
            className={classes.breadcrumbsClass}
        >
            Listing
        </Link>,
        <Typography
            key="2"
            color="text.primary"
            fontWeight="600"
            fontSize="14px"
        >
            {isUpdate ? 'Update Package' : 'Create Package'}
        </Typography>,
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isUpdate) {
            var packageId = updateData?.package_information?.package_id
        }
        let status = 1
        const params = {
            uuid: uuid,
            package_information: packageInformationData,
            package_contents: packageContentData?.length > 0 ? packageContentData : [],
            package_status: status.toString(),
            package_id: packageId,
            entity_user_type_details: {
                entity_id: userTypeInfo?.entity_id?.toString(),
                entity_user_types: userTypeList?.length > 0 ? userTypeList : []
            }
        };

        if (FormValidation(params)) {
            createPackageBundle(params)
                .then(res => {
                    if (res?.data?.status === 1) {
                        toast.success(res?.data?.message)
                        navigate('/authorised/package-list');
                    }
                    else if (res?.data?.status === 0) {
                        let { errorMessage } = res?.data?.message
                        toast.error(errorMessage)
                    }
                    else {
                        console.error(res);
                    }
                }).catch(error => {
                    console.error('An error occurred:', error);
                });

        }

    }

    useEffect(() => {
        if (updateData) {
            let data = updateData
            setNewFeatureList(data.entity_feature_list)
            setUpdatePackageInformationData(data?.package_information)
            setUpdatePackageContentData(data?.package_contents)
            setUpdateUserType(data?.entity_user_type_details)
            setisUpdate(true)
        }
    }, [updateData]);




    return (
        <div className="listing-containerPage">
            <Breadcrumbs className={`listing-breadcrumbs ${classes.breadcrumbsBar}`}
                separator={<img src={BredArrow} />}
                aria-label="breadcrumb"
            >
                {breadcrumbs}
            </Breadcrumbs>
            <Page
                title="Extramarks | Add Package"
                className="main-container myLeadPage datasets_container"
            >
                <div>
                    {shw_loader ? <LinearProgress /> : ""}
                </div>
                <Grid className={classes.cusCard}>
                    <Grid container spacing={3} sx={{ px: "8px", py: "20px" }}>
                        <Grid item xs={12}>
                            <Typography className={classes.title}>New Package</Typography>
                        </Grid>
                    </Grid>

                    <div className={classes.accordianPadding}>
                        {accordionData?.map((data, index) => {
                            return (
                                <Accordion
                                    key={index}
                                    className="cm_collapsable"
                                    expanded={activeAccordion === index}
                                    // expanded={true}
                                    onChange={(prev) => {
                                        setActiveAccordion(index);
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                        className="table-header"
                                    >
                                        <Typography style={{ fontSize: 14, fontWeight: 600 }}>
                                            {data?.title}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails className="listing-accordion-details">
                                        {data?.detail}
                                    </AccordionDetails>
                                </Accordion>
                            );
                        })}
                    </div>
                    <Box className="modal-footer text-right" >
                        <Button className={classes.outlineButton + " report_form_ui_btn cancel mr-2"} color="primary" variant="outlined" onClick={() => packageCancelHandler()} > Cancel </Button>
                        <Button color="primary" autoFocus className={classes.containedButton + " report_form_ui_btn submit"} variant="contained" onClick={handleSubmit}> {isUpdate ? "Update" : "Submit"} </Button>
                    </Box>
                </Grid>
            </Page>
        </div>
    );
}

export default PackageManagement
