import React, { useEffect, useState } from 'react';
import moment from 'moment';
import {  Checkbox, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import _, { noop } from 'lodash';
import UpArrow from '../../assets/image/arrowUp.svg'
import DownArrow from '../../assets/image/arrowDown.svg'
import LeadScore from './LeadScore';
import { makeStyles } from '@material-ui/core/styles';
import CubeDataset from "../../config/interface";
const useStyles = makeStyles({
    cusCard1: {
        padding: "10px 10px 10px 35px",
        height: '180px',
        width: '100%',
        boxShadow: "0px 0px 8px #00000029",
        marginBottom: '10px',
        position: 'relative'
    },
    cusCheckbox: {
        position: "absolute",
        top: '10px',
        left: '8px',
        padding: '0',
    },
    title: {
        fontWeight: "600",
        marginBottom: "6px",
        textTransform: "capitalize",
        fontSize:'14px',
        "& a": {
            textDecoration: "none",
        }
    },
    disc: {
        fontSize: "14px",
    }
});

export default function LeadCard(props) {
    let { list,filtersApplied, getRowIds, pageNo, itemsPerPage, handleSort, sortObj, isMyLeadPage = false } = props;
    const dataSetIndex = filtersApplied.length > 0 ? CubeDataset.LeadassignsBq:CubeDataset.Leadassigns
    const classes = useStyles();
    const [checkedList, setCheckedList] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
   

    const handleChange = (e, data) => {
        if (!e.target.checked) {
            let newFilteredArray;
            if (!selectAll) {

                if(isMyLeadPage){
                    newFilteredArray = checkedList.filter((item) => item[dataSetIndex.Id]  != data[dataSetIndex.Id] );
                }else{
                    newFilteredArray = checkedList.filter((item) => (item[CubeDataset.Leads.Id]  != data[CubeDataset.Leads.Id]));
                }

                setCheckedList([...newFilteredArray])
            }
            if (selectAll) {
                if(isMyLeadPage){
                    newFilteredArray = list.filter((item) => item[dataSetIndex.Id]  != data[dataSetIndex.Id]);
                }else{
                    newFilteredArray = list.filter((item) => item[CubeDataset.Leads.Id]  != data[CubeDataset.Leads.Id]);
                }
                setCheckedList([...newFilteredArray]);
                setSelectAll(false)
            }
        } else {
            setCheckedList([...checkedList, data])
        }
    };

    const handleChangeSelectAll = (e, data) => {
        if (e.target.checked) {
            setSelectAll(true)
            setCheckedList([...checkedList, data])
        } else {
            setSelectAll(false)
            setCheckedList([])
        }
    }

    const getChecked = (data, index) => {
        let filterredArray;
        if(isMyLeadPage){
            filterredArray = checkedList.filter((item, index) => (item[dataSetIndex.Id]  == data[dataSetIndex.Id]));
        }else{
            filterredArray = checkedList.filter((item, index) => (item[CubeDataset.Leads.Id]  == data[CubeDataset.Leads.Id]));
        }
        if (filterredArray.length == 0) {
            return false;
        } else {
            return true
        }
    }

    const handleSortIcons = (leadKey, userKey) => {
        return (
            <div className="arrowFilterDesign">
                <div className="upArrow" onClick={() => handleSort(leadKey, userKey)}>
                    {sortObj?.sortLeadKey !== leadKey || sortObj?.sortUserKey !== userKey || sortObj?.sortOrder === "desc" ? <img src={UpArrow} alt="" /> : null}
                </div>

                <div className="downArrow" onClick={() => handleSort(leadKey, userKey)}>
                    {sortObj?.sortLeadKey !== leadKey || sortObj?.sortUserKey !== userKey || sortObj?.sortOrder === "asc" ? <img src={DownArrow} alt="" /> : null}
                </div>
            </div>
        );
    }

    useEffect(() => {
        getRowIds(checkedList)
    }, [checkedList])

    return (
        <div>
            {list && list.length > 0 &&
                list.map((row, i) => (
                    <div key={i} className={`crm-leads-card`}>
                        <Checkbox
                            className={`crm-leads-card-checkbox`}
                            name={isMyLeadPage ? row?.[dataSetIndex.name] : row?.[CubeDataset.Leads.name]}
                            checked={selectAll ? selectAll : getChecked(row)}
                            onChange={(e) => handleChange(e, row)}
                            sx={{
                                color: "#85888A",
                                '&.Mui-checked': {
                                    color: "#F45E29",
                                },
                            }}
                        />
                        <Typography className={`crm-leads-card-title`}>Name :
                            <span style={{
                                color: '#488109', cursor: 'pointer',
                                fontWeight: 'bold',
                            }}>
                                {
                                <Link to={`/authorised/listing-details/${isMyLeadPage ? row?.[dataSetIndex.leadId] : row?.[CubeDataset.Leads.Id]}`}> 
                                     { isMyLeadPage ? row?.[dataSetIndex.name] : row?.[CubeDataset.Leads.name]}
                                </Link>
                                }
                            </span>
                        </Typography>
                        <Typography className={`crm-leads-card-title`}>
                            Owner : {isMyLeadPage ? row?.[dataSetIndex.assignedToDisplayName] : row?.[CubeDataset.Leads.assignedToRoleName]}
                        </Typography>
                        <Typography className={`crm-leads-card-disc`}>
                            Source : {isMyLeadPage ? row?.[dataSetIndex.sourceName] : row?.[CubeDataset.Leads.sourceName]}
                        </Typography>
                        <Typography className={`crm-leads-card-disc`}>
                            Sub-Source : {isMyLeadPage ? row?.[dataSetIndex.subSourceName] : row?.[CubeDataset.Leads.subSourceName]}
                        </Typography>
                        <Typography className={`crm-leads-card-disc`}>
                            City : {isMyLeadPage ? row?.[dataSetIndex.city] : row?.[CubeDataset.Leads.city]}
                        </Typography>
                        <Typography className={`crm-leads-card-disc`}>
                             Created Date : {
                               isMyLeadPage ? 
                               moment(row?.[dataSetIndex.createdAt]).format('DD-MM-YYYY (HH:mm A)') 
                               : 
                               moment(row?.[CubeDataset.Leads.createdAt]).format('DD-MM-YYYY (HH:mm A)')}
                        </Typography>
                    </div>
                ))
            }
        </div>
    );
}
