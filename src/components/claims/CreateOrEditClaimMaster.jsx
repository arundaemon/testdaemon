import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import Page from '../../components/Page';
import { createClaimMaster, getClaimMasterDetails, getExpenseTypeMapping, updateClaimMaster } from '../../config/services/claimMaster';
import { TextField } from '@mui/material';
import { getRolesList } from '../../config/services/hrmServices';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import _ from 'lodash';

const CreateOrEditClaimMaster = () => {
  const [typeOfExpense, setTypeOfExpense] = useState({ label: 'Select' })
  const [expenseTypeMapping, setExpenseTypeMapping] = useState([])
  const [field, setField] = useState({ label: 'Select' })
  const [subField, setSubField] = useState({})
  const [dataToAdd, setDataToAdd] = useState({});
  const [valueOption, setValueOption] = useState([])
  const [fieldOptions, setFieldOptions] = useState([])
  const [typeOfExpenseOptions, setTypeOfExpenseOptions] = useState([])
  const [pricePerUnit, setPricePerUnit] = useState()
  const [unitOptions, setUnitOptions] = useState([])
  const [unit, setUnit] = useState({ label: 'Select' })
  const [profileOptions, setProfileOptions] = useState([])
  const [profileValue, setProfileValue] = useState()
  const [fieldObject, setFieldObject] = useState({})
  const [createdBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
  const [modifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
  const { claimId } = useParams();
  const navigate = useNavigate();

  const handleTypeOfExpense = (e) => {
    setTypeOfExpense(e)
    reset()
    let selected = expenseTypeMapping?.filter(arr => arr.expenseType === e?.value)
    let unitArray = selected.map(item => {
      return {
        label: item?.units?.[0]?.value?.[0],
        value: item?.units?.[0]?.value?.[0]
      };
    });
    setUnitOptions(unitArray)

    let field = selected[0]?.fieldName?.[0];
    if (field !== undefined) {
      const fieldOptions = [{ label: field?.label, value: field?.label }];
      setFieldOptions(fieldOptions);
      setFieldObject(field)
    }
  }

  const handleField = (e) => {
    setField(e)
    let valuesArray = fieldObject?.value;
    let valueOptions = valuesArray.map((value) => ({ label: value, value }));
    setValueOption(valueOptions);
  }

  const handleValues = (e) => {
    setSubField(e)
  }

  const handleKeyDown = (event) => {
    const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete"];
    if (!allowedKeys.includes(event.key) && /[E\e\+\-]/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handlePaste = (event) => {
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData("text");

    if (/[e\+\-]/.test(pastedData)) {
      event.preventDefault();
    }
  };

  const handlePricePerUnit = (e) => {
    setPricePerUnit(e.target.value)
  }

  const handleProfile = (e) => {
    setProfileValue(e)
  }

  const handleUnit = (e) => {
    setUnit(e)
  }

  const reset = () => {
    setFieldOptions([])
    setValueOption([])
    setSubField({ label: 'Select' })
    setField({ label: 'Select' })
    setUnitOptions([])
    setUnit({ label: 'Select' })
  }

  const handleCancel = () => {
    navigate('/authorised/claim-master-list')
  }

  const getDropDownValues = async () => {
    try {
      let params = { level: "Master" };
      let response = await getExpenseTypeMapping(params);
      setExpenseTypeMapping(response)

      let expenseTypeArray = response.map(item => {
        return {
          label: item.expenseType,
          value: item.expenseType
        };
      });
      setTypeOfExpenseOptions(expenseTypeArray);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRolesList = () => {
    let params = { action: "profile" }
    getRolesList(params)
      .then(res => {
        if (res?.data?.response?.data) {
          const profileOptions = res?.data?.response?.data?.map(roleObj => ({
            label: roleObj?.profile_name,
            value: roleObj.profile_name
          })
          )
          setProfileOptions(profileOptions);
        }
        else {
          console.error(res)
        }
      })
  }

  const validation = () => {
    if (typeOfExpense?.label === "Select") {
      toast.error('Select Type of Expense');
      return false;
    }

    if (fieldOptions?.length > 0 && field?.label === 'Select') {
      toast.error('Select Field');
      return false;
    }

    if (valueOption?.length > 0 && subField?.label === 'Select') {
      toast.error('Select Value');
      return false;
    }

    if (unit?.label === "Select") {
      toast.error('Select Unit');
      return false;
    }
    if (!pricePerUnit) {
      toast.error('Enter Price Per Unit');
      return false;
    }

    if (!profileValue) {
      toast.error('Select Profile');
      return false;
    }
    return true
  }

  const handleSubmit = async () => {
    let filledDetails = _.cloneDeep(dataToAdd)
    // if (!typeOfExpense || !unit || !pricePerUnit || !profileValue) {
    //   toast.error('Please fill all the required fields');
    //   return;
    // }
    if (validation()) {
      filledDetails.expenseType = typeOfExpense?.value
      filledDetails.field = { field: field?.value, subField: subField?.value };
      filledDetails.unit = unit?.value;
      filledDetails.unitPrice = pricePerUnit;
      filledDetails.profile = profileValue?.value;
      filledDetails.createdBy = createdBy
      filledDetails.modifiedBy = modifiedBy
      addClaimMaster(filledDetails)
    }
  }

  const addClaimMaster = async (data) => {
    createClaimMaster(data)
      .then((res) => {
        if (res?.result) {
          toast.success(res?.message)
          navigate('/authorised/claim-master-list')
        }
        else if (res?.data?.error?.errorMessage) {
          toast.error(res?.data?.error?.errorMessage?.errorMessage);
        }
      })
      .catch((error) => console.error(error, '...errror'))
  }

  const handleUpdate = () => {
    if (validation()) {
      let filledDetails = _.cloneDeep(dataToAdd)
      filledDetails._id = claimId
      filledDetails.expenseType = typeOfExpense?.value
      filledDetails.field = { field: field?.value, subField: subField?.value };
      filledDetails.unit = unit?.value;
      filledDetails.unitPrice = pricePerUnit;
      filledDetails.profile = profileValue?.value;
      filledDetails.createdBy = createdBy
      filledDetails.modifiedBy = modifiedBy
      editClaimMaster(filledDetails)
    }
  }

  const editClaimMaster = (data) => {
    updateClaimMaster(data)
      .then(res => {
        if (res?.result) {
          toast.success(res?.message)
          navigate('/authorised/claim-master-list')
        }
        else if (res?.data?.error?.errorMessage) {
          console.log('enter inside ');
          toast.error(res?.data?.error?.errorMessage?.errorMessage);
        }
      })
      .catch((err) => {
        console.error(err, '...error')
      })
  }

  const getClaimDetails = async () => {
    try {
      const res = await getClaimMasterDetails(claimId);
      if (res?.result?.length > 0) {
        const data = res.result[0];
        setDetails(data)
      }
    } catch (error) {
      console.log(error, 'error while fetching claim details');
    }
  };


  const setDetails = async (data) => {
    try {
      setTypeOfExpense({ label: data?.expenseType, value: data?.expenseType });
      setField({ label: data?.field?.field ?? 'Select', value: data?.field?.field });
      setSubField({ label: data?.field?.subField ?? 'Select', value: data?.field?.subField });
      setPricePerUnit(data?.unitPrice);
      setUnit({ label: data?.unit, value: data?.unit });
      setProfileValue({ label: data?.profile, value: data?.profile });

      let response;
      try {
        response = await getExpenseTypeMapping({ level: "Master" });
      } catch (error) {
        // Handle the error here
        console.error("Error fetching expense type mapping:", error);
        // Optionally, you can set default or fallback values for the dependent states
        setUnitOptions([]);
        setFieldOptions([]);
        setFieldObject(null);
        setValueOption([]);
        return;
      }

      let selected = response?.filter(arr => arr?.expenseType === data?.expenseType);
      let unitArray = selected?.map(item => ({
        label: item?.units?.[0]?.value?.[0],
        value: item?.units?.[0]?.value?.[0]
      }));
      setUnitOptions(unitArray);

      let field = selected[0]?.fieldName?.[0];
      if (field !== undefined) {
        const fieldOptions = [{ label: field?.label, value: field?.label }];
        setFieldOptions(fieldOptions);
        setFieldObject(field);
      } else {
        setFieldOptions([]);
        setFieldObject(null);
      }

      let valuesArray = field?.value;
      let valueOptions = valuesArray?.map(value => ({ label: value, value }));
      setValueOption(valueOptions || []);
    } catch (error) {
      // Handle any other errors that may occur during the execution of the function
      console.error("Error setting details:", error);
    }
  };


  useEffect(() => {
    getDropDownValues()
    fetchRolesList()
    if (claimId !== undefined)
      getClaimDetails()
  }, [])


  return (
    <Page title="Extramarks | Claim Master" className="main-container datasets_container">
      <div className='baner-container'>
        <div>
          <p style={{
            fontSize: '25px',
            fontWeight: '600',
          }}>Claim Master</p>
          <div style={{ display: "flex" }}>
            <div style={{ marginRight: '100px' }}>
              <h3 style={{ marginRight: "25px", marginBottom: '5px' }}>Type of expense *</h3>
              {claimId ?
                <input value={typeOfExpense?.label} disabled={true} style={{
                  border: '1px solid #cccccc',
                  borderRadius: '6px',
                  padding: '8px 15px',
                  fontSize: '18px',
                  width: '246px'
                }} /> :
                <div style={{ width: '250px' }}>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    options={typeOfExpenseOptions}
                    value={typeOfExpense}
                    onChange={handleTypeOfExpense}
                  />
                </div>
              }

            </div>
            {(fieldOptions?.length > 0 || (field?.label !== 'Select' && field?.value !== 'undefined')) &&
              <>
                <div style={{ marginRight: '100px' }}>
                  <h3 style={{ marginLeft: '6px', marginRight: "25px", marginBottom: '5px' }}>Field *</h3>
                  <div style={{ width: '250px' }}>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      options={fieldOptions}
                      value={field}
                      onChange={handleField}
                    />
                  </div>

                </div >
                {(valueOption?.length > 0 || subField?.label !== undefined) &&
                  <div style={{ marginRight: '100px' }}>
                    <h3 style={{ marginLeft: '6px', marginRight: "25px", marginBottom: '5px' }}>Values *</h3>
                    <div style={{ width: '250px' }}>
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        options={valueOption}
                        value={subField}
                        onChange={handleValues}
                      />
                    </div>

                  </div>
                }
              </>
            }
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ marginRight: '100px' }}>
              <h3 style={{ marginRight: "25px", marginBottom: '5px' }}>Unit *</h3>
              <div style={{ width: '250px' }}>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  options={unitOptions}
                  value={unit}
                  onChange={handleUnit}
                />
              </div>

            </div>
            <div style={{ marginRight: '100px' }}>
              <h3 style={{ marginLeft: '6px', marginRight: "25px", marginBottom: '5px' }}>Price Per Unit *</h3>
              <input style={{
                // borderColor: '#85888A',
                border: '1px solid #cccccc',
                borderRadius: '6px',
                padding: '8px 15px',
                fontSize: '18px',
              }} type="number" value={pricePerUnit} placeholder='Enter Price Per Unit'
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                onChange={handlePricePerUnit} />
            </div >
            <div style={{ marginRight: '100px' }}>
              <h3 style={{ marginLeft: '6px', marginRight: "25px", marginBottom: '5px' }}>Profile *</h3>
              <div style={{ width: '300px' }}>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  options={profileOptions}
                  value={profileValue}
                  onChange={handleProfile}
                />
              </div>

            </div>
          </div>
        </div>
      </div>
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        paddingRight: "20px",
        marginBottom: '10px'
      }} >
        <div style={{
          border: "1px solid #F45E29",
          padding: "12px 24px",
          color: "#F45E29",
          borderRadius: "4px",
          fontWeight: "600",
          fontSize: "16px",
          lineHeight: "22px",
          cursor: "pointer"
        }} onClick={handleCancel} variant='outlined'>Cancel</div>
        <div style={{
          fontWeight: "600",
          fontSize: "16px",
          lineHeight: "22px",
          cursor: "pointer",
          borderRadius: "4px",
          color: "white",
          border: "1px solid #F45E29",
          padding: "12px 24px",
          background: "#F45E29",
          marginLeft: "20px"
        }} onClick={claimId ? handleUpdate : handleSubmit} variant='contained'>{claimId ? "Update" : "Save"}</div>
      </div>

    </Page >
  )
}

export default CreateOrEditClaimMaster