import React, { useEffect, useState } from 'react'
import Page from '../Page'
import HardwareHeader from './HardwareHeader'
import ImplementationListing from './ImplementationListing'
import { fetchImplementationList } from '../../config/services/implementationForm'
import { DisplayLoader } from '../../helper/Loader';
import { useStyles } from "../../css/HardwareInvoice-css";
import { BreadcrumbsFormatter } from '../../utils/utils'

const CreateHardwareInvoices = () => {
  const [implementationList, setImplementationList] = useState()
  const [pageNo, setPagination] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [loader, setLoader] = useState(false)
  const [lastPage, setLastPage] = useState(false)
  const [headerValue, setHeaderValue] = useState({})
  const [search, setSearch] = useState()
  const classes = useStyles()

  const getImplementationList = async () => {
    try {
      let params = {
        pageNo: pageNo - 1,
        count: itemsPerPage,
        startDate: search?.invoice_date_from,
        endDate: search?.invoice_date_to,
        impFormNumber: search?.implementation_id,
        schoolName: search?.school_code,
        schoolCode: search?.school_code,
        invoices: true
      };
      setLastPage(false);
      setLoader(true);
      let res = await fetchImplementationList(params);
      if (res && res.result) {
        let list = res.result;
        let contractValueSum = 0
        let listLength = list?.length

        for (const item of list) {
          const uniqueGroupCodes = [];

          const products = item.productDetails;

          for (const product of products) {
            const groupCode = product.groupCode;
            if (!uniqueGroupCodes.includes(groupCode)) {
              uniqueGroupCodes.push(groupCode);
            }
          }
          item.uniqueProducts = uniqueGroupCodes
        }

        let newList = list?.map(item => {
          const sumImplementedUnit = item.hardwareDetails.reduce((acc, curr) => {
            return acc + parseInt(curr.implementedUnit);
          }, 0);

          const sumProductItemImpPrice = item.hardwareDetails.reduce((acc, curr) => {
            return acc + parseFloat(curr.productItemImpPrice);
          }, 0);

          contractValueSum += parseFloat(sumProductItemImpPrice)
          return {
            ...item,
            sumImplementedUnit,
            sumProductItemImpPrice
          };


        });
        setImplementationList(newList);
        setHeaderValue({
          listLength,
          totalContractValue: contractValueSum
        })

      }
      setLoader(false)
      if (res.result.length < itemsPerPage) setLastPage(true);
    } catch (error) {
      setLastPage(true);
      setLoader(false)
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    getImplementationList()
  }, [pageNo, search])

  return (
    <Page title="Extramarks | Hardware Invoices" className="crm-page-wrapper crm-page-listing-container">
      <BreadcrumbsFormatter 
        crumbs={[{label: 'Home', 'route': '/authorised/school-dashboard'}, {label: 'Generate Hardware Invoices',}]}
      />
      <div className='crm-page-container'>
        <div style={{ marginBottom: '20px' }}>
          <HardwareHeader type={0} headerValue={headerValue} search={search} setSearch={setSearch} setPagination={setPagination} />
        </div>
        {loader ? (
          <div className={classes.loader}>
            {DisplayLoader()}
          </div>
        ) :
          implementationList?.length > 0 ? (
            <ImplementationListing list={implementationList} pageNo={pageNo} setPagination={setPagination} itemsPerPage={itemsPerPage} lastPage={lastPage} />
          ) : (
            <div className={classes.noData}>
              <p>No Data Available</p>
            </div>
          )
        }
      </div>
    </Page>
  )
}

export default CreateHardwareInvoices