import React, { useEffect, useState } from "react";
import { useStyles } from "../../../../css/AddSchool-css";
import { Button, Checkbox, Grid, Typography } from "@mui/material";
import ReactSelect from "react-select";
import { handleKeyDown, handleKeyTextDown, handlePaste, handleTextPaste } from "../../../../helper/randomFunction";
import { DesignationOptions } from "../../../../constants/general";

export const ContactAddress = (props) => {
  const classes = useStyles();

  let { getContactDetail } = props;

  const [fields, setFields] = useState([
    {
      name: "",
      designation: { label: "Select Designation", value: undefined },
      mobileNumber: "",
      emailId: "",
      isPrimary: false,
    },
  ]);

  const [isValidEmail, setIsValidEmail] = useState([{ isValid: true }]);


  const resResult = fields?.map((obj) => {
    let finalObj = {};
    finalObj = { ...obj, designation: obj?.designation.value, "conatactDate": new Date() };
    return finalObj;
  });

  const addField = () => {
    if (fields?.length < 10) {
      const newFields = [
        ...fields,
        {
          name: "",
          designation: { label: "Select Designation", value: undefined },
          mobileNumber: "",
          emailId: "",
          isPrimary: false,
        },
      ];
      setFields(newFields);
      setIsValidEmail([...isValidEmail, { isValid: true }]);
    }
  };


  const handlePhoneNumberChange = (index, attr, value) => {
    const updatedPhoneNumbers = [...fields];
    updatedPhoneNumbers[index][attr] = value.slice(0, 10);
    setFields(updatedPhoneNumbers);
  };

  const handleEmailBlur = (index, attr, event) => {
    const newFields = [...fields];
    const arrayField = [...isValidEmail];
    newFields[index][attr] = event;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let data = emailPattern.test(newFields[index][attr]);
    arrayField[index]["isValid"] = data;
    setIsValidEmail(arrayField);
  };

  const removeField = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const handleChange = (index, attr, event) => {
    const newFields = [...fields];
    newFields[index][attr] = event;
    setFields(newFields);
  };

  const handleCheckbox = (index, attr, event) => {
    const newFields = [...fields];
    newFields?.map(obj => 
      obj.isPrimary = false
    )
    newFields[index][attr] = event;
    setFields(newFields);
  };

  const handleSelectChange = (index, selectedOption) => {
    const newFields = [...fields];
    newFields[index].designation = selectedOption;
    setFields(newFields);
  };

  const options = [
    { value: "Principal", label: "Principal" },
    { value: "Teacher", label: "Teacher" },
    { value: "Employee", label: "Employee" },
    { value: "Reception", label: "Reception" },
    { value: "Other", label: "Other" },
  ];

  useEffect(() => {
    let data = resResult;
    let conatactDate = new Date()
    getContactDetail(data, isValidEmail, conatactDate);
  }, [fields, isValidEmail]);



  return (
    <>
      <Grid className={classes.cusCard}>
        <div className={classes.contactDetailBx}>
          <Checkbox
            className="inputCheckBox"
            name="allSelect"
            checked={true}
          />
          <Typography style={{fontSize: 14}}>Set as Primary Contact</Typography>
        </div>
        {fields.map((field, index) => {
          return (
            <div key={index}>
              <Grid container spacing={3} sx={{ py: "8px" }}>
                <Grid item md={2.5} xs={12}>
                  <Typography className={classes.label}>Name *</Typography>
                  <input
                    type="text"
                    id={`fields[${index}].name`}
                    placeholder="Name"
                    name={field.name}
                    value={field.name}
                    className={classes.inputStyle}
                    onChange={(event) =>
                      handleChange(index, "name", event.target.value)
                    }
                    onKeyDown={handleKeyTextDown}
                    onPaste={handleTextPaste}
                  />
                </Grid>
                <Grid item md={2.5} xs={12}>
                  <Typography className={classes.label}>Designation *</Typography>
                  <ReactSelect
                    classNamePrefix="select"
                    options={DesignationOptions}
                    value={field.designation}
                    onChange={(selectedOption) =>
                      handleSelectChange(index, selectedOption)
                    }
                  />
                </Grid>
                <Grid item md={2.5} xs={12}>
                  <Typography className={classes.label}>
                    Mobile Number *
                  </Typography>
                  <input
                    type="number"
                    placeholder="Enter Mobile Number"
                    id={`fields[${index}].mobileNumber`}
                    value={field.mobileNumber}
                    className={classes.inputStyle}
                    onChange={(event) =>
                      handlePhoneNumberChange(
                        index,
                        "mobileNumber",
                        event.target.value
                      )
                    }
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                  />
                  {field?.mobileNumber?.length > 10 && (
                    <p style={{ color: "red" }}>
                      Phone number should not exceed 10 digits
                    </p>
                  )}
                </Grid>
                <Grid item md={2.5} xs={12}>
                  <Typography className={classes.label}>Email ID *</Typography>
                  <input
                    type="text"
                    placeholder="Enter Email ID"
                    id={`fields[${index}].emailId`}
                    value={field.emailId}
                    className={classes.inputStyle}
                    onChange={(event) =>
                      handleChange(index, "emailId", event.target.value)
                    }
                    onBlur={(event) =>
                      handleEmailBlur(index, "emailId", event.target.value)
                    }
                  />
                  {!isValidEmail[index]?.isValid && (
                    <p style={{ color: "red" }}>
                      Please enter a valid email address
                    </p>
                  )}
                </Grid>

                <Grid item md={2} xs={12} sx={{paddingLeft: '10px !important'}}>
                  <div className={classes.flxBoxContainer}>
                    <Grid item md={1} xs={12} className={classes.btnSection}>
                      <Checkbox
                        className="inputCheckBox"
                        name="allSelect"
                        handleCheckbox
                        checked={field.isPrimary}
                        onChange={(event) =>
                          handleCheckbox(index, "isPrimary", event.target.checked)
                        }
                      />
                    </Grid>
                    <div className={classes.btnBox}>
                      <Grid item md={1} xs={12} className={classes.btnSection}>
                        <Button
                          className={classes.submitBtn}
                          onClick={addField}
                          type="submit"
                        >
                          +
                        </Button>
                      </Grid>
                      {index > 0 && (
                        <Grid className={classes.btnSection}>
                          <Button
                            className={classes.submitBtn}
                            onClick={() => removeField(index)}
                            type="submit"
                          >
                            -
                          </Button>
                        </Grid>
                      )}
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
          );
        })}
      </Grid>
    </>
  );
};
