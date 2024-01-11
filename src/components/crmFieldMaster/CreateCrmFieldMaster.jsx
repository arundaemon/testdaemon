import React, { useEffect, useState } from 'react'
import Page from "../Page";
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Grid, Checkbox } from "@mui/material";
import Select from 'react-select';

const CreateCrmFieldMaster = ({ showCreateCrmFieldMaster, recordForEdit,handleType, handleFieldName, handleChange, handleFieldType, addOrEdit }) => {

    const navigate = useNavigate();

    const fieldNameList = [
        { label: 'Customer Response', value: 'Customer Response'},
        { label: 'Meeting Status', value: 'Meeting Status'},
        { label: 'Priority', value: 'Priority'},
        { label: 'Meeting Type', value: 'Meeting Type'},
        { label: 'Interest Level', value: 'Interest Level'}
    ]

    const fieldTypeList = [
        { label: 'Pick-list', value: 'Pick-list'},
        { label: 'Text', value: 'Text'},
        { label: 'Integer', value: 'Integer'},
        { label: 'Date', value: 'Date'},
        { label: 'Checklist', value: 'Checklist'},
        { label: 'Checkbox', value: 'Checkbox'}
    ]

    const typeList = [
        { label: 'DEPENDENT', value: 'DEPENDENT' },
        { label: 'INDEPENDENT', value: 'INDEPENDENT' }
    ]


    return (
        <Page title="Extramarks | Create Crm Master" className="main-container  datasets_container">
            <div className='baner-boxcontainer '>
                <h4 className='heading' >CRM Field Master</h4>

                <div className='lableContainer'>
                <div className='containerCol'>
				<div div className='box'  >
							<label className='boxLabel'>Field Name</label>
							<TextField className='label-text' name="fieldName" type="text" id="outlined-basic" variant="outlined" value={recordForEdit?.fieldName} onChange={handleChange} />
						</div>
						
					</div>

                    <div className='containerCol'>
						
						<div className='box' >
							<label className='boxLabel'>Field Type</label>
							<div>
								<Select
									className="basic-single"
									classNamePrefix="select"
									name="color"
									options={fieldTypeList}
									onChange={handleFieldType}
									value={recordForEdit?.fieldType}

								/>
							</div>
						</div>
						
					</div>

                    <div className='containerCol'>
						<div className='box' >
							<label className='boxLabel'>Type</label>
							<div>
								<Select
									className="basic-single"
									classNamePrefix="select"
									name="color"
									options={typeList}
									onChange={handleType}
									value={recordForEdit?.type}

								/>
							</div>
						</div>
						
					</div>

                </div>

            </div>
            <div className='btnContainer' >
                <div className='cancleBtn' onClick={showCreateCrmFieldMaster} variant='outlined' >Cancel</div>
                <div className='saveBtn' variant='contained' onClick={addOrEdit}>Save</div>
            </div>
        </Page>
    )
}
export default CreateCrmFieldMaster