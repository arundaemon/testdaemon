import {
    Box, Checkbox,FormControlLabel, InputAdornment, TextField,
  } from '@mui/material';
  import _ from 'lodash';
  import React, { useState } from 'react';
  import AutoSizer from "react-virtualized-auto-sizer";
  import { FixedSizeList as List } from "react-window";
  import { ReactComponent as CheckBoxCheckedIcon } from '../../../assets/icons/icon-checkbox-checked.svg';
  import { ReactComponent as CheckBoxIcon } from '../../../assets/icons/icon-checkbox-unchecked.svg';
  import { ReactComponent as InputSearchIcon } from "../../../assets/icons/icon-feather-search.svg";
  import Controls from '../../../components/controls/Controls';
  import Loader from '../../../pages/Loader';



export const SchoolLeadActivityFilterItem = ({
    filter,
    setFiltersModalMobileStatus,
  })  => {
    const [isFilterApplyLoading, setIsFilterApplyLoading] = useState(false);

    function FilterItem({ index, style, data }) {
      let label = data[index]?.label;
      let value = data[index]?.value;
  
      return (
        <>
          <div style={style} key={`filter-option-${index}`}
            // onClick={() => ''}
          >
            <div
              title={label}
              className={"filters-dropdown-menuitem"}
              sx={{
                fontSize: '14px',
                color: '#202124',
                '&:hover': {
                  backgroundColor: 'transparent'
                }
              }}
            >
              <FormControlLabel
                className="filters-view-checkbox"
                control={
                  <Checkbox
                    className="form_checkbox"
                    icon={<CheckBoxIcon />}
                    checkedIcon={<CheckBoxCheckedIcon />}
                    //checked={''}
                  />
                }
                label={label}
              />
            </div>
          </div>
        </>
      )
    }
  
    return (
      <Box
        sx={{ p: '0.25rem 0 0.25rem 1rem', width: '100%', display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}
        className={`report-chart-filters-list ` + isFilterApplyLoading}
      >
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            flexGrow: 1,
          }}
        >

          <TextField
            type="search"
            size="medium"
            placeholder="Search..."
            className="filters-view-dropdown-search width-90p mt-8p"
            //onChange={''}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <InputSearchIcon className="input_search_icon" />
                </InputAdornment>
              ),
            }}
          />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {
              (filter.listType !== 'dropdown')
                ? (
                  <Box
                    className={"filters-dropdown-menuitem select-all-option"}
                    sx={{
                      fontSize: '14px',
                      color: '#202124',
                      '&:hover': {
                        backgroundColor: 'transparent'
                      },
                      marginY: '0.5rem'
                    }}
                  >
                    <FormControlLabel
                      className="filters-view-checkbox"
                      //onChange={''}
                      control={
                        <Checkbox
                          className="form_checkbox"
                          icon={<CheckBoxIcon />}
                          checkedIcon={<CheckBoxCheckedIcon />}
                          // checked={''}
                        />
                      }
                      label={'Select All'}
                    />
                  </Box>
                )
                : null
            }
            <div
              className={`virtual-filter-div ` 
                + (filter.options.length? 'filter-data-exists ' : ` `)
                + ((filter.options.length && filter.options.length < 5) ? ` filter-data-auto ` : ` `)
              }
            >
              <AutoSizer>
                {({ height, width }) => (
                  <List
                    itemSize={42}
                    className="List"
                    width={width - 4}
                    height={filter.options.length || filter.options.length ? height : 20}
                    itemData={filter.options.length ? filter.options : filter.options}
                    itemCount={filter.options.length ? filter.options.length : 1}
                  >
                    {FilterItem}
                  </List>
                )}
              </AutoSizer>
            </div>
          </Box>
          <Box className='filters-actions filters-popover-footer'>
            <Box className='filters-actions-wrapper'>
              <Controls.Button className="report_form_ui_btn cancel cancel2" color="secondary" text="Clear All"
                //  onClick={''} 
                  />
              <Controls.Button className="report_form_ui_btn submit submit2" type="submit" text="Apply" 
              // onClick={''} 
              />
            </Box>
          </Box>
        </Box>
            
      </Box>
    )
  }