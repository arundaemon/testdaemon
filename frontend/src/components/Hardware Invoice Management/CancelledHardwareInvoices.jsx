import React, { useEffect, useState } from 'react'
import Page from '../Page'
import HardwareHeader from './HardwareHeader'
import { fetchImplementationList } from '../../config/services/implementationForm'
import HardwareInvoicesListing from './HardwareInvoicesListing'
import { listHardwareInvoice } from '../../config/services/packageBundle'
import { getUserData } from '../../helper/randomFunction/localStorage'
import { DisplayLoader } from '../../helper/Loader';
import { useStyles } from "../../css/HardwareInvoice-css";
import toast from 'react-hot-toast'

const CancelledHardwareInvoices = () => {
  const [hardwareInvoicesList, setHardwareInvoicesList] = useState()
  const [pageNo, setPagination] = useState(1)
  const [lastPage, setLastPage] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [cancelInvoiceCheck, setCancelInvoiceCheck] = useState(false)
  const [headerValue, setHeadervalue] = useState({})
  const [search, setSearch] = useState({})
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
        hw_invoice_for: ["SCHOOL"],
        invoice_status: [3],
        invoice_date_from: search?.invoice_date_from,
        invoice_date_to: search?.invoice_date_to,
        school_code: search?.school_code,
        implementation_id: search?.implementation_id,
        invoice_number: search?.invoice_number,
        order: "DESC"
      };
      setLastPage(false);
      setLoader(true);
      let res = await listHardwareInvoice(params);
      let list = res?.data?.hw_invoice_details;
      let listLength = list?.length
      setHeadervalue({
        listLength
      })
      setHardwareInvoicesList(list);
      setLoader(false);
      if (list.length < itemsPerPage) setLastPage(true);
    } catch (error) {
      setLastPage(true);
      setLoader(false)
      toast.error('Something went wrong!')
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    getCancelledInvoicesList()
  }, [cancelInvoiceCheck, pageNo, search])

  return (
    <Page title="Extramarks | Cancelled Hardware Invoices" className="main-container compaignManagenentPage datasets_container">
      <div className='tableCardContainer'>
        <div style={{ marginBottom: '20px' }}>
          <HardwareHeader type={2} headerValue={headerValue} search={search} setSearch={setSearch} setPagination={setPagination} />
        </div>
        {loader ? (
          <div className={classes.loader}>
            {DisplayLoader()}
          </div>
        ) : (
          hardwareInvoicesList?.length > 0 ? (
            <HardwareInvoicesListing
              list={hardwareInvoicesList}
              pageNo={pageNo}
              setPagination={setPagination}
              lastPage={lastPage}
              type={2}
              itemsPerPage={itemsPerPage}
              cancelInvoiceCheck={cancelInvoiceCheck}
              setCancelInvoiceCheck={setCancelInvoiceCheck}
            />
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


export default CancelledHardwareInvoices