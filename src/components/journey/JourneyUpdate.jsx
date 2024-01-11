import React, { useState, useEffect } from 'react'
import { makeStyles } from '@mui/styles';
import { TextField, Typography, Button, Box, Grid, Alert } from '@mui/material';
import ReactSelect from 'react-select';
import { getJourney } from '../../config/services/journeys';
import { useParams, useLocation } from 'react-router-dom';



const useStyles = makeStyles((theme) => ({
    container: {
        margin: '0px 0px 0px 20px',
        width: '1144px',
        height: '664px',
        background: '#FFFFFF 0% 0% no-repeat padding-box',
        boxShadow: '0px 0px 8px #00000029',
        borderRadius: '8px',
        opacity: '1',

    },
    root: {
        margin: '0px 0px 0px 21px',
    },
    name: {
        display: "flex",

    },
    submitbtn: {

    },
    itemMapping: {
        display: "flex",
        justifyContent: 'space-between',
    },
    searchCondition: {
        display: "flex",
        justifyContent: 'space-between',

    },
    itemmapped: {
        // display: "flex",
        // justifyContent: 'space-between',

    },
    conditionTerms: {
        marginRight: "350px",
        fontWeight: "600",
    },
    box: {
        backgroundColor: "#FFEEDA",
        // border: "1px solid red"
        height: "40px",
        padding: "10px",

    },
    selectParameter: {
        width: "200px",
    },
    condition: {

    },
    conditionText: {
        width: "30%",
        margin: "5px"
    },
    deleteBtn: {
        height: "50px",
        margin: "5px 0px 0px 10px",
    }

}));

export default function JourneyUpdate() {

    const params = useParams();
    const stateVal = useLocation();

    // console.log(params)
    // console.log(stateVal);

    // const [data, setData] = useState({});



    //   const fetchData=()=>{

    //     getJourney()
    //     .then((res)=>res.json)
    //     .then(e=>setData(e));
    //     console.log(data);
    //   }

    //   useEffect(()=>{

    //     fetchData();

    //   },[])


    const classes = useStyles();
    return (
        <Box>
            <Typography variant='h4' marginLeft={"25px"}>Update the Journey </Typography>

            <Box>

                <Box className={classes.container}>
                    <Box className={classes.root}>
                        <br />

                        <Typography variant='h5'  >Journey Name</Typography>

                        <TextField
                            className={classes.JourneyName}
                            type="text"
                            placeholder='Journey name'
                            // value={data?.journeyName}
                        // onChange={(e) => { setJourneyName(e.target.value) }}
                        // value={journeyName}

                        />

                        <br />
                        <br />
                        <br />

                        <Typography variant='h5'>Condition</Typography>

                        <Box className={classes.box}>
                            <span className={classes.conditionTerms}>Parameter</span>
                            <span className={classes.conditionTerms}>Operator</span>
                            <span className={classes.conditionTerms}>Value</span>
                        </Box>

                        <br />
                        <Box>
                            <Box className={classes.searchCondition}>
                                <ReactSelect
                                    className={classes.selectParameter}
                                // options={parameter}
                                // onChange={(e) => handleSelectedCondition(e, 'parameter')}
                                // value={selectedCondition?.parameter ?? null}
                                />


                                <ReactSelect
                                    className={classes.selectParameter}
                                // options={operator}
                                // onChange={(e) => handleSelectedCondition(e, 'operator')}
                                // value={selectedCondition?.operator ?? null}
                                />
                                <TextField
                                    placeholder='Value'
                                // onChange={(e) => handleSelectedCondition(e, 'value')}
                                // value={selectedCondition?.value ?? null}
                                />

                                <Button

                                    variant='contained'
                                // onClick={addCondition}
                                >+</Button>

                            </Box>

                            <Box className={classes.itemmapped}>
                                {/* {
                              condition.map((e, i) =>
                               {

                                  return (

                                      <Box classname={classes.condition}>
                                          <TextField
                                              className={classes.conditionText}
                                              disabled
                                              value={e.parameter.label}
                                          />
                                          <TextField
                                              className={classes.conditionText}
                                              disabled
                                              value={e.operator.label}
                                          />
                                          <TextField
                                              className={classes.conditionText}
                                              disabled
                                              value={e.value}
                                          />
                                          <Button
                                              className={classes.deleteBtn}
                                              // type="submit"
                                              variant='contained'
                                              // onClick={(e) => { removeCondition(e, i) }}
                                          >-</Button>
                                      </Box>
                                  )
                              })
                          } */}
                            </Box>


                        </Box>
                        <br />

                        <Typography variant='h5'>Add Filter Logic</Typography>

                        <Box>
                            <TextField type="text" placeholder='1AND2OR3 or 1AND(2OR3)'
                            // onChange={(e) => { setFilterSql(e.target.value) }}
                            // value={filterSql}
                            />
                            <Button variant='contained'>Validate</Button>

                        </Box>
                        <br />

                        <Box className={classes.name}>
                            <Box>
                                <Typography variant='h5'>Created by</Typography>
                                <TextField type='text' placeholder='created by'
                                // onChange={(e) => { setCreatedBy(e.target.value) }}
                                // value={createdBy} 
                                />
                            </Box>
                            <Box>
                                <Typography variant='h5'>Last Modified By</Typography>
                                <TextField type='text' placeholder='last modified by'
                                // onChange={(e) => { setModifiedBy(e.target.value) }}
                                // value={modifiedBy} 
                                />
                            </Box>

                        </Box>
                    </Box>
                </Box>

                <Box className={classes.submitbtn}>
                    <Button variant='outlined' >Cancel</Button>

                    <Button type='submit'
                        color="primary" variant="contained"
                    //  onClick={handleSubmit}
                    >Update</Button>

                </Box>

            </Box>
        </Box>

    )
}






