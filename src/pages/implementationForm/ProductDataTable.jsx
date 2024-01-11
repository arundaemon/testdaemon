import {
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import React from "react";

const styles = {
  tableContainer: {
    // margin: "30px auto",
    borderRadius: "8px",
    // boxShadow: "0px 3px 6px #00000029",
    paddingBottom: "20px",
  },
  typo: {
    padding: "10px 16px",
    fontWeight: "700",
    fontSize: "18px",
    textDecoration: "underline",
    backgroundColor: "#FECB98",
  },
  tableCell: {
    padding: "8px 0px 8px 16px !important",
    border: "none",
  },
};

const ProductDataTable = ({ productTable, productSchema }) => {

  let productKeys = []


  const renderTeacherCount = (obj, label, proIndex) => {

    const existingIds = productTable.map(item => item.productItemRefId);

    const previousRender = existingIds.slice(0, proIndex)

    if (!previousRender.includes(obj?.productItemRefId)) {
      return <Box sx={styles.productSec}>
        {obj[label.field]}
      </Box>;
    }
    return;
  };


  productTable?.map((obj) => {
    if (!productKeys?.includes(obj.productCode)) {
      productKeys?.push(obj.productCode)
    }
  })

  return (
    <div>
      <TableContainer component={Paper} sx={styles.tableContainer}>
        {
          productSchema?.map((table) => {
            if (productKeys?.includes(table.productKey)) {
              return (
                <Box sx={{ marginBottom: "20px", borderRadius: "8px", boxShadow: "0px 3px 6px #00000029" }}>
                  <Typography
                    sx={{
                      ...styles.typo,
                      borderRadius: "8px 8px 0 0 !important",
                    }}
                  >{table?.productName}</Typography>

                  <Table aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        {table?.productTable.map((col, index) => (
                          <TableCell
                            align="left"
                            key={index}
                            sx={{ ...styles.tableCell, padding: "16px", textAlign: col.field === 'teacherCount' ? "center" : "" }}
                          >
                            {col.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        productTable?.map((obj, index) => {
                          return (
                            table?.productKey === obj?.productCode && <TableRow key={index}
                              sx={{
                                "& td": styles.tableCell,
                              }}
                            >
                              {table?.productTable?.map((label, proIndex) => {
                                return (
                                  <>
                                    {
                                      label.field === "teacherCount" && (obj?.productCode === 'esc_plus_pro' || obj?.productCode === 'esc_plus_basic' || obj?.productCode === 'esc_plus_advanced' || obj?.productCode === 'em_power') ?
                                        <TableCell align="center" sx={{ borderLeft: "1px solid #00000029 !important" }}>
                                          {/* <Box sx={styles.productSec}>
                                          {obj[label.field]}
                                        </Box> */}
                                          {renderTeacherCount(obj, label, index)}
                                        </TableCell> :
                                        <>
                                          {label.field === "productItemName" ?
                                            <TableCell sx={{ borderTop: label.field !== "teacherCount" ? "1px solid #00000029 !important" : "", borderLeft: label.field == "teacherCount" ? "1px solid #00000029 !important" : "" }}>
                                              {

                                                <Box sx={styles.productSec}>
                                                  <Box>
                                                    {obj[label.field]}
                                                  </Box>
                                                  <Box sx={{ marginLeft: "30px" }}>
                                                    {obj?.className}
                                                  </Box>
                                                </Box>
                                              }
                                            </TableCell>
                                            :
                                            <TableCell sx={{ borderTop: label.field !== "teacherCount" ? "1px solid #00000029 !important" : "", borderLeft: label.field == "teacherCount" ? "1px solid #00000029 !important" : "" }}>
                                              {
                                                label.field !== "teacherCount" && label.field !== "productItemName" &&
                                                <Box sx={styles.productSec}>
                                                  {label.field === 'batchTiming' ? (obj[label.field]?.batch_start_date ? obj[label.field]?.batch_start_date : 0) : (obj[label.field] ? obj[label.field] : 0)}
                                                </Box>
                                              }
                                            </TableCell>
                                          }
                                        </>

                                    }
                                  </>
                                )
                              })}
                            </TableRow>
                          )
                        })
                      }
                    </TableBody>
                  </Table>
                </Box>)
            }
          })

        }

      </TableContainer>

    </div>
  );
};

export default ProductDataTable
