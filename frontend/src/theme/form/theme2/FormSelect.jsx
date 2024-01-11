import { memo, useCallback, useState, useRef, useEffect } from "react"
import { Box, ClickAwayListener, MenuItem } from "@mui/material";
import { ReactComponent as DropDownIcon } from "../../../assets/icons/icon-dropdown-2.svg";


const FormSelect = ({placeholder, options, handleSelectedValue, value, returnType = 'string', optionLabels=null, isComponentReady = true, 
    theme = 'standard', fontTheme = 'md'}) => {
    const [isDropDownOpen, setIsDropDownOpen] = useState(false)
    const [selectedValue, setSelectedValue] = useState(value ?? null);
    const [selectedRow, setSelectedRow] = useState(null);
    const option_labels = optionLabels ?? {label: 'label', value: 'value'}
    const selectRef = useRef(null);
    const selectDropdownRef = useRef(null);
    const [selectDropDownPos, setSelectDropDownPos] = useState('bottom-start');
    const pageWrapperEl = document.querySelector('.layout-wrapper');

    const handleCustomDropdown = useCallback((event) => {
        setIsDropDownOpen(isDropDownOpen ? false : true);
    })

    const handleSelectedOption = useCallback((val) => {
        setSelectedValue((returnType !== 'string') ? val : val[option_labels.value]);
        setSelectedRow(val)
        handleSelectedValue((returnType !== 'string') ? val : val[option_labels.value]);
        setIsDropDownOpen(false);
    });
    
    useEffect(() => {
        
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
            <Box className={`crm-form-select ` 
                + (isDropDownOpen ? ` open ` : ` `) 
                + (selectedValue ? ` has-value ` : ` `) 
                + ` ` + (selectDropDownPos) 
                + ` ` + theme
                + ` ` + `font-` + fontTheme
                } 
                ref={selectRef} 
            >
                <Box className='crm-form-select-container' onClick={handleCustomDropdown} >
                    <Box className={`crm-form-select-label ` + (selectedValue ? ``: `is-placeholder`)}>{selectedValue ? (selectedRow ? selectedRow[option_labels?.label] : options?.filter(i => i.value === selectedValue)[0][option_labels?.label]) : (placeholder ?? '')}</Box>
                    <DropDownIcon  className='crm-form-select-dropdown-icon' />
                </Box>
                <Box className='crm-form-select-dropdown' ref={selectDropdownRef}>
                    <ul className="crm-form-select-dropdown-options">
                        {
                            options?.map((item) => {
                                return <MenuItem className="crm-form-select-dropdown-option" onClick={() => handleSelectedOption(item)} key={item[option_labels?.label]} 
                                    value={item[option_labels.value]}>{item[option_labels?.label]}</MenuItem>
                            })
                        }
                    </ul>
                </Box>
            </Box>
        </ClickAwayListener>
    )
}

export default memo(FormSelect)