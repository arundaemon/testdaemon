import AddIcon from '@mui/icons-material/Add';
import { Alert, Container, Grid, InputAdornment, TextField } from "@mui/material";
import { makeStyles } from '@mui/styles';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '../assets/icons/icon_search.svg';
import Page from "../components/Page";
import Controls from '../components/controls/Controls';
import { SourceTable } from '../components/sourceManagement';
import { addUpdateNewSource, getAllSourcesList, getAllSubSourcesList } from '../config/services/packageBundle';
import { getUserData } from '../helper/randomFunction/localStorage';
import Loader from "./Loader";
import Pagination from "./Pagination";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto'
    },
    modalPaper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #fff',
        boxShadow: '0px 0px 4px #0000001A',
        minWidth: '300px',
        borderRadius: '4px',
        textAlign: 'center',
    },
    modalTitle: {
        fontSize: '18px',
    },
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
        border: '1px solid #F45E29',
        borderRadius: '4px',
        fontWeight: 'normal',
        padding: '0.5rem 1.5rem'
    }
}));

export default function SourceManagement() {

    const [pageNo, setPagination] = useState(1);
    const [searchBy, setSearchBy] = useState({
        sourceName: "source_name",
        sourceId: "source_id",
    });
    const [subSourceList, setSubSourceList] = useState([])
    const [loader, setLoading] = useState(false);
    const [itemsPerPage] = useState(10);
    const [sortObj, setSortObj] = useState({ sortKey: 'source_id', sortOrder: 'DESC' });
    const [sourceList, setSourceList] = useState([]);
    const [lastPage, setLastPage] = useState(false)
    const [search, setSearchValue] = useState("");
    const data = getUserData('loginData')
    const uuid = data?.uuid
    const classes = useStyles();
    const navigate = useNavigate();

    const handleSort = (key) => {
        let newOrder = sortObj?.sortOrder === 'DESC' ? 'ASC' : 'DESC'
        setSortObj({ sortKey: key, sortOrder: newOrder })
    }

    const handleStatusToggle = async (e, sourceDetails) => {
        let status = sourceDetails?.status === 1 ? 2 : 1
        sourceDetails.status = status
        sourceDetails.uuid = uuid

        let params = {
            uuid: uuid,
            source_id: sourceDetails?.source_id,
            search_by: "sub_source_name",
            search_val: "",
            order_by: "sub_source_id",
            order: "DESC",
            status: [1, 2]

        }

        try {
            const result = await getAllSubSourcesList(params);
            let data = result?.data?.sub_source_list
            const statusArray = data?.map(item => item.status);

            if (statusArray.includes(1) && status === 2) {
                toast.error("Sub-source are still active for this source")
            } 
            else if(!statusArray.includes(1))
            {
                addUpdateNewSource(sourceDetails)
                    .then((res) => {
                        if (res?.data?.status === 1) {
                            toast.success("Source status changed successfully!")
                            fetchSourceList()

                        }
                        else if (res?.data?.status === 0) {
                            toast.error(res?.data?.message)
                        }
                        else {
                            console.error(res);
                        }
                    })
                    .catch((err) => {
                        console.error(err, "::err");
                    })
            }

        } catch (error) {
            console.error('An error occurred:', error);
        }

 }


    const fetchSourceList = () => {
        let params = {
            uuid: uuid,
            page_offset: (pageNo - 1),
            page_size: itemsPerPage,
            search_by: searchBy.sourceName,
            search_val: search,
            order_by: sortObj.sortKey,
            order: sortObj.sortOrder,
            status: [1, 2]
        }
        setLoading(true)
        setLastPage(false)
        getAllSourcesList(params)
            .then((res) => {
                let data = res?.data?.source_list
                setSourceList(data);
                if (data?.length < itemsPerPage) setLastPage(true)
                setLoading(false)
            })
            .catch(err => console.error(err))
    }

    const handleAddSource = () => {
        let url = `/authorised/add-source`;
        navigate(url);

    }

    const handleAddSubSource = () => {
        let url = `/authorised/add-sub-source`;
        navigate(url);
    }

    const handleSearch = _.debounce((e) => {
        let { value } = e.target;
        if (value.trim() !== '') {
            setPagination(1);
            setSearchValue(value.trim(), () => setPagination(1));
        } else
            setSearchValue("")
    }, 600);

    useEffect(() => fetchSourceList(), [search, pageNo, itemsPerPage, sortObj]); //removed sortObj


    return (
        <>
            <Page title="Extramarks | Source Management" className="main-container datasets_container">
                <Container className='table_max_width'>
                    <Grid container alignItems="left" justifyContent="flex-start" mb={2} spacing={2} >
                        <Grid item xs={12} sm={6} md={6} lg={4} className="datasets_header" >
                            <TextField className={`inputRounded search-input`} type="search"
                                placeholder="Search By Source Name"
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
                        </Grid>

                        <Grid container item xs={6} sm={6} md={6} lg={8} justifyContent="flex-end" display="flex" spacing={2.5}>
                            <Grid item xs={6} sm={6} md={6} lg={4} >
                                <Controls.Button
                                    sx={{ marginRight: '20px' }}
                                    text="New Source"
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    className="cm_ui_button"
                                    onClick={() => handleAddSource()}
                                />
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={4} >

                                <Controls.Button
                                    text="New Sub Source"
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    className="cm_ui_button"
                                    onClick={() => handleAddSubSource()}
                                />
                            </Grid>
                        </Grid>

                    </Grid>

                    {loader && <Loader />}
                    {sourceList && sourceList.length > 0 ? <SourceTable list={sourceList} pageNo={pageNo} itemsPerPage={itemsPerPage} handleStatusToggle={handleStatusToggle} handleSort={handleSort} sortObj={sortObj} /> :
                        <Alert severity="error">No Content Available!</Alert>}
                </Container>
                <div className='center cm_pagination'>
                    <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} />
                </div>
            </Page>
        </>
    )
}
