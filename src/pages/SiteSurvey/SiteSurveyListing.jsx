import React, { useState, useEffect } from 'react'
import { getSiteSurveyList } from '../../config/services/siteSurvey';
import { TablePagination, Typography } from '@mui/material';
import Page from '../../components/Page';
import SiteSurveyListingTable from './SiteSurveyListingTable';
import { useStyles } from "../../css/Implementation-css";
import { DisplayLoader } from "../../helper/Loader";
import { DecryptData } from "../../utils/encryptDecrypt";
import { getUserData } from '../../helper/randomFunction/localStorage';



const SiteSurveyListing = () => {
    const classes = useStyles();
    const [pageNo, setPagination] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [lastPage, setLastPage] = useState();
    const [siteSurveyList, setSiteSurveyList] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(2);
    const childRoles = localStorage?.getItem("childRoles")

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPagination(1);
        setItemsPerPage(event.target.value);
      };

    const fetchSiteSurveyListing = async() => {
        let response
        setIsLoading(true)
        const roles = DecryptData(childRoles)
        let filteredRoles = roles.map((role)=>{
          return role.roleName
        })
        filteredRoles.push(getUserData("userData")?.crm_role)

        try {
            const queryObj = {
              pageNo: pageNo-1,
              count: rowsPerPage,
              sortKey: 'createdAt',
              sortOrder: -1,
              childRoleNames: filteredRoles
            }
            response = await getSiteSurveyList(queryObj)
            setSiteSurveyList(response?.result)
            setIsLoading(false)
        } catch (err) {
            console.error('Error: ', + err)
        }
    }

    useEffect(() => {
        fetchSiteSurveyListing()
    },[itemsPerPage, pageNo, rowsPerPage])



    return (
        <Page
          title="Extramarks | Quotation Table"
          className="main-container myLeadPage datasets_container"
        >
          <div className="tableCardContainer">
            <div className="crm-sd-claims-header">
            <Typography variant="h4" component="h4" sx={{margin: '20px'}}>Site Survey List</Typography>
            </div>
    
            {!isLoading ? (
              siteSurveyList?.length ? (
                <>
                  <SiteSurveyListingTable
                  siteSurveyList={siteSurveyList}
                  />
                </>
              ) : (
                <>
                  <div className={classes.noData}>
                    <p>{"No Data Available"}</p>
                  </div>
                </>
              )
            ) : (
              <div className={classes.loader}>{DisplayLoader()}</div>
            )}
          </div>
    
          <div className="center cm_pagination">
            <TablePagination
              component="div"
              page={pageNo}
              onPageChange={(e, pageNumber)=>setPagination(pageNumber)}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[10, 50, 100, 500, 1000]}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelDisplayedRows={({ page }) => {
                return `Page: ${page}`;
              }}
              backIconButtonProps={{
                disabled: pageNo === 1,
              }}
              nextIconButtonProps={{
                disabled: lastPage,
              }}
            />
          </div>
        </Page>
      );
}

export default SiteSurveyListing
