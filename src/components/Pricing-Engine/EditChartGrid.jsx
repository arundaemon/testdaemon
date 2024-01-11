import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  IconButton,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Link,
  Box,
  Input,
} from "@mui/material";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';

const EditChartGrid = ({
  intervalX,
  intervalY,
  xaxisLabel,
  yaxisLabel,
  packageMOP,
  packageMRP,
  minIntervalX,
  maxIntervalX,
  minIntervalY,
  maxIntervalY,
  getFileUploadData,
  handleUpdateData,
  getDefaultData,
  setXAxis,
  setYAxis,
  setIntervalXValue,
  setIntervalYValue,
  setMinIntervalX,
  setMaxIntervalX,
  setMinIntervalY,
  setMaxIntervalY,
  setIsNextClicked
}) => {
  const [tableData, setTableData] = useState([]);
  const [uploadData, setUploadData] = useState(null);
  const location = useLocation();
  const [graphData, setGraphData] = useState([]);
  const [update, setUpdate] = useState(false)
  const [isUpload, setIsUpload] = useState(false)
  const [exceldata, setExcelData] = useState([])
  let { data } = location?.state ? location?.state : {};
  let csvData = []



  let headerValuesX = [];
  let headerValuesY = [];

  if (!isNaN(intervalX) && intervalX > 0) {
    const roundedMinIntervalX = Math.floor(minIntervalX);
    const numberOfIntervals = Math.ceil(
      (maxIntervalX - roundedMinIntervalX) / intervalX
    ) + 1;
    headerValuesX = Array.from(
      { length: numberOfIntervals },
      (_, i) => i * intervalX + roundedMinIntervalX
    );
  } else {
    for (let key of Object.keys(intervalX)) {
      headerValuesX.push(intervalX[key].label);
    }
  }

  if (!isNaN(intervalY) && intervalY > 0) {
    const roundedMinIntervalY = Math.floor(minIntervalY);
    const numberOfIntervals = Math.ceil(
      (maxIntervalY - roundedMinIntervalY) / intervalY
    ) + 1;
    headerValuesY = Array.from(
      { length: numberOfIntervals },
      (_, i) => i * intervalY + roundedMinIntervalY
    );
  } else {
    for (let key of Object.keys(intervalY)) {
      headerValuesY.push(intervalY[key].label);
    }
  }



  const [selectedFileName, setSelectedFileName] = useState(null);


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFileName(event.target.files[0].name);

    if (!file) {
      console.error("No file selected.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      const parsedData = Papa.parse(content, { header: true }).data;
      setUploadData(parsedData);
      setTableData(parsedData);
      setIsUpload(true)
      toast.success("Data uploaded successfully!")


      if (parsedData.length > 0) {
        const firstDataRow = parsedData[0];
        const keys = Object.keys(firstDataRow);

        keys.forEach((key) => {
          if (
            firstDataRow[key].includes("MRP:") &&
            firstDataRow[key].includes("MOP:")
          ) {
            const mrpValue = parseInt(
              firstDataRow[key].match(/MRP: (\d+)/)[1],
              10
            );
            const mopValue = parseInt(
              firstDataRow[key].match(/MOP: (\d+)/)[1],
              10
            );

          }
        });
      }
    };

    reader.readAsText(file);
  };




  graphData.push(["", ...headerValuesX]);

  // Log Y-axis headers and data
  headerValuesY.forEach((valueY, idxY) => {
    const row = [valueY];
    headerValuesX.forEach((valueX, idxX) => {
      const cellData = tableData[idxY]
        ? tableData[idxY][valueX]
        : null;
      const mrp = cellData
        ? parseInt(cellData.match(/MRP: (\d+)/)[1], 10)
        : packageMRP;
      const mop = cellData
        ? parseInt(cellData.match(/MOP: (\d+)/)[1], 10)
        : packageMOP;

      row.push({
        index: `(${idxX},${idxY})`,
        valueX: valueX,
        valueY: valueY,
        cellData: cellData,
        mrp: mrp,
        mop: mop,
      });
    });
    graphData.push(row);
  });



  useEffect(() => {
    if (tableData?.length > 0) {
      const headerRow = [yaxisLabel, ...headerValuesX];
      csvData = [headerRow];
      tableData?.forEach(item => {
        const row = [item[yaxisLabel]];
        for (const xValue of headerValuesX) {
          row.push(item[xValue]);
        }
        csvData.push(row);
      });

      setExcelData(csvData)
    }

  }, [tableData])


  const fileInputRef = useRef(null);

  const handleButtonClick = (e) => {
    fileInputRef.current.click();
  };



  const updateGraphData = async (matrixDetails) => {

    let details = matrixDetails?.matrix_details


    let data = []
    details?.forEach(item => {
      const rowData = {};
      let val = item["y-axis_matrix_attribute_name"]
      rowData[val] = item["y-axis_value"];

      item?.["x-axis_details"]?.forEach(detail => {
        const xAxisValue = detail["x-axis_value"];
        const mrp = detail["x-axis_mrp"];
        const mop = detail["x-axis_mop"];


        const cellValue = `MRP: ${mrp}, MOP: ${mop}`;
        rowData[xAxisValue] = cellValue;
      });

      data.push(rowData);
    });

    setTableData(data)
    setUpdate(true)
    getDefaultData(data)

  };

  useEffect(() => {
    if (uploadData) {
      getFileUploadData(uploadData);
    }
  }, [uploadData]);

  useEffect(() => {
    if (data?.matrix_details?.length > 0) {
      updateGraphData(data);
    }
  }, [data]);

  const deleteGridHandler = () => {
    setXAxis('')
    setYAxis('')
    setIntervalXValue('')
    setIntervalYValue('')
    setMinIntervalX('')
    setMaxIntervalX('')
    setMinIntervalY('')
    setMaxIntervalY('')
    setIsNextClicked(false)
  }



  return (
    <>
      {/* <IconButton variant="contained" color="primary" component="span">
        <CSVLink data={exceldata} filename="table_data.csv">
          <CloudDownloadIcon style={{ color: "orange" }} />
        </CSVLink>
      </IconButton>{" "}
      &nbsp; &nbsp; &nbsp;
      <Input type="file" accept=".csv" onChange={handleFileUpload} /> */}

      <Box sx={{ display: "flex", marginTop: "30px", marginBottom: "10px" }}>
        <IconButton variant="contained" color="primary" component="span">
          <CSVLink data={csvData} filename="table_data.csv">
            {/* <CloudDownloadIcon style={{ color: "orange" }} /> */}
            <DownloadIcon style={{ color: "orange", fontSize: "40px" }} />
          </CSVLink>
        </IconButton>
        {/* <Input sx={{ border: "1px solid red" }} type="file" accept=".csv" onChange={handleFileUpload} /> */}

        <Box sx={{ marginLeft: "28px", border: '1px solid hsl(0, 0%, 80%)', borderRadius: "4px", marginTop: "8px", width: "305px", height: "38px", }}>
          <input
            type="file"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            placeholder="Select attach file"
          // accept=".png,.jpg,.pdf,!.csv,!.xlsx"
          // required
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ textAlign: "left", margin: "auto 0", marginLeft: "10px" }}>
              {selectedFileName ? selectedFileName : <Box sx={{ color: "hsl(0, 0%, 80%)" }}>{"Select attach file"}</Box>}
            </Box>
            <Button sx={{ textAlign: "right", color: "#4482FF !important" }} onClick={(e) => handleButtonClick(e)}>{'Browse'}</Button>
          </Box>
        </Box>
        <Box sx={{ margin: "auto 0", marginLeft: "10px", paddingBottom: "5px" }}>
          <DeleteIcon sx={{ color: "#f45e29", fontSize: "35px", cursor: "pointer" }} onClick={deleteGridHandler} />
        </Box>

      </Box>

      <TableContainer component={Paper}>
        <Table className="chart-container">
          <TableHead>
            <TableRow>
              <TableCell
                className="headerItem x-axis-header"
                colSpan={headerValuesX.length + 1}
                style={{
                  textAlign: "center", // Center text horizontally
                  verticalAlign: "middle", // Center text vertically
                  fontWeight: "bold", // Make text bold if desired
                }}
              >
                {xaxisLabel}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="y-axis-container">
                <div
                  className="leadingHeader"
                  style={{ writingMode: "horizontal-tb" }}
                >
                  <span
                    style={{
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                      textOrientation: "inherit",
                      transform: "scaleY(1.5)",
                    }}
                  >
                    {yaxisLabel}
                  </span>
                </div>
              </TableCell>
              {headerValuesX.map((valueX, idxX) => (
                <TableCell key={idxX} className="headerItem">
                  {valueX}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {headerValuesY?.map((valueY, idxY) => (
              <TableRow key={idxY}>
                <TableCell className="y-axis-value">{valueY}</TableCell>
                {headerValuesX?.map((valueX, idxX) => {
                  const cellData = tableData[idxY]
                    ? tableData[idxY][valueX]
                    : null;
                  const mrp = cellData
                    ? parseInt(cellData.match(/MRP: (\d+)/)[1], 10)
                    : packageMRP;
                  const mop = cellData
                    ? parseInt(cellData.match(/MOP: (\d+)/)[1], 10)
                    : packageMOP;


                  return (
                    <TableCell
                      key={idxX}
                      style={{ border: "1px solid black" }}
                    >
                      <div>
                        {/* <span>
                          <div>MRP: {mrp}</div>
                          <div>MOP: {mop}</div>
                        </span> */}
                        <span>
                          {typeof mrp !== 'NaN' && <div>MRP: {mrp}</div>}
                          {typeof mop !== 'NaN' && <div>MOP: {mop}</div>}
                        </span>
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default EditChartGrid;








