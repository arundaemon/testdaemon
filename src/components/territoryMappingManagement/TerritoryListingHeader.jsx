import { InputAdornment, TextField } from '@mui/material';
import React from 'react'
import SearchIcon from '../../assets/icons/icon_search.svg';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from "@mui/styles";


const useStyles = makeStyles(() => ({
  header: {
    font: "normal normal 600 18px/24px Open Sans",
    letterSpacing: "0px",
    color: "#202124",
    marginTop: "-40px",
    marginBottom: "40px",
    fontSize: '21px',
    fontWeight: '500'
  },
  textField: {
    padding: '2px',
    width: '100%',
    fontSize: '14px',
    display: 'inline-flex',
    marginBottom: '1px'
  }
}))

const TerritoryListingHeader = ({ handleSearch }) => {
  const navigate = useNavigate();
  const classes = useStyles();

  const toCreateTerritory = () => {
    navigate('/authorised/create-territory')
  }

  return (
    <>
      <div style={{ textAlign: "right" }}>
        <div className='createNew_button' onClick={toCreateTerritory}>Add New</div>
      </div>
      <h4 className={classes.header} >Territory Listing</h4>
      <div className={classes.textField}>
        <TextField className={`inputRounded search-input`} type="search"
          placeholder="Search by ID, Territory, Modified by"
          onChange={handleSearch}
          InputLabelProps={{ style: { ...({ top: `${-7}px` }) } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <img src={SearchIcon} alt="" />
              </InputAdornment>
            ),
          }}
        />
      </div>
    </>
  )
}
export default TerritoryListingHeader