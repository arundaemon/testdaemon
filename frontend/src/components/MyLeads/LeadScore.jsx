import React, { useEffect, useState } from 'react';
import { fetchLeadScore } from '../../helper/DataSetFunction';
import CubeDataset from "../../config/interface";

const LeadScore = ({ id }) => {
    const [leadScore, setLeadScore] = useState()

    const getLeadScore = () => {
        return fetchLeadScore(id)
            .then((res) => {
                // console.log(res,'this is fetch data')
                setLeadScore(res?.loadResponses[0]?.data[0]?.[CubeDataset.LeadActivity.LeadScore])
            })
            .catch((err) => {
                console.error(err, 'error')
            })
    }

    // console.log(fet)

    useEffect(() => {
        getLeadScore()
    }, [id])

    return (
        <div>{leadScore ? leadScore : 'NA'}</div>
    )
}

export default LeadScore