import React, { useEffect, useState } from 'react'
import Page from '../Page'
import HardwareHeader from './HardwareHeader'
import { listHardwareInvoice } from '../../config/services/packageBundle'
import { getUserData } from '../../helper/randomFunction/localStorage'
import OfficeInvoicesListing from './OfficeInvoicesListing'
import { DisplayLoader } from '../../helper/Loader';
import { useStyles } from "../../css/HardwareInvoice-css";

const CancelledOfficeInvoices = () => {
  const [officeInvoicesList, setOfficeInvoicesList] = useState()
  const [pageNo, setPagination] = useState(1)
  const [lastPage, setLastPage] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [cancelInvoiceCheck, setCancelInvoiceCheck] = useState(false)
  const [search, setSearch] = useState({})
  const [headerValue, setHeadervalue] = useState({})
  const [loader, setLoader] = useState(false)
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid
  const classes = useStyles()

  const getCancelledInvoicesList = async () => {
    try {
      let params = {
        uuid,
        page_offset: pageNo - 1,
        page_size: itemsPerPage,
        hw_invoice_for: ["OFFICE"],
        invoice_status: [3],
        invoice_date_from: search?.invoice_date_from,
        invoice_date_to: search?.invoice_date_to,
        school_code: search?.school_code,
        implementation_id: search?.implementation_id,
        invoice_number: search?.invoice_number
      };
      setLastPage(false);
      setLoader(true);
      let res = await listHardwareInvoice(params);
      let list = res?.data?.hw_invoice_details;
      let listLength = list?.length
      setHeadervalue({
        listLength
      })
      setOfficeInvoicesList(list);
      if (listLength < itemsPerPage) setLastPage(true);
      setLoader(false);
    } catch (error) {
      setLastPage(true);
      setLoader(false);
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    getCancelledInvoicesList()
  }, [cancelInvoiceCheck, search])

  return (
    <Page title="Extramarks | Hardware Invoices" className="main-container compaignManagenentPage datasets_container">
      <div className='tableCardContainer'>
        <div style={{ marginBottom: '20px' }}>
          <HardwareHeader type={6} headerValue={headerValue} search={search} setSearch={setSearch} setPagination={setPagination} />
        </div>
        {
          loader ? (
            <div className={classes.loader}>
              {DisplayLoader()}
            </div>
          ) : (
            officeInvoicesList?.length > 0 ? (
              <OfficeInvoicesListing list={officeInvoicesList} pageNo={pageNo} setPagination={setPagination} type={"cancel"} lastPage={lastPage} itemsPerPage={itemsPerPage} cancelInvoiceCheck={cancelInvoiceCheck} setCancelInvoiceCheck={setCancelInvoiceCheck} />
            ) : (
              <div className={classes.noData}>
                <p>No Data Available</p>
              </div>
            )
          )
        }
      </div>
    </Page>
  )
}
export default CancelledOfficeInvoices