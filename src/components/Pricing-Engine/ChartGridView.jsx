import React from 'react'
import {
    Box, Grid, Typography, Alert, Divider, Breadcrumbs, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Table,
} from "@mui/material";
import { useStyles } from "../../css/Quotation-css";


const ChartGridView = ({ setIntervalXValue,
    minIntervalX,
    maxIntervalX,
    minIntervalY,
    maxIntervalY,
    tableData,
    intervalX,
    intervalY,
    xaxisLabel,
    yaxisLabel
}) => {

    const classes = useStyles();
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


    return (
        <div>
            <Grid className={classes.cusCard}>
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
                                        const mrp = parseInt(cellData.match(/MRP: (\d+)/)[1], 10)

                                        const mop = parseInt(cellData.match(/MOP: (\d+)/)[1], 10)

                                        return (
                                            <TableCell
                                                key={idxX}
                                                style={{ border: "1px solid black" }}
                                            >
                                                <div>
                                                    <span>
                                                        <div>MRP: {mrp}</div>
                                                        <div>MOP: {mop}</div>
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




            </Grid>
        </div>
    )
}

export default ChartGridView
