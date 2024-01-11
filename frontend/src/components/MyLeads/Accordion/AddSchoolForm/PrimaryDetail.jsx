import { useEffect, useState } from "react";
import { useStyles } from "../../../../css/AddSchool-css";
import {
  Grid, Typography, FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import ReactSelect from "react-select";
import { getBoardList, getChildList } from "../../../../config/services/lead";
import { handleEmailPaste, handleEmailTextDown, handleKeyDown, handleKeyTextDown, handlePaste, handleTextPaste } from "../../../../helper/randomFunction";
import { BOARDCLASS } from "../../../../constants/general"
export const PrimaryDetail = (props) => {
  const classes = useStyles();

  let { getPrimaryDetail } = props;

  const [formData, setFormData] = useState({
    schoolName: "",
    schEmailId: "",
    institueType: { label: "Select Type of Institute", value: undefined },
    competitorName: "",
    totalStudent: null,
    totalTeacher: null,
    associateInstitute: "",
  });

  const options = [
    { value: "Private", label: "Private" },
    { value: "Government", label: "Government" },
    { value: "Semi Government", label: "Semi Government" },
  ];

  const [boardSelectData, setBoardSelectData] = useState([]);

  const [classSelectData, setClassSelectData] = useState([]);

  const [isValidEmail, setIsValidEmail] = useState(true);

  const [board, setBoard] = useState({
    label: "Select Board",
    value: undefined,
  });

  const [boardClass, setBoardClass] = useState([]);

  const [institueType, setInstitute] = useState({
    label: "Select Type of Institute",
    value: undefined,
  });

  const handleEmailBlur = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailPattern.test(formData.schEmailId);
    setIsValidEmail(isValid);
  };

  const handleMultiSelect = (selected) => {
    if (selected.some((option) => option.value === "selectAll")) {
      setBoardClass(classSelectData.filter((option) => option.value !== "selectAll"));
    } else {
      setBoardClass(selected);
    }
  };

  const isSelectAllSelected = () => boardClass.length === classSelectData.length;

  const getBoardListHandler = async () => {
    let params = { params: { boardStage: 1, sapVisibility: 1 } };
    getBoardList(params)
      .then((res) => {
        let boardFormattedData = [];
        res?.data?.data?.forEach((element) => {
          boardFormattedData.push({
            value: element.board_id,
            label: element.name,
          });
          setBoardSelectData(boardFormattedData);
        });
      })
      .catch((err) => {
        if (err.response.status == 401) {
          getBoardListHandler();
        }
        console.error(err?.response);
      });
  };

  const getChildListHandler = async () => {
    let params = { params: { boardId: 180, syllabusId: 180 } };
    getChildList(params)
      .then((res) => {
        let classFormattedData = [{ value: "selectAll", label: "Select All" }];
        /*  res?.data?.data?.child_list.forEach((element) => {
            classFormattedData.push({
              value: element.syllabus_id,
              label: element.name,
            });
            setClassSelectData(classFormattedData);
          });*/

        setClassSelectData(BOARDCLASS);
      })
      .catch((err) => {
        if (err.response.status == 401) {
          getChildListHandler();
        }
        console.error(err?.response);
      });
  };

  useEffect(() => {
    getBoardListHandler();
    getChildListHandler();
  }, []);

  useEffect(() => {
    if (formData.schEmailId?.trim() != '') {
      setIsValidEmail(isValidEmail)
    }
    else {
      setIsValidEmail(true)
    }
    let Data = { ...formData, board, boardClass, institueType, isValidEmail };
    getPrimaryDetail(Data);
  }, [formData, board, boardClass, institueType, isValidEmail]);



  const handleInputStudent = (event) => {
    const maxValue = 10000; // Change 100 to the maximum number limit you want
    const newValue = parseInt(event.target.value);

    if (!isNaN(newValue) && newValue <= maxValue) {
      setFormData({ ...formData, totalStudent: newValue })
    } else if (isNaN(newValue)) {
      setFormData({ ...formData, totalStudent: '' })
    }
  };

  const handleInputTeacher = (event) => {
    const maxValue = 1000; // Change 100 to the maximum number limit you want
    const newValue = parseInt(event.target.value);

    if (!isNaN(newValue) && newValue <= maxValue) {
      setFormData({ ...formData, totalTeacher: newValue })
    } else if (isNaN(newValue)) {
      setFormData({ ...formData, totalTeacher: '' })
    }
  };


  return (
    <>
      <Grid className={classes.cusCard}>
        <Grid container spacing={3} sx={{ py: "8px" }}>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>School Name*</Typography>
              <input
                className={classes.inputStyle}
                name={formData.schoolName}
                type="text"
                placeholder="Enter School Name"
                value={formData.schoolName}
                onChange={(e) =>
                  setFormData({ ...formData, schoolName: e.target.value })
                }
                maxLength={100}
                onKeyDown={handleKeyTextDown}
                onPaste={handleTextPaste}
              />
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>Board*</Typography>
              <ReactSelect
                classNamePrefix="select"
                options={boardSelectData}
                value={board}
                onChange={(e) =>
                  setBoard({
                    label: e.label,
                    value: e.value,
                  })
                }
              />
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>Class*</Typography>
              <ReactSelect
                classNamePrefix="select"
                options={classSelectData}
                isMulti
                value={boardClass}
                onChange={handleMultiSelect}
                placeholder="Select Class"
                isOptionSelected={isSelectAllSelected}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
              />
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>
                School Email Id
              </Typography>
              <input
                className={classes.inputStyle}
                name={formData.schEmailId}
                type="text"
                placeholder="Enter School Email Id"
                value={formData.schEmailId}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    schEmailId: e.target.value,
                  });
                }}
                maxLength={200}
                onBlur={handleEmailBlur}
                onKeyDown={handleEmailTextDown}
                onPaste={handleEmailPaste}
              />
              {/* {!isValidEmail && (
                <p style={{ color: "red" }}>
                  Please enter a valid email address
                </p>
              )} */}
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>
                Type of Institute*
              </Typography>
              <ReactSelect
                classNamePrefix="select"
                options={options}
                value={institueType}
                onChange={(e) =>
                  setInstitute({
                    label: e.label,
                    value: e.value,
                  })
                }
              />
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>
                Competitor Name
              </Typography>
              <input
                className={classes.inputStyle}
                name={formData.competitorName}
                type="text"
                placeholder="Enter Competitor Name"
                value={formData.competitorName}
                onChange={(e) =>
                  setFormData({ ...formData, competitorName: e.target.value })
                }
                onKeyDown={handleKeyTextDown}
                onPaste={handleTextPaste}
                maxLength={100}
              />
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>Total Student</Typography>
              <input
                className={classes.inputStyle}
                name={formData.totalStudent}
                type="number"
                placeholder="Enter Total Student"
                value={formData.totalStudent}
                onChange={handleInputStudent}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                max={10000}
              />
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>Total Teacher</Typography>
              <input
                className={classes.inputStyle}
                name={formData.totalTeacher}
                type="number"
                placeholder="Enter Total Teacher"
                value={formData.totalTeacher}
                onChange={handleInputTeacher}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                max={1000}
              />
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>
                Associated Schools
                <input
                  className={classes.inputStyle}
                  name={formData.associateInstitute}
                  type="text"
                  placeholder="Enter Associated Schools"
                  value={formData.associateInstitute}
                  onChange={(e) =>
                    setFormData({ ...formData, associateInstitute: e.target.value })
                  }
                  onKeyDown={handleKeyTextDown}
                  onPaste={handleTextPaste}
                  maxLength={100}
                />
              </Typography>
            </Grid>
          </Grid>

          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>
                Internet Implementation*
              </Typography>
              <RadioGroup
                row
                aria-label="internetImplement"
                name={formData.internetImplement}
                value={formData.internetImplement}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    internetImplement: e.target.value,
                  })
                }
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </Grid>
          </Grid>




        </Grid>
      </Grid>
    </>
  );
};
