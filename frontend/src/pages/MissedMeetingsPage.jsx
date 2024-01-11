import {
    Typography,
    Box
  } from "@mui/material";
  import { Link, useNavigate } from "react-router-dom";
  import { useEffect, useState } from "react";
  import useMediaQuery from "@mui/material/useMediaQuery";
import { MissedMeeting } from "../components/SchoolDashboard/MissedMeeting";
import { ReactComponent as IconNavLeft } from "./../assets/icons/icon-nav-left-arrow.svg";
import Page from "../components/Page";
  
  
  export const MissedMeetingsPage = ({layoutType=null}) => {

    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
    const navigate = useNavigate();
  
  

    useEffect(() => {
        document.body.classList.add("crm-is-inner-page");
        return () => document.body.classList.remove("crm-is-inner-page");
      }, []);
  
    return (
        <Page title="Missed Meetings | CRM">
            <Box className={`crm-sd-mm-wrapper `}>
                <Box className="crm-page-innner-header">
                    {isMobile ? (
                        <Link
                        key="99"
                        color="inherit"
                        to={".."}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(-1);
                        }}
                        className=""
                        >
                        <IconNavLeft className="crm-inner-nav-left" />{" "}
                        </Link>
                    ) : null}
                    <Typography component="h2" className="crm-sd-log-heading">
                        Missed Meetings
                    </Typography>
                </Box>
                <Box className="crm-sd-mm-list">
                    <MissedMeeting isLogActivityStatus={() => {}} listType="list"  />
                </Box>
                
            </Box>
        </Page>
    );
  };
  