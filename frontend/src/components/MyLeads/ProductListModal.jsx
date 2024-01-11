import {
  Box,
  Button,
  Modal,
  Typography,
  RadioGroup,
  Radio,
  Divider,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import React, { useState } from "react";
import { style, useStyles } from "../../css/SchoolDetail-css";
import FormControlLabel from "@mui/material/FormControlLabel";
export const POModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const ProductListModal = ({
  data,
  index,
  modal2,
  setModal2,
  handleRowCheck,
  isChecked,
  setQuoteStatus,
  isQuote,
  setCheckedRows,
  setFormSubmit,
  checkedRows,
  isQuoteType,
  setQuoteType,
}) => {
  const classes = useStyles();
  let finalData = Object?.entries(data);
  const filteredArray = finalData.filter((element, i) => i === index);

  return (
    <div>
      <Modal open={modal2} aria-labelledby="modal-modal-title" sx={{ mt: 10 }}>
        <Box
          sx={POModalStyle}
          className="crm-modal-quotes-product-basic"
          style={{ borderRadius: "8px", width: "fit-content" }}
        >
          <Box sx={{ marginBottom: "20px" }}>
            <Typography className="crm-quotes-prroduct-form-label">
              Quotation Type
            </Typography>
            <RadioGroup
              row
              aria-label="quoteBy"
              name="quoteBy"
              value={isQuoteType}
              onChange={(e) => setQuoteType(e.target.value)}
            >
              <Box className="crm-quotes-product-form-radio-item">
                <FormControlLabel
                  className="crm-quotes-prroduct-form-radio-item-label"
                  value="ACTUAL"
                  control={<Radio />}
                  label="Actual"
                />
              </Box>
              <Box className="crm-quotes-product-form-radio-item">
                <FormControlLabel
                  className="crm-quotes-prroduct-form-radio-item-label"
                  value="DEMO"
                  control={<Radio />}
                  label="Free Access"
                />
              </Box>
            </RadioGroup>
          </Box>
          {/* <div style={{marginBottom:'10px'}}>
                  </div> */}

          <div className="crm-quotes-prroduct-form-label">
            Select the product from the list below
          </div>

          <Box className="crm-quotes-prroduct-form-radio-item-list">
            <Box className="crm-quotes-prroduct-form-radio-item-list-value">
              {filteredArray?.length ? (
                <>{filteredArray?.[0]?.[0]}</>
              ) : (
                "Select"
              )}
            </Box>
            <Box className="crm-quotes-prroduct-form-radio-item-list-items">
              <div style={{ overflow: "auto", maxHeight: "200px" }}>
                <div className={classes.flkInnerBoxGrid}>
                  {filteredArray?.length > 0 &&
                    filteredArray?.[0]?.[1]?.map((data, i) => {
                      return (
                        <div className={classes.flkInnerChildBoxNew} key={i}>
                          <div style={{ whiteSpace: "nowrap" }}>
                            {data?.learningProfile}
                          </div>
                          <Checkbox
                            checked={isChecked(data)}
                            onChange={(event) => handleRowCheck(event, data)}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            </Box>
          </Box>

          <Typography
            id="modal-modal-description"
            align="center"
            sx={{ mt: 2 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 25,
              }}
            >
              <Button
                style={{ marginRight: "20px" }}
                onClick={() => {
                  setModal2(!modal2);
                  setQuoteStatus(!isQuote);
                  setCheckedRows([]);
                }}
                className="crm-btn crm-btn-outline"
              >
                Cancel
              </Button>
              <Button
                style={{ marginRight: "20px", borderRadius: 4 }}
                disabled={checkedRows?.length === 0 ? true : false}
                onClick={(e) => setFormSubmit(true)}
                className="crm-btn crm-btn-primary"
              >
                Next
              </Button>
            </div>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default ProductListModal;
