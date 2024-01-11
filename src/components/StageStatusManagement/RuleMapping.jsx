import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import _, { fill, forEach } from 'lodash';
import { Button, TextField, Typography, Grid, Box, Paper, InputBase, IconButton, Modal } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ToggleArrow from "../../assets/icons/togale-arow.svg";
import { getRuleList } from '../../config/services/rules';
import ReactSelect from 'react-select';
import Search from '@mui/icons-material/Search';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const grid = 8;

const getListStyle = isDraggingOver => ({
    border: '1px solid #E6E6E6',
    borderRadius: '8px',
});

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: '10px 20px',
    margin: '10px 20px',
    fontSize: '14px',
    background: isDragging ? 'lightgreen' : 'white',
    border: '1px solid #E6E6E6',
    borderRadius: '4px',
    ...draggableStyle
});

const filterOptions = [
    { label: "Filter 1", value: "filter1" },
    { label: "Filter 2", value: "filter2" },
    { label: "Filter 3", value: "filter3" },
]

const testArr = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

export default function RuleMapping({showModal,closeModal,selectedNode,setRuleData}) {
    const [ruleList, setRuleList] = useState([])
    const [selectedRules, setSelectedRules] = useState([])
    const [availableRules, setAvailableRules] = useState([])
    const [searchValue, setSeachValue] = useState('')
    const [filterValue, setFilterValue] = useState({});
    const [treeData, setTreeData] = useState({})
    const [ruleSql, setRuleSql] = useState("");
    const [flagValidation, setFlagValidation] = useState(false);
    const [flagvalid,setFlagValid]=useState(false);  //for onchange
    const[flagcheck,setFlagCheck]=useState(false)   // for validating first and error msg before submit after onchange

    // const [createdBy, setCreatedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.username);
    // const [createdBy_Uuid] = useState(JSON.parse(localStorage.getItem('userData'))?.uuid);
    // const [modifiedBy, setModifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.username);
    // const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('userData'))?.uuid);
    // console.log(createdBy, 'createdBy')
    // validFilterLogic
    // filterLogicSql

    const handleSearch = (e) => {
        e.preventDefault();
        // console.log("hello")
    }


    const searchAndUpdateTreeList = (data) => {
        // console.log("data inside search and update", data)
        data.forEach((tree) => {
            if (tree.id === selectedNode.name) {
                tree.rules = [...selectedRules];
                // tree
                tree.filterLogic = ruleSql;
                tree.filterLogicSql = ruleSql;
                let updatedTreeData = _.cloneDeep(treeData);
                localStorage.setItem('treePreview', JSON.stringify(updatedTreeData));
            }
            searchAndUpdateTreeList(tree.children)
        })
    }

    const handleSubmitButton = () => {
        // console.log("tree data inside submit", treeData)

        if(flagcheck===false)
        {
            toast.error("First validate  the Filter logic")
        }
      else  if(flagValidation===true && flagvalid===true)
        {
            searchAndUpdateTreeList(treeData.children);
            //navigate('/authorised/manage-stage-status')
        }
       
    }


    // console.log("available rules",availableRules);
    // console.log("selected rules",selectedRules)

    const onDragEnd = result => {
        const { source, destination } = result;
        // console.clear()
        // console.log("source",source);
        // console.log("destination",destination);
        if (!destination) {
            return;
        }
        if (source.droppableId === 'allRules' && destination.droppableId === 'selectedRules') {
            setSelectedRules([...selectedRules, availableRules[source.index]]);
            availableRules.splice(source.index, 1)
            setAvailableRules([...availableRules]);
            setFlagCheck(false);
        } else if (source.droppableId === 'selectedRules' && destination.droppableId === 'allRules') {
            setAvailableRules([...availableRules, selectedRules[source.index]]);
            selectedRules.splice(source.index, 1);
            setSelectedRules([...selectedRules]);
            setFlagCheck(false);
        } else if (source.droppableId === 'selectedRules' && destination.droppableId === 'selectedRules') {
            const [removed] = selectedRules.splice(source.index, 1);
            selectedRules.splice(destination.index, 0, removed);
            setSelectedRules([...selectedRules]);
            setFlagCheck(false);
        }
    }

    const Search = () => {
        // console.clear()
        // console.log("search is called");
        if (!searchValue) return setAvailableRules(ruleList)
        const filterList = availableRules.filter(value => value.ruleName.toLowerCase().includes(searchValue.toLowerCase()));
        setAvailableRules(filterList)
    }

    const handleCancel = () => {
        //navigate('/authorised/manage-stage-status')
    }


    const fetchRuleList = async () => {
        getRuleList()
            .then((res) => {
                if (res?.result) {
                    // console.log("rule list inside fetch", res.result)
                    setRuleList(res?.result);
                    setAvailableRules(res?.result);
                }
            })
            .catch(err => console.error(err))
    }

    const fetchTreeData = () => {
        setTreeData(JSON.parse(localStorage.getItem('treePreview')))
    }

    const handlerulesql =(e)=>{
        // console.log(e.target.value,'......................................e')
         setRuleSql(e?.target?.value)
         setFlagValid(false)
         setFlagCheck(false)

    }

    useEffect(() => {
        fetchRuleList();
        //fetchTreeData();
    }, []);

    useEffect(() => {
        //Search()
    }, [searchValue]);


    const logiclValidate = () => {


        let len = selectedRules?.length
        // console.log(len,'............................length of selected rules')
        let value = ruleSql;
        let lenOfValue = ruleSql?.length

        // console.log(value,'..............value')

        let indexFirst = value?.indexOf("1")
        if (indexFirst !== 0)
            return false


        let indexLast = value?.indexOf(len)
        if (indexLast != (lenOfValue - 1))
            return false

        let str = value?.split(/AND|OR|/)
        for(let i=0;i<str.length;i++)
        {
            if(str[i]==="")
            return false
        }
      
        var num = value?.match(/\d/g).toString();
        num = num?.replaceAll(',', '');
        var newNum = testArr.slice(0, len).toString().replaceAll(',', '');
        return (newNum === num)
    }

    let countCharAnd;
    let countCharOr;
    var countAnd;
    var countOr;

    const logicValidation = () => {
        let len = selectedRules?.length
        let value = ruleSql

        var num = value?.match(/\d/g).toString();

        num = num.replaceAll(',', '');
        // console.log(num, 'this is num')
        var countNum = num.length;
        // console.log(countNum, 'countNum')

        var inputAnd = value?.match(/AND/gm);
        var inputOr = value?.match(/OR/gm);

        if (inputAnd?.length) {
            countAnd = inputAnd?.length
        }
        else countAnd = 0;
        // console.log(countAnd, 'countAnd')

        if (inputOr?.length) {
            countOr = inputOr?.length
        }
        else {
            countOr = 0;
        }
        
        if (countAnd == 0) countCharAnd = 0;
        else countCharAnd = inputAnd?.length * 3
        if (countOr == 0) countCharOr = 0;
        else countCharOr = inputOr?.length * 2;


        let sumVar = countCharAnd + countCharOr + num.length;
        return ((countNum - 1) == countAnd + countOr) && (sumVar == value.length)
    }


    const validate = () => {

        if (!logiclValidate()) {
            toast.error("Enter a valid filter logic");
            setFlagCheck(false)
            return false;
        }
        else if (!logicValidation()) {
            toast.error("Enter a valid filter logic")
            setFlagCheck(false)
            return false;
        }
        else {
            setFlagValidation(true)
            setFlagValid(true)
            setFlagCheck(true)
            toast.success("Logic is valid")
            return true;
        }
    }

    // console.log("selectedRules", selectedRules)
    // console.log("search value", searchValue)
    // console.log("treeData", treeData);
    // console.log("ruleSql",ruleSql)
    return (
        <Modal
            open={showModal}
            // onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <>
                <div className='shadow-container'>
                    <Box className='journey-list-heading' style={{ padding: "0", margin: "0px 0px 20px 0px" }}>
                        <Typography variant='h4'>Rule Mapping</Typography>
                        {/* <p>Lorem ipsum dolor sit amet, consetetur</p> */}
                    </Box>
                    <div style={{ display: "flex" }}>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Grid container>
                                <Grid item lg={5} md={5} style={{ padding: '0' }}>
                                    <Droppable droppableId="allRules" >

                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                style={getListStyle(snapshot.isDraggingOver)}>
                                                <span className="group-header"><h3>Available Rules</h3></span>
                                                <Paper
                                                    component="form"
                                                    sx={{
                                                        p: '2px 4px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        border: "1px solid #dedede",
                                                        margin: "10px 25px 0px 20px"
                                                    }}
                                                >
                                                    <InputBase
                                                        sx={{ ml: 1, flex: 1 }}
                                                        placeholder="search"
                                                        onChange={e => setSeachValue(e.target.value)}
                                                        value={searchValue}
                                                    />
                                                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                                                        <SearchIcon onClick={handleSearch} />
                                                    </IconButton>
                                                </Paper>


                                                <div className='dnd-input'>
                                                    {availableRules.map((item, index) => (
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

                                                                    {index+1}. {item.ruleName}
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
                                    <Droppable droppableId="selectedRules">
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                style={getListStyle(snapshot.isDraggingOver)}>
                                                <span className="group-header"><h3>Selected Rules</h3></span>
                                                <div className='dnd-input'>
                                                    {selectedRules.map((item, index) => (
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
                                                                    {index + 1}. {item.ruleName}
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
                    <Button variant='outlined' onClick={closeModal}> Cancel </Button>
                    <Button sx={{ marginLeft: "20px" }} onClick={handleSubmitButton} color="primary" variant="contained"> Submit </Button>
                </Box>
            </>
        </Modal>
    )
}

