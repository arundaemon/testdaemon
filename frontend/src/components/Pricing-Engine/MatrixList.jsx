import Page from "../Page"
import { useStyles } from "../../css/PricingEngine-css";
import { Button, Divider, Grid, Typography, Alert, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MatrixTableList } from "./MatrixListTable";
import { getMatrixList } from "../../config/services/packageBundle";
import { useEffect, useState } from "react";
// import { addUpdateMatrix } from "../../config/services/Pricing Engine/addMatrix";
import { addUpdateMatrix } from "../../config/services/packageBundle";
import { getUserData } from "../../helper/randomFunction/localStorage";
import toast from "react-hot-toast";
import Loader from "../../pages/Loader";
import Pagination from "../../pages/Pagination";
import { cloneData, dataForCloneSubmit, dataForSubmit, statusChangeDataForSubmit } from "../../helper/randomFunction";

export const MatrixList = () => {

  const classes = useStyles()
  const navigate = useNavigate()
  const [pageNo, setPagination] = useState(1);
  const [loader, setLoading] = useState(false);
  const [itemsPerPage] = useState(10);
  const [lastPage, setLastPage] = useState(false)
  const [matrixList, setMatrixList] = useState([])
  const [isClone, setClone] = useState(false)
  const [statusChnaged, setStatusChanged] = useState(true)
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid

  const addMatrix = () => {
    navigate('/authorised/add-price-matrix')
  }

  const getListMatrix = async () => {
    let params = {
      status: [1, 2],
      page_offset: (pageNo - 1),
      page_size: itemsPerPage,
      order_by: "pricing_matrix_id", // Mandatory channel_id, pricing_matrix_id, matrix_name, product_name, package_name
      order: "DESC",
      uuid: uuid
    };
    let res = await getMatrixList(params)
    let data =res?.data?.pricingMatrixDetails
    if (data?.length > 0) {
      setMatrixList(data)
      if (data?.length < itemsPerPage) 
      {
        setLastPage(true)
        setLoading(false)
      }
      
    }


  }

  const modifiyData = async (data) => {
    let params = await dataForSubmit(data, uuid)
    if (params) {
      const res = await addUpdateMatrix(params);
      if (res?.data?.status == 1) {
        toast.success("Sucessfully submitted ");
        setClone(true)
      }
      else {
        toast.error("Error")
      }
    }
  }

  const statusChange = async (data) => {
    let params = await statusChangeDataForSubmit(data, uuid)
    if (params) {
      const res = await addUpdateMatrix(params)
      if (res?.data?.status == 1) {
        getListMatrix()
        toast.success("Status Changed Successfully")
      } else {
        toast.error("Error")
      }

    }
  }


  useEffect(() => {
    getListMatrix()
  }, [isClone, pageNo])

  return (
    <>
      <Page
        title="Extramarks | Pricing Matrix"
        className="main-container myLeadPage datasets_container"
      >

        <Container className='table_max_width'>
          <Grid className={classes.cusCard}>
            <Grid container spacing={3} sx={{ pt: "8px", pb: "24px" }}>
              <Grid item md={6} xs={12}>
                <Typography className={classes.title} sx={{ mt: '10px' }}>Pricing Engine</Typography>
              </Grid>
              <Grid item md={6} xs={12} className={classes.btnSection}>
                <Button
                  className={classes.submitBtn}
                  onClick={addMatrix}
                >
                  Create New
                </Button>
              </Grid>
            </Grid>

            {loader && <Loader />}
            {matrixList && matrixList?.length > 0 ? <MatrixTableList data={matrixList} modifiyData={modifiyData} statusChange={statusChange} /> :
              <Alert severity="error">No Content Available!</Alert>}

          </Grid>
        </Container>

        <div className='center cm_pagination'>
          <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} />
        </div>
      </Page>

    </>
  )
}