import React, { useRef } from 'react'
import Iframe from 'react-iframe'
import { useLocation } from 'react-router-dom';

const CreateOrder = () => {
  const location = useLocation();
  const url = location?.state?.redirectUrl;
  const setRef = (e) =>{
    console.log(e,e?.target?.contentWindow?.location?.href)
  }

  return (
    <div>
      <Iframe onLoad={setRef} src={url} width="100%" height="100%" styles={{border:'none',minHeight:'800px'}} />
    </div>
  )

}
export default CreateOrder