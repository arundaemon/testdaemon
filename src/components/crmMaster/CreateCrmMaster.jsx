import React, { useEffect, useState } from 'react'
import Page from "../Page";
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Grid, Checkbox } from "@mui/material";
import Select from 'react-select';

const CreateCrmMaster = ({ showCreateCrmMaster, crmFieldMasterList, recordForEdit, handleType, handleChange, handleFieldType, addOrEdit }) => {
	
	const navigate = useNavigate();
  

	return (
		<Page title="Extramarks | Create Crm Master" className="main-container  datasets_container">
			<div className='baner-boxcontainer '>
				<h4 className='heading' >CRM Master</h4>

				<div className='lableContainer'>
					<div className='containerCol'>
						
						<div className='box' >
							<label className='boxLabel'>Type</label>
							<div>
								<Select
									className="basic-single"
									classNamePrefix="select"
									name="color"
									options={crmFieldMasterList}
									onChange={handleType}
									value={recordForEdit?.type}

								/>
							</div>
						</div>
						
					</div>
                    
					<div className='containerCol'>

						<div div className='box'  >
							<label className='boxLabel'>Value</label>
							<TextField className='label-text' name="value" type="text" id="outlined-basic" variant="outlined" value={recordForEdit?.value} onChange={handleChange} />
						</div>
						
					</div>
					
				</div>

			</div>
			<div className='btnContainer' >
				<div className='cancleBtn' onClick={showCreateCrmMaster} variant='outlined' >Cancel</div>
				<div className='saveBtn'  variant='contained' onClick={addOrEdit}>Save</div>
			</div>
		</Page>
	)
}
export default CreateCrmMaster