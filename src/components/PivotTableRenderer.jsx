import React, { useEffect, useState, useRef } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import '../modifiedlibraries/PivotTableConfig/dist/pivotTableGrid';
import '../modifiedlibraries/PivotTableConfig/dist/styles/ag-grid.css';
import '../modifiedlibraries/PivotTableConfig/dist/styles/ag-theme-material.css';
import PlusIcon from '../assets/icons/Plus_Icon.svg'
import MinusIcon from '../assets/icons/Minus_Icon.svg'
import moment from 'moment';


const Grid = ({ graphData, query, getPivotColState, gridColumnApi, setGridColumnApi, columnState, openToolBar, isPivotEnabled, dateFieldFormat, pivotConfig, columnDisplayName, columnTitle }) => {
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef();

  // const [gridColumnApi, setGridColumnApi] = useState(null);
  const resultSet = graphData;

  useEffect(() => {
    if (resultSet) {
      handleSetRowData(resultSet)
    }
  }, [resultSet, dateFieldFormat]);


  const formatNumberTimeField = (value, format, type) => {
    let strHr, hours, minutes, seconds;

    if (type === 'second') {
      const sec = parseInt(value, 10);
      hours = Math.floor(sec / 3600);
      minutes = Math.floor((sec - (hours * 3600)) / 60);
      seconds = sec - (hours * 3600) - (minutes * 60);
      if (hours < 10) {
        if (hours) {
          strHr = "0" + hours;
        }
        hours = "0" + hours;
      }
      else {
        strHr = hours
      }
      if (minutes < 10) { minutes = "0" + minutes; }
      if (seconds < 10) { seconds = "0" + seconds; }
    }
    else if (type === 'minute') {
      const min = parseFloat(value, 10);
      hours = Math.floor(min / 60);
      minutes = Math.floor((min - ((hours * 3600)) / 60));
      seconds = Math.floor((min * 60) - (hours * 3600) - (minutes * 60));

      if (hours < 10) {
        if (hours) {
          strHr = "0" + hours;
        }
        hours = "0" + hours;
      }
      else {
        strHr = hours
      }

      if (minutes < 10) { minutes = "0" + minutes; }
      if (seconds < 10) { seconds = "0" + seconds; }
    }
    else if (type === 'hour') {
      const hr = parseFloat(value, 10);
      hours = Math.floor(hr);
      minutes = (Math.abs(hr) - hours) * 60
      seconds = (Math.abs(minutes) - Math.floor(minutes)) * 60

      if (hours < 10) {
        if (hours) {
          strHr = "0" + hours;
        }
        hours = "0" + hours;
      }
      else {
        strHr = hours
      }
      if (minutes < 10) { minutes = "0" + minutes; }
      if (seconds < 10) { seconds = "0" + seconds; }
    }

    let formatted;

    switch (format) {
      case 'hh:mm:ss':
        formatted = hours + ':' + minutes + ':' + seconds;
        break;
      case 'HH:MM:SS':
        if (strHr) {
          formatted = `${hours}hour : ${minutes}minute : ${seconds}second`
        }
        else {
          formatted = `${minutes}minute : ${seconds}second`
        }
        break;
      default:
        formatted = value
        break;
    }
    return formatted;
  }


  const handleSetRowData = (resultSet) => {
    let { timeDimensions } = resultSet.query()
    let TimeGranularityKey = null
    let GranularityDateFormat = ''

    if (timeDimensions.length) {
      let { dimension, granularity } = timeDimensions[0]
      TimeGranularityKey = `${dimension ?? ''}.${granularity ?? ''}`

      let dateFormat = 'DD MMM YY'

      switch (granularity) {
        case 'hour':
          dateFormat = dateFormat + " HH"
          break;
        case 'minute':
          dateFormat = dateFormat + " HH:mm"
          break;
        case 'second':
          dateFormat = dateFormat + " HH:mm:ss"
          break;
        case 'month':
          dateFormat = "MMM YY"
          break;
        case 'year':
          dateFormat = "YYYY"
          break;
      }

      GranularityDateFormat = dateFormat
    }


    let NewRowData = resultSet.tablePivot(pivotConfig)
      .map(row => Object.keys(row).reduce((object, key) => {
        let newObj = {}

        if (TimeGranularityKey === key && GranularityDateFormat) {
          row[key] = moment(row[key]).format(GranularityDateFormat)
        }

        if (dateFieldFormat && Object.keys(dateFieldFormat).length) {
          for (let obj of Object.keys(dateFieldFormat)) {
            let field = obj.split('_')[0];
            let type = obj.split('_')[1];
            if (type === 'date' && row[field]) {
              row[field] = moment(row[field]).format(dateFieldFormat[obj])
            }
            else if (row[field]) {
              const formatted = formatNumberTimeField(row[field], dateFieldFormat[obj], type);
              row[field] = formatted
            }
          }
        }

        for (let key of Object.keys(row)) {
          if (row[key] === undefined || row[key] === null || row[key] === 'NaN') {
            row[key] = 0
          }
        }


        newObj = { ...object, [key.replaceAll('.', '-')]: row[key] }
        return newObj

      }, {}))

    setRowData(NewRowData)
  }

  const columnDefs = [...query?.timeDimensions?.map(dim => (dim.dimension + "." + dim.granularity)), ...query.dimensions, ...query.measures].map(field => ({
    headerName: field.split('.')[1],
    field: field.replaceAll('.', '-'),
  }));


  const onGridReady = (params) => {
    if (setGridColumnApi)
      setGridColumnApi(params.columnApi);

    restoreState(params.columnApi)
    var columnToolPanel = params?.api?.getToolPanelInstance('columns');
    columnToolPanel?.setRowGroupsSectionVisible(false);
  };

  const restoreState = (ColAPi) => {
    ColAPi.setPivotMode(true)
    ColAPi.applyColumnState({ state: columnState, defaultState: { pivot: false } })
  };

  const getColumnState = () => {
    if (getPivotColState)
      getPivotColState()
  }

  return (
    <div className='ag-theme-material' style={{ height: 700 }}>
      <AgGridReact
        ref={gridRef}
        defaultColDef={{
          flex: 1,
          minWidth: 150,
          sortable: true,
          resizable: true,
          menuTabs: []
        }}
        aggFuncs={{
          'min': ({ values }) => values.reduce((min, value) => Math.min(min, Number(value)), 0),
          'max': ({ values }) => values.reduce((max, value) => Math.max(max, Number(value)), 0),
          'sum': ({ values }) => values.reduce((sum, value) => sum + Number(value), 0),
          'avg': ({ values }) => (values.reduce((sum, value) => sum + Number(value), 0) / values.length).toFixed(0),
        }}
        animateRows={true}
        autoGroupColumnDef={{
          minWidth: 250,
          cellRendererParams: { suppressCount: true }
        }}
        groupHideOpenParents={true}
        groupDisplayType={'multipleColumns'}
        pivotMode={true}
        sideBar={openToolBar === true ? 'columns' : false}
        rowData={rowData}
        onGridReady={onGridReady}
        onColumnRowGroupChanged={getColumnState}
        suppressDragLeaveHidesColumns={true}
        suppressMakeColumnVisibleAfterUnGroup={true}
        isGroupOpenByDefault={() => true}
        icons={{
          groupExpanded: `<img src=${MinusIcon} style="height: 16px; width: 16px;padding-right: 2px"/>`,
          groupContracted: `<img src=${PlusIcon} style="height: 16px; width: 16px;padding-right: 2px"/>`,
        }}
        rowGroupPanelShow={openToolBar === true ? 'always' : false}
        // pivotPanelShow={openToolBar === true ? 'always' : false}
        groupDefaultExpanded={1}
        getRowStyle={params => {
          if (params?.node?.rowIndex % 2 === 0)
            return { background: '#f3f3f3' }
        }}
        enableRangeSelection={true}
      >
        {columnDefs.map((column, i) => {
          const name = column.field.replace('-', '.');
          const isDimension = Object.values(query.dimensions).indexOf(name) !== -1;
          const isMeasure = Object.values(query.measures).indexOf(name) !== -1;

          return (
            <AgGridColumn
              key={i}
              headerName={columnTitle?.[0]?.[name] || columnDisplayName[name] || column.headerName}
              field={column.field}
              enablePivot={true}
              enableRowGroup={true}
              enableValue={isMeasure || isDimension}
              pivot={column.headerName === 'status'}
              rowGroup={isDimension}
              allowedAggFuncs={['sum', 'max', 'avg', 'min']}
              aggFunc={isMeasure ? 'sum' : null}
            />
          );
        })}
      </AgGridReact>
    </div>
  );
};

export default Grid;
