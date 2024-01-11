import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useStyles } from "../../../css/HardwareInvoice-css";
import { HardwareContext } from '../FillOrEditInvoiceDetails';
import _ from 'lodash';
import AddProduct from './OfficeAccordion/AddProduct';
import removeIcon from "../../../assets/icons/icon-expense-remove.svg"
import { listHardwarePartVariants } from '../../../config/services/hardwareManagement';
import { getUserData } from '../../../helper/randomFunction/localStorage';
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import toast from 'react-hot-toast';

const ProductsAccordion = () => {
  const classes = useStyles();
  const [totalQty, setTotalQty] = useState(0);
  const [totalMrp, setTotalMrp] = useState(0)
  const [totalSp, setTotalSp] = useState(0)
  const { setHardwareInvoiceData, selectedProducts, setSelectedProducts, errorData, errorCheck } = useContext(HardwareContext)
  const [productList, setProductList] = useState([])
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid

  const getHardwarePartVariantList = () => {
    let params = { status: [1], uuid: uuid }
    listHardwarePartVariants(params)
      .then((res) => {
        let data = res?.data?.part_variants
        let updatedKeys = data?.map(item => {
          return {
            ...item,
            particular_name: item?.part_variant_name,
            unit_price: item?.part_variant_mrp,
            unit_sale_price: item?.part_variant_mop,
            package_id: item?.part_id,
            hsncode: item?.part_variant_hsn_code,
            uom: item?.part_variant_uom_id,
            cgst_rate: item?.part_variant_cgst_rate,
            sgst_rate: item?.part_variant_sgst_rate,
            igst_rate: item?.part_variant_igst_rate,
          }
        })
        setProductList(updatedKeys)
      }).catch(err => {
        console.error(err)
        toast.error('Something went wrong!')
      })
  }

  const handleRecieverDetails = (data) => {
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        total_hw_units: data?.reduce((total, product) => total + parseInt(product?.quantity), 0),
        particular_details: data?.map(product => ({
          package_id: product?.package_id,
          hsncode: product?.hsncode,
          particular_name: product?.particular_name,
          quantity: product?.quantity,
          uom: product?.uom,
          cgst_rate: product?.cgst_rate,
          sgst_rate: product?.sgst_rate,
          igst_rate: product?.igst_rate,
          unit_price: product?.unit_price,
          unit_sale_price: product?.unit_sale_price
        }))
      }
    })
  }

  const handleRemoveProduct = (index) => {
    let newProductList = [...selectedProducts]
    newProductList.splice(index, 1)
    setSelectedProducts(newProductList)
  }

  const handleQtyIncrement = (i) => {
    let data = [...selectedProducts]
    let initialQtyValue = data?.[i]?.quantity
    let updatedQtyValue = parseInt(initialQtyValue) + 1
    let defaultSellingPrice = parseInt(data?.[i]?.unit_sale_price) / initialQtyValue
    data[i].quantity = updatedQtyValue
    data[i].unit_sale_price = updatedQtyValue * defaultSellingPrice
    setSelectedProducts(data)
  }

  const handleQtyDecrement = (i) => {
    let data = [...selectedProducts]
    let initialQtyValue = data?.[i]?.quantity
    let updatedQtyValue = parseInt(initialQtyValue) - 1
    let defaultSellingPrice = parseInt(data?.[i]?.unit_sale_price) / initialQtyValue
    if (updatedQtyValue <= 0) return
    data[i].quantity = updatedQtyValue
    data[i].unit_sale_price = updatedQtyValue * defaultSellingPrice
    setSelectedProducts(data)
  }

  const handleData = (data) => {
    let totalQTY = 0;
    let totalMRP = 0;
    let totalSP = 0;

    for (let i = 0; i < data?.length; i++) {
      if (!isNaN(parseInt(data?.[i].quantity, 10))) {
        totalQTY += parseInt(data?.[i].quantity, 10);
      }
      if (!isNaN(parseInt(data?.[i]?.unit_price, 10))) {
        totalMRP += parseInt(data?.[i]?.unit_price, 10);
      }
      if (!isNaN(parseInt(data?.[i]?.unit_sale_price, 10))) {
        totalSP += parseInt(data?.[i]?.unit_sale_price, 10);
      }
    }
    setHardwareInvoiceData(prevData => {
      return {
        ..._.cloneDeep(prevData),
        total_billing_amount: totalSP,
      }
    })
    setTotalQty(totalQTY);
    setTotalMrp(totalMRP);
    setTotalSp(totalSP);
    handleRecieverDetails(data)
  }

  useEffect(() => {
    getHardwarePartVariantList()
  }, [])

  useEffect(() => {
    if (selectedProducts?.length > 0) {
      handleData(selectedProducts)
    }
  }, [selectedProducts]);

  return (
    <div className='crm-page-invoice-container-product-box'>
      <TableContainer component={Paper} className='crm-table-container crm-page-invoice-product-table'>
        <AddProduct productList={productList} selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} errorData={errorData} errorCheck={errorCheck} />
        {selectedProducts?.length > 0 ?
          <Table aria-label="simple table" className="custom-table datasets-table" >
            <TableHead>
              <TableRow className="cm_table_head">
                <TableCell>Sr.No</TableCell>
                <TableCell>Hardware Name</TableCell>
                <TableCell>QTY</TableCell>
                <TableCell>MRP </TableCell>
                <TableCell>Selling Price </TableCell>
                <TableCell></TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {selectedProducts?.map((row, i) => {
                return (
                  <TableRow
                    key={i}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{(i + 1)}</TableCell>
                    <TableCell>{row?.particular_name}</TableCell>
                    <TableCell>
                      <div className={classes.increDecreTextField}>
                        <span className={classes.icreBtn} onClick={() => handleQtyDecrement(i)}>-</span>
                        <div className={classes.count}>{row?.quantity}</div>
                        <span className={classes.decreBtn} onClick={() => handleQtyIncrement(i)}>+</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <CurrencyRupeeIcon
                        sx={{ position: "relative", top: "2px", fontSize: "14px" }}
                      />
                      {Number(row?.unit_price)?.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell >
                      <CurrencyRupeeIcon
                        sx={{ position: "relative", top: "2px", fontSize: "14px" }}
                      />
                      {Number(row?.unit_sale_price)?.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>
                      <img style={{ cursor: 'pointer' }} src={removeIcon} alt="addIcon" onClick={() => handleRemoveProduct(i)} />
                    </TableCell>
                  </TableRow>
                )
              })}
              <TableRow>
                <TableCell><b>Total</b></TableCell>
                <TableCell></TableCell>
                <TableCell align='left' ><b>{totalQty}</b></TableCell>
                <TableCell><b>
                  <CurrencyRupeeIcon
                    sx={{ position: "relative", top: "2px", fontSize: "14px" }}
                  />
                  {Number(totalMrp)?.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </b>
                </TableCell>
                <TableCell align='left'><b>
                  <CurrencyRupeeIcon
                    sx={{ position: "relative", top: "2px", fontSize: "14px" }}
                  />
                  {Number(totalSp)?.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </b>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
          :
          <div className={classes.noProduct}>
            <p>No Product Selected</p>
          </div>
        }
      </TableContainer >
    </div>
  )
}
export default ProductsAccordion