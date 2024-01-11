import React, { useState } from 'react';
import { useStyles } from "../../css/Quotation-css";
import { useLocation, Link } from "react-router-dom";
import { CustomTooltip2 } from '../../utils/utils';
import { Tooltip } from '@mui/material';

function SchoolList({ school }) {
    const classes = useStyles();
    const [showRemainingSchools,setShowRemainingSchools]=useState(true)

    const renderSchoolNames = () => {
        if (school && school?.length > 0) {
            const firstSchool = school[0]?.schoolName;
            const remainingSchools = school?.slice(1);
            const schoolNames = remainingSchools.map((row) => row?.schoolName);
            const length = schoolNames?.length > 0
           

            if (remainingSchools?.length > 0) {
               
                return (
                    <Tooltip title={showRemainingSchools && schoolNames?.join(', ')} arrow>
                        <span>
                            {firstSchool}
                            <Link
                                underline="hover"
                                onClick={() => setShowRemainingSchools(!showRemainingSchools)}
                            >
                                {`+${remainingSchools?.length} more`}
                            </Link>
                        </span>
                    </Tooltip>
                );
            } else {
                return (
                    <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                        {firstSchool}
                    </div>
                );
            }
        } else {
            return (
                <div className={classes.subTitleNew} sx={{ mb: 1.5 }}>
                    N/A
                </div>
            );
        }
    };

    return <div>{renderSchoolNames()}</div>;
}

export default SchoolList;