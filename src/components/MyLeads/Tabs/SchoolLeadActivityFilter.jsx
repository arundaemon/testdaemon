import {
    Box,
    Fade,
    Modal,
    Typography,
    Button
  } from '@mui/material';
  import _ from 'lodash';
  import React, {  useEffect, useState } from 'react';
  import { ReactComponent as FilterIcon } from './../../../assets/image/filterIcon.svg';
  import { ReactComponent as CloseIcon } from "../../../assets/icons/icon-modal-close.svg";
import { SchoolLeadActivityFilterItem } from './SchoolLeadActivityFilterItem';

export const SchoolLeadActivityFilter = ({ filters }) => {
    const [schoolFilters, setSchoolFilters] = useState(filters);
    const [currentTab, setCurrentTab] = useState(0);

    useEffect(() => {
      //setSchoolFilters()
    }, []);

  
    const [filtersModalMobileStatus, setFiltersModalMobileStatus] = useState(false);
    useEffect(() => {
      if (filtersModalMobileStatus) {
        document.body.classList.add("modal-viewport-mobile");
      } else {
        document.body.classList.remove("modal-viewport-mobile");
      }
    }, [filtersModalMobileStatus]);
  
    if (!schoolFilters?.filter(filter => !filter.hidden)?.length) return null;
  
    const handleTabChange = (newValue) => {
      setCurrentTab(newValue);
    };
  
    const handleCloseFilterModal = () => {
      setFiltersModalMobileStatus(false);
    }
  
  
    return (
      <>
        <Box sx={{ flexGrow: 1 }} >
          <Box className={`viewport-filters-container`}>
            <Button  className="filters-view-btn"  variant="outline"
              startIcon={<FilterIcon className="btn_icon_before" />} onClick={() => setFiltersModalMobileStatus(true)} >Filters</Button>
            <Modal
              aria-labelledby="transition-modal-viewport"
              aria-describedby="transition-modal-viewport"
              className="modal-root modal-viewport-root"
              open={filtersModalMobileStatus}
              onClose={handleCloseFilterModal}
              closeAfterTransition
            >
              <Fade in={filtersModalMobileStatus}>
                <Box className="modal-paper modal-viewport" id="transition-modal-viewport" style={{ height: '100%' }}>
                  <CloseIcon onClick={handleCloseFilterModal} className="enlarge-close" />
                  <Box className="modal-viewport-header" >
                    <Typography variant="subtitle1" className="modal-viewport-header-title" >{`Filter`}</Typography>
                  </Box>
                  <Box className="modal-viewport-content">
                    <Box className="modal-viewport-content-container" sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', }} >
                      {
                        schoolFilters?.length && schoolFilters?.filter(obj => !obj?.hidden)?.length ?
                          <>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                overflow: 'auto',
                                minWidth: '135px',
                                backgroundColor: '#f1f1f1',
                              }}
                            >
                              {
                                schoolFilters.map((filter, index) => {
                                  if (filter?.isCascadedHidden) return null;
                                  const isSelected = currentTab === index;
                                  return (
                                    <Box
                                      key={`filter-item-tab-${filter?.id || index}`}
                                      sx={{
                                        height: '48px',
                                        backgroundColor: isSelected ? '#fff' : '#f1f1f1',
                                        borderLeft: isSelected ? '3px solid #f45e29' : '3px solid #f1f1f1',
                                        color: isSelected ? '#f45e29' : '#202124',
                                        borderRight: 0,
                                        fontSize: '14px',
                                        fontWeight: isSelected ? 600 : 400,
                                        textAlign: 'left',
                                        padding: '0.7rem'
                                      }}
                                      onClick={() => handleTabChange(index)}
                                    >
                                      {filter?.displayNameOnSheet || filter?.displayName || filter?.member?.split('.')[1]}
                                    </Box>
                                  )
                                })
                              }
                            </Box>
                            {
                              schoolFilters?.map((filter, index) => {
                                if (filter?.isCascadedHidden || filter?.hidden) return null;
                                return (
                                  <Box
                                    key={`filter-item-tab-panel-${filter?.id || index}`}
                                    sx={{
                                      display: currentTab === index ? 'flex' : 'none',
                                      overflow: 'hidden',
                                      height: '100%',
                                      width: '100%',
                                    }}
                                  >
                                    <SchoolLeadActivityFilterItem
                                      filter={filter}
                                      setFiltersModalMobileStatus={setFiltersModalMobileStatus}
                                    />
                                  </Box>
                                )
                              })
                            }
                          </>
                          : null
                      }
                    </Box>
                  </Box>
                </Box>
              </Fade>
            </Modal >
          </Box>
        </Box>
      </>
    )
  }