import React, { useEffect, useState } from 'react'
import Page from '../Page'
import HardwareHeader from './HardwareHeader'
import { DisplayLoader } from '../../helper/Loader';
import HardwareInvoicesListing from './HardwareInvoicesListing'
import { listHardwareInvoice } from '../../config/services/packageBundle'
import { getUserData } from '../../helper/randomFunction/localStorage'
import { useStyles } from "../../css/HardwareInvoice-css";
import toast from 'react-hot-toast';
import { Breadcrumbs } from '@mui/material';
import { Link } from 'react-router-dom';
import { BreadcrumbsFormatter } from '../../utils/utils';

const GeneratedOrSavedHardwareInvoices = () => {
  const [hardwareInvoicesList, setHardwareInvoicesList] = useState()
  const [pageNo, setPagination] = useState(1)
  const [lastPage, setLastPage] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [cancelInvoiceCheck, setCancelInvoiceCheck] = useState(false)
  const [headerValue, setHeaderValue] = useState({})
  const [loader, setLoader] = useState(false)
  const [search, setSearch] = useState({})
  let currentUrl = window.location.pathname
  let invoiceType = currentUrl.includes("/authorised/hardware-invoices-list-saved")


  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid
  const classes = useStyles()

  const getHardwareInvoicesList = async () => {
    try {
      let params = {
        uuid,
        page_offset: pageNo - 1,
        page_size: itemsPerPage,
        hw_invoice_for: ["SCHOOL"],
        invoice_status: invoiceType ? [1, 4] : [4],
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
      setHardwareInvoicesList(list);
      if (listLength < itemsPerPage) setLastPage(true);
      setHeaderValue({ listLength })
      setLoader(false)
    } catch (error) {
      setLastPage(true);
      setLoader(false)
      toast.error('Something went wrong')
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    getHardwareInvoicesList()
  }, [cancelInvoiceCheck, pageNo, search, invoiceType])


  return (
    <Page title="Extramarks | Hardware Invoices" className="crm-page-wrapper crm-page-listing-container">

      

      <BreadcrumbsFormatter
        crumbs={[{label: 'Home', route: '/authorised/school-dashboard'}, {label: 'Generate Hardware Invoices'}]}
      />

      <div className='crm-page-container'>
        <div style={{ marginBottom: '20px' }}>
          <HardwareHeader headerValue={headerValue} type={invoiceType ? 4 : 1} invoices={hardwareInvoicesList?.length} search={search} setSearch={setSearch} setPagination={setPagination} />
        </div>
        {
          loader ? (
            <div className={classes.loader}>
              {DisplayLoader()}
            </div>
          ) : (
            hardwareInvoicesList?.length > 0 ? (
              <HardwareInvoicesListing
                list={hardwareInvoicesList}
                pageNo={pageNo}
                type={invoiceType ? "update" : "generate"}
                setPagination={setPagination}
                lastPage={lastPage}
                itemsPerPage={itemsPerPage}
                cancelInvoiceCheck={cancelInvoiceCheck}
                setCancelInvoiceCheck={setCancelInvoiceCheck}
              />
            ) : (
              <div className={classes.noData}>
                <p>No Data Available</p>
              </div>
            ))}
      </div>
    </Page >
  )
}
export default GeneratedOrSavedHardwareInvoices