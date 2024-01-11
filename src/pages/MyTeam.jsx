import { useEffect, useState } from 'react';
import { Container, TextField, Button, Alert, Grid, InputAdornment, Modal, Fade, Box, Typography } from '@mui/material'
import Page from "../components/Page";
import Loader from "./Loader";
import { MyTeamList } from '../components/MyTeam';
import { DecryptData } from '../utils/encryptDecrypt';
import SearchIcon from '../assets/icons/icon_search.svg';



const MyTeam = () => {
    let [teamList, setTeamList] = useState([]);
    let [search, setSearchValue] = useState('');

    const handleSearch = (e) => {
        let { value } = e.target;

        setSearchValue((prevValue) => {
            let newValue = value.trim();
            getTeamList(newValue);

            return newValue;
        });
    };

    const getTeamList = async (searchTerm = "") => {
        let data = DecryptData(localStorage.getItem("childRoles"));

        if (searchTerm !== "") {
            // console.log(search);

            let filterData = await data.filter(
                (item) =>
                    item.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.userName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setTeamList(filterData);
        } else {
            setTeamList(data);
        }

    };

    useEffect(() => {
        getTeamList(search)
    }, [search]

    );

    return (
        <>
            <Page title="Extramarks | My Team" className="main-container datasets_container">
                <Container className='table_max_width '>
                    <div className='contaienr'>
                        <h4 className='heading' >My Team</h4>
                    </div>
                    <Grid container alignItems="left" justifyContent="flex-start" mb={2} spacing={2.5}>

                        <Grid item xs={12} sm={6} md={6} lg={6} className="datasets_header">

                            <TextField className={`inputRounded search-input`} type="search"
                                placeholder="Search By  Name , E-code"
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
                    </Grid>
                    {teamList && teamList.length > 0 ? <MyTeamList list={teamList} /> :
                        <Alert severity="error">No Content Available!</Alert>
                    }
                </Container>
            </Page>

        </>




    );




}

export default MyTeam