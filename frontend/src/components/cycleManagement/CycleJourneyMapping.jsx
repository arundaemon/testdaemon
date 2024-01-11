import { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ReactSelect from 'react-select';
import { makeStyles } from '@mui/styles'
import _ from 'lodash';
import toast from 'react-hot-toast';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Button, TextField, Typography, Grid, Modal, Fade, Box, Breadcrumbs, Link } from '@mui/material';
import { getAllJourneys, getJourney } from '../../config/services/journeys';
import { getCyclesList, deleteCycle, createCycle, updateCycle, getAllCycles, cycleDetails, mapCyclesWithJourney, unMapAvailableCycle } from '../../config/services/cycles';
import ToggleArrow from "../../assets/icons/togale-arow.svg";
import BreadcrumbArrow from '../../assets/image/bredArrow.svg';

export default function CycleJourneyMapping() {
    const [allJourneyList, setAllJourneyList] = useState([]);
    const [allCyclesList, setAllCyclesList] = useState([]);
    const [selectedCycles, setSelectedCycles] = useState([]);
    const [recordForEdit, setRecordForEdit] = useState({});
    const [selectJourney, setSelectJourney] = useState(false)
    const [journeyId, setJourneyId] = useState(null);
    const [availableCycles, setAvailableCycles] = useState([]);
    const [createdBy] = useState(JSON.parse(localStorage.getItem('userData'))?.username);
    const [createdBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
    const [modifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.username);
    const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
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
    const { cycle_name, cycle_id } = useParams();

    const fetchAllCyclesList = async () => {
        getAllCycles({ availableCycles: true })
            .then((res) => {
                if (res?.result) {
                    setAllCyclesList(res?.result);
                    setAvailableCycles(res?.result);
                }
            })
            .catch(err => console.error(err))
    }


    const fetchAllJourneyList = () => {
        getAllJourneys()
            .then((res) => {
                if (res?.result) {
                    res?.result?.map(journeyObj => {
                        journeyObj.label = journeyObj?.journeyName
                        journeyObj.value = journeyObj._id
                        return journeyObj
                    })
                    setAllJourneyList(res?.result)
                }
            })
            .catch(err => console.error(err))
    }

    const fetchCycleDetails = async () => {
        setJourneyId(state.journeyId);

        getJourney({ journeyId: state?.journeyId })
            .then(journeyDetails => {
                // console.log(journeyDetails, ":::journeyDetails")

                if (journeyDetails?.result) {
                    setSelectedCycles(journeyDetails?.result?.linkedCycle);
                }
            })
            .catch((err) => {
                console.log(err)
            })

        // cycleDetails(cycle_id)
        //     .then((res) => {
        //         if (res?.result) {

        //             if (res?.result?.linkedCycle?.length > 0) {
        //                 let selectedCyc = allCyclesList.filter((value) =>
        //                     res?.result?.linkedCycle.indexOf(value._id) > -1
        //                 );
        //                 setSelectedCycles(selectedCyc);
        //                 let result = allCyclesList.filter((value) =>
        //                     res?.result?.linkedCycle.indexOf(value._id) == -1
        //                 );
        //                 setAvailableCycles(result);
        //             }
        //         }
        //     }).catch((err) => {
        //         console.log(err)
        //     })

    }

    const validateAddCycle = (data) => {
        let { cycleName, journeyId } = data;
        if (!cycleName) {
            toast.error('Fill cycle name')
            return false;
        }
        if (selectedCycles.length===0)
        {
            toast.error('Select Available Cycle');
            return false;
        }
        if (!journeyId) {
            toast.error('Select journey name');
            return false;
        }
        else {
            return true;
        }


    }

    const addOrEdit = (paramsObj) => {
        let journeyId = paramsObj?.journeyId
        let freeCycles = availableCycles
        unMapAvailableCycle({ journeyId, freeCycles })
            .then(cyclesUnmapped => {
                // console.log(cyclesUnmapped, ":::cyclesUnmapped");
            })


        mapCyclesWithJourney(paramsObj)
            .then(res => {
                if (res?.result) {
                    toast.success(res?.message)
                    navigate('/authorised/cycle-management')
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



    const handleSubmitButton = () => {
        const selectedList = selectedCycles.map(value => { return value._id });
        let filledDetails = _.cloneDeep(recordForEdit)
        filledDetails.linkedCycle = selectedList;
        filledDetails.cycleName = cycle_name;
        filledDetails.journeyId = journeyId;
        filledDetails.createdBy = createdBy;
        filledDetails.createdBy_Uuid = createdBy_Uuid;
        filledDetails.modifiedBy = modifiedBy;
        filledDetails.modifiedBy_Uuid = modifiedBy_Uuid;
        if (cycle_id) {
            filledDetails._id = cycle_id;
        }

        setRecordForEdit({ ...filledDetails })

        if (validateAddCycle(filledDetails)) {
            addOrEdit(filledDetails);
        }


    }

    const handleSelectJourneyName = (newSelectValue) => {
        setSelectJourney(true)
        setJourneyId(newSelectValue.value);
        setSelectedCycles(newSelectValue?.linkedCycle)
    }



    const onDragEnd = result => {
        const { source, destination } = result;
        if (!destination) {
            return;
        }
        if (source.droppableId === 'allCycles' && destination.droppableId === 'selectedCycles') {
            setSelectedCycles([...selectedCycles, availableCycles[source.index]]);
            availableCycles.splice(source.index, 1)
            setAvailableCycles([...availableCycles]);
        } else if (source.droppableId === 'selectedCycles' && destination.droppableId === 'allCycles') {
            setAvailableCycles([...availableCycles, selectedCycles[source.index]]);
            selectedCycles.splice(source.index, 1);
            setSelectedCycles([...selectedCycles]);
        } else if (source.droppableId === 'selectedCycles' && destination.droppableId === 'selectedCycles') {
            const [removed] = selectedCycles.splice(source.index, 1);
            selectedCycles.splice(destination.index, 0, removed);
            setSelectedCycles([...selectedCycles])
        }
    }

    const getListStyle = isDraggingOver => ({
        // background: isDraggingOver ? 'lightblue' : 'lightgrey',
        //padding: grid,
        // width: 500,
        border: '1px solid #E6E6E6',
        // background: '#FFEEDA',
        borderRadius: '8px',
        // height:'350px',
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

   
    const sortedOptions = useMemo(() => allJourneyList.sort(({label: labelA = ""}, {label: labelB = ""}) => labelA.localeCompare(labelB)), [allJourneyList]);
   

    useEffect(() => {
        fetchAllCyclesList();
        fetchAllJourneyList();
    }, []);

    useEffect(() => {
        fetchCycleDetails();
    }, []);
  
    

    return (
        <>
            <Box>
                <Breadcrumbs className='create-journey-heading' separator={<img src={BreadcrumbArrow} alt="Arrow" />} aria-label="breadcrumb">
                    <Link underline="hover" key="1" color="inherit" onClick={() => navigate('/authorised/journey-management')} >
                        Manage Journey
                    </Link>

                    <Typography key="2" color="text.primary">
                        {cycle_id ? "Map Journey to Cycle": "Manage Journey" }
                    </Typography>
                </Breadcrumbs>
            </Box>
            <div className='shadow-container'>
                <div className='journey-list-heading' style={{ padding: "0" }}>
                    <h4>Map Journey to Cycle</h4>
                    {/* <p>Lorem ipsum dolor sit amet, consetetur</p> */}
                </div>
                <Grid container mb={2} spacing={2} >
                    <Grid item xs={12} sm={5} md={5} lg={5} >
                        <Typography className="text-small label select-journey" variant="subtitle2" mt={1}>Select Journey </Typography>
                        <ReactSelect
                            classNamePrefix="select"
                            options={sortedOptions}
                            value={allJourneyList.filter(option => option.value === journeyId)}
                            onChange={handleSelectJourneyName}
                        />
                    </Grid>
                </Grid>
                {selectJourney &&
                    <div style={{ display: "flex" }}>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Grid container>
                                <Grid item lg={5} md={5} style={{ padding: '0' }}>
                                    <Droppable droppableId="allCycles" >

                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                style={getListStyle(snapshot.isDraggingOver)}>
                                                <span className="group-header"><h3>Available Cycles</h3></span>
                                                <div className='dnd-input'>
                                                    {availableCycles.map((item, index) => (
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

                                                                    {item.cycleName}
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
                                    <Droppable droppableId="selectedCycles">
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                style={getListStyle(snapshot.isDraggingOver)}>
                                                <span className="group-header"><h3>Selected Cycles</h3></span>
                                                <div className='dnd-input'>
                                                    {selectedCycles.map((item, index) => (
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
                                                                    {item.cycleName}
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
            </div>


            {selectJourney &&
                <Box className="modal-footer text-right" >
                    <Button onClick={() => navigate('/authorised/cycle-management')} className={classes.outlineButton + " report_form_ui_btn cancel mr-2"} color="primary" variant="outlined" > Cancel </Button>
                    <Button onClick={handleSubmitButton} color="primary" autoFocus className={classes.containedButton + " report_form_ui_btn submit"} variant="contained"> Submit </Button>
                </Box>
            }


        </>
    )
}