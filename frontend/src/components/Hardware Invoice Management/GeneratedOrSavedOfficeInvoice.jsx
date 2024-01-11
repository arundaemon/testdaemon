import React, { useEffect, useState } from 'react'
import Page from '../Page'
import HardwareHeader from './HardwareHeader'
import { listHardwareInvoice } from '../../config/services/packageBundle'
import { getUserData } from '../../helper/randomFunction/localStorage'
import OfficeInvoicesListing from './OfficeInvoicesListing'
import { DisplayLoader } from '../../helper/Loader';
import { useStyles } from "../../css/HardwareInvoice-css";

const GeneratedOrSavedOfficeInvoice = () => {
  const [OfficeInvoicesList, setOfficeInvoicesList] = useState()
  const [pageNo, setPagination] = useState(1)
  const [lastPage, setLastPage] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [search, setSearch] = useState({})
  const [cancelInvoiceCheck, setCancelInvoiceCheck] = useState(false)
  const [loader, setLoader] = useState(false)
  const [headerValue, setHeadervalue] = useState({})
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid
  const classes = useStyles()
  let currentUrl = window.location.pathname
  let savedOfficeInvoiceUrl = currentUrl.includes("/authorised/office-invoices-list-saved")

  const getHardwareInvoicesList = async () => {
    try {

      let params = {
        uuid,
        page_offset: pageNo - 1,
        page_size: itemsPerPage,
        hw_invoice_for: ["OFFICE"],
        invoice_status: savedOfficeInvoiceUrl ? [1] : [4],
        invoice_date_from: search?.invoice_date_from,
        invoice_date_to: search?.invoice_date_to,
        school_code: search?.school_code,
        implementation_id: search?.implementation_id,
        invoice_number: search?.invoice_number
      };
      setLoader(true)
      setLastPage(false)
      let res = await listHardwareInvoice(params);
      let list = res?.data?.hw_invoice_details;
      let listLength = list?.length
      setHeadervalue({
        listLength
      })
      setOfficeInvoicesList(list);

      if (listLength < itemsPerPage) setLastPage(true);
      setLoader(false)
    } catch (error) {
      console.error("An error occurred:", error);
      setLoader(false)
      setLastPage(true)
    }
  };

  useEffect(() => {
    getHardwareInvoicesList()
  }, [cancelInvoiceCheck, pageNo, search])

  return (
    <Page title="Extramarks | Hardware Invoices" className="main-container compaignManagenentPage datasets_container">
      <div className='tableCardContainer'>
        <div style={{ marginBottom: '20px' }}>
          <HardwareHeader type={savedOfficeInvoiceUrl ? 5 : 3} headerValue={headerValue} search={search} setSearch={setSearch} setPagination={setPagination} />
        </div>
        {
          loader ? (
            <div className={classes.loader}>
              {DisplayLoader()}
            </div>
          ) : (
            OfficeInvoicesList?.length > 0 ? (
              <OfficeInvoicesListing type={savedOfficeInvoiceUrl ? "saved" : "generated"} list={OfficeInvoicesList} pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} itemsPerPage={itemsPerPage} cancelInvoiceCheck={cancelInvoiceCheck} setCancelInvoiceCheck={setCancelInvoiceCheck} />
            ) : (
              <div className={classes.noData}>
                <p>No Data Available</p>
              </div>
            ))}
      </div>
    </Page>
  )
}

export default GeneratedOrSavedOfficeInvoice