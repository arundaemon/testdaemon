import React, { memo, useCallback, useState, useRef, useEffect } from "react"
import { Box, MenuItem, Checkbox, ListItemText, ClickAwayListener } from "@mui/material";
import { ReactComponent as DropDownIcon } from "../../../assets/icons/icon-dropdown-2.svg";
import _ from "lodash";

const FormMultiSelect = ({placeholder, options, handleSelectedValue, optionsLabels, value, returnType = 'object', isComponentReady = true, 
    theme = 'standard', fontTheme = 'md'}) => {
    const [isDropDownOpen, setIsDropDownOpen] = useState(false)
    const [selectedValues, setSelectedValues] = useState(value ?? []);
    const [dropDownOptions, setDropDownOptions] = useState(options ?? []);
    const selectRef = useRef(null);
    const [selectDropDownPos, setSelectDropDownPos] = useState('bottom-start');
    const pageWrapperEl = document.querySelector('.layout-wrapper');
    const selectDropdownRef = useRef(null);
    const [placeholderValues, setPlaceholderValues] = useState(placeholder ? [placeholder] : '');
    
    useEffect(() => {
        if(selectedValues?.length){
            let placeholder_values = selectedValues?.map(x => {
                let return_value = options?.filter(y => y?.value == x);
                return return_value[0]?.label;
            });
            setPlaceholderValues(placeholder_values);
        }
    }, [selectedValues]);

    const handleMultiSelectDropdown = useCallback((event) => {
        setIsDropDownOpen(isDropDownOpen ? false : true);
    })

    const handleSelectedOption = useCallback((val) => {
        let selected_values = Object.assign([], selectedValues);
        let selected_value_position = selected_values.indexOf(val);
        if(!(selected_value_position > -1) ) {
            selected_values.push(val);
        } else {
            selected_values.splice(selected_value_position, 1);
        }
        setSelectedValues(selected_values);
        handleSelectedValue(selected_values);
        //setIsDropDownOpen(false);
    });

    useEffect(() => {
        if(!_.isEqual(options.sort(), dropDownOptions.sort())) {
            setSelectedValues([]);

        }
    }, [options])

    useEffect(() => {
        //console.log("uuu", options)
        if(isComponentReady && selectRef?.current && isDropDownOpen) {
            let selectDropDownEl = selectRef?.current?.querySelector('.crm-form-select-dropdown');
            if((selectRef?.current?.offsetTop + 40 + selectDropDownEl?.offsetHeight) > pageWrapperEl?.clientHeight) {
                setSelectDropDownPos('top-start');
                selectDropDownEl.style.top = '-' + (selectDropDownEl?.offsetHeight + 2) + 'px';
            } else {
                setSelectDropDownPos('bottom-start');
            }
        }
    }, [selectRef.current, isComponentReady, selectDropdownRef.current, isDropDownOpen, pageWrapperEl?.clientHeight]);

    return (
        <ClickAwayListener onClickAway={() => setIsDropDownOpen(false)}>
            <Box className={`crm-form-select crm-form-multiple-select ` 
                + (isDropDownOpen ? ` open ` : ` `) 
                + (selectedValues.length ? ` has-value ` : ` `)
                + ` ` + theme
                + ` ` + `font-` + fontTheme
                + ` ` + (selectDropDownPos)}
                ref={selectRef} >
                <Box className='crm-form-select-container' onClick={handleMultiSelectDropdown} >
                    <Box className={`crm-form-select-label ` + (selectedValues?.length ? ``: `is-placeholder`)}>
                        {selectedValues?.length ? ((returnType === 'object') ? selectedValues.map(item => item[optionsLabels?.label]).join(', ') : placeholderValues?.join(', ')) : placeholder}
                    </Box>
                    <DropDownIcon />
                </Box>
                <Box className='crm-form-select-dropdown' ref={selectDropdownRef}>
                    <ul className="crm-form-select-dropdown-options">
                        {
                            options?.map((item, i) => {
                                return <MenuItem className="crm-form-select-dropdown-option" onClick={() => handleSelectedOption((returnType === 'object') ? item : item[optionsLabels.value])}  
                                    key={`${i}-concat-${item[optionsLabels.value]}`}  value={item[optionsLabels.value]} >
                                        <Checkbox  checked={selectedValues.indexOf((returnType === 'object') ? item : item[optionsLabels.value]) > -1}
                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }} />
                                        <ListItemText primary={item[optionsLabels?.label]} />
                                </MenuItem>
                            })
                        }
                    </ul>
                </Box>
            </Box>
        </ClickAwayListener>
    )
}

export default memo(FormMultiSelect)