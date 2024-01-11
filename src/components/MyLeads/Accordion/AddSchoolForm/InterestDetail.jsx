import { useEffect, useState } from "react"
import { useStyles } from '../../../../css/AddSchool-css'
import { Grid, Typography } from "@mui/material";
import ReactSelect from "react-select";
import { getAllProductList } from "../../../../config/services/packageBundle";
import { getUserData } from "../../../../helper/randomFunction/localStorage";

export const InterestDetail = (props) => {

  const classes = useStyles();

  let { getInterestDetail } = props

  const [interestedItem, setInterestData] = useState([])
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid

  const [options, setOptions] = useState()

  const getProductList = () => {
    let params = {
      status: [1],
      uuid: uuid,
      master_data_type: 'package_products'
    }
    getAllProductList(params)
      .then(res => {
        let data = res?.data?.master_data_list
        let tempArray = data?.map(obj => ({
          label: obj?.name,
          value: obj?.name,
          groupkey: obj?.group_key,
          groupName: obj?.group_name,
          productID: obj?.id,
          productCode: obj?.product_key
        }))
        tempArray = tempArray?.filter(obj => ((obj?.groupName) && (obj?.groupkey)))
        setOptions(tempArray)
      })
      .catch(err => {
        console.error(err, 'Error while fetching product list')
      })
  }

  useEffect(() => {
    let data = interestedItem?.map(obj => {
      return (
        {
          learningProfile: obj?.value,
          learningProfileCode: obj?.productCode,
          learningProfileRefId: obj?.productID,
          learningProfileGroupCode: obj?.groupkey,
          learningProfileGroupName: obj?.groupName
        }
      )
    })
    getInterestDetail(data)
  }, [interestedItem])

  useEffect(() => {
    getProductList()
  }, [])


  const handleMultiSelect = (selected) => {
    setInterestData(selected);
  };

  return (
    <>
      <Grid className={classes.cusCard}>
        <Grid item md={4} xs={12}>
          <Grid>
            <Typography className={classes.label}>Product </Typography>
            <ReactSelect
              classNamePrefix="select"
              options={options}
              value={interestedItem}
              isMulti
              onChange={handleMultiSelect}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}