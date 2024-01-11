import React, { useState } from 'react';
import moment from 'moment';
import IconFirstCall from "../../../assets/icons/Icon-firstCall.svg";
import FailedCall from "../../../assets/icons/failedCall.svg";
import PlayTrack from '../../../assets/image/playTrack.svg';
import settings from '../../../config/settings';
import CubeDataset from "../../../config/interface";
import { url } from '../../../config/urls';
import { toast } from 'react-hot-toast';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Icon } from '@mui/material';
import { height, width } from '@mui/system';
import openPlayCircle from "../../../assets/image/open-play-circle.svg"
import { Modal, Box, Typography } from '@mui/material';
import iconModalCancel from '../../../assets/icons/icon-modal-cancel.svg'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'background.paper',
    borderRadius: "4px",
    boxShadow: 24,
    p: 2,
    outline: 'none'
};
const BdeActivityList = ({ list, index }) => {

    const [isReadMore, setIsReadMore] = useState(true);
    const [showAudioModal, setAudioModal] = useState(false)
    const { BDE_ACTIVITIES } = settings;

    let url = list?.[CubeDataset.Bdeactivities.paymentUrl]
    const copyUrl = () => {
        toast.dismiss()
        toast.success('Url copied')
        navigator.clipboard.writeText(url);
    }
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };

    const startAudio = (event) => {
        let audio = new Audio(event)
        audio.play()
    }

    //console.log(list,'...list')

    return (
        <div className="listing-card" key={index}>
            <div className="cardDataContainer">
                <div className="left">
                    
                    {                      
                        (list[CubeDataset.Bdeactivities.callStatus] == 'Not Connected') ? <img src={FailedCall} alt="" className="listing-basic-icon1" /> : <img src={IconFirstCall} alt="" className="listing-basic-icon1" />
                      
                    }             
                    <div className="cardData">
                        <div className="listing-tab-text1">
                            {list[CubeDataset.Bdeactivities.activityName]}
                            {(list[CubeDataset.Bdeactivities.callRecording]) &&
                                // <audio className='audioplayer' controls src={list[CubeDataset.Bdeactivities.callRecording]} />
                                <img width={20} onClick={() => setAudioModal(true)} src={openPlayCircle} alt="" />
                            }
                        </div>
                        <Modal
                            open={showAudioModal}
                        >
                            <Box sx={style}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer', marginBottom: 10 }}>
                                    <img onClick={() => setAudioModal(false)} src={iconModalCancel} alt="" />
                                </div>
                                <audio className='audioplayer' controls src={list[CubeDataset.Bdeactivities.callRecording]} />
                            </Box>
                        </Modal>
                        {list[CubeDataset.Bdeactivities.activityName] === "Generated a Payment Link" ?

                            <div className="listing-tab-text2" >
                                Amount Collected :
                                <span>{list[CubeDataset.Bdeactivities.paymentAmount]}</span> | Done by: {list[CubeDataset.Bdeactivities.createdByName]}
                                <span className="subText"> ({list[CubeDataset.Bdeactivities.createdByProfileName] ?? "BDE"}) </span>

                                <div style={{ display: 'flex', marginTop: '5px' }}>
                                    <div >
                                        Payment url:
                                        <a href={url} target="_blank" style={{ marginLeft: '5px' }}>
                                            Open Link
                                        </a>
                                    </div>
                                    <div onClick={copyUrl} style={{ color: "#4482FF", cursor: 'pointer', marginLeft: '5px' }}>
                                        <ContentCopyIcon style={{ width: '18px' }} />
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="listing-tab-text2" >
                                {list[CubeDataset.Bdeactivities.callStatus]} with {list[CubeDataset.Bdeactivities.conversationWith]}  ({list[CubeDataset.Bdeactivities.name]})
                                <span className="subText"> {list[CubeDataset.Bdeactivities.callStatus] != 'Not Connected' &&  list[CubeDataset.Bdeactivities.callDuration] > 0 ? `(${list[CubeDataset.Bdeactivities.callDuration]} Seconds)` : ''} </span> |
                                <div className='mwebTextremove'>
                                    Done by : {list[CubeDataset.Bdeactivities.createdByName]}
                                    <span className="subText"> ({list[CubeDataset.Bdeactivities.createdByProfileName] ?? "BDE"}) </span> |
                                    <span className="listing-tabsDates">{moment.utc(list[CubeDataset.Bdeactivities.startDateTime]).local().format('DD-MM-YYYY (hh:mm A)')}</span>

                                </div>
                            </div>
                        }
                        {(list[CubeDataset.Bdeactivities.comments]) && <div className="listing-tab-text2 mwebTextremove" >
                            Feedback/Comment:
                            {isReadMore ? list[CubeDataset.Bdeactivities.comments].slice(0, 150) : list[CubeDataset.Bdeactivities.comments]}
                            <span style={{ cursor: 'pointer', color: "#F45E29", fontWeight: 600 }} onClick={toggleReadMore}>
                                {list[CubeDataset.Bdeactivities.comments].length > 149 ? (isReadMore ? "... read more" : " show less") : ""}
                            </span>

                        </div>}
                    </div>
                </div>
                <div className='webTextAdd'>
                    <div >
                        Done by : {list[CubeDataset.Bdeactivities.createdByName]}
                        <span className="subText"> ({list[CubeDataset.Bdeactivities.createdByProfileName] ?? "BDE"}) </span> |
                        <span className="listing-tabsDates">{moment.utc(list[CubeDataset.Bdeactivities.startDateTime]).local().format('DD-MM-YYYY (hh:mm A)')}</span>

                    </div>
                    {(list[CubeDataset.Bdeactivities.comments]) && <div className="listing-tab-text2" >
                        Feedback/Comment:
                        {isReadMore ? list[CubeDataset.Bdeactivities.comments].slice(0, 150) : list[CubeDataset.Bdeactivities.comments]}
                        <span style={{ cursor: 'pointer', color: "#F45E29", fontWeight: 600 }} onClick={toggleReadMore}>
                            {list[CubeDataset.Bdeactivities.comments].length > 149 ? (isReadMore ? "... read more" : " show less") : ""}
                        </span>

                    </div>}
                </div>
            </div>
        </div>
    )
}

export default BdeActivityList



