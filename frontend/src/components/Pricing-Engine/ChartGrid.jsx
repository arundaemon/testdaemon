import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import {
  Box,
  Button,
  IconButton,
  Input,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import Papa from "papaparse";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { CSVLink } from "react-csv";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';


const ChartGrid = ({
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
  const [tableData, setTableData] = useState([]); // State to store table data
  const [uploadData, setUploadData] = useState(null)
  const [isUpload, setIsUpload] = useState(false)

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
      setUploadData(parsedData)
      // Update the tableData state with the parsedData
      setTableData(parsedData);
      setIsUpload(true)
      toast.success("Data uploaded successfully!")

      // Log the MRP and MOP values
      if (parsedData.length > 0) {
        const firstDataRow = parsedData[0];
        const keys = Object.keys(firstDataRow);
        keys?.forEach((key) => {
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

  useEffect(() => {
    if (uploadData) {
      getFileUploadData(uploadData)
    }
  }, [uploadData])


  const csvData = [
    [yaxisLabel, ...headerValuesX],
    ...headerValuesY.map((valueY) => [
      valueY,
      ...Array(headerValuesX.length).fill(
        `MRP: ${packageMRP}, MOP: ${packageMOP}`
      ),
    ]),
  ];





  const getTableDataDefault = () => {
    const result = headerValuesY?.map((item) => {
      const obj = {
        ...headerValuesX.reduce((acc, x) => {
          acc[x] = `MRP: ${packageMRP}, MOP: ${packageMOP}`;
          return acc;
        }, {}),
        yaxisLabel: item?.toString(),
      };
      return obj;
    });
    return result
  }




  useEffect(() => {
    if (isUpload === false) {
      let result = getTableDataDefault()
      setTableData(result)
      getDefaultData(result)
    }
  }, [isUpload, minIntervalX, maxIntervalX, minIntervalY, maxIntervalY,])


  const fileInputRef = useRef(null);

  const handleButtonClick = (e) => {
    fileInputRef.current.click();
  };

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


      <TableContainer component={Paper} sx={{ margin: "20px 0" }}>
        <Table className="chart-container">
          <TableHead>
            <TableRow>
              <TableCell
                className="headerItem x-axis-header"
                colSpan={headerValuesX.length + 1}
                style={{
                  textAlign: "center",  // Center text horizontally
                  verticalAlign: "middle",  // Center text vertically
                  fontWeight: "bold",  // Make text bold if desired
                }}
              >
                {xaxisLabel}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="y-axis-container" sx={{width:"150px"}}>
                <div
                  className="leadingHeader"
                  style={{ writingMode: "horizontal-tb" }}
                >
                  <span
                    style={{
                      fontFamily: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
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
            {headerValuesY.map((valueY, idxY) => (
              <TableRow key={idxY}>
                <TableCell className="y-axis-value">{valueY}</TableCell>
                {headerValuesX.map((valueX, idxX) => {
                  const cellData = tableData[idxY]
                    ? tableData[idxY][valueX]
                    : null;
                  const mrp = parseInt(cellData?.match(/MRP: (\d+)/)[1], 10)
                  const mop = parseInt(cellData?.match(/MOP: (\d+)/)[1], 10)
                  return (
                    <>
                      {cellData && <TableCell
                        key={idxX}
                        style={{ border: "1px solid black" }}
                      >
                        <div>
                          <span>
                            {typeof mrp !== 'NaN' && <div>MRP: {mrp}</div>}
                            {typeof mop !== 'NaN' && <div>MOP: {mop}</div>}
                          </span>
                        </div>
                      </TableCell>
                      }
                    </>
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

export default ChartGrid;
