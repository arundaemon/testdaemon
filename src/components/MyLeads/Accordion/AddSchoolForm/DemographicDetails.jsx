import { useEffect, useState } from "react";
import { useStyles } from "../../../../css/AddSchool-css";
import {
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import ReactSelect from "react-select";
import { handleAlphaNumericPaste, handleAlphaNumericText } from "../../../../helper/randomFunction";

export const DemographyDetails = (props) => {
  const classes = useStyles();

  let { getSchoolDetail } = props;

  const [formData, setFormData] = useState({
    schWebsite: "",
    addMissionfee: null,
    tutionFee: null,
    internetImplement: "Yes",
    isWebValidate: true,
    gstNumber:'',
    tanNumber: ''
  });

  const [offeredSubject, setOfferSubject] = useState([]);
  const [isValidGST, setIsValidGST] = useState(true);

  useEffect(() => {
    let data = { ...formData, offeredSubject };
    getSchoolDetail(data);
  }, [formData, offeredSubject]);

  const options = [
    { value: "selectAll", label: "Select All" },
    { value: "Maths", label: "Maths" },
    { value: "Biology", label: "Biology" },
    { value: "Commerce", label: "Commerce" },
    { value: "Humanities", label: "Humanities" },
  ];

  const handleKeyDown = (event) => {
    const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete"];
    if (!allowedKeys.includes(event.key) && /[\E\e\+\-]/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handlePaste = (event) => {
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData("text");

    if (/[\E\e\+\-]/.test(pastedData)) {
      event.preventDefault();
    }
  };

  const getUniqueOptions = () => {
    let result = options?.filter(
      (item) => !offeredSubject?.find((x) => x.value === item.value)
    );
    return result;
  };

  const handleMultiSelect = (selected) => {
    if (selected.some((option) => option.value === "selectAll")) {
      setOfferSubject(options.filter((option) => option.value !== "selectAll"));
    } else {
      setOfferSubject(selected);
    }
  };

  const isSelectAllSelected = () =>
    offeredSubject.length === options.length - 1;

  const isValidURL = () => {
    try {
      new URL(formData.schWebsite);
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    let res = isValidURL();
    setFormData({ ...formData, isWebValidate: formData.schWebsite ? res : true});
  }, [formData.schWebsite]);


  // const validateGST = () => {
  //   // Regular expression for Indian GSTIN validation
  //   const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
  //   const result = gstPattern.test(formData?.gstNumber);
  //   setIsValidGST(result)
  // };

  // const validateGST = () => {
  //     // Check if the GST number is exactly 15 characters in length
  //     var gstNumber = formData?.gstNumber
  //     // if (gstNumber.length !== 15) {
  //     //   return false;
  //     // }
    
  //     // Define regular expressions for different parts of the GST number
  //     const stateCodeRegex = /^[0-9]{2}$/;
  //     const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  //     const entityCodeRegex = /^[0-9A-Z]{1}$/;
  //     const checksumRegex = /^[0-9]{1}$/;
      
  //     console.log(gstNumber, 'testNumber')

  //     // Extract different parts of the GST number
  //     const stateCode = gstNumber?.substr(0, 2);
  //     const pan = gstNumber.substr(2, 10);
  //     const entityCode = gstNumber.substr(12, 1);
  //     const checksum = gstNumber.substr(13, 1);
    
  //     // Validate each part using regular expressions
  //     if (!stateCodeRegex.test(stateCode)) {
  //       setIsValidGST(false)
  //       return false;
  //     }
  //     if (!panRegex.test(pan)) {
  //       setIsValidGST(false)
  //       return false;
  //     }
  //     if (!entityCodeRegex.test(entityCode)) {
  //       setIsValidGST(false)
  //       return false;
  //     }
  //     // if (!checksumRegex.test(checksum)) {
  //     //   setIsValidGST(false)
  //     //   return false;
  //     // }
    
  //     // Check the 11th character (1-based index) for correctness
  //     // const gstNumberWithoutChecksum = gstNumber.substr(0, 13);
  //     // const calculatedChecksum = calculateGSTChecksum(gstNumberWithoutChecksum);
    
  //     // if (parseInt(checksum) !== calculatedChecksum) {
  //     //   return false;
  //     // }
    
  //     // If all checks pass, the GST number is valid
  //     setIsValidGST(true)
  //     return true;
  // }

  
  
  // Function to calculate the checksum for a GST number
  // function calculateGSTChecksum(gstNumberWithoutChecksum) {
  //   const gstChars = gstNumberWithoutChecksum.split('');
  //   const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3, 1];
  //   let sum = 0;
  
  //   for (let i = 0; i < gstChars.length; i++) {
  //     sum += parseInt(gstChars[i]) * weights[i];
  //   }
  
  //   const remainder = sum % 10;
  //   const checksum = 10 - remainder;
  
  //   return checksum;
  // }
  
  return (
    <>
      <Grid className={classes.cusCard}>
        <Grid container spacing={3} sx={{ py: "8px" }}>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>School WebSite</Typography>
              <input
                className={classes.inputStyle}
                name={formData.schWebsite}
                type="text"
                placeholder="Enter School Website"
                value={formData.schWebsite}
                onChange={(e) =>
                  setFormData({ ...formData, schWebsite: e.target.value })
                }
              />
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>
                Subject Offered 10th & 12th
              </Typography>
              <ReactSelect
                classNamePrefix="select"
                options={
                  offeredSubject?.length > 0 ? getUniqueOptions() : options
                }
                isMulti
                value={offeredSubject}
                onChange={handleMultiSelect}
                placeholder="Select Subjects"
                isOptionSelected={isSelectAllSelected}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
              />
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>Admission Fee</Typography>
              <input
                className={classes.inputStyle}
                name={formData.addMissionfee}
                type="number"
                placeholder="INR"
                value={formData.addMissionfee}
                onChange={(e) =>
                  setFormData({ ...formData, addMissionfee: e.target.value })
                }
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
              />
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>Tution Fee (Monthly)</Typography>
              <input
                className={classes.inputStyle}
                name={formData.tutionFee}
                type="number"
                placeholder="INR"
                value={formData.tutionFee}
                onChange={(e) =>
                  setFormData({ ...formData, tutionFee: e.target.value })
                }
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
              />
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>GSTIN</Typography>
              <input
                className={classes.inputStyle}
                name={formData.gstNumber}
                type="text"
                placeholder="Enter GST Number"
                value={formData.gstNumber}
                onChange={(e) =>
                  setFormData({ ...formData, gstNumber: e.target.value })
                }
                onKeyDown={handleAlphaNumericText}
                onPaste={handleAlphaNumericPaste}
                maxLength={15}
                // onBlur={validateGST}
              />
              {/* {!isValidGST && <p>Invalid GST Number</p>} */}
            </Grid>
          </Grid>
           <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>TAN Number</Typography>
              <input
                className={classes.inputStyle}
                name={formData.tanNumber}
                type="text"
                placeholder="Enter Number"
                value={formData.tanNumber}
                onChange={(e) =>
                  setFormData({ ...formData, tanNumber: e.target.value })
                }
                onKeyDown={handleAlphaNumericText}
                onPaste={handleAlphaNumericPaste}
                maxLength={10}
              />
            </Grid>
          </Grid>
         
        </Grid>
      </Grid>
    </>
  );
};
