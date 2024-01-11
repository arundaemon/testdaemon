import React, { useEffect, useState, useMemo } from "react";
import Page from "../components/Page";
import {
  Container,
  Grid,
  Paper,
  styled,
  Link,
  Breadcrumbs,
  Typography,
  Button,
  Box,
  circularProgressClasses,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import _, { add, forEach, over } from "lodash";
import toast from "react-hot-toast";
import ReactSelect from "react-select";
import { v4 as uuidv4 } from "uuid";

import { getActiveJourneys } from "../config/services/journeys";
import { getAllStages } from "../config/services/stages";
import { getAllStatus } from "../config/services/status";
import { getAllCycleNames } from "../config/services/cycles";
import {
  createManageStageStatus,
  getPreviewMap,
} from "../config/services/manageStageStatus";
import AddStageStatusModal from "../components/StageStatusManagement/AddStageStatusModal";
import FlowDiagram from "../components/StageStatusManagement/FlowDiagram";
import BreadcrumbArrow from "../assets/image/bredArrow.svg";
import PlusIcon from "../assets/image/plusIcon.svg";
import MinusIcon from "../assets/image/minusIcon.svg";
import DeleteModal from "./deleteModal";

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: "100%",
  },
  prevPointer: {
    fontSize: "14px",
    textDecoration: "none",
    cursor: "pointer",
  },
  activePointer: {
    fontSize: "14px",
    fontWeight: "600",
  },
  cusCard: {
    padding: "2px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
  },
  subTitle: {
    fontSize: "14px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#000000",
  },
  selectSection: {
    borderRadius: "0",
    paddingBottom: "0",
    paddingTop: "1px",
  },
  borderRight: {
    borderRight: "1px solid #DEDEDE",
  },
}));

export default function ManageStageStatus() {
  const [journeyList, setJourneyList] = useState([]);
  const [journey, setJourney] = useState({});
  const [cycleList, setCycleList] = useState([]);
  const [cycle, setCycle] = useState({});
  const [stageList, setStageList] = useState([]);
  const [stage, setStage] = useState({});
  const [statusList, setStatusList] = useState([]);
  const [status, setStatus] = useState({});
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [showTreeViewContainer, setShowTreeViewContainer] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [deleteMsg, setdeleteMsg] = useState("");
  const [deleteNodeObj, setDeleteNode] = useState({});
  const [treeList, setTreeList] = useState({ name: "", children: [] });
  const [currentSelectedId, setCurrentSelectedId] = useState("");
  const [addedList, setAddedList] = useState([]);
  const [deletedList, setDeletedList] = useState([]);
  const [overAllList, setOverAllList] = useState([]);
  const [rootNode, setRootNode] = useState("");
  //const [ruleList, setRuleList] = useState([])

  const classes = useStyles();
  const navigate = useNavigate();

  let parentAdress = treeList;
  let childAddress;
  let found = false;

  // Breadcrumb
  const breadcrumbs = [
    <Link
      className={classes.prevPointer}
      color="inherit"
      onClick={() => navigate("/authorised/menu-management")}
    >
      Manage Masters
    </Link>,
    <Typography key="2" color="text.primary" className={classes.activePointer}>
      Manage Stage-Status Movement
    </Typography>,
  ];

  const handleSelectChange = (e, name) => {
    switch (name) {
      case "journey":
        if (!_.isEmpty(cycle)) {
          setCycle({});
        }
        setJourney(e);
        //fetchCycleList()
        break;
      case "cycle":
        if (!_.isEmpty(stage)) {
          setStage({});
        }
        setCycle(e);
        break;
      case "stage":
        if (!_.isEmpty(status)) {
          setStatus({});
        }
        setStage(e);
        break;
      case "status":
        setStatus(e);
        break;
      default:
        break;
    }
  };

  const customElement = (node) => {
    console.log(node.id, 'testNode')
    return (
      <svg className="flow-diagram-node">
        <g y="0">
          <rect
            width="300"
            height="38"
            y="0"
            x="0"
            fillOpacity="0"
            stroke="#000"
            strokeWidth={1}
            strokeOpacity={1}
          ></rect>
          <foreignObject x="0" y="5" width="300" height="38">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "1px 20px",
              }}
            >
              <p style={{ fontSize: 14 }}>{truncateLabel(node.id, 25)}</p>
              <div style={{ display: "flex" }}>
                {overAllList.length > 1 &&
                overAllList.filter(
                  (obj) => obj.parent == "" && obj.name == node.id
                ).length > 0 ? (
                  ""
                ) : (
                  <img
                    onClick={() => handleRemoveIconClick(node)}
                    style={{ marginRight: 10 }}
                    src={MinusIcon}
                    alt="Minus Icon"
                  />
                )}
                <img
                  onClick={() => handleIconClick(node)}
                  src={PlusIcon}
                  alt="Plus Icon"
                />
              </div>
            </div>
            {/* <img className='add-new-rule-plus' onClick={() => navigateToRuleMapping(nodeDatum.id)} style={{ position: 'absolute', top: 55, left: 110 }} src={PlusIcon} alt="" /> */}
          </foreignObject>
        </g>
      </svg>
    );
  };


  const truncateLabel = (label, maxLength) => {
    if (label.length > maxLength) {
      return label.substring(0, maxLength) + '...';
    }
    return label;
  };

  const handleOnSubmit = () => {
    if (overAllList.length < 1) {
      //console.log("No tree exists");
      if (!stage.value) {
        toast.error("Select Journey First !");
        return;
      }
      let node = {
        name: `${stage.label} ${status.label}`,
        stageName: stage.label,
        stageId: stage._id,
        statusName: status.label,
        statusId: status._id,
        journeyName: journey.label,
        journeyId: journey._id,
        cycleName: cycle.label,
        cycleId: cycle._id,
        parent: "",
        uniqueLabel: `${stage.label} ${status.label} `,
        ruleId: null,
        ruleName: "",
        newFlag: true,
      };
      addNode(node, rootNode);
      setShowTreeViewContainer(true);
    } else {
      //console.log("Tree exists already");
      let label = `${stage.label} ${status.label}`;
      SearchAndUpdatePreviewMap(label);
    }
  };

  const addNode = (node, rootNode) => {
    addedList.push(node);
    overAllList.push(node);
    setAddedList(addedList);
    //setOverAllList(overAllList)
    let tree = generateFlowChart(rootNode, overAllList);
    setTreeList(tree);
  };

  const generateFlowChart = (rootNode, list) => {
    setOverAllList(list);
    let actualRoot = list.find((obj) => obj.parent == "");
    let nodes = list.map((obj) => {
      return {
        ...obj,
        id: obj.name,
        x: obj.x ? obj.x : 500,
        y: obj.y ? obj.y : 20,
      };
    });
    let nodeNameArr = list.map((obj) => obj.name);
    let links = list
      .filter((obj) => obj.parent != "")
      .map((obj) => {
        return {
          source: obj.name == rootNode ? "" : obj.parent,
          target: obj.name,
          label: obj.ruleName,
        };
      });
    links = links.filter((obj) => nodeNameArr.indexOf(obj.source) >= 0);
    nodes = nodes.filter(
      (obj) => obj.parent == "" || nodeNameArr.indexOf(obj.parent) >= 0
    );
    if (rootNode != "") {
      //nodes = nodes.filter(obj => (obj.name == rootNode || obj.parent == rootNode))
    }
    let focusedNode = rootNode
      ? nodes.find((obj) => obj.id == rootNode)
      : nodes.find((obj) => obj.id == actualRoot.name);
    //nodes = nodes.map(node => {if(node.name == focusedNode.name && node.parent == actualRoot.name){ node.parent = ""} return node; })
    //focusedNode.parent = ""
    return {
      nodes,
      links,
      focusedNode,
    };
  };

  const SearchAndUpdatePreviewMap = (nodeId) => {
    let node = overAllList.find((obj) => obj.name == nodeId);
    //let list = overAllList.filter(obj => obj.name == nodeId || obj.parent == nodeId)
    //console.log(list)
    if (node) {
      setRootNode(nodeId);
      let tree = generateFlowChart(nodeId, overAllList);
      setTreeList(tree);
      setShowTreeViewContainer(true);
    } else {
      toast.error("Searched Node is not present in the Tree");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setDeleteFlag(false);
    setdeleteMsg("");
    setDeleteNode({});
  };

  const getModalData = (obj) => {
    //console.log(obj)
    let node = {
      stageName: obj.stage.stageName,
      stageId: obj.stage._id,
      statusName: obj.status.statusName,
      statusId: obj.status._id,
      cycleName: obj.stage?.cycleId?.cycleName,
      cycleId: obj.stage?.cycleId?._id,
      journeyName: obj.stage?.cycleId?.journeyId?.journeyName,
      journeyId: obj.stage?.cycleId?.journeyId?._id,
      name: `${obj.stage.stageName} ${obj.status.statusName}`,
      parent: obj.parent,
      uniqueLabel: `${obj.stage.stageName} ${obj.status.statusName} ${obj.parent}`,
      ruleId: obj.ruleId,
      ruleName: obj.ruleName,
      x: 500,
      y: 20,
      newFlag: true,
    };
    addNode(node, rootNode);
  };

  const handleIconClick = (node) => {
    let obj = overAllList.find((obj) => obj.name == node.id);
    // console.log(obj,node)
    setCurrentSelectedId(obj);
    setShowModal(true);
  };

  const onDeleteNode = () => {
    let node = deleteNodeObj;
    if (deleteNodeObj) {
      let toBeDeleted = overAllList.filter((elem) => elem.parent == node.id);
      toBeDeleted.push(node);
      let deletedNames = toBeDeleted.map((elem) => elem.uniqueLabel);
      let list = overAllList.filter(
        (elem) => deletedNames.indexOf(elem.uniqueLabel) < 0
      );
      let obj = { list, toBeDeleted };
      for (let nodeObj of obj.list) {
        obj = checkNodeValidity(nodeObj, obj);
      }
      let deleteList = obj.toBeDeleted.filter((obj) => obj._id);
      setDeletedList(deleteList);
      //setOverAllList(obj.list)
      let tree = generateFlowChart(rootNode, obj.list);
      setTreeList(tree);
    }
    setdeleteMsg("");
    setDeleteNode({});
    setDeleteFlag(false);
  };

  const handleRemoveIconClick = (node) => {
    setdeleteMsg(
      `Are You Sure, you want to Delete '${node.name}'? \n Note:- This will delete all its child nodes as well`
    );
    setDeleteNode(node);
    setDeleteFlag(true);
  };

  const checkNodeValidity = (node, listObj) => {
    let parent = node.parent
      ? listObj.list.filter((obj) => obj.name == node.parent)
      : ["abcd"];
    if (parent.length <= 0) {
      let toBeDeleted = listObj.list.filter((obj) => obj.parent == node.id);
      listObj.toBeDeleted = [node, ...listObj.toBeDeleted, ...toBeDeleted];
      let deletedNames = toBeDeleted.map((obj) => obj.uniqueLabel);
      deletedNames.push(`${node.name} ${node.parent}`);
      listObj.list = listObj.list.filter(
        (obj) => deletedNames.indexOf(obj.uniqueLabel) < 0
      );
      for (let nodeObj of listObj.list) {
        listObj = checkNodeValidity(nodeObj, listObj);
      }
    }
    return listObj;
  };

  const checkDisability = (name) => {
    if (name === "cycle") {
      if (_.isEmpty(journey)) {
        return true;
      }
    } else if (name === "stage") {
      if (_.isEmpty(cycle)) {
        return true;
      }
    } else if (name === "status") {
      if (_.isEmpty(stage)) {
        return true;
      }
    }
  };

  const handleOnSave = (e) => {
    e.preventDefault();
    let addList = overAllList.filter((obj) => obj.newFlag);
    let deleteList = deletedList.map((obj) => obj._id).filter(String);
    submitManageStageStatus({ addList, deleteList });
  };

  const submitManageStageStatus = (data) => {
    //console.log("datattatatatt",data)
    if (validateManageStageStatus(data)) {
      createManageStageStatus(data)
        .then((res) => {
          if (res?.message) {
            toast.success(res?.message);
            setInitials();
            fetchPreviewMap();
          } else if (res?.data?.statusCode === 0) {
            let { errorMessage } = res?.data?.error;
            toast.error(errorMessage);
          } else {
            console.error(res);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const validateManageStageStatus = (obj) => {
    if (obj.addList.length < 0 && obj.deleteList < 0) {
      toast.error("List Should have atleast one new node");
      return false;
    } else {
      return true;
    }
  };

  const handleClear = () => {
    setRootNode("");
    setJourney({});
    setCycle({});
    setStage({});
    setStatus({});
    setTreeList({ name: "", children: [] });
    setShowTreeViewContainer(false);
    setOverAllList([]);
  };

  const setInitials = () => {
    setJourney({});
    setCycle({});
    setStage({});
    setStatus({});
    setShowTreeViewContainer(false);
    localStorage.removeItem("treePreview");
    localStorage.removeItem("fields");
  };

  const fetchCycleList = () => {
    let data = { journeyId: journey.value };
    getAllCycleNames(data).then((res) => {
      if (res?.result) {
        const modifiedCycleList = res.result.map((cycle) => {
          cycle.label = cycle.cycleName;
          cycle.value = cycle._id;
          return cycle;
        });
        setCycleList(modifiedCycleList);
      }
    });
  };

  const fetchJourneyList = () => {
    getActiveJourneys().then((res) => {
      if (res?.result) {
        const modifiedJourneyList = res.result.map((journey) => {
          journey.label = journey.journeyName;
          journey.value = journey._id;
          return journey;
        });
        setJourneyList(modifiedJourneyList);
      } else {
        console.error(res);
      }
    });
  };

  const fetchStageList = () => {
    let data = { cycleId: cycle.value };
    getAllStages(data).then((res) => {
      //console.log("getAllStages res",res)
      if (res?.result) {
        const modifiedStageList = res.result.map((stage) => {
          stage.label = stage.stageName;
          stage.value = stage._id;
          return stage;
        });
        setStageList(modifiedStageList);
      } else {
        console.error(res);
      }
    });
  };

  const fetchStatusList = () => {
    let data = { stageId: stage.value };
    getAllStatus(data).then((res) => {
      if (res?.result) {
        const modifiedStatusList = res.result.map((status) => {
          status.label = status.statusName;
          status.value = status._id;
          return status;
        });
        setStatusList(modifiedStatusList);
      } else {
        console.error(res);
      }
    });
  };

  const fetchPreviewMap = () => {
    getPreviewMap({ journeyId: journey._id }).then((res) => {
      if (res?.result) {
        //console.log(res.result)
        if (res.result.length > 0) {
          let list = res.result;
          list = list.map((obj) => {
            return {
              ...obj,
              uniqueLabel: `${obj.stageName} ${obj.statusName} ${obj.parent}`,
              newFlag: false,
            };
          });
          let tree = generateFlowChart(rootNode, list);
          console.log(tree, 'testTreeData')
          setTreeList(tree);
          setShowTreeViewContainer(true);
        } else {
          setTreeList({ name: "", children: [] });
          setShowTreeViewContainer(false);
          setOverAllList([]);
        }
      } else {
        console.error(res);
      }
    });
  };

  const handlePositionChange = (nodeId, x, y) => {
    let list = overAllList.map((obj) => {
      if (obj.name == nodeId) {
        obj = {
          ...obj,
          x: x,
          y: y,
          newFlag: true,
        };
        return obj;
      } else {
        return obj;
      }
    });
    setOverAllList(list);
  };

  const sortedOptions = useMemo(
    () =>
      journeyList.sort(({ label: labelA = "" }, { label: labelB = "" }) =>
        labelA.localeCompare(labelB)
      ),
    [journeyList]
  );

  useEffect(() => {
    fetchJourneyList();
    //fetchPreviewMap();
  }, []);

  useEffect(() => {
    //console.log(journey)
    if (!_.isEmpty(journey)) {
      fetchPreviewMap();
      fetchCycleList();
    }
  }, [journey]);

  useEffect(() => {
    if (!_.isEmpty(cycle)) {
      fetchStageList();
    }
  }, [cycle]);

  useEffect(() => {
    if (!_.isEmpty(stage)) {
      fetchStatusList();
    }
  }, [stage]);

  return (
    <>
      <Page title="Manage Stage Status">
        <Container className={classes.container}>
          <Breadcrumbs
            separator={<img src={BreadcrumbArrow} alt="Arrow" />}
            aria-label="breadcrumb"
            sx={{ mb: "15px" }}
          >
            {breadcrumbs}
          </Breadcrumbs>
          <Grid className={classes.cusCard}>
            <Container sx={{ mt: "22px" }}>
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <Item>
                    <b style={{ fontWeight: 600, fontSize: 18 }}>
                      Rule Creation I Stage to Condition Mapping
                    </b>
                    {/* <Typography className={classes.subTitle}>Loremispum Loremispum Loremispum</Typography> */}
                  </Item>
                </Grid>
              </Grid>
            </Container>

            <Container sx={{ mt: "20px", mb: "25px" }}>
              <Grid container spacing={3}>
                <Grid xs={5}>
                  <Item id="JourneySelect">
                    <label className={classes.label}>Select Journey</label>
                    <ReactSelect
                      classNamePrefix="select"
                      Placehoder="Select"
                      options={journeyList}
                      value={journey}
                      onChange={(e) => handleSelectChange(e, "journey")}
                    />
                  </Item>
                </Grid>
                <Grid xs={5}>
                  <Item id="CycleSelect">
                    <label className={classes.label}>Cycle Name</label>
                    <ReactSelect
                      options={cycleList}
                      value={cycle}
                      onChange={(e) => handleSelectChange(e, "cycle")}
                      // disabled={checkDisability('cycle')}
                      // disabled={true}
                      isDisabled={checkDisability("cycle")}
                    />
                  </Item>
                </Grid>
              </Grid>
            </Container>

            <Container sx={{ mt: "20px", mb: "25px" }}>
              <Grid container spacing={3} sx={{ mt: "16px" }}>
                <Grid xs={5}>
                  <Item id="StageSelect">
                    <label className={classes.label}>From Stage</label>
                    <ReactSelect
                      classNamePrefix="select"
                      options={stageList}
                      value={stage}
                      onChange={(e) => handleSelectChange(e, "stage")}
                      isDisabled={checkDisability("stage")}
                    />
                  </Item>
                </Grid>
                <Grid xs={5}>
                  <Item id="StatusSelect">
                    <label className={classes.label}>From Status</label>
                    <ReactSelect
                      classNamePrefix="select"
                      options={statusList}
                      value={status}
                      onChange={(e) => setStatus(e)}
                      isDisabled={checkDisability("status")}
                    />
                  </Item>
                </Grid>
              </Grid>
              <br />
            </Container>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ mt: "16px" }}
          >
            <Button
              color="primary"
              // autoFocus
              className="submit"
              variant="outlined"
              onClick={handleClear}
              sx={{ marginRight: "20px", padding: "5px 20px" }}
            >
              Clear
            </Button>
            <Button
              color="primary"
              // autoFocus
              className="submit"
              variant="outlined"
              onClick={handleOnSubmit}
              sx={{ marginRight: "20px", padding: "5px 20px" }}
            >
              Submit
            </Button>
            <Button
              color="primary"
              // autoFocus
              className="submit"
              variant="contained"
              onClick={handleOnSave}
              disabled={submitButtonDisabled}
            >
              Save
            </Button>
          </Grid>
        </Container>

        {showTreeViewContainer && (
          <Container className={classes.container}>
            <Grid
              style={{ background: "#F6FAFC" }}
              mt={2}
              className={classes.cusCard}
            >
              <FlowDiagram
                data={treeList}
                customLabel={customElement}
                handleIconClick={handleIconClick}
                handleRemoveIconClick={handleRemoveIconClick}
                onPositionChange={handlePositionChange}
              />
            </Grid>
          </Container>
        )}

        <AddStageStatusModal
          showModal={showModal}
          closeModal={closeModal}
          getModalData={getModalData}
          currentObj={currentSelectedId}
        />
        <DeleteModal
          modalOpenFlag={deleteFlag}
          onCancel={closeModal}
          onSubmit={onDeleteNode}
          deleteMsg={deleteMsg}
        />
      </Page>
    </>
  );
}
