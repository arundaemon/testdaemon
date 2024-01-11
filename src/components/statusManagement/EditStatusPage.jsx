import { React, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import ReactSelect from 'react-select';
import _ from 'lodash';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { makeStyles } from '@mui/styles'
import { Button, Typography, Grid, Modal, Fade, Breadcrumbs, Stack, Link, Box } from '@mui/material';
import { getAllStatus, updateStatus, statusDetails, mapStatusesWithStage, unMapAvailableStatus } from "../../config/services/status";
import { useEffect } from "react";
import RequestStatusModal from "./RequestStatusModal";
import { getAllStages, stageDetails } from '../../config/services/stages';
import ToggleArrow from "../../assets/icons/togale-arow.svg";
import BreadcrumbArrow from '../../assets/image/bredArrow.svg';


const grid = 8;

export default function EditStatusPage() {
    const [allStageList, setAllStageList] = useState([]);
    const [allStatusList, setAllStatusList] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState([]);
    const [recordForEdit, setRecordForEdit] = useState({});
    const [stageId, setStageId] = useState(null);
    const [availableStatus, setAvailableStatus] = useState([]);
    const [openPopup, setOpenPopup] = useState(false);
    const [selectStage, setSelectStage] = useState(false)

    const [modifiedBy, setModifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.username);
    const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('userData'))?.uuid);


    const navigate = useNavigate();
    const { state } = useLocation();
    const { status_id } = useParams();


    const useStyles = makeStyles((theme) => ({

        outlineButton: {
            color: '#85888A',
            fontSize: '14px',
            border: '1px solid #DEDEDE',
            borderRadius: '4px',
            fontWeight: 'normal',
            marginRight: '10px',
            padding: '0.5rem 1.5rem'
        },
        containedButton: {
            color: '#fff',
            fontSize: '14px',
            border: '1px solid allCyclesList#F45E29',
            borderRadius: '4px',
            fontWeight: 'normal',
            padding: '0.5rem 1.5rem'
        }
    }));

    const classes = useStyles();

    const fetchAllStatusList = async () => {
        getAllStatus({ available: true })
            .then((res) => {
                if (res?.result) {

                    setAllStatusList(res?.result);
                    setAvailableStatus(res?.result);
                }
            })
            .catch(err => console.error(err))
    }

    const fetchAllStageList = async () => {
        getAllStages()
            .then((res) => {
                if (res?.result) {
                    res?.result?.map(stageObj => {
                        stageObj.label = stageObj?.stageName
                        stageObj.value = stageObj._id
                        return stageObj;
                    })
                    setAllStageList(res?.result)
                }
            })
            .catch(err => console.error(err))

    }

    const fetchStatusDetails = async () => {
        setStageId(state?.stageId?._id);

        stageDetails(state?.stageId?._id)
            .then(stageObj => {
                if (stageObj?.result) {
                    setSelectedStatus(stageObj?.result?.linkedStatus);
                }
            })
            .catch((err) => {
                console.log(err)
            })


    }

    const edit = (paramsObj) => {
        let stageId = paramsObj?.stageId
        let freeStatus = availableStatus

        unMapAvailableStatus({ stageId, freeStatus })
            .then(StatusUnmapped => {
                // console.log(StatusUnmapped, ":::StagesUnmapped");
            })

        mapStatusesWithStage(paramsObj)
            .then(res => {
                if (res?.result) {
                    toast.success(res?.message)
                    navigate('/authorised/status-management')
                }
                else if (res?.data?.statusCode === 0) {
                    let { errorMessage } = res?.data?.error
                    toast.error(errorMessage)
                }
                else {
                    console.error(res);
                }
            })
    }


    const handleSelectStageName = (newSelectValue) => {
        setSelectStage(true)
        setSelectedStatus(newSelectValue?.linkedStatus)
        setStageId(newSelectValue.value);

    }

    function handleClick(event) {
        event.preventDefault();
        navigate('/authorised/journey-management')
        console.info('You clicked a breadcrumb.');
    }

    const handleCloseEditPopup = () => {
        setOpenPopup(false);
        setRecordForEdit({})
    }

    const openInPopup = statusEdit => {
        setRecordForEdit(statusEdit)
        setOpenPopup(true)
    }

    const handleSaveButton = () => {
        const selectedList = selectedStatus.map(value => { return value._id });
        let filledDetails = _.cloneDeep(recordForEdit)
        filledDetails.linkedStatus = selectedList;
        filledDetails.stageId = stageId;
        filledDetails.modifiedBy = modifiedBy;
        filledDetails.modifiedBy_Uuid = modifiedBy_Uuid;


        if (status_id) {
            filledDetails._id = status_id;
        }

        edit(filledDetails)
    }

    const handleOnChange = (e) => {
        let { value, name } = e.target
        let filledDetails = _.cloneDeep(recordForEdit)
        filledDetails[name] = value
        setRecordForEdit(filledDetails)
    }

    const handleAddRequest = () => {
        setOpenPopup(true);
    }


    const onDragEnd = result => {
        const { source, destination } = result;
        if (!destination) {
            return;
        }


        if (source.droppableId === 'allStatus' && destination.droppableId === 'selectedStatus') {
            setSelectedStatus([...selectedStatus, availableStatus[source.index]]);
            availableStatus.splice(source.index, 1)
            setAvailableStatus([...availableStatus]);
        } else if (source.droppableId === 'selectedStatus' && destination.droppableId === 'allStatus') {
            setAvailableStatus([...availableStatus, selectedStatus[source.index]]);
            selectedStatus.splice(source.index, 1);
            setSelectedStatus([...selectedStatus]);
        }
    }

    const getListStyle = isDraggingOver => ({
        // background: isDraggingOver ? 'lightblue' : 'lightgrey',
        //padding: grid,
        // width: 500,
        border: '1px solid #E6E6E6',
        // background: '#FFEEDA',
        borderRadius: '8px',
        height: '350px',
        //overflow:'auto',
    });

    const getItemStyle = (isDragging, draggableStyle) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: 'none',
        // padding: grid * 2,
        padding: '10px 20px',
        margin: '10px 20px',
        fontSize: '14px',
        // margin: `0 0 ${grid}px 0`,

        // change background colour if dragging
        background: isDragging ? 'lightgreen' : 'white',
        border: '1px solid #E6E6E6',
        borderRadius: '4px',

        // styles we need to apply on draggables
        ...draggableStyle
    });

    useEffect(() => {
        fetchAllStageList();
        fetchStatusDetails();
    }, []);

    useEffect(() => fetchAllStatusList(), [stageId]);


    return (
        <>
            <Stack style={{ marginLeft: "20px" }}>
                <Breadcrumbs className='update-status-heading' separator={<img src={BreadcrumbArrow} alt="Arrow" />} aria-label="breadcrumb">
                    <Link underline="hover" key="1" color="inherit" href="/" onClick={handleClick}>
                        Manage Journey
                    </Link>

                    <Typography key="2" color="text.primary">{'Map Stage to Status'}
                    </Typography>
                </Breadcrumbs>
            </Stack><br />
            <div className='shadow-container'>
                <div className='journey-list-heading' style={{ padding: "0" }}>
                    <h4>Map Stage to Status</h4>
                    {/* <p>Lorem ipsum dolor sit amet, consetetur</p> */}
                </div>
                <Grid container mb={2} spacing={2} >
                    <Grid item xs={12} sm={5} md={5} lg={5} >
                        <Typography className="text-small label select-journey" variant="subtitle2" mt={1}>Select Stage </Typography>
                        <ReactSelect
                            classNamePrefix="select"
                            options={allStageList}
                            value={
                                allStageList.filter(option =>
                                    option.value === stageId)
                            }
                            onChange={handleSelectStageName}
                        />
                    </Grid>
                </Grid>
    
                <div style={{ display: "flex" }}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Grid container>
                            <Grid item lg={5} md={5} style={{ padding: '0' }}>
                                <Droppable droppableId="allStatus" >

                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            style={getListStyle(snapshot.isDraggingOver)}>
                                            <span className="group-header"><h3>Available Status</h3></span>
                                            <div className="dnd-input">
                                                {availableStatus.map((item, index) => (
                                                    <Draggable
                                                        key={item._id}
                                                        draggableId={item._id}
                                                        index={index}>


                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={getItemStyle(
                                                                    snapshot.isDragging,
                                                                    provided.draggableProps.style
                                                                )}>

                                                                {item.statusName}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            </Grid>
                            <Grid item lg={2} md={2}>
                                <Box className='toggle-arrow'>
                                    <img src={ToggleArrow} />
                                </Box>
                            </Grid>
                            <Grid item lg={5} md={5} style={{ padding: '0' }}>
                                <Droppable droppableId="selectedStatus">
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            style={getListStyle(snapshot.isDraggingOver)}>
                                            <span className="group-header"><h3>Selected Status</h3></span>
                                            <div className="dnd-input">
                                            {selectedStatus.map((item, index) => (
                                                <Draggable
                                                    key={item._id}
                                                    draggableId={item._id}
                                                    index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={getItemStyle(
                                                                snapshot.isDragging,
                                                                provided.draggableProps.style
                                                            )}>
                                                            {item.statusName}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            </Grid>
                        </Grid>
                    </DragDropContext>
                </div>
                

            </div>
            

            <Box className="modal-footer text-right" >
                <Button onClick={() => navigate('/authorised/status-management')} className={classes.outlineButton + " report_form_ui_btn cancel mr-2"} color="primary" variant="outlined" > Cancel </Button>
                {/* <Button onClick={() => console.log('add request clicked')} color="primary" autoFocus className={classes.containedButton + " report_form_ui_btn submit"} variant="contained"> Request to Add New Status </Button> */}
                <Button onClick={handleSaveButton} color="primary" autoFocus className={classes.containedButton + " report_form_ui_btn submit"} variant="contained"> Save </Button>
            </Box>

            <RequestStatusModal openPopup={openPopup} recordForEdit={recordForEdit} edit={edit}
                handleCloseEditPopup={handleCloseEditPopup} handleOnChange={handleOnChange}
                allStageList={allStageList} handleSelectStageName={handleSelectStageName}
            />
        </>
    )
}
