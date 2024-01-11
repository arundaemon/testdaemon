import { React, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import ReactSelect from 'react-select';
import _, { fill } from 'lodash';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { makeStyles } from '@mui/styles'
import { Button, TextField, Typography, Breadcrumbs, Link, Stack, Grid, Modal, Fade, Box } from '@mui/material';
import { getAllStages, updateStage, stageDetails, isDuplicateStage, createStage, mapStagesWithCycle, unMapAvailableStage } from "../../config/services/stages";
import { useEffect } from "react";
import { RequestStageModal } from './index';
import ToggleArrow from "../../assets/icons/togale-arow.svg";
import { getAllCycles, cycleDetails } from '../../config/services/cycles';
import BreadcrumbArrow from '../../assets/image/bredArrow.svg';

export default function EditStagePage() {
    const [allCycleList, setAllCycleList] = useState([]);
    const [allStageList, setAllStageList] = useState([]);
    const [selectedStage, setSelectedStage] = useState([]);
    const [recordForEdit, setRecordForEdit] = useState({});
    const [cycleId, setCycleId] = useState();
    const [availableStage, setAvailableStage] = useState([]);
    const [openPopup, setOpenPopup] = useState(false);
    const [drag, setDrag] = useState(false);
    const [cycleSelect, setCycleSelect] = useState(false);
    const [selectCycle, setSelectCycle] = useState(false)

    const [createdBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
    const [createdBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
    const [modifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
    const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);

    const { stage_id, stage_name } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();



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

    const fetchAllStageList = async () => {
        getAllStages({ available: true })
            .then((res) => {
                if (res?.result) {
                    setAllStageList(res?.result);
                    setAvailableStage(res?.result);
                }
            })
            .catch(err => console.error(err))
    }

    const fetchAllCycleList = () => {
        getAllCycles()
            .then((res) => {
                if (res?.result) {
                    res?.result?.map(cycleObj => {
                        cycleObj.label = cycleObj?.cycleName
                        cycleObj.value = cycleObj._id
                        return cycleObj
                    })
                    setAllCycleList(res?.result)
                }
            })
            .catch(err => console.error(err))
    }

    const fetchStageDetails = async () => {
        setCycleId(state?.cycleId);

        cycleDetails(state?.cycleId)
            .then(cycleObj => {
                if (cycleObj?.result) {
                    setSelectedStage(cycleObj?.result?.linkedStage);
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const addOrEdit = (paramsObj) => {

        let cycleId = paramsObj?.cycleId
        let freeStages = availableStage

        unMapAvailableStage({ cycleId, freeStages })
            .then(StagesUnmapped => {
                // console.log(StagesUnmapped, ":::StagesUnmapped");
            })

        mapStagesWithCycle(paramsObj)
            .then(res => {
                if (res?.result) {
                    toast.success(res?.message)
                    navigate('/authorised/stage-management')
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


    const handleSelectCycleName = (newSelectValue) => {
        if (newSelectValue) {
            setCycleSelect(true)
        }
        setCycleId(newSelectValue?.value);
        setSelectedStage(newSelectValue?.linkedStage);
        setSelectCycle(true)
    }

    const handleCloseEditPopup = () => {
        setOpenPopup(false);
        setRecordForEdit({})
    }

    const enabled = () => {
        if (cycleSelect && drag) {
            return true;
        }
        else return false;
    }
    // const validateAddStage = (data) => {
    //       let { cycleId } = data

    //     if (!cycleId) {
    //         toast.error('Select Cycle First !')
    //         return false
    //     }
    //     else {
    //         return true
    //     }

    // }


    const handleSaveButton = () => {
        const selectedList = selectedStage.map(value => { return value._id });
        let filledDetails = _.cloneDeep(recordForEdit)

        filledDetails.linkedStage = selectedList;
        filledDetails.cycleId = cycleId;

        filledDetails.createdBy = createdBy;
        filledDetails.createdBy_Uuid = createdBy_Uuid;
        filledDetails.modifiedBy = modifiedBy;
        filledDetails.modifiedBy_Uuid = modifiedBy_Uuid;

        if (state?._id) {
            filledDetails._id = state?._id;
        }

        addOrEdit(filledDetails)

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

    // function handleClick(event) {
    //     event.preventDefault();
    //     console.info('You clicked a breadcrumb.');
    // }

    const onDragEnd = result => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        if (source.droppableId === 'allStage' && destination.droppableId === 'selectedStage') {
            setDrag(true);
            setSelectedStage([...selectedStage, availableStage[source.index]]);
            availableStage.splice(source.index, 1)
            setAvailableStage([...availableStage]);
        } else if (source.droppableId === 'selectedStage' && destination.droppableId === 'allStage') {
            setDrag(true);
            setAvailableStage([...availableStage, selectedStage[source.index]]);
            selectedStage.splice(source.index, 1);
            setSelectedStage([...selectedStage]);
        } else if (source.droppableId === 'selectedStage' && destination.droppableId === 'selectedStage') {
            const [removed] = selectedStage.splice(source.index, 1);
            selectedStage.splice(destination.index, 0, removed);
            setSelectedStage([...selectedStage])
        }
    }

    const getListStyle = isDraggingOver => ({
        // background: isDraggingOver ? 'lightblue' : 'lightgrey',
        // padding: grid,
        // width: 250
        border: '1px solid #E6E6E6',
        borderRadius: '8px',
        height: '350px',
        // overflow:'auto',
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
        fetchAllCycleList();
        fetchStageDetails()
    }, []);

    useEffect(() => fetchAllStageList(), [cycleId]);

    // console.log(allCycleList,'.....allCycleList')

    return (
        <>
            <Box>
                <Breadcrumbs className='update-stage-heading' separator={<img src={BreadcrumbArrow} alt="Arrow" />} aria-label="breadcrumb">
                    <Link underline="hover" key="1" color="inherit" onClick={() => navigate('/authorised/journey-management')} >
                        Manage Journey
                    </Link>

                    <Typography key="2" color="text.primary">
                        {stage_id ? "Manage Journey" : "Map Cycle to Stage"}
                    </Typography>
                </Breadcrumbs>
            </Box>
            <div className='shadow-container'>
                <div className='journey-list-heading' style={{ padding: "0" }}>
                    <h4>Map Cycle to Stage</h4>
                    {/* <p>Lorem ipsum dolor sit amet, consetetur</p> */}
                </div>
                <Grid container mb={2} spacing={2} >
                    <Grid item xs={12} sm={6} md={6} lg={5} >
                        <Typography className="text-small label select-journey" variant="subtitle2" mt={1}>Select Cycle </Typography>
                        <ReactSelect
                            classNamePrefix="select"
                            options={allCycleList}
                            value={
                                allCycleList.filter(option =>
                                    option.value === cycleId)
                            }
                            onChange={handleSelectCycleName}
                        />
                    </Grid>
                </Grid>
                {selectCycle &&
                    <div style={{ display: "flex" }}>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Grid container>
                                <Grid item lg={5} md={5} style={{ padding: '0' }}>
                                    <Droppable droppableId="allStage" >

                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                style={getListStyle(snapshot.isDraggingOver)}>
                                                <span className="group-header"><h3>Available Stage</h3></span>
                                                <div className='dnd-input'>
                                                    {availableStage.map((item, index) => (
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

                                                                    {item.stageName}
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

                                    <Droppable droppableId="selectedStage">
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                style={getListStyle(snapshot.isDraggingOver)}>
                                                <span className="group-header"><h3>Selected Stage</h3></span>
                                                <div className='dnd-input'>
                                                    {selectedStage.map((item, index) => (
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
                                                                    {item.stageName}
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
                }



                {/* <RequestStageModal openPopup={openPopup} recordForEdit={recordForEdit} edit={addOrEdit}
                handleCloseEditPopup={handleCloseEditPopup}  handleOnChange={handleOnChange}
            />           */}
            </div>
            {selectCycle &&
                <Box className="modal-footer text-right" >
                    <Button onClick={() => navigate('/authorised/stage-management')} className={classes.outlineButton + " report_form_ui_btn cancel mr-2"} color="primary" variant="outlined" > Cancel </Button>
                    {/* <Button onClick={() => console.log('request for stage')} color="primary" autoFocus className={classes.containedButton + " report_form_ui_btn submit"} variant="contained"> Request to Add New Stage </Button> */}
                    <Button onClick={handleSaveButton} color="primary" autoFocus className={classes.containedButton + " report_form_ui_btn submit"} variant="contained"> Save </Button>
                </Box>
            }

        </>
    )
}
