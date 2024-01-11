import React, { useEffect, useState } from 'react'
import Page from "../components/Page";
import TerritoryMappingListing from '../components/territoryMappingManagement/TerritoryMappingListing';
import { DisplayLoader } from '../helper/Loader';
import TerritoryListingHeader from '../components/territoryMappingManagement/TerritoryListingHeader';
import { getTerritoryList } from '../config/services/territoryMapping';
import Pagination from './Pagination';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  noData: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 600,
    fontSize: 25
  },
  loader: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }
}))

const TerritoryMappingManagement = () => {
  const [pageNo, setPagination] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [search, setSearchValue] = useState('')
  const [sortObj, setSortObj] = useState({ sortKey: 'createdAt', sortOrder: '-1' })
  const [territoryList, setTerritoryList] = useState([])
  const [loader, setLoader] = useState(false)
  const [lastPage, setLastPage] = useState(false)
  const classes = useStyles();


  const handleSearch = (e) => {
    let { value } = e.target
    setPagination(1)
    setSearchValue(value, () => setPagination(1))
  }

  const handleSort = (key) => {
    let newOrder = sortObj?.sortOrder === '-1' ? '1' : '-1'
    setSortObj({ sortKey: key, sortOrder: newOrder })
  }

  const territoryListFunction = () => {
    let params = { pageNo: (pageNo - 1), count: itemsPerPage, ...sortObj, search }
    setLastPage(false)
    setLoader(false)
    setTerritoryList([])
    getTerritoryList(params)
      .then((res) => {
        let data = res?.result
        setTerritoryList(data)
        if (data?.length < itemsPerPage) setLastPage(true)
        setLoader(true)
      })
      .catch((err) => {
        console.error(err, '..error')
        setLoader(true)
      })
  }

  useEffect(() => {
    territoryListFunction()
  }, [pageNo, search, sortObj])

  return (
    <>
      <Page title="Extramarks | Territory Management" className="main-container compaignManagenentPage datasets_container">
        <div className='tableCardContainer'>
          <TerritoryListingHeader handleSearch={handleSearch} />
          {loader ?
            (territoryList?.length > 0 ?
              <>
                <TerritoryMappingListing list={territoryList} pageNo={pageNo} itemsPerPage={itemsPerPage} search={search} handleSort={handleSort} sortObj={sortObj} />
                {loader &&
                  <div className='center cm_pagination'>
                    <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} />
                  </div>
                }
              </>
              :
              <>
                <div className={classes.noData}>
                  <p>No Data Available</p>
                </div>
                <div className='center cm_pagination'>
                  <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} />
                </div>
              </>
            ) :
            <div className={classes.loader}>
              {DisplayLoader()}
            </div>
          }
        </div>
      </Page >
    </>
  )
}
export default TerritoryMappingManagement