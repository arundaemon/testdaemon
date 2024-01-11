import { Box, Button, Checkbox, FormControl, Grid, ListItemText, MenuItem, Radio, Select, Typography, stepperClasses } from "@mui/material";
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getBoardList, getChildList } from '../../config/services/lead';
import { masterDataList } from '../../config/services/packageBundle';
import { useStyles } from "../../css/SchoolDetail-css";
import ContentTable from './ContentTable';
import { getUserData } from "../../helper/randomFunction/localStorage";
import { convertLength } from "@mui/material/styles/cssUtils";
import { fetchClassFromBoard } from "../../helper/DataSetFunction";



const MenuProps = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
  getContentAnchorEl: null,
  style: {
    position: 'absolute',
    zIndex: 1000,

  },
};



const ContentInformation = (props) => {
  let { userTypeData, contentData, updatePackageContentData, updateUserType } = props


  const classes = useStyles();
  const [boardIndicator, setBoardIndicator] = useState({})
  const [board, setBoard] = useState({})
  const [clas, setClas] = useState([])
  const [entry, setEntry] = useState({})
  const [userType, setUserType] = useState([])
  const [tableData, setTableData] = useState([])
  const [boardIndicatorList, setBoardIndicatorList] = useState([])
  const [matchBoardList, setMatchBoardList] = useState([])
  const [boardList, setBoardList] = useState([])
  const [classList, setClassList] = useState([])
  const [compareClassList, setCompareClassList] = useState([])
  const [updateClassList, setUpdateClassList] = useState([])
  const [entityList, setEntityList] = useState([])
  const [userTypeList, setUserTypeList] = useState([])
  const loginData = getUserData('loginData')
  const [isUpdate, setIsUpdate] = useState(false)
  const uuid = loginData?.uuid


  const ContentFormValidation = (formdata) => {
    let { board_indicator_id, board_id, class_id } = formdata

    if (board_indicator_id == undefined) {
      toast.error('Board Indicator is  Mandatory')
      return false
    }
    else {
      return true
    }
  }


  const getBoardIndicatorList = () => {
    let params = {
      status: [1, 2, 3],
      master_data_type: "package_board_indicators",
      uuid: uuid
    }
    masterDataList(params)
      .then((res) => {
        let list = res?.data?.master_data_list
        setBoardIndicatorList(list)

      }).catch(err => console.error(err))
  }

  const getBoardListHandler = async () => {
    let params = { params: { boardStage: 1, sapVisibility: 1 } };
    let boardFormattedData = [];
    await getBoardList(params)
      .then((res) => {
        if (res?.data) {
          setMatchBoardList(res?.data?.data)
          res?.data?.data?.forEach((element) => {
            boardFormattedData.push({
              value: element.board_id,
              label: element.name,
            });
          });
        }
      })
      .catch((err) => {
        if (err.response.status == 401) {
          getBoardListHandler();
        }
        console.error(err?.response);
      });


    const objectsToStore = [];
    if (boardIndicator?.id === 1) {
      const filteredData = boardFormattedData?.filter(obj => {
        if (obj.value === 596 || obj.value === 606) {
          objectsToStore.push(obj);
          return false;
        }
        return true;
      });
      setBoardList(filteredData);

    }
    else if (boardIndicator?.id === 2) {
      const filteredData = boardFormattedData?.filter(obj => {
        if (obj.value === 596 || obj.value === 606) {
          objectsToStore.push(obj);
          return false;
        }
        return true;
      });
      setBoardList(objectsToStore);
    }
    else {
      setBoardList(boardFormattedData);
    }

  };



  const getClassData = async (boardName) => {
    let classData = [];
    try {
      let res = await fetchClassFromBoard(boardName);
      res = res?.loadResponses?.[0]?.data;
      res?.map((data) => {
        classData.push({
          label: data?.["SyllabusBoardClassMaster.className"],
          value: data?.["SyllabusBoardClassMaster.classId"],
        });
      });

    } catch (err) {
      console.error(err?.response);
    }
   
    return classData;
  };



  const getEntityList = () => {
    let params = {
      status: [1, 2, 3],
      master_data_type: "package_entities",
      uuid: uuid
    }
    masterDataList(params)
      .then((res) => {
        let list = res?.data?.master_data_list
        setEntityList(list)

      }).catch(err => console.error(err))

  }


  const getUserTypeList = () => {
    let params = {
      status: [1, 2, 3],
      master_data_type: "package_user_types",
      uuid: uuid
    }
    masterDataList(params)
      .then((res) => {
        let list = res?.data?.master_data_list
        setUserTypeList(list)

      }).catch(err => console.error(err))

  }

  const handleBoardIndicatorChange = (event) => {
    let data = event?.target?.value
    setBoardIndicator(data)
    setBoard({})
    setClas([])
   
  }

  const handleBoardChange = (event) => {
    let data = event?.target?.value
    setBoard(data)
   
  }

  const handleClassChange = (event) => {
    let data = event?.target?.value
    setClas(data);
  }


  const handleEntryChange = (event) => {
    let data = event?.target?.value
    setEntry(data)
  }

  // const handleUserTypeChange = (event) => {
  //   let data = event?.target?.value
  //   setUserType(data)
  // }

  useEffect(() => {
    if (userType.length > 0) {
      const userTypeid = userType?.map(item => item.id);
      const userTypeName = userType?.map(item => item.name);
      const entityId = entry?.id
      let obj = {
        entity_id: entityId,
        user_type_id: userTypeid,
        user_type_name: userTypeName
      }

      userTypeData(obj)
    }
  }, [userType])

  const checkForDuplicate = (value) => {
    let flag = true;
    tableData.forEach((item) => {
      if (value?.board_indicator_id == item?.board_indicator_id && value?.board_id == item?.board_id && _.isEqual(value?.class, item?.class)) {
        flag = false;
      }
    })
    return flag;
  }



  const addCondition = () => {
    let newObj = {
      board_indicator_id: boardIndicator?.id?.toString(),
      board_indicator_name:boardIndicator?.name,
      board_id: board?.value ? board?.value?.toString() : "",
      board_name: board?.label,
      class_id: clas.map(item => item.value.toString()),
      class: clas.map(item => (item.label)),
    }


    if (checkForDuplicate(newObj)) {
      if (ContentFormValidation(newObj)) {
        let cloneData = _.cloneDeep(tableData);
        cloneData.push(newObj);
        setTableData(cloneData)
        setBoard({})
        setClas([])
        setBoardIndicator({})
      }

    }
    else {
      toast.error("This Condition already exists")
    }

  }

  const saveTableData = () => {
    if (tableData.length === 0) {
      let newObj = {
        board_indicator_id: boardIndicator?.id,
        board_indicator_name:boardIndicator?.name,
        board_id: board?.value ? board?.value : "",
        board_name: board?.label,
        class_id: clas.map(item => item.value.toString()),
        class: clas.map(item => (item.label)),
      }
      if (ContentFormValidation(newObj)) {
        let cloneData = _.cloneDeep(tableData);
        cloneData.push(newObj);
        setTableData(cloneData);
        setBoard({})
        setClas([])
        setBoardIndicator({})
      }
    }
    else {
      let cloneData = _.cloneDeep(tableData);
      setTableData(cloneData);

    }


  };


  const handleDeleteRow = (rowData) => {
    const arrayAfterDelete = tableData?.filter((element) => {
      return element?.board_id !== rowData?.board_id || element?.board_indicator_id !== rowData?.board_indicator_id || element?.board_name !== rowData?.board_name || !(_.isEqual(element?.class, rowData?.class));
    });
    setTableData(arrayAfterDelete)
    setBoard({})
    setClas([])
    setBoardIndicator({})
  }

  useEffect(() => {
    getBoardIndicatorList()
    getEntityList()
    getUserTypeList()
  }, []);

   
  const fetchBoardClass = async (board) => {
    await getBoardListHandler()
    let list = await getClassData([board?.value])
    setClassList(list);
    setCompareClassList(list)
   
    if (tableData?.length > 0) {
      const hasMatchingObject = tableData?.some(obj => obj.board_indicator_id == boardIndicator?.id && parseInt(obj.board_id) == board?.value);
      if (hasMatchingObject) {
        const matchingObj = tableData?.filter(item => item.board_name === board?.label && item?.board_indicator_id
          == boardIndicator?.id);
        const matchingClasses = matchingObj?.map(item => {
          const matchingLabels = list?.filter(obj =>
            item.class.includes(obj?.label)
          );
          return matchingLabels;
        })
          .flat();

        if (matchingClasses?.length > 0) {
          const filteredData = list?.filter(item => !matchingClasses.some(valueToRemove => item?.value === valueToRemove.value));
          setClassList(filteredData)
        }
        else {
          setClassList(compareClassList)
        }
      }
    }

  };
 

  const fetchBoardClassDefault = async () => {
    await getBoardListHandler()

  }

  useEffect(() => {
    if (Object.entries(board)?.length > 0) {
      fetchBoardClass(board)
    }
    else {
      fetchBoardClassDefault()
    }
  }, [board, boardIndicator]);



  const fetchBoardClassinUpdate = async (boardId) => {
    let list = await getClassData(boardId)
    return list;

  }


  useEffect(() => {
    contentData(tableData)
  }, [tableData])




  const matchAndSetBoardName = (data, listofboard) => {
    return data?.map((boardItem) => {
      const board = listofboard.find((item) => {
        return boardItem?.board_id == item?.board_id
      }
      )

      if (board) {
        boardItem.board_name = board?.name
      }
      return boardItem
    })

  }

  const TableDataForUpdate = (data) => {
    return data.map((item) => ({
      board_indicator_id: item.board_indicator_id,
      board_indicator_name: item.board_indicator_name,
      board_id: item.board_id,
      board_name: item.board_name,
      class_id: item.package_content_classes.map((classItem) => classItem.class_id),
    }));
  };




  const findClassNames = (obj, list) => {
    const classNames = [];
    obj.class_id.forEach(id => {
      const matchedClass = list?.find(item => item.value == id);
      if (matchedClass) {
        classNames.push(matchedClass.label);
      }
    });

    return classNames;
  }




  useEffect(async () => {
    if (!isUpdate) {
      if (updatePackageContentData?.length > 0 && matchBoardList?.length > 0) {
        let data = updatePackageContentData
        const boardIds = data?.map(content => content.board_id)?.filter((value, index, self) => self.indexOf(value) === index);
        let finalData = [];
        try {
          let result = await fetchBoardClassinUpdate(boardIds);
          let newData = matchAndSetBoardName(data, matchBoardList);
          finalData = TableDataForUpdate(newData);
          finalData.forEach(obj => {
            obj.class = findClassNames(obj, result);
          });
        } catch (error) {
          console.error(error);
        }

        setTableData(finalData)
        let entry = updateUserType
        const entityObj = {
          id: entry?.entity_id,
          name: entry?.entity_name
        };
        setEntry(entityObj)
        if (entry?.entity_user_types.length > 0) {
          const userTypearray = entry?.entity_user_types?.map((item) => ({
            id: item?.user_type_id,
            name: item?.user_type_name,
            status: 1
          }));
          setUserType(userTypearray)
        }
        setIsUpdate(true)
      }
    }
  }, [updatePackageContentData, matchBoardList, updateUserType]);




  const handleUserTypeChange = (item) => {
    const itemIndex = userType.findIndex(obj => obj.id === item.id);
    if (itemIndex !== -1) {
      const updatedChannel = [...userType];
      updatedChannel.splice(itemIndex, 1);
      setUserType(updatedChannel);
    } else {
      setUserType([...userType, item]);
    }
  };


  return (
    <>
      <Grid className={classes.cusCard}>
        <Grid container spacing={3} sx={{ py: "8px" }}>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>Board Indicators<span style={{ color: 'red' }}>*</span></Typography>
              <FormControl sx={{ m: 0.5, width: 250, position: 'relative' }} >
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  className={classes.selectNew}
                  value={boardIndicator}
                  onChange={handleBoardIndicatorChange}
                  renderValue={(selected) => selected?.name}
                  MenuProps={MenuProps}
                >
                  {boardIndicatorList?.map((board) => (
                    <MenuItem key={board?.id} value={board}>
                      <Radio checked={boardIndicator?.id === board?.id} />
                      <ListItemText primary={board?.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

            </Grid>
          </Grid>
          <Grid item md={4} xs={4}>
            <Grid>
              <Typography className={classes.label}>Board</Typography>
              <FormControl sx={{ m: 0.5, width: 250, position: 'relative' }}>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  className={classes.selectNew}
                  value={board}
                  onChange={handleBoardChange}
                  renderValue={(selected) => selected?.label}
                // MenuProps={MenuProps}

                >
                  {boardList?.map((item) => (
                    <MenuItem key={item?.value} value={item}>
                      <Radio checked={board?.value === item?.value} />
                      <ListItemText primary={item?.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>Class</Typography>
              <FormControl sx={{ m: 0.5, width: 250, position: 'relative' }}>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  className={classes.selectNew}
                  multiple
                  value={clas}
                  onChange={handleClassChange}
                  renderValue={(selected) => selected?.map((x) => x?.label).join(', ')}
                  MenuProps={MenuProps}
                >
                  {classList?.map((item) => {
                    return (

                      <MenuItem key={item?.value} value={item} >
                        <Checkbox checked={clas?.indexOf(item) > -1} />
                        {/* <Checkbox checked={clas.some((obj) => obj.value === item.value)} /> */}
                        <ListItemText primary={item?.label} />
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid item md={12} xs={12}>
            <Box className="lead-btn-group" display='flex' justifyContent='flex-end'>
              <Button
                variant="outlined"
                color='primary'
                size='large'
                onClick={addCondition}
                disabled={tableData?.length === 0 ? true : false}
              >
                Add More
              </Button>
              <Button
                variant="contained"
                color='primary'
                size='large'
                onClick={saveTableData}
                disabled={tableData?.length > 0 ? true : false}
              >
                Save
              </Button>
            </Box>

          </Grid>

          <ContentTable tableData={tableData} handleDeleteRow={handleDeleteRow} />

          <Grid item md={4} xs={4}>
            <Grid>
              <Typography className={classes.label}>
                Entity
                <span style={{ color: 'red' }}>*</span>
              </Typography>
              <FormControl sx={{ m: 0.5, width: 250, position: 'relative' }}>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  className={classes.selectNew}
                  value={entry}
                  onChange={handleEntryChange}
                  renderValue={(selected) => selected?.name}
                //  MenuProps={MenuProps}

                >
                  {entityList?.map((item) => (
                    <MenuItem key={item?.id} value={item}>
                      <Radio checked={entry?.id === item?.id} />
                      <ListItemText primary={item?.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>
                User Type
                <span style={{ color: 'red' }}>*</span>
              </Typography>
              <FormControl sx={{ m: 0.5, width: 250, position: 'relative' }}>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  className={classes.selectNew}
                  multiple
                  value={userType}
                  renderValue={(selected) => selected?.map((x) => x?.name).join(', ')}
                  MenuProps={MenuProps}
                >
                  {userTypeList?.map((item) => (
                    <MenuItem key={item?.id} value={item}>
                      {/* <Checkbox checked={userType?.indexOf(item) > -1} /> */}
                      {/* <Checkbox checked={userType.some((obj) => obj.id === item.id)} />  */}
                      <Checkbox checked={userType.findIndex(obj => obj.id === item.id) !== -1}
                        onChange={() => handleUserTypeChange(item)}
                      />
                      <ListItemText primary={item?.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default ContentInformation
