import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { useStyles } from "../../css/SiteSurvey-css";
import ReactSelect from "react-select";
import { QCOPTIONS } from "../../constants/general";
import {
  createQc,
  uploadQcImageToGcp,
} from "../../config/services/implementationForm";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const QcDetailTable = ({ data, quotationCode }) => {
  const classes = useStyles();

  const navigate = useNavigate();

  const [fields, setFields] = useState([
    {
      itemName: "",
      variant: "",
      uploadImage: "",
      status: "",
      remarks: "",
      fileName: "",
    },
  ]);

  const handleChange = (index, attr, event) => {
    const newFields = [...fields];
    newFields[index][attr] = event;
    setFields(newFields);
  };

  const handleSelectChange = (index, selectedOption) => {
    const newFields = [...fields];
    newFields[index].status = selectedOption;
    setFields(newFields);
  };

  const handleUploadFile = (params) => {
    let { index, fileName, fileUrl } = params;
    const newFields = [...fields];
    newFields[index].uploadImage = fileUrl;
    newFields[index].fileName = fileName;
    setFields(newFields);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "250px",
    }),
    // ... other style overrides
  };

  var myArray = ["2"];

  const getImplementedUnit = (obj) => {
    let implementUnit = obj?.implementedUnit;
    let implementUnitArray = [];
    let data;
    for (var i = 0; i < implementUnit; i++) {
      data = {
        itemName: obj?.productItemName,
        variant: obj?.itemVariantName,
        implementedUnit: obj?.implementedUnit,
        hardwareId: obj?.implementedUnit,
        hardwareType: obj?.hardwareType,
        uploadImage: "",
        status: "",
        remarks: "",
        fileName: "",
      };
      implementUnitArray.push(data);
    }
    return implementUnitArray;
  };

  const addFieldData = (data) => {
    let fieldData;
    fieldData = data?.map((obj) => {
      return getImplementedUnit(obj);
    });

    if (fieldData?.length) {
      fieldData = fieldData?.flat();
      setFields(fieldData);
    }
  };

  useEffect(() => {
    if (data?.length) {
      addFieldData(data);
    }
  }, [data]);

  const uploadFile = async (index, event) => {
    let fileName = event.target.files[0].name;
    let file = event.target.files[0];
    let formData = new FormData();
    let params = {
      index: index,
      fileName: fileName,
      fileUrl: "",
    };

    formData.append("image", file);

    try {
      let res = await uploadQcImageToGcp(formData);
      if (res?.result) {
        params = {
          ...params,
          fileUrl: res?.result,
        };
        handleUploadFile(params);
      }
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <>
      <Box className="crm-table-container">
        {fields?.length > 0 && data?.length > 0 ? (
          <TableContainer component={Paper}>
            <Table
              aria-label="simple table"
              className="custom-table datasets-table crm-sd-claims-table crm-table-header-left-aligned"
            >
              <TableHead>
                <TableRow className="cm_table_head">
                  <TableCell>
                    {/* {" "} */}
                    <div className="tableHeadCell">S.No</div>
                  </TableCell>
                  <TableCell>
                    {/* {" "} */}
                    <div className="tableHeadCell">Item Name</div>
                  </TableCell>
                  <TableCell>
                    {/* {" "} */}
                    <div className="tableHeadCell">Variant</div>
                  </TableCell>
                  <TableCell>
                    {/* {" "} */}
                    <div
                      className="tableHeadCell"
                      style={{ justifyContent: "center" }}
                    >
                      Upload Image
                    </div>
                  </TableCell>
                  <TableCell>
                    {/* {" "} */}
                    <div
                      className="tableHeadCell"
                      style={{ justifyContent: "center" }}
                    >
                      Status
                    </div>
                  </TableCell>
                  <TableCell>
                    {/* {" "} */}
                    <div className="tableHeadCell">Remarks</div>
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>

              <TableBody>
                {fields?.map((field, index) => {
                  return (
                    <>
                      <TableRow key={index}>
                        <TableCell>{index}</TableCell>
                        <TableCell sx={{ minWidth: "100px !important" }}>
                          {field?.itemName}
                        </TableCell>
                        <TableCell sx={{ minWidth: "100px !important" }}>
                          {field?.variant}
                        </TableCell>
                        <TableCell sx={{ minWidth: "200px !important", cursor: "no-drop" }}>
                          <input
                            autoComplete="off"
                            readOnly={true}
                            className={classes.inputStyle}
                            type="text"
                            placeholder={field?.fileName ?? "Upload here"}
                            value=""
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: "220px !important" }}>
                          <ReactSelect
                            classNamePrefix="select"
                            isDisabled={true}
                            options={QCOPTIONS}
                            value={field.status}
                            menuPortalTarget={document.body}
                            onChange={(selectedOption) =>
                              handleSelectChange(index, selectedOption)
                            }
                            styles={{ ...customStyles }}
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: "200px !important" }}>
                          <input
                            className={classes.inputStyle}
                            name="remarks"
                            readOnly={true}
                            type="text"
                            // placeholder="Remark"
                            value={field?.remarks}
                            onChange={(event) =>
                              handleChange(index, "remarks", event.target.value)
                            }
                            onKeyDown={(e) => {
                              e.preventDefault();
                            }}
                            onChangeRaw={(e) => e.preventDefault()}
                          />
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div className={classes.noData}>
            <p>No Data</p>
          </div>
        )}
      </Box>
    </>
  );
};

export default QcDetailTable;
