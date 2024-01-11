import React, { useState } from 'react'
import { useStyles } from "../../../../css/HardwareInvoice-css";
import _ from 'lodash';
import addIcon from "../../../../assets/icons/icon-add-square.svg"
import Select, { components } from 'react-select'
import toast from 'react-hot-toast';
import { ReactComponent as DropDownIcon } from "../../../../assets/icons/icon-dropdown-2.svg";

const AddProduct = ({ productList, selectedProducts, setSelectedProducts, errorData, errorCheck }) => {
  const [productDetail, setProductDetail] = useState(null)
  const [defaultSellingPrice, setDefaultSellingPrice] = useState()
  const [product, setProduct] = useState(null)
  const classes = useStyles();

  const handleSelectedProducts = (value) => {
    let data = { ...value, quantity: 1 }
    setProduct(value)
    setDefaultSellingPrice(value?.unit_sale_price)
    setProductDetail(data)
    delete errorData?.particular_details
  }

  const handleProductQty = (e) => {
    let { value } = e.target
    let sellingPrice = defaultSellingPrice
    if (value > 1) sellingPrice *= value
    if (value < 0) sellingPrice = defaultSellingPrice
    setProductDetail(prevData => {
      return {
        ..._.cloneDeep(prevData),
        quantity: value,
        unit_sale_price: sellingPrice,
        defaultSellingPrice
      }
    })
  }

  const handleProductMrp = (e) => {
    setProductDetail(prevData => {
      return {
        ..._.cloneDeep(prevData),
        unit_price: e.target.value,
      }
    })
  }

  const handleProductSp = (e) => {
    setProductDetail(prevData => {
      return {
        ..._.cloneDeep(prevData),
        unit_sale_price: e.target.value,
      }
    })
  }

  const handleAddProductValidation = () => {
    if (product === null) {
      toast.dismiss()
      toast.error('Select Product!')
      return false
    }

    const duplicateProduct = selectedProducts?.some(item => item.variant_id === productDetail?.variant_id)
    if (duplicateProduct) {
      toast.dismiss()
      toast.error('Product Already Selected!')
      return false
    }

    if (productDetail?.quantity <= 0) {
      toast.dismiss()
      toast.error('Quantity must be greater than 0', { style: { fontSize: '10px' } }
      )
      return false
    }

    if (productDetail?.unit_sale_price <= 0) {
      toast.dismiss()
      toast.error('Selling Price must be greater than 0', { style: { fontSize: '10px' } })
      return false
    }
    return true
  }

  const addProduct = () => {
    const validation = handleAddProductValidation()
    if (!validation) return
    setSelectedProducts(prevState => [...prevState, productDetail]);
    setProduct(null)
    setProductDetail({
      particular_name: "",
      variant_id: "",
      quantity: 0,
      unit_price: 0,
      unit_sale_price: 0
    })
  }

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <DropDownIcon />
      </components.DropdownIndicator>
    );
  };

  return (
    <>
      <div style={{ display: 'flex', flexWrap: "wrap" }}>
        <div className={classes.labelDivProduct}>
          <label className={classes.label}>Product <span style={{ color: 'red' }}>*</span></label>
          <Select
            classNamePrefix="select"
            value={product}
            options={productList}
            getOptionLabel={(option) => (option?.particular_name)}
            getOptionValue={(option) => option?.variant_id}
            onChange={handleSelectedProducts}
            className="crm-form-input crm-react-select medium-dark"
            components={{ DropdownIndicator }}
          />
          {errorCheck &&
            <p className={classes.alert}>{errorData?.particular_details}</p>
          }
        </div>
        <div className={classes.labelDivProduct}>
          <label className={classes.label}>QTY <span style={{ color: 'red' }}>*</span></label>
          <input className='crm-form-input medium-dark' type="number" id="outlined-basic" value={productDetail?.quantity} onChange={handleProductQty} />
        </div>
        <div className={classes.labelDivProduct}>
          <label className={classes.label}>MRP<span style={{ color: 'red' }}>*</span></label>
          <input className='crm-form-input medium-dark' disabled={true} type="number" id="outlined-basic" value={productDetail?.unit_price} onChange={handleProductMrp} />
        </div>
        <div className={classes.labelDivProduct}>
          <label className={classes.label}>Selling Price<span style={{ color: 'red' }}>*</span></label>
          <input className='crm-form-input medium-dark' type="number" id="outlined-basic" value={productDetail?.unit_sale_price} onChange={handleProductSp} />
        </div>
        <div style={{ marginTop: '60px' }}>
          <img style={{ cursor: 'pointer' }} src={addIcon} alt="" onClick={addProduct} />
        </div>
      </div >
    </>
  )
}
export default AddProduct