import { Checkbox, Grid } from "@mui/material";
import { useStyles } from "../../css/Quotation-css";
import { useEffect, useState } from "react";

export const ProductDetail = ({ data, getProductData }) => {
  const [checkedRows, setCheckedRows] = useState([]);

  const handleRowCheck = (event, row) => {
    const groupCode = checkedRows?.length ? checkedRows
      ?.map((obj) => obj?.learningProfileGroupCode)
      ?.includes(row?.learningProfileGroupCode) : true
    
    if (!groupCode) {
      setCheckedRows([row])
      return
    }

    if (event.target.checked) {
      setCheckedRows([...checkedRows, row]);
    } else {
      setCheckedRows(checkedRows.filter((checkedRow) => checkedRow !== row));
    }
  };

  const isChecked = (row) => {
    if (checkedRows.includes(row)) {
      return checkedRows.includes(row);
    } else {
      return false;
    }
  };
  
  useEffect(() => {
    if(checkedRows?.length > 0) {
      getProductData(checkedRows)
    }
  }, [checkedRows])


  const classes = useStyles();
  return (
    <>
      <div className={classes.gridBox}>
        {Object.entries(data)?.map((obj) => {
          return (
            <div className={classes.flkBoxGrid}>
              <div className={classes.rltBox}>
                <span className={classes.absBox}>{obj?.[0]}</span>
              </div>
              <div className={classes.flkInnerBoxGrid}>
                {obj?.length > 0 &&
                  obj?.[1]?.map((data) => {
                    return (
                      <div className={classes.flkInnerChildBox}>
                        <div>{data?.profileName}</div>
                        <Checkbox
                          checked={isChecked(data)}
                          onChange={(event) => handleRowCheck(event, data)}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
